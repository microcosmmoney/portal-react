'use client'

import { useMCDStats } from '@microcosmmoney/auth-react'

/* Inline SVG icons (16x16, stroke-based) */
const IconUsers = ({ stroke = '#22d3ee' }: { stroke?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const IconVault = ({ stroke = '#22d3ee' }: { stroke?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <circle cx="12" cy="12" r="4" />
    <path d="M12 8v1" />
    <path d="M12 15v1" />
    <path d="M8 12h1" />
    <path d="M15 12h1" />
  </svg>
)

const IconArrowDown = ({ stroke = '#22d3ee' }: { stroke?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14" />
    <path d="m19 12-7 7-7-7" />
  </svg>
)

const IconWallet = ({ stroke = '#22d3ee' }: { stroke?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
  </svg>
)

const IconBanknote = ({ stroke = '#22d3ee' }: { stroke?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="12" x="2" y="6" rx="2" />
    <circle cx="12" cy="12" r="2" />
    <path d="M6 12h.01M18 12h.01" />
  </svg>
)

export interface MicrocosmMCDStatsProps {
  accentColor?: string
}

export function MicrocosmMCDStats({ accentColor }: MicrocosmMCDStatsProps = {}) {
  const { data, loading } = useMCDStats()
  const ac = accentColor || '#22d3ee'

  const stats = [
    { label: 'holders', value: (data as any)?.holders_count ?? (data as any)?.holder_count, format: (v: number) => v.toLocaleString(), icon: IconUsers },
    { label: 'active_vaults', value: (data as any)?.total_vaults ?? (data as any)?.active_vaults, format: (v: number) => v.toLocaleString(), icon: IconVault },
    { label: 'daily_distribution', value: (data as any)?.daily_distribution, format: (v: number) => v > 0 ? v.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '0', icon: IconArrowDown },
    { label: 'total_vault_balance', value: (data as any)?.total_vault_balance, format: (v: number) => v > 0 ? `${(v / 1e6).toFixed(2)}M` : '0', icon: IconWallet },
  ]

  const spinnerBorderColor = accentColor ? { borderColor: accentColor, borderTopColor: 'transparent' } : undefined
  const spinnerClass = accentColor ? 'inline-block w-5 h-5 border-2 rounded-full animate-spin' : 'inline-block w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin'

  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg h-full hover:border-cyan-400/50 transition-colors">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <IconBanknote stroke={ac} />
          <span className="text-neutral-400 text-xs font-mono tracking-wider">MCD_STATS</span>
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
                <div key={s.label} className="bg-neutral-800 rounded p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon stroke={ac} />
                    <span className="text-[10px] text-neutral-400 font-mono tracking-wider">{s.label}</span>
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
