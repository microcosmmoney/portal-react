// AI-generated · AI-managed · AI-maintained
'use client'

import { useMCC, useMCD, useUserLevel } from '@microcosmmoney/auth-react'
import { UserRank } from '@microcosmmoney/auth-core'

export interface MicrocosmAssetsSummaryProps {
  basePath?: string
  onNavigate?: (path: string) => void
}

const RANK_COLOR: Record<string, string> = {
  Recruit: 'text-neutral-500',
  Prospect: 'text-neutral-400',
  Miner: 'text-cyan-300',
  Commander: 'text-white',
  Pioneer: 'text-cyan-400',
  Warden: 'text-cyan-300',
  Admiral: 'text-cyan-300',
}

const RANK_BG: Record<string, string> = {
  Recruit: 'bg-neutral-800',
  Prospect: 'bg-neutral-800',
  Miner: 'bg-cyan-950/50',
  Commander: 'bg-white/10',
  Pioneer: 'bg-cyan-950/50',
  Warden: 'bg-cyan-950/50',
  Admiral: 'bg-cyan-950/50',
}

export function MicrocosmAssetsSummary({ basePath = '', onNavigate }: MicrocosmAssetsSummaryProps) {
  const { balance: mccData, loading: mccLoading } = useMCC(120_000)
  const { balance: mcdData, loading: mcdLoading } = useMCD(120_000)
  const { data: levelData } = useUserLevel()

  const resolvePath = (p: string) => basePath ? `${basePath.replace(/\/$/, '')}${p}` : p

  const mccBalance = mccData?.balance ?? 0
  const mcdAmount = parseFloat(mcdData?.available_balance ?? '0')
  const mcdReceived = parseFloat(mcdData?.total_balance ?? '0')
  const mcdSpent = parseFloat(mcdData?.frozen_balance ?? '0')
  const rank = levelData?.level ?? null
  const nextRank: string | null = null
  const progress = levelData?.upgrade_progress?.percentage ?? 0
  const requirementsMet: Record<string, boolean> | undefined = undefined

  const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden h-full hover:border-cyan-400/50 transition-colors">
      <div className="p-6 space-y-4">
        <div
          className="block group cursor-pointer"
          onClick={() => onNavigate?.(resolvePath('/mcc/wallet'))}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onNavigate?.(resolvePath('/mcc/wallet'))}
        >
          <div>
            <div className="text-neutral-400 text-[10px] font-mono tracking-wider mb-1">MCC_BALANCE</div>
            <div className="text-2xl font-bold font-mono text-cyan-400">
              {mccLoading
                ? <span className="inline-block w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                : fmt(mccBalance)
              }
            </div>
            <div className="text-neutral-500 text-xs font-mono mt-1">on-chain balance (API)</div>
          </div>
        </div>

        <div className="h-px bg-neutral-700" />

        <div
          className="block group cursor-pointer"
          onClick={() => onNavigate?.(resolvePath('/mcc/mcd'))}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onNavigate?.(resolvePath('/mcc/mcd'))}
        >
          <div>
            <div className="text-neutral-400 text-[10px] font-mono tracking-wider mb-1">MCD_BALANCE</div>
            <div className="text-2xl font-bold font-mono text-cyan-400">
              {mcdLoading
                ? <span className="inline-block w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                : fmt(mcdAmount)
              }
            </div>
            <div className="text-neutral-500 text-xs font-mono mt-1 space-x-3">
              <span>Income: <span className="text-white">{fmt(mcdReceived)}</span></span>
              <span>Spent: <span className="text-neutral-400">{fmt(mcdSpent)}</span></span>
            </div>
          </div>
        </div>

        <div className="h-px bg-neutral-700" />

        <div>
          <div className="text-neutral-400 text-[10px] font-mono tracking-wider mb-2">USER_RANK</div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-2.5 py-1 rounded text-sm font-bold font-mono ${RANK_COLOR[rank ?? ''] ?? 'text-neutral-500'} ${RANK_BG[rank ?? ''] ?? 'bg-neutral-800'}`}>
              {rank || 'N/A'}
            </span>
            {nextRank && (
              <span className="text-neutral-500 text-xs font-mono">→ {nextRank}</span>
            )}
          </div>

          {nextRank && (
            <div>
              <div className="flex justify-between items-center mb-1.5 text-xs font-mono">
                <span className="text-neutral-500">upgrade_progress</span>
                <span className="text-neutral-400">{progress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-2">
                <div
                  className="bg-cyan-400 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              {requirementsMet && (
                <div className="mt-2 space-y-1">
                  {Object.entries(requirementsMet).map(([req, met]) => (
                    <div key={req} className="flex items-center gap-2 text-[11px] font-mono">
                      <span className={met ? 'text-white' : 'text-neutral-600'}>
                        {met ? '[✓]' : '[ ]'}
                      </span>
                      <span className={met ? 'text-neutral-400' : 'text-neutral-600'}>
                        {req.replace(/_/g, ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!nextRank && rank && (
            <div className="bg-black border border-cyan-400/30 rounded p-2 text-center">
              <div className="text-cyan-400 font-bold text-xs font-mono">MAX LEVEL</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
