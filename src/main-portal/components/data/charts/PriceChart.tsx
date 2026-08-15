"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "../../ui/button"
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis,
  ResponsiveContainer, Tooltip,
} from "recharts"

type TimeRange = "30D" | "180D" | "1Y"

interface PricePoint {
  timestamp: number
  market_price: number | null
  base_price: number | null
}

interface PriceChartProps {
  theme?: "blue" | "orange"
}

const THEMES = {
  blue: {
    bg: "bg-neutral-900 border-neutral-700",
    title: "text-white",
    btnActive: "bg-cyan-700 hover:bg-cyan-600 text-white",
    btnInactive: "hover:bg-neutral-700 text-neutral-500",
    btnBg: "bg-neutral-800",
    grid: "#333",
    cursor: "#06B6D4",
    tooltip: { bg: "#0E0E0E", border: "#333" },
    market: "#67e8f9",
    base: "#f59e0b",
    mining: "#4ade80",
  },
  orange: {
    bg: "bg-[#1B1B1B] border-[#2A2A2A]",
    title: "text-[#EDEDED]",
    btnActive: "bg-[#FF6B00] hover:bg-[#E55A00] text-black",
    btnInactive: "hover:bg-[#2A2A2A] text-[#9A9A9A]",
    btnBg: "bg-[#0E0E0E]",
    grid: "#2A2A2A",
    cursor: "#FF6B00",
    tooltip: { bg: "#0E0E0E", border: "#2A2A2A" },
    market: "#FF6B00",
    base: "#f59e0b",
    mining: "#4ade80",
  },
}

export function PriceChart({ theme = "blue" }: PriceChartProps) {
  const t = THEMES[theme]
  const [timeRange, setTimeRange] = useState<TimeRange>("1Y")
  const [allHistory, setAllHistory] = useState<PricePoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/stats/price-history?range=1Y")
        const json = await res.json()
        if (json.success && Array.isArray(json.data)) {
          setAllHistory(json.data)
        }
      } catch {}
      setLoading(false)
    }
    load()
    const interval = setInterval(load, 900_000)
    return () => clearInterval(interval)
  }, [])

  const visibleHistory = useMemo(() => {
    if (allHistory.length === 0) return []
    const now = Date.now() / 1000
    const cutoffs: Record<TimeRange, number> = {
      "30D": now - 30 * 86400,
      "180D": now - 180 * 86400,
      "1Y": 0,
    }
    const cutoff = cutoffs[timeRange]
    return cutoff > 0 ? allHistory.filter((p) => p.timestamp >= cutoff) : allHistory
  }, [allHistory, timeRange])

  const chartData = useMemo(() => {
    return visibleHistory.map((p) => {
      const d = new Date(p.timestamp * 1000)
      let label: string
      if (timeRange === "30D") {
        label = `${(d.getUTCMonth() + 1).toString().padStart(2, "0")}/${d.getUTCDate().toString().padStart(2, "0")} ${d.getUTCHours().toString().padStart(2, "0")}h`
      } else {
        label = `${(d.getUTCMonth() + 1).toString().padStart(2, "0")}/${d.getUTCDate().toString().padStart(2, "0")}`
      }
      return {
        time: label,
        market: p.market_price,
        base: p.base_price,
        mining: p.base_price != null ? p.base_price * 4 : null,
      }
    })
  }, [visibleHistory, timeRange])

  if (loading) {
    return <div className={`h-[240px] sm:h-[380px] ${t.bg} rounded-lg animate-pulse border`} />
  }

  if (chartData.length === 0) {
    return null
  }

  return (
    <div className={`${t.bg} rounded-lg p-3 sm:p-4 border`}>
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <span className={`text-xs sm:text-sm font-medium ${t.title}`}>MCC Pricing Overview</span>
        <div className={`flex items-center gap-1 ${t.btnBg} p-0.5 rounded`}>
          {(["30D", "180D", "1Y"] as TimeRange[]).map((range) => (
            <Button
              key={range}
              size="sm"
              variant={timeRange === range ? "default" : "ghost"}
              onClick={() => setTimeRange(range)}
              className={`${timeRange === range ? t.btnActive : t.btnInactive} px-2.5 py-0.5 h-6 text-xs`}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-[200px] sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={t.grid} />
            <XAxis
              dataKey="time"
              tick={{ fill: "#9A9A9A", fontSize: 9 }}
              tickLine={false}
              axisLine={false}
              interval={Math.max(1, Math.floor(chartData.length / 10))}
            />
            <YAxis
              tick={{ fill: "#9A9A9A", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
              domain={["dataMin - 0.1", "dataMax + 0.1"]}
            />
            <Tooltip
              cursor={{ stroke: t.cursor, strokeWidth: 1, strokeDasharray: "4 4" }}
              contentStyle={{ backgroundColor: t.tooltip.bg, border: `1px solid ${t.tooltip.border}`, borderRadius: "0.5rem", fontSize: "12px" }}
              labelStyle={{ color: "#9A9A9A" }}
              formatter={(value: number, name: string) => {
                const labels: Record<string, string> = { market: "Market Price", base: "Base Price", mining: "Mining Price" }
                return value != null ? [`$${value.toFixed(4)}`, labels[name] || name] : ["--", name]
              }}
            />
            <Line type="monotone" dataKey="mining" name="mining" stroke={t.mining} strokeWidth={2} dot={false} connectNulls
              activeDot={{ r: 3, fill: t.mining, stroke: t.tooltip.bg, strokeWidth: 2 }} />
            <Line type="monotone" dataKey="market" name="market" stroke={t.market} strokeWidth={2} dot={false} connectNulls
              activeDot={{ r: 3, fill: t.market, stroke: t.tooltip.bg, strokeWidth: 2 }} />
            <Line type="monotone" dataKey="base" name="base" stroke={t.base} strokeWidth={2} dot={false} connectNulls strokeDasharray="6 3"
              activeDot={{ r: 3, fill: t.base, stroke: t.tooltip.bg, strokeWidth: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
