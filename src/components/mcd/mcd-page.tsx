'use client'

import { useState } from 'react'
import { useMCD, useMCDRewards, useMCDTransactions, useWallets } from '@microcosmmoney/auth-react'
import { useTranslations } from '../../i18n-context'

/* ── Inline SVG Icons (lucide style, 24x24 default) ── */

const IconCoins = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="6" />
    <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
    <path d="M7 6h1v4" />
    <path d="m16.71 13.88.7.71-2.82 2.82" />
  </svg>
)

const IconWallet = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
  </svg>
)

const IconGift = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M12 8v13" />
    <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
  </svg>
)

const IconCalendar = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
)

const IconHistory = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
)

const IconHelpCircle = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </svg>
)

const IconRefresh = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M21 21v-5h-5" />
  </svg>
)

const IconChevronDown = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
)

const IconChevronUp = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m18 15-6-6-6 6" />
  </svg>
)

const IconArrowRight = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)

const IconTrendingUp = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
)

const IconMessageSquare = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const IconEye = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const IconShield = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
  </svg>
)

const IconExternalLink = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
)

const IconAlertTriangle = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
)

/* ── Helpers ── */

const fmt = (n: number, d = 2) =>
  n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })

function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatShortDate(dateStr: string): string {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
  })
}

function Spinner() {
  return (
    <span className="inline-block w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
  )
}

const TX_TYPE_COLORS: Record<string, string> = {
  daily_distribution: 'bg-white/20 text-white border-transparent',
  spend: 'bg-red-500/20 text-red-500 border-transparent',
  transfer: 'bg-cyan-400/20 text-cyan-400 border-transparent',
  refund: 'bg-cyan-400/20 text-cyan-400 border-transparent',
}

const TX_TYPE_NAMES: Record<string, string> = {
  daily_distribution: 'Daily',
  spend: 'Spend',
  transfer: 'Transfer',
  refund: 'Refund',
}

/* ── Ecosystem services ── */

const ECOSYSTEM_SERVICES = [
  {
    name: 'Double Helix',
    tagline: 'Quantitative Trading',
    desc: 'Automated quantitative trading strategies powered by AI',
    Icon: IconTrendingUp,
    status: 'Running',
    statusColor: 'text-white',
    url: 'https://doublehelix.money',
  },
  {
    name: 'xSocial',
    tagline: 'AI Social Platform',
    desc: 'AI-powered social media management and engagement',
    Icon: IconMessageSquare,
    status: 'Beta',
    statusColor: 'text-cyan-400',
    url: 'https://xsocial.cc',
  },
  {
    name: 'Event Horizon',
    tagline: 'Prediction Market',
    desc: 'Decentralized prediction markets for real-world events',
    Icon: IconEye,
    status: 'Dev',
    statusColor: 'text-neutral-400',
    url: 'https://poly.microcosm.money',
  },
  {
    name: 'GreenSwans',
    tagline: 'Crypto Guardian',
    desc: 'Climate finance and green asset management',
    Icon: IconShield,
    status: 'Dev',
    statusColor: 'text-neutral-400',
    url: 'https://greenswans.cc',
  },
]

/* ── Component ── */

export interface MicrocosmMCDPageProps {
  basePath?: string
  onNavigate?: (path: string) => void
}

export function MicrocosmMCDPage({ basePath = '', onNavigate }: MicrocosmMCDPageProps) {
  const t = useTranslations('mcdDash')
  const { balance: mcdData, loading: mcdLoading, refresh: refreshMCD } = useMCD(60_000)
  const { data: rewards, loading: rewardsLoading, refresh: refreshRewards } = useMCDRewards()
  const { data: transactions, loading: txLoading, refresh: refreshTx } = useMCDTransactions()
  const { data: wallets, loading: walletsLoading } = useWallets()

  const [activeTab, setActiveTab] = useState<'daily' | 'history'>('daily')
  const [showHelp, setShowHelp] = useState(false)
  const [walletsExpanded, setWalletsExpanded] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const mcdAmount = parseFloat(mcdData?.available_balance ?? '0')
  const mcdReceived = parseFloat(mcdData?.total_balance ?? '0')
  const mcdSpent = parseFloat(mcdData?.frozen_balance ?? '0')
  const rewardsList = Array.isArray(rewards) ? rewards : []
  const txList = Array.isArray(transactions) ? transactions : []
  const walletList = Array.isArray(wallets) ? wallets : []

  const resolvePath = (p: string) =>
    basePath ? `${basePath.replace(/\/$/, '')}${p}` : p

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await Promise.all([
        refreshMCD(),
        refreshRewards?.(),
        refreshTx?.(),
      ])
    } finally {
      setRefreshing(false)
    }
  }

  const handleNav = (path: string) => {
    onNavigate?.(resolvePath(path))
  }

  /* ── Not logged in ── */
  if (!mcdData && !mcdLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-8 text-center">
          <IconWallet className="w-12 h-12 mx-auto mb-4 text-neutral-500" />
          <p className="text-neutral-400">{t('loginRequired', 'Please log in to view your MCD balance')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">{t('title', 'MCD Credits')}</h1>
          <p className="text-sm text-neutral-400 mt-1">
            {t('subtitle', 'Microcosm Dollar - Ecosystem consumption credits')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleNav('/mcc/wallet')}
            className="flex items-center px-3 py-1.5 text-sm border border-neutral-700 rounded text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent transition-colors"
          >
            <IconWallet className="w-4 h-4 mr-2" />
            {t('manageWallet', 'Manage Wallet')}
          </button>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="flex items-center px-3 py-1.5 text-sm border border-neutral-700 rounded text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent transition-colors"
          >
            <IconHelpCircle className="w-4 h-4 mr-2" />
            {t('helpGuide', 'Help Guide')}
          </button>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-3 py-1.5 text-sm border border-neutral-700 rounded text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent transition-colors disabled:opacity-50"
          >
            <IconRefresh className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {t('refresh', 'Refresh')}
          </button>
        </div>
      </div>

      {/* ── Help Panel (toggleable) ── */}
      {showHelp && (
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 hover:border-cyan-400/50 transition-colors">
          <div className="text-white font-bold tracking-wider mb-4">{t('mcdGuideTitle', 'MCD Credits Guide')}</div>
          <div className="space-y-4 text-sm">
            <div className="bg-neutral-800 rounded p-3">
              <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                <IconGift className="w-4 h-4 text-white" />
                {t('howToGetMcd', 'How to Earn MCD')}
              </h4>
              <ul className="list-disc list-inside text-neutral-400 space-y-1">
                <li>Daily distribution from territory vault (1% of vault balance)</li>
                <li>Companion yield from mining operations</li>
                <li>Ecosystem service rewards</li>
              </ul>
            </div>
            <div className="bg-neutral-800 rounded p-3">
              <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                <IconCoins className="w-4 h-4 text-white" />
                {t('mcdUsage', 'MCD Usage')}
              </h4>
              <ul className="list-disc list-inside text-neutral-400 space-y-1">
                <li>Spend on ecosystem services (Double Helix, xSocial, etc.)</li>
                <li>Transfer between users</li>
                <li>Future governance participation</li>
              </ul>
            </div>
            <div className="bg-neutral-800 rounded p-3">
              <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                <IconHistory className="w-4 h-4 text-white" />
                {t('notes', 'Notes')}
              </h4>
              <ul className="list-disc list-inside text-neutral-400 space-y-1">
                <li>MCD is an internal ecosystem token, not tradeable on exchanges</li>
                <li>Daily distribution happens automatically at 00:15 UTC</li>
                <li>Check your territory page for vault balance details</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ── Balance Card ── */}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 hover:border-cyan-400/50 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-neutral-400 text-xs font-mono tracking-wider mb-1">available_balance</div>
            {mcdLoading ? (
              <div className="flex items-center gap-2 h-10">
                <Spinner />
              </div>
            ) : (
              <div className="text-4xl font-bold font-mono text-cyan-400">
                {fmt(mcdAmount)}
              </div>
            )}
            <div className="text-xs text-neutral-500 mt-1">MCD</div>
          </div>
          <div>
            <div className="text-neutral-400 text-xs font-mono tracking-wider mb-1">total_received</div>
            <div className="text-2xl font-bold font-mono text-white">{fmt(mcdReceived, 0)}</div>
            <div className="text-xs text-neutral-500 mt-1">lifetime income</div>
          </div>
          <div>
            <div className="text-neutral-400 text-xs font-mono tracking-wider mb-1">total_spent</div>
            <div className="text-2xl font-bold font-mono text-neutral-400">{fmt(mcdSpent, 0)}</div>
            <div className="text-xs text-neutral-500 mt-1">lifetime spent</div>
          </div>
        </div>
      </div>

      {/* ── On-chain MCD per Wallet (collapsible) ── */}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 hover:border-cyan-400/50 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <IconCoins className="w-5 h-5 text-white" />
            <span className="text-sm text-neutral-400 tracking-wider">{t('onChainBalance', 'On-chain MCD Balance (Helius RPC)')}</span>
          </div>
          {walletList.length > 1 && (
            <button
              onClick={() => setWalletsExpanded(!walletsExpanded)}
              className="flex items-center text-sm text-neutral-400 hover:text-cyan-400 transition-colors"
            >
              {walletList.length} {t('walletsCount', 'wallets')}
              {walletsExpanded
                ? <IconChevronUp className="w-4 h-4 ml-1" />
                : <IconChevronDown className="w-4 h-4 ml-1" />
              }
            </button>
          )}
        </div>

        {walletsLoading ? (
          <div className="flex items-center gap-2">
            <Spinner />
            <span className="text-neutral-500 text-sm">{t('loadingOnChain', 'Loading on-chain balance...')}</span>
          </div>
        ) : walletList.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-neutral-500 mb-3">{t('noWalletBound', 'No Solana wallet bound yet')}</p>
            <button
              onClick={() => handleNav('/mcc/wallet')}
              className="flex items-center mx-auto px-3 py-1.5 text-sm border border-neutral-700 rounded text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent transition-colors"
            >
              <IconWallet className="w-4 h-4 mr-2" />
              {t('connectWallet', 'Connect Wallet')}
            </button>
          </div>
        ) : (
          <>
            {/* Single wallet inline */}
            {walletList.length === 1 && (
              <div className="mt-2 text-xs text-neutral-500 font-mono">
                {walletList[0].wallet_address.slice(0, 4)}...{walletList[0].wallet_address.slice(-4)}
                {walletList[0].is_primary && (
                  <span className="inline-block text-[10px] border border-cyan-400/30 text-cyan-400 px-1.5 py-0 ml-2 rounded">
                    {t('primaryWallet', 'Primary')}
                  </span>
                )}
              </div>
            )}

            {/* Multi-wallet expandable list */}
            {walletsExpanded && walletList.length > 1 && (
              <div className="mt-4 space-y-2 border-t border-neutral-700 pt-4">
                {walletList.map((w) => (
                  <div key={w.wallet_address} className="flex items-center justify-between p-2 bg-neutral-800 rounded hover:bg-neutral-700 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-neutral-400">
                        {w.wallet_address.slice(0, 4)}...{w.wallet_address.slice(-4)}
                      </span>
                      {w.is_primary && (
                        <span className="inline-block text-[10px] border border-cyan-400/30 text-cyan-400 px-1.5 py-0 rounded">
                          {t('primaryWallet', 'Primary')}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-mono text-white">MCD</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── MCD Minting Card ── */}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg hover:border-cyan-400/50 transition-colors">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <IconTrendingUp className="w-5 h-5 text-white" />
            <span className="text-sm font-medium text-neutral-300 tracking-wider">{t('mcdMinting', 'MCD Minting')}</span>
          </div>
          <p className="text-neutral-400 text-sm mb-4">{t('mintMccWithMcd', 'Consume MCD to mint MCC Token')}</p>
          <button
            onClick={() => handleNav('/mcc/mining')}
            className="w-full flex items-center justify-center gap-2 h-10 rounded-md bg-cyan-700 hover:bg-cyan-600 transition-all text-white text-sm font-medium cursor-pointer"
          >
            <IconCoins className="w-4 h-4" />
            {t('useMcdToMintMcc', 'Mint MCC with MCD')}
          </button>
          <div className="mt-3 p-3 bg-neutral-800 rounded">
            <div className="flex items-start gap-2 text-xs text-cyan-400/70">
              <IconAlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-cyan-400" />
              <div className="space-y-1">
                <p>MCD mining requires Miner level or above</p>
                <p>Mining price = Oracle price x 2, MCD companion yield included</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Ecosystem Services ── */}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg hover:border-cyan-400/50 transition-colors">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <IconGift className="w-5 h-5 text-white" />
            <span className="text-sm font-medium text-neutral-300 tracking-wider">{t('ecoServices', 'Ecosystem Services')}</span>
          </div>
          <p className="text-neutral-400 text-sm mb-4">{t('ecoServicesDesc', 'Use MCD to access ecosystem project services')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ECOSYSTEM_SERVICES.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-400/20 flex items-center justify-center">
                    <p.Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white text-sm">{p.name}</span>
                      <IconExternalLink className="w-3 h-3 text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-xs text-neutral-500">{p.tagline}</span>
                  </div>
                  <span className={`text-[10px] ${p.statusColor}`}>{p.status}</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">{p.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-1 inline-flex">
        <button
          onClick={() => setActiveTab('daily')}
          className={`flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
            activeTab === 'daily'
              ? 'bg-neutral-700 text-white'
              : 'text-neutral-400 hover:text-neutral-300'
          }`}
        >
          <IconGift className="w-4 h-4 mr-2" />
          {t('dailyDistribution', 'Daily Distribution')}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
            activeTab === 'history'
              ? 'bg-neutral-700 text-white'
              : 'text-neutral-400 hover:text-neutral-300'
          }`}
        >
          <IconHistory className="w-4 h-4 mr-2" />
          {t('transactionHistory', 'Transaction History')}
        </button>
      </div>

      {/* ── Tab Content: Daily Distribution ── */}
      {activeTab === 'daily' && (
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg hover:border-cyan-400/50 transition-colors">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-1">
              <IconCalendar className="w-5 h-5 text-white" />
              <span className="text-sm font-medium text-neutral-300 tracking-wider">{t('dailyDistributionRecords', 'Daily Distribution Records')}</span>
            </div>
            <p className="text-neutral-400 text-sm mb-4">{t('dailyDistributionDesc', 'MCD records auto-distributed daily from Station vault')}</p>

            {rewardsLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 w-full bg-neutral-800 rounded animate-pulse" />
                ))}
              </div>
            ) : rewardsList.length === 0 ? (
              <div className="text-center py-12 text-neutral-500">
                <IconGift className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{t('noDailyRecords', 'No daily distribution records')}</p>
                <p className="text-sm mt-2">{t('noDailyRecordsHint', 'Daily MCD distribution begins after joining a Station')}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-800">
                      <th className="text-left py-3 text-xs font-medium text-neutral-400 tracking-wider">{t('distributionDate', 'Distribution Date')}</th>
                      <th className="text-left py-3 text-xs font-medium text-neutral-400 tracking-wider">{t('territoryId', 'Territory')}</th>
                      <th className="text-right py-3 text-xs font-medium text-neutral-400 tracking-wider">{t('amountLabel', 'Amount')}</th>
                      <th className="text-right py-3 text-xs font-medium text-neutral-400 tracking-wider">{t('claimTime', 'Claim Time')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rewardsList.map((reward: any) => (
                      <tr key={reward.id} className="border-b border-neutral-800 hover:bg-neutral-800 transition-colors">
                        <td className="py-3 font-medium text-white font-mono">
                          {formatShortDate(reward.reward_date)}
                        </td>
                        <td className="py-3 text-neutral-400 font-mono">
                          {reward.territory_id || '-'}
                        </td>
                        <td className="py-3 text-right">
                          <span className="text-cyan-400 font-medium font-mono">
                            +{(reward.mcd_received ?? 0).toLocaleString()} MCD
                          </span>
                        </td>
                        <td className="py-3 text-right text-neutral-500 text-sm font-mono">
                          {formatDate(reward.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Tab Content: Transaction History ── */}
      {activeTab === 'history' && (
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg hover:border-cyan-400/50 transition-colors">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-1">
              <IconHistory className="w-5 h-5 text-white" />
              <span className="text-sm font-medium text-neutral-300 tracking-wider">{t('transactionHistory', 'Transaction History')}</span>
            </div>
            <p className="text-neutral-400 text-sm mb-4">{t('transactionHistoryDesc', 'Complete record of all MCD-related transactions')}</p>

            {txLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 w-full bg-neutral-800 rounded animate-pulse" />
                ))}
              </div>
            ) : txList.length === 0 ? (
              <div className="text-center py-12 text-neutral-500">
                <IconHistory className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{t('noTransactions', 'No transaction records')}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-800">
                      <th className="text-left py-3 text-xs font-medium text-neutral-400 tracking-wider">{t('timeLabel', 'Time')}</th>
                      <th className="text-left py-3 text-xs font-medium text-neutral-400 tracking-wider">{t('typeLabel', 'Type')}</th>
                      <th className="text-left py-3 text-xs font-medium text-neutral-400 tracking-wider">{t('fromLabel', 'From')}</th>
                      <th className="text-left py-3 text-xs font-medium text-neutral-400 tracking-wider w-8"></th>
                      <th className="text-left py-3 text-xs font-medium text-neutral-400 tracking-wider">{t('toLabel', 'To')}</th>
                      <th className="text-right py-3 text-xs font-medium text-neutral-400 tracking-wider">{t('amountLabel', 'Amount')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {txList.map((tx: any) => {
                      const isIncome = tx.tx_type === 'daily_distribution' || tx.tx_type === 'refund' || tx.tx_type === 'transfer'
                      return (
                        <tr key={tx.id} className="border-b border-neutral-800 hover:bg-neutral-800 transition-colors">
                          <td className="py-3 text-neutral-500 text-sm font-mono">
                            {formatDate(tx.created_at)}
                          </td>
                          <td className="py-3">
                            <span
                              className={`inline-block text-xs px-2 py-0.5 rounded border ${
                                TX_TYPE_COLORS[tx.tx_type] || 'bg-neutral-500/20 text-neutral-300 border-transparent'
                              }`}
                            >
                              {TX_TYPE_NAMES[tx.tx_type] || tx.tx_type}
                            </span>
                          </td>
                          <td className="py-3 text-neutral-400 text-sm font-mono">
                            {tx.from_account_type === 'station_vault'
                              ? `Station #${tx.from_account_id}`
                              : tx.from_account_type === 'system'
                              ? 'System'
                              : tx.from_account_id
                              ? `User ${tx.from_account_id.slice(0, 8)}...`
                              : '-'}
                          </td>
                          <td className="py-3 text-neutral-600">
                            <IconArrowRight className="w-4 h-4" />
                          </td>
                          <td className="py-3 text-neutral-400 text-sm font-mono">
                            {tx.to_account_type === 'station_vault'
                              ? `Station #${tx.to_account_id}`
                              : tx.to_account_type === 'system'
                              ? 'System'
                              : tx.to_account_id
                              ? `User ${tx.to_account_id.slice(0, 8)}...`
                              : '-'}
                          </td>
                          <td className="py-3 text-right">
                            <span
                              className={`font-medium font-mono ${
                                isIncome ? 'text-cyan-400' : 'text-red-400'
                              }`}
                            >
                              {isIncome ? '+' : '-'}{(tx.amount ?? 0).toLocaleString()} MCD
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
