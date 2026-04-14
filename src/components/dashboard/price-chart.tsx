'use client'

import { useState, useEffect, useId } from 'react'
import { usePriceHistory, useMicrocosmApi } from '@microcosmmoney/auth-react'
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

type PriceTimeRange = '1D' | '7D' | '30D' | '1Y'

const TIME_RANGES: { label: string; value: PriceTimeRange }[] = [
  { label: '1D', value: '1D' },
  { label: '7D', value: '7D' },
  { label: '30D', value: '30D' },
  { label: '1Y', value: '1Y' },
]

function computeChange(data: any[] | null): number | null {
  if (!data || data.length < 2) return null
  const prices = data
    .map((d) => d.market_price ?? d.close ?? d.price ?? 0)
    .filter((p: number) => p > 0)
  if (prices.length < 2) return null
  const first = prices[0]
  const last = prices[prices.length - 1]
  if (first <= 0) return null
  return ((last - first) / first) * 100
}

export interface MicrocosmPriceChartProps {
  accentColor?: string
}

export function MicrocosmPriceChart({ accentColor }: MicrocosmPriceChartProps = {}) {
  const t = useTranslations('mccDashboard')
  const api = useMicrocosmApi()
  const [range, setRange] = useState<PriceTimeRange>('7D')
  const { data, loading } = usePriceHistory(range as any)
  const gradientId = useId().replace(/:/g, '_') + '_mcPriceGradient'

  const ac = accentColor || '#22d3ee'

  const [rangeChanges, setRangeChanges] = useState<Record<string, number | null>>({})

  useEffect(() => {
    const ranges: PriceTimeRange[] = ['1D', '7D', '30D', '1Y']
    ranges.forEach(async (r) => {
      try {
        const json: any = await api.get(`/stats/price-history?range=${r}`)
        const payload = json?.data ?? json
        if (Array.isArray(payload)) {
          setRangeChanges(prev => ({ ...prev, [r]: computeChange(payload) }))
        } else if (payload?.records) {
          setRangeChanges(prev => ({ ...prev, [r]: computeChange(payload.records) }))
        }
      } catch {}
    })
  }, [api])

  const raw = data as any
  const items: any[] = Array.isArray(raw) ? raw : raw?.records ?? []
  const chartData = items.map((item: any) => ({
    time: typeof item.timestamp === 'number'
      ? (item.timestamp < 1e12 ? item.timestamp * 1000 : item.timestamp)
      : new Date(item.timestamp).getTime(),
    price: item.market_price ?? item.close ?? item.price ?? 0,
  })).filter((d: any) => d.price > 0)

  const prices = chartData.map((d: any) => d.price)
  const minPrice = prices.length > 0 ? Math.min(...prices) * 0.995 : 0
  const maxPrice = prices.length > 0 ? Math.max(...prices) * 1.005 : 1
  const currentPrice = prices.length > 0 ? prices[prices.length - 1] : null

  const formatTime = (ts: number) => {
    const d = new Date(ts)
    if (range === '1D') return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl overflow-hidden blockchain-card">
      <div className="flex flex-col sm:flex-row items-stretch border-b border-white/10">
        <div className="flex flex-1 flex-col justify-center gap-1 px-3 py-2 sm:px-6 sm:py-4">
          <div className="text-white font-mono font-bold text-sm sm:text-base">
            {t('mccPriceTrend', 'MCC Price Trend')}
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
                className={`relative z-10 flex flex-1 flex-col justify-center gap-1 border-t border-white/10 px-4 py-3 text-left even:border-l even:border-white/10 sm:border-t-0 sm:border-l sm:border-white/10 sm:px-5 sm:py-4 transition-colors ${
                  isActive ? 'bg-white/10' : 'hover:bg-white/5'
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
