// AI-generated · AI-managed · AI-maintained
'use client'

import { useUserLevel } from '@microcosmmoney/auth-react'
import { UserRank } from '@microcosmmoney/auth-core'

const RANK_LABELS: Record<string, string> = {
  Recruit: 'Recruit',
  Prospect: 'Prospect',
  Miner: 'Miner',
  Commander: 'Commander',
  Pioneer: 'Pioneer',
  Warden: 'Warden',
  Admiral: 'Admiral',
}

const RANK_COLORS: Record<string, string> = {
  Recruit: 'text-neutral-500',
  Prospect: 'text-neutral-400',
  Miner: 'text-cyan-300',
  Commander: 'text-white',
  Pioneer: 'text-cyan-400',
  Warden: 'text-cyan-300',
  Admiral: 'text-cyan-300',
}

interface CompanionYieldRow {
  label: string
  share: string
  type: string
}

function getCompanionYield(rank: string | null): CompanionYieldRow[] {
  if (!rank) return []

  if (rank === UserRank.RECRUIT || rank === UserRank.PROSPECT) {
    return [
      { label: 'Team', share: '100%', type: 'MCC' },
    ]
  }

  return [
    { label: 'Team', share: '10%', type: 'MCC' },
    { label: 'Magistrate', share: '10%', type: 'MCC' },
    { label: 'Station Vault', share: '30%', type: 'MCD' },
  ]
}

export function MicrocosmMiningWeight() {
  const { data, loading } = useUserLevel()

  const rank = data?.level ?? null
  const miningDays = data?.upgrade_progress?.current_days ?? 0
  const companionYield = getCompanionYield(rank)

  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg h-full hover:border-cyan-400/50 transition-colors">
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <span className="inline-block w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-neutral-800 rounded p-3">
                <div className="text-neutral-400 text-xs font-mono tracking-wider mb-1">level</div>
                <div className={`text-sm font-bold font-mono ${RANK_COLORS[rank ?? ''] ?? 'text-neutral-500'}`}>
                  {rank ? RANK_LABELS[rank] ?? rank : 'N/A'}
                </div>
              </div>
              <div className="bg-neutral-800 rounded p-3">
                <div className="text-neutral-400 text-xs font-mono tracking-wider mb-1">tech_tree</div>
                <div className="text-sm font-bold font-mono text-white">-10%</div>
                <div className="text-[10px] text-neutral-500 font-mono">mining discount</div>
              </div>
              <div className="bg-neutral-800 rounded p-3">
                <div className="text-neutral-400 text-xs font-mono tracking-wider mb-1">mining_days</div>
                <div className="text-sm font-bold font-mono text-white">{miningDays}</div>
                <div className="text-[10px] text-neutral-500 font-mono">cumulative</div>
              </div>
            </div>

            <div className="bg-neutral-800 rounded p-3">
              <div className="text-neutral-400 text-xs font-mono tracking-wider mb-3">companion_yield</div>
              <p className="text-[10px] text-neutral-500 font-mono mb-3">
                Each mining produces companion yield, auto-injected into territory ecosystem
              </p>

              <div className="space-y-2">
                {companionYield.map((row) => (
                  <div key={row.label} className="flex items-center justify-between px-2 py-1.5 bg-neutral-900 rounded hover:bg-neutral-700 transition-colors">
                    <span className="text-xs font-mono text-neutral-300">{row.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white">{row.share}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-400">
                        {row.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {rank && (rank === UserRank.RECRUIT || rank === UserRank.PROSPECT) && (
                <div className="mt-3 text-[10px] text-neutral-500 font-mono border-t border-neutral-700 pt-2">
                  Upgrade to Miner to unlock Magistrate + Station Vault distribution
                </div>
              )}
            </div>

            <div className="text-[10px] text-neutral-500 font-mono space-y-1">
              <div>Mining price = Oracle price × 2 (user receives 100% MCC)</div>
              <div>Companion yield syncs 1:1 with user mining amount</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
