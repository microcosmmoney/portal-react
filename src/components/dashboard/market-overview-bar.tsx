// AI-generated · AI-managed · AI-maintained
'use client'

import { useMarketData } from '@microcosmmoney/auth-react'

function formatCompact(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return value.toFixed(2)
}

export function MicrocosmMarketBar() {
  const { data, loading } = useMarketData()

  if (loading || !data) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 animate-pulse">
            <div className="h-3 bg-neutral-800 rounded w-16 mb-2" />
            <div className="h-6 bg-neutral-800 rounded w-24" />
          </div>
        ))}
      </div>
    )
  }

  const priceChange24h = data.price_change_24h ?? 0
  const isPositive = priceChange24h >= 0

  const stats = [
    { label: 'MCC_PRICE', value: `$${(data.price_usd ?? 0).toFixed(4)}`, color: 'text-cyan-400' },
    { label: '24H_CHANGE', value: `${isPositive ? '+' : ''}${priceChange24h.toFixed(2)}%`, color: isPositive ? 'text-white' : 'text-red-400' },
    { label: '24H_VOLUME', value: `$${formatCompact(data.volume_24h ?? 0)}`, color: 'text-cyan-300' },
    { label: 'LIQUIDITY', value: `$${formatCompact(data.liquidity_usd ?? 0)}`, color: 'text-cyan-400' },
    { label: 'FDV', value: `$${formatCompact(data.fdv ?? 0)}`, color: 'text-white' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 hover:border-cyan-400/50 transition-colors"
        >
          <div className="text-neutral-400 text-[10px] font-mono mb-1 tracking-wider">
            {stat.label}
          </div>
          <div className={`text-xl font-bold font-mono ${stat.color}`}>
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  )
}
