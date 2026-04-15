// AI-generated · AI-managed · AI-maintained
'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '../ui/card'
import { fetchApi } from '../../lib/api'
import { Loader2, Pickaxe, ChevronRight, Coins, DollarSign, Hash, CalendarDays, Timer, Clock } from 'lucide-react'
import { Link } from '../../i18n/navigation'

interface MyMiningStats {
  total_mined: number
  total_paid: number
  mining_count: number
  today_mined: number
  last_30d_mined: number
  active_days_30d: number
  last_mined_at: string | null
}

export default function MyMiningCard() {
  const [stats, setStats] = useState<MyMiningStats | null>(null)
  const [loading, setLoading] = useState(true)

  const loadStats = useCallback(async () => {
    try {
      const json = await fetchApi('/mining/my-stats')
      if (json.success && json.data) {
        setStats(json.data)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadStats() }, [loadStats])

  const fmt = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const formatDateTime = (iso: string | null) => {
    if (!iso) return '-'
    const d = new Date(iso)
    return d.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
  }

  const items = stats ? [
    { label: 'total_mined', value: fmt(stats.total_mined), icon: <Coins className="w-3.5 h-3.5 text-cyan-400" /> },
    { label: 'total_paid', value: fmt(stats.total_paid), icon: <DollarSign className="w-3.5 h-3.5 text-cyan-400" /> },
    { label: 'mining_count', value: `${stats.mining_count}`, icon: <Hash className="w-3.5 h-3.5 text-cyan-400" /> },
    { label: 'last_30d', value: fmt(stats.last_30d_mined), icon: <CalendarDays className="w-3.5 h-3.5 text-cyan-400" /> },
    { label: 'active_days', value: `${stats.active_days_30d}`, icon: <Timer className="w-3.5 h-3.5 text-cyan-400" /> },
    { label: 'last_mined', value: formatDateTime(stats.last_mined_at), icon: <Clock className="w-3.5 h-3.5 text-cyan-400" /> },
  ] : []

  return (
    <Card className="bg-neutral-900 border-neutral-700 h-full hover:border-cyan-400/50 dash-card">
      <CardContent className="p-3 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            <Pickaxe className="w-4 h-4 text-cyan-400" />
            <span className="text-neutral-400 text-[10px] sm:text-xs font-mono tracking-wider">MY_MINING</span>
          </div>
          <Link href="/mcc/mining" className="flex items-center gap-1 text-xs text-neutral-500 hover:text-cyan-400 font-mono">
            details <ChevronRight size={12} />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
          </div>
        ) : !stats || stats.mining_count === 0 ? (
          <div className="text-center py-8 text-neutral-500 font-mono text-sm">
            no mining records
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {items.map((s) => (
              <div key={s.label} className="bg-neutral-800 rounded p-2 sm:p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  {s.icon}
                  <span className="text-[9px] sm:text-[10px] text-neutral-400 font-mono tracking-wider">{s.label}</span>
                </div>
                <div className="text-sm sm:text-xl font-bold font-mono text-white truncate">
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
