'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  getUserRank,
  getUserLevelProgress,
  getMiningWeight,
} from '../lib/api-service'
import type {
  UserRank,
  LevelProgress,
  NextLevelRequirement,
  TerritoryHoldings,
  MiningWeight,
} from '../lib/types/api'

interface UseUserRankReturn {
  rank: UserRank | null
  currentLevel: number | null
  nextRank: UserRank | null
  nextLevel: number | null
  progressPercent: number
  holdings: TerritoryHoldings
  nextLevelRequirement: NextLevelRequirement | null
  miningWeight: MiningWeight | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

const EMPTY_HOLDINGS: TerritoryHoldings = { station: 0, matrix: 0, sector: 0, system: 0 }

export function useUserRank(userId: string | undefined): UseUserRankReturn {
  const [rank, setRank] = useState<UserRank | null>(null)
  const [progress, setProgress] = useState<LevelProgress | null>(null)
  const [miningWeight, setMiningWeight] = useState<MiningWeight | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const [rankRes, progressRes, weightRes] = await Promise.all([
        getUserRank(userId),
        getUserLevelProgress(userId),
        getMiningWeight(userId),
      ])

      if (rankRes.success && rankRes.data) {
        setRank(rankRes.data.rank as UserRank)
      }

      if (progressRes.success && progressRes.data) {
        setProgress(progressRes.data)
      }

      if (weightRes.success && weightRes.data) {
        setMiningWeight(weightRes.data)
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    refresh()
  }, [refresh])

  return {
    rank,
    currentLevel: progress?.current_level ?? null,
    nextRank: progress?.next_rank ?? null,
    nextLevel: progress?.next_level ?? null,
    progressPercent: progress?.progress_percent ?? 0,
    holdings: progress?.holdings ?? EMPTY_HOLDINGS,
    nextLevelRequirement: progress?.next_level_requirement ?? null,
    miningWeight,
    loading,
    error,
    refresh,
  }
}
