// AI-generated · AI-managed · AI-maintained
'use client'

import { useState } from 'react'
import { usePriceHistory } from '@microcosmmoney/auth-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

type TimeRange = '1D' | '7D' | '30D'

const timeRanges: { label: string; value: TimeRange }[] = [
  { label: '1D', value: '1D' },
  { label: '7D', value: '7D' },
  { label: '30D', value: '30D' },
]

export function MicrocosmPriceChart() {
  const [range, setRange] = useState<TimeRange>('7D')
  const { data, loading } = usePriceHistory(range)

  const raw = data as any
  const items: any[] = Array.isArray(raw) ? raw : raw?.records ?? []
  const chartData = items.map((item: any) => ({
    time: typeof item.timestamp === 'number' ? item.timestamp * 1000 : new Date(item.timestamp).getTime(),
    price: item.price ?? item.close ?? 0,
  }))

  const prices = chartData.map((d: any) => d.price)
  const minPrice = prices.length > 0 ? Math.min(...prices) * 0.995 : 0
  const maxPrice = prices.length > 0 ? Math.max(...prices) * 1.005 : 1

  const formatTime = (ts: number) => {
    const d = new Date(ts)
    if (range === '1D') return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden h-full flex flex-col hover:border-cyan-400/50 transition-colors">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1 bg-black p-0.5 rounded">
            {timeRanges.map((tr) => (
              <button
                key={tr.value}
                onClick={() => setRange(tr.value)}
                className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded transition-colors ${
                  range === tr.value
                    ? 'bg-cyan-700 text-white'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {tr.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-h-[200px]">
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
                  <linearGradient id="mcPriceGradient" x1="0" y1="0" x2="0" y2="1">
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
                  tickFormatter={(v: number) => `$${v.toFixed(3)}`}
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
                  labelFormatter={(ts: any) => new Date(ts).toLocaleString()}
                  formatter={(value: any) => [`$${Number(value).toFixed(4)}`, 'Price']}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  fill="url(#mcPriceGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}
