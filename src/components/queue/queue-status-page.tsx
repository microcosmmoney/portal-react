'use client'

import { useState, useEffect, useCallback } from 'react'
import { useMicrocosmApi } from '@microcosmmoney/auth-react'
import { TerminalCard } from '../terminal'
import { useTranslations } from '../../i18n-context'

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
}

export function MicrocosmQueueStatusPage({}: MicrocosmQueueStatusPageProps = {}) {
  const t = useTranslations('queueStatus')
  const api = useMicrocosmApi()
  const [userQueue, setUserQueue] = useState<UserQueueStatus | null>(null)
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
  }, [api])

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
      <div className="max-w-7xl mx-auto px-2 py-3 space-y-2 2xs:px-3 2xs:py-4 2xs:space-y-3 sm:px-6 sm:py-6 sm:space-y-6 font-mono">
        <div>
          <h1 className="text-base 2xs:text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-wider truncate">{t('title', 'Territory Position Management')}</h1>
          <p className="text-[10px] 2xs:text-xs sm:text-sm text-neutral-400">{t('subtitle', 'Onboarding, queuing, and territory assignment management')}</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <span className="text-neutral-400">{t('loading', 'Loading...')}</span>
        </div>
      </div>
    )
  }

  const level = userQueue?.user_type?.toLowerCase() || 'miner'
  const levelLabel = LEVEL_LABELS[level] || 'Miner'

  return (
    <div className="max-w-7xl mx-auto px-2 py-3 space-y-2 2xs:px-3 2xs:py-4 2xs:space-y-3 sm:px-6 sm:py-6 sm:space-y-6 font-mono">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h1 className="text-base 2xs:text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-wider truncate">{t('title', 'Territory Position Management')}</h1>
          <p className="text-[10px] 2xs:text-xs sm:text-sm text-neutral-400">{t('subtitle', 'Onboarding, queuing, and territory assignment management')}</p>
        </div>
        <button
          onClick={loadStatus}
          className="px-2 py-1 2xs:px-3 2xs:py-1.5 text-[10px] 2xs:text-xs border border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white rounded transition-colors whitespace-nowrap shrink-0"
        >
          {t('refresh', 'Refresh')}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-900/20 border border-red-800 rounded text-sm text-red-300">
          {error}
        </div>
      )}

      <TerminalCard>
        <div className="p-3 2xs:p-4 bg-neutral-800 rounded mb-3 2xs:mb-4">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[10px] 2xs:text-xs text-[#5EEAD4] tracking-widest uppercase truncate">{t('currentLevel', 'CURRENT LEVEL')}</div>
              <div className="text-base 2xs:text-lg xs:text-xl font-bold text-cyan-300 truncate">{levelLabel}</div>
            </div>
            <span className="px-2 2xs:px-3 py-1 bg-cyan-900/30 text-cyan-300 rounded border border-cyan-700 text-[10px] 2xs:text-xs whitespace-nowrap shrink-0">
              Lv.{Object.keys(LEVEL_LABELS).indexOf(level) + 3}
            </span>
          </div>
        </div>

        {userQueue?.is_onboarded ? (
          <div className="bg-neutral-950 rounded-lg p-3 2xs:p-4 sm:p-6 border border-neutral-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base 2xs:text-lg font-semibold text-white">{t('onboarded', 'Onboarded')}</h3>
                <p className="text-sm text-neutral-400">
                  {t('onboardedTo', 'You have been onboarded to {station}', { station: userQueue.station_name || userQueue.territory_id || '' })}
                </p>
              </div>
              <span className="px-2 py-1 bg-white/20 text-white rounded text-xs">{t('active', 'Active')}</span>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-neutral-900 rounded-lg p-4 text-center">
                <p className="text-xl font-bold text-white">{userQueue.territory_id}</p>
                <p className="text-sm text-neutral-400">{t('territoryId', 'Territory ID')}</p>
              </div>
            </div>
          </div>
        ) : userQueue?.in_queue ? (
          <div className="bg-neutral-950 rounded-lg p-3 2xs:p-4 sm:p-6 border border-neutral-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base 2xs:text-lg font-semibold text-white">{t('inQueue', 'In Queue')}</h3>
                <p className="text-sm text-neutral-400">{t('waitingAssignment', 'You are waiting for territory assignment')}</p>
              </div>
              {userQueue.status && (
                <span className="px-2 py-1 bg-cyan-900/30 text-cyan-300 rounded text-xs">{userQueue.status}</span>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 2xs:gap-3 sm:gap-4 mb-3 2xs:mb-4">
              <div className="text-center min-w-0">
                <p className="text-lg 2xs:text-xl xs:text-2xl sm:text-3xl font-bold text-white truncate">{userQueue.position || '-'}</p>
                <p className="text-[10px] 2xs:text-xs text-neutral-400 truncate">{t('queuePosition', 'Queue Position')}</p>
              </div>
              <div className="text-center min-w-0">
                <p className="text-lg 2xs:text-xl xs:text-2xl sm:text-3xl font-bold text-white truncate">{userQueue.estimated_wait_minutes || '-'}</p>
                <p className="text-[10px] 2xs:text-xs text-neutral-400 truncate">{t('estimatedWait', 'Est. Wait (min)')}</p>
              </div>
              <div className="text-center min-w-0">
                <p className="text-xs 2xs:text-sm font-semibold text-white truncate">
                  {userQueue.preferred_territory_id || t('autoAssign', 'Auto Assign')}
                </p>
                <p className="text-[10px] 2xs:text-xs text-neutral-400 truncate">{t('preferredTerritory', 'Preferred Territory')}</p>
              </div>
              <div className="text-center min-w-0">
                <p className="text-xs 2xs:text-sm font-semibold text-white truncate">
                  {userQueue.joined_at ? new Date(userQueue.joined_at).toLocaleString() : '-'}
                </p>
                <p className="text-[10px] 2xs:text-xs text-neutral-400 truncate">{t('joinTime', 'Join Time')}</p>
              </div>
            </div>
            <button
              onClick={() => setShowCancelConfirm(true)}
              disabled={submitting}
              className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded transition-colors disabled:opacity-50 text-xs 2xs:text-sm whitespace-nowrap"
            >
              {t('cancelQueue', 'Cancel Queue')}
            </button>
          </div>
        ) : (
          <div className="bg-neutral-950 rounded-lg p-3 2xs:p-4 sm:p-6 border border-neutral-800">
            <div className="mb-4">
              <h3 className="text-base 2xs:text-lg font-semibold text-white">{t('notOnboarded', 'Not Onboarded')}</h3>
              <p className="text-sm text-neutral-400">{t('notOnboardedDesc', 'You have not been onboarded to any territory')}</p>
            </div>
            <button
              onClick={() => setShowJoinConfirm(true)}
              disabled={submitting}
              className="w-full py-2 bg-white/20 hover:bg-neutral-800 text-white border border-neutral-700 rounded transition-colors disabled:opacity-50 text-xs 2xs:text-sm whitespace-nowrap"
            >
              {t('joinQueue', 'Join Queue')}
            </button>
          </div>
        )}
      </TerminalCard>

      {showJoinConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowJoinConfirm(false)}>
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-medium">{t('joinDialogTitle', 'Join Territory')}</h3>
            <p className="text-sm text-neutral-400">{t('joinDialogDesc', 'Choose to join a specific territory or auto-assign')}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowJoinConfirm(false)}
                className="flex-1 px-3 py-2 border border-neutral-700 text-neutral-400 hover:bg-neutral-800 rounded text-sm"
              >
                {t('cancel', 'Cancel')}
              </button>
              <button
                onClick={handleJoin}
                disabled={submitting}
                className="flex-1 px-3 py-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded text-sm disabled:opacity-50"
              >
                {submitting ? t('submitting', 'Processing...') : t('immediateJoin', 'Join Immediately')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowCancelConfirm(false)}>
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-medium">{t('cancelQueueTitle', 'Cancel Queue')}</h3>
            <p className="text-sm text-neutral-400">{t('cancelQueueDesc', 'Are you sure you want to cancel queuing? You will need to rejoin the queue to get onboarded.')}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 px-3 py-2 border border-neutral-700 text-neutral-400 hover:bg-neutral-800 rounded text-sm"
              >
                {t('goBack', 'Go Back')}
              </button>
              <button
                onClick={handleCancel}
                disabled={submitting}
                className="flex-1 px-3 py-2 bg-red-700 hover:bg-red-600 text-white rounded text-sm disabled:opacity-50"
              >
                {submitting ? t('submitting', 'Processing...') : t('confirmCancel', 'Confirm Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
