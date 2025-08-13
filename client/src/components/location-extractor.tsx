import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ExtractedLocation } from "@/lib/types";

export default function LocationExtractor() {
  const [inputText, setInputText] = useState("");
  const [extractedLocations, setExtractedLocations] = useState<ExtractedLocation[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const extractionMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await apiRequest("POST", "/api/extract-locations", { text });
      return response.json();
    },
    onSuccess: (data) => {
      setExtractedLocations(data.extractedLocations || []);
      queryClient.invalidateQueries({ queryKey: ["/api/locations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Locations Extracted",
        description: `Found ${data.extractedLocations?.length || 0} locations in the text.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Extraction Failed",
        description: error.message || "Failed to extract locations from text",
        variant: "destructive",
      });
    },
  });

  const handleExtract = () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to extract locations from.",
        variant: "destructive",
      });
      return;
    }
    extractionMutation.mutate(inputText);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "bg-success text-white";
    if (confidence >= 0.8) return "bg-warning text-white";
    return "bg-gray-500 text-white";
  };

  return (
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Location Extraction</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Input Report Text
          </label>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="h-32 resize-none"
            placeholder="Enter disaster report text here... 
Example: Emergency in TN, food shortage in New Dlhi area. तमिलनाडु में बाढ़ की स्थिति।"
          />
        </div>
        <Button 
          onClick={handleExtract}
          disabled={extractionMutation.isPending}
          className="w-full"
        >
          {extractionMutation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Search className="w-4 h-4 mr-2" />
          )}
          {extractionMutation.isPending ? "Processing..." : "Extract Locations"}
        </Button>
        
        {/* Extracted Locations */}
        {extractedLocations.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Extracted Locations</h3>
            <div className="space-y-2">
              {extractedLocations.map((location, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <span className="text-sm font-medium">{location.standardized}</span>
                    <span className="text-xs text-gray-500 ml-2">(from "{location.original}")</span>
                  </div>
                  <Badge 
                    className={`text-xs px-2 py-1 rounded ${getConfidenceColor(location.confidence)}`}
                  >
                    {Math.round(location.confidence * 100)}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
