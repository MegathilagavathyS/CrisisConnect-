interface CohereResponse {
  generations: Array<{
    text: string;
  }>;
}

interface ChatContext {
  locations: Array<{ name: string; resources: any[] }>;
  recentReports: Array<{ text: string; severity: string }>;
}

export class CohereService {
  private apiKey: string;
  private baseUrl = "https://api.cohere.ai/v1";

  constructor() {
    this.apiKey = process.env.COHERE_API_KEY || process.env.COHERE_KEY || "";
    if (!this.apiKey) {
      console.warn("COHERE_API_KEY not found in environment variables");
    }
  }

  async generateResponse(userMessage: string, context: ChatContext): Promise<string> {
    if (!this.apiKey) {
      return "I'm sorry, but the AI service is not configured properly. Please check the API configuration.";
    }

    try {
      const prompt = this.buildPrompt(userMessage, context);
      
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command',
          prompt: prompt,
          max_tokens: 250,
          temperature: 0.3,
          k: 0,
          stop_sequences: ["\n\nUser:", "\n\nHuman:"],
          return_likelihoods: 'NONE'
        }),
      });

      if (!response.ok) {
        throw new Error(`Cohere API error: ${response.status} ${response.statusText}`);
      }

      const data: CohereResponse = await response.json();
      return data.generations[0]?.text.trim() || "I apologize, but I couldn't generate a response at this time.";
      
    } catch (error) {
      console.error('Cohere API error:', error);
      return "I'm experiencing technical difficulties. Please try again later.";
    }
  }

  private buildPrompt(userMessage: string, context: ChatContext): string {
    const locationSummary = context.locations.map(loc => {
      const resourceSummary = loc.resources.map(r => 
        `${r.resourceType}: ${Math.round((r.currentAvailable / r.totalCapacity) * 100)}% available`
      ).join(', ');
      return `${loc.name} - ${resourceSummary}`;
    }).join('\n');

    const recentReportsSummary = context.recentReports.map(r => 
      `${r.severity.toUpperCase()}: ${r.text.substring(0, 100)}...`
    ).join('\n');

    return `You are a Crisis Assistant AI helping disaster management teams. You have access to real-time resource and location data.

Current Resource Status:
${locationSummary}

Recent Reports:
${recentReportsSummary}

Instructions:
- Provide clear, actionable information about resource availability and location status
- If asked about specific locations, reference the current data
- For resource queries, mention percentages and critical areas
- Keep responses concise and focused on disaster management needs
- If you don't have specific data, acknowledge limitations clearly

User Question: ${userMessage}

Response:`;
  }

  async extractIntent(userMessage: string): Promise<{
    type: 'location_query' | 'resource_query' | 'general_info' | 'map_action';
    entities: string[];
    confidence: number;
  }> {
    // Simple intent classification - in production, use Cohere's classification endpoint
    const messageLower = userMessage.toLowerCase();
    
    const locationKeywords = ['where', 'location', 'area', 'region', 'place', 'city', 'state'];
    const resourceKeywords = ['food', 'shelter', 'water', 'medical', 'supply', 'resource', 'shortage', 'available'];
    const mapKeywords = ['show', 'display', 'map', 'view', 'visualize'];
    
    const hasLocationKeywords = locationKeywords.some(keyword => messageLower.includes(keyword));
    const hasResourceKeywords = resourceKeywords.some(keyword => messageLower.includes(keyword));
    const hasMapKeywords = mapKeywords.some(keyword => messageLower.includes(keyword));
    
    // Extract potential location entities (simplified)
    const entities: string[] = [];
    const words = userMessage.split(/\s+/);
    const locationNames = ['Delhi', 'Mumbai', 'Chennai', 'Kolkata', 'Bangalore', 'Tamil Nadu', 'Maharashtra'];
    
    for (const word of words) {
      for (const location of locationNames) {
        if (location.toLowerCase().includes(word.toLowerCase()) || word.toLowerCase().includes(location.toLowerCase())) {
          if (!entities.includes(location)) {
            entities.push(location);
          }
        }
      }
    }
    
    let type: 'location_query' | 'resource_query' | 'general_info' | 'map_action' = 'general_info';
    let confidence = 0.6;
    
    if (hasMapKeywords) {
      type = 'map_action';
      confidence = 0.8;
    } else if (hasResourceKeywords && hasLocationKeywords) {
      type = 'resource_query';
      confidence = 0.9;
    } else if (hasLocationKeywords) {
      type = 'location_query';
      confidence = 0.8;
    } else if (hasResourceKeywords) {
      type = 'resource_query';
      confidence = 0.7;
    }
    
    return { type, entities, confidence };
  }
}

export const cohereService = new CohereService();
