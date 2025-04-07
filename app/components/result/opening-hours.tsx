import { RegularOpeningHours } from "common/type/nearby";
import { useState } from "react";

interface OpeningHoursProps {
  regularOpeningHours?: RegularOpeningHours;
}

const wrapDayIndex = (day: number) => {
  if (day === 0) return 6
  return day - 1
}

export function OpeningHours({ regularOpeningHours }: OpeningHoursProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!regularOpeningHours || regularOpeningHours.weekdayDescriptions.length === 0) return null;

  // Get the current day index (0 = Sunday, 1 = Monday, etc.)
  const today = new Date().getDay();

  const todayHours = regularOpeningHours.weekdayDescriptions[wrapDayIndex(today)];

  // Reorder the days array to put today first, then the rest in order
  const reorderedDays = [
    todayHours,
    ...regularOpeningHours.weekdayDescriptions.filter((day) => day !== todayHours).slice(wrapDayIndex(today + 1)),
  ];

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-800">Opening Hours</h3>
        {regularOpeningHours.openNow ? (
          <span className="text-green-600">Open now</span>
        ) : (
          <span className="text-red-600">Closed</span>
        )}
      </div>

      <div className="text-sm text-gray-600">
        {/* Always show today's hours */}
        <div className="flex items-center justify-between">
          <div className="mb-1 font-medium">{todayHours}</div>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-red-600 hover:text-red-700 text-sm flex items-center"
          >
            {isExpanded ? (
              <>
                <span className="ml-1">Hide</span>
              </>
            ) : (
              <>
                <span className="ml-1">Show</span>
              </>
            )}
          </button>
        </div>

        {/* Show other days when expanded */}
        {isExpanded && (
          <div className="mt-2 border-t pt-2">
            {reorderedDays.slice(1).map((day, index) => (
              <div key={index} className="mb-1">{day}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 