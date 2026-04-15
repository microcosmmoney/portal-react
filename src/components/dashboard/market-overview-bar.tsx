'use client'

import { useMarketData, useMCCPrice, useEcosystemOperations } from '@microcosmmoney/auth-react'

export interface MicrocosmMarketBarProps {
  accentColor?: string
}

export function MicrocosmMarketBar({ accentColor }: MicrocosmMarketBarProps = {}) {
  const { data, loading } = useMarketData()
  const { data: mccPriceData } = useMCCPrice()
  const { data: ecosystemOps } = useEcosystemOperations()

  if (loading || !data) {
    return (
      <div className="space-y-3 mb-6">
        <div className="grid grid-cols-2 xs:grid-cols-3 lg:grid-cols-6 gap-1.5 2xs:gap-2 sm:gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl blockchain-card p-2 2xs:p-2.5 sm:p-4 animate-pulse">
              <div className="h-3 bg-neutral-800 rounded w-16 mb-2" />
              <div className="h-5 sm:h-6 bg-neutral-800 rounded w-20 sm:w-24" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 xs:grid-cols-3 lg:grid-cols-6 gap-1.5 2xs:gap-2 sm:gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl blockchain-card p-2 2xs:p-2.5 sm:p-4 animate-pulse">
              <div className="h-3 bg-neutral-800 rounded w-16 mb-2" />
              <div className="h-5 sm:h-6 bg-neutral-800 rounded w-20 sm:w-24" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const displayPrice = (mccPriceData as any)?.price ?? data.price_usd ?? 0
  const priceChange24h = (data as any).price_change_24h ?? 0
  const isPositive = priceChange24h >= 0
  const basePrice = (mccPriceData as any)?.base_price ?? (mccPriceData as any)?.price_usd ?? 0
  const miningPrice = basePrice > 0 ? basePrice * 4 : 0

  const epoch = (ecosystemOps as any)?.epoch
  const buyback = (ecosystemOps as any)?.buyback
  const epochYield = epoch?.epoch_yield ?? 0
  const epochMinted = epoch?.epoch_minted ?? 0
  const epochRemaining = epochYield > epochMinted ? epochYield - epochMinted : 0
  const miningVault = epoch?.mining_vault_mcc ?? 0
  const buybackPoolUsd = buyback?.pool_usd_balance ?? null

  const buys = (data as any).buys_24h ?? 0
  const sells = (data as any).sells_24h ?? 0

  const marketStats = [
    {
      label: 'MCC_PRICE',
      value: `$${displayPrice.toFixed(4)}`,
      sub: `${isPositive ? '~+' : '~'}${priceChange24h.toFixed(2)}%`,
      subColor: isPositive ? 'text-cyan-400' : 'text-red-400',
      color: 'text-cyan-400',
    },
    {
      label: 'MINING_PRICE',
      value: miningPrice > 0 ? `$${miningPrice.toFixed(4)}` : '--',
      sub: basePrice > 0 ? `base: $${basePrice.toFixed(4)}` : '',
      subColor: 'text-neutral-500',
      color: 'text-cyan-300',
    },
    {
      label: '24H_VOLUME',
      value: `$${formatCompact((data as any).volume_24h ?? 0)}`,
      color: 'text-white',
    },
    {
      label: 'LIQUIDITY',
      value: ((data as any).liquidity_usd ?? 0) > 0 ? `$${formatCompact((data as any).liquidity_usd)}` : '-',
      color: 'text-white',
    },
    {
      label: 'FDV',
      value: ((data as any).fdv ?? 0) > 0 ? `$${formatCompact((data as any).fdv)}` : '-',
      color: 'text-white',
    },
    {
      label: 'BUY/SELL',
      value: `${buys}/${sells}`,
      sub: `${buys + sells} trades`,
      subColor: 'text-neutral-500',
      color: 'text-white',
    },
  ]

  const protocolStats = [
    {
      label: 'EPOCH',
      value: epoch ? `#${epoch.current_epoch}` : '--',
      sub: '2140 Protocol',
      subColor: 'text-neutral-500',
      color: 'text-cyan-400',
    },
    {
      label: 'EPOCH_YIELD',
      value: epochYield > 0 ? formatMCC(epochYield) : '--',
      sub: 'MCC / epoch',
      subColor: 'text-neutral-500',
      color: 'text-white',
    },
    {
      label: 'EPOCH_MINTED',
      value: epochMinted > 0 ? formatMCC(epochMinted) : '0',
      sub: epochYield > 0 ? `${((epochMinted / epochYield) * 100).toFixed(1)}% used` : '',
      subColor: 'text-neutral-500',
      color: 'text-cyan-300',
    },
    {
      label: 'REMAINING',
      value: formatMCC(epochRemaining),
      sub: 'this epoch',
      subColor: 'text-neutral-500',
      color: 'text-white',
    },
    {
      label: 'MINING_VAULT',
      value: miningVault > 0 ? formatCompact(miningVault) : '--',
      sub: 'MCC reserve',
      subColor: 'text-neutral-500',
      color: 'text-white',
    },
    {
      label: 'POOL_BALANCE',
      value: buybackPoolUsd != null ? `$${formatCompact(buybackPoolUsd)}` : '--',
      sub: 'USDC+USDT',
      subColor: 'text-neutral-500',
      color: 'text-white',
    },
  ]

  return (
    <div className="space-y-1.5 2xs:space-y-2 sm:space-y-3 mb-3 2xs:mb-4 sm:mb-6">
      <div className="grid grid-cols-2 xs:grid-cols-3 lg:grid-cols-6 gap-1.5 2xs:gap-2 sm:gap-3">
        {marketStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      <div className="grid grid-cols-2 xs:grid-cols-3 lg:grid-cols-6 gap-1.5 2xs:gap-2 sm:gap-3">
        {protocolStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, subColor, color }: {
  label: string
  value: string
  sub?: string
  subColor?: string
  color: string
}) {
  return (
    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl blockchain-card p-2 2xs:p-2.5 sm:p-4">
      <div className="text-[#5EEAD4] text-[8px] 2xs:text-[9px] sm:text-[10px] font-mono mb-0.5 sm:mb-1 tracking-widest uppercase truncate">
        {label}
      </div>
      <div className={`text-sm 2xs:text-base xs:text-lg sm:text-xl font-bold font-mono truncate ${color}`}>
        {value}
      </div>
      {sub && (
        <div className={`hidden xs:block text-[10px] sm:text-xs font-mono mt-0.5 truncate ${subColor || 'text-neutral-500'}`}>
          {sub}
        </div>
      )}
    </div>
  )
}

function formatCompact(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return value.toFixed(2)
}

function formatMCC(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`
  return value.toFixed(2)
}
