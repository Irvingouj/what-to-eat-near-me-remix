import { z } from 'zod';

// Query parameters schema
export const nearbyQuerySchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().min(0).max(50000),
  maxResults: z.coerce.number().min(1).max(20).optional(),
  types: z.string().transform(types => types.split(',')).optional()
});

// Types for TypeScript
export type NearbyQueryParams = z.infer<typeof nearbyQuerySchema>;


// Base type for objects containing text and a language code
export interface TextWithLanguage {
  text: string;
  languageCode: string;
}

// Type for individual address components
export interface AddressComponent {
  longText: string;
  shortText: string;
  types: string[];
  languageCode: string;
}

// Type for Google Plus Code
export interface PlusCode {
  globalCode: string;
  compoundCode: string;
}

// Type for Geographic Location (Latitude/Longitude)
export interface LocationCoords {
  latitude: number;
  longitude: number;
}

// Type for Viewport (bounding box)
export interface Viewport {
  low: LocationCoords;
  high: LocationCoords;
}

// Type for specific open/close time details
export interface OpeningHoursPeriodDetail {
  day: number; // 0=Sunday, 6=Saturday
  hour: number;
  minute: number;
}

// Type for a single opening hours period (open to close)
export interface OpeningHoursPeriod {
  open: OpeningHoursPeriodDetail;
  close: OpeningHoursPeriodDetail;
}

// Type for regular opening hours information
export interface RegularOpeningHours {
  openNow: boolean;
  periods: OpeningHoursPeriod[];
  weekdayDescriptions: string[];
  nextOpenTime?: string; // ISO 8601 format string, optional
}

// Type for specific date/time details in current hours
export interface YearMonthDay {
  year: number;
  month: number;
  day: number;
}

export interface CurrentOpeningHoursPeriodDetail extends OpeningHoursPeriodDetail {
  date: YearMonthDay;
  truncated?: boolean;
}

// Type for a single current opening hours period (with date)
export interface CurrentOpeningHoursPeriod {
  open: CurrentOpeningHoursPeriodDetail;
  close: CurrentOpeningHoursPeriodDetail;
}

// Type for current opening hours information (potentially includes specific dates)
export interface CurrentOpeningHours {
  openNow: boolean;
  periods: CurrentOpeningHoursPeriod[];
  weekdayDescriptions: string[];
  nextOpenTime?: string; // ISO 8601 format string, optional
  secondaryHoursType?: string; // e.g., 'DELIVERY'
  nextCloseTime?: string; // ISO 8601 format string, optional
}

// Type for secondary opening hours (like Delivery)
export interface SecondaryOpeningHours extends RegularOpeningHours {
  secondaryHoursType: string; // e.g., 'DELIVERY'
  nextCloseTime?: string; // ISO 8601 format string, optional
}

// Type for author attribution (reviews, photos)
export interface AuthorAttribution {
  displayName: string;
  uri: string; // URL
  photoUri: string; // URL
}

// Type for review text content
export interface ReviewText {
  text: string;
  languageCode: string;
}

// Type for a single review
export interface Review {
  name: string;
  relativePublishTimeDescription: string;
  rating: number; // Usually 1-5
  text: ReviewText;
  originalText: ReviewText;
  authorAttribution: AuthorAttribution;
  publishTime: string; // ISO 8601 format string
  flagContentUri: string;
  googleMapsUri: string;
}

// Type for a single photo
export interface Photo {
  name: string;
  widthPx: number;
  heightPx: number;
  authorAttributions: AuthorAttribution[];
  flagContentUri: string;
  googleMapsUri: string;
}

// Type for payment options
export interface PaymentOptions {
  acceptsCreditCards?: boolean;
  acceptsDebitCards?: boolean;
  acceptsCashOnly?: boolean;
  acceptsNfc?: boolean;
}

// Type for parking options
export interface ParkingOptions {
  paidStreetParking?: boolean;
  valetParking?: boolean;
}

// Type for accessibility options
export interface AccessibilityOptions {
  wheelchairAccessibleParking?: boolean;
  wheelchairAccessibleEntrance?: boolean;
  wheelchairAccessibleRestroom?: boolean;
  wheelchairAccessibleSeating?: boolean;
}

// Type for a place contained within another (e.g., restaurant inside a hotel)
export interface ContainingPlace {
  name: string;
  id: string;
}

// Price Level Enum/Type
export type PriceLevel =
  | "PRICE_LEVEL_FREE"
  | "PRICE_LEVEL_INEXPENSIVE"
  | "PRICE_LEVEL_MODERATE"
  | "PRICE_LEVEL_EXPENSIVE"
  | "PRICE_LEVEL_VERY_EXPENSIVE"
  | string; // Fallback

// Business Status Enum/Type
export type BusinessStatus =
  | "OPERATIONAL"
  | "CLOSED_TEMPORARILY"
  | "CLOSED_PERMANENTLY"
  | string; // Fallback

// Type for the main Place object
export interface Place {
  name: string;
  id: string;
  types: string[];
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  formattedAddress: string;
  addressComponents: AddressComponent[];
  plusCode: PlusCode;
  location: LocationCoords;
  viewport: Viewport;
  rating?: number;
  googleMapsUri: string;
  websiteUri?: string;
  regularOpeningHours?: RegularOpeningHours;
  adrFormatAddress: string;
  businessStatus: BusinessStatus;
  priceLevel?: PriceLevel;
  userRatingCount?: number;
  iconMaskBaseUri: string;
  iconBackgroundColor: string;
  displayName: TextWithLanguage;
  primaryTypeDisplayName: TextWithLanguage;
  takeout?: boolean;
  delivery?: boolean;
  dineIn?: boolean;
  curbsidePickup?: boolean;
  reservable?: boolean;
  servesBreakfast?: boolean;
  servesLunch?: boolean;
  servesDinner?: boolean;
  servesBeer?: boolean;
  servesWine?: boolean;
  servesVegetarianFood?: boolean;
  servesBrunch?: boolean;
  currentOpeningHours?: CurrentOpeningHours;
  currentSecondaryOpeningHours?: CurrentOpeningHours[];
  regularSecondaryOpeningHours?: SecondaryOpeningHours[];
  primaryType: string;
  editorialSummary?: TextWithLanguage;
  reviews?: Review[];
  photos?: Photo[];
  outdoorSeating?: boolean;
  liveMusic?: boolean;
  menuForChildren?: boolean;
  servesCocktails?: boolean;
  servesDessert?: boolean;
  servesCoffee?: boolean;
  goodForChildren?: boolean;
  allowsDogs?: boolean;
  restroom?: boolean;
  goodForGroups?: boolean;
  goodForWatchingSports?: boolean;
  paymentOptions?: PaymentOptions;
  parkingOptions?: ParkingOptions;
  accessibilityOptions?: AccessibilityOptions;
  containingPlaces?: ContainingPlace[];
}

// Response type matching the service response
export interface NearbyResponse {
  places: Array<Place>;
} 