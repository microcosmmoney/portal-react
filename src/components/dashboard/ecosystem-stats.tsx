'use client'

import { usePlatformStats, useDashboardUserStats } from '@microcosmmoney/auth-react'

/* Inline SVG icons (16x16, stroke-based) */
const IconUsersTotal = ({ stroke = '#22d3ee' }: { stroke?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const IconActivity = ({ stroke = '#22d3ee' }: { stroke?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
)

const IconHardHat = ({ stroke = '#22d3ee' }: { stroke?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z" />
    <path d="M10 15V6.5a3.5 3.5 0 0 1 7 0V15" />
    <path d="M4 15v-5a8 8 0 0 1 16 0v5" />
  </svg>
)

const IconMap = ({ stroke = '#22d3ee' }: { stroke?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
    <line x1="9" x2="9" y1="3" y2="18" />
    <line x1="15" x2="15" y1="6" y2="21" />
  </svg>
)

const IconGlobe = ({ stroke = '#22d3ee' }: { stroke?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
)

export interface MicrocosmEcosystemStatsProps {
  accentColor?: string
}

export function MicrocosmEcosystemStats({ accentColor }: MicrocosmEcosystemStatsProps = {}) {
  const { data: overview, loading: loadingOverview } = usePlatformStats()
  const { data: userLevels, loading: loadingUsers } = useDashboardUserStats()

  const loading = loadingOverview || loadingUsers
  const ac = accentColor || '#22d3ee'

  const stats = [
    { label: 'total_users', value: (overview as any)?.total_users ?? (userLevels as any)?.total_users, icon: IconUsersTotal },
    { label: '24h_active', value: (overview as any)?.active_users_24h, icon: IconActivity },
    { label: 'miners', value: (userLevels as any)?.miners_and_above ?? (overview as any)?.miners_count, icon: IconHardHat },
    { label: 'territories', value: (overview as any)?.total_territories, icon: IconMap },
  ]

  const spinnerBorderColor = accentColor ? { borderColor: accentColor, borderTopColor: 'transparent' } : undefined
  const spinnerClass = accentColor ? 'inline-block w-5 h-5 border-2 rounded-full animate-spin' : 'inline-block w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin'

  return (
    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl blockchain-card h-full">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <IconGlobe stroke={ac} />
          <span className="text-[#5EEAD4] text-xs font-mono tracking-widest uppercase">ECOSYSTEM</span>
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
                  <div className="text-xl font-bold font-mono text-white">
                    {s.value != null ? s.value.toLocaleString() : '--'}
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
