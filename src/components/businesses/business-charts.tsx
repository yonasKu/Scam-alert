"use client";

import { Business } from "@/lib/api/businesses";

interface BusinessChartsProps {
  businessesData: Business[];
  t: (key: string, params?: Record<string, string | number>) => string;
}

interface ScoreRange {
  min: number;
  max: number;
  label: string;
  color: string;
}

interface ChartData {
  label: string;
  count: number;
  color: string;
}

interface LocationCount {
  name: string;
  value: number;
}

export default function BusinessCharts({ businessesData, t }: BusinessChartsProps) {
  // Prepare score distribution chart data
  const scoreRanges: ScoreRange[] = [
    { min: 0, max: 3, label: "0-2", color: "#22c55e" }, // green-500 (Low risk: 0-2)
    { min: 3, max: 6, label: "3-5", color: "#fbbf24" }, // yellow-400 (Moderate risk: 3-5)
    { min: 6, max: 10, label: "6-9", color: "#ef4444" }, // red-500 (High risk: 6-9)
    { min: 10, max: 11, label: "10", color: "#dc2626" }  // red-600 (Extreme risk: 10)
  ];
  
  const chartData: ChartData[] = scoreRanges.map(range => ({
    label: range.label,
    count: businessesData.filter(business => 
      business.scam_score !== undefined && 
      business.scam_score >= range.min && 
      business.scam_score < range.max
    ).length,
    color: range.color
  }));

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "row",
      gap: "1.5rem",
      marginBottom: "2rem",
      width: "100%"
    }}>
      {/* Score Distribution Chart */}
      <div style={{ 
        flex: "1",
        border: "1px solid hsla(var(--border) / 0.5)",
        borderRadius: "0.5rem",
        padding: "1.5rem",
        backgroundColor: "hsl(var(--card))",
        minHeight: "350px",
        width: "50%"
      }}>
        <h3 style={{ 
          fontSize: "1.125rem", 
          fontWeight: "600", 
          marginBottom: "0.25rem" 
        }}>
          {t("charts.scoreDistribution", { fallback: "Score Distribution" })}
        </h3>
        <p style={{ 
          fontSize: "0.875rem", 
          color: "hsl(var(--muted-foreground))", 
          marginBottom: "1rem" 
        }}>
          {t("charts.scamScoreDistribution", { fallback: "Distribution of businesses by scam score" })}
        </p>
        
        <div style={{ width: '100%', height: 250 }}>
          {/* Direct Recharts implementation */}
          {(() => {
            const BarChart = require('recharts').BarChart;
            const Bar = require('recharts').Bar;
            const XAxis = require('recharts').XAxis;
            const YAxis = require('recharts').YAxis;
            const Tooltip = require('recharts').Tooltip;
            const ResponsiveContainer = require('recharts').ResponsiveContainer;
            const Cell = require('recharts').Cell;

            return (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            );
          })()}
        </div>
      </div>

      {/* Location Distribution Pie Chart */}
      <div style={{ 
        flex: "1",
        border: "1px solid hsla(var(--border) / 0.5)",
        borderRadius: "0.5rem",
        padding: "1.5rem",
        backgroundColor: "hsl(var(--card))",
        minHeight: "350px",
        width: "50%"
      }}>
        <h3 style={{ 
          fontSize: "1.125rem", 
          fontWeight: "600", 
          marginBottom: "0.25rem" 
        }}>
          {t("charts.locationDistribution", { fallback: "Location Distribution" })}
        </h3>
        <p style={{ 
          fontSize: "0.875rem", 
          color: "hsl(var(--muted-foreground))", 
          marginBottom: "1rem" 
        }}>
          {t("charts.businessesByLocation", { fallback: "Distribution of businesses by location" })}
        </p>
        
        <div style={{ width: '100%', height: 250 }}>
          {/* Direct Recharts implementation */}
          {(() => {
            // Get location counts
            const locationCounts: Record<string, number> = {};
            businessesData.forEach(business => {
              const state = business.state || 'Unknown';
              locationCounts[state] = (locationCounts[state] || 0) + 1;
            });

            // Convert to array format for chart
            const pieData: LocationCount[] = Object.entries(locationCounts)
              .map(([name, value]) => ({ name, value }))
              .sort((a, b) => (b.value as number) - (a.value as number)) // Sort by count desc
              .slice(0, 5); // Only top 5 locations

            // Location colors
            const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

            const PieChart = require('recharts').PieChart;
            const Pie = require('recharts').Pie;
            const Cell = require('recharts').Cell;
            const Legend = require('recharts').Legend;
            const Tooltip = require('recharts').Tooltip;
            const ResponsiveContainer = require('recharts').ResponsiveContainer;

            return (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }: { name: string; percent: number }) => 
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value} businesses`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
