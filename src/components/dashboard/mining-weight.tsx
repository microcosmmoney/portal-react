'use client'

import { useLevelProgress, useTechBonusDetail, useMiningStats } from '@microcosmmoney/auth-react'
import { useTranslations } from '../../i18n-context'

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

const IconPickaxe = ({ stroke = '#5EEAD4' }: { stroke?: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.531 12.469 6.619 20.38a1 1 0 1 1-3-3l7.912-7.912" />
    <path d="M15.686 4.314A12.5 12.5 0 0 0 5.461 2.958l-.834 2.22a5.25 5.25 0 0 0 4.626 7.065l.172-.003a5.25 5.25 0 0 0 5.022-3.89l.39-1.507a12.5 12.5 0 0 0 .849-2.53Z" />
  </svg>
)

const IconTree = ({ stroke = '#5EEAD4' }: { stroke?: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22v-7" />
    <path d="M7 15h10" />
    <path d="m12 2-5.5 9h11Z" />
    <path d="m12 7-4 6h8Z" />
  </svg>
)

const IconBuilding = ({ stroke = '#5EEAD4' }: { stroke?: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="16" height="20" x="4" y="2" rx="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" />
    <path d="M16 6h.01" />
    <path d="M12 6h.01" />
    <path d="M12 10h.01" />
    <path d="M12 14h.01" />
    <path d="M16 10h.01" />
    <path d="M16 14h.01" />
    <path d="M8 10h.01" />
    <path d="M8 14h.01" />
  </svg>
)

const IconLoader = ({ stroke = '#5EEAD4' }: { stroke?: string }) => (
  <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
)

interface CompanionYieldRow {
  label: string
  share: string
  type: string
  icon: React.ReactNode
}

function getCompanionYield(rank: string | null): CompanionYieldRow[] {
  if (!rank) return []
  return [
    { label: '\u653f\u52a1\u5b98', share: '40%', type: 'MCC', icon: <IconBuilding stroke="#22d3ee" /> },
    { label: 'LP', share: '30%', type: 'MCC', icon: <IconTree stroke="#67e8f9" /> },
    { label: '\u9886\u5730\u91d1\u5e93', share: '30%', type: 'MCD', icon: <IconBuilding stroke="#67e8f9" /> },
  ]
}

export interface MicrocosmMiningWeightProps {
  accentColor?: string
}

export function MicrocosmMiningWeight({ accentColor }: MicrocosmMiningWeightProps = {}) {
  const t = useTranslations('mccDashboard')
  const { data, loading: loadingLevel } = useLevelProgress()
  const { data: techBonus, loading: loadingTech } = useTechBonusDetail()
  const { data: miningStats, loading: loadingMining } = useMiningStats()

  const loading = loadingLevel || loadingTech || loadingMining

  const rank = data?.current_rank ?? null
  const totalHoldings = data ? (data.holdings.station + data.holdings.matrix + data.holdings.sector + data.holdings.system) : 0
  const miningDays = totalHoldings > 0 ? totalHoldings : ((miningStats as any)?.active_days_30d ?? 0)
  const companionYield = getCompanionYield(rank)

  const totalBonus = (techBonus as any)?.total_bonus ?? 0
  const techDiscount = totalBonus ? `${totalBonus > 0 ? '-' : ''}${Math.abs(totalBonus)}%` : '--'

  return (
    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl blockchain-card h-full hover:border-cyan-400/50 dash-card">
      <div className="p-2 2xs:p-3 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <IconLoader stroke="#22d3ee" />
          </div>
        ) : (
          <div className="space-y-2 2xs:space-y-3 sm:space-y-4">
            <div className="grid grid-cols-3 gap-1.5 2xs:gap-2 sm:gap-3">
              <div className="bg-white/5 border border-white/10 rounded-lg p-2 2xs:p-2.5 sm:p-3 blockchain-sub-card min-w-0">
                <div className="flex items-center gap-1 sm:gap-1.5 mb-1">
                  <IconPickaxe stroke="#5EEAD4" />
                  <span className="text-[#5EEAD4] text-[8px] 2xs:text-[9px] sm:text-xs font-mono tracking-widest uppercase truncate">{t('level', 'level')}</span>
                </div>
                <div className={`text-xs 2xs:text-sm sm:text-base font-bold font-mono truncate truncate ${rank ? (RANK_COLORS[rank] ?? 'text-neutral-500') : 'text-neutral-500'}`}>
                  {rank ? (RANK_LABELS[rank] ?? rank) : 'N/A'}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-2 2xs:p-2.5 sm:p-3 blockchain-sub-card min-w-0">
                <div className="flex items-center gap-1 sm:gap-1.5 mb-1">
                  <IconTree stroke="#5EEAD4" />
                  <span className="text-[#5EEAD4] text-[8px] 2xs:text-[9px] sm:text-xs font-mono tracking-widest uppercase truncate">{t('techBonus', 'tech_bonus')}</span>
                </div>
                <div className="text-xs 2xs:text-sm sm:text-base font-bold font-mono truncate text-white">
                  {techDiscount}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-2 2xs:p-2.5 sm:p-3 blockchain-sub-card min-w-0">
                <div className="flex items-center gap-1 sm:gap-1.5 mb-1">
                  <IconPickaxe stroke="#5EEAD4" />
                  <span className="text-[#5EEAD4] text-[8px] 2xs:text-[9px] sm:text-xs font-mono tracking-widest uppercase truncate">{t('miningDays', 'mining_days')}</span>
                </div>
                <div className="text-xs 2xs:text-sm sm:text-base font-bold font-mono truncate text-white">
                  {miningDays}
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-2 2xs:p-2.5 sm:p-3 blockchain-sub-card min-w-0">
              <div className="text-[#5EEAD4] text-[10px] sm:text-xs font-mono tracking-widest uppercase mb-2 sm:mb-3">{t('ecosystemDistribution', 'ecosystem_distribution (\u4f34\u751f\u77ff)')}</div>
              <p className="text-[10px] text-neutral-500 font-mono mb-2 sm:mb-3 hidden xs:block">
                {t('companionYieldDesc', '\u6bcf\u6b21\u6316\u77ff\u540c\u6b65\u8fdb\u884c\u4f34\u751f\u77ff\uff0c\u81ea\u52a8\u6ce8\u5165\u9886\u5730\u751f\u6001')}
              </p>

              <div className="space-y-2">
                {companionYield.map((row) => (
                  <div key={row.label} className="flex items-center justify-between px-2 py-1.5 bg-neutral-900 rounded hover:bg-neutral-700">
                    <div className="flex items-center gap-2">
                      {row.icon}
                      <span className="text-xs font-mono text-neutral-300">{row.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white">{row.share}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-400">
                        {row.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[10px] text-neutral-500 font-mono space-y-1">
              <div>{t('miningPriceFormula', '\u6316\u77ff\u4ef7\u683c = \u5e02\u573a\u4ef7 x \u6316\u77ff\u500d\u6570 (\u79d1\u6280\u52a0\u6210\u53ef\u63d0\u5347\u4ea7\u51fa)')}</div>
              <div>{t('companionYieldSync', '\u4f34\u751f\u77ff\u4e0e\u7528\u6237\u6316\u77ff\u91cf\u540c\u6b65\u8fdb\u884c')}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
