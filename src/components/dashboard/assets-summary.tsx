'use client'

import { useMCC, useMCD, useLevelProgress, useWallets, useMCCLocks, useMarketData } from '@microcosmmoney/auth-react'

export interface MicrocosmAssetsSummaryProps {
  basePath?: string
  onNavigate?: (path: string) => void
  accentColor?: string
}

const RANK_COLOR: Record<string, string> = {
  miner: 'text-cyan-300',
  commander: 'text-white', pioneer: 'text-cyan-400', warden: 'text-cyan-300', admiral: 'text-cyan-300',
}

export function MicrocosmAssetsSummary({ basePath = '', onNavigate, accentColor }: MicrocosmAssetsSummaryProps) {
  const { balance: mccData, loading: mccLoading } = useMCC(120_000)
  const { balance: mcdData, loading: mcdLoading } = useMCD(120_000)
  const { data: levelData } = useLevelProgress()
  const { data: wallets } = useWallets()
  const { data: locks } = useMCCLocks()
  const { data: marketData } = useMarketData()

  const resolvePath = (p: string) => basePath ? `${basePath.replace(/\/$/, '')}${p}` : p

  const mccBalance = mccData?.balance ?? 0
  const mccPrice = marketData?.price_usd ?? 0
  const mccUsdValue = mccPrice > 0 ? mccBalance * mccPrice : 0
  const mcdAmount = parseFloat(mcdData?.available_balance ?? '0')
  const mcdReceived = parseFloat(mcdData?.total_balance ?? '0')
  const mcdSpent = parseFloat(mcdData?.frozen_balance ?? '0')
  const walletCount = Array.isArray(wallets) ? wallets.length : 0
  const activeLocks = Array.isArray(locks) ? locks.filter((l: any) => l.status === 'locked') : []
  const lockedAmount = activeLocks.reduce((sum: number, l: any) => sum + (l.amount || 0), 0)
  const rank = levelData?.level ?? null
  const nextRank = (levelData as any)?.next_level ?? null
  const progress = levelData?.progress_percent ?? 0

  const fmt = (n: number, d = 2) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })

  const rankColor = accentColor
    ? undefined
    : RANK_COLOR[(rank ?? '').toLowerCase()] ?? 'text-neutral-500'
  const rankStyle = accentColor ? { color: accentColor } : undefined

  const spinnerBorderColor = accentColor ? { borderColor: accentColor, borderTopColor: 'transparent' } : undefined
  const spinnerClass = accentColor ? 'inline-block w-5 h-5 border-2 rounded-full animate-spin' : 'inline-block w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin'

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {/* MCC Balance */}
      <div
        className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 hover:border-cyan-400/50 transition-colors cursor-pointer h-full"
        onClick={() => onNavigate?.(resolvePath('/mcc/wallet'))}
        role="button" tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onNavigate?.(resolvePath('/mcc/wallet'))}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="text-neutral-400 text-[10px] font-mono tracking-wider">MCC_BALANCE</span>
        </div>
        <div className={accentColor ? 'text-2xl font-bold font-mono' : 'text-2xl font-bold font-mono text-cyan-400'} style={accentColor ? { color: accentColor } : undefined}>
          {mccLoading
            ? <span className={spinnerClass} style={spinnerBorderColor} />
            : fmt(mccBalance, 3)
          }
        </div>
        {mccUsdValue > 0 && (
          <div className="text-xs text-neutral-500 font-mono mt-1">
            ≈ ${fmt(mccUsdValue)}
          </div>
        )}
      </div>

      {/* MCD Balance */}
      <div
        className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 hover:border-cyan-400/50 transition-colors cursor-pointer h-full"
        onClick={() => onNavigate?.(resolvePath('/mcc/mcd'))}
        role="button" tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onNavigate?.(resolvePath('/mcc/mcd'))}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span className="text-neutral-400 text-[10px] font-mono tracking-wider">MCD_BALANCE</span>
        </div>
        <div className="text-2xl font-bold font-mono text-white">
          {mcdLoading
            ? <span className={spinnerClass} style={spinnerBorderColor} />
            : fmt(mcdAmount)
          }
        </div>
        <div className="text-[10px] text-neutral-500 font-mono mt-1">
          in: {fmt(mcdReceived, 0)} out: {fmt(mcdSpent, 0)}
        </div>
      </div>

      {/* Locked */}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 hover:border-cyan-400/50 transition-colors">
        <div className="flex items-center gap-1.5 mb-2">
          <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-neutral-400 text-[10px] font-mono tracking-wider">LOCKED</span>
        </div>
        <div className="text-2xl font-bold font-mono text-white">{fmt(lockedAmount, 0)}</div>
        <div className="text-[10px] text-neutral-500 font-mono mt-1">
          {activeLocks.length} lock period{activeLocks.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Wallets */}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 hover:border-cyan-400/50 transition-colors">
        <div className="flex items-center gap-1.5 mb-2">
          <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span className="text-neutral-400 text-[10px] font-mono tracking-wider">WALLETS</span>
        </div>
        <div className="text-2xl font-bold font-mono text-white">{walletCount}</div>
      </div>

      {/* Rank */}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 hover:border-cyan-400/50 transition-colors">
        <div className="text-neutral-400 text-[10px] font-mono tracking-wider mb-2">RANK</div>
        <div className={`text-lg font-bold font-mono ${rankColor ?? ''}`} style={rankStyle}>
          {rank || 'N/A'}
        </div>
        {nextRank && (
          <div className="mt-2">
            <div className="w-full bg-neutral-800 rounded-full h-1.5">
              <div
                className={accentColor ? 'h-1.5 rounded-full transition-all' : 'bg-cyan-400 h-1.5 rounded-full transition-all'}
                style={{ width: `${Math.min(progress, 100)}%`, ...(accentColor ? { backgroundColor: accentColor } : {}) }}
              />
            </div>
            <div className="text-[10px] text-neutral-500 font-mono mt-1">
              {progress.toFixed(0)}% → {nextRank}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
