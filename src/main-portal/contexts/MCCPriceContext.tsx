// AI-generated · AI-managed · AI-maintained
'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

const POLL_INTERVAL = 15_000 // 15 seconds

export interface MCCTickerData {
  price: number | null
  basePrice: number | null
  marketPrice: number | null
  cpmmReserves: { mcc: number; usdc: number } | null
  miningVaultMcc: number | null
  volume24h: { total: number; buy: number; sell: number } | null
  trades24h: { buys: number; sells: number } | null
  lastTrade: { price: number; amount: number; direction: string; time: number } | null
  updatedAt: string | null
  // Computed values (derived from price, zero cost)
  fdv: number | null         // price * 1B total supply
  miningPrice: number | null // base_price * 4
}

interface MCCPriceContextValue extends MCCTickerData {
  loading: boolean
  refresh: () => Promise<void>
}

const MCCPriceContext = createContext<MCCPriceContextValue | null>(null)

export function MCCPriceProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<MCCTickerData>({
    price: null, basePrice: null, marketPrice: null,
    cpmmReserves: null, miningVaultMcc: null,
    volume24h: null, trades24h: null, lastTrade: null,
    updatedAt: null, fdv: null, miningPrice: null,
  })
  const [loading, setLoading] = useState(true)

  const fetchTicker = useCallback(async () => {
    try {
      const res = await fetch('/api/stats/ticker')
      if (!res.ok) return

      const json = await res.json()
      if (!json.success || !json.data) return

      const d = json.data
      const price = d.price ?? null

      setData({
        price,
        basePrice: d.base_price ?? null,
        marketPrice: d.market_price ?? null,
        cpmmReserves: d.cpmm_reserves ?? null,
        miningVaultMcc: d.mining_vault_mcc ?? null,
        volume24h: d.volume_24h ?? null,
        trades24h: d.trades_24h ?? null,
        lastTrade: d.last_trade ?? null,
        updatedAt: d.updated_at ?? null,
        fdv: price ? price * 1_000_000_000 : null,
        miningPrice: (d.base_price ? d.base_price * 4 : null),
      })
    } catch {
      // Silent \u2014 stale data is acceptable
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTicker()
    const interval = setInterval(fetchTicker, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchTicker])

  return (
    <MCCPriceContext.Provider value={{ ...data, loading, refresh: fetchTicker }}>
      {children}
    </MCCPriceContext.Provider>
  )
}

export function useMCCPrice(): MCCPriceContextValue {
  const ctx = useContext(MCCPriceContext)
  if (!ctx) {
    // Return safe defaults when used outside provider (e.g. in static pages)
    return {
      price: null, basePrice: null, marketPrice: null,
      cpmmReserves: null, miningVaultMcc: null,
      volume24h: null, trades24h: null, lastTrade: null,
      updatedAt: null, fdv: null, miningPrice: null,
      loading: true, refresh: async () => {},
    }
  }
  return ctx
}
