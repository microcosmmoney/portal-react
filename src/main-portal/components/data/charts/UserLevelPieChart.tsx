// AI-generated · AI-managed · AI-maintained
"use client"

import { Pie, PieChart, Cell } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "../../ui/chart"
import type { UserLevelItem } from "../../../hooks/useStats"

interface UserLevelPieChartProps {
  data: UserLevelItem[]
  className?: string
}

const LEVEL_COLORS = [
  "#10b981",
  "#34d399",
  "#6ee7b7",
  "#059669",
  "#047857",
  "#065f46",
  "#064e3b"
]

export function UserLevelPieChart({ data, className }: UserLevelPieChartProps) {
  const chartConfig: ChartConfig = {}
  data.forEach((item, index) => {
    chartConfig[item.name.toLowerCase()] = {
      label: `${item.name} (${item.chinese})`,
      color: LEVEL_COLORS[index] || LEVEL_COLORS[0]
    }
  })

  const chartData = data.map((item, index) => ({
    name: item.name,
    chinese: item.chinese,
    value: item.count,
    percentage: item.percentage,
    fill: LEVEL_COLORS[index] || LEVEL_COLORS[0]
  }))

  return (
    <ChartContainer config={chartConfig} className={className}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          label={({ name, percentage }) => `${name} ${percentage}%`}
          labelLine={{ stroke: "#6ee7b7" }}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value, name, item) => (
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{item.payload.name} ({item.payload.chinese})</span>
                  <span>\u4eba\u6570: {Number(value).toLocaleString()}</span>
                  <span className="text-muted-foreground text-xs">
                    \u5360\u6bd4: {item.payload.percentage}%
                  </span>
                </div>
              )}
            />
          }
        />
      </PieChart>
    </ChartContainer>
  )
}
