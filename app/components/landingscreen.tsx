import { useEffect } from "react";
import { useRestaurant, useRestaurantError } from "~/context/RestaurantContext";
import { SearchRange } from "~/types/range";

interface LandingScreenProps {
  error: useRestaurantError | null;
}

export function LandingScreen({ error }: LandingScreenProps) {
  const { chooseRestaurant, updateSearchRange, searchRange } = useRestaurant();
  // check that if current url has a search param of startChoose=true, then chooseRestaurant
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const startChoose = searchParams.get("startChoose");
    if (startChoose) {
      chooseRestaurant();
    }
  }, [chooseRestaurant]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 sm:p-8 md:p-10 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight text-red-600 mb-8 md:mb-12 leading-tight">
        🍴 WHAT TO EAT<br className="md:hidden" /> NEAR ME
      </h1>

      <button
        type="button"
        onClick={() => {
          chooseRestaurant();
        }}
        className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xl sm:text-2xl font-bold py-5 sm:py-6 md:py-7 px-8 sm:px-10 md:px-12 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 flex items-center animate-bounce-slow w-auto sm:w-auto"
      >
        <span className="mr-3 text-2xl">🎲</span> CHOOSE FOR ME
      </button>

      <div className="mt-8 w-full max-w-sm sm:max-w-md">
        <label htmlFor="search-range" className="block text-sm sm:text-base font-medium text-red-600 mb-2">
          Search Range: {searchRange}m
        </label>
        <input
          type="range"
          id="search-range"
          min="500"
          max="5000"
          step="500"
          value={searchRange}
          onChange={(e) => updateSearchRange(parseInt(e.target.value) as SearchRange)}
          className="w-full h-2 sm:h-3 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-600"
        />
        <div className="flex justify-between text-sm text-red-500 mt-1">
          <span>500m</span>
          <span>5000m</span>
        </div>
      </div>

      {error ? (
        <p className="mt-6 sm:mt-8 text-sm sm:text-base text-red-600">{error.prettyMessage}</p>
      ) : (
        <p className="mt-6 sm:mt-8 text-sm sm:text-base text-gray-600">We&apos;ll use your location when you tap.</p>
      )}
    </div>
  );
} 