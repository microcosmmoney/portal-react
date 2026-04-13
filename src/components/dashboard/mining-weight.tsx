'use client'

import { useLevelProgress, useTechBonusDetail, useMiningStats } from '@microcosmmoney/auth-react'

const RANK_LABELS: Record<string, string> = {
  Miner: 'Miner \u77ff\u5de5',
  Commander: 'Commander \u6307\u6325\u5b98',
  Pioneer: 'Pioneer \u5148\u9a71',
  Warden: 'Warden \u5b88\u671b\u8005',
  Admiral: 'Admiral \u5143\u5e05',
}

const RANK_COLORS: Record<string, string> = {
  Miner: 'text-cyan-300',
  Commander: 'text-white',
  Pioneer: 'text-cyan-400',
  Warden: 'text-cyan-300',
  Admiral: 'text-cyan-300',
}

/* Inline SVG icons (16x16, stroke-based) */
const IconShield = ({ stroke = '#22d3ee' }: { stroke?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
  </svg>
)

const IconTree = ({ stroke = '#22d3ee' }: { stroke?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22v-7" />
    <path d="M7 15h10" />
    <path d="m12 2-5.5 9h11Z" />
    <path d="m12 7-4 6h8Z" />
  </svg>
)

const IconCalendar = ({ stroke = '#22d3ee' }: { stroke?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
)

const IconPickaxe = ({ stroke = '#22d3ee' }: { stroke?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.531 12.469 6.619 20.38a1 1 0 1 1-3-3l7.912-7.912" />
    <path d="M15.686 4.314A12.5 12.5 0 0 0 5.461 2.958l-.834 2.22a5.25 5.25 0 0 0 4.626 7.065l.172-.003a5.25 5.25 0 0 0 5.022-3.89l.39-1.507a12.5 12.5 0 0 0 .849-2.53Z" />
  </svg>
)

interface CompanionYieldRow {
  label: string
  share: string
  type: string
}

function getCompanionYield(rank: string | null): CompanionYieldRow[] {
  if (!rank) return []

  return [
    { label: '\u653f\u52a1\u5b98', share: '40%', type: 'MCC' },
    { label: 'LP \u6d41\u52a8\u6027', share: '30%', type: 'MCC' },
    { label: '\u9886\u5730\u91d1\u5e93', share: '30%', type: 'MCD' },
  ]
}

export interface MicrocosmMiningWeightProps {
  accentColor?: string
}

export function MicrocosmMiningWeight({ accentColor }: MicrocosmMiningWeightProps = {}) {
  const { data, loading: loadingLevel } = useLevelProgress()
  const { data: techBonus, loading: loadingTech } = useTechBonusDetail()
  const { data: miningStats, loading: loadingMining } = useMiningStats()

  const loading = loadingLevel || loadingTech || loadingMining
  const ac = accentColor || '#22d3ee'

  const rank = data?.current_rank?.toLowerCase() ?? null
  const totalHoldings = data ? (data.holdings.station + data.holdings.matrix + data.holdings.sector + data.holdings.system) : 0
  const miningDays = totalHoldings > 0 ? totalHoldings : ((miningStats as any)?.active_days_30d ?? 0)
  const companionYield = getCompanionYield(rank)

  const bonusMultiplier = (techBonus as any)?.bonus_multiplier ?? 0
  const discountPct = bonusMultiplier > 0 ? `+${(bonusMultiplier * 100).toFixed(0)}%` : '0%'

  const spinnerBorderColor = accentColor ? { borderColor: accentColor, borderTopColor: 'transparent' } : undefined
  const spinnerClass = accentColor ? 'inline-block w-5 h-5 border-2 rounded-full animate-spin' : 'inline-block w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin'

  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg h-full hover:border-cyan-400/50 transition-colors">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <IconPickaxe stroke={ac} />
          <span className="text-neutral-400 text-xs font-mono tracking-wider">MINING_WEIGHT</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <span className={spinnerClass} style={spinnerBorderColor} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-neutral-800 rounded p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <IconShield stroke={ac} />
                  <span className="text-neutral-400 text-xs font-mono tracking-wider">level</span>
                </div>
                <div
                  className={`text-sm font-bold font-mono ${accentColor ? '' : (RANK_COLORS[rank ?? ''] ?? 'text-neutral-500')}`}
                  style={accentColor ? { color: accentColor } : undefined}
                >
                  {rank ? RANK_LABELS[rank] ?? rank : 'N/A'}
                </div>
              </div>
              <div className="bg-neutral-800 rounded p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <IconTree stroke={ac} />
                  <span className="text-neutral-400 text-xs font-mono tracking-wider">tech_bonus</span>
                </div>
                <div className="text-sm font-bold font-mono text-white">{discountPct}</div>
                <div className="text-[10px] text-neutral-500 font-mono">output boost</div>
              </div>
              <div className="bg-neutral-800 rounded p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <IconCalendar stroke={ac} />
                  <span className="text-neutral-400 text-xs font-mono tracking-wider">mining_days</span>
                </div>
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
                      <span
                        className={accentColor ? 'text-[10px] font-mono px-1.5 py-0.5 rounded' : 'text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-400'}
                        style={accentColor ? { backgroundColor: `${accentColor}33`, color: accentColor } : undefined}
                      >
                        {row.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            <div className="text-[10px] text-neutral-500 font-mono space-y-1">
              <div>{'\u6316\u77ff\u4ef7\u683c'} = {'\u57fa\u51c6\u4ef7\u683c'} x 4 ({'\u7528\u6237\u83b7\u5f97'} 100% MCC)</div>
              <div>{'\u4f34\u751f\u77ff\u4e0e\u7528\u6237\u6316\u77ff\u91cf'} 1:1 {'\u540c\u6b65\u4ea7\u51fa'}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
