'use client'

import { useMCCStats } from '@microcosmmoney/auth-react'

/* Inline SVG icons (16x16, stroke-based) */
const IconUsers = ({ stroke = '#22d3ee' }: { stroke?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const IconCircle = ({ stroke = '#22d3ee' }: { stroke?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
)

const IconPickaxe = ({ stroke = '#22d3ee' }: { stroke?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.531 12.469 6.619 20.38a1 1 0 1 1-3-3l7.912-7.912" />
    <path d="M15.686 4.314A12.5 12.5 0 0 0 5.461 2.958l-.834 2.22a5.25 5.25 0 0 0 4.626 7.065l.172-.003a5.25 5.25 0 0 0 5.022-3.89l.39-1.507a12.5 12.5 0 0 0 .849-2.53Z" />
  </svg>
)

const IconDollarSign = ({ stroke = '#22d3ee' }: { stroke?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" x2="12" y1="2" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

const IconCoin = ({ stroke = '#22d3ee' }: { stroke?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="6" />
    <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
    <path d="M7 6h1v4" />
  </svg>
)

export interface MicrocosmMCCTokenStatsProps {
  accentColor?: string
}

export function MicrocosmMCCTokenStats({ accentColor }: MicrocosmMCCTokenStatsProps = {}) {
  const { data, loading } = useMCCStats()
  const ac = accentColor || '#22d3ee'

  const stats = [
    { label: 'holders', value: (data as any)?.holders_count, format: (v: number) => v.toLocaleString(), icon: IconUsers },
    { label: 'circulating', value: (data as any)?.circulating_supply, format: (v: number) => `${(v / 1e6).toFixed(2)}M`, icon: IconCircle },
    { label: 'total_mining_tx', value: (data as any)?.total_mining_count, format: (v: number) => v.toLocaleString(), icon: IconPickaxe },
    { label: 'total_mining_usdc', value: (data as any)?.total_mining_usdc, format: (v: number) => `$${(v / 1e6).toFixed(2)}M`, icon: IconDollarSign },
  ]

  const spinnerBorderColor = accentColor ? { borderColor: accentColor, borderTopColor: 'transparent' } : undefined
  const spinnerClass = accentColor ? 'inline-block w-5 h-5 border-2 rounded-full animate-spin' : 'inline-block w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin'

  return (
    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl blockchain-card h-full">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <IconCoin stroke={ac} />
          <span className="text-[#5EEAD4] text-xs font-mono tracking-widest uppercase">MCC_STATS</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <span className={spinnerClass} style={spinnerBorderColor} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {stats.map((s) => {
              const Icon = s.icon
              return (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-lg p-3 blockchain-sub-card">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon stroke={ac} />
                    <span className="text-[10px] text-[#5EEAD4] font-mono tracking-widest uppercase">{s.label}</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-white">
                    {s.value != null ? s.format(s.value) : '--'}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
