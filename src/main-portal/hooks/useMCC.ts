// AI-generated · AI-managed · AI-maintained
'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  getMCCBalance,
  getMCCLockPeriods,
  getMCCMintingHistory,
  getMCCMintingStats
} from '../lib/api-service'
import { getPDABalance, getPDAAddress } from '../lib/api'
import type {
  MCCBalance,
  MCCLockPeriod,
  MCCMinting,
  MCCMintingStats,
  PDABalance
} from '../lib/types/api'

interface PDAInfo {
  pda_address: string
  token_account: string
  bump: number
}

interface UseMCCReturn {
  balance: MCCBalance | null
  totalBalance: number
  availableBalance: number
  lockedBalance: number

  pdaBalance: PDABalance | null
  pdaInfo: PDAInfo | null
  onChainBalance: number

  lockPeriods: MCCLockPeriod[]

  mintingHistory: MCCMinting[]
  mintingStats: MCCMintingStats | null

  loading: boolean
  isRefreshing: boolean
  error: string | null

  refresh: () => Promise<void>
  refreshMinting: () => Promise<void>
  refreshPDABalance: () => Promise<void>
}

export function useMCC(userId: string | undefined): UseMCCReturn {
  const [balance, setBalance] = useState<MCCBalance | null>(null)
  const [lockPeriods, setLockPeriods] = useState<MCCLockPeriod[]>([])
  const [mintingHistory, setMintingHistory] = useState<MCCMinting[]>([])
  const [mintingStats, setMintingStats] = useState<MCCMintingStats | null>(null)
  const [pdaBalance, setPdaBalance] = useState<PDABalance | null>(null)
  const [pdaInfo, setPdaInfo] = useState<PDAInfo | null>(null)
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

      const [balanceRes, lockPeriodsRes] = await Promise.all([
        getMCCBalance(userId),
        getMCCLockPeriods(userId)
      ])

      if (balanceRes.success && balanceRes.data) {
        setBalance(balanceRes.data)
      } else if (balanceRes.error) {
        console.warn('[useMCC] \u83b7\u53d6\u4f59\u989d\u53d7\u9650:', balanceRes.error)
      }

      if (lockPeriodsRes.success && lockPeriodsRes.data && Array.isArray(lockPeriodsRes.data)) {
        setLockPeriods(lockPeriodsRes.data)
      } else {
        setLockPeriods([])
      }

    } catch (err) {
      console.error('[useMCC] \u5237\u65b0\u5931\u8d25:', err)
      setError(err instanceof Error ? err.message : '\u52a0\u8f7dMCC\u6570\u636e\u5931\u8d25')
    } finally {
      setLoading(false)
      setIsRefreshing(false)
      setHasInitialized(true)
    }
  }, [userId, canFetch, hasInitialized])

  const refreshMinting = useCallback(async () => {
    if (!canFetch) return

    try {
      const [historyRes, statsRes] = await Promise.all([
        getMCCMintingHistory(userId, 50),
        getMCCMintingStats()
      ])

      if (historyRes.success && historyRes.data && Array.isArray(historyRes.data)) {
        setMintingHistory(historyRes.data)
      } else {
        setMintingHistory([])
      }

      if (statsRes.success && statsRes.data) {
        setMintingStats(statsRes.data)
      }

    } catch (err) {
      console.error('[useMCC] \u5237\u65b0\u94f8\u9020\u4fe1\u606f\u5931\u8d25:', err)
      setMintingHistory([])
    }
  }, [userId, canFetch])

  const refreshPDABalance = useCallback(async () => {
    if (!canFetch) return

    try {
      const numericUserId = balance?.user_id
      if (!numericUserId) return

      const [balanceRes, addressRes] = await Promise.all([
        getPDABalance(String(numericUserId)),
        getPDAAddress(String(numericUserId))
      ])

      if (balanceRes.success && balanceRes.data) {
        setPdaBalance(balanceRes.data)
      }

      if (addressRes.success && addressRes.data) {
        setPdaInfo({
          pda_address: addressRes.data.pda_address,
          token_account: addressRes.data.token_account,
          bump: addressRes.data.bump
        })
      }

    } catch (err) {
      console.error('[useMCC] \u5237\u65b0PDA\u4f59\u989d\u5931\u8d25:', err)
    }
  }, [canFetch, balance?.user_id])

  useEffect(() => {
    if (canFetch) {
      // \u5e76\u884c\u52a0\u8f7d\u6240\u6709\u6570\u636e\uff0c\u51cf\u5c11\u6e32\u67d3\u6b21\u6570
      Promise.all([refresh(), refreshMinting()]).then(() => {
        // PDA \u4f59\u989d\u4f9d\u8d56 balance?.user_id\uff0c\u5728 refresh \u5b8c\u6210\u540e\u518d\u52a0\u8f7d
        refreshPDABalance()
      })
    } else {
      setLoading(false)
    }
  }, [canFetch]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!canFetch) return

    const interval = setInterval(() => {
      if (typeof document === 'undefined' || document.visibilityState === 'visible') refresh()
    }, 30000)

    return () => clearInterval(interval)
  }, [canFetch, refresh])

  return {
    balance,
    totalBalance: balance?.total_balance || 0,
    availableBalance: balance?.available_balance || 0,
    lockedBalance: balance?.locked_balance || 0,

    pdaBalance,
    pdaInfo,
    onChainBalance: pdaBalance?.balance || 0,

    lockPeriods,

    mintingHistory,
    mintingStats,

    loading,
    isRefreshing,
    error,

    refresh,
    refreshMinting,
    refreshPDABalance
  }
}
