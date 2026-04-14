'use client'

import { useMiningStats } from '@microcosmmoney/auth-react'

export interface MicrocosmMyMiningProps {
  detailsPath?: string
  onNavigate?: (path: string) => void
  accentColor?: string
}

export function MicrocosmMyMining({ detailsPath, onNavigate, accentColor }: MicrocosmMyMiningProps) {
  const { data, loading } = useMiningStats()

  const fmt = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const formatDateTime = (iso: string | null | undefined) => {
    if (!iso) return '-'
    const d = new Date(iso)
    return d.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
  }

  const items = data ? [
    { label: 'total_mined', value: fmt(data.total_mined ?? 0) },
    { label: 'total_paid', value: fmt(data.total_paid ?? 0) },
    { label: 'mining_count', value: `${data.mining_count ?? 0}` },
    { label: 'last_30d', value: fmt(data.last_30d_mined ?? 0) },
    { label: 'active_days', value: `${data.active_days_30d ?? 0}` },
    { label: 'last_mined', value: formatDateTime(data.last_mined_at) },
  ] : []

  const handleDetailsClick = () => {
    if (onNavigate && detailsPath) onNavigate(detailsPath)
  }

  const spinnerBorderColor = accentColor ? { borderColor: accentColor, borderTopColor: 'transparent' } : undefined
  const spinnerClass = accentColor ? 'inline-block w-5 h-5 border-2 rounded-full animate-spin' : 'inline-block w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin'

  return (
    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl blockchain-card h-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[#5EEAD4] text-xs font-mono tracking-widest uppercase">MY_MINING</span>
          {detailsPath && (
            <button
              onClick={handleDetailsClick}
              className={accentColor ? 'text-xs text-neutral-500 font-mono' : 'text-xs text-neutral-500 hover:text-cyan-400 font-mono'}
              style={accentColor ? { '--hover-color': accentColor } as React.CSSProperties : undefined}
            >
              details &gt;
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <span className={spinnerClass} style={spinnerBorderColor} />
          </div>
        ) : !data || (data.mining_count ?? 0) === 0 ? (
          <div className="text-center py-8 text-neutral-500 font-mono text-sm">
            no mining records
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {items.map((s) => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-lg p-3 blockchain-sub-card">
                <span className="text-[10px] text-[#5EEAD4] font-mono tracking-widest uppercase">{s.label}</span>
                <div className="text-xl font-bold font-mono text-white">{s.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
