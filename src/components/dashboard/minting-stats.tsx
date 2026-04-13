'use client'

import { useMCCStats, useMarketData } from '@microcosmmoney/auth-react'

export interface MicrocosmMintingStatsProps {
  accentColor?: string
}

export function MicrocosmMintingStats({ accentColor }: MicrocosmMintingStatsProps = {}) {
  const { data: mccStats, loading } = useMCCStats()
  const { data: marketData } = useMarketData()

  const s = mccStats as any
  const totalMinted = s?.circulating_supply ?? 0
  const currentStage = s?.current_phase ?? 0
  const miningRate = s?.current_mining_rate ?? 0
  const nextHalving = s?.next_halving_at ?? 100_000_000
  const price = marketData?.price_usd ?? 0

  const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const spinnerBorderColor = accentColor ? { borderColor: accentColor, borderTopColor: 'transparent' } : undefined
  const spinnerClass = accentColor ? 'inline-block w-5 h-5 border-2 rounded-full animate-spin' : 'inline-block w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin'

  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg h-full hover:border-cyan-400/50 transition-colors">
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <span className={spinnerClass} style={spinnerBorderColor} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={accentColor ? '' : 'text-cyan-400'} style={accentColor ? { color: accentColor } : undefined}>⚡</span>
              <span className="text-neutral-400 text-xs font-mono tracking-wider">MINTING_STATS</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-800 rounded p-3">
                <div className="text-xs text-neutral-400 font-mono tracking-wider mb-1">total_minted</div>
                <div className="text-xl font-bold font-mono text-white">
                  {totalMinted > 0 ? fmt(totalMinted) : '0'} MCC
                </div>
              </div>
              <div className="bg-neutral-800 rounded p-3">
                <div className="text-xs text-neutral-400 font-mono tracking-wider mb-1">mining_price</div>
                <div className={accentColor ? 'text-xl font-bold font-mono' : 'text-xl font-bold font-mono text-cyan-400'} style={accentColor ? { color: accentColor } : undefined}>
                  ${price > 0 ? (price * 2).toFixed(4) : '--'}
                </div>
                <div className="text-[10px] text-neutral-500 font-mono">market × 2</div>
              </div>
            </div>

            <div className="bg-neutral-800 rounded p-3">
              <div className="flex justify-between items-center mb-2 text-sm font-mono">
                <span className="text-neutral-400">next_halving</span>
                <span className="text-white">
                  {nextHalving > totalMinted
                    ? (nextHalving - totalMinted).toLocaleString('en-US', { maximumFractionDigits: 0 })
                    : 'N/A'
                  } MCC
                </span>
              </div>
              <div className="w-full bg-neutral-700 rounded-full h-2">
                <div
                  className={accentColor ? 'h-2 rounded-full transition-all' : 'bg-cyan-400 h-2 rounded-full transition-all'}
                  style={{
                    width: nextHalving > 0 ? `${Math.min((totalMinted % nextHalving) / nextHalving * 100, 100)}%` : '0%',
                    ...(accentColor ? { backgroundColor: accentColor } : {}),
                  }}
                />
              </div>
              <div className="flex justify-between items-center mt-2 text-xs text-neutral-500 font-mono">
                <span>phase: {currentStage} | rate: {miningRate > 0 ? `${miningRate}:1` : '--'}</span>
                <span>threshold: {(nextHalving / 1e6).toFixed(0)}M</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
