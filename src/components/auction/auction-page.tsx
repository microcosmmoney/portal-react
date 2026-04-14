'use client'

import { useState, useMemo, useCallback } from 'react'
import { useTranslations } from '../../i18n-context'
import { useAuctions, useMyBids, useAuctionBid, useAuctionHistory } from '@microcosmmoney/auth-react'

const IconGavel = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m14 13-7.5 7.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L11 10" />
    <path d="m16 16 6-6" />
    <path d="m8 8 6-6" />
    <path d="m9 7 8 8" />
    <path d="m21 11-8-8" />
  </svg>
)

const IconFlame = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
)

const IconCrown = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
    <path d="M5 21h14" />
  </svg>
)

const IconTimer = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="10" x2="14" y1="2" y2="2" />
    <line x1="12" x2="12" y1="14" y2="10" />
    <circle cx="12" cy="14" r="8" />
  </svg>
)

const IconShield = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
  </svg>
)

const IconClock = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const IconLock = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const IconRefresh = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </svg>
)

const IconChevronDown = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
)

const IconChevronUp = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m18 15-6-6-6 6" />
  </svg>
)

const IconBarChart = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" />
    <path d="M13 17V9" />
    <path d="M18 17V5" />
    <path d="M8 17v-3" />
  </svg>
)

const IconAward = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
    <circle cx="12" cy="8" r="6" />
  </svg>
)

const IconUsers = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const IconZap = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
  </svg>
)

const IconArrowUpRight = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 7h10v10" />
    <path d="M7 17 17 7" />
  </svg>
)

const IconBuilding = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" /><path d="M16 6h.01" />
    <path d="M12 6h.01" /><path d="M12 10h.01" />
    <path d="M12 14h.01" /><path d="M16 10h.01" />
    <path d="M16 14h.01" /><path d="M8 10h.01" />
    <path d="M8 14h.01" />
  </svg>
)

const IconGrid = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M3 9h18" /><path d="M3 15h18" />
    <path d="M9 3v18" /><path d="M15 3v18" />
  </svg>
)

const IconMap = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
    <path d="M15 5.764v15" /><path d="M9 3.236v15" />
  </svg>
)

const IconGlobe = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
)

const UNIT_ICONS: Record<string, React.ReactNode> = {
  station: <IconBuilding className="w-4 h-4" />,
  matrix: <IconGrid className="w-4 h-4" />,
  sector: <IconMap className="w-4 h-4" />,
  system: <IconGlobe className="w-4 h-4" />,
}

const UNIT_LABELS: Record<string, string> = {
  station: 'Station', matrix: 'Matrix', sector: 'Sector', system: 'System',
}

const BADGE_VARIANTS: Record<string, string> = {
  success: 'bg-white/20 text-white border border-white/30',
  warning: 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30',
  error: 'bg-red-500/20 text-red-500 border border-red-500/30',
  info: 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30',
  default: 'bg-neutral-500/20 text-neutral-300 border border-neutral-600',
}

const BID_STATUS_MAP: Record<string, { label: string; variant: string }> = {
  active: { label: 'Leading', variant: 'success' },
  outbid: { label: 'Outbid', variant: 'warning' },
  won: { label: 'Won', variant: 'success' },
  lost: { label: 'Lost', variant: 'error' },
  refunded: { label: 'Refunded', variant: 'default' },
}

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

function Badge({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={cn('inline-flex items-center gap-0.5 text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap', className)}>
      {children}
    </span>
  )
}

function TimeRemaining({ endTime, className }: { endTime: string; className?: string }) {
  const diff = new Date(endTime).getTime() - Date.now()
  if (diff <= 0) return <span className={className}>Ended</span>
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const parts: string[] = []
  if (d > 0) parts.push(`${d}d`)
  parts.push(`${h}h`)
  parts.push(`${m}m`)
  return <span className={className}>{parts.join(' ')}</span>
}

function FormattedDateTime({ dateTime, className }: { dateTime: string; className?: string }) {
  if (!dateTime) return <span className={className}>-</span>
  const d = new Date(dateTime)
  return <span className={className}>{d.toLocaleDateString()} {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
}

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative bg-neutral-900 border border-neutral-700 rounded-lg max-w-[calc(100vw-1rem)] 2xs:max-w-sm sm:max-w-md w-full mx-2 2xs:mx-4 font-mono max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export interface MicrocosmAuctionPageProps {
  basePath?: string
  onNavigate?: (path: string) => void
}

export function MicrocosmAuctionPage({ basePath = '', onNavigate }: MicrocosmAuctionPageProps) {
  const t = useTranslations('auctionsDash')
  const { data: auctions, loading, refresh: refreshAuctions } = useAuctions({ refetchInterval: 30000 })
  const { data: myBids, refresh: refreshBids } = useMyBids({ refetchInterval: 30000 })
  const { data: history, refresh: refreshHistory } = useAuctionHistory()
  const { placeBid, loading: bidLoading } = useAuctionBid()

  const [bidDialogOpen, setBidDialogOpen] = useState(false)
  const [selectedAuction, setSelectedAuction] = useState<any>(null)
  const [bidAmount, setBidAmount] = useState('')
  const [showMyBids, setShowMyBids] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const auctionList: any[] = Array.isArray(auctions) ? auctions : []
  const bidsList: any[] = Array.isArray(myBids) ? myBids : []
  const historyList: any[] = Array.isArray(history) ? history : []

  const stats = useMemo(() => {
    const totalBids = auctionList.reduce((s: number, a: any) => s + (a.bid_count || 0), 0)
    const highestBid = auctionList.length > 0 ? Math.max(...auctionList.map((a: any) => a.current_price ?? 0)) : 0
    const totalVolume = auctionList.reduce((s: number, a: any) => s + (a.current_price ?? 0), 0)
    const myLeading = bidsList.filter((b: any) => b.status === 'active').length
    return { totalBids, highestBid, totalVolume, myLeading }
  }, [auctionList, bidsList])

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    await Promise.all([refreshAuctions(), refreshBids(), refreshHistory()])
    setRefreshing(false)
  }, [refreshAuctions, refreshBids, refreshHistory])

  const openBidDialog = (auction: any) => {
    setSelectedAuction(auction)
    setBidAmount(((auction.current_price ?? 0) + (auction.bid_increment ?? 0)).toString())
    setBidDialogOpen(true)
    setActionError(null)
  }

  const handlePlaceBid = async () => {
    if (!selectedAuction) return
    const amount = parseFloat(bidAmount)
    if (isNaN(amount) || amount <= 0) { setActionError(t('invalidBidAmount', 'Enter a valid bid amount')); return }
    const minBid = (selectedAuction.current_price ?? 0) + (selectedAuction.bid_increment ?? 0)
    if (amount < minBid) { setActionError(t('minBidError', `Minimum bid is ${minBid.toLocaleString()} MCC`, { amount: minBid.toLocaleString() })); return }
    try {
      setActionError(null)
      await placeBid(selectedAuction.auction_id ?? selectedAuction.id, amount)
      setBidDialogOpen(false)
      setBidAmount('')
      setSelectedAuction(null)
      handleRefresh()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : t('bidFailed', 'Bid failed'))
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <span className="inline-block w-8 h-8 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-2 py-3 space-y-2 2xs:px-3 2xs:py-4 2xs:space-y-3 sm:px-6 sm:py-6 sm:space-y-6 font-mono">
      {}
      <div className="flex items-center justify-between flex-wrap gap-1.5 2xs:gap-2">
        <div className="min-w-0">
          <h1 className="text-base 2xs:text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-wider">{t('title', 'Territory Auctions')}</h1>
          <p className="text-[10px] 2xs:text-xs sm:text-sm text-neutral-400">{t('subtitle', 'Bid for magistrate positions across the Microcosm')}</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-2 py-1 2xs:px-3 2xs:py-1.5 text-xs 2xs:text-sm border border-neutral-700 rounded text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 disabled:opacity-50 bg-transparent whitespace-nowrap"
        >
          <IconRefresh className={cn('w-3 h-3 2xs:w-4 2xs:h-4', refreshing && 'animate-spin')} />
          {t('refresh', 'Refresh')}
        </button>
      </div>

      {actionError && (
        <div className="p-2 2xs:p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs 2xs:text-sm">{actionError}</div>
      )}

      {}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg">
        <div className="p-2 2xs:p-3 sm:p-4 md:p-6">
          <div className="grid grid-cols-2 xs:grid-cols-3 lg:grid-cols-4 gap-1.5 2xs:gap-2 sm:gap-3">
            <div className="bg-neutral-800 rounded p-2 2xs:p-2.5 sm:p-4 min-w-0">
              <div className="text-[8px] 2xs:text-[9px] sm:text-[10px] text-neutral-400 tracking-wider mb-1 truncate">{t('ongoing', 'Ongoing')}</div>
              <div className="text-lg 2xs:text-xl xs:text-2xl sm:text-3xl font-bold text-cyan-400 font-mono truncate">{auctionList.length}</div>
              <div className="text-[8px] 2xs:text-[9px] sm:text-[10px] text-neutral-500 truncate">{t('auctionsCount', 'auctions')}</div>
            </div>
            <div className="bg-neutral-800 rounded p-2 2xs:p-2.5 sm:p-4 min-w-0">
              <div className="text-[8px] 2xs:text-[9px] sm:text-[10px] text-neutral-400 tracking-wider mb-1 truncate">{t('totalBids', 'Total Bids')}</div>
              <div className="text-lg 2xs:text-xl xs:text-2xl sm:text-3xl font-bold text-white font-mono truncate">{stats.totalBids}</div>
              <div className="text-[8px] 2xs:text-[9px] sm:text-[10px] text-neutral-500 truncate">{t('bidsCount', 'bids')}</div>
            </div>
            <div className="bg-neutral-800 rounded p-2 2xs:p-2.5 sm:p-4 min-w-0">
              <div className="text-[8px] 2xs:text-[9px] sm:text-[10px] text-neutral-400 tracking-wider mb-1 truncate">{t('highestBid', 'Highest Bid')}</div>
              <div className="text-lg 2xs:text-xl xs:text-2xl sm:text-3xl font-bold text-cyan-400 font-mono truncate">{stats.highestBid > 0 ? stats.highestBid.toLocaleString() : '--'}</div>
              <div className="text-[8px] 2xs:text-[9px] sm:text-[10px] text-neutral-500">MCC</div>
            </div>
            <div className="bg-neutral-800 rounded p-2 2xs:p-2.5 sm:p-4 min-w-0">
              <div className="text-[8px] 2xs:text-[9px] sm:text-[10px] text-neutral-400 tracking-wider mb-1 truncate">{t('totalLocked', 'Total Locked')}</div>
              <div className="text-lg 2xs:text-xl xs:text-2xl sm:text-3xl font-bold text-cyan-400 font-mono truncate">{stats.totalVolume > 0 ? stats.totalVolume.toLocaleString() : '--'}</div>
              <div className="text-[8px] 2xs:text-[9px] sm:text-[10px] text-neutral-500">MCC</div>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg">
        <div className="p-2 2xs:p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between mb-2 2xs:mb-3 sm:mb-4 flex-wrap gap-1.5">
            <div className="flex items-center gap-1.5 2xs:gap-2 min-w-0">
              <IconFlame className="w-3 h-3 2xs:w-4 2xs:h-4 text-cyan-400 shrink-0" />
              <span className="text-xs 2xs:text-sm font-medium text-neutral-300 tracking-wider truncate">{t('activeAuctions', 'Active Auctions')}</span>
              <span className="text-[10px] 2xs:text-xs text-neutral-500">({auctionList.length})</span>
            </div>
            <div className="hidden 2xs:flex items-center gap-2 text-[10px] 2xs:text-xs text-neutral-500">
              <IconClock className="w-3 h-3" />
              <span>{t('autoRefresh', 'Auto-refresh 30s')}</span>
            </div>
          </div>

          {auctionList.length === 0 ? (
            <div className="text-center py-8 sm:py-16">
              <IconGavel className="w-8 h-8 sm:w-10 sm:h-10 text-neutral-700 mx-auto mb-2 sm:mb-3" />
              <div className="text-neutral-500 text-xs 2xs:text-sm mb-2">{t('noActiveAuctions', 'No active auctions')}</div>
              <div className="text-neutral-500 text-[10px] 2xs:text-xs max-w-md mx-auto px-2">
                Auctions are held for magistrate positions. When a territory opens for bidding, it will appear here.
              </div>
            </div>
          ) : (
            <div className="space-y-2 2xs:space-y-3 sm:space-y-4">
              {auctionList.map((auction: any) => {
                const unitType = auction.unit_type || 'station'
                const currentPrice = auction.current_price ?? auction.starting_price ?? 0
                const startingPrice = auction.starting_price ?? 0
                const bidIncrement = auction.bid_increment ?? 0
                const minNextBid = currentPrice + bidIncrement
                const priceUp = startingPrice > 0
                  ? ((currentPrice - startingPrice) / startingPrice * 100).toFixed(1)
                  : '0'
                const isHot = (auction.bid_count || 0) >= 5

                return (
                  <div
                    key={auction.auction_id ?? auction.id}
                    className={cn(
                      'bg-neutral-800 border rounded p-2 2xs:p-3 sm:p-4 md:p-5 hover:border-cyan-400/50 transition-colors',
                      isHot ? 'border-cyan-400/30' : 'border-neutral-700'
                    )}
                  >
                    {}
                    <div className="flex items-start justify-between mb-2 2xs:mb-3 sm:mb-4 gap-2">
                      <div className="flex items-center gap-1.5 2xs:gap-2 sm:gap-3 min-w-0 flex-1">
                        <span className="text-cyan-400 shrink-0">{UNIT_ICONS[unitType] || UNIT_ICONS.station}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 2xs:gap-2 flex-wrap">
                            <span className="text-white font-bold text-xs 2xs:text-sm sm:text-base truncate">
                              {auction.unit_name || `Territory #${auction.unit_id || auction.auction_id || auction.id}`}
                            </span>
                            {isHot && (
                              <Badge className={BADGE_VARIANTS.warning}>
                                <IconFlame className="w-3 h-3" />{t('hot', 'Hot')}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1 2xs:gap-1.5 mt-0.5 flex-wrap">
                            <Badge className={BADGE_VARIANTS.info}>{UNIT_LABELS[unitType] || 'Station'}</Badge>
                            <Badge className={`${BADGE_VARIANTS.default} hidden 2xs:inline-flex`}>
                              {auction.auction_type === 'first' ? t('firstAuction', 'First Auction') : auction.auction_type === 'second' ? t('secondAuction', 'Second Auction') : 'Auction'}
                            </Badge>
                            <Badge className={BADGE_VARIANTS.success}>{t('active', 'Active')}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 2xs:gap-2 bg-neutral-800 border border-neutral-700 rounded px-2 py-1 2xs:px-3 2xs:py-1.5 text-[10px] 2xs:text-xs sm:text-sm shrink-0 whitespace-nowrap">
                        <IconClock className="w-3 h-3 2xs:w-3.5 2xs:h-3.5 text-cyan-400" />
                        <TimeRemaining endTime={auction.end_time} className="text-cyan-400 font-bold font-mono" />
                      </div>
                    </div>

                    {}
                    <div className="grid grid-cols-2 xs:grid-cols-3 lg:grid-cols-4 gap-1.5 2xs:gap-2 sm:gap-3 mb-2 sm:mb-3 md:mb-4">
                      <div className="bg-neutral-800 border border-neutral-700 rounded p-2 2xs:p-2.5 sm:p-3 min-w-0">
                        <div className="text-[8px] 2xs:text-[9px] sm:text-[10px] text-neutral-400 tracking-wider mb-1 truncate">{t('startingPrice', 'Starting Price')}</div>
                        <div className="text-neutral-300 font-mono text-xs 2xs:text-sm sm:text-base truncate">{startingPrice.toLocaleString()}</div>
                        <div className="text-[8px] 2xs:text-[9px] sm:text-[10px] text-neutral-500">MCC</div>
                      </div>
                      <div className="bg-neutral-900 border border-neutral-700 rounded p-2 2xs:p-2.5 sm:p-3 min-w-0">
                        <div className="text-[8px] 2xs:text-[9px] sm:text-[10px] text-neutral-400 tracking-wider mb-1 truncate">{t('currentHighest', 'Current Highest')}</div>
                        <div className="text-lg 2xs:text-xl xs:text-2xl sm:text-3xl font-bold text-cyan-400 font-mono truncate">{currentPrice.toLocaleString()}</div>
                        <div className="flex items-center gap-1 text-[8px] 2xs:text-[9px] sm:text-[10px]">
                          <span className="text-neutral-500">MCC</span>
                          {Number(priceUp) > 0 && (
                            <span className="text-white flex items-center">
                              <IconArrowUpRight className="w-2.5 h-2.5 2xs:w-3 2xs:h-3" />+{priceUp}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="bg-neutral-800 border border-neutral-700 rounded p-2 2xs:p-2.5 sm:p-3 min-w-0">
                        <div className="text-[8px] 2xs:text-[9px] sm:text-[10px] text-neutral-400 tracking-wider mb-1 truncate">{t('bidCount', 'Bid Count')}</div>
                        <div className="text-white font-bold font-mono text-xs 2xs:text-sm sm:text-base">{auction.bid_count || 0}</div>
                        <div className="text-[8px] 2xs:text-[9px] sm:text-[10px] text-neutral-500">{t('bidsCount', 'bids')}</div>
                      </div>
                      <div className="bg-neutral-800 border border-neutral-700 rounded p-2 2xs:p-2.5 sm:p-3 min-w-0 hidden xs:block">
                        <div className="text-[8px] 2xs:text-[9px] sm:text-[10px] text-neutral-400 tracking-wider mb-1 truncate">{t('minIncrement', 'Min Increment')}</div>
                        <div className="text-neutral-300 font-mono text-xs 2xs:text-sm sm:text-base truncate">{bidIncrement.toLocaleString()}</div>
                        <div className="text-[8px] 2xs:text-[9px] sm:text-[10px] text-neutral-500">MCC ({'\u2265'}5%)</div>
                      </div>
                    </div>

                    {}
                    <div className="flex items-center justify-between flex-col 2xs:flex-row gap-2 2xs:gap-3">
                      <div className="hidden xs:flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-neutral-500 flex-wrap">
                        <span className="flex items-center gap-1"><IconLock className="w-3 h-3" />{t('deposit50', '50% Deposit')}</span>
                        <span className="flex items-center gap-1"><IconCrown className="w-3 h-3" />{t('winnerMagistrate', 'Winner becomes Magistrate')}</span>
                        <span className="hidden sm:flex items-center gap-1"><IconTimer className="w-3 h-3" />{t('noNewBid24h', 'Settles if no new bid in 24h')}</span>
                      </div>

                      {(auction.status === 'active' || !auction.status) && (
                        <div className="flex items-center gap-1.5 2xs:gap-2 w-full 2xs:w-auto">
                          <button
                            onClick={() => openBidDialog(auction)}
                            className="flex items-center gap-1.5 px-3 py-1.5 2xs:px-4 2xs:py-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded text-xs 2xs:text-sm font-mono whitespace-nowrap flex-1 2xs:flex-initial justify-center"
                          >
                            <IconGavel className="w-3 h-3 2xs:w-4 2xs:h-4" />{t('placeBid', 'Place Bid')}
                          </button>
                          <button
                            onClick={() => openBidDialog(auction)}
                            className="hidden 2xs:flex items-center gap-1.5 px-2 py-1 2xs:px-3 2xs:py-1.5 text-[10px] 2xs:text-xs border border-neutral-700 rounded text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent whitespace-nowrap"
                          >
                            <IconZap className="w-3 h-3" />{minNextBid.toLocaleString()} MCC
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg">
        <div className="p-2 2xs:p-3 sm:p-4 md:p-6">
          <div className="grid grid-cols-1 2xs:grid-cols-2 lg:grid-cols-3 gap-1.5 2xs:gap-2 sm:gap-3">
            <div className="bg-neutral-800 rounded p-2 2xs:p-3 min-w-0">
              <div className="flex items-center gap-1.5 2xs:gap-2 mb-1 2xs:mb-2">
                <IconAward className="w-3 h-3 2xs:w-3.5 2xs:h-3.5 text-cyan-400" />
                <span className="text-[10px] 2xs:text-xs text-neutral-400 tracking-wider truncate">{t('auctionTarget', 'Auction Target')}</span>
              </div>
              <div className="text-xs 2xs:text-sm text-neutral-300 mb-0.5">{t('auctionTargetDesc', 'Territory magistrate positions')}</div>
              <div className="text-[10px] 2xs:text-xs text-neutral-500">{t('auctionTargetDetail', 'Station / Matrix / Sector / System levels')}</div>
            </div>
            <div className="bg-neutral-800 rounded p-2 2xs:p-3 min-w-0">
              <div className="flex items-center gap-1.5 2xs:gap-2 mb-1 2xs:mb-2">
                <IconTimer className="w-3 h-3 2xs:w-3.5 2xs:h-3.5 text-cyan-400" />
                <span className="text-[10px] 2xs:text-xs text-neutral-400 tracking-wider truncate">{t('biddingRules', 'Bidding Rules')}</span>
              </div>
              <div className="text-xs 2xs:text-sm text-neutral-300 mb-0.5">{t('biddingRulesDesc', '50% deposit, ≥5% increment')}</div>
              <div className="text-[10px] 2xs:text-xs text-neutral-500">{t('biddingRulesDetail', '24h with no new bids ends the auction')}</div>
            </div>
            <div className="bg-neutral-800 rounded p-2 2xs:p-3 min-w-0">
              <div className="flex items-center gap-1.5 2xs:gap-2 mb-1 2xs:mb-2">
                <IconUsers className="w-3 h-3 2xs:w-3.5 2xs:h-3.5 text-cyan-400" />
                <span className="text-[10px] 2xs:text-xs text-neutral-400 tracking-wider truncate">{t('participationReq', 'Participation')}</span>
              </div>
              <div className="text-xs 2xs:text-sm text-neutral-300 mb-0.5">{t('participationReqDesc', 'Sufficient MCC balance required')}</div>
              <div className="text-[10px] 2xs:text-xs text-neutral-500">{t('participationReqDetail', 'Miner level or above to participate')}</div>
            </div>
          </div>
        </div>
      </div>

      {}
      {bidsList.length > 0 && (
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg">
          <div className="p-2 2xs:p-3 sm:p-4 md:p-6">
            <div
              onClick={() => setShowMyBids(!showMyBids)}
              className="flex items-center justify-between cursor-pointer gap-2"
            >
              <div className="flex items-center gap-1.5 2xs:gap-2 min-w-0 flex-wrap">
                <IconShield className="w-3 h-3 2xs:w-4 2xs:h-4 text-cyan-400 shrink-0" />
                <span className="text-xs 2xs:text-sm text-neutral-300 tracking-wider">{t('myBids', 'My Bids')}</span>
                <span className="text-[10px] 2xs:text-xs text-neutral-500">{bidsList.length} {t('bidsCount', 'bids')}</span>
                {stats.myLeading > 0 && <Badge className={BADGE_VARIANTS.success}>{stats.myLeading} {t('leading', 'leading')}</Badge>}
              </div>
              <div className="flex items-center gap-4 shrink-0">
                {showMyBids
                  ? <IconChevronUp className="w-4 h-4 text-neutral-500" />
                  : <IconChevronDown className="w-4 h-4 text-neutral-500" />
                }
              </div>
            </div>

            {showMyBids && (
              <div className="mt-2 2xs:mt-3 sm:mt-4 space-y-1.5 2xs:space-y-2">
                {bidsList.length === 0 ? (
                  <div className="text-center py-6 2xs:py-8 text-neutral-500 text-xs 2xs:text-sm">{t('noBidRecords', 'No bid records')}</div>
                ) : bidsList.map((bid: any, idx: number) => {
                  const si = BID_STATUS_MAP[bid.status] || { label: bid.status || 'active', variant: 'default' }
                  return (
                    <div key={bid.bid_id ?? idx} className="flex items-center justify-between bg-neutral-800 border border-neutral-700 rounded p-2 2xs:p-3 hover:bg-neutral-700 transition-colors gap-2">
                      <div className="flex items-center gap-1.5 2xs:gap-2 sm:gap-3 min-w-0 flex-1 flex-wrap">
                        <Badge className={BADGE_VARIANTS[si.variant] || BADGE_VARIANTS.default}>{si.label}</Badge>
                        <span className="text-neutral-300 text-xs 2xs:text-sm truncate">{bid.unit_name || `#${bid.auction_id}`}</span>
                        <span className="text-white text-xs 2xs:text-sm font-bold font-mono whitespace-nowrap">{(bid.bid_amount ?? bid.amount ?? 0).toLocaleString()} MCC</span>
                      </div>
                      <div className="hidden xs:flex items-center gap-3 shrink-0">
                        {bid.created_at && <FormattedDateTime dateTime={bid.created_at} className="text-neutral-500 text-xs font-mono" />}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {}
      {historyList.length > 0 && (
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg">
          <div className="p-2 2xs:p-3 sm:p-4 md:p-6">
            <div
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center justify-between cursor-pointer gap-2"
            >
              <div className="flex items-center gap-1.5 2xs:gap-2 min-w-0 flex-wrap">
                <IconBarChart className="w-3 h-3 2xs:w-4 2xs:h-4 text-neutral-400 shrink-0" />
                <span className="text-xs 2xs:text-sm text-neutral-300 tracking-wider">{t('auctionHistory', 'Auction History')}</span>
                <span className="text-[10px] 2xs:text-xs text-neutral-500">{historyList.length} {t('auctionsCount', 'auctions')}</span>
              </div>
              {showHistory
                ? <IconChevronUp className="w-4 h-4 text-neutral-500 shrink-0" />
                : <IconChevronDown className="w-4 h-4 text-neutral-500 shrink-0" />
              }
            </div>

            {showHistory && (
              <div className="mt-2 2xs:mt-3 sm:mt-4 space-y-1.5 2xs:space-y-2">
                {historyList.map((a: any, idx: number) => (
                  <div key={a.auction_id ?? idx} className="flex items-center justify-between bg-neutral-800 border border-neutral-700 rounded p-2 2xs:p-3 hover:bg-neutral-700 transition-colors gap-2">
                    <div className="flex items-center gap-1.5 2xs:gap-2 sm:gap-3 min-w-0 flex-1">
                      <span className="text-cyan-400 shrink-0">{UNIT_ICONS[a.unit_type || 'station'] || UNIT_ICONS.station}</span>
                      <div className="min-w-0">
                        <div className="text-neutral-300 text-xs 2xs:text-sm truncate">{a.unit_name || `Territory #${a.unit_id || a.auction_id}`}</div>
                        <div className="text-neutral-500 text-[10px] 2xs:text-xs truncate">{UNIT_LABELS[a.unit_type || 'station'] || 'Station'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 2xs:gap-3 sm:gap-4 shrink-0">
                      <div className="text-right">
                        <div className="text-white text-xs 2xs:text-sm font-bold font-mono whitespace-nowrap">{(a.current_price ?? a.final_price ?? 0).toLocaleString()} MCC</div>
                        <div className="text-neutral-500 text-[10px] 2xs:text-xs">{a.bid_count || 0} bids</div>
                      </div>
                      <Badge className={a.status === 'cancelled' ? BADGE_VARIANTS.error : BADGE_VARIANTS.default}>
                        {a.status === 'ended' ? t('ended', 'Ended') : a.status === 'cancelled' ? t('cancelled', 'Cancelled') : t('sold', 'Sold')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {}
      <Modal open={bidDialogOpen} onClose={() => setBidDialogOpen(false)}>
        <div className="p-3 2xs:p-4 sm:p-6 space-y-3 2xs:space-y-4">
          {}
          <div>
            <h3 className="text-white font-mono font-bold flex items-center gap-2 text-sm 2xs:text-base">
              <IconGavel className="w-4 h-4 2xs:w-5 2xs:h-5 text-cyan-400" />{t('bidDialog', 'Place Bid')}
            </h3>
            <p className="text-neutral-400 font-mono text-xs 2xs:text-sm mt-1 truncate">
              {selectedAuction?.unit_name || `Territory #${selectedAuction?.unit_id || selectedAuction?.auction_id || selectedAuction?.id}`}
            </p>
          </div>

          {selectedAuction && (
            <>
              {}
              <div className="flex gap-2 flex-wrap">
                <Badge className={BADGE_VARIANTS.info}>{UNIT_LABELS[selectedAuction.unit_type || 'station'] || 'Station'}</Badge>
                <Badge className={BADGE_VARIANTS.default}>
                  {selectedAuction.auction_type === 'first' ? t('firstAuction', 'First Auction') : selectedAuction.auction_type === 'second' ? t('secondAuction', 'Second Auction') : 'Auction'}
                </Badge>
                <Badge className={BADGE_VARIANTS.warning}>
                  <IconCrown className="w-3 h-3" />{t('winnerMagistrate', 'Winner = Magistrate')}
                </Badge>
              </div>

              {}
              <div className="bg-neutral-800 border border-neutral-700 rounded p-3 2xs:p-4 min-w-0">
                <div className="text-[10px] 2xs:text-xs text-neutral-400 tracking-wider mb-1">{t('currentHighest', 'Current Highest')}</div>
                <div className="text-lg 2xs:text-xl xs:text-2xl sm:text-3xl font-bold text-cyan-400 font-mono break-all">
                  {(selectedAuction.current_price ?? selectedAuction.starting_price ?? 0).toLocaleString()}{' '}
                  <span className="text-xs 2xs:text-sm sm:text-base text-neutral-500">MCC</span>
                </div>
                <div className="text-[10px] 2xs:text-xs text-neutral-500 mt-1 break-all">
                  {selectedAuction.bid_count || 0} bids &middot; Starting price {(selectedAuction.starting_price ?? 0).toLocaleString()} MCC
                </div>
              </div>

              {}
              <div className="flex justify-between items-center p-2 2xs:p-3 bg-neutral-800 rounded border border-neutral-700 text-xs 2xs:text-sm gap-2">
                <span className="text-neutral-400 truncate">{t('minIncrement', 'Min Next Bid')}</span>
                <span className="text-white font-bold font-mono whitespace-nowrap">
                  {((selectedAuction.current_price ?? selectedAuction.starting_price ?? 0) + (selectedAuction.bid_increment ?? 0)).toLocaleString()} MCC
                </span>
              </div>

              {}
              <div>
                <div className="text-[10px] 2xs:text-xs text-neutral-400 tracking-wider mb-1 break-words">
                  {t('bidAmountLabel', 'Bid Amount')} ({t('bidAmountMin', 'min {amount} MCC', { amount: ((selectedAuction.current_price ?? 0) + (selectedAuction.bid_increment ?? 0)).toLocaleString() })})
                </div>
                <input
                  type="number"
                  step={selectedAuction.bid_increment ?? 1}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={t('bidAmountLabel', 'Enter bid amount')}
                  className="w-full bg-neutral-800 border border-neutral-600 text-white placeholder-neutral-400 px-2 py-2 2xs:px-3 2xs:py-2.5 rounded text-xs 2xs:text-sm font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {}
              {bidAmount && !isNaN(parseFloat(bidAmount)) && parseFloat(bidAmount) > 0 && (
                <div className="space-y-1.5 2xs:space-y-2 p-2 2xs:p-3 bg-neutral-800 rounded border border-neutral-700 text-xs 2xs:text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="text-neutral-400 truncate">{t('bidAmountLabel', 'Bid Amount')}:</span>
                    <span className="text-neutral-300 font-mono whitespace-nowrap">{parseFloat(bidAmount).toLocaleString()} MCC</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-neutral-400 truncate">{t('depositLabel', 'Deposit (50%)')}:</span>
                    <span className="text-cyan-400 font-mono whitespace-nowrap">{(parseFloat(bidAmount) * 0.5).toLocaleString()} MCC</span>
                  </div>
                </div>
              )}

              {actionError && (
                <div className="text-red-500 text-[10px] 2xs:text-xs flex items-center gap-1"><IconLock className="w-3 h-3 shrink-0" />{actionError}</div>
              )}
            </>
          )}

          {}
          <div className="flex justify-end gap-2 2xs:gap-3 pt-2">
            <button
              onClick={() => setBidDialogOpen(false)}
              className="px-3 py-1.5 2xs:px-4 2xs:py-2 text-xs 2xs:text-sm border border-neutral-700 rounded text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent whitespace-nowrap"
            >
              {t('cancel', 'Cancel')}
            </button>
            <button
              onClick={handlePlaceBid}
              disabled={bidLoading || !bidAmount}
              className="px-3 py-1.5 2xs:px-4 2xs:py-2 text-xs 2xs:text-sm bg-cyan-700 hover:bg-cyan-600 text-white rounded disabled:opacity-50 font-mono whitespace-nowrap"
            >
              {bidLoading ? 'Processing...' : t('confirmBid', 'Confirm Bid')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
