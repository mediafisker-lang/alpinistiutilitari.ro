const PLACES_TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";
const PLACES_DETAILS_BASE_URL = "https://places.googleapis.com/v1/places";

export type GooglePlaceSearchItem = {
  id?: string;
  name?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  googleMapsUri?: string;
  location?: { latitude?: number; longitude?: number };
  primaryType?: string;
  types?: string[];
};

export type GooglePlaceDetails = GooglePlaceSearchItem & {
  nationalPhoneNumber?: string;
  websiteUri?: string;
  rating?: number;
  userRatingCount?: number;
  regularOpeningHours?: {
    weekdayDescriptions?: string[];
  };
  addressComponents?: Array<{
    longText?: string;
    shortText?: string;
    types?: string[];
  }>;
};

function getHeaders(fieldMask: string) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("Lipsește GOOGLE_MAPS_API_KEY.");
  }

  return {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey,
    "X-Goog-FieldMask": fieldMask,
  };
}

export async function searchPlacesByText(textQuery: string) {
  const response = await fetch(PLACES_TEXT_SEARCH_URL, {
    method: "POST",
    headers: getHeaders(
      "places.id,places.displayName,places.formattedAddress,places.location,places.googleMapsUri,places.primaryType,places.types",
    ),
    body: JSON.stringify({
      textQuery,
      languageCode: "ro",
      regionCode: "RO",
      pageSize: 20,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`Text Search Places API a răspuns cu ${response.status}. ${details}`);
  }

  const data = (await response.json()) as { places?: GooglePlaceSearchItem[] };
  return data.places ?? [];
}

export async function getPlaceDetails(placeId: string) {
  const response = await fetch(`${PLACES_DETAILS_BASE_URL}/${placeId}`, {
    headers: getHeaders(
      "id,displayName,formattedAddress,location,googleMapsUri,primaryType,types,nationalPhoneNumber,websiteUri,rating,userRatingCount,regularOpeningHours,addressComponents",
    ),
    cache: "no-store",
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`Place Details API a răspuns cu ${response.status}. ${details}`);
  }

  return (await response.json()) as GooglePlaceDetails;
}

export function buildImportQueries(location: {
  countyName?: string;
  cityName?: string;
  customQuery?: string;
}) {
  const area = location.cityName ?? location.countyName ?? "Romania";
  if (location.customQuery) return [location.customQuery];

  return [
    `alpinism utilitar ${area}`,
    `alpinisti utilitari ${area}`,
    `alpin utilitar ${area}`,
    `lucrari la inaltime ${area}`,
    `spalare geamuri la inaltime ${area}`,
    `spalare geamuri ${area}`,
    `spalare fatade la inaltime ${area}`,
    `curatare fatade ${area}`,
    `montaj bannere ${area}`,
    `toaletare copaci ${area}`,
    `toaletare arbori ${area}`,
    `reparatii fatade ${area}`,
  ];
}
