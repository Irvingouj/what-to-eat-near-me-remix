interface FeaturesGridProps {
  delivery?: boolean;
  takeout?: boolean;
  dineIn?: boolean;
  outdoorSeating?: boolean;
  servesBreakfast?: boolean;
  servesLunch?: boolean;
  servesDinner?: boolean;
  servesBrunch?: boolean;
}

export function FeaturesGrid({
  delivery,
  takeout,
  dineIn,
  outdoorSeating,
  servesBreakfast,
  servesLunch,
  servesDinner,
  servesBrunch
}: FeaturesGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2 my-4">
      {delivery && <span className="text-gray-700">🚚 Delivery</span>}
      {takeout && <span className="text-gray-700">📦 Takeout</span>}
      {dineIn && <span className="text-gray-700">🪑 Dine-in</span>}
      {outdoorSeating && <span className="text-gray-700">🌳 Outdoor Seating</span>}
      {servesBreakfast && <span className="text-gray-700">🍳 Breakfast</span>}
      {servesLunch && <span className="text-gray-700">🥪 Lunch</span>}
      {servesDinner && <span className="text-gray-700">🍽 Dinner</span>}
      {servesBrunch && <span className="text-gray-700">🥂 Brunch</span>}
    </div>
  );
} 