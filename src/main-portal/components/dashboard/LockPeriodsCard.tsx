// AI-generated · AI-managed · AI-maintained
'use client'

import { useWallet } from '../../contexts/WalletContext'
import { Card, CardContent } from '../ui/card'
import { FormattedDateTime, LockDaysRemaining } from '../ui/time-remaining'

export default function LockPeriodsCard() {
  const { lockPeriods } = useWallet()

  const activeLocks = Array.isArray(lockPeriods) ? lockPeriods.filter((p) => p.status === 'locked') : []

  if (activeLocks.length === 0) return null

  return (
    <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
      <CardContent className="p-3 sm:p-6">
        <div className="space-y-2 sm:space-y-3">
          {activeLocks.map((lock) => (
            <div
              key={lock.lock_id}
              className="bg-neutral-800 rounded p-2.5 sm:p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="min-w-0 flex-1">
                  <div className="text-neutral-400 text-[10px] sm:text-xs font-mono tracking-wider truncate">{lock.reason}</div>
                  <div className="text-base sm:text-xl font-bold font-mono text-cyan-400 mt-1">
                    {lock.amount.toLocaleString()} MCC
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-cyan-400/20 text-cyan-400 text-xs font-mono rounded">
                  LOCKED
                </span>
              </div>
              <div className="text-xs text-neutral-500 space-y-1 font-mono">
                <div>
                  unlock_at: <FormattedDateTime dateTime={lock.lock_end} />
                </div>
                <div>
                  remaining:{' '}
                  <LockDaysRemaining endTime={lock.lock_end} className="text-cyan-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
