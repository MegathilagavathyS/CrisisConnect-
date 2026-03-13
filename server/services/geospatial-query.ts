interface GeospatialEntity {
  token: string;
  canonicalName: string;
  table: 'Country' | 'City' | 'State';
  confidence: number;
}

interface CanonicalPlace {
  name: string;
  table: 'Country' | 'City' | 'State';
  aliases: string[];
}

// Canonical place name tables
const CANONICAL_PLACES: CanonicalPlace[] = [
  // Countries
  { name: "india", table: "Country", aliases: ["india", "bharat", "hindustan"] },
  { name: "united states", table: "Country", aliases: ["united states", "usa", "america", "us"] },
  { name: "united kingdom", table: "Country", aliases: ["united kingdom", "uk", "britain", "england"] },
  { name: "canada", table: "Country", aliases: ["canada"] },
  { name: "australia", table: "Country", aliases: ["australia"] },
  { name: "new zealand", table: "Country", aliases: ["new zealand", "new-zealand", "nz"] },
  { name: "japan", table: "Country", aliases: ["japan"] },
  { name: "china", table: "Country", aliases: ["china"] },
  { name: "germany", table: "Country", aliases: ["germany"] },
  { name: "france", table: "Country", aliases: ["france"] },
  
  // US States
  { name: "california", table: "State", aliases: ["california", "ca", "cali"] },
  { name: "texas", table: "State", aliases: ["texas", "tx"] },
  { name: "new york", table: "State", aliases: ["new york", "ny", "newyork"] },
  { name: "florida", table: "State", aliases: ["florida", "fl"] },
  { name: "washington", table: "State", aliases: ["washington", "wa"] },
  
  // States (primarily Indian states)
  { name: "maharashtra", table: "State", aliases: ["maharashtra", "mh", "maha"] },
  { name: "tamil nadu", table: "State", aliases: ["tamil nadu", "tn", "tamilnadu"] },
  { name: "karnataka", table: "State", aliases: ["karnataka", "ka", "karnatak"] },
  { name: "west bengal", table: "State", aliases: ["west bengal", "wb", "bengal"] },
  { name: "uttar pradesh", table: "State", aliases: ["uttar pradesh", "up", "uttarpradesh"] },
  { name: "gujarat", table: "State", aliases: ["gujarat", "gj"] },
  { name: "rajasthan", table: "State", aliases: ["rajasthan", "rj"] },
  { name: "madhya pradesh", table: "State", aliases: ["madhya pradesh", "mp", "madhyapradesh"] },
  { name: "kerala", table: "State", aliases: ["kerala", "kl"] },
  { name: "andhra pradesh", table: "State", aliases: ["andhra pradesh", "ap", "andhrapradesh"] },
  { name: "telangana", table: "State", aliases: ["telangana", "ts"] },
  { name: "delhi", table: "State", aliases: ["delhi", "dl", "new delhi"] },
  { name: "punjab", table: "State", aliases: ["punjab", "pb"] },
  { name: "haryana", table: "State", aliases: ["haryana", "hr"] },
  { name: "bihar", table: "State", aliases: ["bihar", "br"] },
  { name: "odisha", table: "State", aliases: ["odisha", "orissa", "or"] },
  { name: "assam", table: "State", aliases: ["assam", "as"] },
  
  // Cities
  { name: "ahmedabad", table: "City", aliases: ["ahmedabad", "ahemdabad", "ahmadabad", "amdavad"] },
  { name: "mumbai", table: "City", aliases: ["mumbai", "bombay", "bumbai"] },
  { name: "delhi", table: "City", aliases: ["delhi", "new delhi", "dilli"] },
  { name: "bangalore", table: "City", aliases: ["bangalore", "bengaluru", "bengalooru", "blr"] },
  { name: "chennai", table: "City", aliases: ["chennai", "madras", "chenai"] },
  { name: "kolkata", table: "City", aliases: ["kolkata", "calcutta", "kolkatta"] },
  { name: "hyderabad", table: "City", aliases: ["hyderabad", "hyd", "haiderabad"] },
  { name: "pune", table: "City", aliases: ["pune", "poona"] },
  { name: "surat", table: "City", aliases: ["surat", "soorat"] },
  { name: "jaipur", table: "City", aliases: ["jaipur", "jaypur"] },
  { name: "lucknow", table: "City", aliases: ["lucknow", "laknau"] },
  { name: "kanpur", table: "City", aliases: ["kanpur", "kanpoor"] },
  { name: "nagpur", table: "City", aliases: ["nagpur", "nagpoor"] },
  { name: "indore", table: "City", aliases: ["indore", "indoore"] },
  { name: "thane", table: "City", aliases: ["thane", "thana"] },
  { name: "bhopal", table: "City", aliases: ["bhopal", "bhoopal"] },
  { name: "visakhapatnam", table: "City", aliases: ["visakhapatnam", "vizag", "vizagapatnam"] },
  { name: "patna", table: "City", aliases: ["patna", "patana"] },
  { name: "vadodara", table: "City", aliases: ["vadodara", "baroda"] },
  { name: "agra", table: "City", aliases: ["agra", "aggra"] },
  { name: "varanasi", table: "City", aliases: ["varanasi", "benares", "kashi"] },
  { name: "coimbatore", table: "City", aliases: ["coimbatore", "kovai"] },
  { name: "madurai", table: "City", aliases: ["madurai", "madhurai"] },
  { name: "vijayawada", table: "City", aliases: ["vijayawada", "vijaywada"] },
  { name: "mysore", table: "City", aliases: ["mysore", "mysuru"] },
];

// Non-place words to filter out
const NON_PLACE_WORDS = new Set([
  // Common English words
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'man', 'men', 'put', 'say', 'she', 'too', 'use',
  'which', 'following', 'saw', 'highest', 'average', 'temperature', 'january', 'show', 'me', 'graph', 'rainfall', 'month', 'october', 'entire', 'of', 'in', 'or', 'to', 'a', 'an',
  
  // Question words
  'what', 'where', 'when', 'why', 'how', 'which', 'who', 'whom', 'whose',
  
  // Numbers and time
  'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december',
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
  'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth',
  
  // Common adjectives and adverbs
  'highest', 'lowest', 'average', 'maximum', 'minimum', 'total', 'current', 'recent', 'latest', 'critical', 'urgent', 'emergency',
  
  // Verbs
  'show', 'display', 'find', 'search', 'look', 'check', 'analyze', 'compare', 'report', 'tell', 'give', 'provide',
  
  // Measurement units
  'celsius', 'fahrenheit', 'degrees', 'percent', 'percentage', 'mm', 'cm', 'inches', 'feet', 'meters', 'kilometers'
]);

// Fuzzy matching using Levenshtein distance
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i;
  }
  
  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j;
  }
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
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
  return maxLength === 0 ? 1 : (maxLength - distance) / maxLength;
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

// Enhanced text preprocessing
function preprocessText(text: string): string[] {
  // Split by various delimiters and clean up
  const tokens = text.toLowerCase()
    .replace(/[^\w\s\-]/g, ' ') // Replace punctuation with space
    .split(/\s+/)
    .filter(token => token.length > 0)
    .filter(token => !NON_PLACE_WORDS.has(token));
  
  return tokens;
}

// Main geospatial entity recognition function
export function identifyGeospatialEntities(text: string): GeospatialEntity[] {
  const tokens = preprocessText(text);
  const entities: GeospatialEntity[] = [];
  const processedTokens = new Set<string>();
  
  // Check multi-word phrases first (2-3 words)
  for (let i = 0; i < tokens.length; i++) {
    if (processedTokens.has(tokens[i])) continue;
    
    // Check 3-word phrases
    if (i < tokens.length - 2) {
      const threeWordPhrase = `${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`;
      for (const place of CANONICAL_PLACES) {
        for (const alias of place.aliases) {
          if (alias === threeWordPhrase) {
            entities.push({
              token: threeWordPhrase,
              canonicalName: place.name,
              table: place.table,
              confidence: 0.95
            });
            processedTokens.add(tokens[i]);
            processedTokens.add(tokens[i + 1]);
            processedTokens.add(tokens[i + 2]);
            break;
          }
        }
      }
      if (processedTokens.has(tokens[i])) continue;
    }
    
    // Check 2-word phrases
    if (i < tokens.length - 1) {
      const twoWordPhrase = `${tokens[i]} ${tokens[i + 1]}`;
      for (const place of CANONICAL_PLACES) {
        for (const alias of place.aliases) {
          if (alias === twoWordPhrase) {
            entities.push({
              token: twoWordPhrase,
              canonicalName: place.name,
              table: place.table,
              confidence: 0.90
            });
            processedTokens.add(tokens[i]);
            processedTokens.add(tokens[i + 1]);
            break;
          }
        }
      }
      if (processedTokens.has(tokens[i])) continue;
    }
  }
  
  // Check single words with fuzzy matching
  for (const token of tokens) {
    if (processedTokens.has(token)) continue;
    
    let bestMatch: { place: CanonicalPlace; confidence: number } | null = null;
    
    for (const place of CANONICAL_PLACES) {
      for (const alias of place.aliases) {
        const similarity = calculateSimilarity(token, alias);
        if (similarity > 0.7 && (!bestMatch || similarity > bestMatch.confidence)) {
          bestMatch = { place, confidence: similarity };
        }
      }
    }
    
    if (bestMatch) {
      entities.push({
        token,
        canonicalName: bestMatch.place.name,
        table: bestMatch.place.table,
        confidence: bestMatch.confidence * 0.85 // Reduce confidence for fuzzy matches
      });
    }
  }
  
  // Remove duplicates and sort by confidence
  const uniqueEntities = entities.filter((entity, index, self) => 
    index === self.findIndex(e => e.canonicalName === entity.canonicalName)
  ).sort((a, b) => b.confidence - a.confidence);
  
  return uniqueEntities;
}

// Helper function to format output as specified
export function formatGeospatialOutput(text: string): string {
  const entities = identifyGeospatialEntities(text);
  
  if (entities.length === 0) {
    return "No geospatial entities found in the input text.";
  }
  
  return entities.map(entity => 
    `Token: ${entity.token}, Canonical name: ${entity.canonicalName}, table: ${entity.table}`
  ).join('\n');
}

// Export for testing
export { CANONICAL_PLACES, NON_PLACE_WORDS };
