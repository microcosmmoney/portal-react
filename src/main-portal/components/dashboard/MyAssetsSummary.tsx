'use client'

import { useState, useEffect, useCallback } from 'react'
import { useWallet } from '../../contexts/WalletContext'
import { useMarketData } from '../../hooks/useMarketData'
import { fetchApi } from '../../lib/api'
import { getMCCBalance as getOnChainMCCBalance } from '../../lib/api/blockchain'
import { Link } from '../../i18n/navigation'
import { Loader2, Eye, Lock, Wallet, TrendingUp } from 'lucide-react'

export default function MyAssetsSummary() {
  const {
    mcdAmount,
    mcdTotalReceived,
    mcdTotalSpent,
    lockPeriods,
    userRank,
    nextRank,
    progressPercent,
    nextLevelRequirement,
  } = useWallet()

  const { data: marketData } = useMarketData()
  const [onChainMCC, setOnChainMCC] = useState<number | null>(null)
  const [mccLoading, setMccLoading] = useState(true)
  const [walletCount, setWalletCount] = useState(0)

  const loadOnChainMCC = useCallback(async () => {
    setMccLoading(true)
    try {
      const listRes = await fetchApi('/auth/wallet/list')
      if (!listRes.success || !listRes.data?.wallets) {
        setOnChainMCC(0)
        setMccLoading(false)
        return
      }
      const wallets: { wallet_address: string }[] = listRes.data.wallets
      setWalletCount(wallets.length)
      if (wallets.length === 0) {
        setOnChainMCC(0)
        setMccLoading(false)
        return
      }

      const results = await Promise.allSettled(
        wallets.map(w => getOnChainMCCBalance(w.wallet_address))
      )

      let total = 0
      for (const r of results) {
        if (r.status === 'fulfilled' && r.value) total += r.value.balance
      }
      setOnChainMCC(total)
    } catch {
      setOnChainMCC(0)
    } finally {
      setMccLoading(false)
    }
  }, [])

  useEffect(() => {
    loadOnChainMCC()
  }, [loadOnChainMCC])

  const mccDisplay = onChainMCC ?? 0
  const mccUsdValue = marketData?.price ? mccDisplay * marketData.price : 0
  const activeLocks = Array.isArray(lockPeriods) ? lockPeriods.filter((p) => p.status === 'locked') : []
  const lockedAmount = activeLocks.reduce((sum, l) => sum + (l.amount || 0), 0)

  const getRankColor = (rank: string | null) => {
    if (!rank) return 'text-neutral-500'
    const map: Record<string, string> = {
      miner: 'text-cyan-300',
      commander: 'text-white', pioneer: 'text-cyan-400', warden: 'text-cyan-300', admiral: 'text-cyan-300',
    }
    return map[rank.toLowerCase()] || 'text-neutral-400'
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
      {/* MCC Balance */}
      <Link href="/mcc/wallet" className="block group">
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 sm:p-4 hover:border-cyan-400/50 dash-card h-full">
          <div className="flex items-center gap-1.5 mb-2">
            <Eye className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-400 text-[10px] font-mono tracking-wider">MCC_BALANCE</span>
          </div>
          <div className="text-base sm:text-2xl font-bold font-mono text-cyan-400">
            {mccLoading
              ? <Loader2 className="w-5 h-5 animate-spin inline" />
              : mccDisplay.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
            }
          </div>
          {mccUsdValue > 0 && (
            <div className="text-xs text-neutral-500 font-mono mt-1">
              ≈ ${mccUsdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          )}
        </div>
      </Link>

      {/* MCD Balance */}
      <Link href="/mcc/mcd" className="block group">
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 sm:p-4 hover:border-cyan-400/50 dash-card h-full">
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-400 text-[10px] font-mono tracking-wider">MCD_BALANCE</span>
          </div>
          <div className="text-base sm:text-2xl font-bold font-mono text-white">
            {mcdAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-neutral-500 font-mono mt-1">
            in: {mcdTotalReceived.toLocaleString('en-US', { maximumFractionDigits: 0 })} out: {mcdTotalSpent.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </div>
        </div>
      </Link>

      {/* Locked Balance */}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 sm:p-4 hover:border-cyan-400/50 dash-card">
        <div className="flex items-center gap-1.5 mb-2">
          <Lock className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-neutral-400 text-[10px] font-mono tracking-wider">LOCKED</span>
        </div>
        <div className="text-base sm:text-2xl font-bold font-mono text-white">
          {lockedAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
        </div>
        <div className="text-[10px] text-neutral-500 font-mono mt-1">
          {activeLocks.length} lock period{activeLocks.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Wallets */}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 sm:p-4 hover:border-cyan-400/50 dash-card">
        <div className="flex items-center gap-1.5 mb-2">
          <Wallet className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-neutral-400 text-[10px] font-mono tracking-wider">WALLETS</span>
        </div>
        <div className="text-base sm:text-2xl font-bold font-mono text-white">{walletCount}</div>
      </div>

      {/* User Rank */}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 sm:p-4 hover:border-cyan-400/50 dash-card">
        <div className="text-neutral-400 text-[10px] font-mono tracking-wider mb-2">RANK</div>
        <div className={`text-lg font-bold font-mono ${getRankColor(userRank)}`}>
          {userRank || 'N/A'}
        </div>
        {nextRank && (
          <div className="mt-2">
            <div className="w-full bg-neutral-800 rounded-full h-1.5">
              <div
                className="bg-cyan-400 h-1.5 rounded-full transition-all"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
            <div className="text-[10px] text-neutral-500 font-mono mt-1">
              {nextLevelRequirement ? `${nextLevelRequirement.have}/${nextLevelRequirement.need} ${nextLevelRequirement.tier}` : `${progressPercent.toFixed(0)}%`} → {nextRank}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
