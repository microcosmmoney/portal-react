// AI-generated · AI-managed · AI-maintained
'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useWallet } from '../../contexts/WalletContext'
import { getActiveAuctions, getMyBids, getAuctionHistory, placeBid, createAuction, refundDeposit } from '../../lib/api-service'
import type { Auction, Bid, UnitType } from '../../lib/types/api'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { toast } from 'sonner'
import {
  Clock, Gavel, Coins, TrendingUp, Plus, History, Lock, Crown, Building2,
  Grid3x3, Map, Globe, Users, ArrowUpRight, Timer, Award,
  ChevronDown, ChevronUp, RefreshCw, Flame, Zap, Shield, BarChart3, Loader2
} from 'lucide-react'
import { TimeRemaining, FormattedDateTime } from '../ui/time-remaining'
import { cn } from '../../lib/utils'
import { useTranslations } from 'next-intl'

const UNIT_ICONS: Record<string, React.ReactNode> = {
  station: <Building2 className="w-4 h-4" />,
  matrix: <Grid3x3 className="w-4 h-4" />,
  sector: <Map className="w-4 h-4" />,
  system: <Globe className="w-4 h-4" />,
}

// UNIT_LABELS moved to component scope for i18n

const BADGE_VARIANTS: Record<string, string> = {
  success: 'bg-white/20 text-white border border-white/30',
  warning: 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30',
  error: 'bg-red-500/20 text-red-500 border border-red-500/30',
  info: 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30',
  default: 'bg-neutral-500/20 text-neutral-300 border border-neutral-600',
}

// BID_STATUS_MAP moved to component scope for i18n

export default function AuctionsPage() {
  const t = useTranslations('auctionsDash')
  const { user } = useAuth()

  const UNIT_LABELS: Record<string, string> = {
    station: t('station'), matrix: t('matrix'), sector: t('sector'), system: t('system'),
  }

  const BID_STATUS_MAP: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'default' }> = {
    active: { label: t('bidLeading'), variant: 'success' },
    outbid: { label: t('bidOutbid'), variant: 'warning' },
    won: { label: t('bidWon'), variant: 'success' },
    lost: { label: t('bidLost'), variant: 'error' },
    refunded: { label: t('bidRefunded'), variant: 'default' },
  }
  const { availableBalance, lockedBalance, loading: walletLoading, refreshBalance } = useWallet()

  const [auctions, setAuctions] = useState<Auction[]>([])
  const [myBids, setMyBids] = useState<Bid[]>([])
  const [historyAuctions, setHistoryAuctions] = useState<Auction[]>([])
  const [loading, setLoading] = useState(true)
  const [showHistory, setShowHistory] = useState(false)
  const [showMyBids, setShowMyBids] = useState(false)

  const [isBidDialogOpen, setIsBidDialogOpen] = useState(false)
  const [isCreateAuctionDialogOpen, setIsCreateAuctionDialogOpen] = useState(false)
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null)
  const [bidAmount, setBidAmount] = useState('')
  const [createForm, setCreateForm] = useState({
    unit_id: '', unit_type: 'station' as UnitType, auction_type: 'first' as 'first' | 'second',
    starting_price: '', reserve_price: '', bid_increment: '', end_time: '',
  })

  const loadAuctions = async () => {
    try {
      const response = await getActiveAuctions()
      if (response.success && response.data && Array.isArray(response.data)) setAuctions(response.data)
      else setAuctions([])
    } catch { setAuctions([]) } finally { setLoading(false) }
  }

  const loadMyBids = async () => {
    if (!user) return
    try {
      const response = await getMyBids()
      if (response.success && response.data && Array.isArray(response.data)) setMyBids(response.data)
      else setMyBids([])
    } catch { setMyBids([]) }
  }

  const loadHistory = async () => {
    try {
      const response = await getAuctionHistory({ limit: 10 })
      if (response.success && response.data && Array.isArray(response.data)) setHistoryAuctions(response.data)
      else setHistoryAuctions([])
    } catch { setHistoryAuctions([]) }
  }

  useEffect(() => {
    loadAuctions(); loadMyBids(); loadHistory()
    const interval = setInterval(() => { loadAuctions(); loadMyBids() }, 30000)
    return () => clearInterval(interval)
  }, [user])

  const stats = useMemo(() => {
    const totalBids = auctions.reduce((s, a) => s + (a.bid_count || 0), 0)
    const highestBid = auctions.length > 0 ? Math.max(...auctions.map(a => a.current_price)) : 0
    const totalVolume = auctions.reduce((s, a) => s + a.current_price, 0)
    const myLeading = myBids.filter(b => b.status === 'active').length
    return { totalBids, highestBid, totalVolume, myLeading }
  }, [auctions, myBids])

  const openBidDialog = (auction: Auction) => {
    setSelectedAuction(auction)
    setBidAmount((auction.current_price + auction.bid_increment).toString())
    setIsBidDialogOpen(true)
  }

  const handlePlaceBid = async () => {
    if (!selectedAuction || !user) { toast.error(t('pleaseLogin')); return }
    const amount = parseFloat(bidAmount)
    if (isNaN(amount) || amount <= 0) { toast.error(t('invalidBidAmount')); return }
    const minBid = selectedAuction.current_price + selectedAuction.bid_increment
    if (amount < minBid) { toast.error(t('minBidError', { amount: minBid.toLocaleString() })); return }
    if (availableBalance < amount) { toast.error(t('insufficientBalance')); return }
    try {
      const response = await placeBid({
        auction_id: selectedAuction.auction_id, bid_amount: amount, deposit_amount: amount,
        transaction_hash: `mcc_bid_${Date.now()}`,
      })
      if (response.success) {
        toast.success(t('bidSuccess'))
        refreshBalance(); loadAuctions(); loadMyBids()
        setIsBidDialogOpen(false); setBidAmount(''); setSelectedAuction(null)
      } else throw new Error(response.error || t('bidFailed'))
    } catch (error) { toast.error(error instanceof Error ? error.message : t('bidFailed')) }
  }

  const handleCreateAuction = async () => {
    const { unit_id, starting_price, bid_increment, end_time } = createForm
    if (!unit_id || !starting_price || !bid_increment || !end_time) { toast.error(t('fillAllFields')); return }
    try {
      const response = await createAuction({
        unit_id, auction_type: createForm.auction_type, starting_price: parseFloat(starting_price),
        reserve_price: createForm.reserve_price ? parseFloat(createForm.reserve_price) : undefined,
        bid_increment: parseFloat(bid_increment), end_time,
      })
      if (response.success) {
        toast.success(t('auctionCreated')); loadAuctions(); setIsCreateAuctionDialogOpen(false)
        setCreateForm({ unit_id: '', unit_type: 'station', auction_type: 'first', starting_price: '', reserve_price: '', bid_increment: '', end_time: '' })
      } else throw new Error(response.error || t('createAuctionFailed'))
    } catch (error) { toast.error(error instanceof Error ? error.message : t('createAuctionFailed')) }
  }

  const handleRefundDeposit = async (bid: Bid) => {
    try {
      const response = await refundDeposit(bid.bid_id)
      if (response.success) { toast.success(t('depositRefunded')); refreshBalance(); loadMyBids() }
      else throw new Error(response.error || t('refundFailed'))
    } catch (error) { toast.error(error instanceof Error ? error.message : t('refundFailed')) }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6 font-mono">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wider">{t('title')}</h1>
          <p className="text-xs sm:text-sm text-neutral-400">{t('subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
            onClick={() => { loadAuctions(); loadMyBids(); loadHistory(); toast.success(t('refreshed')) }}
          >
            <RefreshCw className="w-4 h-4 mr-2" />{t('refresh')}
          </Button>
        </div>
      </div>

      <Card className="bg-neutral-900 border-neutral-700 dash-card">
        <CardContent className="p-3 sm:p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-neutral-800 rounded p-4">
              <div className="text-xs text-neutral-400 tracking-wider mb-1">{t('ongoing')}</div>
              <div className="text-2xl font-bold text-cyan-400 font-mono">{auctions.length}</div>
              <div className="text-xs text-neutral-500">{t('auctionsCount')}</div>
            </div>
            <div className="bg-neutral-800 rounded p-4">
              <div className="text-xs text-neutral-400 tracking-wider mb-1">{t('totalBids')}</div>
              <div className="text-2xl font-bold text-white font-mono">{stats.totalBids}</div>
              <div className="text-xs text-neutral-500">{t('bidsCount')}</div>
            </div>
            <div className="bg-neutral-800 rounded p-4">
              <div className="text-xs text-neutral-400 tracking-wider mb-1">{t('highestBid')}</div>
              <div className="text-2xl font-bold text-white font-mono">{stats.highestBid > 0 ? stats.highestBid : '--'}</div>
              <div className="text-xs text-neutral-500">MCC</div>
            </div>
            <div className="bg-neutral-800 rounded p-4">
              <div className="text-xs text-neutral-400 tracking-wider mb-1">{t('totalLocked')}</div>
              <div className="text-2xl font-bold text-cyan-400 font-mono">{stats.totalVolume > 0 ? stats.totalVolume : '--'}</div>
              <div className="text-xs text-neutral-500">MCC</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-700 dash-card">
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-neutral-300 tracking-wider">{t('activeAuctions')}</span>
              <span className="text-xs text-neutral-500">({auctions.length})</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <Clock className="w-3 h-3" />
              <span>{t('autoRefresh')}</span>
            </div>
          </div>

          {auctions.length === 0 ? (
            <div className="text-center py-16">
              <Gavel className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
              <div className="text-neutral-500 text-sm mb-2">{t('noActiveAuctions')}</div>
              <div className="text-neutral-500 text-xs max-w-md mx-auto">
                {t('auctionExplainer')}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {auctions.map((auction) => {
                const unitType = auction.unit_type || 'station'
                const minNextBid = auction.current_price + auction.bid_increment
                const priceUp = auction.starting_price > 0
                  ? ((auction.current_price - auction.starting_price) / auction.starting_price * 100).toFixed(1)
                  : '0'
                const isHot = (auction.bid_count || 0) >= 5

                return (
                  <div
                    key={auction.auction_id}
                    className={cn(
                      "bg-neutral-800 border rounded p-5 hover:border-cyan-400/50 dash-card",
                      isHot ? "border-cyan-400/30" : "border-neutral-700"
                    )}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-cyan-400">{UNIT_ICONS[unitType]}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold">
                              {auction.unit_name || `${t('territory')} #${auction.unit_id}`}
                            </span>
                            {isHot && <Badge className={BADGE_VARIANTS.warning}><Flame className="w-3 h-3 inline mr-0.5" />{t('hot')}</Badge>}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge className={BADGE_VARIANTS.info}>{UNIT_LABELS[unitType]}</Badge>
                            <Badge className={BADGE_VARIANTS.default}>
                              {auction.auction_type === 'first' ? t('firstAuction') : t('secondAuction')}
                            </Badge>
                            <Badge className={BADGE_VARIANTS.success}>{t('active')}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 rounded px-3 py-1.5 text-sm">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <TimeRemaining endTime={auction.end_time} className="text-cyan-400 font-bold font-mono" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="bg-neutral-800 border border-neutral-700 rounded p-3">
                        <div className="text-xs text-neutral-400 tracking-wider mb-1">{t('startingPrice')}</div>
                        <div className="text-neutral-300 font-mono">{auction.starting_price.toLocaleString()}</div>
                        <div className="text-xs text-neutral-500">MCC</div>
                      </div>
                      <div className="bg-neutral-900 border border-neutral-700 rounded p-3">
                        <div className="text-xs text-neutral-400 tracking-wider mb-1">{t('currentHighest')}</div>
                        <div className="text-xl font-bold text-cyan-400 font-mono">{auction.current_price.toLocaleString()}</div>
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-neutral-500">MCC</span>
                          {Number(priceUp) > 0 && (
                            <span className="text-white flex items-center">
                              <ArrowUpRight className="w-3 h-3" />+{priceUp}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="bg-neutral-800 border border-neutral-700 rounded p-3">
                        <div className="text-xs text-neutral-400 tracking-wider mb-1">{t('bidCount')}</div>
                        <div className="text-white font-bold font-mono">{auction.bid_count || 0}</div>
                        <div className="text-xs text-neutral-500">{t('bidsCount')}</div>
                      </div>
                      <div className="bg-neutral-800 border border-neutral-700 rounded p-3">
                        <div className="text-xs text-neutral-400 tracking-wider mb-1">{t('minIncrement')}</div>
                        <div className="text-neutral-300 font-mono">{auction.bid_increment.toLocaleString()}</div>
                        <div className="text-xs text-neutral-500">MCC (≥5%)</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-neutral-500">
                        <span className="flex items-center gap-1"><Lock className="w-3 h-3" />{t('deposit50')}</span>
                        <span className="flex items-center gap-1"><Crown className="w-3 h-3" />{t('winnerMagistrate')}</span>
                        <span className="flex items-center gap-1"><Timer className="w-3 h-3" />{t('noNewBid24h')}</span>
                      </div>

                      {auction.status === 'active' && (
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => openBidDialog(auction)}
                            disabled={walletLoading}
                            className="bg-cyan-700 hover:bg-cyan-600 text-white"
                          >
                            <Gavel className="w-4 h-4 mr-2" />{t('placeBid')}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openBidDialog(auction)}
                            disabled={walletLoading}
                            className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent text-xs"
                          >
                            <Zap className="w-3 h-3 mr-1.5" />{minNextBid.toLocaleString()} MCC
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-700 dash-card">
        <CardContent className="p-3 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-neutral-800 rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs text-neutral-400 tracking-wider">{t('auctionTarget')}</span>
              </div>
              <div className="text-sm text-neutral-300 mb-1">{t('auctionTargetDesc')}</div>
              <div className="text-xs text-neutral-500">{t('auctionTargetDetail')}</div>
            </div>
            <div className="bg-neutral-800 rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <Timer className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs text-neutral-400 tracking-wider">{t('biddingRules')}</span>
              </div>
              <div className="text-sm text-neutral-300 mb-1">{t('biddingRulesDesc')}</div>
              <div className="text-xs text-neutral-500">{t('biddingRulesDetail')}</div>
            </div>
            <div className="bg-neutral-800 rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs text-neutral-400 tracking-wider">{t('participationReq')}</span>
              </div>
              <div className="text-sm text-neutral-300 mb-1">{t('participationReqDesc')}</div>
              <div className="text-xs text-neutral-500">{t('participationReqDetail')}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {user && (myBids.length > 0 || lockedBalance > 0) && (
        <Card className="bg-neutral-900 border-neutral-700 dash-card">
          <CardContent className="p-3 sm:p-6">
            <div
              onClick={() => setShowMyBids(!showMyBids)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-neutral-300 tracking-wider">{t('myBids')}</span>
                <span className="text-xs text-neutral-500">{myBids.length} {t('bidsCount')}</span>
                {stats.myLeading > 0 && <Badge className={BADGE_VARIANTS.success}>{stats.myLeading} {t('leading')}</Badge>}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-neutral-500">
                  {t('available')} <span className="text-white font-mono">{availableBalance.toLocaleString()}</span>
                  {lockedBalance > 0 && <> · {t('locked')} <span className="text-cyan-400 font-mono">{lockedBalance.toLocaleString()}</span></>}
                  {' '}MCC
                </span>
                {showMyBids ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
              </div>
            </div>

            {showMyBids && (
              <div className="mt-4 space-y-2">
                {myBids.length === 0 ? (
                  <div className="text-center py-8 text-neutral-500 text-sm">{t('noBidRecords')}</div>
                ) : myBids.map((bid) => {
                  const si = BID_STATUS_MAP[bid.status] || { label: bid.status, variant: 'default' as const }
                  return (
                    <div key={bid.bid_id} className="flex items-center justify-between bg-neutral-800 border border-neutral-700 rounded p-3 hover:bg-neutral-700 transition-colors">
                      <div className="flex items-center gap-3">
                        <Badge className={BADGE_VARIANTS[si.variant]}>{si.label}</Badge>
                        <span className="text-neutral-300 text-sm">{bid.unit_name || `#${bid.auction_id}`}</span>
                        <span className="text-white text-sm font-bold font-mono">{bid.bid_amount.toLocaleString()} MCC</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FormattedDateTime dateTime={bid.created_at} className="text-neutral-500 text-xs font-mono" />
                        {(bid.status === 'lost' || bid.status === 'outbid') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRefundDeposit(bid)}
                            className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent text-xs"
                          >
                            {t('refund')}
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {historyAuctions.length > 0 && (
        <Card className="bg-neutral-900 border-neutral-700 dash-card">
          <CardContent className="p-3 sm:p-6">
            <div
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-neutral-400" />
                <span className="text-sm text-neutral-300 tracking-wider">{t('auctionHistory')}</span>
                <span className="text-xs text-neutral-500">{historyAuctions.length} {t('auctionsCount')}</span>
              </div>
              {showHistory ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
            </div>

            {showHistory && (
              <div className="mt-4 space-y-2">
                {historyAuctions.map((a) => (
                  <div key={a.auction_id} className="flex items-center justify-between bg-neutral-800 border border-neutral-700 rounded p-3 hover:bg-neutral-700 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-cyan-400">{UNIT_ICONS[a.unit_type || 'station']}</span>
                      <div>
                        <div className="text-neutral-300 text-sm">{a.unit_name || `${t('territory')} #${a.unit_id}`}</div>
                        <div className="text-neutral-500 text-xs">{UNIT_LABELS[a.unit_type || 'station']}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-white text-sm font-bold font-mono">{a.current_price.toLocaleString()} MCC</div>
                        <div className="text-neutral-500 text-xs">{a.bid_count || 0} {t('bidsCount')}</div>
                      </div>
                      <Badge className={a.status === 'cancelled' ? BADGE_VARIANTS.error : BADGE_VARIANTS.default}>
                        {a.status === 'ended' ? t('ended') : a.status === 'cancelled' ? t('cancelled') : t('sold')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={isBidDialogOpen} onOpenChange={setIsBidDialogOpen}>
        <DialogContent className="bg-neutral-900 border-neutral-700 font-mono max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white font-mono flex items-center gap-2">
              <Gavel className="w-5 h-5 text-cyan-400" />{t('bidDialog')}
            </DialogTitle>
            <DialogDescription className="text-neutral-400 font-mono">
              {selectedAuction?.unit_name || `${t('territory')} #${selectedAuction?.unit_id}`}
            </DialogDescription>
          </DialogHeader>
          {selectedAuction && (
            <div className="space-y-4 py-2">
              <div className="flex gap-2 flex-wrap">
                <Badge className={BADGE_VARIANTS.info}>{UNIT_LABELS[selectedAuction.unit_type || 'station']}</Badge>
                <Badge className={BADGE_VARIANTS.default}>{selectedAuction.auction_type === 'first' ? t('firstAuction') : t('secondAuction')}</Badge>
                <Badge className={BADGE_VARIANTS.warning}><Crown className="w-3 h-3 inline mr-0.5" />{t('winnerMagistrate')}</Badge>
              </div>

              <div className="bg-neutral-800 border border-neutral-700 rounded p-4">
                <div className="text-xs text-neutral-400 tracking-wider mb-1">{t('currentHighest')}</div>
                <div className="text-3xl font-bold text-cyan-400 font-mono">
                  {selectedAuction.current_price.toLocaleString()} <span className="text-base text-neutral-500">MCC</span>
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  {selectedAuction.bid_count || 0} {t('bidsCount')} · {t('startingPrice')} {selectedAuction.starting_price.toLocaleString()} MCC
                </div>
              </div>

              <div>
                <div className="text-xs text-neutral-400 tracking-wider mb-1">
                  {t('bidAmountLabel')} ({t('bidAmountMin', { amount: (selectedAuction.current_price + selectedAuction.bid_increment).toLocaleString() })})
                </div>
                <input
                  type="number" step={selectedAuction.bid_increment} value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-600 text-white placeholder-neutral-400 px-3 py-2.5 rounded text-sm font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {bidAmount && !isNaN(parseFloat(bidAmount)) && (
                <div className="space-y-2 p-3 bg-neutral-800 rounded border border-neutral-700 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">{t('bidAmountLabel')}:</span>
                    <span className="text-neutral-300 font-mono">{parseFloat(bidAmount).toLocaleString()} MCC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">{t('depositLabel')}:</span>
                    <span className="text-cyan-400 font-mono">{(parseFloat(bidAmount) * 0.5).toLocaleString()} MCC</span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-700 pt-2">
                    <span className="text-neutral-400">{t('availableBalance')}:</span>
                    <span className={cn("font-mono", availableBalance < parseFloat(bidAmount) ? 'text-red-500' : 'text-white')}>
                      {availableBalance.toLocaleString()} MCC
                    </span>
                  </div>
                  {availableBalance < parseFloat(bidAmount) && (
                    <div className="text-red-500 text-xs flex items-center gap-1"><Lock className="w-3 h-3" />{t('balanceInsufficient')}</div>
                  )}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBidDialogOpen(false)} className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent">{t('cancel')}</Button>
            <Button onClick={handlePlaceBid} className="bg-cyan-700 hover:bg-cyan-600 text-white">{t('confirmBid')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateAuctionDialogOpen} onOpenChange={setIsCreateAuctionDialogOpen}>
        <DialogContent className="bg-neutral-900 border-neutral-700 font-mono">
          <DialogHeader>
            <DialogTitle className="text-white font-mono flex items-center gap-2"><Plus className="w-5 h-5 text-cyan-400" />{t('createAuctionTitle')}</DialogTitle>
            <DialogDescription className="text-neutral-400 font-mono">{t('createAuctionDesc')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <div className="text-xs text-neutral-400 tracking-wider mb-1">{t('territoryId')} *</div>
              <input value={createForm.unit_id} onChange={(e) => setCreateForm({ ...createForm, unit_id: e.target.value })} className="w-full bg-neutral-800 border border-neutral-600 text-white placeholder-neutral-400 px-3 py-2 rounded text-sm font-mono focus:border-cyan-400 focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-neutral-400 tracking-wider mb-1">{t('territoryType')} *</div>
                <Select value={createForm.unit_type} onValueChange={(v: UnitType) => setCreateForm({ ...createForm, unit_type: v })}>
                  <SelectTrigger className="bg-neutral-800 border-neutral-600 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-neutral-700"><SelectItem value="station">{t('station')}</SelectItem></SelectContent>
                </Select>
              </div>
              <div>
                <div className="text-xs text-neutral-400 tracking-wider mb-1">{t('auctionType')} *</div>
                <Select value={createForm.auction_type} onValueChange={(v: 'first' | 'second') => setCreateForm({ ...createForm, auction_type: v })}>
                  <SelectTrigger className="bg-neutral-800 border-neutral-600 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-neutral-700"><SelectItem value="first">{t('firstAuction')}</SelectItem><SelectItem value="second">{t('secondAuction')}</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-neutral-400 tracking-wider mb-1">{t('startPrice')} *</div>
                <input type="number" value={createForm.starting_price} onChange={(e) => setCreateForm({ ...createForm, starting_price: e.target.value })} className="w-full bg-neutral-800 border border-neutral-600 text-white placeholder-neutral-400 px-3 py-2 rounded text-sm font-mono focus:border-cyan-400 focus:outline-none" />
              </div>
              <div>
                <div className="text-xs text-neutral-400 tracking-wider mb-1">{t('reservePrice')}</div>
                <input type="number" value={createForm.reserve_price} onChange={(e) => setCreateForm({ ...createForm, reserve_price: e.target.value })} className="w-full bg-neutral-800 border border-neutral-600 text-white placeholder-neutral-400 px-3 py-2 rounded text-sm font-mono focus:border-cyan-400 focus:outline-none" />
              </div>
            </div>
            <div>
              <div className="text-xs text-neutral-400 tracking-wider mb-1">{t('minBidIncrement')} *</div>
              <input type="number" value={createForm.bid_increment} onChange={(e) => setCreateForm({ ...createForm, bid_increment: e.target.value })} className="w-full bg-neutral-800 border border-neutral-600 text-white placeholder-neutral-400 px-3 py-2 rounded text-sm font-mono focus:border-cyan-400 focus:outline-none" />
            </div>
            <div>
              <div className="text-xs text-neutral-400 tracking-wider mb-1">{t('endTime')} *</div>
              <input type="datetime-local" value={createForm.end_time} onChange={(e) => setCreateForm({ ...createForm, end_time: e.target.value })} className="w-full bg-neutral-800 border border-neutral-600 text-white placeholder-neutral-400 px-3 py-2 rounded text-sm font-mono focus:border-cyan-400 focus:outline-none" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateAuctionDialogOpen(false)} className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent">{t('cancel')}</Button>
            <Button onClick={handleCreateAuction} className="bg-cyan-700 hover:bg-cyan-600 text-white">{t('createAuction')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
