import { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchNearbyPlaces } from "~/services/places";
import { useGeolocation } from "~/hooks/useGeolocation";
import { EqSet } from "src/utils/eq-set";
import { ApiError } from "common/errors/error";
import { useNavigate } from "@remix-run/react";
import { SearchRange } from "~/types/range";
import { Place } from "common/type/nearby";
import { useUser } from "./UserContext";

interface Filters {
    excludeFastFood: boolean;
    vegetarianOnly: boolean;
    noPork: boolean;
    cheapOnly: boolean;
}

type PlaceWithSeen = Place & { seen?: true };

// Pure function for filtering places
function filterPlaces(places: PlaceWithSeen[], filters: Filters): PlaceWithSeen[] {
    return places.filter(place => {
        if (place.seen) {
            return false;
        }

        if (filters.excludeFastFood && place.types.includes("fast_food")) {
            return false;
        }
        if (filters.cheapOnly && place.priceLevel !== "PRICE_LEVEL_INEXPENSIVE") {
            return false;
        }
        if (filters.noPork) {
            return !place.types.some((type: string) =>
                ["pork_restaurant", "bbq_restaurant"].includes(type)
            );
        }
        if (filters.vegetarianOnly && !place.types.includes("vegetarian_restaurant")) {
            return false;
        }
        return true;
    });
}

export type useRestaurantError = {
    type: 'unknown',
    error: Error,
    prettyMessage: "An unknown error occurred"
} | {
    type: 'run-out-of-restaurants',
    prettyMessage: "No more restaurants found"
} | {
    type: 'no-restaurants-nearby',
    prettyMessage: "No restaurants found nearby"
} | {
    type: 'geolocation-error',
    error: string | null,
    prettyMessage: "An error occurred while getting your location"
} | {
    type: 'rate-limited',
    prettyMessage: "You have been rate limited. Please try again later."
}

function useRestaurantContextCreator() {
    const { loading: geoLoading, error: geoError, getLocation } = useGeolocation();
    const navigate = useNavigate();
    const [state, setState] = useState({
        currentPlace: null as PlaceWithSeen | null,
        error: null as useRestaurantError | null,
        searchRange: 1500 as SearchRange,
        filters: {
            excludeFastFood: false,
            vegetarianOnly: false,
            noPork: false,
            cheapOnly: false
        },
        places: 'not set' as 'not set' | EqSet<PlaceWithSeen>
    });

    const { currentUser } = useUser();

    // Replace searchRestaurant with React Query
    const { refetch: searchRestaurant, isFetching: isSearching, data: places } = useQuery<Place[]>({
        queryKey: ['restaurants'],
        queryFn: async () => {
            const position = await getLocation();
            if (!position) throw new Error("Location not available");
            setState(prev => ({ ...prev, loading: true, error: null }));
            const { latitude, longitude } = position.coords;
            const places = await searchNearbyPlaces({
                latitude,
                longitude,
                radius: state.searchRange,
                maxResults: 20,
                types: ["restaurant"]
            });
            return places;
        },
        enabled: false, // Don't run automatically
        staleTime: Infinity,
        gcTime: Infinity,

    });

    useEffect(() => {
        if (places) {
            setState(prev => ({
                ...prev,
                places: EqSet.fromArray(places, (a, b) => a.id === b.id)
            }));
        }
    }, [places]);

    const updateFilters = useCallback((newFilters: Filters) => {
        setState(prev => ({
            ...prev,
            filters: newFilters
        }));
    }, []);

    const chooseRestaurant = useCallback(async () => {
        if (state.currentPlace && state.places !== 'not set') {
            state.places.apply(state.currentPlace).ifValue(place => place.seen = true);
        }

        const chooseInner = (places: PlaceWithSeen[]) => {
            const filteredPlaces = filterPlaces(places, state.filters);
            if (filteredPlaces.length === 0) {
                setState(prev => ({
                    ...prev,
                    error: {
                        type: 'run-out-of-restaurants',
                        prettyMessage: "No more restaurants found"
                    }
                }));
                return;
            }

            const randomIndex = Math.floor(Math.random() * filteredPlaces.length);
            const randomPlace = filteredPlaces[randomIndex];

            setState(prev => ({
                ...prev,
                currentPlace: randomPlace,
            }));
        }


        if (state.places === 'not set') {
            if (!currentUser) {
                navigate("/auth/login");
                return;
            }

            const { data: places, error, isSuccess } = await searchRestaurant();

            if (!isSuccess || !places || places.length === 0 || error) {
                if (error) {
                    setState(prev => ({
                        ...prev,
                        error: {
                            type: 'unknown',
                            error: error,
                            prettyMessage: "An unknown error occurred"
                        }
                    }));

                    if (error instanceof ApiError && error.statusCode === 401) {
                        navigate("/auth/login");
                    }

                    if (error instanceof ApiError && error.statusCode === 429) {
                        setState(prev => ({
                            ...prev,
                            error: {
                                type: 'rate-limited',
                                prettyMessage: "You have been rate limited. Please try again later."
                            }
                        }));
                    }

                    return;
                }
            }

            if (places) {
                chooseInner(places);
            }
        } else {
            chooseInner(state.places.toArray());
        }

    }, [state.places, state.currentPlace, searchRestaurant, state.filters, navigate, currentUser]);

    const updateSearchRange = useCallback((newRange: SearchRange) => {
        setState(prev => ({
            ...prev,
            searchRange: newRange
        }));
    }, []);

    const error = useMemo(() => {
        if (geoError) {
            return {
                type: 'geolocation-error',
                error: geoError
            } as useRestaurantError;
        }
        return state.error;
    }, [geoError, state.error]);

    return {
        ...state,
        loading: geoLoading || isSearching,
        error,
        updateFilters,
        chooseRestaurant,
        updateSearchRange
    };
}

type RestaurantContextType = ReturnType<typeof useRestaurantContextCreator>;

const RestaurantContext = createContext<RestaurantContextType | null>(null);

export function RestaurantProvider({ children }: { children: ReactNode }) {
    const contextValue = useRestaurantContextCreator();

    return (
        <RestaurantContext.Provider value={contextValue}>
            {children}
        </RestaurantContext.Provider>
    );
}

export function useRestaurant() {
    const context = useContext(RestaurantContext);
    if (!context) {
        throw new Error("useRestaurant must be used within a RestaurantProvider");
    }
    return context;
} 