'use client'

import { useMCDStats } from '@microcosmmoney/auth-react'
import { useTranslations } from '../../i18n-context'

const IconUsers = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const IconBuilding = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="16" height="20" x="4" y="2" rx="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
  </svg>
)

const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const IconBanknote = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="12" x="2" y="6" rx="2" />
    <circle cx="12" cy="12" r="2" />
    <path d="M6 12h.01M18 12h.01" />
  </svg>
)

const IconBanknoteHeader = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="12" x="2" y="6" rx="2" />
    <circle cx="12" cy="12" r="2" />
    <path d="M6 12h.01M18 12h.01" />
  </svg>
)

const IconSpinner = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
)

export interface MicrocosmMCDStatsProps {
  accentColor?: string
}

export function MicrocosmMCDStats(_props: MicrocosmMCDStatsProps = {}) {
  const t = useTranslations('mccDashboard')
  const { data, loading } = useMCDStats()

  const stats = [
    {
      label: t('holders', 'holders'),
      value: (data as any)?.holders_count,
      format: (v: number) => v.toLocaleString(),
      icon: <IconUsers />,
    },
    {
      label: t('activeVaults', 'active_vaults'),
      value: (data as any)?.active_vaults,
      format: (v: number) => v.toLocaleString(),
      icon: <IconBuilding />,
    },
    {
      label: t('dailyDistribution', 'daily_distribution'),
      value: (data as any)?.daily_distribution,
      format: (v: number) => v > 0 ? v.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '0',
      icon: <IconClock />,
    },
    {
      label: t('totalVaultBalance', 'total_vault_balance'),
      value: (data as any)?.total_vault_balance,
      format: (v: number) => v > 0 ? `${(v / 1e6).toFixed(2)}M` : '0',
      icon: <IconBanknote />,
    },
  ]

  return (
    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl blockchain-card h-full">
      <div className="p-2 2xs:p-3 sm:p-6">
        <div className="flex items-center gap-1.5 2xs:gap-2 mb-2 2xs:mb-3 sm:mb-4">
          <IconBanknoteHeader />
          <span className="text-[#5EEAD4] text-[9px] 2xs:text-[10px] sm:text-xs font-mono tracking-widest uppercase truncate">{t('mcdStats', 'MCD_STATS')}</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <IconSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-1.5 2xs:gap-2 sm:gap-3">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-lg p-2 2xs:p-2.5 sm:p-3 blockchain-sub-card min-w-0">
                <div className="flex items-center gap-1 2xs:gap-1.5 mb-1 min-w-0">
                  {s.icon}
                  <span className="text-[8px] 2xs:text-[9px] sm:text-[10px] text-[#5EEAD4] font-mono tracking-widest uppercase truncate">{s.label}</span>
                </div>
                <div className="text-sm 2xs:text-base xs:text-lg sm:text-xl font-bold font-mono text-white truncate">
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
