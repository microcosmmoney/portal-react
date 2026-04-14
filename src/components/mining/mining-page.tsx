'use client'

import { useState, useCallback } from 'react'
import { useMiningStats, useMiningRecords, useMCCStats, useMarketData, useMCCPrice, useEcosystemOperations, useMCC, useWallets, useMiningFlow } from '@microcosmmoney/auth-react'
import { useTranslations } from '../../i18n-context'

const IconRefresh = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 16h5v5" />
  </svg>
)

const IconZap = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
  </svg>
)

const IconTrendingUp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
)

const IconCoins = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="6" />
    <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
    <path d="M7 6h1v4" />
  </svg>
)

const IconShield = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
  </svg>
)

const IconWallet = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
    <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
  </svg>
)

const IconHistory = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
)

const IconExternalLink = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
)

const IconChevronDown = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
)

const IconChevronUp = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m18 15-6-6-6 6" />
  </svg>
)

const IconCheckCircle = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m9 11 3 3L22 4" />
  </svg>
)

const IconAlertCircle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
)

const fmt = (n: number | undefined | null, d = 2) => {
  if (n === undefined || n === null || isNaN(n)) return '0.00'
  return n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })
}

function Spinner({ className = '' }: { className?: string }) {
  return <span className={`inline-block w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin ${className}`} />
}

const formatDateTime = (iso: string) => {
  if (!iso) return '-'
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export interface MicrocosmMiningPageProps {
  basePath?: string
  onNavigate?: (path: string) => void
}

export function MicrocosmMiningPage({ basePath = '', onNavigate }: MicrocosmMiningPageProps) {
  const t = useTranslations('miningDash')
  const { data: stats, loading: statsLoading } = useMiningStats()
  const [recordsPage, setRecordsPage] = useState(1)
  const RECORDS_PAGE_SIZE = 10
  const { data: recordsData, loading: recordsLoading, refresh: refreshRecords } = useMiningRecords({ page: recordsPage, pageSize: RECORDS_PAGE_SIZE })
  const records: any[] = Array.isArray(recordsData) ? recordsData : (recordsData as any)?.records ?? []
  const recordsTotal: number = (recordsData as any)?.total ?? records.length
  const recordsTotalPages: number = Math.max(1, Math.ceil(recordsTotal / RECORDS_PAGE_SIZE))
  const { data: mccStats, loading: mccStatsLoading } = useMCCStats()
  const { data: marketData } = useMarketData()
  const { data: mccPriceData } = useMCCPrice()
  const { data: ecosystemOps } = useEcosystemOperations()
  const { balance: mccData } = useMCC(60_000)
  const { data: wallets, loading: walletsLoading } = useWallets()
  const { startMining, loading: miningLoading } = useMiningFlow() as any

  const [showRecords, setShowRecords] = useState(true)
  const [walletsExpanded, setWalletsExpanded] = useState(false)

  const price = marketData?.price_usd ?? 0
  const basePrice = (mccPriceData as any)?.base_price ?? (mccPriceData as any)?.price_usd ?? (mccPriceData as any)?.price ?? 0
  const miningPrice = basePrice > 0 ? basePrice * 4 : 0

  const epoch = (ecosystemOps as any)?.epoch
  const currentEpochNum = epoch?.current_epoch ?? 0
  const epochYield = epoch?.epoch_yield ?? 0
  const miningVaultMcc = epoch?.mining_vault_mcc ?? 0

  const fmtCompact = (n: number) => {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
    return n.toFixed(0)
  }
  const s = mccStats as any
  const totalMinted = s?.circulating_supply ?? 0
  const currentPhase = s?.current_phase ?? 0
  const miningRate = s?.current_mining_rate ?? 0
  const nextHalving = s?.next_halving_at ?? 100_000_000
  const displayPhase = currentPhase + 1
  const halvingRatio = 2 ** (displayPhase - 1)
  const halvingProgress = nextHalving > 0 ? ((totalMinted % 100_000_000) / 100_000_000) * 100 : 0
  const mccBalance = (mccData as any)?.balance ?? 0
  const balanceWallets: any[] = Array.isArray((mccData as any)?.wallets) ? (mccData as any).wallets : []
  const balanceByAddress = new Map<string, number>(
    balanceWallets.map((b: any) => [b.wallet_address, Number(b.balance ?? 0)])
  )

  const metaWallets: any[] = Array.isArray(wallets) ? wallets : []
  const walletList: any[] = (metaWallets.length > 0 ? metaWallets : balanceWallets).map((w: any) => ({
    ...w,
    mcc_balance: balanceByAddress.get(w.wallet_address) ?? Number(w.balance ?? w.mcc_balance ?? 0),
  }))
  const primaryWallet = walletList.find((w: any) => w.is_primary)
  const primaryAddress = primaryWallet?.wallet_address ?? null
  const totalBalance = walletList.length > 0 ? walletList.reduce((sum: number, w: any) => sum + (w.mcc_balance ?? 0), 0) : mccBalance

  const handleMine = useCallback(async () => {
    if (!primaryAddress) return
    try {
      await startMining({ amount: 1, wallet_address: primaryAddress })
      refreshRecords()
    } catch (err) {
      
    }
  }, [startMining, primaryAddress, refreshRecords])

  const isLoading = mccStatsLoading && !mccStats

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">{t('title', 'Mining')}</h1>
          <p className="text-sm text-neutral-400 mt-1">{t('subtitle', 'MCC minting via X402 protocol')}</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Spinner className="mr-3" />
          <span className="text-neutral-400 text-sm">{t('loadingMintData', 'Loading mining data...')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">

      {}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">{t('title', 'Mining')}</h1>
          <p className="text-sm text-neutral-400 mt-1">{t('subtitle', 'MCC minting via X402 protocol')}</p>
        </div>
        <button
          onClick={() => refreshRecords()}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent rounded-md transition-colors"
        >
          <IconRefresh className={mccStatsLoading ? 'animate-spin' : ''} />
          {t('refresh', 'Refresh')}
        </button>
      </div>

      {}
      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 blockchain-card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
          <div className="space-y-3">
            {}
            <div className="flex items-center gap-3">
              <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded font-medium">{t('x402Protocol', 'X402 Protocol')}</span>
              <span className="text-xs bg-cyan-400/20 text-cyan-400 px-2 py-0.5 rounded font-medium">Solana Mainnet</span>
            </div>

            {}
            <div>
              <div className="text-xs text-[#5EEAD4] tracking-widest uppercase mb-1">MINING_PRICE</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-cyan-400 font-mono">
                  1 MCC = {miningPrice > 0 ? fmt(miningPrice, 4) : '--'} USD
                </span>
                <span className="text-xs bg-cyan-400/20 text-cyan-400 px-1.5 py-0.5 rounded">
                  base × 4
                </span>
              </div>
            </div>

            {}
            <div className="flex items-start gap-4 text-xs text-neutral-500">
              <div className="flex items-center gap-1.5">
                <IconShield className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                <span>{t('stablecoinDirectDesc', 'Stablecoin direct payment')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <IconZap className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                <span>{t('instantMintDesc', 'Instant on-chain minting')}</span>
              </div>
            </div>
          </div>

          {}
          <button
            onClick={handleMine}
            disabled={miningLoading || !primaryAddress}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium bg-cyan-700 hover:bg-cyan-600 text-white rounded-md whitespace-nowrap flex-shrink-0 disabled:opacity-50 transition-colors"
          >
            <IconZap className="w-5 h-5" />
            {miningLoading ? t('processing', 'Processing...') : t('startMinting', 'Start Minting')}
          </button>
        </div>

        {}
        <div className="border-t border-neutral-700 pt-4 mb-4">
          <div className="text-xs text-[#5EEAD4] tracking-widest uppercase uppercase mb-3">MINING STATISTICS</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 blockchain-sub-card">
            <div className="flex items-center gap-2 mb-2">
              <IconTrendingUp />
              <span className="text-xs text-[#5EEAD4] tracking-widest uppercase">CURRENT EPOCH</span>
            </div>
            <div className="text-2xl font-bold text-cyan-400 font-mono">#{currentEpochNum}</div>
            <div className="text-xs text-neutral-500 mt-1">{fmtCompact(epochYield)} MCC / epoch</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-3 blockchain-sub-card">
            <div className="flex items-center gap-2 mb-2">
              <IconCoins />
              <span className="text-xs text-[#5EEAD4] tracking-widest uppercase">HALVING PHASE {displayPhase}</span>
            </div>
            <div className="text-2xl font-bold text-white font-mono">{halvingRatio}:1</div>
            <div className="text-xs text-neutral-500 mt-1 tabular-nums">{fmtCompact(totalMinted)} / {fmtCompact(nextHalving)} MCC</div>
            <div className="mt-2 h-1.5 bg-neutral-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 rounded-full transition-all"
                style={{ width: `${Math.min(halvingProgress, 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-3 blockchain-sub-card">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-[#5EEAD4] tracking-widest uppercase">mining_rate</span>
            </div>
            <div className="text-2xl font-bold text-cyan-400 font-mono">{miningRate > 0 ? `${miningRate}:1` : '--'}</div>
            <div className="text-xs text-neutral-500 mt-1">USD to MCC ratio</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-3 blockchain-sub-card">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-[#5EEAD4] tracking-widest uppercase">MINING VAULT</span>
            </div>
            <div className="text-2xl font-bold text-white font-mono">{fmtCompact(miningVaultMcc)}</div>
            <div className="text-xs text-neutral-500 mt-1">MCC available to mine</div>
          </div>
        </div>
      </div>

      {}
      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 blockchain-card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <IconWallet className="text-white" />
            <span className="text-sm text-neutral-300 tracking-wider font-medium">{t('onChainBalance', 'On-Chain Balance')}</span>
            {walletList.length > 0 && (
              <span className="inline-flex items-center gap-1 text-xs bg-white/20 text-white px-1.5 py-0.5 rounded">
                <IconCheckCircle />
                {walletList.length} {t('walletsCount', 'wallets')}
              </span>
            )}
          </div>
        </div>
        <p className="text-neutral-500 text-xs mb-4">
          {t('onChainBalanceDesc', 'Real-time on-chain MCC balance across all bound wallets')}
        </p>

        {walletsLoading && walletList.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Spinner className="mr-2" />
            <span className="text-neutral-400 text-sm">{t('loadingOnChainBalance', 'Loading on-chain balance...')}</span>
          </div>
        ) : walletList.length === 0 ? (
          
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 blockchain-sub-card">
            <div className="text-xs text-[#5EEAD4] tracking-widest uppercase mb-1 font-mono">total_balance</div>
            <div className="text-2xl font-bold font-mono text-white">{fmt(mccBalance, 3)} MCC</div>
            {primaryAddress && (
              <div className="text-neutral-500 text-xs mt-1 font-mono">{primaryAddress.slice(0, 8)}...{primaryAddress.slice(-4)}</div>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 blockchain-sub-card">
                <div className="text-xs text-[#5EEAD4] tracking-widest uppercase mb-1 font-mono">total_on_chain</div>
                <div className="text-2xl font-bold font-mono text-white">
                  {fmt(totalBalance)} MCC
                </div>
                <div className="text-neutral-500 text-xs mt-1">{walletList.length} {t('walletsTotal', 'wallets total')}</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 blockchain-sub-card">
                <div className="text-xs text-[#5EEAD4] tracking-widest uppercase mb-1 font-mono">primary_wallet</div>
                <div className="text-2xl font-bold font-mono text-white">
                  {primaryWallet ? fmt(primaryWallet.mcc_balance ?? 0) : '--'}
                </div>
                <div className="text-neutral-500 text-xs mt-1 truncate font-mono">
                  {primaryAddress ? `${primaryAddress.slice(0, 6)}...${primaryAddress.slice(-4)}` : t('noPrimaryWallet', 'No primary wallet')}
                </div>
              </div>
            </div>

            {}
            <button
              onClick={() => setWalletsExpanded(!walletsExpanded)}
              className="flex items-center gap-2 text-xs text-neutral-400 hover:text-cyan-400 transition-colors mb-2"
            >
              {walletsExpanded ? <IconChevronUp /> : <IconChevronDown />}
              {walletsExpanded ? t('collapse', 'Collapse') : t('expand', 'Expand')} ({walletList.length})
            </button>

            {walletsExpanded && (
              <div className="space-y-2">
                {walletList.map((w: any) => (
                  <div
                    key={w.wallet_address}
                    className="flex items-center justify-between px-3 p-2 bg-neutral-800 rounded hover:bg-neutral-700 text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <IconWallet className="w-3 h-3 text-neutral-500 flex-shrink-0" />
                      <a
                        href={`https://solscan.io/account/${w.wallet_address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-300 hover:text-white truncate font-mono"
                      >
                        {w.wallet_address.slice(0, 8)}...{w.wallet_address.slice(-6)}
                      </a>
                      {w.is_primary && (
                        <span className="px-1.5 py-0.5 bg-cyan-400/20 text-cyan-400 rounded text-[10px] flex-shrink-0">{t('primaryLabel', 'Primary')}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                      <span className="text-white font-mono font-medium">{fmt(w.mcc_balance ?? 0)} MCC</span>
                      <a
                        href={`https://solscan.io/account/${w.wallet_address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-600 hover:text-neutral-400"
                      >
                        <IconExternalLink />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {}
      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl blockchain-card">
        <div className="p-6">
          <button
            onClick={() => setShowRecords(!showRecords)}
            className="w-full flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <IconHistory />
              <span className="text-sm text-neutral-300 tracking-wider font-medium">{t('mintRecords', 'Mining Records')}</span>
              {recordsTotal > 0 && (
                <span className="text-xs bg-neutral-500/20 text-neutral-300 px-1.5 py-0.5 rounded">
                  {recordsTotal} {t('records', 'records')}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-neutral-400 group-hover:text-cyan-400 transition-colors">
              {showRecords ? (
                <>{t('collapse', 'Collapse')} <IconChevronUp /></>
              ) : (
                <>{t('expand', 'Expand')} <IconChevronDown /></>
              )}
            </div>
          </button>

          {showRecords && (
            <div className="mt-4 pt-4 border-t border-neutral-700">
              <p className="text-neutral-500 text-xs mb-4">
                {t('allRecordsDesc', 'All x402 non-custodial minting transaction records')}
              </p>

              {recordsLoading ? (
                <div className="flex items-center justify-center py-8"><Spinner /></div>
              ) : records.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-neutral-400 text-xs border-b border-neutral-700">
                        <th className="text-left py-2 font-normal">{t('colTime', 'Time')}</th>
                        <th className="text-right py-2 font-normal">{t('payment', 'Paid')}</th>
                        <th className="text-right py-2 font-normal">{t('earnedMcc', 'Minted')}</th>
                        <th className="text-right py-2 font-normal">{t('colStatus', 'Status')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((r: any, i: number) => (
                        <tr key={r.tx_signature ?? `${recordsPage}-${i}`} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                          <td className="py-3 text-neutral-300 font-mono text-xs">
                            {formatDateTime(r.mined_at ?? r.created_at ?? r.timestamp)}
                          </td>
                          <td className="py-3 text-right text-white font-mono">
                            {fmt(r.paid_amount ?? r.payment_amount ?? r.stablecoin_amount ?? 0)} {r.stablecoin ?? r.payment_type ?? 'USDC'}
                          </td>
                          <td className="py-3 text-right text-cyan-400 font-mono">
                            +{fmt(r.mcc_amount ?? r.minted ?? 0)} MCC
                          </td>
                          <td className="py-3 text-right">
                            <a
                              href={r.tx_signature ? `https://solscan.io/tx/${r.tx_signature}` : undefined}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs px-1.5 py-0.5 rounded bg-white/20 text-white hover:bg-cyan-400/30 hover:text-cyan-200 transition-colors"
                            >
                              {t('completed', 'confirmed')}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-500 text-sm">
                  {t('noMintRecords', 'No mining records yet')}
                </div>
              )}

              {recordsTotal > RECORDS_PAGE_SIZE && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-800 text-xs">
                  <span className="text-neutral-500 font-mono">
                    Page {recordsPage} / {recordsTotalPages} · {recordsTotal} total
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setRecordsPage(p => Math.max(1, p - 1))}
                      disabled={recordsPage <= 1 || recordsLoading}
                      className="px-3 py-1 border border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      ‹ {t('prevPage', 'Prev')}
                    </button>
                    <button
                      onClick={() => setRecordsPage(p => Math.min(recordsTotalPages, p + 1))}
                      disabled={recordsPage >= recordsTotalPages || recordsLoading}
                      className="px-3 py-1 border border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      {t('nextPage', 'Next')} ›
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {}
      {s?.pool_mcc_bought != null && (
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 blockchain-card">
          <div className="text-xs text-[#5EEAD4] tracking-widest uppercase uppercase mb-3">POOL STATUS</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 blockchain-sub-card">
              <div className="text-[10px] text-[#5EEAD4] tracking-widest uppercase font-mono">total_market_made</div>
              <div className="text-lg font-bold text-white font-mono">{fmt(s.pool_mcc_bought ?? 0)}</div>
              <div className="text-xs text-neutral-500 mt-1">MCC bought via CPMM</div>
            </div>
            {s?.pool_usdc_balance != null && (
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 blockchain-sub-card">
                <div className="text-[10px] text-[#5EEAD4] tracking-widest uppercase font-mono">stablecoin_pool</div>
                <div className="text-lg font-bold text-white font-mono">
                  ${fmt((s.pool_usdc_balance ?? 0) + (s.pool_usdt_balance ?? 0))}
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  USDT {fmt(s.pool_usdt_balance ?? 0)} / USDC {fmt(s.pool_usdc_balance ?? 0)}
                </div>
              </div>
            )}
            {s?.pool_tvl != null && (
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 blockchain-sub-card">
                <div className="text-[10px] text-[#5EEAD4] tracking-widest uppercase font-mono">tvl</div>
                <div className="text-lg font-bold text-white font-mono">${fmt(s.pool_tvl ?? 0)}</div>
                <div className="text-xs text-neutral-500 mt-1">Total value locked</div>
              </div>
            )}
          </div>
        </div>
      )}

      {}
      {stats && (
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 blockchain-card">
          <div className="text-xs text-[#5EEAD4] tracking-widest uppercase uppercase mb-4 font-mono">MY_MINING_STATS</div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 blockchain-sub-card">
              <div className="text-[10px] text-[#5EEAD4] tracking-widest uppercase font-mono">total_mined</div>
              <div className="text-lg font-bold text-white font-mono">{fmt(stats.total_mined ?? 0)} MCC</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 blockchain-sub-card">
              <div className="text-[10px] text-[#5EEAD4] tracking-widest uppercase font-mono">total_paid</div>
              <div className="text-lg font-bold text-white font-mono">{fmt(stats.total_paid ?? 0)} USDC</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 blockchain-sub-card">
              <div className="text-[10px] text-[#5EEAD4] tracking-widest uppercase font-mono">mining_count</div>
              <div className="text-lg font-bold text-white font-mono">{stats.mining_count ?? 0}</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 blockchain-sub-card">
              <div className="text-[10px] text-[#5EEAD4] tracking-widest uppercase font-mono">active_days</div>
              <div className="text-lg font-bold text-white font-mono">{stats.active_days_30d ?? 0}</div>
            </div>
          </div>
        </div>
      )}

      {}
      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 blockchain-card">
        <div className="flex items-start gap-2 text-neutral-400 text-sm">
          <IconShield className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
          <span>{t('securityNote', 'All transactions are executed on-chain via X402 protocol. Your private keys never leave your wallet. Microcosm uses non-custodial minting with atomic on-chain verification.')}</span>
        </div>
      </div>
    </div>
  )
}
