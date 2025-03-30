import { z } from 'zod';
import { NearbyResponse } from 'src/api/nearby/types';

// Input validation schema
const searchParamsSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().min(0).max(50000), // max 50km radius
  maxResults: z.number().min(1).max(20).optional().default(10),
  types: z.array(z.string()).optional().default(['restaurant'])
});

export const searchNearby = async (
  latitude: number, 
  longitude: number, 
  radius: number,
  options: { maxResults?: number; types?: string[] } = {}
) => {
  try {
    // Validate input parameters
    const params = searchParamsSchema.parse({
      latitude,
      longitude,
      radius,
      maxResults: options.maxResults,
      types: options.types
    });

    // Combine all field masks
    const fieldMask = [
      // Basic fields
      'places.name',
      'places.id',
      'places.types',
      'places.formattedAddress',
      'places.addressComponents',
      'places.plusCode',
      'places.location',
      'places.viewport',
      'places.googleMapsUri',
      'places.websiteUri',
      'places.adrFormatAddress',
      'places.businessStatus',
      'places.iconMaskBaseUri',
      'places.iconBackgroundColor',
      'places.displayName',
      'places.primaryType',
      'places.primaryTypeDisplayName',

      // Contact info
      'places.nationalPhoneNumber',
      'places.internationalPhoneNumber',

      // Hours
      'places.regularOpeningHours',
      'places.currentOpeningHours',
      'places.currentSecondaryOpeningHours',
      'places.regularSecondaryOpeningHours',

      // Ratings and pricing
      'places.rating',
      'places.priceLevel',
      'places.userRatingCount',

      // Features and amenities
      'places.takeout',
      'places.delivery',
      'places.dineIn',
      'places.curbsidePickup',
      'places.reservable',
      'places.servesBreakfast',
      'places.servesLunch',
      'places.servesDinner',
      'places.servesBeer',
      'places.servesWine',
      'places.servesVegetarianFood',
      'places.servesBrunch',
      'places.outdoorSeating',
      'places.liveMusic',
      'places.menuForChildren',
      'places.servesCocktails',
      'places.servesDessert',
      'places.servesCoffee',
      'places.goodForChildren',
      'places.allowsDogs',
      'places.restroom',
      'places.goodForGroups',
      'places.goodForWatchingSports',

      // Additional info
      'places.editorialSummary',
      'places.reviews',
      'places.photos',
      'places.paymentOptions',
      'places.parkingOptions',
      'places.accessibilityOptions',
      'places.containingPlaces'
    ].join(',');

    const response = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY || '',
        'X-Goog-FieldMask': fieldMask
      },
      body: JSON.stringify({
        includedTypes: params.types,
        maxResultCount: params.maxResults,
        locationRestriction: {
          circle: {
            center: {
              latitude: params.latitude,
              longitude: params.longitude
            },
            radius: params.radius
          }
        },
        rankPreference: "DISTANCE"
      })
    });

    if (!response.ok) {
      const error = await response.json() as { error?: { message: string } };
      throw new Error(`Places API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json() as NearbyResponse;
    return data.places;

  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid parameters: ${error.errors.map((e) => e.message).join(', ')}`);
    }
    throw error;
  }
};