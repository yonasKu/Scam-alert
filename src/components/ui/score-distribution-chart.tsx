"use client";

import { Card, CardHeader, CardTitle, CardContent } from "./card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import * as React from "react";
import { useEffect, useState } from "react";

export interface ScoreDistributionData {
  label: string;
  count: number;
  color: string;
}

interface ScoreDistributionChartProps {
  data: ScoreDistributionData[];
  title?: string;
  description?: string;
}

export function ScoreDistributionChart({ data, title = "Score Distribution", description }: ScoreDistributionChartProps) {
  // State to ensure client-side rendering
  const [mounted, setMounted] = useState(false);
  
  // Professional color palette
  const defaultColors = [
    "#22c55e", // green-500
    "#16a34a", // green-700
    "#fbbf24", // yellow-400
    "#f59e42", // orange-400
    "#ef4444", // red-500
  ];

  // Ensure component only renders on client
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Log the data to debug
  console.log("Chart data in component:", data);

  if (!mounted) return null;

  return (
    <Card className="w-full shadow-sm border h-96"> {/* Fixed height */}
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </CardHeader>
      <CardContent className="h-72 flex items-center">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            barCategoryGap={32} 
            margin={{ top: 16, right: 16, left: 8, bottom: 24 }}
          >
            <XAxis dataKey="label" axisLine={false} tickLine={false} className="text-xs" />
            <YAxis allowDecimals={false} axisLine={false} tickLine={false} className="text-xs" />
            <Tooltip 
              cursor={{ fill: "rgba(0,0,0,0.04)" }} 
              contentStyle={{ borderRadius: 8, fontSize: 14 }} 
            />
            <Bar 
              dataKey="count" 
              radius={[6, 6, 0, 0]}
            >
              {data.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={entry.color || defaultColors[idx % defaultColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
