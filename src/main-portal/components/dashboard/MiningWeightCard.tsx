// AI-generated · AI-managed · AI-maintained
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useWallet } from '../../contexts/WalletContext'
import { fetchApi } from '../../lib/api'
import { Card, CardContent } from '../ui/card'
import { UserRank } from '../../lib/types/api'
import { Loader2, Pickaxe, TreePine, Building2 } from 'lucide-react'

const RANK_LABELS: Record<string, string> = {
  [UserRank.MINER]: 'Miner',
  [UserRank.COMMANDER]: 'Commander \u6307\u6325\u5b98',
  [UserRank.PIONEER]: 'Pioneer \u5148\u9a71',
  [UserRank.WARDEN]: 'Warden \u5b88\u671b\u8005',
  [UserRank.ADMIRAL]: 'Admiral \u5143\u5e05',
}

const RANK_COLORS: Record<string, string> = {
  [UserRank.MINER]: 'text-cyan-300',
  [UserRank.COMMANDER]: 'text-white',
  [UserRank.PIONEER]: 'text-cyan-400',
  [UserRank.WARDEN]: 'text-cyan-300',
  [UserRank.ADMIRAL]: 'text-cyan-300',
}

interface CompanionYieldRow {
  label: string
  share: string
  type: string
  icon: React.ReactNode
}

function getCompanionYield(rank: UserRank | null): CompanionYieldRow[] {
  if (!rank) return []

  return [
    { label: '\u653f\u52a1\u5b98', share: '40%', type: 'MCC', icon: <Building2 className="w-3.5 h-3.5 text-cyan-400" /> },
    { label: 'LP', share: '30%', type: 'MCC', icon: <TreePine className="w-3.5 h-3.5 text-cyan-300" /> },
    { label: '\u9886\u5730\u91d1\u5e93', share: '30%', type: 'MCD', icon: <Building2 className="w-3.5 h-3.5 text-cyan-300" /> },
  ]
}

interface TechBonus {
  trading_bonus: number
  risk_bonus: number
  profit_bonus: number
  community_bonus: number
  total_bonus: number
  bonus_multiplier: number
}

export default function MiningWeightCard() {
  const { userRank, holdings, loading } = useWallet()
  const [techBonus, setTechBonus] = useState<TechBonus | null>(null)

  const loadTechBonus = useCallback(async () => {
    try {
      const res = await fetchApi('/organization-service/tech-bonus/bonus')
      if (res.success && res.bonuses) {
        setTechBonus(res.bonuses)
      } else if (res.success && res.data) {
        setTechBonus(res.data)
      }
    } catch { /* ignore */ }
  }, [])

  useEffect(() => { loadTechBonus() }, [loadTechBonus])

  const miningDays = holdings.station + holdings.matrix + holdings.sector + holdings.system
  const companionYield = getCompanionYield(userRank)
  const techDiscount = techBonus?.total_bonus ? `${techBonus.total_bonus > 0 ? '-' : ''}${Math.abs(techBonus.total_bonus)}%` : '--'

  return (
    <Card className="bg-neutral-900 border-neutral-700 h-full hover:border-cyan-400/50 dash-card">
      <CardContent className="p-3 sm:p-6">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="bg-neutral-800 rounded p-2 sm:p-3">
              <div className="flex items-center gap-1 sm:gap-1.5 mb-1">
                <Pickaxe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-400" />
                <span className="text-neutral-400 text-[9px] sm:text-xs font-mono tracking-wider">level</span>
              </div>
              <div className={`text-xs sm:text-sm font-bold font-mono truncate ${userRank ? RANK_COLORS[userRank] : 'text-neutral-500'}`}>
                {userRank ? RANK_LABELS[userRank] : 'N/A'}
              </div>
            </div>

            <div className="bg-neutral-800 rounded p-2 sm:p-3">
              <div className="flex items-center gap-1 sm:gap-1.5 mb-1">
                <TreePine className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-400" />
                <span className="text-neutral-400 text-[9px] sm:text-xs font-mono tracking-wider">tech_bonus</span>
              </div>
              <div className="text-xs sm:text-sm font-bold font-mono text-white">
                {techDiscount}
              </div>
            </div>

            <div className="bg-neutral-800 rounded p-2 sm:p-3">
              <div className="flex items-center gap-1 sm:gap-1.5 mb-1">
                <Pickaxe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-400" />
                <span className="text-neutral-400 text-[9px] sm:text-xs font-mono tracking-wider">mining_days</span>
              </div>
              <div className="text-xs sm:text-sm font-bold font-mono text-white">
                {miningDays}
              </div>
            </div>
          </div>

          <div className="bg-neutral-800 rounded p-2 sm:p-3">
            <div className="text-neutral-400 text-[10px] sm:text-xs font-mono tracking-wider mb-2 sm:mb-3">ecosystem_distribution (\u4f34\u751f\u77ff)</div>
            <p className="text-[10px] text-neutral-500 font-mono mb-2 sm:mb-3 hidden xs:block">
              \u6bcf\u6b21\u6316\u77ff\u540c\u6b65\u8fdb\u884c\u4f34\u751f\u77ff，\u81ea\u52a8\u6ce8\u5165\u9886\u5730\u751f\u6001
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
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      row.type === 'MCC' ? 'bg-cyan-400/20 text-cyan-400' : 'bg-cyan-400/20 text-cyan-400'
                    }`}>
                      {row.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          <div className="text-[10px] text-neutral-500 font-mono space-y-1">
            <div>\u6316\u77ff\u4ef7\u683c = \u5e02\u573a\u4ef7 × \u6316\u77ff\u500d\u6570 (\u79d1\u6280\u52a0\u6210\u53ef\u63d0\u5347\u4ea7\u51fa)</div>
            <div>\u4f34\u751f\u77ff\u4e0e\u7528\u6237\u6316\u77ff\u91cf\u540c\u6b65\u8fdb\u884c</div>
          </div>
        </div>
      )}
      </CardContent>
    </Card>
  )
}
