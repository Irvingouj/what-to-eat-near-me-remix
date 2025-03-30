import { useCallback, useState } from "react";

interface GeolocationState {
  loading: boolean;
  error: string | null;
  position: GeolocationPosition | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
    position: null
  });

  const getLocation = useCallback(() => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    return new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState({
            loading: false,
            error: null,
            position
          });
          resolve(position);
        },
        () => {
          setState({
            loading: false,
            error: "Please enable location access to find restaurants near you",
            position: null
          });
          reject(new Error("Please enable location access to find restaurants near you"));
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    });
  }, []);

  return {
    ...state,
    getLocation
  };
} 