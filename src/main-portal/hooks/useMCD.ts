// AI-generated · AI-managed · AI-maintained
'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  getMCDBalance,
  getMCDTransactions,
  getMCDDailyRewards
} from '../lib/api'
import type {
  MCDBalance,
  MCDTransaction,
  MCDUserDailyReward
} from '../lib/types/api'

interface UseMCDReturn {
  balance: MCDBalance | null
  mcdBalance: number
  totalReceived: number
  totalSpent: number

  transactions: MCDTransaction[]

  dailyRewards: MCDUserDailyReward[]

  loading: boolean
  isRefreshing: boolean
  error: string | null

  refresh: () => Promise<void>
  refreshTransactions: () => Promise<void>
  refreshDailyRewards: () => Promise<void>
}

export function useMCD(userId: string | undefined): UseMCDReturn {
  const [balance, setBalance] = useState<MCDBalance | null>(null)
  const [transactions, setTransactions] = useState<MCDTransaction[]>([])
  const [dailyRewards, setDailyRewards] = useState<MCDUserDailyReward[]>([])
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasInitialized, setHasInitialized] = useState(false)

  const canFetch = !!userId

  const refresh = useCallback(async () => {
    if (!canFetch) {
      setLoading(false)
      return
    }

    try {
      if (hasInitialized) {
        setIsRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)

      const balanceRes = await getMCDBalance(userId)

      if (balanceRes.success && balanceRes.data) {
        setBalance(balanceRes.data)
      } else if (balanceRes.error) {
        console.warn('[useMCD] \u83b7\u53d6\u4f59\u989d\u53d7\u9650:', balanceRes.error)
      }

    } catch (err) {
      console.error('[useMCD] \u5237\u65b0\u5931\u8d25:', err)
      setError(err instanceof Error ? err.message : '\u52a0\u8f7dMCD\u6570\u636e\u5931\u8d25')
    } finally {
      setLoading(false)
      setIsRefreshing(false)
      setHasInitialized(true)
    }
  }, [userId, canFetch, hasInitialized])

  const refreshTransactions = useCallback(async () => {
    if (!canFetch) return

    try {
      const res = await getMCDTransactions(userId, { limit: 50 })
      if (res.success && res.data && Array.isArray(res.data)) {
        setTransactions(res.data)
      } else {
        console.warn('[useMCD] \u4ea4\u6613\u5386\u53f2\u8fd4\u56de\u975e\u6570\u7ec4\u6570\u636e:', res)
        setTransactions([])
      }
    } catch (err) {
      console.error('[useMCD] \u5237\u65b0\u4ea4\u6613\u5386\u53f2\u5931\u8d25:', err)
      setTransactions([])
    }
  }, [userId, canFetch])

  const refreshDailyRewards = useCallback(async () => {
    if (!canFetch) return

    try {
      const res = await getMCDDailyRewards(userId, { limit: 30 })
      if (res.success && res.data && Array.isArray(res.data)) {
        setDailyRewards(res.data)
      } else {
        console.warn('[useMCD] \u6bcf\u65e5\u9886\u53d6\u8bb0\u5f55\u8fd4\u56de\u975e\u6570\u7ec4\u6570\u636e:', res)
        setDailyRewards([])
      }
    } catch (err) {
      console.error('[useMCD] \u5237\u65b0\u6bcf\u65e5\u9886\u53d6\u8bb0\u5f55\u5931\u8d25:', err)
      setDailyRewards([])
    }
  }, [userId, canFetch])

  useEffect(() => {
    if (canFetch) {
      Promise.all([refresh(), refreshTransactions(), refreshDailyRewards()])
    } else {
      setLoading(false)
    }
  }, [canFetch]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!canFetch) return

    const interval = setInterval(() => {
      refresh()
    }, 60000)

    return () => clearInterval(interval)
  }, [canFetch, refresh])

  return {
    balance,
    mcdBalance: balance?.balance || 0,
    totalReceived: balance?.total_received || 0,
    totalSpent: balance?.total_spent || 0,

    transactions,

    dailyRewards,

    loading,
    isRefreshing,
    error,

    refresh,
    refreshTransactions,
    refreshDailyRewards
  }
}
