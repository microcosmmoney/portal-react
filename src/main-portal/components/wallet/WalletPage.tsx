// AI-generated · AI-managed · AI-maintained
'use client'

import React, { useState, useEffect } from 'react'
import { Link } from '@/i18n/navigation'
import {
  Wallet, Lock, TrendingUp, RefreshCw, Info, Gift,
  CreditCard, Eye, EyeOff, ExternalLink, Loader2, AlertTriangle
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useWallet } from '@/contexts/WalletContext'
import { useWalletTokenBalances, type TokenHolding, type WalletTokenData } from '@/hooks/useWalletTokenBalances'
import { cn } from '@/lib/utils'
import MCCHistory from './MCCHistory'
import { FormattedDateTime, FormattedDate, LockDaysHoursRemaining, useLockProgressValue } from '@/components/ui/time-remaining'
import { useTranslations } from 'next-intl'

interface WalletInfo {
  wallet_address: string
  is_primary?: boolean
}

const formatNumber = (num: number, decimals = 2) =>
  num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

const formatUSD = (num: number) =>
  '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function TokenIcon({ symbol, color, logoURI, className }: { symbol: string; color: string; logoURI?: string; className?: string }) {
  const [imgError, setImgError] = useState(false)
  if (logoURI && !imgError) {
    return (
      <img
        src={logoURI}
        alt={symbol}
        className={cn('w-10 h-10 rounded-full object-cover', className)}
        onError={() => setImgError(true)}
      />
    )
  }
  return (
    <div className={cn(
      'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm',
      color,
      className
    )}>
      {symbol.slice(0, 2)}
    </div>
  )
}

interface LockPeriod {
  lock_id: string
  amount: number
  reason: string
  lock_start: string
  lock_end: string
  status: string
}

function LockPeriodCard({ lock }: { lock: LockPeriod }) {
  const t = useTranslations('walletDash')
  const { progress, mounted } = useLockProgressValue(lock.lock_end, 14)

  return (
    <div className="p-4 bg-neutral-800 rounded border border-neutral-700">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-xs text-neutral-400 tracking-wider mb-1">
            reason: {lock.reason}
          </div>
          <div className="text-2xl font-bold text-white font-mono">{formatNumber(lock.amount)} MCC</div>
        </div>
        <Badge className="bg-cyan-400/20 text-cyan-400 border border-cyan-400/30">{t('locked')}</Badge>
      </div>

      <div className="space-y-1 text-sm">
        <div className="flex justify-between text-neutral-400">
          <span>lock_start</span>
          <FormattedDateTime dateTime={lock.lock_start} className="text-white" />
        </div>
        <div className="flex justify-between text-neutral-400">
          <span>lock_end</span>
          <FormattedDateTime dateTime={lock.lock_end} className="text-white" />
        </div>
        <div className="flex justify-between font-bold mt-2">
          <span className="text-neutral-400">remaining</span>
          <LockDaysHoursRemaining endTime={lock.lock_end} className="text-cyan-400" />
        </div>
      </div>

      <div className="mt-3">
        <div className="bg-neutral-800 rounded-full h-2 overflow-hidden">
          <div className="bg-cyan-400 h-2 rounded-full transition-all" style={{ width: `${mounted ? progress : 0}%` }} />
        </div>
      </div>
    </div>
  )
}

function AssetList({ holdings, hideBalance, showWalletColumn, isLoading }: { holdings: TokenHolding[]; hideBalance: boolean; showWalletColumn?: boolean; isLoading?: boolean }) {
  const t = useTranslations('walletDash')

  // 1. \u52a0\u8f7d\u4e2d → \u8fdb\u5ea6\u6761
  if (isLoading) {
    return (
      <div className="py-8 px-4">
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
          <span className="text-neutral-500 text-sm">{t('syncingOnChainData')}</span>
        </div>
        <div className="mt-3 max-w-xs mx-auto">
          <div className="bg-neutral-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-cyan-400/60 h-1.5 rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    )
  }

  // 2. \u52a0\u8f7d\u5b8c\u6210\u4f46\u65e0\u8d44\u4ea7 → \u53cb\u597d\u63d0\u793a
  if (holdings.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500">
        <p className="text-sm">{t('noValuedAssets')}</p>
      </div>
    )
  }

  return (
    <div>
      <div className={cn(
        "gap-4 py-2 px-4 border-b border-neutral-700 text-xs font-medium text-neutral-400 tracking-wider grid",
        showWalletColumn ? "grid-cols-4" : "grid-cols-3"
      )}>
        <div>{t('token')}</div>
        {showWalletColumn && <div>{t('wallet') || 'Wallet'}</div>}
        <div className="text-right">{t('amount')}</div>
        <div className="text-right">{t('valuation')}</div>
      </div>
      <div className="divide-y divide-neutral-800">
        {holdings.map((h, idx) => (
          <div key={`${h.token.mint}-${h.wallet || idx}`} className={cn(
            "gap-4 py-3 px-4 items-center hover:bg-neutral-700 transition-colors rounded grid",
            showWalletColumn ? "grid-cols-4" : "grid-cols-3"
          )}>
            <div className="flex items-center gap-3">
              <TokenIcon symbol={h.token.symbol} color={h.token.color} logoURI={h.token.logoURI} />
              <div>
                <div className="text-white font-medium text-sm">{h.token.symbol}</div>
                <div className="text-xs text-neutral-500">{h.token.name}</div>
              </div>
            </div>
            {showWalletColumn && (
              <div>
                <code className="text-xs text-neutral-400 font-mono">{h.walletShort}</code>
                {h.isPrimary && <span className="ml-1 text-[10px] text-cyan-400">Primary</span>}
              </div>
            )}
            <div className="text-right">
              <div className="text-white text-sm font-mono">
                {hideBalance ? '****' : formatNumber(h.balance, h.balance < 1 ? 6 : 4)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-neutral-300 text-sm font-mono">
                {hideBalance ? '****' : formatUSD(h.usdValue)}
              </div>
              <div className="text-xs text-neutral-500">
                {formatUSD(h.price)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function WalletPage() {
  const t = useTranslations('walletDash')
  const { user, userInfo, loading: authLoading } = useAuth()
  const {
    totalBalance, lockPeriods,
    mcdAmount, mcdTotalReceived, mcdDailyRewards,
    loading, isRefreshing, error, refreshBalance, refreshMinting, refreshMCD
  } = useWallet()

  const [activeTab, setActiveTab] = useState<string>('all')
  const [hideBalance, setHideBalance] = useState(false)

  // \u76f4\u63a5\u4ece useAuth \u7f13\u5b58\u7684 userInfo \u83b7\u53d6\u94b1\u5305\u5217\u8868\uff0c\u4e0d\u518d\u91cd\u590d\u8c03\u7528 API
  const wallets: WalletInfo[] = React.useMemo(() => {
    if (!userInfo) return []
    if (userInfo.wallets && userInfo.wallets.length > 0) {
      return userInfo.wallets
    }
    if (userInfo.wallet_address) {
      return [{ wallet_address: userInfo.wallet_address, is_primary: true }]
    }
    return []
  }, [userInfo])

  const tokenBalances = useWalletTokenBalances(wallets)

  const mccTotalBalance = tokenBalances.aggregated.find(h => h.token.symbol === 'MCC')?.balance || totalBalance

  const handleRefresh = () => {
    refreshBalance()
    refreshMinting()
    refreshMCD()
    tokenBalances.refresh()
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const handler = () => {
      refreshBalance()
      refreshMinting()
      refreshMCD()
      tokenBalances.refresh()
    }
    window.addEventListener("microcosm:mining-completed", handler)
    return () => window.removeEventListener("microcosm:mining-completed", handler)
  }, [refreshBalance, refreshMinting, refreshMCD, tokenBalances])

  // \u591a\u94b1\u5305\u65f6 "all" tab \u7528 flat \u5217\u8868\uff08\u5e26\u94b1\u5305\u6807\u8bc6\uff09\uff0c\u5355\u94b1\u5305 tab \u7528 holdings
  const isAllTab = activeTab === 'all'
  const showWalletCol = isAllTab && wallets.length > 1

  const rawHoldings: TokenHolding[] = isAllTab
    ? (wallets.length > 1 ? tokenBalances.flat : tokenBalances.aggregated)
    : tokenBalances.wallets.find(w => w.wallet_address === activeTab)?.holdings || []

  // \u53ea\u663e\u793a ≥$1 \u7684\u8d44\u4ea7\uff0c\u4f4e\u4e8e $1 \u4e0d\u663e\u793a
  const activeHoldings = rawHoldings.filter(h => h.usdValue >= 1)

  const activeUsdValue = isAllTab
    ? tokenBalances.totalUsdValue
    : tokenBalances.wallets.find(w => w.wallet_address === activeTab)?.totalUsdValue || 0

  // \u4e0d\u518d\u5168\u9875\u963b\u585e\uff0c\u8ba9\u9875\u9762\u6846\u67b6\u5148\u6e32\u67d3\uff0c\u6570\u636e\u533a\u57df\u5185\u8054\u663e\u793a\u52a0\u8f7d\u8fdb\u5ea6\u6761

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wider">{t('title')}</h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">{t('subtitle')}</p>
        </div>
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">{t('error')}</span>
            </div>
            <p className="text-neutral-400 text-sm">{error}</p>
            <p className="text-neutral-500 text-xs mt-1">{t('checkNetwork')}</p>
          </CardContent>
        </Card>
        <Button variant="outline" size="sm" className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent" onClick={handleRefresh}>
          {t('retry')}
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wider">{t('title')}</h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">{t('subtitle')}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
          onClick={handleRefresh}
          disabled={isRefreshing || tokenBalances.loading}
        >
          <RefreshCw className={cn("w-4 h-4 mr-2", (isRefreshing || tokenBalances.loading) && "animate-spin")} />
          {t('refresh')}
        </Button>
      </div>

      <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-neutral-400 text-sm">
              <Wallet className="w-4 h-4 text-cyan-400" />
              <span>{activeTab === 'all' ? t('totalAssetValue') : t('walletAssetValue')}</span>
              <button onClick={() => setHideBalance(!hideBalance)} className="hover:text-white transition-colors">
                {hideBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold text-white font-mono">
              {hideBalance ? '****' : (activeUsdValue > 0 ? formatUSD(activeUsdValue) : '--')}
            </span>
          </div>
          <div className="text-neutral-500 text-xs">
            {hideBalance ? '****' : t('priceSource')}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-700 dash-card">
        <CardContent className="p-3 sm:p-6">
          {wallets.length > 1 && (
            <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveTab('all')}
                className={cn(
                  'px-3 py-1.5 text-xs rounded whitespace-nowrap transition-colors',
                  activeTab === 'all'
                    ? 'bg-cyan-700 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                )}
              >
                {t('overview')} ({wallets.length} {t('wallets')})
              </button>
              {wallets.map((w) => (
                <button
                  key={w.wallet_address}
                  onClick={() => setActiveTab(w.wallet_address)}
                  className={cn(
                    'px-3 py-1.5 text-xs rounded whitespace-nowrap transition-colors flex items-center gap-1',
                    activeTab === w.wallet_address
                      ? 'bg-cyan-700 text-white'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                  )}
                >
                  <code className="font-mono">{w.wallet_address.slice(0, 4)}...{w.wallet_address.slice(-4)}</code>
                  {w.is_primary && <span className="text-cyan-400 text-[10px]">{t('primary')}</span>}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 text-neutral-400 text-sm mb-4">
            <CreditCard className="w-4 h-4 text-cyan-400" />
            <span className="tracking-wider">{t('onChainAssets')}</span>
            {tokenBalances.loading && <RefreshCw className="w-3 h-3 animate-spin" />}
          </div>

          {tokenBalances.loading ? (
            <div className="py-10">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                <p className="text-sm text-neutral-400">{t('syncingOnChainData') || '\u94fe\u4e0a\u6570\u636e\u540c\u6b65\u4e2d...'}</p>
                <div className="w-48 h-1 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400/60 rounded-full animate-pulse" style={{ width: '60%' }} />
                </div>
              </div>
            </div>
          ) : (
            <AssetList holdings={activeHoldings} hideBalance={hideBalance} showWalletColumn={showWalletCol} isLoading={tokenBalances.loading} />
          )}

          <div className="mt-4 pt-3 border-t border-neutral-700 space-y-2">
            {activeTab === 'all' ? (
              <div className="flex items-start gap-2 text-xs text-neutral-500">
                <Info className="w-3 h-3 mt-0.5 shrink-0" />
                <span>{t('allWalletsNote', { count: wallets.length })}</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <Info className="w-3 h-3 shrink-0" />
                    <span>{t('currentWallet')}:</span>
                    <code className="text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded font-mono">{activeTab}</code>
                    {wallets.find(w => w.wallet_address === activeTab)?.is_primary && (
                      <span className="text-cyan-400 bg-cyan-400/20 px-1.5 py-0.5 rounded">{t('primaryWallet')}</span>
                    )}
                  </div>
                  <a
                    href={`https://solscan.io/account/${activeTab}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1"
                  >
                    {t('viewOnSolscan')} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex items-start gap-2 text-xs text-neutral-500">
                  <Info className="w-3 h-3 mt-0.5 shrink-0" />
                  <span>{t('singleWalletNote')}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-cyan-400/20 rounded-xl border border-cyan-400/30">
                <Wallet className="h-8 w-8 text-cyan-400" />
              </div>
              <div>
                <div className="text-xs text-neutral-400 tracking-wider mb-1">{t('mccBalance')}</div>
                <div className="text-4xl font-bold text-white font-mono">{hideBalance ? '****' : formatNumber(mccTotalBalance)}</div>
                <div className="text-sm text-neutral-500 mt-1">{t('totalMccAllWallets')}</div>
              </div>
            </div>
            <Link
              href="/mcc/mining"
              className="flex items-center gap-2 px-4 py-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded text-sm transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              {t('mintingRecords')}
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center gap-2 text-neutral-400 text-sm mb-4">
            <Gift className="w-4 h-4 text-cyan-400" />
            <span className="tracking-wider">{t('mcdPoints')}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-800 rounded border border-neutral-700">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-cyan-400" />
                <span className="text-xs text-neutral-400 tracking-wider">{t('currentBalance')}</span>
              </div>
              <div className="text-2xl font-bold text-cyan-400 font-mono">{hideBalance ? '****' : formatNumber(mcdAmount, 6)}</div>
              <div className="text-xs text-neutral-500 mt-1">MCD</div>
            </div>
            <div className="p-4 bg-neutral-800 rounded border border-neutral-700">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-neutral-400" />
                <span className="text-xs text-neutral-400 tracking-wider">{t('totalReceived')}</span>
              </div>
              <div className="text-2xl font-bold text-white font-mono">{hideBalance ? '****' : formatNumber(mcdTotalReceived, 6)}</div>
              <div className="text-xs text-neutral-500 mt-1">MCD</div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-700 space-y-2">
            <div className="flex items-start gap-2 text-xs text-neutral-500">
              <Gift className="w-3 h-3 mt-0.5 shrink-0" />
              <span>
                \u6700\u8fd1\u53d1\u653e: {mcdDailyRewards.length > 0
                  ? <>{hideBalance ? '****' : formatNumber(mcdDailyRewards[0].mcd_received, 6)} MCD (<FormattedDate dateTime={mcdDailyRewards[0].reward_date} />)</>
                  : t('noRecords')}
                {' · '}{t('mcdDistributionNote')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {lockPeriods.filter(p => p.status === 'locked').length > 0 && (
        <Card className="bg-neutral-900 border-neutral-700 dash-card">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center gap-2 text-neutral-400 text-sm mb-4">
              <Lock className="w-4 h-4" />
              <span className="tracking-wider">{t('lockPeriod14Days')}</span>
            </div>
            <div className="space-y-3">
              {lockPeriods.filter(p => p.status === 'locked').map((lock) => (
                <LockPeriodCard key={lock.lock_id} lock={lock} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <MCCHistory userId={user?.uid} limit={20} />
    </div>
  )
}
