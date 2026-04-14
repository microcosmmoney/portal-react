'use client'

import { useState, useEffect, useCallback } from 'react'
import { useMicrocosmApi } from '@microcosmmoney/auth-react'
import { TerminalCard } from '../terminal'
import { useTranslations } from '../../i18n-context'

interface RewardHistory {
  id: number
  manager_id: string
  recipient_id: string
  amount: number
  reason: string
  unit_id: number
  created_at: string
  manager_email?: string
  recipient_email?: string
}

interface RewardStats {
  total_sent: number
  total_received: number
  send_count: number
  receive_count: number
}

interface LeaderboardEntry {
  user_id: string
  email: string
  total_received?: number
  total_sent?: number
  reward_count: number
}

interface BatchRow {
  user_id: string
  amount: string
  reason: string
}

export interface MicrocosmRewardsPageProps {
  basePath?: string
  onNavigate?: (path: string) => void
}

export function MicrocosmRewardsPage({}: MicrocosmRewardsPageProps = {}) {
  const t = useTranslations('rewardsDash')
  const api = useMicrocosmApi()
  const [history, setHistory] = useState<RewardHistory[]>([])
  const [stats, setStats] = useState<RewardStats | null>(null)
  const [topRecipients, setTopRecipients] = useState<LeaderboardEntry[]>([])
  const [topSenders, setTopSenders] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'history' | 'leaderboard'>('history')
  const [showSendDialog, setShowSendDialog] = useState(false)
  const [showBatchDialog, setShowBatchDialog] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [singleReward, setSingleReward] = useState({ recipient_id: '', amount: '', reason: '' })
  const [batchRewards, setBatchRewards] = useState<BatchRow[]>([{ user_id: '', amount: '', reason: '' }])

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      try {
        const historyRes = await api.get<any>('/territories/rewards/history?limit=50')
        const data = historyRes?.data ?? historyRes
        setHistory(Array.isArray(data?.rewards) ? data.rewards : Array.isArray(data) ? data : [])
        setStats(data?.stats || historyRes?.stats || null)
      } catch {
        setHistory([])
      }
      try {
        const lbRes = await api.get<any>('/territories/rewards/leaderboard?period=month&limit=10')
        const data = lbRes?.data ?? lbRes
        setTopRecipients(Array.isArray(data?.top_recipients) ? data.top_recipients : [])
        setTopSenders(Array.isArray(data?.top_senders) ? data.top_senders : [])
      } catch {}
    } finally {
      setLoading(false)
    }
  }, [api])

  useEffect(() => { loadData() }, [loadData])

  const handleSendReward = async () => {
    if (!singleReward.recipient_id || !singleReward.amount) {
      setError('Fill recipient and amount')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await api.post('/territories/rewards/send', {
        recipient_id: singleReward.recipient_id,
        amount: parseFloat(singleReward.amount),
        reason: singleReward.reason,
      })
      setShowSendDialog(false)
      setSingleReward({ recipient_id: '', amount: '', reason: '' })
      await loadData()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Send failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleBatchReward = async () => {
    const valid = batchRewards.filter(r => r.user_id && r.amount)
    if (valid.length === 0) {
      setError('Add at least one valid reward')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await api.post('/territories/rewards/batch', {
        rewards: valid.map(r => ({
          user_id: r.user_id,
          amount: parseFloat(r.amount),
          reason: r.reason,
        })),
      })
      setShowBatchDialog(false)
      setBatchRewards([{ user_id: '', amount: '', reason: '' }])
      await loadData()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Batch failed')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateStr: string) => {
    try { return new Date(dateStr).toLocaleString() } catch { return '-' }
  }

  return (
    <div className="max-w-7xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6 font-mono">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wider">{t('title', 'Manager Rewards')}</h1>
          <p className="text-xs sm:text-sm text-neutral-400">{t('subtitle', 'Reward team members with your personal MCC')}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSendDialog(true)}
            className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-600 text-white rounded text-sm"
          >
            {t('sendReward', 'Send Reward')}
          </button>
          <button
            onClick={() => setShowBatchDialog(true)}
            className="px-3 py-1.5 border border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white rounded text-sm"
          >
            {t('batchSend', 'Batch Send')}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-900/20 border border-red-800 rounded text-sm text-red-300">{error}</div>
      )}

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <TerminalCard>
            <div className="text-xs text-[#5EEAD4] tracking-widest uppercase mb-1">{t('mccReceived', 'MCC Received')}</div>
            <div className="text-2xl font-bold text-white">{Number(stats.total_received || 0).toFixed(2)}</div>
          </TerminalCard>
          <TerminalCard>
            <div className="text-xs text-[#5EEAD4] tracking-widest uppercase mb-1">{t('mccSent', 'MCC Sent')}</div>
            <div className="text-2xl font-bold text-cyan-400">{Number(stats.total_sent || 0).toFixed(2)}</div>
          </TerminalCard>
          <TerminalCard>
            <div className="text-xs text-[#5EEAD4] tracking-widest uppercase mb-1">{t('receiveCount', 'Times Received')}</div>
            <div className="text-2xl font-bold text-white">{stats.receive_count}</div>
          </TerminalCard>
          <TerminalCard>
            <div className="text-xs text-[#5EEAD4] tracking-widest uppercase mb-1">{t('sendCount', 'Times Sent')}</div>
            <div className="text-2xl font-bold text-white">{stats.send_count}</div>
          </TerminalCard>
        </div>
      )}

      <div className="flex gap-2 border-b border-neutral-800">
        <button
          onClick={() => setTab('history')}
          className={`px-4 py-2 text-sm ${
            tab === 'history' ? 'text-white border-b-2 border-cyan-400' : 'text-neutral-400 hover:text-white'
          }`}
        >
          {t('historyTab', 'History')}
        </button>
        <button
          onClick={() => setTab('leaderboard')}
          className={`px-4 py-2 text-sm ${
            tab === 'leaderboard' ? 'text-white border-b-2 border-cyan-400' : 'text-neutral-400 hover:text-white'
          }`}
        >
          {t('leaderboardTab', 'Leaderboard')}
        </button>
      </div>

      {tab === 'history' && (
        <TerminalCard title={t('rewardHistory', 'Reward History')}>
          {loading ? (
            <div className="text-center py-8 text-neutral-500">{t('loadingText', 'Loading...')}</div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">{t('noRecords', 'No reward records')}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-neutral-400 border-b border-neutral-800">
                    <th className="text-left py-2">{t('time', 'Time')}</th>
                    <th className="text-left py-2">{t('sender', 'Sender')}</th>
                    <th className="text-left py-2">{t('recipient', 'Recipient')}</th>
                    <th className="text-right py-2">{t('amount', 'Amount')}</th>
                    <th className="text-left py-2">{t('reason', 'Reason')}</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(record => (
                    <tr key={record.id} className="border-b border-neutral-800">
                      <td className="py-2 text-xs text-neutral-500">{formatDate(record.created_at)}</td>
                      <td className="py-2 text-neutral-300">{record.manager_email || record.manager_id}</td>
                      <td className="py-2 text-neutral-300">{record.recipient_email || record.recipient_id}</td>
                      <td className="py-2 text-right text-white">+{Number(record.amount || 0).toFixed(2)} MCC</td>
                      <td className="py-2 text-xs text-neutral-500">{record.reason || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TerminalCard>
      )}

      {tab === 'leaderboard' && (
        <div className="grid md:grid-cols-2 gap-6">
          <TerminalCard title={t('topReceived', 'Most Received This Month')}>
            {topRecipients.length === 0 ? (
              <div className="text-center py-4 text-neutral-500">{t('noData', 'No data')}</div>
            ) : (
              <div className="space-y-3">
                {topRecipients.map((entry, idx) => (
                  <div key={entry.user_id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 flex items-center justify-center rounded text-xs ${
                          idx < 3 ? 'bg-cyan-400/20 text-cyan-300' : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-neutral-300">{entry.email || entry.user_id}</span>
                    </div>
                    <span className="text-white">{Number(entry.total_received || 0).toFixed(2)} MCC</span>
                  </div>
                ))}
              </div>
            )}
          </TerminalCard>
          <TerminalCard title={t('topSent', 'Most Sent This Month')}>
            {topSenders.length === 0 ? (
              <div className="text-center py-4 text-neutral-500">{t('noData', 'No data')}</div>
            ) : (
              <div className="space-y-3">
                {topSenders.map((entry, idx) => (
                  <div key={entry.user_id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 flex items-center justify-center rounded text-xs ${
                          idx < 3 ? 'bg-cyan-400/20 text-cyan-300' : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-neutral-300">{entry.email || entry.user_id}</span>
                    </div>
                    <span className="text-cyan-400">{Number(entry.total_sent || 0).toFixed(2)} MCC</span>
                  </div>
                ))}
              </div>
            )}
          </TerminalCard>
        </div>
      )}

      {showSendDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowSendDialog(false)}>
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-medium">{t('sendSingleTitle', 'Send Single Reward')}</h3>
            <div>
              <label className="text-xs text-[#5EEAD4] tracking-widest uppercase block mb-1">{t('recipientId', 'Recipient ID')}</label>
              <input
                type="text"
                value={singleReward.recipient_id}
                onChange={(e) => setSingleReward({ ...singleReward, recipient_id: e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-600 text-white rounded px-3 py-2 text-sm"
                placeholder={t('recipientPlaceholder', 'Enter user ID or email')}
              />
            </div>
            <div>
              <label className="text-xs text-[#5EEAD4] tracking-widest uppercase block mb-1">{t('rewardAmount', 'Reward Amount (MCC)')}</label>
              <input
                type="number"
                min={1}
                max={10000}
                value={singleReward.amount}
                onChange={(e) => setSingleReward({ ...singleReward, amount: e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-600 text-white rounded px-3 py-2 text-sm"
                placeholder={t('amountPlaceholder', 'Enter MCC amount')}
              />
            </div>
            <div>
              <label className="text-xs text-[#5EEAD4] tracking-widest uppercase block mb-1">{t('reasonLabel', 'Reason (optional)')}</label>
              <textarea
                value={singleReward.reason}
                onChange={(e) => setSingleReward({ ...singleReward, reason: e.target.value })}
                rows={2}
                className="w-full bg-neutral-800 border border-neutral-600 text-white rounded px-3 py-2 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSendDialog(false)}
                className="flex-1 px-3 py-2 border border-neutral-700 text-neutral-400 hover:bg-neutral-800 rounded text-sm"
              >
                {t('cancel', 'Cancel')}
              </button>
              <button
                onClick={handleSendReward}
                disabled={submitting}
                className="flex-1 px-3 py-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded text-sm disabled:opacity-50"
              >
                {submitting ? t('loadingText', 'Loading...') : t('send', 'Send')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showBatchDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowBatchDialog(false)}>
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg w-full max-w-2xl p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-medium">{t('batchTitle', 'Batch Send Rewards')}</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {batchRewards.map((r, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <input
                    value={r.user_id}
                    onChange={(e) => {
                      const next = [...batchRewards]
                      next[i] = { ...next[i], user_id: e.target.value }
                      setBatchRewards(next)
                    }}
                    placeholder={t('userId', 'User ID')}
                    className="flex-1 bg-neutral-800 border border-neutral-600 text-white rounded px-2 py-1.5 text-sm"
                  />
                  <input
                    type="number"
                    value={r.amount}
                    onChange={(e) => {
                      const next = [...batchRewards]
                      next[i] = { ...next[i], amount: e.target.value }
                      setBatchRewards(next)
                    }}
                    placeholder="MCC"
                    className="w-24 bg-neutral-800 border border-neutral-600 text-white rounded px-2 py-1.5 text-sm"
                  />
                  <input
                    value={r.reason}
                    onChange={(e) => {
                      const next = [...batchRewards]
                      next[i] = { ...next[i], reason: e.target.value }
                      setBatchRewards(next)
                    }}
                    placeholder={t('reason', 'Reason')}
                    className="flex-1 bg-neutral-800 border border-neutral-600 text-white rounded px-2 py-1.5 text-sm"
                  />
                  {batchRewards.length > 1 && (
                    <button
                      onClick={() => setBatchRewards(batchRewards.filter((_, idx) => idx !== i))}
                      className="px-2 py-1 text-red-400 hover:bg-red-900/20 rounded text-sm"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => setBatchRewards([...batchRewards, { user_id: '', amount: '', reason: '' }])}
                className="w-full px-3 py-2 border border-dashed border-neutral-700 text-neutral-400 hover:bg-neutral-800 rounded text-sm"
              >
                + {t('addRow', 'Add Row')}
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowBatchDialog(false)}
                className="flex-1 px-3 py-2 border border-neutral-700 text-neutral-400 hover:bg-neutral-800 rounded text-sm"
              >
                {t('cancel', 'Cancel')}
              </button>
              <button
                onClick={handleBatchReward}
                disabled={submitting}
                className="flex-1 px-3 py-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded text-sm disabled:opacity-50"
              >
                {submitting ? t('loadingText', 'Loading...') : t('batchSend', 'Batch Send')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
