import { useState, useEffect } from "react";
import { type MetaFunction, useLoaderData } from "@remix-run/react";
import { LoadingScreen } from "~/components/loadingscreen";
import { ResultScreen } from "~/components/resultscreen";
import { FilterModal } from "~/components/filtermodal";
import { LandingScreen } from "~/components/landingscreen";
import { RestaurantProvider, useRestaurant } from "~/context/RestaurantContext";
import { authenticator } from "common/auth/auth.server";
import { db } from "common/db";
import { users } from "common/db/schema";
import { eq } from "drizzle-orm";
import { UserProvider } from "~/context/UserContext";
import { LoaderFunctionArgs } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "What to Eat Near Me - Restaurant Finder" },
    { name: "description", content: "Let us help you decide where to eat! Our smart restaurant finder uses your location to suggest great places to eat nearby." },
    // Open Graph
    { property: "og:title", content: "What to Eat Near Me - Restaurant Finder" },
    { property: "og:description", content: "Let us help you decide where to eat! Our smart restaurant finder uses your location to suggest great places to eat nearby." },
    // Twitter
    { name: "twitter:title", content: "What to Eat Near Me - Restaurant Finder" },
    { name: "twitter:description", content: "Let us help you decide where to eat! Our smart restaurant finder uses your location to suggest great places to eat nearby." },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const cookie = await authenticator.isAuthenticated(request);
  if (cookie?.id) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, cookie.id),
    });

    return Response.json({ user });
  }

  return Response.json({});
}

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
  const { user } = useLoaderData<typeof loader>();
  return (
    <UserProvider user={user}>
      <RestaurantProvider>
        <IndexContent />
      </RestaurantProvider>
    </UserProvider>
  );
}
