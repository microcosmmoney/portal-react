// AI-generated · AI-managed · AI-maintained
'use client'

import { useState, useEffect } from 'react'
import { useMarketData } from '../../hooks/useMarketData'
import { useMCCPrice } from '../../contexts/MCCPriceContext'

interface EpochData {
  current_epoch: number
  epoch_minted: number
  epoch_yield: number
  mining_vault_mcc: number
}

export default function MarketOverviewBar() {
  const { data, loading } = useMarketData()
  const ticker = useMCCPrice()
  const [epoch, setEpoch] = useState<EpochData | null>(null)
  const [buybackPoolUsd, setBuybackPoolUsd] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/stats/custody-vaults')
      .then(r => r.json())
      .then(json => {
        if (json.success !== false && json.data) {
          const d = json.data
          if (d.epoch) setEpoch(d.epoch)
          if (d.buyback?.pool_usd_balance != null) setBuybackPoolUsd(d.buyback.pool_usd_balance)
        }
      })
      .catch(() => {})
  }, [])

  if (loading || !data) {
    return (
      <div className="space-y-3 mb-6">
        <div className="grid grid-cols-2 xs:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 sm:p-4 animate-pulse">
              <div className="h-3 bg-neutral-800 rounded w-16 mb-2" />
              <div className="h-5 sm:h-6 bg-neutral-800 rounded w-20 sm:w-24" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 xs:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 sm:p-4 animate-pulse">
              <div className="h-3 bg-neutral-800 rounded w-16 mb-2" />
              <div className="h-5 sm:h-6 bg-neutral-800 rounded w-20 sm:w-24" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const displayPrice = ticker.price ?? data.price
  const priceChange24h = data.priceChange.h24
  const isPositive = priceChange24h >= 0
  const miningPrice = ticker.miningPrice ?? 0
  const basePrice = ticker.basePrice ?? 0

  const epochYield = epoch?.epoch_yield ?? 0
  const epochMinted = epoch?.epoch_minted ?? 0
  const epochRemaining = epochYield > epochMinted ? epochYield - epochMinted : 0
  const miningVault = epoch?.mining_vault_mcc ?? 0

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
      value: `$${formatCompact(data.volume.h24)}`,
      color: 'text-white',
    },
    {
      label: 'LIQUIDITY',
      value: data.liquidityUsd > 0 ? `$${formatCompact(data.liquidityUsd)}` : '-',
      color: 'text-white',
    },
    {
      label: 'FDV',
      value: data.fdvUsd > 0 ? `$${formatCompact(data.fdvUsd)}` : '-',
      color: 'text-white',
    },
    {
      label: 'BUY/SELL',
      value: `${data.txns?.h24?.buys ?? 0}/${data.txns?.h24?.sells ?? 0}`,
      sub: `${(data.txns?.h24?.buys ?? 0) + (data.txns?.h24?.sells ?? 0)} trades`,
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
    <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
      <div className="grid grid-cols-2 xs:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {marketStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      <div className="grid grid-cols-2 xs:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
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
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 sm:p-4 hover:border-cyan-400/50 dash-card">
      <div className="text-neutral-400 text-[9px] sm:text-[10px] font-mono mb-0.5 sm:mb-1 tracking-wider">
        {label}
      </div>
      <div className={`text-sm xs:text-base sm:text-xl font-bold font-mono truncate ${color}`}>
        {value}
      </div>
      {sub && (
        <div className={`text-[10px] sm:text-xs font-mono mt-0.5 truncate ${subColor || 'text-neutral-500'}`}>
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
