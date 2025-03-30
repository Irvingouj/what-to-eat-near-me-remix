import { NearbyResponse } from "src/api/nearby/types";
import { Place } from "src/api/nearby/types";
import { HttpError } from "src/api/errors/error";
export async function searchNearbyPlaces(
  latitude: number,
  longitude: number,
  radius: number = 1500,
  options: {
    maxResults?: number;
    types?: string[];
  } = {}
): Promise<Place[]> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    radius: radius.toString(),
    ...(options.maxResults && { maxResults: options.maxResults.toString() }),
    ...(options.types && { types: options.types.join(",") })
  });

  const response = await fetch(`/api/nearby?${params}`);
  if (!response.ok) {
    const error = await response.json();
    throw new HttpError(error.message || "Failed to fetch nearby places", response.status);
  }

  const data = await response.json() as NearbyResponse;
  return data.places;
} 