'use client'

import { useMCCLocks } from '@microcosmmoney/auth-react'
import { useTranslations } from '../../i18n-context'

function formatDateTime(dt: string | number): string {
  const d = new Date(dt)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function daysRemaining(endTime: string | number): string {
  const now = Date.now()
  const end = new Date(endTime).getTime()
  const diff = end - now
  if (diff <= 0) return 'Expired'
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  return `${days}d`
}

export interface MicrocosmLockPeriodsProps {
  accentColor?: string
}

export function MicrocosmLockPeriods(_props: MicrocosmLockPeriodsProps = {}) {
  const t = useTranslations('mccDashboard')
  const { data } = useMCCLocks()

  const raw = data as any
  const lockPeriods: any[] = Array.isArray(raw) ? raw : raw?.locks ?? []
  const activeLocks = lockPeriods.filter((p: any) => p.status === 'locked')

  if (activeLocks.length === 0) return null

  return (
    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl blockchain-card">
      <div className="p-2 2xs:p-3 sm:p-6">
        <div className="space-y-1.5 2xs:space-y-2 sm:space-y-3">
          {activeLocks.map((lock: any) => (
            <div key={lock.lock_id} className="bg-white/5 border border-white/10 rounded-lg p-2 2xs:p-2.5 sm:p-4 blockchain-sub-card">
              <div className="flex justify-between items-start gap-2 mb-2">
                <div className="min-w-0 flex-1">
                  <div className="text-[#5EEAD4] text-[9px] 2xs:text-[10px] sm:text-xs font-mono tracking-widest uppercase truncate">{lock.reason}</div>
                  <div className="text-base 2xs:text-lg xs:text-xl sm:text-2xl font-bold font-mono text-cyan-400 mt-1 truncate">
                    {(lock.amount ?? 0).toLocaleString()} MCC
                  </div>
                </div>
                <span className="px-1.5 2xs:px-2 py-0.5 bg-cyan-400/20 text-cyan-400 text-[10px] 2xs:text-xs font-mono rounded whitespace-nowrap shrink-0">
                  {t('lockedStatus', 'LOCKED')}
                </span>
              </div>
              <div className="text-[10px] 2xs:text-xs text-neutral-500 space-y-1 font-mono">
                <div>
                  {t('unlockAt', 'unlock_at')}: {formatDateTime(lock.lock_end)}
                </div>
                <div>
                  {t('remaining', 'remaining')}:{' '}
                  <span className="text-cyan-400">{daysRemaining(lock.lock_end)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
