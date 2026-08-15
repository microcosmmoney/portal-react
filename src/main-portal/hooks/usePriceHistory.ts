// AI-generated · AI-managed · AI-maintained
'use client'

import { useState, useEffect, useCallback } from 'react'
import type { OHLCVData, PriceTimeRange } from '../lib/api/geckoterminal'

interface UsePriceHistoryReturn {
  data: OHLCVData[] | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function usePriceHistory(range: PriceTimeRange = '1Y'): UsePriceHistoryReturn {
  const [data, setData] = useState<OHLCVData[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setError(null)
      const response = await fetch(`/api/stats/price-history?range=${range}`)
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
  }, [range])

  useEffect(() => {
    setLoading(true)
    // \u975e\u5373\u65f6\u6570\u636e: \u9875\u9762\u52a0\u8f7d\u8bfb\u4e00\u6b21\u7f13\u5b58, \u4e0d\u8f6e\u8be2 (\u540e\u7aef scheduler \u6bcf4h\u5237\u65b0)
    refresh()
  }, [refresh])

  return { data, loading, error, refresh }
}
