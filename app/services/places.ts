import { NearbyQueryParams, NearbyResponse, Place } from "common/type/nearby";
import { ApiError } from "common/errors/error";

export async function searchNearbyPlaces({
  latitude,
  longitude,
  radius,
  maxResults,
  types
}: NearbyQueryParams): Promise<Place[]> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    radius: radius.toString(),
    ...(maxResults && { maxResults: maxResults.toString() }),
    ...(types && { types: types.join(",") })
  });

  const response = await fetch(`/api/nearby?${params}`);
  if (!response.ok) {
    const error = await response.json();
    throw new ApiError(error.message || "Failed to fetch nearby places", response.status);
  }

  const data = await response.json() as NearbyResponse;
  return data.places;
} 