// AI-generated · AI-managed · AI-maintained
'use client'

import { useOverviewStats, useUserLevelStats } from '../../hooks/useStats'
import { Users, Activity, Pickaxe, Building2, Loader2, Globe } from 'lucide-react'
import { Card, CardContent } from '../ui/card'

export default function EcosystemStatsCard() {
  const { data: overview, loading: overviewLoading } = useOverviewStats()
  const { data: userLevels, loading: levelsLoading } = useUserLevelStats()

  const loading = overviewLoading || levelsLoading

  const stats = [
    {
      label: 'total_users',
      value: overview?.total_users ?? userLevels?.total_users,
      icon: <Users className="w-3.5 h-3.5 text-cyan-400" />,
    },
    {
      label: '24h_active',
      value: overview?.active_users_24h,
      icon: <Activity className="w-3.5 h-3.5 text-cyan-400" />,
    },
    {
      label: 'miners',
      value: userLevels?.miners_and_above,
      icon: <Pickaxe className="w-3.5 h-3.5 text-cyan-400" />,
    },
    {
      label: 'territories',
      value: overview?.total_territories,
      icon: <Building2 className="w-3.5 h-3.5 text-cyan-400" />,
    },
  ]

  return (
    <Card className="bg-neutral-900 border-neutral-700 h-full hover:border-cyan-400/50 dash-card">
      <CardContent className="p-3 sm:p-6">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span className="text-neutral-400 text-[10px] sm:text-xs font-mono tracking-wider">ECOSYSTEM</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {stats.map((s) => (
              <div key={s.label} className="bg-neutral-800 rounded p-2 sm:p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  {s.icon}
                  <span className="text-[9px] sm:text-[10px] text-neutral-400 font-mono tracking-wider">{s.label}</span>
                </div>
                <div className="text-sm sm:text-xl font-bold font-mono text-white">
                  {s.value != null ? s.value.toLocaleString() : '--'}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
