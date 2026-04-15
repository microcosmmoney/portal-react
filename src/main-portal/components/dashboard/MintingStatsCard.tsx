// AI-generated · AI-managed · AI-maintained
'use client'

import { Card, CardContent } from '../ui/card'
import { useMCCStats } from '../../hooks/useStats'
import { useMCCPrice } from '../../contexts/MCCPriceContext'
import { Loader2, Zap } from 'lucide-react'

export default function MintingStatsCard() {
  const { data: mccStats, loading: mccLoading } = useMCCStats()
  const ticker = useMCCPrice()

  const loading = mccLoading

  // total_minted from blockchain stats (raw 9-decimal → human)
  const totalMinted = mccStats?.circulating_supply
    ?? (mccStats?.genesis_pool_balance ? 1_000_000_000 - mccStats.genesis_pool_balance : 0)
  const currentStage = mccStats?.current_phase ?? 0
  const difficultyRatio = 2 ** currentStage
  const nextHalving = mccStats?.next_halving_at ?? 100_000_000
  const miningPrice = ticker.miningPrice ?? 0

  return (
    <Card className="bg-neutral-900 border-neutral-700 h-full hover:border-cyan-400/50 dash-card">
      <CardContent className="p-3 sm:p-6">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-neutral-400 text-[10px] sm:text-xs font-mono tracking-wider">MINTING_STATS</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div className="bg-neutral-800 rounded p-2 sm:p-3">
              <div className="text-[10px] sm:text-xs text-neutral-400 font-mono tracking-wider mb-1">total_minted</div>
              <div className="text-sm sm:text-xl font-bold font-mono text-white truncate">
                {totalMinted > 0
                  ? totalMinted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : '0'
                } MCC
              </div>
            </div>
            <div className="bg-neutral-800 rounded p-2 sm:p-3">
              <div className="text-[10px] sm:text-xs text-neutral-400 font-mono tracking-wider mb-1">mining_price</div>
              <div className="text-sm sm:text-xl font-bold font-mono text-cyan-400">
                ${miningPrice > 0 ? miningPrice.toFixed(4) : '--'}
              </div>
              <div className="text-[10px] text-neutral-500 font-mono">oracle × 4</div>
            </div>
          </div>

          <div className="bg-neutral-800 rounded p-2 sm:p-3">
            <div className="flex justify-between items-center mb-2 text-xs sm:text-sm font-mono">
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
                className="bg-cyan-400 h-2 rounded-full transition-all"
                style={{
                  width: nextHalving > 0 ? `${Math.min((totalMinted % nextHalving) / nextHalving * 100, 100)}%` : '0%',
                }}
              />
            </div>
            <div className="flex justify-between items-center mt-2 text-[10px] sm:text-xs text-neutral-500 font-mono">
              <span>phase: {currentStage} | difficulty: {difficultyRatio}:1</span>
              <span>threshold: {(nextHalving / 1e6).toFixed(0)}M</span>
            </div>
          </div>
        </div>
      )}
      </CardContent>
    </Card>
  )
}
