// AI-generated · AI-managed · AI-maintained
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "../../ui/chart"
import type { TerritoryItem } from "../../../hooks/useStats"

interface TerritoryProgressChartProps {
  data: TerritoryItem[]
  className?: string
}

const chartConfig = {
  active: {
    label: "\u6d3b\u8dc3",
    color: "#10b981"
  },
  inactive: {
    label: "\u672a\u6d3b\u8dc3",
    color: "#374151"
  }
} satisfies ChartConfig

const TERRITORY_COLORS: Record<string, string> = {
  System: "#047857",
  Sector: "#059669",
  Matrix: "#10b981",
  Station: "#34d399"
}

export function TerritoryProgressChart({ data, className }: TerritoryProgressChartProps) {
  const chartData = data.map(item => ({
    name: `${item.type} (${item.name})`,
    type: item.type,
    active: item.active,
    total: item.total,
    rate: item.total > 0 ? Math.round((item.active / item.total) * 100) : 0,
    fill: TERRITORY_COLORS[item.type] || "#10b981"
  }))

  return (
    <ChartContainer config={chartConfig} className={className}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ left: 120, right: 60 }}
        accessibilityLayer
      >
        <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          type="number"
          tickLine={false}
          axisLine={false}
          domain={[0, 100]}
          tick={{ fill: "#9ca3af" }}
          tickFormatter={(value) => `${value}%`}
        />
        <YAxis
          type="category"
          dataKey="name"
          tickLine={false}
          axisLine={false}
          width={120}
          tick={{ fill: "#9ca3af" }}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(value, name, item) => (
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{item.payload.type}</span>
                  <span>\u6d3b\u8dc3: {item.payload.active} / {item.payload.total}</span>
                  <span>\u6d3b\u8dc3\u7387: {item.payload.rate}%</span>
                </div>
              )}
            />
          }
        />
        <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
