// AI-generated · AI-managed · AI-maintained
'use client'

import { useMCCLocks } from '@microcosmmoney/auth-react'

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

export function MicrocosmLockPeriods() {
  const { data } = useMCCLocks()

  const raw = data as any
  const locks: any[] = Array.isArray(raw) ? raw : raw?.locks ?? []
  const activeLocks = locks.filter((p: any) => p.status === 'locked')

  if (activeLocks.length === 0) return null

  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg hover:border-cyan-400/50 transition-colors">
      <div className="p-6">
        <div className="space-y-3">
          {activeLocks.map((lock: any) => (
            <div key={lock.lock_id} className="bg-neutral-800 rounded p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-neutral-400 text-xs font-mono tracking-wider">{lock.reason}</div>
                  <div className="text-xl font-bold font-mono text-cyan-400 mt-1">
                    {(lock.amount ?? 0).toLocaleString()} MCC
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-cyan-400/20 text-cyan-400 text-xs font-mono rounded">
                  LOCKED
                </span>
              </div>
              <div className="text-xs text-neutral-500 space-y-1 font-mono">
                <div>unlock_at: {formatDateTime(lock.lock_end)}</div>
                <div>remaining: <span className="text-cyan-400">{daysRemaining(lock.lock_end)}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
