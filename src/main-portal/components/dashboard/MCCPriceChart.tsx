// AI-generated · AI-managed · AI-maintained
'use client'

import { useState, useEffect } from 'react'
import { usePriceHistory } from '../../hooks/usePriceHistory'
import type { PriceTimeRange } from '../../lib/api/geckoterminal'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const TIME_RANGES: { label: string; value: PriceTimeRange }[] = [
  { label: '1D', value: '1D' },
  { label: '7D', value: '7D' },
  { label: '30D', value: '30D' },
  { label: '1Y', value: '1Y' },
]

function computeChange(data: any[] | null): number | null {
  if (!data || data.length < 2) return null
  const prices = data
    .map((d) => d.market_price ?? d.close ?? 0)
    .filter((p: number) => p > 0)
  if (prices.length < 2) return null
  const first = prices[0]
  const last = prices[prices.length - 1]
  if (first <= 0) return null
  return ((last - first) / first) * 100
}

export default function MCCPriceChart() {
  const [range, setRange] = useState<PriceTimeRange>('7D')
  const { data, loading } = usePriceHistory(range)

  const [rangeChanges, setRangeChanges] = useState<Record<string, number | null>>({})

  useEffect(() => {
    const ranges: PriceTimeRange[] = ['1D', '7D', '30D', '1Y']
    ranges.forEach(async (r) => {
      try {
        const res = await fetch(`/api/stats/price-history?range=${r}`)
        const json = await res.json()
        if (json.success && json.data) {
          const change = computeChange(json.data)
          setRangeChanges(prev => ({ ...prev, [r]: change }))
        }
      } catch {}
    })
  }, [])

  const chartData = (data?.map((item) => ({
    time: item.timestamp * 1000,
    price: (item as any).market_price ?? item.close ?? 0,
  })).filter((d) => d.price > 0)) || []

  const prices = chartData.map(d => d.price)
  const minPrice = prices.length > 0 ? Math.min(...prices) * 0.995 : 0
  const maxPrice = prices.length > 0 ? Math.max(...prices) * 1.005 : 1
  const currentPrice = prices.length > 0 ? prices[prices.length - 1] : null

  const formatTime = (ts: number) => {
    const d = new Date(ts)
    if (range === '1D') return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden hover:border-cyan-400/50 dash-card">
      <div className="flex flex-col sm:flex-row items-stretch border-b border-neutral-700">
        <div className="flex flex-1 flex-col justify-center gap-1 px-3 py-2 sm:px-6 sm:py-4">
          <div className="text-white font-mono font-bold text-sm sm:text-base">
            MCC Price Trend
          </div>
          <div className="text-neutral-500 font-mono text-xs">
            {currentPrice ? `$${currentPrice.toFixed(4)}` : '--'}
            {rangeChanges[range] != null && (
              <span className={`ml-2 ${rangeChanges[range]! >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                {rangeChanges[range]! >= 0 ? '+' : ''}{rangeChanges[range]!.toFixed(2)}%
              </span>
            )}
          </div>
        </div>
        <div className="flex">
          {TIME_RANGES.map((tr) => {
            const isActive = range === tr.value
            const change = rangeChanges[tr.value]
            const isPositive = change != null && change >= 0
            return (
              <button
                key={tr.value}
                data-active={isActive}
                className={`relative z-10 flex flex-1 flex-col justify-center gap-1 border-t border-neutral-700 px-4 py-3 text-left even:border-l even:border-neutral-700 sm:border-t-0 sm:border-l sm:border-neutral-700 sm:px-5 sm:py-4 transition-colors ${
                  isActive ? 'bg-neutral-800' : 'hover:bg-neutral-800/50'
                }`}
                onClick={() => setRange(tr.value)}
              >
                <span className="text-[10px] text-neutral-500 font-mono tracking-wider">
                  {tr.label}
                </span>
                {change == null ? (
                  <span className="text-lg font-bold leading-none text-neutral-600 font-mono sm:text-xl">...</span>
                ) : (
                  <span className={`text-lg font-bold leading-none font-mono sm:text-xl tabular-nums ${isPositive ? 'text-cyan-400' : 'text-red-400'}`}>
                    {isPositive ? '+' : ''}{change.toFixed(2)}%
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-3 sm:p-6">
        <div className="h-[220px] xs:h-[280px] sm:h-[360px]">
          {loading ? (
            <div className="h-full bg-neutral-800 rounded animate-pulse" />
          ) : chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-neutral-500 font-mono text-sm">
              No price data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#404040" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: '#737373', fontSize: 10, fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatTime}
                />
                <YAxis
                  tick={{ fill: '#737373', fontSize: 10, fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${v.toFixed(3)}`}
                  domain={[minPrice, maxPrice]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#171717',
                    border: '1px solid #404040',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                  }}
                  labelFormatter={(ts) => new Date(ts).toLocaleString()}
                  formatter={(value: number) => [`$${value.toFixed(4)}`, 'Price']}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  fill="url(#priceGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}
