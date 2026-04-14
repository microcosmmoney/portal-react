'use client'

import { useState, useEffect, useCallback } from 'react'
import { useMicrocosmApi } from '@microcosmmoney/auth-react'
import { TerminalCard } from '../terminal'

interface UserQueueStatus {
  is_onboarded?: boolean
  in_queue?: boolean
  user_type?: string
  territory_id?: string
  station_name?: string
  status?: string
  position?: number
  estimated_wait_minutes?: number
  preferred_territory_id?: string
  joined_at?: string
}

interface AdminQueueStatus {
  pending_count?: number
  processing_count?: number
  total_in_queue?: number
  oldest_pending?: string
}

interface ExpansionCheckResult {
  needs_expansion?: boolean
  reason?: string
  current_stats?: Record<string, any>
}

const LEVEL_LABELS: Record<string, string> = {
  miner: 'Miner',
  commander: 'Commander',
  pioneer: 'Pioneer',
  warden: 'Warden',
  admiral: 'Admiral',
}

export interface MicrocosmQueueStatusPageProps {
  basePath?: string
  onNavigate?: (path: string) => void
  isAdmin?: boolean
}

export function MicrocosmQueueStatusPage({ isAdmin = false }: MicrocosmQueueStatusPageProps = {}) {
  const api = useMicrocosmApi()
  const [userQueue, setUserQueue] = useState<UserQueueStatus | null>(null)
  const [adminQueue, setAdminQueue] = useState<AdminQueueStatus | null>(null)
  const [expansion, setExpansion] = useState<ExpansionCheckResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showJoinConfirm, setShowJoinConfirm] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadStatus = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get<{ success: boolean; data: UserQueueStatus }>('/territories/queue')
      setUserQueue(res?.data ?? (res as any))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load queue status')
    } finally {
      setLoading(false)
    }
    if (isAdmin) {
      try {
        const adminRes = await api.get<any>('/territories/queue/admin')
        setAdminQueue(adminRes?.data ?? adminRes)
      } catch {}
      try {
        const expRes = await api.get<any>('/territories/expansion/check')
        setExpansion(expRes?.data ?? expRes)
      } catch {}
    }
  }, [api, isAdmin])

  const handleProcessQueue = async () => {
    setSubmitting(true)
    try {
      await api.post('/territories/queue/process', { batch_size: 50 })
      await loadStatus()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to process queue')
    } finally {
      setSubmitting(false)
    }
  }

  const handleTriggerExpansion = async () => {
    setSubmitting(true)
    try {
      await api.post('/territories/expansion/trigger', {})
      await loadStatus()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to trigger expansion')
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => { loadStatus() }, [loadStatus])

  const handleJoin = async () => {
    setSubmitting(true)
    try {
      await api.post('/territories/queue', {})
      setShowJoinConfirm(false)
      await loadStatus()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to join queue')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = async () => {
    setSubmitting(true)
    try {
      await api.delete('/territories/queue')
      setShowCancelConfirm(false)
      await loadStatus()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to cancel queue')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6 font-mono">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wider">Station Queue</h1>
          <p className="text-xs sm:text-sm text-neutral-400">Your onboarding status</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <span className="text-neutral-400">Loading...</span>
        </div>
      </div>
    )
  }

  const level = userQueue?.user_type?.toLowerCase() || 'miner'
  const levelLabel = LEVEL_LABELS[level] || 'Miner'

  return (
    <div className="max-w-7xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6 font-mono">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wider">Station Queue</h1>
          <p className="text-xs sm:text-sm text-neutral-400">Your onboarding status</p>
        </div>
        <button
          onClick={loadStatus}
          className="px-3 py-1.5 text-xs border border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white rounded transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-900/20 border border-red-800 rounded text-sm text-red-300">
          {error}
        </div>
      )}

      <TerminalCard>
        <div className="p-4 bg-neutral-800 rounded mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-[#5EEAD4] tracking-widest uppercase">CURRENT LEVEL</div>
              <div className="text-lg font-bold text-cyan-300">{levelLabel}</div>
            </div>
            <span className="px-3 py-1 bg-cyan-900/30 text-cyan-300 rounded border border-cyan-700 text-xs">
              Lv.{Object.keys(LEVEL_LABELS).indexOf(level) + 3}
            </span>
          </div>
        </div>

        {userQueue?.is_onboarded ? (
          <div className="bg-neutral-950 rounded-lg p-6 border border-neutral-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Onboarded</h3>
                <p className="text-sm text-neutral-400">
                  Assigned to {userQueue.station_name || userQueue.territory_id || ''}
                </p>
              </div>
              <span className="px-2 py-1 bg-white/20 text-white rounded text-xs">Active</span>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-neutral-900 rounded-lg p-4 text-center">
                <p className="text-xl font-bold text-white">{userQueue.territory_id}</p>
                <p className="text-sm text-neutral-400">Territory ID</p>
              </div>
            </div>
          </div>
        ) : userQueue?.in_queue ? (
          <div className="bg-neutral-950 rounded-lg p-6 border border-neutral-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">In Queue</h3>
                <p className="text-sm text-neutral-400">Waiting for station assignment</p>
              </div>
              {userQueue.status && (
                <span className="px-2 py-1 bg-cyan-900/30 text-cyan-300 rounded text-xs">{userQueue.status}</span>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{userQueue.position || '-'}</p>
                <p className="text-xs text-neutral-400">Position</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{userQueue.estimated_wait_minutes || '-'}</p>
                <p className="text-xs text-neutral-400">Est. wait (min)</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-white truncate">
                  {userQueue.preferred_territory_id || 'Auto'}
                </p>
                <p className="text-xs text-neutral-400">Preferred</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-white">
                  {userQueue.joined_at ? new Date(userQueue.joined_at).toLocaleString() : '-'}
                </p>
                <p className="text-xs text-neutral-400">Joined at</p>
              </div>
            </div>
            <button
              onClick={() => setShowCancelConfirm(true)}
              disabled={submitting}
              className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded transition-colors disabled:opacity-50"
            >
              Cancel Queue
            </button>
          </div>
        ) : (
          <div className="bg-neutral-950 rounded-lg p-6 border border-neutral-800">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">Not Onboarded</h3>
              <p className="text-sm text-neutral-400">Join the queue to be assigned a station</p>
            </div>
            <button
              onClick={() => setShowJoinConfirm(true)}
              disabled={submitting}
              className="w-full py-2 bg-white/20 hover:bg-neutral-800 text-white border border-neutral-700 rounded transition-colors disabled:opacity-50"
            >
              Join Queue
            </button>
          </div>
        )}
      </TerminalCard>

      {isAdmin && adminQueue && (
        <TerminalCard title="Queue Management (Admin)">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-neutral-950 rounded p-4 text-center border border-neutral-800">
              <p className="text-3xl font-bold text-white">{adminQueue.pending_count ?? 0}</p>
              <p className="text-xs text-neutral-400 mt-1">Pending</p>
            </div>
            <div className="bg-neutral-950 rounded p-4 text-center border border-neutral-800">
              <p className="text-3xl font-bold text-white">{adminQueue.processing_count ?? 0}</p>
              <p className="text-xs text-neutral-400 mt-1">Processing</p>
            </div>
            <div className="bg-neutral-950 rounded p-4 text-center border border-neutral-800">
              <p className="text-3xl font-bold text-white">{adminQueue.total_in_queue ?? 0}</p>
              <p className="text-xs text-neutral-400 mt-1">Total in queue</p>
            </div>
            <div className="bg-neutral-950 rounded p-4 text-center border border-neutral-800">
              <p className="text-sm text-white">
                {adminQueue.oldest_pending ? new Date(adminQueue.oldest_pending).toLocaleString() : '-'}
              </p>
              <p className="text-xs text-neutral-400 mt-1">Oldest pending</p>
            </div>
          </div>
          <button
            onClick={handleProcessQueue}
            disabled={submitting}
            className="w-full px-4 py-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded text-sm disabled:opacity-50"
          >
            {submitting ? 'Processing...' : 'Process Queue (batch 50)'}
          </button>
        </TerminalCard>
      )}

      {isAdmin && expansion && (
        <TerminalCard title="Station Expansion (Admin)">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-neutral-300">
                Needs expansion: {expansion.needs_expansion ? 'YES' : 'NO'}
              </div>
              {expansion.reason && (
                <div className="text-xs text-neutral-500 mt-1">Reason: {expansion.reason}</div>
              )}
            </div>
            <button
              onClick={handleTriggerExpansion}
              disabled={submitting || !expansion.needs_expansion}
              className="px-4 py-2 bg-red-900/30 text-red-300 border border-red-800 hover:bg-red-900/50 rounded text-sm disabled:opacity-50"
            >
              {submitting ? 'Expanding...' : 'Trigger Expansion'}
            </button>
          </div>
        </TerminalCard>
      )}

      {showJoinConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowJoinConfirm(false)}>
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-medium">Confirm Join Queue</h3>
            <p className="text-sm text-neutral-400">You will be added to the station queue. Auto-assignment happens when a slot opens.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowJoinConfirm(false)}
                className="flex-1 px-3 py-2 border border-neutral-700 text-neutral-400 hover:bg-neutral-800 rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleJoin}
                disabled={submitting}
                className="flex-1 px-3 py-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded text-sm disabled:opacity-50"
              >
                {submitting ? 'Joining...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowCancelConfirm(false)}>
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-medium">Cancel Queue</h3>
            <p className="text-sm text-neutral-400">Are you sure? You will lose your current queue position.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 px-3 py-2 border border-neutral-700 text-neutral-400 hover:bg-neutral-800 rounded text-sm"
              >
                Keep Waiting
              </button>
              <button
                onClick={handleCancel}
                disabled={submitting}
                className="flex-1 px-3 py-2 bg-red-700 hover:bg-red-600 text-white rounded text-sm disabled:opacity-50"
              >
                {submitting ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
