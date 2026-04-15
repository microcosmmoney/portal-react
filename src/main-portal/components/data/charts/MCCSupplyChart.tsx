// AI-generated · AI-managed · AI-maintained
"use client"

import { Pie, PieChart, Cell } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "../../ui/chart"

interface MCCSupplyChartProps {
  circulating: number
  remaining: number
  className?: string
}

const chartConfig = {
  circulating: {
    label: "\u5df2\u6316\u51fa",
    color: "#10b981"
  },
  remaining: {
    label: "Genesis Pool",
    color: "#374151"
  }
} satisfies ChartConfig

export function MCCSupplyChart({ circulating, remaining, className }: MCCSupplyChartProps) {
  const data = [
    { name: "\u5df2\u6316\u51fa", value: circulating, fill: "#10b981" },
    { name: "Genesis Pool", value: remaining, fill: "#374151" }
  ]

  const total = circulating + remaining
  const percentage = total > 0 ? ((circulating / total) * 100).toFixed(2) : "0.00"

  return (
    <ChartContainer config={chartConfig} className={className}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          startAngle={90}
          endAngle={-270}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => (
                <span className="font-mono">
                  {Number(value).toLocaleString()} MCC
                </span>
              )}
            />
          }
        />
        {}
        <text
          x="50%"
          y="45%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#10b981"
          fontSize="24"
          fontWeight="bold"
        >
          {percentage}%
        </text>
        <text
          x="50%"
          y="58%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#9ca3af"
          fontSize="12"
        >
          \u5df2\u6316\u51fa
        </text>
      </PieChart>
    </ChartContainer>
  )
}
