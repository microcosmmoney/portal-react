'use client'

import { useMarketData } from '@microcosmmoney/auth-react'
import { useTranslations } from '../../i18n-context'

function formatCompact(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return value.toFixed(2)
}

export interface MicrocosmMarketBarProps {
  accentColor?: string
}

export function MicrocosmMarketBar({ accentColor }: MicrocosmMarketBarProps = {}) {
  const t = useTranslations('mccDashboard')
  const { data, loading } = useMarketData()
  const ac = accentColor || '#22d3ee'

  if (loading || !data) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl blockchain-card p-4 animate-pulse">
            <div className="h-3 bg-neutral-800 rounded w-16 mb-2" />
            <div className="h-6 bg-neutral-800 rounded w-24" />
          </div>
        ))}
      </div>
    )
  }

  const priceChange24h = data.price_change_24h ?? 0
  const isPositive = priceChange24h >= 0
  const buys = (data as any).buys_24h ?? 0
  const sells = (data as any).sells_24h ?? 0
  const trades = buys + sells

  const stats: { label: string; value: string; sub?: string; subColor?: string; subStyle?: React.CSSProperties; color: string; colorStyle?: React.CSSProperties }[] = [
    {
      label: t('mccPrice', 'MCC_PRICE'),
      value: `$${(data.price_usd ?? 0).toFixed(4)}`,
      sub: `${isPositive ? '~+' : '~'}${priceChange24h.toFixed(2)}%`,
      subColor: isPositive ? (accentColor ? '' : 'text-cyan-400') : 'text-red-400',
      subStyle: isPositive && accentColor ? { color: accentColor } : undefined,
      color: accentColor ? '' : 'text-cyan-400',
      colorStyle: accentColor ? { color: accentColor } : undefined,
    },
    { label: t('volume24h', '24H_VOLUME'), value: `$${formatCompact(data.volume_24h ?? 0)}`, color: accentColor ? '' : 'text-cyan-300', colorStyle: accentColor ? { color: accentColor } : undefined },
    { label: t('liquidity', 'LIQUIDITY'), value: (data.liquidity_usd ?? 0) > 0 ? `$${formatCompact(data.liquidity_usd)}` : '-', color: 'text-white' },
    { label: t('fdv', 'FDV'), value: (data.fdv ?? 0) > 0 ? `$${formatCompact(data.fdv)}` : '-', color: 'text-white' },
    { label: t('trades24h', '24H_TRADES'), value: `${trades}`, color: accentColor ? '' : 'text-cyan-400', colorStyle: accentColor ? { color: accentColor } : undefined },
    { label: t('buySell', 'BUY/SELL'), value: `${buys}/${sells}`, color: 'text-white' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl blockchain-card p-4"
        >
          <div className="text-[#5EEAD4] text-[10px] font-mono mb-1 tracking-widest uppercase">
            {stat.label}
          </div>
          <div className={`text-xl font-bold font-mono ${stat.color}`} style={stat.colorStyle}>
            {stat.value}
          </div>
          {stat.sub && (
            <div className={`text-xs font-mono mt-0.5 ${stat.subColor || 'text-neutral-500'}`} style={stat.subStyle}>
              {stat.sub}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
