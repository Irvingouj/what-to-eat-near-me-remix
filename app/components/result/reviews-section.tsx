import { Review } from "src/api/nearby/types";
import { useState } from "react";

interface ReviewsSectionProps {
  reviews: Review[];
}

function ReviewText({ text }: { text: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldShowButton = text.length > 150;

  return (
    <div className="text-gray-600 text-sm">
      <p className={isExpanded ? "" : "line-clamp-3"}>
        {text}
      </p>
      {shouldShowButton && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-red-600 hover:text-red-700 text-xs mt-1"
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="font-semibold text-gray-800 mb-4">Recent Reviews</h3>
      {/* Scrollable container */}
      <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="bg-gray-50 p-4 rounded-lg flex-none w-80"
          >
            <div className="flex items-center mb-2">
              <img
                src={review.authorAttribution.photoUri}
                alt={review.authorAttribution.displayName}
                className="w-8 h-8 rounded-full mr-2"
              />
              <div>
                <p className="font-medium">{review.authorAttribution.displayName}</p>
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-1">{"⭐".repeat(review.rating)}</span>
                  <span className="text-sm text-gray-500">{review.relativePublishTimeDescription}</span>
                </div>
              </div>
            </div>
            <ReviewText text={review.text.text} />
          </div>
        ))}
      </div>
    </div>
  );
} 