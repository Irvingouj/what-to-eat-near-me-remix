interface RestaurantHeaderProps {
  name: string;
  address: string;
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  primaryType: string;
}

export function RestaurantHeader({
  name,
  address,
  rating,
  userRatingCount,
  priceLevel,
  primaryType
}: RestaurantHeaderProps) {
  // Helper function to get emoji for cuisine type
  const getCuisineEmoji = (type: string) => {
    const emojiMap: Record<string, string> = {
      restaurant: "🍽",
      japanese_restaurant: "🍜",
      chinese_restaurant: "🥢",
      italian_restaurant: "🍝",
      pizza_restaurant: "🍕",
      mexican_restaurant: "🌮",
      indian_restaurant: "🍛",
      thai_restaurant: "🥘",
      vegetarian_restaurant: "🥗",
      seafood_restaurant: "🦞",
      barbecue_restaurant: "🍖",
      fast_food_restaurant: "🍔",
      cafe: "☕",
      bakery: "🥖",
      dessert_restaurant: "🍰"
    };
    return emojiMap[type] || "🍽";
  };

  // Helper function to format price level
  const formatPriceLevel = (level?: string) => {
    switch (level) {
      case "PRICE_LEVEL_FREE": return "Free";
      case "PRICE_LEVEL_INEXPENSIVE": return "$";
      case "PRICE_LEVEL_MODERATE": return "$$";
      case "PRICE_LEVEL_EXPENSIVE": return "$$$";
      case "PRICE_LEVEL_VERY_EXPENSIVE": return "$$$$";
      default: return "$$";
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        <span>{getCuisineEmoji(primaryType)}</span>{" "}
        <span>{name}</span>
      </h2>

      <p className="text-lg text-gray-600 mb-4">{address}</p>

      <div className="flex items-center mb-2">
        {rating && (
          <>
            <span className="text-yellow-500 mr-1">⭐</span>
            <span className="mr-1">{rating.toFixed(1)}</span>
            {userRatingCount && (
              <span className="text-gray-500">({userRatingCount} reviews)</span>
            )}
            <span className="mx-2">·</span>
          </>
        )}
        <span className="text-gray-700">{formatPriceLevel(priceLevel)}</span>
      </div>
    </div>
  );
} 