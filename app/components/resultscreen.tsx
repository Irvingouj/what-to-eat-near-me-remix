import { Place } from "common/type/nearby";
import { useRestaurant } from "~/context/RestaurantContext";
import { RestaurantHeader } from "./result/restaurant-header";
import { PhotoGallery } from "./result/photo-gallery";
import { FeaturesGrid } from "./result/features-grid";
import { OpeningHours } from "./result/opening-hours";
import { ContactInfo } from "./result/contact-info";
import { MapView } from "./result/map-view";
import { ReviewsSection } from "./result/reviews-section";

interface ResultScreenProps {
  place: Place;
  onOpenFilter: () => void;
}

export function ResultScreen({ place }: ResultScreenProps) {
  const { chooseRestaurant } = useRestaurant();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 pb-24 max-w-4xl w-full animate-fade-in">
        <div className="text-center mb-4">
          <p className="text-2xl text-red-600 font-medium">🎉 You should try...</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Restaurant Info */}
          <div>
            <RestaurantHeader
              name={place.displayName.text}
              address={place.formattedAddress}
              rating={place.rating}
              userRatingCount={place.userRatingCount}
              priceLevel={place.priceLevel}
              primaryType={place.primaryType}
            />

            <PhotoGallery
              photos={place.photos || []}
              placeName={place.displayName.text}
            />

            <FeaturesGrid
              delivery={place.delivery}
              takeout={place.takeout}
              dineIn={place.dineIn}
              outdoorSeating={place.outdoorSeating}
              servesBreakfast={place.servesBreakfast}
              servesLunch={place.servesLunch}
              servesDinner={place.servesDinner}
              servesBrunch={place.servesBrunch}
            />

            <OpeningHours
              regularOpeningHours={place.regularOpeningHours}
            />

            <ContactInfo
              phoneNumber={place.internationalPhoneNumber}
              websiteUrl={place.websiteUri}
            />
          </div>

          {/* Right Column - Map */}
          <div>
            <MapView
              latitude={place.location.latitude}
              longitude={place.location.longitude}
              title={place.displayName.text}
            />
          </div>
        </div>

        <ReviewsSection reviews={place.reviews || []} />
      </div>

      {/* Sticky Buttons Container */}
      <div className="fixed bottom-6 right-6 flex gap-3 z-50">


        {/* not finished 
        <button
          type="button"
          onClick={onOpenFilter}
          className="bg-white text-red-600 py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <span className="mr-1">⚙️</span> Filter
        </button> */}

        <button
          type="button"
          onClick={chooseRestaurant}
          className="bg-red-600 text-white py-3 px-6 rounded-full shadow-lg hover:bg-red-700 transition-all hover:scale-105"
        >
          <span className="mr-1">♻️</span> Choose Again
        </button>
      </div>
    </div>
  );
} 