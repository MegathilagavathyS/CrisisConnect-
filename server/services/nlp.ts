interface ExtractedLocation {
  original: string;
  standardized: string;
  confidence: number;
  state?: string;
}

// Common abbreviations and their standardized forms
const LOCATION_MAPPINGS = new Map([
  // Indian states
  ["tn", "Tamil Nadu"],
  ["tamilnadu", "Tamil Nadu"],
  ["tamil nadu", "Tamil Nadu"],
  ["dl", "Delhi"],
  ["new dlhi", "New Delhi"],
  ["new delhi", "New Delhi"],
  ["mh", "Maharashtra"],
  ["maharashtra", "Maharashtra"],
  ["wb", "West Bengal"],
  ["west bengal", "West Bengal"],
  ["kl", "Kerala"],
  ["kerala", "Kerala"],
  ["ka", "Karnataka"],
  ["karnataka", "Karnataka"],
  
  // Cities
  ["mumbai", "Mumbai"],
  ["bombay", "Mumbai"],
  ["calcutta", "Kolkata"],
  ["kolkata", "Kolkata"],
  ["bangalore", "Bangalore"],
  ["bengaluru", "Bangalore"],
  ["chennai", "Chennai"],
  ["madras", "Chennai"],
  ["hyderabad", "Hyderabad"],
  ["pune", "Pune"],
  ["ahmedabad", "Ahmedabad"],
  
  // Multilingual examples (simplified - in real implementation, use proper NLP library)
  ["तमिलनाडु", "Tamil Nadu"],
  ["दिल्ली", "Delhi"],
  ["मुंबई", "Mumbai"],
  ["চেন্নাই", "Chennai"],
  ["કોલકાતા", "Kolkata"]
]);

// Simple fuzzy matching using Levenshtein distance
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i += 1) {
    matrix[0][i] = i;
  }
  
  for (let j = 0; j <= str2.length; j += 1) {
    matrix[j][0] = j;
  }
  
  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator, // substitution
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}

function calculateSimilarity(str1: string, str2: string): number {
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  const maxLength = Math.max(str1.length, str2.length);
  return (maxLength - distance) / maxLength;
}

function findBestMatch(input: string, candidates: string[]): { match: string; confidence: number } | null {
  let bestMatch = "";
  let bestScore = 0;
  
  for (const candidate of candidates) {
    const similarity = calculateSimilarity(input, candidate);
    if (similarity > bestScore && similarity > 0.6) { // 60% threshold
      bestScore = similarity;
      bestMatch = candidate;
    }
  }
  
  return bestScore > 0.6 ? { match: bestMatch, confidence: bestScore } : null;
}

export function extractLocationsFromText(text: string): ExtractedLocation[] {
  const locations: ExtractedLocation[] = [];
  const words = text.toLowerCase().split(/[\s,\.;!?]+/).filter(word => word.length > 1);
  
  // Check direct mappings first
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const twoWordPhrase = i < words.length - 1 ? `${word} ${words[i + 1]}` : "";
    
    // Check two-word phrases first
    if (twoWordPhrase && LOCATION_MAPPINGS.has(twoWordPhrase)) {
      locations.push({
        original: twoWordPhrase,
        standardized: LOCATION_MAPPINGS.get(twoWordPhrase)!,
        confidence: 0.95,
      });
      i++; // Skip next word as it's part of the phrase
      continue;
    }
    
    // Check single words
    if (LOCATION_MAPPINGS.has(word)) {
      locations.push({
        original: word,
        standardized: LOCATION_MAPPINGS.get(word)!,
        confidence: 0.90,
      });
    }
  }
  
  // Fuzzy matching for unmatched potential locations
  const locationNames = Array.from(LOCATION_MAPPINGS.values());
  const potentialLocations = words.filter(word => 
    word.length > 2 && 
    !locations.some(loc => loc.original.includes(word))
  );
  
  for (const potential of potentialLocations) {
    const match = findBestMatch(potential, locationNames);
    if (match && !locations.some(loc => loc.standardized === match.match)) {
      locations.push({
        original: potential,
        standardized: match.match,
        confidence: match.confidence,
      });
    }
  }
  
  return locations;
}

export function getLocationCoordinates(locationName: string): { latitude: number; longitude: number } | null {
  // Simplified coordinate lookup - in real implementation, use geocoding API
  const coordinates = new Map([
    ["New Delhi", { latitude: 28.6139, longitude: 77.2090 }],
    ["Delhi", { latitude: 28.6139, longitude: 77.2090 }],
    ["Mumbai", { latitude: 19.0760, longitude: 72.8777 }],
    ["Chennai", { latitude: 13.0827, longitude: 80.2707 }],
    ["Kolkata", { latitude: 22.5726, longitude: 88.3639 }],
    ["Bangalore", { latitude: 12.9716, longitude: 77.5946 }],
    ["Hyderabad", { latitude: 17.3850, longitude: 78.4867 }],
    ["Pune", { latitude: 18.5204, longitude: 73.8567 }],
    ["Ahmedabad", { latitude: 23.0225, longitude: 72.5714 }],
    ["Tamil Nadu", { latitude: 11.1271, longitude: 78.6569 }],
    ["Maharashtra", { latitude: 19.7515, longitude: 75.7139 }],
    ["West Bengal", { latitude: 22.9868, longitude: 87.8550 }],
    ["Karnataka", { latitude: 15.3173, longitude: 75.7139 }],
    ["Kerala", { latitude: 10.8505, longitude: 76.2711 }],
  ]);
  
  return coordinates.get(locationName) || null;
}

export function calculateResourceSeverity(resources: Array<{ resourceType: string; currentAvailable: number; totalCapacity: number; criticalThreshold: number }>): string {
  if (resources.length === 0) return "unknown";
  
  const criticalCount = resources.filter(r => r.currentAvailable <= r.criticalThreshold).length;
  const warningCount = resources.filter(r => r.currentAvailable <= r.totalCapacity * 0.5 && r.currentAvailable > r.criticalThreshold).length;
  
  if (criticalCount >= 2) return "critical";
  if (criticalCount >= 1 || warningCount >= 2) return "warning";
  return "stable";
}
