import { useRestaurant } from "~/context/RestaurantContext";

interface LandingScreenProps {
  error: string | null | Error;
}

export function LandingScreen({ error }: LandingScreenProps) {
  const { chooseRestaurant } = useRestaurant();
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

      {error ? (
        <p className="mt-6 text-sm text-red-600">{error instanceof Error ? error.message : error}</p>
      ) : (
        <p className="mt-6 text-sm text-gray-600">We&apos;ll use your location when you tap.</p>
      )}
    </div>
  );
} 