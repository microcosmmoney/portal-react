// AI-generated · AI-managed · AI-maintained
"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RefreshCw, AlertCircle, Loader2, ExternalLink, CheckCircle2, Zap, TrendingUp, Coins, Link2, ChevronDown, ChevronUp, Wallet, History, Shield } from "lucide-react"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { useAuth } from "../../hooks/useAuth"
import { useWallet } from "../../contexts/WalletContext"
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { getMiningRatio, getX402MiningHistory, fetchApi } from "../../lib/api"
import { getMCCBalance as getOnChainMCCBalance, getPoolStatus } from "../../lib/api/blockchain"
import type { PoolStatus } from "../../lib/api/blockchain"
import type { MiningRatioInfo } from "../../lib/types/api"
import MCCHistory from "../wallet/MCCHistory"
import MiningModal from "./MiningModal"
import { cn } from "../../lib/utils"
import { FormattedDateTime } from "../ui/time-remaining"
import { useTranslations } from 'next-intl'
import { useMCCPrice } from "../../contexts/MCCPriceContext"
import { PriceChart } from "../data/charts/PriceChart"

interface X402MiningRecord {
  id: number
  tx_signature: string
  usdc_amount?: number
  stablecoin_amount?: number
  payment_type?: string
  mcc_amount: number
  has_developer?: boolean
  distribution?: {
    user: number
    lp?: number
    team?: number
    magistrate: number
    station_mcd: number
    developer_mcd?: number
  }
  wallets?: {
    user: string
    team?: string
    magistrate: string
    station_vault: string
    developer?: string
  }
  status: string
  created_at: string
}

const formatNumber = (num: string | number, decimals = 2) => {
  const parsedNum = parseFloat(String(num))
  return isNaN(parsedNum) ? "0.00" : parsedNum.toFixed(decimals)
}

const formatLargeNumber = (num: number | undefined | null, decimals = 2) => {
  if (num === undefined || num === null || isNaN(num)) return "0.00"
  return num.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

export default function MCCMiningPage() {
  const t = useTranslations('miningDash')
  const router = useRouter()
  const ticker = useMCCPrice()
  const [userDetails, setUserDetails] = useState<{ uid: string; unit_level?: number; source_project_id?: string } | null>(null)
  const [showMiningModal, setShowMiningModal] = useState(false)
  const [ratioInfo, setRatioInfo] = useState<MiningRatioInfo | null>(null)
  const [ratioLoading, setRatioLoading] = useState(false)
  const [ratioError, setRatioError] = useState<string>("")
  const [x402History, setX402History] = useState<X402MiningRecord[]>([])
  const [x402Loading, setX402Loading] = useState(false)
  const [x402Page, setX402Page] = useState(0)
  const [x402Total, setX402Total] = useState(0)
  const [historyExpanded, setHistoryExpanded] = useState(false)
  const [poolData, setPoolData] = useState<PoolStatus | null>(null)
  const [poolLoading, setPoolLoading] = useState(false)
  const [epochInfo, setEpochInfo] = useState<{ current_epoch: number; epoch_minted: number; epoch_yield: number; mining_vault_mcc: number } | null>(null)
  const [epochCountdownSec, setEpochCountdownSec] = useState(0)
  const X402_PAGE_SIZE = 3

  interface WalletMCCInfo {
    address: string
    is_primary: boolean
    mcc_balance: number
    loading: boolean
  }
  const [walletBalances, setWalletBalances] = useState<WalletMCCInfo[]>([])
  const [walletsLoading, setWalletsLoading] = useState(false)
  const [walletsExpanded, setWalletsExpanded] = useState(false)

  const {
    refreshPDABalance
  } = useWallet()

  const { connected, publicKey } = useSolanaWallet()
  const { user: authUser, userInfo, loading: authLoading } = useAuth()

  // \u76f4\u63a5\u4ece useAuth \u7f13\u5b58\u83b7\u53d6 userDetails\uff0c\u4e0d\u518d\u91cd\u590d\u8c03\u7528 API
  // \u7528 uid \u505a\u7a33\u5b9a\u6027\u5b88\u536b\uff1auid \u4e0d\u53d8\u65f6\u4e0d\u91cd\u5efa userDetails\uff0c\u907f\u514d\u540e\u53f0\u5237\u65b0\u89e6\u53d1\u8fde\u9501\u91cd\u8f7d
  const prevUidRef = React.useRef<string | null>(null)
  useEffect(() => {
    if (authLoading) return
    if (!authUser) {
      router.push("/login")
      return
    }
    if (userInfo && userInfo.uid !== prevUidRef.current) {
      prevUidRef.current = userInfo.uid
      setUserDetails({
        uid: userInfo.uid,
        unit_level: userInfo.unit_level ?? undefined,
        source_project_id: userInfo.source_project_id ?? undefined
      })
    }
  }, [authUser, userInfo, authLoading, router])

  // 4 \u4e2a\u6570\u636e\u52a0\u8f7d\u5168\u90e8\u5e76\u884c — \u4ec5\u9996\u6b21\u52a0\u8f7d\uff0c\u624b\u52a8\u5237\u65b0\u8d70 refreshAll()
  const dataLoadedRef = React.useRef(false)
  useEffect(() => {
    if (userDetails && !dataLoadedRef.current) {
      dataLoadedRef.current = true
      Promise.all([
        loadRatioInfo(),
        loadX402History(),
        loadWalletBalances(),
        loadPoolData()
      ])
    }
  }, [userDetails])

  const loadRatioInfo = async () => {
    setRatioLoading(true)
    setRatioError("")
    try {
      const response = await getMiningRatio()
      if (response.success && response.data) {
        setRatioInfo(response.data)
      } else {
        setRatioError(response.error || t('getMintInfoFailed'))
      }
    } catch (err) {
      console.error("Failed to load mining ratio:", err)
      setRatioError(err instanceof Error ? err.message : t('getMintInfoFailed'))
    } finally {
      setRatioLoading(false)
    }
  }

  const loadX402History = async (page = x402Page) => {
    setX402Loading(true)
    try {
      const response = await getX402MiningHistory(X402_PAGE_SIZE, page * X402_PAGE_SIZE)
      if (response.success && response.data) {
        setX402History(response.data.records || [])
        setX402Total(response.data.total || 0)
      }
    } catch (err) {
      console.error("Failed to load x402 history:", err)
    } finally {
      setX402Loading(false)
    }
  }

  const loadWalletBalances = async () => {
    setWalletsLoading(true)
    try {
      const listRes = await fetchApi('/auth/wallet/list')
      if (!listRes.success || !listRes.data?.wallets) {
        setWalletsLoading(false)
        return
      }
      const wallets: { wallet_address: string; is_primary: boolean }[] = listRes.data.wallets
      if (wallets.length === 0) {
        setWalletsLoading(false)
        return
      }

      const initial: WalletMCCInfo[] = wallets.map(w => ({
        address: w.wallet_address,
        is_primary: w.is_primary,
        mcc_balance: 0,
        loading: true
      }))
      setWalletBalances(initial)
      setWalletsLoading(false)

      const results = await Promise.allSettled(
        wallets.map(w => getOnChainMCCBalance(w.wallet_address))
      )

      setWalletBalances(prev => prev.map((w, i) => {
        const result = results[i]
        const bal = result.status === 'fulfilled' && result.value ? result.value.balance : 0
        return { ...w, mcc_balance: bal, loading: false }
      }))
    } catch (err) {
      console.error("Failed to load wallet balances:", err)
      setWalletsLoading(false)
    }
  }

  const loadPoolData = async () => {
    setPoolLoading(true)
    try {
      const data = await getPoolStatus(true)
      if (data) setPoolData(data)
    } catch (err) {
      console.error("Failed to load pool data:", err)
    } finally {
      setPoolLoading(false)
    }
  }

  const loadEpochInfo = async () => {
    try {
      const r = await fetch("/api/stats/custody-vaults", { cache: "no-store" })
      const j = await r.json()
      const ep = j?.data?.epoch
      if (ep && typeof ep.current_epoch === "number") setEpochInfo(ep)
    } catch {}
  }

  useEffect(() => {
    loadEpochInfo()
    const id = window.setInterval(loadEpochInfo, 60000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const tick = () => {
      const elapsedMs = Date.now() % (3600 * 1000)
      setEpochCountdownSec(Math.max(0, Math.floor((3600 * 1000 - elapsedMs) / 1000)))
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  const refreshAll = () => {
    loadRatioInfo()
    loadX402History()
    loadWalletBalances()
    loadPoolData()
    loadEpochInfo()
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const handler = () => {
      loadRatioInfo()
      loadX402History()
      loadWalletBalances()
      loadPoolData()
      loadEpochInfo()
      refreshPDABalance()
    }
    window.addEventListener("microcosm:mining-completed", handler)
    return () => window.removeEventListener("microcosm:mining-completed", handler)
  }, [refreshPDABalance])

  const isLoading = !userDetails || ratioLoading

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wider">{t('title')}</h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">{t('subtitle')}</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400 mr-3" />
          <span className="text-neutral-400 text-sm">{t('loadingMintData')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6">

      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wider">{t('title')}</h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">{t('subtitle')}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshAll}
          disabled={ratioLoading}
          className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
        >
          <RefreshCw className={cn("w-4 h-4 mr-2", ratioLoading && "animate-spin")} />
          {t('refresh')}
        </Button>
      </div>

      {!connected && (
        <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <Link2 className="w-5 h-5 text-neutral-400 shrink-0" />
                <div>
                  <div className="text-xs sm:text-sm font-medium text-white">{t('connectWalletFirst')}</div>
                  <div className="text-[10px] sm:text-xs text-neutral-500">
                    {t('connectWalletDesc')}
                  </div>
                </div>
              </div>
              <WalletMultiButton style={{ backgroundColor: '#0e7490' }} className="!h-9 !rounded-md !text-sm !text-white" />
            </div>
          </CardContent>
        </Card>
      )}

      {connected && (
        <div className="flex items-center gap-3 px-4 py-2 bg-neutral-800 rounded-lg">
          <Link2 className="w-4 h-4 text-neutral-400" />
          <span className="text-xs text-neutral-400">
            {t('connected')} <span className="text-white font-mono">{publicKey?.toBase58().slice(0, 8)}...{publicKey?.toBase58().slice(-6)}</span>
          </span>
          <WalletMultiButton style={{ backgroundColor: 'transparent' }} className="!h-7 !rounded !text-xs !text-neutral-400 !px-2 !py-0 !border !border-neutral-700 ml-auto" />
        </div>
      )}

      {ratioError && (
        <Card className="bg-neutral-900 border-neutral-700 dash-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span>{ratioError}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
        <CardContent className="p-3 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-6 mb-4 sm:mb-6">
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <Badge className="bg-white/20 text-white border-transparent text-[10px] sm:text-xs">{t('x402Protocol')}</Badge>
                <Badge className="bg-cyan-400/20 text-cyan-400 border-transparent text-[10px] sm:text-xs">Solana Mainnet</Badge>
              </div>

              {(ticker.basePrice || ratioInfo) && (
                <div>
                  <div className="text-[10px] sm:text-xs text-neutral-400 tracking-wider mb-1">{t('mintPrice')}</div>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-xl sm:text-3xl font-bold text-white font-mono">
                      1 MCC ≈ {formatNumber((ticker.basePrice ?? ratioInfo?.usdc_per_mcc ?? 0) * 4, 4)} USD
                    </span>
                    <Badge className="bg-cyan-400/20 text-cyan-400 border-transparent text-[10px] sm:text-sm">
                      {t('techBonus')}
                    </Badge>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 sm:gap-4 text-[10px] sm:text-xs text-neutral-500">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-500 shrink-0" />
                  <span>{t('stablecoinDirectDesc')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-500 shrink-0" />
                  <span>{t('instantMintDesc')}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setShowMiningModal(true)}
              size="lg"
              className="px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-medium bg-cyan-700 hover:bg-cyan-600 text-white whitespace-nowrap flex-shrink-0"
            >
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              {t('startMinting')}
            </Button>
          </div>

          {ratioInfo && (
            <>
              <div className="border-t border-neutral-700 pt-3 sm:pt-4 mb-3 sm:mb-4">
                <div className="text-[10px] sm:text-xs text-neutral-400 tracking-wider uppercase mb-2 sm:mb-3">{t('mintStats')}</div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-3 sm:mb-4">
                <div className="bg-neutral-800 rounded p-2 sm:p-3">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                    <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    <span className="text-[10px] sm:text-xs text-neutral-400 tracking-wider">{t('basePrice')}</span>
                  </div>
                  <div className="text-base sm:text-2xl font-bold text-white font-mono">${formatNumber(ticker.basePrice ?? ratioInfo.usdc_per_mcc, 4)}</div>
                  <div className="text-[10px] sm:text-xs text-neutral-500 mt-1 hidden xs:block">{t('basePriceNote')}</div>
                </div>

                <div className="bg-neutral-800 rounded p-2 sm:p-3">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                    <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    <span className="text-[10px] sm:text-xs text-neutral-400 tracking-wider">{t('marketPrice')}</span>
                  </div>
                  <div className="text-base sm:text-2xl font-bold text-white font-mono">${ticker.price ? formatNumber(ticker.price, 4) : '...'}</div>
                  <div className="text-[10px] sm:text-xs text-neutral-500 mt-1 hidden xs:block">{t('marketPriceNote')}</div>
                </div>

                <div className="bg-neutral-800 rounded p-2 sm:p-3">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                    <span className="text-[10px] sm:text-xs text-neutral-400 tracking-wider">{t('totalMinted')}</span>
                  </div>
                  <div className="text-base sm:text-2xl font-bold text-white font-mono truncate">{formatLargeNumber(ratioInfo.total_minted)}</div>
                  <div className="text-[10px] sm:text-xs text-neutral-500 mt-1 hidden xs:block">{t('totalMintedNote')}</div>
                </div>

                <div className="bg-neutral-800 rounded p-2 sm:p-3">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                    <span className="text-[10px] sm:text-xs text-neutral-400 tracking-wider">{t('currentPhase')}</span>
                  </div>
                  <div className="text-base sm:text-2xl font-bold text-white font-mono">Phase {ratioInfo.current_stage}</div>
                  <div className="text-[10px] sm:text-xs text-neutral-500 mt-1 hidden xs:block">{t('phaseNote')}</div>
                </div>
              </div>

              {epochInfo && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-3 sm:mb-4">
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded p-2 sm:p-3">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                      <span className="text-[10px] sm:text-xs text-amber-300/80 tracking-wider">{t('epochCurrent')}</span>
                    </div>
                    <div className="text-base sm:text-2xl font-bold text-amber-200 font-mono">#{epochInfo.current_epoch}</div>
                    <div className="text-[10px] sm:text-xs text-neutral-500 mt-1 hidden xs:block font-mono">{epochInfo.epoch_yield.toFixed(2)} MCC / epoch</div>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/30 rounded p-2 sm:p-3">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                      <span className="text-[10px] sm:text-xs text-amber-300/80 tracking-wider">{t('epochMinted')}</span>
                    </div>
                    <div className="text-base sm:text-2xl font-bold text-white font-mono">{epochInfo.epoch_minted.toFixed(2)}</div>
                    <div className="text-[10px] sm:text-xs text-neutral-500 mt-1 hidden xs:block">MCC</div>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/30 rounded p-2 sm:p-3">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                      <span className="text-[10px] sm:text-xs text-amber-300/80 tracking-wider">{t('epochRemaining')}</span>
                    </div>
                    <div className="text-base sm:text-2xl font-bold text-emerald-300 font-mono">{Math.max(0, epochInfo.epoch_yield - epochInfo.epoch_minted).toFixed(2)}</div>
                    <div className="text-[10px] sm:text-xs text-neutral-500 mt-1 hidden xs:block">MCC</div>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/30 rounded p-2 sm:p-3">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                      <span className="text-[10px] sm:text-xs text-amber-300/80 tracking-wider">{t('epochCountdown')}</span>
                    </div>
                    <div className="text-base sm:text-2xl font-bold text-cyan-300 font-mono tabular-nums">{Math.floor(epochCountdownSec/60).toString().padStart(2,"0")}:{(epochCountdownSec%60).toString().padStart(2,"0")}</div>
                    <div className="text-[10px] sm:text-xs text-neutral-500 mt-1 hidden xs:block">{t('epochNext')}</div>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <div className="text-xs text-neutral-500">{t('halvingRemaining', { amount: formatLargeNumber(100_000_000 - (ratioInfo.total_minted % 100_000_000), 0) })}</div>
                <div className="bg-neutral-800 rounded-full h-2 overflow-hidden">
                  <div className="h-2 rounded-full bg-cyan-400 transition-all" style={{ width: `${((ratioInfo.total_minted % 100_000_000) / 100_000_000) * 100}%` }} />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <PriceChart />

      <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center justify-between mb-3 gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Wallet className="w-4 h-4 text-white shrink-0" />
              <span className="text-xs sm:text-sm text-neutral-300 tracking-wider font-medium">{t('onChainBalance')}</span>
              {walletBalances.length > 0 && walletBalances.every(w => !w.loading) && (
                <Badge className="bg-white/20 text-white border-transparent">
                  <CheckCircle2 className="w-3 h-3 mr-1 inline" />
                  {walletBalances.length} {t('walletsCount')}
                </Badge>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadWalletBalances}
              disabled={walletsLoading}
              className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", walletsLoading && "animate-spin")} />
              {t('refresh')}
            </Button>
          </div>
          <p className="text-neutral-500 text-xs mb-4">
{t('onChainBalanceDesc')}
          </p>

          {walletsLoading && walletBalances.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-neutral-400 mr-2" />
              <span className="text-neutral-400 text-sm">{t('loadingOnChainBalance')}</span>
            </div>
          ) : walletBalances.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 text-sm">
              {t('noWalletBound')}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
                <div className="bg-neutral-800 rounded p-2 sm:p-3">
                  <div className="text-[10px] sm:text-xs text-neutral-400 tracking-wider mb-1 font-mono">{t('totalOnChainBalance')}</div>
                  <div className="text-base sm:text-2xl font-bold font-mono text-white">
                    {walletBalances.some(w => w.loading)
                      ? <Loader2 className="w-5 h-5 animate-spin" />
                      : formatLargeNumber(walletBalances.reduce((sum, w) => sum + w.mcc_balance, 0))
                    }
                  </div>
                  <div className="text-neutral-500 text-xs mt-1">MCC · {walletBalances.length} {t('walletsTotal')}</div>
                </div>
                <div className="bg-neutral-800 rounded p-2 sm:p-3">
                  <div className="text-[10px] sm:text-xs text-neutral-400 tracking-wider mb-1 font-mono">{t('primaryWalletBalance')}</div>
                  <div className="text-base sm:text-2xl font-bold font-mono text-white">
                    {(() => {
                      const primary = walletBalances.find(w => w.is_primary)
                      if (!primary) return '—'
                      if (primary.loading) return <Loader2 className="w-5 h-5 animate-spin" />
                      return formatLargeNumber(primary.mcc_balance)
                    })()}
                  </div>
                  <div className="text-neutral-500 text-xs mt-1 truncate">
                    {walletBalances.find(w => w.is_primary)?.address
                      ? `${walletBalances.find(w => w.is_primary)!.address.slice(0, 6)}...${walletBalances.find(w => w.is_primary)!.address.slice(-4)}`
                      : t('noPrimaryWallet')}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setWalletsExpanded(!walletsExpanded)}
                className="flex items-center gap-2 text-xs text-neutral-400 hover:text-cyan-400 transition-colors mb-2"
              >
                {walletsExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {walletsExpanded ? t('collapse') : t('expand')} ({walletBalances.length})
              </button>

              {walletsExpanded && (
                <div className="space-y-2">
                  {walletBalances.map((w) => (
                    <div
                      key={w.address}
                      className="flex items-center justify-between px-3 p-2 bg-neutral-800 rounded hover:bg-neutral-700 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Wallet className="w-3 h-3 text-neutral-500 flex-shrink-0" />
                        <a
                          href={`https://solscan.io/account/${w.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-300 hover:text-white truncate font-mono"
                        >
                          {w.address.slice(0, 8)}...{w.address.slice(-6)}
                        </a>
                        {w.is_primary && (
                          <span className="px-1.5 py-0.5 bg-cyan-400/20 text-cyan-400 rounded text-[10px] flex-shrink-0">{t('primaryLabel')}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                        {w.loading
                          ? <Loader2 className="w-3 h-3 animate-spin text-neutral-500" />
                          : <span className="text-white font-mono font-medium">{formatLargeNumber(w.mcc_balance)} MCC</span>
                        }
                        <a
                          href={`https://solscan.io/account/${w.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-600 hover:text-neutral-400"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
        <CardContent className="p-3 sm:p-6">
          <button
            onClick={() => setHistoryExpanded(!historyExpanded)}
            className="w-full flex items-center justify-between group gap-2"
          >
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <History className="w-4 h-4 text-white shrink-0" />
              <span className="text-xs sm:text-sm text-neutral-300 tracking-wider font-medium">{t('mintRecords')}</span>
              {x402Total > 0 && (
                <Badge className="bg-neutral-500/20 text-neutral-300 border-transparent">
                  {x402Total} {t('records')}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {x402Total > 0 && x402History.length > 0 && !historyExpanded && (
                <span className="text-[10px] sm:text-xs text-neutral-500 hidden xs:inline">
                  \u6700\u8fd1\u94f8\u9020: <FormattedDateTime dateTime={x402History[0].created_at} className="text-neutral-400" />
                </span>
              )}
              <div className="flex items-center gap-1 text-xs text-neutral-400 group-hover:text-cyan-400 transition-colors">
                {historyExpanded ? (
                  <>{t('collapse')} <ChevronUp className="w-3.5 h-3.5" /></>
                ) : (
                  <>{t('expand')} <ChevronDown className="w-3.5 h-3.5" /></>
                )}
              </div>
            </div>
          </button>

          {historyExpanded && (
            <div className="mt-4 pt-4 border-t border-neutral-700">
              <p className="text-neutral-500 text-xs mb-4">
                \u60a8\u7684\u6240\u6709 x402 \u975e\u6258\u7ba1\u94f8\u9020\u4ea4\u6613\u8bb0\u5f55 · \u7b2c {x402Page + 1}/{Math.max(1, Math.ceil(x402Total / X402_PAGE_SIZE))} \u9875
              </p>

              {x402Loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
                </div>
              ) : x402History.length === 0 ? (
                <div className="text-center py-8 text-neutral-500 text-sm">
                  {t('noMintRecords')}
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {x402History.map((record) => (
                      <div
                        key={record.id}
                        className="rounded-lg bg-neutral-800 p-2.5 sm:p-4 hover:bg-neutral-700 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-white font-mono">
                                #{record.id}
                              </span>
                              <Badge className={record.status === "completed" ? "bg-white/20 text-white border-transparent" : "bg-cyan-400/20 text-cyan-400 border-transparent"}>
                                {record.status === "completed" ? t('completed') : record.status}
                              </Badge>
                            </div>
                            <FormattedDateTime dateTime={record.created_at} className="text-xs text-neutral-500" />
                          </div>
                          <a
                            href={`https://solscan.io/tx/${record.tx_signature}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-cyan-400 hover:underline"
                          >
                            Explorer <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="bg-neutral-800 rounded p-3">
                            <div className="text-neutral-400 mb-1">{record.payment_type || 'USDC'} {t('payment')}</div>
                            <div className="text-white font-bold font-mono">
                              {((record.stablecoin_amount || record.usdc_amount || 0) / 1_000_000).toFixed(2)}
                            </div>
                          </div>

                          <div className="bg-neutral-800 rounded p-3">
                            <div className="text-neutral-400 mb-1">{t('earnedMcc')}</div>
                            <div className="text-white font-bold font-mono">
                              +{(Math.abs(record.distribution?.user ?? 0) / 1_000_000_000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {x402Total > X402_PAGE_SIZE && (
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-700">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { const p = x402Page - 1; setX402Page(p); loadX402History(p) }}
                        disabled={x402Page === 0 || x402Loading}
                        className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                      >
                        {t('prevPage')}
                      </Button>
                      <span className="text-xs text-neutral-500 font-mono">
                        {x402Page + 1} / {Math.ceil(x402Total / X402_PAGE_SIZE)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { const p = x402Page + 1; setX402Page(p); loadX402History(p) }}
                        disabled={(x402Page + 1) * X402_PAGE_SIZE >= x402Total || x402Loading}
                        className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                      >
                        {t('nextPage')}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-start gap-2 text-neutral-400 text-xs sm:text-sm">
            <Shield className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
            <span>{t('securityNote')}</span>
          </div>
        </CardContent>
      </Card>

      <MiningModal
        isOpen={showMiningModal}
        onClose={() => setShowMiningModal(false)}
        userDetails={userDetails}
        onSuccess={() => {
          loadRatioInfo()
          loadX402History()
          refreshPDABalance()
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("microcosm:mining-completed"))
          }
        }}
      />
    </div>
  )
}
