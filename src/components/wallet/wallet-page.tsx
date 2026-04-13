'use client'

import { useState, useEffect } from 'react'
import { useMCC, useMCD, useWallets, useMCCLocks, useMarketData, useMultiWalletBalance } from '@microcosmmoney/auth-react'

/* ── helpers ── */
const fmt = (n: number, d = 2) =>
  n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })

const fmtUSD = (n: number) =>
  '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/* ── inline SVG icons (16-20px, stroke-based, matching lucide style) ── */
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

/* ── spinner ── */
function Spinner({ size = 'w-5 h-5' }: { size?: string }) {
  return <span className={`inline-block ${size} border-2 border-cyan-400 border-t-transparent rounded-full animate-spin`} />
}

/* ── lock period card ── */
function LockPeriodCard({ lock, hideBalance }: { lock: any; hideBalance: boolean }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const start = new Date(lock.lock_start).getTime()
    const end = new Date(lock.lock_end).getTime()
    const now = Date.now()
    const p = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100))
    // Animate in
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
    <div className="p-4 bg-neutral-800 rounded border border-neutral-700">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-xs text-neutral-400 tracking-wider mb-1">
            reason: {lock.reason}
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {hideBalance ? '****' : fmt(lock.amount)} MCC
          </div>
        </div>
        <span className="text-[10px] bg-cyan-400/20 text-cyan-400 border border-cyan-400/30 px-2 py-0.5 rounded font-mono">
          LOCKED
        </span>
      </div>

      <div className="space-y-1 text-sm">
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

/* ── token icon ── */
function TokenIcon({ symbol, color }: { symbol: string; color: string }) {
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${color}`}>
      {symbol.slice(0, 2)}
    </div>
  )
}

/* ── on-chain asset list ── */
interface AssetHolding {
  symbol: string
  name: string
  color: string
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
  if (isLoading) {
    return (
      <div className="py-8 px-4">
        <div className="flex items-center justify-center gap-3">
          <Spinner size="w-4 h-4" />
          <span className="text-neutral-500 text-sm">Syncing on-chain data...</span>
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
        <p className="text-sm">No valued assets found</p>
      </div>
    )
  }

  const gridCols = showWalletColumn ? 'grid-cols-4' : 'grid-cols-3'

  return (
    <div>
      <div className={`gap-4 py-2 px-4 border-b border-neutral-700 text-xs font-medium text-neutral-400 tracking-wider grid ${gridCols}`}>
        <div>Token</div>
        {showWalletColumn && <div>Wallet</div>}
        <div className="text-right">Amount</div>
        <div className="text-right">Valuation</div>
      </div>
      <div className="divide-y divide-neutral-800">
        {holdings.map((h, idx) => (
          <div
            key={`${h.symbol}-${h.wallet || idx}`}
            className={`gap-4 py-3 px-4 items-center hover:bg-neutral-700 transition-colors rounded grid ${gridCols}`}
          >
            <div className="flex items-center gap-3">
              <TokenIcon symbol={h.symbol} color={h.color} />
              <div>
                <div className="text-white font-medium text-sm">{h.symbol}</div>
                <div className="text-xs text-neutral-500">{h.name}</div>
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
                {hideBalance ? '****' : fmt(h.balance, h.balance < 1 ? 6 : 4)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-neutral-300 text-sm font-mono">
                {hideBalance ? '****' : fmtUSD(h.usdValue)}
              </div>
              <div className="text-xs text-neutral-500">{fmtUSD(h.price)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── main component ── */
export interface MicrocosmWalletPageProps {
  basePath?: string
  onNavigate?: (path: string) => void
}

export function MicrocosmWalletPage({ basePath = '', onNavigate }: MicrocosmWalletPageProps) {
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

  /* ── build on-chain asset holdings from multiBalance ── */
  const TOKEN_META: Record<string, { name: string; color: string; priceKey?: string }> = {
    SOL: { name: 'Solana', color: 'bg-purple-600' },
    MCC: { name: 'Microcosm Coin', color: 'bg-cyan-600' },
    USDC: { name: 'USD Coin', color: 'bg-blue-600' },
    USDT: { name: 'Tether', color: 'bg-green-600' },
  }

  const TOKEN_PRICES: Record<string, number> = {
    SOL: 0, // we don't have SOL price from market data, show 0
    MCC: price,
    USDC: 1,
    USDT: 1,
  }

  function buildHoldings(walletAddr?: string): AssetHolding[] {
    if (!multiBalance) return []

    const items: AssetHolding[] = []
    const sources = walletAddr
      ? multiBalance.filter((w) => w.wallet_address === walletAddr)
      : multiBalance

    for (const wb of sources) {
      const p = wb.portfolio || {}
      const entries: [string, number][] = [
        ['SOL', p.sol_balance ?? 0],
        ['MCC', p.mcc_balance ?? 0],
        ['USDC', p.usdc_balance ?? 0],
        ['USDT', p.usdt_balance ?? 0],
      ]
      for (const [sym, bal] of entries) {
        if (bal <= 0) continue
        const meta = TOKEN_META[sym] || { name: sym, color: 'bg-neutral-600' }
        const tp = TOKEN_PRICES[sym] ?? 0
        const usdVal = bal * tp
        items.push({
          symbol: sym,
          name: meta.name,
          color: meta.color,
          balance: bal,
          usdValue: usdVal,
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
      agg['SOL'] = (agg['SOL'] || 0) + (p.sol_balance ?? 0)
      agg['MCC'] = (agg['MCC'] || 0) + (p.mcc_balance ?? 0)
      agg['USDC'] = (agg['USDC'] || 0) + (p.usdc_balance ?? 0)
      agg['USDT'] = (agg['USDT'] || 0) + (p.usdt_balance ?? 0)
    }

    const items: AssetHolding[] = []
    for (const [sym, bal] of Object.entries(agg)) {
      if (bal <= 0) continue
      const meta = TOKEN_META[sym] || { name: sym, color: 'bg-neutral-600' }
      const tp = TOKEN_PRICES[sym] ?? 0
      items.push({
        symbol: sym,
        name: meta.name,
        color: meta.color,
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

  // Only show assets >= $1 (matching portal)
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

  const anyError = false // hooks don't expose combined error state cleanly

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">Wallet</h1>
          <p className="text-sm text-neutral-400 mt-1">On-chain assets & balances</p>
        </div>
        <button
          className="flex items-center gap-2 px-3 py-1.5 text-sm border border-neutral-700 rounded text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent transition-colors disabled:opacity-50"
          onClick={handleRefresh}
          disabled={isRefreshing || multiLoading}
        >
          <IconRefresh className={isRefreshing || multiLoading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* ── Total Asset Value ── */}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg hover:border-cyan-400/50 transition-colors">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-neutral-400 text-sm">
              <IconWallet className="text-cyan-400" />
              <span>{isAllTab ? 'Total Asset Value' : 'Wallet Asset Value'}</span>
              <button
                onClick={() => setHideBalance(!hideBalance)}
                className="hover:text-white transition-colors"
              >
                {hideBalance ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold text-white font-mono">
              {hideBalance ? '****' : (activeUsdValue > 0 ? fmtUSD(activeUsdValue) : '--')}
            </span>
          </div>
          <div className="text-neutral-500 text-xs">
            {hideBalance ? '****' : 'Aggregated from on-chain token balances'}
          </div>
        </div>
      </div>

      {/* ── On-Chain Assets (with wallet tabs) ── */}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg transition-colors">
        <div className="p-6">
          {/* Wallet tabs */}
          {walletList.length > 1 && (
            <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 text-xs rounded whitespace-nowrap transition-colors ${
                  activeTab === 'all'
                    ? 'bg-cyan-700 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                }`}
              >
                Overview ({walletList.length} wallets)
              </button>
              {walletList.map((w: any) => (
                <button
                  key={w.wallet_address}
                  onClick={() => setActiveTab(w.wallet_address)}
                  className={`px-3 py-1.5 text-xs rounded whitespace-nowrap transition-colors flex items-center gap-1 ${
                    activeTab === w.wallet_address
                      ? 'bg-cyan-700 text-white'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                  }`}
                >
                  <code className="font-mono">
                    {w.wallet_address.slice(0, 4)}...{w.wallet_address.slice(-4)}
                  </code>
                  {w.is_primary && <span className="text-cyan-400 text-[10px]">Primary</span>}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 text-neutral-400 text-sm mb-4">
            <IconCreditCard className="text-cyan-400" />
            <span className="tracking-wider">On-Chain Assets</span>
            {multiLoading && <Spinner size="w-3 h-3" />}
          </div>

          {multiLoading ? (
            <div className="py-10">
              <div className="flex flex-col items-center gap-3">
                <Spinner size="w-6 h-6" />
                <p className="text-sm text-neutral-400">Syncing on-chain data...</p>
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

          {/* Footer info */}
          <div className="mt-4 pt-3 border-t border-neutral-700 space-y-2">
            {isAllTab ? (
              <div className="flex items-start gap-2 text-xs text-neutral-500">
                <IconInfo className="mt-0.5 shrink-0" />
                <span>
                  Aggregated on-chain balances across {walletList.length} wallet{walletList.length !== 1 ? 's' : ''}.
                  Low-value assets (&lt;$1) are hidden.
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <IconInfo className="shrink-0" />
                    <span>Current wallet:</span>
                    <code className="text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded font-mono">
                      {activeTab}
                    </code>
                    {walletList.find((w: any) => w.wallet_address === activeTab)?.is_primary && (
                      <span className="text-cyan-400 bg-cyan-400/20 px-1.5 py-0.5 rounded text-[10px]">
                        Primary
                      </span>
                    )}
                  </div>
                  <a
                    href={`https://solscan.io/account/${activeTab}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1"
                  >
                    View on Solscan <IconExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex items-start gap-2 text-xs text-neutral-500">
                  <IconInfo className="mt-0.5 shrink-0" />
                  <span>Showing on-chain balances for this wallet only. Low-value assets (&lt;$1) are hidden.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MCC Balance ── */}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg hover:border-cyan-400/50 transition-colors">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-cyan-400/20 rounded-xl border border-cyan-400/30">
                <IconWallet className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <div className="text-xs text-neutral-400 tracking-wider mb-1">MCC Balance</div>
                <div className="text-4xl font-bold text-white font-mono">
                  {mccLoading ? <Spinner /> : mask(fmt(mccBalance))}
                </div>
                <div className="text-sm text-neutral-500 mt-1">
                  {mccLoading ? '' : mask(`${fmtUSD(totalUsd)}`)}
                  {!mccLoading && price > 0 && (
                    <span className="ml-2 text-xs text-neutral-600">
                      @ {fmtUSD(price)}/MCC
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate?.(resolvePath('/mcc/mining'))}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded text-sm transition-colors"
            >
              <IconExternalLink className="h-4 w-4" />
              Mining Records
            </button>
          </div>

          {/* Per-wallet breakdown */}
          {walletList.length > 1 && mccData?.wallets && mccData.wallets.length > 1 && (
            <div className="mt-4 space-y-2">
              {mccData.wallets.map((wb: any) => (
                <div
                  key={wb.wallet_address}
                  className="flex items-center justify-between p-3 bg-neutral-800 rounded border border-neutral-700 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400 font-mono">
                      {wb.wallet_address.slice(0, 6)}...{wb.wallet_address.slice(-4)}
                    </span>
                    {wb.is_primary && (
                      <span className="text-[10px] bg-cyan-400/20 text-cyan-400 px-1.5 py-0.5 rounded">
                        PRIMARY
                      </span>
                    )}
                  </div>
                  <span className="text-cyan-400 font-mono font-bold">
                    {mask(fmt(wb.balance ?? 0, 3))} MCC
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── MCD Balance ── */}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg hover:border-cyan-400/50 transition-colors">
        <div className="p-6">
          <div className="flex items-center gap-2 text-neutral-400 text-sm mb-4">
            <IconGift className="text-cyan-400" />
            <span className="tracking-wider">MCD Points</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-800 rounded border border-neutral-700">
              <div className="flex items-center gap-2 mb-2">
                <IconCreditCard className="h-4 w-4 text-cyan-400" />
                <span className="text-xs text-neutral-400 tracking-wider">Current Balance</span>
              </div>
              <div className="text-2xl font-bold text-cyan-400 font-mono">
                {mcdLoading ? <Spinner /> : mask(fmt(mcdAmount, 6))}
              </div>
              <div className="text-xs text-neutral-500 mt-1">MCD</div>
            </div>
            <div className="p-4 bg-neutral-800 rounded border border-neutral-700">
              <div className="flex items-center gap-2 mb-2">
                <IconTrendingUp className="h-4 w-4 text-neutral-400" />
                <span className="text-xs text-neutral-400 tracking-wider">Total Received</span>
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                {mcdLoading ? <Spinner /> : mask(fmt(mcdTotalReceived, 6))}
              </div>
              <div className="text-xs text-neutral-500 mt-1">MCD</div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-700 space-y-2">
            <div className="flex items-start gap-2 text-xs text-neutral-500">
              <IconGift className="w-3 h-3 mt-0.5 shrink-0" />
              <span>
                Income: <span className="text-white">{mask(fmt(mcdTotalReceived, 0))}</span>
                {' · '}Spent: <span className="text-neutral-400">{mask(fmt(mcdSpent, 0))}</span>
                {' · '}MCD is distributed daily to eligible miners.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Lock Periods ── */}
      {activeLocks.length > 0 && (
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg transition-colors">
          <div className="p-6">
            <div className="flex items-center gap-2 text-neutral-400 text-sm mb-4">
              <IconLock className="w-4 h-4" />
              <span className="tracking-wider">Lock Period (14 days)</span>
            </div>
            <div className="space-y-3">
              {activeLocks.map((lock: any) => (
                <LockPeriodCard key={lock.lock_id} lock={lock} hideBalance={hideBalance} />
              ))}
            </div>
            <div className="mt-3 text-xs text-neutral-500 font-mono">
              Total locked: {mask(fmt(lockedAmount, 2))} MCC
            </div>
          </div>
        </div>
      )}

      {/* ── Wallet List ── */}
      {walletList.length > 0 && (
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg transition-colors">
          <div className="p-6">
            <div className="flex items-center gap-2 text-neutral-400 text-sm mb-4">
              <IconWallet className="w-4 h-4 text-cyan-400" />
              <span className="tracking-wider">Connected Wallets</span>
            </div>
            <div className="space-y-2">
              {walletList.map((w: any) => (
                <div
                  key={w.wallet_address}
                  className="flex items-center justify-between p-3 bg-neutral-800 rounded border border-neutral-700"
                >
                  <div className="flex items-center gap-3">
                    <code className="text-sm text-neutral-300 font-mono">
                      {w.wallet_address}
                    </code>
                    {w.is_primary && (
                      <span className="text-[10px] bg-cyan-400/20 text-cyan-400 border border-cyan-400/30 px-1.5 py-0.5 rounded font-mono">
                        PRIMARY
                      </span>
                    )}
                  </div>
                  <a
                    href={`https://solscan.io/account/${w.wallet_address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <IconExternalLink className="w-4 h-4" />
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
