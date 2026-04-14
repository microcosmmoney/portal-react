'use client'

import { useState, useEffect } from 'react'
import { useMCC, useMCD, useWallets, useMCCLocks, useMarketData, useMultiWalletBalance } from '@microcosmmoney/auth-react'
import { TOKEN_BY_SYMBOL } from '../../config/mainstream-tokens'
import { useTranslations } from '../../i18n-context'

const fmt = (n: number, d = 2) =>
  n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })

const fmtUSD = (n: number) =>
  '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function IconWallet({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a1 1 0 0 0 0 4h4v-4Z" />
    </svg>
  )
}

function IconLock({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function IconTrendingUp({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
    </svg>
  )
}

function IconRefresh({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M21 21v-5h-5" />
    </svg>
  )
}

function IconInfo({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
    </svg>
  )
}

function IconGift({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13" /><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" /><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </svg>
  )
}

function IconCreditCard({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  )
}

function IconEye({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function IconEyeOff({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" /><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" /><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" /><path d="m2 2 20 20" />
    </svg>
  )
}

function IconExternalLink({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  )
}

function IconAlertTriangle({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4" /><path d="M12 17h.01" />
    </svg>
  )
}

function Spinner({ size = 'w-5 h-5' }: { size?: string }) {
  return <span className={`inline-block ${size} border-2 border-cyan-400 border-t-transparent rounded-full animate-spin`} />
}

function LockPeriodCard({ lock, hideBalance }: { lock: any; hideBalance: boolean }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const start = new Date(lock.lock_start).getTime()
    const end = new Date(lock.lock_end).getTime()
    const now = Date.now()
    const p = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100))
    
    const timer = setTimeout(() => setProgress(p), 50)
    return () => clearTimeout(timer)
  }, [lock.lock_start, lock.lock_end])

  const start = new Date(lock.lock_start)
  const end = new Date(lock.lock_end)
  const now = Date.now()
  const msLeft = Math.max(0, end.getTime() - now)
  const daysLeft = Math.floor(msLeft / 86400000)
  const hoursLeft = Math.floor((msLeft % 86400000) / 3600000)

  const fmtDT = (d: Date) =>
    d.toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })

  return (
    <div className="p-2 2xs:p-3 sm:p-4 bg-neutral-800 rounded border border-neutral-700">
      <div className="flex justify-between items-start mb-2 2xs:mb-3 gap-2">
        <div className="min-w-0 flex-1">
          <div className="text-[10px] 2xs:text-xs text-neutral-400 tracking-wider mb-1 truncate">
            reason: {lock.reason}
          </div>
          <div className="text-lg 2xs:text-xl xs:text-2xl font-bold text-white font-mono">
            {hideBalance ? '****' : fmt(lock.amount)} MCC
          </div>
        </div>
        <span className="text-[8px] 2xs:text-[10px] bg-cyan-400/20 text-cyan-400 border border-cyan-400/30 px-1.5 py-0.5 rounded font-mono whitespace-nowrap">
          LOCKED
        </span>
      </div>

      <div className="space-y-1 text-[10px] 2xs:text-xs sm:text-sm">
        <div className="flex justify-between text-neutral-400">
          <span>lock_start</span>
          <span className="text-white">{fmtDT(start)}</span>
        </div>
        <div className="flex justify-between text-neutral-400">
          <span>lock_end</span>
          <span className="text-white">{fmtDT(end)}</span>
        </div>
        <div className="flex justify-between font-bold mt-2">
          <span className="text-neutral-400">remaining</span>
          <span className="text-cyan-400">{daysLeft}d {hoursLeft}h</span>
        </div>
      </div>

      <div className="mt-3">
        <div className="bg-neutral-700 rounded-full h-2 overflow-hidden">
          <div
            className="bg-cyan-400 h-2 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function TokenIcon({ symbol, color, logoURI }: { symbol: string; color: string; logoURI?: string }) {
  const [err, setErr] = useState(false)
  if (logoURI && !err) {
    return (
      <img
        src={logoURI}
        alt={symbol}
        className="w-6 h-6 2xs:w-7 2xs:h-7 sm:w-10 sm:h-10 rounded-full object-cover bg-neutral-800 shrink-0"
        onError={() => setErr(true)}
      />
    )
  }
  return (
    <div className={`w-6 h-6 2xs:w-7 2xs:h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-[10px] 2xs:text-xs sm:text-sm shrink-0 ${color}`}>
      {symbol.slice(0, 2)}
    </div>
  )
}

interface AssetHolding {
  symbol: string
  name: string
  color: string
  logoURI?: string
  balance: number
  usdValue: number
  price: number
  wallet?: string
  walletShort?: string
  isPrimary?: boolean
}

function AssetList({
  holdings,
  hideBalance,
  showWalletColumn,
  isLoading,
}: {
  holdings: AssetHolding[]
  hideBalance: boolean
  showWalletColumn?: boolean
  isLoading?: boolean
}) {
  const t = useTranslations('walletDash')
  if (isLoading) {
    return (
      <div className="py-8 px-4">
        <div className="flex items-center justify-center gap-3">
          <Spinner size="w-4 h-4" />
          <span className="text-neutral-500 text-sm">{t('syncingOnChainData', 'Syncing on-chain data...')}</span>
        </div>
        <div className="mt-3 max-w-xs mx-auto">
          <div className="bg-neutral-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-cyan-400/60 h-1.5 rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    )
  }

  if (holdings.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500">
        <p className="text-sm">{t('noValuedAssets', 'No valued assets found')}</p>
      </div>
    )
  }

  const gridCols = showWalletColumn ? 'grid-cols-[1fr_auto_auto] xs:grid-cols-4' : 'grid-cols-[1fr_auto_auto] xs:grid-cols-3'

  return (
    <div>
      <div className={`gap-2 2xs:gap-3 sm:gap-4 py-1.5 2xs:py-2 px-2 2xs:px-3 sm:px-4 border-b border-neutral-700 text-[9px] 2xs:text-[10px] sm:text-xs font-medium text-neutral-400 tracking-wider grid ${gridCols}`}>
        <div>{t('token', 'Token')}</div>
        {showWalletColumn && <div className="hidden xs:block">{t('wallet', 'Wallet')}</div>}
        <div className="text-right">{t('amount', 'Amount')}</div>
        <div className="text-right">{t('valuation', 'Valuation')}</div>
      </div>
      <div className="divide-y divide-neutral-800">
        {holdings.map((h, idx) => (
          <div
            key={`${h.symbol}-${h.wallet || idx}`}
            className={`gap-2 2xs:gap-3 sm:gap-4 py-2 2xs:py-2.5 sm:py-3 px-2 2xs:px-3 sm:px-4 items-center hover:bg-neutral-700 transition-colors rounded grid ${gridCols}`}
          >
            <div className="flex items-center gap-1.5 2xs:gap-2 sm:gap-3 min-w-0">
              <TokenIcon symbol={h.symbol} color={h.color} logoURI={h.logoURI} />
              <div className="min-w-0">
                <div className="text-white font-medium text-xs 2xs:text-sm truncate">{h.symbol}</div>
                <div className="text-[9px] 2xs:text-[10px] sm:text-xs text-neutral-500 truncate">{h.name}</div>
              </div>
            </div>
            {showWalletColumn && (
              <div className="hidden xs:block">
                <code className="text-[10px] sm:text-xs text-neutral-400 font-mono">{h.walletShort}</code>
                {h.isPrimary && <span className="ml-1 text-[9px] sm:text-[10px] text-cyan-400">{t('primary', 'Primary')}</span>}
              </div>
            )}
            <div className="text-right">
              <div className="text-white text-xs 2xs:text-sm sm:text-base font-mono whitespace-nowrap">
                {hideBalance ? '****' : fmt(h.balance, h.balance < 1 ? 6 : 4)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-neutral-300 text-xs 2xs:text-sm sm:text-base font-mono whitespace-nowrap">
                {hideBalance ? '****' : fmtUSD(h.usdValue)}
              </div>
              <div className="text-[9px] 2xs:text-[10px] sm:text-xs text-neutral-500">{fmtUSD(h.price)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export interface MicrocosmWalletPageProps {
  basePath?: string
  onNavigate?: (path: string) => void
}

export function MicrocosmWalletPage({ basePath = '', onNavigate }: MicrocosmWalletPageProps) {
  const t = useTranslations('walletDash')
  const { balance: mccData, price: mccPrice, loading: mccLoading, refresh: refreshMCC } = useMCC(60_000)
  const { balance: mcdData, loading: mcdLoading, refresh: refreshMCD } = useMCD(60_000)
  const { data: wallets, loading: walletsLoading } = useWallets()
  const { data: locks } = useMCCLocks()
  const { data: marketData } = useMarketData()
  const { data: multiBalance, loading: multiLoading, refresh: refreshMulti } = useMultiWalletBalance()

  const [hideBalance, setHideBalance] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const walletList = Array.isArray(wallets) ? wallets : []
  const mccBalance = mccData?.balance ?? 0
  const price = marketData?.price_usd ?? mccPrice?.price ?? 0
  const totalUsd = mccBalance * price

  const mcdAmount = parseFloat(mcdData?.available_balance ?? '0')
  const mcdTotalReceived = parseFloat(mcdData?.total_balance ?? '0')
  const mcdSpent = parseFloat(mcdData?.frozen_balance ?? '0')

  const activeLocks = Array.isArray(locks) ? locks.filter((l: any) => l.status === 'locked') : []
  const lockedAmount = activeLocks.reduce((s: number, l: any) => s + (l.amount || 0), 0)

  const mask = (v: string) => (hideBalance ? '****' : v)
  const resolvePath = (p: string) => (basePath ? `${basePath.replace(/\/$/, '')}${p}` : p)

  const TOKEN_PRICES: Record<string, number> = {
    SOL: 0,
    MCC: price,
    MCD: 0,
    USDC: 1,
    USDT: 1,
  }

  const TRACKED_SYMBOLS: [string, (p: any) => number][] = [
    ['SOL', (p) => Number(p?.sol_balance ?? p?.sol?.balance ?? 0)],
    ['MCC', (p) => Number(p?.mcc_balance ?? 0)],
    ['MCD', (p) => Number(p?.mcd_balance ?? 0)],
    ['USDC', (p) => Number(p?.usdc_balance ?? 0)],
    ['USDT', (p) => Number(p?.usdt_balance ?? 0)],
  ]

  const lookupMeta = (sym: string) => {
    const cfg = TOKEN_BY_SYMBOL.get(sym)
    return {
      name: cfg?.name ?? sym,
      color: cfg?.color ?? 'bg-neutral-600',
      logoURI: cfg?.logoURI,
    }
  }

  function buildHoldings(walletAddr?: string): AssetHolding[] {
    if (!multiBalance) return []

    const items: AssetHolding[] = []
    const sources = walletAddr
      ? multiBalance.filter((w) => w.wallet_address === walletAddr)
      : multiBalance

    for (const wb of sources) {
      const p = wb.portfolio || {}
      for (const [sym, get] of TRACKED_SYMBOLS) {
        const bal = get(p)
        if (bal <= 0) continue
        const meta = lookupMeta(sym)
        const tp = TOKEN_PRICES[sym] ?? 0
        items.push({
          symbol: sym,
          name: meta.name,
          color: meta.color,
          logoURI: meta.logoURI,
          balance: bal,
          usdValue: bal * tp,
          price: tp,
          wallet: wb.wallet_address,
          walletShort: `${wb.wallet_address.slice(0, 4)}...${wb.wallet_address.slice(-4)}`,
          isPrimary: wb.is_primary,
        })
      }
    }

    return items
  }

  function buildAggregatedHoldings(): AssetHolding[] {
    if (!multiBalance) return []

    const agg: Record<string, number> = {}
    for (const wb of multiBalance) {
      const p = wb.portfolio || {}
      for (const [sym, get] of TRACKED_SYMBOLS) {
        agg[sym] = (agg[sym] || 0) + get(p)
      }
    }

    const items: AssetHolding[] = []
    for (const [sym, bal] of Object.entries(agg)) {
      if (bal <= 0) continue
      const meta = lookupMeta(sym)
      const tp = TOKEN_PRICES[sym] ?? 0
      items.push({
        symbol: sym,
        name: meta.name,
        color: meta.color,
        logoURI: meta.logoURI,
        balance: bal,
        usdValue: bal * tp,
        price: tp,
      })
    }

    return items
  }

  const isAllTab = activeTab === 'all'
  const showWalletCol = isAllTab && walletList.length > 1

  const rawHoldings: AssetHolding[] = isAllTab
    ? (walletList.length > 1 ? buildHoldings() : buildAggregatedHoldings())
    : buildHoldings(activeTab)

  const activeHoldings = rawHoldings.filter((h) => h.usdValue >= 1)

  const activeUsdValue = isAllTab
    ? rawHoldings.reduce((s, h) => s + h.usdValue, 0)
    : rawHoldings.filter((h) => h.wallet === activeTab || !h.wallet).reduce((s, h) => s + h.usdValue, 0)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await Promise.all([refreshMCC(), refreshMCD(), refreshMulti()])
    } finally {
      setIsRefreshing(false)
    }
  }

  const anyError = false 

  return (
    <div className="max-w-7xl mx-auto px-2 py-3 space-y-2 2xs:px-3 2xs:py-4 2xs:space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6">
      {}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-base 2xs:text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-wider">{t('title', 'Wallet')}</h1>
          <p className="text-[10px] 2xs:text-xs sm:text-sm text-neutral-400 mt-1 truncate">{t('subtitle', 'On-chain assets & balances')}</p>
        </div>
        <button
          className="flex items-center gap-1.5 2xs:gap-2 px-2 2xs:px-3 py-1.5 2xs:py-2 sm:px-4 sm:py-2.5 text-xs 2xs:text-sm border border-neutral-700 rounded text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent transition-colors disabled:opacity-50 whitespace-nowrap shrink-0"
          onClick={handleRefresh}
          disabled={isRefreshing || multiLoading}
        >
          <IconRefresh className={isRefreshing || multiLoading ? 'animate-spin' : ''} />
          {t('refresh', 'Refresh')}
        </button>
      </div>

      {}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg hover:border-cyan-400/50 transition-colors">
        <div className="p-2 2xs:p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between mb-1.5 2xs:mb-2 sm:mb-3 md:mb-4">
            <div className="flex items-center gap-1.5 2xs:gap-2 text-neutral-400 text-xs 2xs:text-sm min-w-0">
              <IconWallet className="text-cyan-400 shrink-0" />
              <span className="truncate">{isAllTab ? t('totalAssetValue', 'Total Asset Value') : t('walletAssetValue', 'Wallet Asset Value')}</span>
              <button
                onClick={() => setHideBalance(!hideBalance)}
                className="hover:text-white transition-colors shrink-0"
              >
                {hideBalance ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-lg 2xs:text-xl xs:text-2xl sm:text-3xl font-bold text-white font-mono">
              {hideBalance ? '****' : (activeUsdValue > 0 ? fmtUSD(activeUsdValue) : '--')}
            </span>
          </div>
          <div className="text-neutral-500 text-[9px] 2xs:text-[10px] sm:text-xs">
            {hideBalance ? '****' : t('aggregatedDesc', 'Aggregated from on-chain token balances')}
          </div>
        </div>
      </div>

      {}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg transition-colors">
        <div className="p-2 2xs:p-3 sm:p-4 md:p-6">
          {}
          {walletList.length > 1 && (
            <div className="flex items-center gap-1 mb-2 2xs:mb-3 sm:mb-4 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-2 2xs:px-3 py-1 2xs:py-1.5 text-[10px] 2xs:text-xs rounded whitespace-nowrap transition-colors ${
                  activeTab === 'all'
                    ? 'bg-cyan-700 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                }`}
              >
                {t('overview', 'Overview')} ({walletList.length} {t('wallets', 'wallets')})
              </button>
              {walletList.map((w: any) => (
                <button
                  key={w.wallet_address}
                  onClick={() => setActiveTab(w.wallet_address)}
                  className={`px-2 2xs:px-3 py-1 2xs:py-1.5 text-[10px] 2xs:text-xs rounded whitespace-nowrap transition-colors flex items-center gap-1 ${
                    activeTab === w.wallet_address
                      ? 'bg-cyan-700 text-white'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                  }`}
                >
                  <code className="font-mono">
                    {w.wallet_address.slice(0, 4)}...{w.wallet_address.slice(-4)}
                  </code>
                  {w.is_primary && <span className="text-cyan-400 text-[9px] 2xs:text-[10px]">{t('primary', 'Primary')}</span>}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1.5 2xs:gap-2 text-neutral-400 text-xs 2xs:text-sm mb-1.5 2xs:mb-2 sm:mb-3 md:mb-4">
            <IconCreditCard className="text-cyan-400 shrink-0" />
            <span className="tracking-wider">{t('onChainAssets', 'On-Chain Assets')}</span>
            {multiLoading && <Spinner size="w-3 h-3" />}
          </div>

          {multiLoading ? (
            <div className="py-10">
              <div className="flex flex-col items-center gap-3">
                <Spinner size="w-6 h-6" />
                <p className="text-sm text-neutral-400">{t('syncingOnChainData', 'Syncing on-chain data...')}</p>
                <div className="w-48 h-1 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400/60 rounded-full animate-pulse" style={{ width: '60%' }} />
                </div>
              </div>
            </div>
          ) : (
            <AssetList
              holdings={activeHoldings}
              hideBalance={hideBalance}
              showWalletColumn={showWalletCol}
              isLoading={multiLoading}
            />
          )}

          {}
          <div className="mt-3 2xs:mt-4 pt-2 2xs:pt-3 border-t border-neutral-700 space-y-1.5 2xs:space-y-2">
            {isAllTab ? (
              <div className="flex items-start gap-1.5 2xs:gap-2 text-[10px] 2xs:text-xs text-neutral-500">
                <IconInfo className="mt-0.5 shrink-0" />
                <span>
                  {t('allWalletsNote', 'Aggregated on-chain balances across {count} wallets. Low-value assets (<$1) are hidden.', { count: walletList.length })}
                </span>
              </div>
            ) : (
              <div className="space-y-1.5 2xs:space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 2xs:gap-2 text-[10px] 2xs:text-xs text-neutral-500 min-w-0">
                    <IconInfo className="shrink-0" />
                    <span className="hidden 2xs:inline">{t('currentWallet', 'Current wallet')}:</span>
                    <code className="text-neutral-400 bg-neutral-800 px-1.5 py-0.5 rounded font-mono truncate min-w-0 max-w-[140px] 2xs:max-w-[180px] sm:max-w-none">
                      {activeTab}
                    </code>
                    {walletList.find((w: any) => w.wallet_address === activeTab)?.is_primary && (
                      <span className="text-cyan-400 bg-cyan-400/20 px-1.5 py-0.5 rounded text-[9px] 2xs:text-[10px] shrink-0">
                        {t('primary', 'Primary')}
                      </span>
                    )}
                  </div>
                  <a
                    href={`https://solscan.io/account/${activeTab}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 text-[10px] 2xs:text-xs flex items-center gap-1 whitespace-nowrap"
                  >
                    {t('viewOnSolscan', 'View on Solscan')} <IconExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex items-start gap-1.5 2xs:gap-2 text-[10px] 2xs:text-xs text-neutral-500">
                  <IconInfo className="mt-0.5 shrink-0" />
                  <span>{t('singleWalletNote', 'Showing on-chain balances for this wallet only. Low-value assets (<$1) are hidden.')}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg hover:border-cyan-400/50 transition-colors">
        <div className="p-2 2xs:p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 2xs:gap-2 sm:gap-3 min-w-0">
              <div className="p-2 2xs:p-3 sm:p-4 bg-cyan-400/20 rounded-xl border border-cyan-400/30 shrink-0">
                <IconWallet className="w-4 h-4 2xs:w-5 2xs:h-5 sm:w-8 sm:h-8 text-cyan-400" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] 2xs:text-[10px] sm:text-xs text-neutral-400 tracking-wider mb-0.5 2xs:mb-1">{t('mccBalance', 'MCC Balance')}</div>
                <div className="text-lg 2xs:text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-white font-mono truncate">
                  {mccLoading ? <Spinner /> : mask(fmt(mccBalance))}
                </div>
                <div className="text-[10px] 2xs:text-xs sm:text-sm text-neutral-500 mt-0.5 2xs:mt-1 truncate">
                  {mccLoading ? '' : mask(`${fmtUSD(totalUsd)}`)}
                  {!mccLoading && price > 0 && (
                    <span className="ml-1 2xs:ml-2 text-[9px] 2xs:text-[10px] sm:text-xs text-neutral-600">
                      @ {fmtUSD(price)}/MCC
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate?.(resolvePath('/mcc/mining'))}
              className="flex items-center gap-1 2xs:gap-2 px-2 2xs:px-3 py-1.5 2xs:py-2 sm:px-4 sm:py-2.5 bg-cyan-700 hover:bg-cyan-600 text-white rounded text-[10px] 2xs:text-xs sm:text-sm transition-colors whitespace-nowrap shrink-0"
            >
              <IconExternalLink className="h-3 w-3 2xs:h-4 2xs:w-4" />
              <span className="hidden 2xs:inline">{t('mintRecords', 'Mining Records')}</span>
              <span className="2xs:hidden">{t('mintRecords', 'Records')}</span>
            </button>
          </div>

          {}
          {walletList.length > 1 && mccData?.wallets && mccData.wallets.length > 1 && (
            <div className="mt-3 2xs:mt-4 space-y-1.5 2xs:space-y-2">
              {mccData.wallets.map((wb: any) => (
                <div
                  key={wb.wallet_address}
                  className="flex items-center justify-between gap-2 p-2 2xs:p-3 bg-neutral-800 rounded border border-neutral-700 text-xs 2xs:text-sm"
                >
                  <div className="flex items-center gap-1.5 2xs:gap-2 min-w-0">
                    <span className="text-neutral-400 font-mono truncate">
                      <span className="2xs:hidden">{wb.wallet_address.slice(0, 4)}...{wb.wallet_address.slice(-4)}</span>
                      <span className="hidden 2xs:inline sm:hidden">{wb.wallet_address.slice(0, 6)}...{wb.wallet_address.slice(-4)}</span>
                      <span className="hidden sm:inline">{wb.wallet_address.slice(0, 8)}...{wb.wallet_address.slice(-8)}</span>
                    </span>
                    {wb.is_primary && (
                      <span className="text-[9px] 2xs:text-[10px] bg-cyan-400/20 text-cyan-400 px-1 2xs:px-1.5 py-0.5 rounded shrink-0">
                        PRIMARY
                      </span>
                    )}
                  </div>
                  <span className="text-cyan-400 font-mono font-bold whitespace-nowrap shrink-0">
                    {mask(fmt(wb.balance ?? 0, 3))} MCC
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg hover:border-cyan-400/50 transition-colors">
        <div className="p-2 2xs:p-3 sm:p-4 md:p-6">
          <div className="flex items-center gap-1.5 2xs:gap-2 text-neutral-400 text-xs 2xs:text-sm mb-1.5 2xs:mb-2 sm:mb-3 md:mb-4">
            <IconGift className="text-cyan-400 shrink-0" />
            <span className="tracking-wider">{t('mcdPoints', 'MCD Points')}</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 2xs:gap-2 sm:gap-3">
            <div className="p-2 2xs:p-3 sm:p-4 bg-neutral-800 rounded border border-neutral-700 min-w-0">
              <div className="flex items-center gap-1.5 2xs:gap-2 mb-1.5 2xs:mb-2">
                <IconCreditCard className="h-3 w-3 2xs:h-4 2xs:w-4 text-cyan-400 shrink-0" />
                <span className="text-[8px] 2xs:text-[10px] sm:text-xs text-neutral-400 tracking-wider truncate">{t('currentBalance', 'Current Balance')}</span>
              </div>
              <div className="text-base 2xs:text-lg xs:text-xl sm:text-2xl font-bold text-cyan-400 font-mono truncate">
                {mcdLoading ? <Spinner /> : mask(fmt(mcdAmount, 6))}
              </div>
              <div className="text-[9px] 2xs:text-[10px] sm:text-xs text-neutral-500 mt-0.5 2xs:mt-1">MCD</div>
            </div>
            <div className="p-2 2xs:p-3 sm:p-4 bg-neutral-800 rounded border border-neutral-700 min-w-0">
              <div className="flex items-center gap-1.5 2xs:gap-2 mb-1.5 2xs:mb-2">
                <IconTrendingUp className="h-3 w-3 2xs:h-4 2xs:w-4 text-neutral-400 shrink-0" />
                <span className="text-[8px] 2xs:text-[10px] sm:text-xs text-neutral-400 tracking-wider truncate">{t('totalReceived', 'Total Received')}</span>
              </div>
              <div className="text-base 2xs:text-lg xs:text-xl sm:text-2xl font-bold text-white font-mono truncate">
                {mcdLoading ? <Spinner /> : mask(fmt(mcdTotalReceived, 6))}
              </div>
              <div className="text-[9px] 2xs:text-[10px] sm:text-xs text-neutral-500 mt-0.5 2xs:mt-1">MCD</div>
            </div>
          </div>

          <div className="mt-3 2xs:mt-4 pt-2 2xs:pt-3 border-t border-neutral-700 space-y-1.5 2xs:space-y-2">
            <div className="flex items-start gap-1.5 2xs:gap-2 text-[10px] 2xs:text-xs text-neutral-500">
              <IconGift className="w-3 h-3 mt-0.5 shrink-0" />
              <span>
                {t('income', 'Income')}: <span className="text-white">{mask(fmt(mcdTotalReceived, 0))}</span>
                {' · '}{t('spent', 'Spent')}: <span className="text-neutral-400">{mask(fmt(mcdSpent, 0))}</span>
                {' · '}{t('mcdDistributionNote', 'MCD is distributed daily to eligible miners.')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {}
      {activeLocks.length > 0 && (
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg transition-colors">
          <div className="p-2 2xs:p-3 sm:p-4 md:p-6">
            <div className="flex items-center gap-1.5 2xs:gap-2 text-neutral-400 text-xs 2xs:text-sm mb-1.5 2xs:mb-2 sm:mb-3 md:mb-4">
              <IconLock className="w-3.5 h-3.5 2xs:w-4 2xs:h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="tracking-wider">{t('lockPeriod14Days', 'Lock Period (14 days)')}</span>
            </div>
            <div className="grid grid-cols-1 gap-1.5 2xs:gap-2 sm:gap-3">
              {activeLocks.map((lock: any) => (
                <LockPeriodCard key={lock.lock_id} lock={lock} hideBalance={hideBalance} />
              ))}
            </div>
            <div className="mt-2 2xs:mt-3 text-[10px] 2xs:text-xs text-neutral-500 font-mono">
              {t('totalLocked', 'Total locked')}: {mask(fmt(lockedAmount, 2))} MCC
            </div>
          </div>
        </div>
      )}

      {}
      {walletList.length > 0 && (
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg transition-colors">
          <div className="p-2 2xs:p-3 sm:p-4 md:p-6">
            <div className="flex items-center gap-1.5 2xs:gap-2 text-neutral-400 text-xs 2xs:text-sm mb-1.5 2xs:mb-2 sm:mb-3 md:mb-4">
              <IconWallet className="w-3.5 h-3.5 2xs:w-4 2xs:h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0" />
              <span className="tracking-wider">{t('connectedWallets', 'Connected Wallets')}</span>
            </div>
            <div className="space-y-1.5 2xs:space-y-2">
              {walletList.map((w: any) => (
                <div
                  key={w.wallet_address}
                  className="flex items-center justify-between gap-2 p-2 2xs:p-3 bg-neutral-800 rounded border border-neutral-700"
                >
                  <div className="flex items-center gap-1.5 2xs:gap-2 sm:gap-3 min-w-0">
                    <code className="text-[10px] 2xs:text-xs sm:text-sm text-neutral-300 font-mono truncate">
                      <span className="2xs:hidden">{w.wallet_address.slice(0, 4)}...{w.wallet_address.slice(-4)}</span>
                      <span className="hidden 2xs:inline xs:hidden">{w.wallet_address.slice(0, 6)}...{w.wallet_address.slice(-6)}</span>
                      <span className="hidden xs:inline sm:hidden">{w.wallet_address.slice(0, 8)}...{w.wallet_address.slice(-8)}</span>
                      <span className="hidden sm:inline">{w.wallet_address}</span>
                    </code>
                    {w.is_primary && (
                      <span className="text-[8px] 2xs:text-[10px] bg-cyan-400/20 text-cyan-400 border border-cyan-400/30 px-1 2xs:px-1.5 py-0.5 rounded font-mono shrink-0">
                        PRIMARY
                      </span>
                    )}
                  </div>
                  <a
                    href={`https://solscan.io/account/${w.wallet_address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors shrink-0"
                  >
                    <IconExternalLink className="w-3.5 h-3.5 2xs:w-4 2xs:h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
