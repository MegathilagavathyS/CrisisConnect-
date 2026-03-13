import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, MapPin, Globe, Building, Landmark } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface GeospatialEntity {
  token: string;
  canonicalName: string;
  table: 'Country' | 'City' | 'State';
  confidence: number;
}

interface QueryResult {
  query: string;
  entities: GeospatialEntity[];
  formattedOutput: string;
  entityCount: number;
}

export default function GeospatialQuery() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<QueryResult | null>(null);
  const { toast } = useToast();

  const queryMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await apiRequest("POST", "/api/geospatial-query", { query: text });
      return response.json();
    },
    onSuccess: (data: QueryResult) => {
      setResult(data);
      toast({
        title: "Query Processed",
        description: `Found ${data.entityCount} geospatial entities.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Query Failed",
        description: error.message || "Failed to process geospatial query",
        variant: "destructive",
      });
    },
  });

  const handleQuery = () => {
    if (!query.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a query to process.",
        variant: "destructive",
      });
      return;
    }
    queryMutation.mutate(query);
  };

  const getTableIcon = (table: string) => {
    switch (table) {
      case 'Country':
        return <Globe className="w-4 h-4" />;
      case 'State':
        return <Landmark className="w-4 h-4" />;
      case 'City':
        return <Building className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getTableColor = (table: string) => {
    switch (table) {
      case 'Country':
        return "bg-blue-100 text-blue-800 border-blue-200";
      case 'State':
        return "bg-green-100 text-green-800 border-green-200";
      case 'City':
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "bg-green-500 text-white";
    if (confidence >= 0.8) return "bg-yellow-500 text-white";
    if (confidence >= 0.7) return "bg-orange-500 text-white";
    return "bg-red-500 text-white";
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Geospatial Query System</h2>
        <p className="text-sm text-gray-600">
          Identify and map geospatial entities from natural language queries with fuzzy matching.
        </p>
      </div>

      {/* Query Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Enter Query</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-[120px] resize-none"
              placeholder="Enter your natural language query here...

Examples:
• Which of the following saw the highest average temperature in January, Maharashtra, Ahmedabad or entire New-Zealand?
• Show me a graph of rainfall for Chennai for the month of October
• Compare population density between California, Texas and New York
• What's the weather like in Mumbai, Delhi and Bangalore?"
            />
          </div>
          <Button 
            onClick={handleQuery}
            disabled={queryMutation.isPending}
            className="w-full"
          >
            {queryMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Search className="w-4 h-4 mr-2" />
            )}
            {queryMutation.isPending ? "Processing..." : "Analyze Query"}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Query Results</span>
                <Badge variant="outline">
                  {result.entityCount} entities found
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 mb-2">
                <strong>Query:</strong> {result.query}
              </div>
            </CardContent>
          </Card>

          {/* Entity Details */}
          {result.entities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Identified Entities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.entities.map((entity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded ${getTableColor(entity.table)}`}>
                          {getTableIcon(entity.table)}
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            "{entity.token}" → "{entity.canonicalName}"
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Table: {entity.table}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          className={`text-xs px-2 py-1 rounded ${getConfidenceColor(entity.confidence)}`}
                        >
                          {Math.round(entity.confidence * 100)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Formatted Output */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Formatted Output</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-gray-50 p-3 rounded border whitespace-pre-wrap">
                {result.formattedOutput}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
