'use client'

import { useMiningStats } from '@microcosmmoney/auth-react'
import { useTranslations } from '../../i18n-context'
import { useLinkComponent } from '../../link-context'

export interface MicrocosmMyMiningProps {
  basePath?: string
  detailsPath?: string
  onNavigate?: (path: string) => void
  accentColor?: string
}

export function MicrocosmMyMining({ basePath = '', detailsPath, accentColor }: MicrocosmMyMiningProps) {
  const t = useTranslations('mccDashboard')
  const Link = useLinkComponent()
  const { data: stats, loading } = useMiningStats()

  const resolvedDetails = detailsPath ?? (basePath ? `${basePath.replace(/\/$/, '')}/mcc/mining` : '/mcc/mining')

  const fmt = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const formatDateTime = (iso: string | null | undefined) => {
    if (!iso) return '-'
    const d = new Date(iso)
    return d.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
  }

  const iconCls = 'w-3.5 h-3.5 text-cyan-400'
  const coinsIcon = (
    <svg className={iconCls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" strokeWidth={2}/><path strokeWidth={2} strokeLinecap="round" d="M12 8v8M9 11h6M9 14h6"/></svg>
  )
  const dollarIcon = (
    <svg className={iconCls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2 0-3 1-3 2s1 2 3 2 3 1 3 2-1 2-3 2m0-8V6m0 12v-2M4 12a8 8 0 1016 0 8 8 0 00-16 0z" /></svg>
  )
  const hashIcon = (
    <svg className={iconCls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18" /></svg>
  )
  const calendarIcon = (
    <svg className={iconCls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  )
  const timerIcon = (
    <svg className={iconCls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="13" r="8" strokeWidth={2}/><path strokeWidth={2} strokeLinecap="round" d="M12 9v4l2 2M9 3h6"/></svg>
  )
  const clockIcon = (
    <svg className={iconCls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" strokeWidth={2}/><path strokeWidth={2} strokeLinecap="round" d="M12 7v5l3 2"/></svg>
  )
  const pickaxeIcon = (
    <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6l6 6-3 3-6-6 3-3zM10 10l-6 10 10-6" /></svg>
  )
  const chevronRight = (
    <svg className="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
  )

  const items = stats ? [
    { label: 'total_mined', value: fmt(stats.total_mined ?? 0), icon: coinsIcon },
    { label: 'total_paid', value: fmt(stats.total_paid ?? 0), icon: dollarIcon },
    { label: 'mining_count', value: `${stats.mining_count ?? 0}`, icon: hashIcon },
    { label: 'last_30d', value: fmt(stats.last_30d_mined ?? 0), icon: calendarIcon },
    { label: 'active_days', value: `${stats.active_days_30d ?? 0}`, icon: timerIcon },
    { label: 'last_mined', value: formatDateTime(stats.last_mined_at), icon: clockIcon },
  ] : []

  const spinnerBorderColor = accentColor ? { borderColor: accentColor, borderTopColor: 'transparent' } : undefined
  const spinnerClass = accentColor ? 'inline-block w-5 h-5 border-2 rounded-full animate-spin' : 'inline-block w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin'

  return (
    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl blockchain-card h-full">
      <div className="p-3 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            {pickaxeIcon}
            <span className="text-[#5EEAD4] text-[10px] sm:text-xs font-mono tracking-widest uppercase">{t('myMining', 'MY_MINING')}</span>
          </div>
          <Link href={resolvedDetails} className="flex items-center gap-1 text-xs text-neutral-500 hover:text-cyan-400 font-mono">
            {t('details', 'details')} {chevronRight}
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <span className={spinnerClass} style={spinnerBorderColor} />
          </div>
        ) : !stats || (stats.mining_count ?? 0) === 0 ? (
          <div className="text-center py-8 text-neutral-500 font-mono text-sm">
            {t('noMiningRecords', 'no mining records')}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {items.map((s) => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-lg p-2 sm:p-3 blockchain-sub-card">
                <div className="flex items-center gap-1.5 mb-1">
                  {s.icon}
                  <span className="text-[9px] sm:text-[10px] text-[#5EEAD4] font-mono tracking-widest uppercase">{s.label}</span>
                </div>
                <div className="text-sm sm:text-xl font-bold font-mono text-white truncate">
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
