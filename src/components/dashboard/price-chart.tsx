'use client'

import { useState, useId } from 'react'
import { usePriceHistory } from '@microcosmmoney/auth-react'
import { useTranslations } from '../../i18n-context'
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

export interface MicrocosmPriceChartProps {
  accentColor?: string
}

export function MicrocosmPriceChart({ accentColor }: MicrocosmPriceChartProps = {}) {
  const t = useTranslations('mccDashboard')
  const [range, setRange] = useState<TimeRange>('7D')
  const { data, loading } = usePriceHistory(range)
  const gradientId = useId().replace(/:/g, '_') + '_mcPriceGradient'

  const ac = accentColor || '#22d3ee'

  const raw = data as any
  const items: any[] = Array.isArray(raw) ? raw : raw?.records ?? []
  const chartData = items.map((item: any) => ({
    time: typeof item.timestamp === 'number'
      ? (item.timestamp < 1e12 ? item.timestamp * 1000 : item.timestamp)
      : new Date(item.timestamp).getTime(),
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
    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl overflow-hidden blockchain-card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1 bg-black p-0.5 rounded">
            {timeRanges.map((tr) => (
              <button
                key={tr.value}
                onClick={() => setRange(tr.value)}
                className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded transition-colors ${
                  range === tr.value
                    ? (accentColor ? 'text-white' : 'bg-cyan-700 text-white')
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
                style={range === tr.value && accentColor ? { backgroundColor: accentColor, opacity: 0.8 } : undefined}
              >
                {tr.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[360px]">
          {loading ? (
            <div className="h-full bg-neutral-800 rounded animate-pulse" />
          ) : chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-neutral-500 font-mono text-sm">
              {t('noPriceData', 'No price data available')}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={ac} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={ac} stopOpacity={0} />
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
                  formatter={(value: any) => [`$${Number(value).toFixed(4)}`, t('price', 'Price')]}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={ac}
                  strokeWidth={2}
                  fill={`url(#${gradientId})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}
