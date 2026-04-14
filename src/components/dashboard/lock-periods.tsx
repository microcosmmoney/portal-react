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

export function MicrocosmLockPeriods({ accentColor }: MicrocosmLockPeriodsProps = {}) {
  const t = useTranslations('mccDashboard')
  const { data } = useMCCLocks()

  const raw = data as any
  const locks: any[] = Array.isArray(raw) ? raw : raw?.locks ?? []
  const activeLocks = locks.filter((p: any) => p.status === 'locked')

  if (activeLocks.length === 0) return null

  return (
    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl blockchain-card">
      <div className="p-6">
        <div className="space-y-3">
          {activeLocks.map((lock: any) => (
            <div key={lock.lock_id} className="bg-white/5 border border-white/10 rounded-lg p-4 blockchain-sub-card">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-[#5EEAD4] text-xs font-mono tracking-widest uppercase">{lock.reason}</div>
                  <div
                    className={accentColor ? 'text-xl font-bold font-mono mt-1' : 'text-xl font-bold font-mono text-cyan-400 mt-1'}
                    style={accentColor ? { color: accentColor } : undefined}
                  >
                    {(lock.amount ?? 0).toLocaleString()} MCC
                  </div>
                </div>
                <span
                  className={accentColor ? 'px-2 py-0.5 text-xs font-mono rounded' : 'px-2 py-0.5 bg-cyan-400/20 text-cyan-400 text-xs font-mono rounded'}
                  style={accentColor ? { backgroundColor: `${accentColor}33`, color: accentColor } : undefined}
                >
                  {t('lockedStatus', 'LOCKED')}
                </span>
              </div>
              <div className="text-xs text-neutral-500 space-y-1 font-mono">
                <div>{t('unlockAt', 'unlock_at')}: {formatDateTime(lock.lock_end)}</div>
                <div>{t('remaining', 'remaining')}: <span className={accentColor ? '' : 'text-cyan-400'} style={accentColor ? { color: accentColor } : undefined}>{daysRemaining(lock.lock_end)}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
