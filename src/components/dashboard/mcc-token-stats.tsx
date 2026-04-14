'use client'

import { useMCCStats } from '@microcosmmoney/auth-react'
import { useTranslations } from '../../i18n-context'

const IconUsers = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const IconCoins = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="6" />
    <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
    <path d="M7 6h1v4" />
  </svg>
)

const IconPickaxe = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.531 12.469 6.619 20.38a1 1 0 1 1-3-3l7.912-7.912" />
    <path d="M15.686 4.314A12.5 12.5 0 0 0 5.461 2.958l-.834 2.22a5.25 5.25 0 0 0 4.626 7.065l.172-.003a5.25 5.25 0 0 0 5.022-3.89l.39-1.507a12.5 12.5 0 0 0 .849-2.53Z" />
  </svg>
)

const IconTrendingUp = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
)

const IconCoinHeader = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="6" />
    <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
    <path d="M7 6h1v4" />
  </svg>
)

const IconSpinner = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
)

export interface MicrocosmMCCTokenStatsProps {
  accentColor?: string
}

export function MicrocosmMCCTokenStats(_props: MicrocosmMCCTokenStatsProps = {}) {
  const t = useTranslations('mccDashboard')
  const { data, loading } = useMCCStats()

  const stats = [
    {
      label: t('holders', 'holders'),
      value: (data as any)?.holders_count,
      format: (v: number) => v.toLocaleString(),
      icon: <IconUsers />,
    },
    {
      label: t('circulating', 'circulating'),
      value: (data as any)?.circulating_supply,
      format: (v: number) => `${(v / 1e6).toFixed(2)}M`,
      icon: <IconCoins />,
    },
    {
      label: t('totalMiningTx', 'total_mining_tx'),
      value: (data as any)?.total_mining_count,
      format: (v: number) => v.toLocaleString(),
      icon: <IconPickaxe />,
    },
    {
      label: t('totalMiningUsdc', 'total_mining_usdc'),
      value: (data as any)?.total_mining_usdc,
      format: (v: number) => `$${(v / 1e6).toFixed(2)}`,
      icon: <IconTrendingUp />,
    },
  ]

  return (
    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl blockchain-card h-full">
      <div className="p-3 sm:p-6">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <IconCoinHeader />
          <span className="text-[#5EEAD4] text-[10px] sm:text-xs font-mono tracking-widest uppercase">{t('mccStats', 'MCC_STATS')}</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <IconSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-lg p-2 sm:p-3 blockchain-sub-card">
                <div className="flex items-center gap-1.5 mb-1">
                  {s.icon}
                  <span className="text-[9px] sm:text-[10px] text-[#5EEAD4] font-mono tracking-widest uppercase">{s.label}</span>
                </div>
                <div className="text-sm sm:text-lg font-bold font-mono text-white truncate">
                  {s.value != null ? s.format(s.value) : '--'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
