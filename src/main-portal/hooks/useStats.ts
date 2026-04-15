// AI-generated · AI-managed · AI-maintained
'use client'

import { useState, useEffect, useCallback } from 'react'

export interface OverviewStats {
  total_users: number
  active_users_24h: number
  new_users_today: number
  total_territories: number
  mcc_circulating: number
  mcd_locked: number
  updated_at: string
}

export interface MCCStats {
  total_supply: number
  circulating_supply: number
  genesis_pool_balance: number
  current_phase: number
  current_mining_rate: number
  next_halving_at: number
  remaining_to_halving: number
  total_mining_count: number
  total_mining_usdc: number
  holders_count: number
}

export interface MCDStats {
  total_supply: number
  circulating_supply: number
  genesis_pool_balance: number
  total_vault_balance: number
  total_spent: number
  user_balance: number
  daily_distribution: number
  active_vaults: number
  holders_count: number
  daily_distribution_rate: number
}

export interface TerritoryItem {
  type: string
  name: string
  total: number
  active: number
  capacity: number
  population: number
}

export interface TerritoryStats {
  territories: TerritoryItem[]
  total_capacity: number
  total_users_in_territories: number
}

export interface UserLevelItem {
  level: number
  name: string
  chinese: string
  count: number
  percentage: number
}

export interface UserLevelStats {
  levels: UserLevelItem[]
  total_users: number
  miners_and_above: number
  new_users_today: number
  monthly_active_rate: number
}

export interface TeamWalletItem {
  key: string
  label: string
  address: string
  ata: string
  mcc_balance: number
  percentage: number
}

export interface TeamWalletStats {
  wallets: TeamWalletItem[]
  total_mcc: number
  updated_at: string
}

export interface MiningHistoryItem {
  date: string
  usdc_amount: number
  usdt_amount: number
  total_mcc: number
  total_mcd: number
  tx_count: number
}

export interface MiningHistoryStats {
  history: MiningHistoryItem[]
  days: number
  summary: {
    total_usdc: number
    total_usdt: number
    total_stablecoin: number
    total_mcc: number
    total_mcd: number
    total_tx: number
    avg_daily: number
  }
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

interface UseStatsReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

async function fetchStats<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`/api/stats/${endpoint}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error(`[useStats] fetch ${endpoint} error:`, error)
    return { success: false, error: String(error) }
  }
}

function createStatsHook<T>(endpoint: string, refreshInterval?: number) {
  return function useStatsData(): UseStatsReturn<T> {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const refresh = useCallback(async () => {
      try {
        setError(null)
        const result = await fetchStats<T>(endpoint)
        if (result.success && result.data) {
          setData(result.data)
        } else if (result.error) {
          setError(result.error)
        }
      } catch (err) {
        setError(String(err))
      } finally {
        setLoading(false)
      }
    }, [])

    useEffect(() => {
      refresh()

      if (refreshInterval) {
        const interval = setInterval(refresh, refreshInterval)
        return () => clearInterval(interval)
      }
    }, [refresh])

    return { data, loading, error, refresh }
  }
}

// \u975e\u5373\u65f6\u6570\u636e: \u4e0d\u8f6e\u8be2, \u9875\u9762\u52a0\u8f7d\u8bfb\u4e00\u6b21\u7f13\u5b58 (\u540e\u7aef scheduler \u6bcf4h\u5237\u65b0)
export const useOverviewStats = createStatsHook<OverviewStats>('overview')

export const useMCCStats = createStatsHook<MCCStats>('mcc')

export const useMCDStats = createStatsHook<MCDStats>('mcd')

export const useTerritoryStats = createStatsHook<TerritoryStats>('territories')

export const useUserLevelStats = createStatsHook<UserLevelStats>('users')

export const useTeamWalletStats = createStatsHook<TeamWalletStats>('team-wallets')

export interface UserGrowthPoint {
  date: string
  new_users: number
  total_users: number
}

export interface UserGrowthStats {
  history: UserGrowthPoint[]
  days: number
  total_users: number
}

export function useUserGrowth(days: number = 30): UseStatsReturn<UserGrowthStats> {
  const [data, setData] = useState<UserGrowthStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setError(null)
      const response = await fetch(`/api/stats/user-growth?days=${days}`)
      const result = await response.json()
      if (result.success && result.data) {
        setData(result.data)
      } else if (result.error) {
        setError(result.error)
      }
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => { refresh() }, [refresh])

  return { data, loading, error, refresh }
}

export function useMiningHistory(days: number = 7): UseStatsReturn<MiningHistoryStats> {
  const [data, setData] = useState<MiningHistoryStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setError(null)
      const response = await fetch(`/api/stats/mining-history?days=${days}`)
      const result = await response.json()
      if (result.success && result.data) {
        setData(result.data)
      } else if (result.error) {
        setError(result.error)
      }
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => {
    // \u975e\u5373\u65f6\u6570\u636e: \u9875\u9762\u52a0\u8f7d\u8bfb\u4e00\u6b21\u7f13\u5b58, \u4e0d\u8f6e\u8be2
    refresh()
  }, [refresh])

  return { data, loading, error, refresh }
}

export function useAllStats() {
  const overview = useOverviewStats()
  const mcc = useMCCStats()
  const mcd = useMCDStats()
  const territories = useTerritoryStats()
  const userLevels = useUserLevelStats()
  const teamWallets = useTeamWalletStats()
  const miningHistory = useMiningHistory(7)

  const loading =
    overview.loading ||
    mcc.loading ||
    mcd.loading ||
    territories.loading ||
    userLevels.loading ||
    teamWallets.loading ||
    miningHistory.loading

  const error =
    overview.error ||
    mcc.error ||
    mcd.error ||
    territories.error ||
    userLevels.error ||
    teamWallets.error ||
    miningHistory.error

  const refreshAll = useCallback(async () => {
    await Promise.all([
      overview.refresh(),
      mcc.refresh(),
      mcd.refresh(),
      territories.refresh(),
      userLevels.refresh(),
      teamWallets.refresh(),
      miningHistory.refresh()
    ])
  }, [overview, mcc, mcd, territories, userLevels, teamWallets, miningHistory])

  return {
    overview: overview.data,
    mcc: mcc.data,
    mcd: mcd.data,
    territories: territories.data,
    userLevels: userLevels.data,
    teamWallets: teamWallets.data,
    miningHistory: miningHistory.data,
    loading,
    error,
    refreshAll
  }
}
