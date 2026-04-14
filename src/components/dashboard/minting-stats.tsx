'use client'

import { useMCCStats, useMCCPrice } from '@microcosmmoney/auth-react'
import { useTranslations } from '../../i18n-context'

const IconZap = ({ stroke = '#5EEAD4' }: { stroke?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
  </svg>
)

const IconLoader = ({ stroke = '#22d3ee' }: { stroke?: string }) => (
  <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
)

export interface MicrocosmMintingStatsProps {
  accentColor?: string
}

export function MicrocosmMintingStats({ accentColor }: MicrocosmMintingStatsProps = {}) {
  const t = useTranslations('mccDashboard')
  const { data: mccStats, loading } = useMCCStats()
  const { data: mccPriceData } = useMCCPrice()

  const s = mccStats as any
  const totalMinted = s?.circulating_supply ?? (s?.genesis_pool_balance ? 1_000_000_000 - s.genesis_pool_balance : 0)
  const currentStage = s?.current_phase ?? 0
  const difficultyRatio = 2 ** currentStage
  const nextHalving = s?.next_halving_at ?? 100_000_000
  const miningPrice = (mccPriceData as any)?.miningPrice ?? ((mccPriceData as any)?.base_price ? (mccPriceData as any).base_price * 4 : 0)

  return (
    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl blockchain-card h-full hover:border-cyan-400/50 dash-card">
      <div className="p-3 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <IconLoader stroke="#22d3ee" />
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <IconZap stroke="#5EEAD4" />
              <span className="text-[#5EEAD4] text-[10px] sm:text-xs font-mono tracking-widest uppercase">{t('mintingStats', 'MINTING_STATS')}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div className="bg-white/5 border border-white/10 rounded-lg p-2 sm:p-3 blockchain-sub-card">
                <div className="text-[10px] sm:text-xs text-[#5EEAD4] font-mono tracking-widest uppercase mb-1">{t('totalMinted', 'total_minted')}</div>
                <div className="text-sm sm:text-xl font-bold font-mono text-white truncate">
                  {totalMinted > 0
                    ? totalMinted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : '0'
                  } MCC
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-2 sm:p-3 blockchain-sub-card">
                <div className="text-[10px] sm:text-xs text-[#5EEAD4] font-mono tracking-widest uppercase mb-1">{t('miningPrice', 'mining_price')}</div>
                <div className="text-sm sm:text-xl font-bold font-mono text-cyan-400">
                  ${miningPrice > 0 ? miningPrice.toFixed(4) : '--'}
                </div>
                <div className="text-[10px] text-neutral-500 font-mono">{t('oracleX4', 'oracle \u00d7 4')}</div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-2 sm:p-3 blockchain-sub-card">
              <div className="flex justify-between items-center mb-2 text-xs sm:text-sm font-mono">
                <span className="text-neutral-400">{t('nextHalving', 'next_halving')}</span>
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
                <span>{t('phase', 'phase')}: {currentStage} | {t('difficulty', 'difficulty')}: {difficultyRatio}:1</span>
                <span>{t('threshold', 'threshold')}: {(nextHalving / 1e6).toFixed(0)}M</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
