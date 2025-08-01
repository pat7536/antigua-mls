// Location name to coordinates mapping for Antigua
const LOCATION_COORDINATES: Record<string, [number, number]> = {
  // Popular areas in Antigua - adjusted to be on land
  'jolly harbour': [17.065, -61.8862], // Exact land coordinates provided by user
  'st. johns': [17.12, -61.845], // Main city center
  'st johns': [17.12, -61.845],
  'saint johns': [17.12, -61.845], // Fixed the mapping for "Saint John's"
  "saint john's": [17.12, -61.845], // With apostrophe
  'english harbour': [17.0058, -61.7625],
  falmouth: [17.0167, -61.7833],
  'five islands': [17.1167, -61.8833],
  'cedar grove': [17.1333, -61.8167],
  crosbies: [17.1, -61.85],
  pigotts: [17.1167, -61.8333],
  parham: [17.0833, -61.7833],
  liberta: [17.05, -61.8],
  'old road': [17.0667, -61.8167],
  freetown: [17.0833, -61.85],
  bolans: [17.05, -61.8833],
  bolands: [17.05, -61.8833], // Same as Bolans
  urlings: [17.0667, -61.9],
  bendals: [17.1, -61.8],
  'willoughby bay': [17.0, -61.7167],
  'dickenson bay': [17.15, -61.8333],
  'runaway bay': [17.1333, -61.85],
  'half moon bay': [17.0167, -61.7167],
  'mamora bay': [17.05, -61.75],
  'nonsuch bay': [17.0716, -61.702], // Exact land coordinates provided by user
  'harbour island': [17.065, -61.8862], // Same as updated Jolly Harbour
  'the gardens': [17.065, -61.8862], // Same as updated Jolly Harbour
  antigua: [17.1274, -61.8468], // General Antigua location

  // Additional locations from unmapped properties
  'sugar ridge': [17.1, -61.78], // Sugar Ridge area
  'sugar ridge homes': [17.1, -61.78],
  seatons: [17.14, -61.81], // Seatons village
  'valley church': [17.04, -61.87], // Valley Church beach area
  'dark wood': [17.04, -61.87], // Same as Valley Church
  'pearns point': [17.01, -61.73], // Eastern coast
  'cedar valley': [17.13, -61.82], // Cedar Valley area
  'galley bay': [17.11, -61.89], // Galley Bay area
  'galley bay heights': [17.11, -61.89],
  'hodges bay': [17.14, -61.8], // Hodges Bay area
  ffreys: [17.08, -61.92], // Ffreys area
  'turtle bay': [17.09, -61.7], // Eastern turtle bay
  'johnsons point': [17.03, -61.89], // Johnson's Point
  'henry heights': [17.11, -61.86], // Henry Heights area
  'horsford hill': [17.12, -61.83], // Horsford Hill
  'big creek': [17.02, -61.75], // Big Creek area
  seaforth: [17.02, -61.75], // Same as Big Creek area
  'north finger': [17.065, -61.8862], // Part of Jolly Harbour
  'south finger': [17.065, -61.8862], // Part of Jolly Harbour
  'sunset lane': [17.065, -61.8862], // Likely in Jolly Harbour area
};

// Buffer range in degrees (roughly 0.01 degrees = ~1.1km)
const BUFFER_RANGE = 0.008; // About 800-900 meters

export function getCoordinatesFromLocation(
  location?: string
): [number, number] | null {
  if (!location) return null;

  // Normalize the location string
  const normalizedLocation = location.toLowerCase().trim();

  // Find matching coordinates
  let baseCoords: [number, number] | null = null;

  // Direct match first
  if (LOCATION_COORDINATES[normalizedLocation]) {
    baseCoords = LOCATION_COORDINATES[normalizedLocation];
  } else {
    // Partial match - check if any location contains the search term or vice versa
    for (const [locationKey, coords] of Object.entries(LOCATION_COORDINATES)) {
      if (
        locationKey.includes(normalizedLocation) ||
        normalizedLocation.includes(locationKey)
      ) {
        baseCoords = coords;
        break;
      }
    }

    // If still no match, try to extract location from longer strings
    // (like property titles that contain location names)
    if (!baseCoords) {
      for (const [locationKey, coords] of Object.entries(
        LOCATION_COORDINATES
      )) {
        const locationWords = locationKey.split(' ');
        const normalizedWords = normalizedLocation.split(/[,\s]+/);

        // Check if all words of a location are present in the text
        const allWordsPresent = locationWords.every((word) =>
          normalizedWords.some(
            (textWord) => textWord.includes(word) || word.includes(textWord)
          )
        );

        if (allWordsPresent) {
          baseCoords = coords;
          break;
        }
      }
    }
  }

  if (!baseCoords) return null;

  // Add random buffer to spread properties out
  const latBuffer = (Math.random() - 0.5) * BUFFER_RANGE;
  const lngBuffer = (Math.random() - 0.5) * BUFFER_RANGE;

  return [baseCoords[0] + latBuffer, baseCoords[1] + lngBuffer];
}

// Function to get display name for a location
export function getLocationDisplayName(location?: string): string {
  if (!location) return 'Unknown Location';

  // Capitalize first letter of each word
  return location
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
