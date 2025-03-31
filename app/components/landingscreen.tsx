import { useEffect } from "react";
import { useRestaurant } from "~/context/RestaurantContext";
import { SearchRange } from "~/types/range";

interface LandingScreenProps {
  error: string | null | Error;
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-10">
        🍴 WHAT TO EAT NEAR ME
      </h1>

      <button
        type="button"
        onClick={() => {
          chooseRestaurant();
        }}
        className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xl font-bold py-6 px-10 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 flex items-center animate-bounce-slow"
      >
        <span className="mr-2">🎲</span> CHOOSE FOR ME
      </button>

      <div className="mt-6 w-full max-w-xs">
        <label htmlFor="search-range" className="block text-sm font-medium text-red-600 mb-1">
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
          className="w-full h-1.5 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-600"
        />
        <div className="flex justify-between text-xs text-red-500 mt-0.5">
          <span>500m</span>
          <span>5000m</span>
        </div>
      </div>

      {error ? (
        <p className="mt-6 text-sm text-red-600">{error instanceof Error ? error.message : error}</p>
      ) : (
        <p className="mt-6 text-sm text-gray-600">We&apos;ll use your location when you tap.</p>
      )}
    </div>
  );
} 