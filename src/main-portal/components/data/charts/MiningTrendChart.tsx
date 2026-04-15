// AI-generated · AI-managed · AI-maintained
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig
} from "../../ui/chart"
import type { MiningHistoryItem } from "../../../hooks/useStats"

interface MiningTrendChartProps {
  data: MiningHistoryItem[]
  className?: string
}

const chartConfig = {
  usdc_amount: {
    label: "USDC \u6295\u5165",
    color: "#5EEAD4"
  },
  usdt_amount: {
    label: "USDT \u6295\u5165",
    color: "#2DD4BF"
  },
  total_mcc: {
    label: "MCC \u4ea7\u51fa",
    color: "#99F6E4"
  },
  total_mcd: {
    label: "MCD \u4ea7\u51fa",
    color: "#14B8A6"
  }
} satisfies ChartConfig

export function MiningTrendChart({ data, className }: MiningTrendChartProps) {
  const formattedData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  })).reverse()

  return (
    <ChartContainer config={chartConfig} className={className}>
      <BarChart
        data={formattedData}
        accessibilityLayer
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tick={{ fill: "#9ca3af" }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#9ca3af" }}
          width={60}
          tickFormatter={(value) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
            if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
            return value.toString()
          }}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="usdc_amount"
          fill="#5EEAD4"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="usdt_amount"
          fill="#2DD4BF"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="total_mcc"
          fill="#99F6E4"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="total_mcd"
          fill="#14B8A6"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}
