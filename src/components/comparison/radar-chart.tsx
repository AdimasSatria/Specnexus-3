"use client";

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import type { RadarDataPoint } from "@/lib/types/common";

const PRODUCT_COLORS = [
  "#06b6d4", // cyan
  "#8b5cf6", // violet
  "#f59e0b", // amber
  "#f43f5e", // rose
];

interface RadarChartProps {
  data: RadarDataPoint[];
  productNames: string[];
}

export function RadarChart({ data, productNames }: RadarChartProps) {
  // Transform data for Recharts format
  const chartData = data.map((point) => {
    const entry: Record<string, string | number> = { axis: point.axis };
    point.values.forEach((val, idx) => {
      entry[productNames[idx]] = val;
    });
    return entry;
  });

  return (
    <div className="w-full glass rounded-xl p-5">
      <h3 className="text-lg font-semibold text-zinc-100 mb-4">Performance Radar</h3>
      <div className="w-full h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart data={chartData} cx="50%" cy="50%" outerRadius="75%">
            <PolarGrid
              stroke="#3f3f46"
              strokeDasharray="3 3"
            />
            <PolarAngleAxis
              dataKey="axis"
              tick={{ fill: "#a1a1aa", fontSize: 11, fontFamily: "Inter" }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: "#52525b", fontSize: 9 }}
              axisLine={false}
            />
            {productNames.map((name, idx) => (
              <Radar
                key={name}
                name={name}
                dataKey={name}
                stroke={PRODUCT_COLORS[idx % PRODUCT_COLORS.length]}
                fill={PRODUCT_COLORS[idx % PRODUCT_COLORS.length]}
                fillOpacity={0.12}
                strokeWidth={2}
                dot={{
                  r: 3,
                  fill: PRODUCT_COLORS[idx % PRODUCT_COLORS.length],
                  strokeWidth: 0,
                }}
              />
            ))}
            <Legend
              wrapperStyle={{
                fontSize: "12px",
                fontFamily: "Inter",
                color: "#a1a1aa",
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #3f3f46",
                borderRadius: "8px",
                fontSize: "12px",
                fontFamily: "Inter",
                color: "#fafafa",
              }}
              itemStyle={{ color: "#a1a1aa" }}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
