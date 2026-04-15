// AI-generated · AI-managed · AI-maintained
'use client'

import { useMCCStats } from '../../hooks/useStats'
import { Coins, Users, Pickaxe, TrendingUp, Loader2 } from 'lucide-react'
import { Card, CardContent } from '../ui/card'

export default function MCCTokenStatsCard() {
  const { data, loading } = useMCCStats()

  const stats = [
    {
      label: 'holders',
      value: data?.holders_count,
      format: (v: number) => v.toLocaleString(),
      icon: <Users className="w-3.5 h-3.5 text-cyan-400" />,
    },
    {
      label: 'circulating',
      value: data?.circulating_supply,
      format: (v: number) => `${(v / 1e6).toFixed(2)}M`,
      icon: <Coins className="w-3.5 h-3.5 text-cyan-400" />,
    },
    {
      label: 'total_mining_tx',
      value: data?.total_mining_count,
      format: (v: number) => v.toLocaleString(),
      icon: <Pickaxe className="w-3.5 h-3.5 text-cyan-400" />,
    },
    {
      label: 'total_mining_usdc',
      value: data?.total_mining_usdc,
      format: (v: number) => `$${(v / 1e6).toFixed(2)}`,
      icon: <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />,
    },
  ]

  return (
    <Card className="bg-neutral-900 border-neutral-700 h-full hover:border-cyan-400/50 dash-card">
      <CardContent className="p-3 sm:p-6">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Coins className="w-4 h-4 text-cyan-400" />
          <span className="text-neutral-400 text-[10px] sm:text-xs font-mono tracking-wider">MCC_STATS</span>
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
                <div className="text-sm sm:text-lg font-bold font-mono text-white truncate">
                  {s.value != null ? s.format(s.value) : '--'}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
