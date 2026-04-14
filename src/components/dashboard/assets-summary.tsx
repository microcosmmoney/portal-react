'use client'

import { useMCC, useMCD, useLevelProgress, useWallets, useMCCLocks, useMarketData } from '@microcosmmoney/auth-react'
import { useTranslations } from '../../i18n-context'
import { useLinkComponent } from '../../link-context'

export interface MicrocosmAssetsSummaryProps {
  basePath?: string
  onNavigate?: (path: string) => void
  accentColor?: string
}

const RANK_COLOR: Record<string, string> = {
  miner: 'text-cyan-300',
  commander: 'text-white', pioneer: 'text-cyan-400', warden: 'text-cyan-300', admiral: 'text-cyan-300',
}

export function MicrocosmAssetsSummary({ basePath = '', accentColor }: MicrocosmAssetsSummaryProps) {
  const t = useTranslations('mccDashboard')
  const Link = useLinkComponent()
  const { balance: mccData, loading: mccLoading } = useMCC(120_000)
  const { balance: mcdData } = useMCD(120_000)
  const { data: levelData } = useLevelProgress()
  const { data: wallets } = useWallets()
  const { data: locks } = useMCCLocks()
  const { data: marketData } = useMarketData()

  const resolvePath = (p: string) => basePath ? `${basePath.replace(/\/$/, '')}${p}` : p

  const mccDisplay = mccData?.balance ?? 0
  const mccPrice = (marketData as any)?.price ?? (marketData as any)?.price_usd ?? 0
  const mccUsdValue = mccPrice > 0 ? mccDisplay * mccPrice : 0
  const mcdAmount = parseFloat((mcdData as any)?.available_balance ?? '0')
  const mcdTotalReceived = parseFloat((mcdData as any)?.total_balance ?? '0')
  const mcdTotalSpent = parseFloat((mcdData as any)?.frozen_balance ?? '0')
  const walletCount = Array.isArray(wallets) ? wallets.length : 0
  const activeLocks = Array.isArray(locks) ? locks.filter((l: any) => l.status === 'locked') : []
  const lockedAmount = activeLocks.reduce((sum: number, l: any) => sum + (l.amount || 0), 0)
  const userRank = (levelData as any)?.level ?? (levelData as any)?.current_level ?? null
  const nextRank = (levelData as any)?.next_level ?? null
  const progressPercent = (levelData as any)?.progress_percent ?? 0
  const nextLevelRequirement = (levelData as any)?.next_level_requirement ?? null

  const getRankColor = (rank: string | null) => {
    if (!rank) return 'text-neutral-500'
    return RANK_COLOR[rank.toLowerCase()] || 'text-neutral-400'
  }

  const rankColor = accentColor ? undefined : getRankColor(userRank)
  const rankStyle = accentColor ? { color: accentColor } : undefined
  const spinnerBorderColor = accentColor ? { borderColor: accentColor, borderTopColor: 'transparent' } : undefined
  const spinnerClass = accentColor ? 'inline-block w-5 h-5 border-2 rounded-full animate-spin' : 'inline-block w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin'

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
      {}
      <Link href={resolvePath('/mcc/wallet')} className="block group">
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-2.5 sm:p-4 blockchain-card h-full">
          <div className="flex items-center gap-1.5 mb-2">
            <svg className="w-3.5 h-3.5 text-[#5EEAD4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-[#5EEAD4] text-[10px] font-mono tracking-widest uppercase">{t('mccBalance', 'MCC_BALANCE')}</span>
          </div>
          <div className={accentColor ? 'text-base sm:text-2xl font-bold font-mono' : 'text-base sm:text-2xl font-bold font-mono text-cyan-400'} style={accentColor ? { color: accentColor } : undefined}>
            {mccLoading
              ? <span className={spinnerClass} style={spinnerBorderColor} />
              : mccDisplay.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
            }
          </div>
          {mccUsdValue > 0 && (
            <div className="text-xs text-neutral-500 font-mono mt-1">
              ≈ ${mccUsdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          )}
        </div>
      </Link>

      {}
      <Link href={resolvePath('/mcc/mcd')} className="block group">
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-2.5 sm:p-4 blockchain-card h-full">
          <div className="flex items-center gap-1.5 mb-2">
            <svg className="w-3.5 h-3.5 text-[#5EEAD4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-[#5EEAD4] text-[10px] font-mono tracking-widest uppercase">{t('mcdBalance', 'MCD_BALANCE')}</span>
          </div>
          <div className="text-base sm:text-2xl font-bold font-mono text-white">
            {mcdAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-neutral-500 font-mono mt-1">
            {t('in', 'in')}: {mcdTotalReceived.toLocaleString('en-US', { maximumFractionDigits: 0 })} {t('out', 'out')}: {mcdTotalSpent.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </div>
        </div>
      </Link>

      {}
      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-2.5 sm:p-4 blockchain-card">
        <div className="flex items-center gap-1.5 mb-2">
          <svg className="w-3.5 h-3.5 text-[#5EEAD4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-[#5EEAD4] text-[10px] font-mono tracking-widest uppercase">{t('locked', 'LOCKED')}</span>
        </div>
        <div className="text-base sm:text-2xl font-bold font-mono text-white">
          {lockedAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
        </div>
        <div className="text-[10px] text-neutral-500 font-mono mt-1">
          {activeLocks.length} {t('lockPeriods', 'lock period')}{activeLocks.length !== 1 ? 's' : ''}
        </div>
      </div>

      {}
      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-2.5 sm:p-4 blockchain-card">
        <div className="flex items-center gap-1.5 mb-2">
          <svg className="w-3.5 h-3.5 text-[#5EEAD4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span className="text-[#5EEAD4] text-[10px] font-mono tracking-widest uppercase">{t('wallets', 'WALLETS')}</span>
        </div>
        <div className="text-base sm:text-2xl font-bold font-mono text-white">{walletCount}</div>
      </div>

      {}
      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-2.5 sm:p-4 blockchain-card">
        <div className="text-[#5EEAD4] text-[10px] font-mono tracking-widest uppercase mb-2">{t('rank', 'RANK')}</div>
        <div className={`text-lg font-bold font-mono ${rankColor ?? ''}`} style={rankStyle}>
          {userRank || t('na', 'N/A')}
        </div>
        {nextRank && (
          <div className="mt-2">
            <div className="w-full bg-neutral-800 rounded-full h-1.5">
              <div
                className={accentColor ? 'h-1.5 rounded-full transition-all' : 'bg-cyan-400 h-1.5 rounded-full transition-all'}
                style={{ width: `${Math.min(progressPercent, 100)}%`, ...(accentColor ? { backgroundColor: accentColor } : {}) }}
              />
            </div>
            <div className="text-[10px] text-neutral-500 font-mono mt-1">
              {nextLevelRequirement ? `${nextLevelRequirement.have}/${nextLevelRequirement.need} ${nextLevelRequirement.tier}` : `${progressPercent.toFixed(0)}%`} → {nextRank}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
