import { Progress } from "@/components/ui/progress";
import { DashboardStats } from "@/lib/types";

interface ResourceSummaryProps {
  stats?: DashboardStats;
}

export default function ResourceSummary({ stats }: ResourceSummaryProps) {
  if (!stats) {
    return (
      <div className="p-6 flex-1">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Resource Summary</h2>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const criticalPercentage = stats.totalLocations > 0 
    ? Math.round((stats.criticalAreas / stats.totalLocations) * 100)
    : 0;

  const foodAvailabilityPercentage = stats.resourceStats.food.total > 0
    ? Math.round((stats.resourceStats.food.available / stats.resourceStats.food.total) * 100)
    : 0;

  const shelterAvailabilityPercentage = stats.resourceStats.shelter.total > 0
    ? Math.round((stats.resourceStats.shelter.available / stats.resourceStats.shelter.total) * 100)
    : 0;

  return (
    <div className="p-6 flex-1">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Resource Summary</h2>
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Critical Areas</span>
            <span className="text-lg font-bold text-error">{stats.criticalAreas}</span>
          </div>
          <Progress 
            value={criticalPercentage} 
            className="w-full h-2"
          />
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Food Availability</span>
            <span className="text-lg font-bold text-warning">{foodAvailabilityPercentage}%</span>
          </div>
          <Progress 
            value={foodAvailabilityPercentage} 
            className="w-full h-2"
          />
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Shelter Availability</span>
            <span className="text-lg font-bold text-accent">{shelterAvailabilityPercentage}%</span>
          </div>
          <Progress 
            value={shelterAvailabilityPercentage} 
            className="w-full h-2"
          />
        </div>

        {/* Additional Statistics */}
        <div className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Locations</span>
            <span className="font-medium">{stats.totalLocations}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Warning Areas</span>
            <span className="font-medium text-warning">{stats.warningAreas}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Stable Areas</span>
            <span className="font-medium text-success">{stats.stableAreas}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
