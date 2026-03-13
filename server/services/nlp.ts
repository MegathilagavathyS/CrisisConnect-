interface ExtractedLocation {
  original: string;
  standardized: string;
  confidence: number;
  state?: string;
}

// Comprehensive multilingual location mappings
const LOCATION_MAPPINGS = new Map([
  // Indian states - English variations
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
  ["ap", "Andhra Pradesh"],
  ["andhra pradesh", "Andhra Pradesh"],
  ["ts", "Telangana"],
  ["telangana", "Telangana"],
  ["up", "Uttar Pradesh"],
  ["uttar pradesh", "Uttar Pradesh"],
  ["mp", "Madhya Pradesh"],
  ["madhya pradesh", "Madhya Pradesh"],
  ["rj", "Rajasthan"],
  ["rajasthan", "Rajasthan"],
  ["gj", "Gujarat"],
  ["gujarat", "Gujarat"],
  ["pb", "Punjab"],
  ["punjab", "Punjab"],
  ["hr", "Haryana"],
  ["haryana", "Haryana"],
  ["jk", "Jammu and Kashmir"],
  ["jammu and kashmir", "Jammu and Kashmir"],
  ["hp", "Himachal Pradesh"],
  ["himachal pradesh", "Himachal Pradesh"],
  ["or", "Odisha"],
  ["odisha", "Odisha"],
  ["orissa", "Odisha"],
  ["jh", "Jharkhand"],
  ["jharkhand", "Jharkhand"],
  ["cg", "Chhattisgarh"],
  ["chhattisgarh", "Chhattisgarh"],
  ["br", "Bihar"],
  ["bihar", "Bihar"],
  ["as", "Assam"],
  ["assam", "Assam"],
  
  // Cities - English variations and common misspellings
  ["mumbai", "Mumbai"],
  ["bombay", "Mumbai"],
  ["calcutta", "Kolkata"],
  ["kolkata", "Kolkata"],
  ["bangalore", "Bangalore"],
  ["bengaluru", "Bangalore"],
  ["blr", "Bangalore"],
  ["chennai", "Chennai"],
  ["madras", "Chennai"],
  ["hyderabad", "Hyderabad"],
  ["hyd", "Hyderabad"],
  ["pune", "Pune"],
  ["ahmedabad", "Ahmedabad"],
  ["surat", "Surat"],
  ["kochi", "Kochi"],
  ["cochin", "Kochi"],
  ["coimbatore", "Coimbatore"],
  ["lucknow", "Lucknow"],
  ["kanpur", "Kanpur"],
  ["nagpur", "Nagpur"],
  ["indore", "Indore"],
  ["thane", "Thane"],
  ["bhopal", "Bhopal"],
  ["visakhapatnam", "Visakhapatnam"],
  ["vizag", "Visakhapatnam"],
  ["patna", "Patna"],
  ["vadodara", "Vadodara"],
  ["ghaziabad", "Ghaziabad"],
  ["ludhiana", "Ludhiana"],
  ["agra", "Agra"],
  ["nashik", "Nashik"],
  ["faridabad", "Faridabad"],
  ["meerut", "Meerut"],
  ["rajkot", "Rajkot"],
  ["kalyan", "Kalyan"],
  ["vasai", "Vasai"],
  ["varanasi", "Varanasi"],
  ["srinagar", "Srinagar"],
  ["aurangabad", "Aurangabad"],
  ["dhanbad", "Dhanbad"],
  ["amritsar", "Amritsar"],
  ["navi mumbai", "Navi Mumbai"],
  ["allahabad", "Prayagraj"],
  ["prayagraj", "Prayagraj"],
  ["guwahati", "Guwahati"],
  ["chandigarh", "Chandigarh"],
  ["jodhpur", "Jodhpur"],
  ["madurai", "Madurai"],
  ["raipur", "Raipur"],
  ["kota", "Kota"],
  ["gwalior", "Gwalior"],
  ["vijayawada", "Vijayawada"],
  ["mysore", "Mysore"],
  ["mysuru", "Mysore"],
  
  // Hindi/Devanagari script
  ["तमिलनाडु", "Tamil Nadu"],
  ["तमिल नाडु", "Tamil Nadu"],
  ["दिल्ली", "Delhi"],
  ["नई दिल्ली", "New Delhi"],
  ["मुंबई", "Mumbai"],
  ["कोलकाता", "Kolkata"],
  ["कलकत्ता", "Kolkata"],
  ["बेंगलुरु", "Bangalore"],
  ["बैंगलोर", "Bangalore"],
  ["चेन्नई", "Chennai"],
  ["मद्रास", "Chennai"],
  ["हैदराबाद", "Hyderabad"],
  ["पुणे", "Pune"],
  ["अहमदाबाद", "Ahmedabad"],
  ["महाराष्ट्र", "Maharashtra"],
  ["पश्चिम बंगाल", "West Bengal"],
  ["केरल", "Kerala"],
  ["कर्नाटक", "Karnataka"],
  ["आंध्र प्रदेश", "Andhra Pradesh"],
  ["तेलंगाना", "Telangana"],
  ["उत्तर प्रदेश", "Uttar Pradesh"],
  ["मध्य प्रदेश", "Madhya Pradesh"],
  ["राजस्थान", "Rajasthan"],
  ["गुजरात", "Gujarat"],
  ["पंजाब", "Punjab"],
  ["हरियाणा", "Haryana"],
  ["जम्मू और कश्मीर", "Jammu and Kashmir"],
  ["हिमाचल प्रदेश", "Himachal Pradesh"],
  ["ओडिशा", "Odisha"],
  ["झारखंड", "Jharkhand"],
  ["छत्तीसगढ़", "Chhattisgarh"],
  ["बिहार", "Bihar"],
  ["असम", "Assam"],
  
  // Bengali script
  ["পশ্চিমবঙ্গ", "West Bengal"],
  ["কলকাতা", "Kolkata"],
  ["চেন্নাই", "Chennai"],
  ["মুম্বাই", "Mumbai"],
  ["দিল্লি", "Delhi"],
  ["নতুন দিল্লি", "New Delhi"],
  ["বাংলাদেশ", "Bangladesh"],
  ["আসাম", "Assam"],
  
  // Tamil script
  ["தமிழ்நாடு", "Tamil Nadu"],
  ["சென்னை", "Chennai"],
  ["கோவை", "Coimbatore"],
  ["மதுரை", "Madurai"],
  ["திருச்சி", "Tiruchirappalli"],
  ["சேலம்", "Salem"],
  ["திருநெல்வேலி", "Tirunelveli"],
  ["கேரளா", "Kerala"],
  ["கர்நாடகா", "Karnataka"],
  ["ஆந்திரப்பிரதேசம்", "Andhra Pradesh"],
  
  // Telugu script
  ["తెలంగాణ", "Telangana"],
  ["ఆంధ్రప్రదేశ్", "Andhra Pradesh"],
  ["హైదరాబాద్", "Hyderabad"],
  ["విజయవాడ", "Vijayawada"],
  ["విశాఖపట్నం", "Visakhapatnam"],
  ["తిరుపతి", "Tirupati"],
  ["కర్నాటక", "Karnataka"],
  ["తమిళనాడు", "Tamil Nadu"],
  
  // Gujarati script
  ["ગુજરાત", "Gujarat"],
  ["અમદાવાદ", "Ahmedabad"],
  ["સુરત", "Surat"],
  ["વડોદરા", "Vadodara"],
  ["રાજકોટ", "Rajkot"],
  ["મહારાષ્ટ્ર", "Maharashtra"],
  ["મુંબઈ", "Mumbai"],
  ["કોલકાતા", "Kolkata"],
  
  // Kannada script
  ["ಕರ್ನಾಟಕ", "Karnataka"],
  ["ಬೆಂಗಳೂರು", "Bangalore"],
  ["ಮೈಸೂರು", "Mysore"],
  ["ಹುಬ್ಳಿ", "Hubli"],
  ["ಮಂಗಳೂರು", "Mangalore"],
  ["ತಮಿಳುನಾಡು", "Tamil Nadu"],
  ["ಕೇರಳ", "Kerala"],
  ["ಆಂಧ್ರಪ್ರದೇಶ", "Andhra Pradesh"],
  
  // Malayalam script
  ["കേരളം", "Kerala"],
  ["കൊച്ചി", "Kochi"],
  ["കോഴിക്കോട്", "Kozhikode"],
  ["തിരുവനന്തപുരം", "Thiruvananthapuram"],
  ["കണ്ണൂർ", "Kannur"],
  ["തൃശൂർ", "Thrissur"],
  ["കർണാടക", "Karnataka"],
  ["തമിഴ്നാട്", "Tamil Nadu"],
  
  // Punjabi script (Gurmukhi)
  ["ਪੰਜਾਬ", "Punjab"],
  ["ਚੰਡੀਗੜ੍ਹ", "Chandigarh"],
  ["ਅੰਮ੍ਰਿਤਸਰ", "Amritsar"],
  ["ਲੁਧਿਆਣਾ", "Ludhiana"],
  ["ਜਲੰਧਰ", "Jalandhar"],
  ["ਹਰਿਆਣਾ", "Haryana"],
  ["ਦਿੱਲੀ", "Delhi"],
  
  // Marathi (Devanagari)
  ["महाराष्ट्र", "Maharashtra"],
  ["मुंबई", "Mumbai"],
  ["पुणे", "Pune"],
  ["नागपूर", "Nagpur"],
  ["नाशिक", "Nashik"],
  ["औरंगाबाद", "Aurangabad"],
  ["सोलापूर", "Solapur"],
  
  // Oriya script
  ["ଓଡ଼ିଶା", "Odisha"],
  ["ଭୁବନେଶ୍ୱର", "Bhubaneswar"],
  ["କଟକ", "Cuttack"],
  ["ରାଉରକେଲା", "Rourkela"],
  
  // Common misspellings and variations
  ["deli", "Delhi"],
  ["delhy", "Delhi"],
  ["dlhi", "Delhi"],
  ["mumby", "Mumbai"],
  ["mumbai", "Mumbai"],
  ["kolkatta", "Kolkata"],
  ["calcuta", "Kolkata"],
  ["bangalor", "Bangalore"],
  ["bangaluru", "Bangalore"],
  ["bengluru", "Bangalore"],
  ["chenai", "Chennai"],
  ["madrs", "Chennai"],
  ["hydrabad", "Hyderabad"],
  ["haiderabad", "Hyderabad"],
  ["ahmdabad", "Ahmedabad"],
  ["ahemdabad", "Ahmedabad"],
  
  // Regional variations and local names
  ["silicon city", "Bangalore"],
  ["garden city", "Bangalore"],
  ["it city", "Bangalore"],
  ["bollywood city", "Mumbai"],
  ["financial capital", "Mumbai"],
  ["city of joy", "Kolkata"],
  ["detroit of india", "Chennai"],
  ["nizams city", "Hyderabad"],
  ["cyberabad", "Hyderabad"],
  ["pink city", "Jaipur"],
  ["blue city", "Jodhpur"],
  ["golden city", "Jaisalmer"],
  ["venice of the east", "Kochi"],
  ["queen of arabian sea", "Kochi"],
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

// Enhanced function to detect script and language
function detectScript(text: string): string {
  // Unicode ranges for different scripts
  const scriptRanges = {
    devanagari: /[\u0900-\u097F]/,
    bengali: /[\u0980-\u09FF]/,
    tamil: /[\u0B80-\u0BFF]/,
    telugu: /[\u0C00-\u0C7F]/,
    kannada: /[\u0C80-\u0CFF]/,
    malayalam: /[\u0D00-\u0D7F]/,
    gujarati: /[\u0A80-\u0AFF]/,
    gurmukhi: /[\u0A00-\u0A7F]/,
    oriya: /[\u0B00-\u0B7F]/,
    english: /[A-Za-z]/,
  };
  
  const detectedScripts: string[] = [];
  for (const [script, regex] of Object.entries(scriptRanges)) {
    if (regex.test(text)) {
      detectedScripts.push(script);
    }
  }
  
  return detectedScripts.join(',') || 'unknown';
}

// Enhanced function to preprocess multilingual text
function preprocessMultilingualText(text: string): string[] {
  // Split text by various delimiters including Unicode whitespace
  const segments = text.split(/[\s,\.;!?\u00A0\u2000-\u200A\u2028\u2029\u3000]+/)
    .filter(segment => segment.length > 0);
  
  const processedSegments: string[] = [];
  
  for (const segment of segments) {
    // Convert to lowercase for English text only
    if (/^[A-Za-z0-9\-\.]+$/.test(segment)) {
      processedSegments.push(segment.toLowerCase());
    } else {
      // Keep original case for non-English scripts
      processedSegments.push(segment);
    }
    
    // Also add cleaned version without punctuation
    const cleaned = segment.replace(/[^\u0900-\u097F\u0980-\u09FF\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0A80-\u0AFF\u0A00-\u0A7F\u0B00-\u0B7F\w]/g, '');
    if (cleaned && cleaned !== segment && cleaned.length > 1) {
      processedSegments.push(/^[A-Za-z0-9\-\.]+$/.test(cleaned) ? cleaned.toLowerCase() : cleaned);
    }
  }
  
  return processedSegments;
}

// Enhanced function to extract state information
function inferStateFromLocation(locationName: string): string | undefined {
  const stateMapping = {
    "Mumbai": "Maharashtra",
    "Pune": "Maharashtra",
    "Nagpur": "Maharashtra",
    "Nashik": "Maharashtra",
    "Aurangabad": "Maharashtra",
    "Thane": "Maharashtra",
    "Solapur": "Maharashtra",
    
    "Delhi": "Delhi",
    "New Delhi": "Delhi",
    
    "Bangalore": "Karnataka",
    "Mysore": "Karnataka",
    "Hubli": "Karnataka",
    "Mangalore": "Karnataka",
    
    "Chennai": "Tamil Nadu",
    "Coimbatore": "Tamil Nadu",
    "Madurai": "Tamil Nadu",
    "Tiruchirappalli": "Tamil Nadu",
    "Salem": "Tamil Nadu",
    "Tirunelveli": "Tamil Nadu",
    
    "Kolkata": "West Bengal",
    
    "Hyderabad": "Telangana",
    
    "Visakhapatnam": "Andhra Pradesh",
    "Vijayawada": "Andhra Pradesh",
    "Tirupati": "Andhra Pradesh",
    
    "Kochi": "Kerala",
    "Kozhikode": "Kerala",
    "Thiruvananthapuram": "Kerala",
    "Kannur": "Kerala",
    "Thrissur": "Kerala",
    
    "Ahmedabad": "Gujarat",
    "Surat": "Gujarat",
    "Vadodara": "Gujarat",
    "Rajkot": "Gujarat",
    
    "Lucknow": "Uttar Pradesh",
    "Kanpur": "Uttar Pradesh",
    "Ghaziabad": "Uttar Pradesh",
    "Agra": "Uttar Pradesh",
    "Varanasi": "Uttar Pradesh",
    "Meerut": "Uttar Pradesh",
    "Prayagraj": "Uttar Pradesh",
    
    "Indore": "Madhya Pradesh",
    "Bhopal": "Madhya Pradesh",
    "Gwalior": "Madhya Pradesh",
    
    "Jaipur": "Rajasthan",
    "Jodhpur": "Rajasthan",
    "Kota": "Rajasthan",
    
    "Amritsar": "Punjab",
    "Ludhiana": "Punjab",
    "Jalandhar": "Punjab",
    
    "Chandigarh": "Chandigarh",
    
    "Patna": "Bihar",
    
    "Raipur": "Chhattisgarh",
    
    "Bhubaneswar": "Odisha",
    "Cuttack": "Odisha",
    "Rourkela": "Odisha",
    
    "Guwahati": "Assam",
    
    "Srinagar": "Jammu and Kashmir"
  };
  
  return stateMapping[locationName as keyof typeof stateMapping];
}

export function extractLocationsFromText(text: string): ExtractedLocation[] {
  const locations: ExtractedLocation[] = [];
  const detectedScript = detectScript(text);
  
  // Enhanced preprocessing for multilingual text
  const segments = preprocessMultilingualText(text);
  
  // Check direct mappings first - both single words and phrases
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    
    // Check 3-word phrases first (for locations like "Jammu and Kashmir")
    if (i < segments.length - 2) {
      const threeWordPhrase = `${segment} ${segments[i + 1]} ${segments[i + 2]}`;
      if (LOCATION_MAPPINGS.has(threeWordPhrase)) {
        locations.push({
          original: threeWordPhrase,
          standardized: LOCATION_MAPPINGS.get(threeWordPhrase)!,
          confidence: 0.98,
          state: inferStateFromLocation(LOCATION_MAPPINGS.get(threeWordPhrase)!)
        });
        i += 2; // Skip next two words
        continue;
      }
    }
    
    // Check 2-word phrases
    if (i < segments.length - 1) {
      const twoWordPhrase = `${segment} ${segments[i + 1]}`;
      if (LOCATION_MAPPINGS.has(twoWordPhrase)) {
        locations.push({
          original: twoWordPhrase,
          standardized: LOCATION_MAPPINGS.get(twoWordPhrase)!,
          confidence: 0.95,
          state: inferStateFromLocation(LOCATION_MAPPINGS.get(twoWordPhrase)!)
        });
        i++; // Skip next word
        continue;
      }
    }
    
    // Check single words/segments
    if (LOCATION_MAPPINGS.has(segment)) {
      locations.push({
        original: segment,
        standardized: LOCATION_MAPPINGS.get(segment)!,
        confidence: 0.90,
        state: inferStateFromLocation(LOCATION_MAPPINGS.get(segment)!)
      });
    }
  }
  
  // Enhanced fuzzy matching for unmatched potential locations
  const locationNames = Array.from(LOCATION_MAPPINGS.values());
  const mappingKeys = Array.from(LOCATION_MAPPINGS.keys());
  
  const potentialLocations = segments.filter(segment => {
    // More sophisticated filtering for potential locations
    if (segment.length < 3) return false;
    if (locations.some(loc => loc.original.includes(segment))) return false;
    
    // Skip common English words that are not locations
    const commonWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'man', 'men', 'put', 'say', 'she', 'too', 'use'];
    if (commonWords.includes(segment.toLowerCase())) return false;
    
    return true;
  });
  
  for (const potential of potentialLocations) {
    // Try fuzzy matching against both standardized names and mapping keys
    const standardMatch = findBestMatch(potential, locationNames);
    const keyMatch = findBestMatch(potential, mappingKeys);
    
    let bestMatch = null;
    if (standardMatch && keyMatch) {
      bestMatch = standardMatch.confidence > keyMatch.confidence ? standardMatch : 
                  { match: LOCATION_MAPPINGS.get(keyMatch.match)!, confidence: keyMatch.confidence };
    } else if (standardMatch) {
      bestMatch = standardMatch;
    } else if (keyMatch) {
      bestMatch = { match: LOCATION_MAPPINGS.get(keyMatch.match)!, confidence: keyMatch.confidence };
    }
    
    if (bestMatch && !locations.some(loc => loc.standardized === bestMatch!.match)) {
      locations.push({
        original: potential,
        standardized: bestMatch.match,
        confidence: bestMatch.confidence * 0.8, // Reduce confidence for fuzzy matches
        state: inferStateFromLocation(bestMatch.match)
      });
    }
  }
  
  // Sort by confidence and remove duplicates
  const uniqueLocations = locations.filter((loc, index, self) => 
    index === self.findIndex(l => l.standardized === loc.standardized)
  ).sort((a, b) => b.confidence - a.confidence);
  
  return uniqueLocations;
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
