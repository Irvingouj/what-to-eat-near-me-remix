import { useState, useEffect } from "react";
import type { MetaFunction } from "@remix-run/node";
import { LoadingScreen } from "~/components/loadingscreen";
import { ResultScreen } from "~/components/resultscreen";
import { FilterModal } from "~/components/filtermodal";
import { LandingScreen } from "~/components/landingscreen";
import { RestaurantProvider, useRestaurant } from "~/context/RestaurantContext";

export const meta: MetaFunction = () => {
  return [
    { title: "What to Eat Near Me" },
    { name: "description", content: "Find great places to eat near you!" },
  ];
};

function IndexContent() {
  const [currentScreen, setCurrentScreen] = useState<"landing" | "loading" | "result">("landing");
  const [showFilter, setShowFilter] = useState(false);

  const {
    currentPlace,
    error,
    loading,
    filters,
    chooseRestaurant,
    updateFilters
  } = useRestaurant();

  useEffect(() => {
    if (error) {
      setCurrentScreen("landing");
    } else if (currentPlace) {
      setCurrentScreen("result");
    }
  }, [loading, error, currentPlace]);

  const handleOpenFilter = () => {
    setShowFilter(true);
  };

  const handleCloseFilter = () => {
    setShowFilter(false);
  };

  const handleApplyFilter = (newFilters: typeof filters) => {
    updateFilters(newFilters);
    setShowFilter(false);
    chooseRestaurant();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-red-100">
      {currentScreen === "landing" && (
        <LandingScreen error={error} />
      )}
      {currentScreen === "loading" && <LoadingScreen />}
      {currentScreen === "result" && currentPlace && (
        <ResultScreen
          place={currentPlace}
          onOpenFilter={handleOpenFilter}
        />
      )}
      {showFilter && (
        <FilterModal
          filters={filters}
          onClose={handleCloseFilter}
          onApply={handleApplyFilter}
        />
      )}
    </div>
  );
}

export default function Index() {
  return (
    <RestaurantProvider>
      <IndexContent />
    </RestaurantProvider>
  );
}
