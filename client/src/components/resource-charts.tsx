import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardStats } from "@/lib/types";

// Declare Chart.js on window
declare global {
  interface Window {
    Chart: any;
  }
}

export default function ResourceCharts() {
  const statusChartRef = useRef<HTMLCanvasElement>(null);
  const trendChartRef = useRef<HTMLCanvasElement>(null);
  const statusChartInstance = useRef<any>(null);
  const trendChartInstance = useRef<any>(null);

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  // Load Chart.js and initialize charts
  useEffect(() => {
    const loadChartJS = async () => {
      if (!window.Chart) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = () => {
          initializeCharts();
        };
        document.head.appendChild(script);
      } else {
        initializeCharts();
      }
    };

    const initializeCharts = () => {
      if (!stats || !window.Chart) return;

      // Destroy existing charts
      if (statusChartInstance.current) {
        statusChartInstance.current.destroy();
      }
      if (trendChartInstance.current) {
        trendChartInstance.current.destroy();
      }

      // Status Chart (Doughnut)
      if (statusChartRef.current) {
        const statusCtx = statusChartRef.current.getContext('2d');
        statusChartInstance.current = new window.Chart(statusCtx, {
          type: 'doughnut',
          data: {
            labels: ['Critical', 'Warning', 'Stable'],
            datasets: [{
              data: [stats.criticalAreas, stats.warningAreas, stats.stableAreas],
              backgroundColor: ['#F44336', '#FF9800', '#4CAF50'],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom' as const
              }
            }
          }
        });
      }

      // Trend Chart (Line) - Mock data for demonstration
      if (trendChartRef.current) {
        const trendCtx = trendChartRef.current.getContext('2d');
        const currentHour = new Date().getHours();
        const hours = Array.from({ length: 7 }, (_, i) => {
          const hour = (currentHour - 6 + i) % 24;
          return `${hour.toString().padStart(2, '0')}:00`;
        });
        
        // Generate trend data based on current critical areas
        const baseCritical = stats.criticalAreas;
        const trendData = hours.map((_, i) => {
          const variation = Math.sin(i * 0.5) * 3; // Slight variation
          return Math.max(0, Math.round(baseCritical + variation));
        });

        trendChartInstance.current = new window.Chart(trendCtx, {
          type: 'line',
          data: {
            labels: hours,
            datasets: [{
              label: 'Critical Areas',
              data: trendData,
              borderColor: '#F44336',
              backgroundColor: 'rgba(244, 67, 54, 0.1)',
              tension: 0.4,
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  display: false
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            }
          }
        });
      }
    };

    loadChartJS();

    return () => {
      if (statusChartInstance.current) {
        statusChartInstance.current.destroy();
      }
      if (trendChartInstance.current) {
        trendChartInstance.current.destroy();
      }
    };
  }, [stats]);

  if (!stats) {
    return (
      <div className="w-96 bg-white border-l border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Resource Analytics</h2>
        <div className="space-y-8">
          <div className="h-48 bg-gray-100 rounded animate-pulse"></div>
          <div className="h-32 bg-gray-100 rounded animate-pulse"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-6 bg-gray-100 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const calculatePercentage = (available: number, total: number) => {
    return total > 0 ? Math.round((available / total) * 100) : 0;
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 70) return "text-success";
    if (percentage >= 40) return "text-warning";
    return "text-error";
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Resource Analytics</h2>
      
      {/* Overall Status Chart */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Overall Resource Status</h3>
        <div className="relative h-48">
          <canvas ref={statusChartRef}></canvas>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-3">6-Hour Trend</h3>
        <div className="relative h-32">
          <canvas ref={trendChartRef}></canvas>
        </div>
      </div>

      {/* Resource Breakdown */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Resource Breakdown</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Food Available</span>
            <span className={`text-sm font-medium ${getStatusColor(calculatePercentage(stats.resourceStats.food.available, stats.resourceStats.food.total))}`}>
              {calculatePercentage(stats.resourceStats.food.available, stats.resourceStats.food.total)}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Shelter Available</span>
            <span className={`text-sm font-medium ${getStatusColor(calculatePercentage(stats.resourceStats.shelter.available, stats.resourceStats.shelter.total))}`}>
              {calculatePercentage(stats.resourceStats.shelter.available, stats.resourceStats.shelter.total)}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Medical Supplies</span>
            <span className={`text-sm font-medium ${getStatusColor(calculatePercentage(stats.resourceStats.medical.available, stats.resourceStats.medical.total))}`}>
              {calculatePercentage(stats.resourceStats.medical.available, stats.resourceStats.medical.total)}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Water Access</span>
            <span className={`text-sm font-medium ${getStatusColor(calculatePercentage(stats.resourceStats.water.available, stats.resourceStats.water.total))}`}>
              {calculatePercentage(stats.resourceStats.water.available, stats.resourceStats.water.total)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
