// AI-generated · AI-managed · AI-maintained
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { MAINSTREAM_TOKENS, TOKEN_BY_MINT, type MainstreamToken } from '../lib/config/mainstream-tokens'

export interface TokenHolding {
  token: MainstreamToken
  balance: number
  price: number
  usdValue: number
  wallet?: string        // \u6240\u5c5e\u94b1\u5305\u5730\u5740 (flat list \u7528)
  walletShort?: string   // \u7f29\u5199 "HtaE...ifaF"
  isPrimary?: boolean    // \u662f\u5426\u4e3b\u94b1\u5305
}

export interface WalletTokenData {
  wallet_address: string
  is_primary: boolean
  holdings: TokenHolding[]
  totalUsdValue: number
}

export interface WalletTokenBalancesResult {
  wallets: WalletTokenData[]
  aggregated: TokenHolding[]
  flat: TokenHolding[]       // \u4e0d\u805a\u5408\uff0c\u6bcf\u884c\u5e26\u94b1\u5305\u6807\u8bc6
  totalUsdValue: number
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useWalletTokenBalances(
  walletInfos: { wallet_address: string; is_primary?: boolean }[]
): WalletTokenBalancesResult {
  const [walletData, setWalletData] = useState<WalletTokenData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const walletsKey = useMemo(
    () => walletInfos.map(w => w.wallet_address).sort().join(','),
    [walletInfos]
  )

  const primaryMap = useMemo(() => {
    const m = new Map<string, boolean>()
    walletInfos.forEach(w => m.set(w.wallet_address, w.is_primary || false))
    return m
  }, [walletInfos])

  const fetchAll = useCallback(async (force = false) => {
    if (!walletInfos.length) {
      setLoading(false)
      setWalletData([])
      return
    }

    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({ wallets: walletsKey })
      if (force) params.set('force', 'true')

      const resp = await fetch(`/api/blockchain-service/wallet/token-balances?${params.toString()}`)
      const json = await resp.json()

      if (!json.success) {
        setError(json.error || 'Failed to fetch balances')
        return
      }

      const apiWallets = json.data?.wallets || []
      const results: WalletTokenData[] = apiWallets.map((w: any) => {
        const holdings: TokenHolding[] = []
        const walletAddr = w.wallet as string
        const walletShort = `${walletAddr.slice(0, 4)}...${walletAddr.slice(-4)}`
        const isPrimary = primaryMap.get(walletAddr) || false
        for (const h of w.holdings || []) {
          const token = TOKEN_BY_MINT.get(h.mint)
          if (!token) continue
          const usdValue = h.usd_value || h.balance * (h.price || 0)
          // \u4fdd\u7559\u6240\u6709\u6709\u4f59\u989d\u7684\u4ee3\u5e01 (\u8fc7\u6ee4\u7531 UI \u5c42\u63a7\u5236)
          if (h.balance > 0) {
            holdings.push({ token, balance: h.balance, price: h.price || 0, usdValue, wallet: walletAddr, walletShort, isPrimary })
          }
        }
        holdings.sort((a, b) => b.usdValue - a.usdValue)
        return {
          wallet_address: walletAddr,
          is_primary: isPrimary,
          holdings,
          totalUsdValue: holdings.reduce((s, h) => s + h.usdValue, 0)
        }
      })

      setWalletData(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch balances')
    } finally {
      setLoading(false)
    }
  }, [walletsKey, primaryMap])

  useEffect(() => { fetchAll() }, [fetchAll])

  const aggregated = useMemo(() => {
    const map = new Map<string, TokenHolding>()
    for (const w of walletData) {
      for (const h of w.holdings) {
        const existing = map.get(h.token.mint)
        if (existing) {
          existing.balance += h.balance
          existing.usdValue += h.usdValue
        } else {
          map.set(h.token.mint, { ...h })
        }
      }
    }
    return Array.from(map.values()).sort((a, b) => b.usdValue - a.usdValue)
  }, [walletData])

  // \u4e0d\u805a\u5408\u7684\u5e73\u94fa\u5217\u8868\uff0c\u6bcf\u884c\u5e26\u94b1\u5305\u6807\u8bc6 (\u7528\u4e8e "all wallets" \u89c6\u56fe)
  const flat = useMemo(() => {
    const list: TokenHolding[] = []
    for (const w of walletData) {
      for (const h of w.holdings) {
        list.push(h) // \u5df2\u5e26 wallet/walletShort/isPrimary
      }
    }
    return list.sort((a, b) => b.usdValue - a.usdValue)
  }, [walletData])

  const totalUsdValue = useMemo(
    () => aggregated.reduce((s, h) => s + h.usdValue, 0),
    [aggregated]
  )

  return {
    wallets: walletData,
    aggregated,
    flat,
    totalUsdValue,
    loading,
    error,
    refresh: () => fetchAll(true)
  }
}
