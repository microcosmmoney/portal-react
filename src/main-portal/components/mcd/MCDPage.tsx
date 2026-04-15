// AI-generated · AI-managed · AI-maintained
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useMCD } from '../../hooks/useMCD'
import { fetchApi } from '../../lib/api'
import { getWalletBalance, getTokenFromBalance } from '../../lib/api/blockchain'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Skeleton } from '../ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog'
import {
  RefreshCw,
  Wallet,
  Gift,
  Calendar,
  ArrowRight,
  HelpCircle,
  Coins,
  History,
  ChevronDown,
  ChevronUp,
  Loader2,
  TrendingUp,
  MessageSquare,
  Eye,
  Shield,
  ExternalLink,
  AlertTriangle
} from 'lucide-react'
import type { MCDTransaction, MCDUserDailyReward } from '../../lib/types/api'
import { Link } from '../../i18n/navigation'
import { useTranslations } from 'next-intl'

const TX_TYPE_COLORS: Record<string, string> = {
  daily_distribution: 'bg-white/20 text-white border-transparent',
  spend: 'bg-red-500/20 text-red-500 border-transparent',
  transfer: 'bg-cyan-400/20 text-cyan-400 border-transparent',
  refund: 'bg-cyan-400/20 text-cyan-400 border-transparent'
}

// TX_TYPE_NAMES moved to component scope for i18n

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit'
  })
}

interface WalletMCDInfo {
  address: string
  balance: number
  isPrimary: boolean
}

export default function MCDPage() {
  const t = useTranslations('mcdDash')
  const { user } = useAuth()

  const TX_TYPE_NAMES: Record<string, string> = {
    daily_distribution: t('txTypeDaily'),
    spend: t('txTypeSpend'),
    transfer: t('txTypeTransfer'),
    refund: t('txTypeRefund')
  }
  const {
    transactions,
    dailyRewards,
    loading: dbLoading,
    isRefreshing,
    error,
    refresh
  } = useMCD(user?.uid)

  const [showHelp, setShowHelp] = useState(false)
  const [walletMCDs, setWalletMCDs] = useState<WalletMCDInfo[]>([])
  const [walletsLoading, setWalletsLoading] = useState(true)
  const [walletsExpanded, setWalletsExpanded] = useState(false)

  const loadOnChainMCD = useCallback(async () => {
    setWalletsLoading(true)
    try {
      const listRes = await fetchApi('/auth/wallet/list')
      if (!listRes.success || !listRes.data?.wallets) {
        setWalletMCDs([])
        setWalletsLoading(false)
        return
      }
      const wallets: { wallet_address: string; is_primary?: boolean }[] = listRes.data.wallets
      if (wallets.length === 0) {
        setWalletMCDs([])
        setWalletsLoading(false)
        return
      }

      const results = await Promise.allSettled(
        wallets.map(async (w) => {
          const wb = await getWalletBalance(w.wallet_address)
          const mcdToken = getTokenFromBalance(wb, 'MCD')
          return {
            address: w.wallet_address,
            balance: mcdToken?.balance || 0,
            isPrimary: !!w.is_primary
          } as WalletMCDInfo
        })
      )

      const infos: WalletMCDInfo[] = []
      for (const r of results) {
        if (r.status === 'fulfilled') infos.push(r.value)
      }
      setWalletMCDs(infos)
    } catch {
      setWalletMCDs([])
    } finally {
      setWalletsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user?.uid) loadOnChainMCD()
  }, [user?.uid, loadOnChainMCD])

  const totalOnChainMCD = walletMCDs.reduce((sum, w) => sum + w.balance, 0)

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="bg-neutral-900 border-neutral-700 dash-card">
          <CardContent className="p-8 text-center">
            <Wallet className="w-12 h-12 mx-auto mb-4 text-neutral-500" />
            <p className="text-neutral-400">{t('loginRequired')}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wider">{t('title')}</h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            {t('subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/mcc/wallet">
            <Button variant="outline" size="sm" className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent">
              <Wallet className="w-4 h-4 mr-2" />
              {t('manageWallet')}
            </Button>
          </Link>
          <Dialog open={showHelp} onOpenChange={setShowHelp}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent">
                <HelpCircle className="w-4 h-4 mr-2" />
                {t('helpGuide')}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-neutral-900 border-neutral-700 max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-white tracking-wider">{t('helpTitle')}</DialogTitle>
                <DialogDescription className="text-neutral-400">
                  {t('helpDesc')}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="bg-neutral-800 rounded p-3">
                  <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                    <Gift className="w-4 h-4 text-white" />
                    {t('howToGetMcd')}
                  </h4>
                  <ul className="list-disc list-inside text-neutral-400 space-y-1">
                    <li>{t('helpGet1')}</li>
                    <li>{t('helpGet2')}</li>
                    <li>{t('helpGet3')}</li>
                  </ul>
                </div>
                <div className="bg-neutral-800 rounded p-3">
                  <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                    <Coins className="w-4 h-4 text-white" />
                    {t('mcdUsage')}
                  </h4>
                  <ul className="list-disc list-inside text-neutral-400 space-y-1">
                    <li>{t('helpUse1')}</li>
                    <li>{t('helpUse2')}</li>
                    <li>{t('helpUse3')}</li>
                  </ul>
                </div>
                <div className="bg-neutral-800 rounded p-3">
                  <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                    <History className="w-4 h-4 text-white" />
                    {t('notes')}
                  </h4>
                  <ul className="list-disc list-inside text-neutral-400 space-y-1">
                    <li>{t('helpNote1')}</li>
                    <li>{t('helpNote2')}</li>
                    <li>{t('helpNote3')}</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { refresh(); loadOnChainMCD() }}
            disabled={isRefreshing || walletsLoading}
            className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${(isRefreshing || walletsLoading) ? 'animate-spin' : ''}`} />
            {t('refresh')}
          </Button>
        </div>
      </div>

      {error && (
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-white" />
              <span className="text-sm text-neutral-400 tracking-wider">{t('onChainBalance')}</span>
            </div>
            {walletMCDs.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setWalletsExpanded(!walletsExpanded)}
                className="text-neutral-400 hover:text-cyan-400"
              >
                {walletMCDs.length} {t('walletsCount')}
                {walletsExpanded
                  ? <ChevronUp className="w-4 h-4 ml-1" />
                  : <ChevronDown className="w-4 h-4 ml-1" />
                }
              </Button>
            )}
          </div>

          {walletsLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
              <span className="text-neutral-500 text-sm">{t('loadingOnChain')}</span>
            </div>
          ) : walletMCDs.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-neutral-500 mb-3">{t('noWalletBound')}</p>
              <Link href="/mcc/wallet">
                <Button variant="outline" size="sm" className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent">
                  <Wallet className="w-4 h-4 mr-2" />
                  {t('connectWallet')}
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="text-4xl font-bold text-white font-mono mb-1">
                {totalOnChainMCD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-lg text-neutral-400 ml-2">MCD</span>
              </div>
              <div className="text-xs text-neutral-500">
                {walletMCDs.length} {t('walletsCount')}\u7684\u94fe\u4e0a\u4f59\u989d\u603b\u548c
              </div>

              {walletMCDs.length === 1 && (
                <div className="mt-2 text-xs text-neutral-500 font-mono">
                  {walletMCDs[0].address.slice(0, 4)}...{walletMCDs[0].address.slice(-4)}
                  {walletMCDs[0].isPrimary && (
                    <Badge variant="outline" className="text-[10px] border-cyan-400/30 text-cyan-400 px-1.5 py-0 ml-2">
                      {t('primaryWallet')}
                    </Badge>
                  )}
                </div>
              )}

              {walletsExpanded && walletMCDs.length > 1 && (
                <div className="mt-4 space-y-2 border-t border-neutral-700 pt-4">
                  {walletMCDs.map((w) => (
                    <div key={w.address} className="flex items-center justify-between p-2 bg-neutral-800 rounded hover:bg-neutral-700">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-neutral-400">
                          {w.address.slice(0, 4)}...{w.address.slice(-4)}
                        </span>
                        {w.isPrimary && (
                          <Badge variant="outline" className="text-[10px] border-cyan-400/30 text-cyan-400 px-1.5 py-0">
                            {t('primaryWallet')}
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm font-mono text-white">
                        {w.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MCD
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-white" />
            {t('mcdMinting')}
          </CardTitle>
          <CardDescription className="text-neutral-400">
            {t('mcdMintingDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/mcc/mining">
            <div className="w-full flex items-center justify-center gap-2 h-10 rounded-md cursor-pointer bg-cyan-700 hover:bg-cyan-600 transition-all text-white text-sm font-medium">
              <Coins className="w-4 h-4" />
              {t('useMcdToMintMcc')}
            </div>
          </Link>
          <div className="mt-3 p-3 bg-neutral-800 rounded">
            <div className="flex items-start gap-2 text-xs text-cyan-400/70">
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-cyan-400" />
              <div className="space-y-1">
                <p>{t('whitelistNote1')}</p>
                <p>{t('whitelistNote2')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
            <Gift className="w-5 h-5 text-white" />
            {t('ecoServices')}
          </CardTitle>
          <CardDescription className="text-neutral-400">
            {t('ecoServicesDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Double Helix', tagline: t('dhTagline'), desc: t('dhDesc'), icon: TrendingUp, iconBg: 'bg-cyan-400/20', iconColor: 'text-cyan-400', status: t('statusRunning'), statusColor: 'text-white', url: 'https://doublehelix.money' },
              { name: 'xSocial', tagline: t('xsTagline'), desc: t('xsDesc'), icon: MessageSquare, iconBg: 'bg-cyan-400/20', iconColor: 'text-cyan-400', status: t('statusBeta'), statusColor: 'text-cyan-400', url: 'https://xsocial.cc' },
              { name: 'Event Horizon', tagline: t('ehTagline'), desc: t('ehDesc'), icon: Eye, iconBg: 'bg-cyan-400/20', iconColor: 'text-cyan-400', status: t('statusBeta'), statusColor: 'text-cyan-400', url: 'https://poly.microcosm.money' },
              { name: 'GreenSwans', tagline: 'Crypto Guardian', desc: t('gsDesc'), icon: Shield, iconBg: 'bg-cyan-400/20', iconColor: 'text-cyan-400', status: t('statusDev'), statusColor: 'text-neutral-400', url: 'https://greenswans.cc' },
            ].map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg ${p.iconBg} flex items-center justify-center`}>
                    <p.icon className={`w-5 h-5 ${p.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white text-sm">{p.name}</span>
                      <ExternalLink className="w-3 h-3 text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-xs text-neutral-500">{p.tagline}</span>
                  </div>
                  <span className={`text-[10px] ${p.statusColor}`}>{p.status}</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">{p.desc}</p>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList className="bg-neutral-800 border border-neutral-700">
          <TabsTrigger value="daily" className="data-[state=active]:bg-neutral-700">
            <Gift className="w-4 h-4 mr-2" />
            {t('dailyDistribution')}
          </TabsTrigger>
          <TabsTrigger value="transactions" className="data-[state=active]:bg-neutral-700">
            <History className="w-4 h-4 mr-2" />
            {t('transactionHistory')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
                <Calendar className="w-5 h-5 text-white" />
                {t('dailyDistributionRecords')}
              </CardTitle>
              <CardDescription className="text-neutral-400">
                {t('dailyDistributionDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dbLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full bg-neutral-800" />
                  ))}
                </div>
              ) : dailyRewards.length === 0 ? (
                <div className="text-center py-12 text-neutral-500">
                  <Gift className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{t('noDailyRecords')}</p>
                  <p className="text-sm mt-2">{t('noDailyRecordsHint')}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-neutral-800 hover:bg-transparent">
                        <TableHead className="text-xs font-medium text-neutral-400 tracking-wider">{t('distributionDate')}</TableHead>
                        <TableHead className="text-xs font-medium text-neutral-400 tracking-wider">Station</TableHead>
                        <TableHead className="text-xs font-medium text-neutral-400 tracking-wider text-right">{t('amountLabel')}</TableHead>
                        <TableHead className="text-xs font-medium text-neutral-400 tracking-wider text-right">{t('claimTime')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dailyRewards.map((reward: MCDUserDailyReward) => (
                        <TableRow key={reward.id} className="border-b border-neutral-800 hover:bg-neutral-800">
                          <TableCell className="font-medium text-white font-mono">
                            {formatShortDate(reward.reward_date)}
                          </TableCell>
                          <TableCell className="text-neutral-400 font-mono">
                            {reward.territory_id || '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="text-white font-medium font-mono">
                              +{reward.mcd_received.toLocaleString()} MCD
                            </span>
                          </TableCell>
                          <TableCell className="text-right text-neutral-500 text-sm font-mono">
                            {formatDate(reward.created_at)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
                <History className="w-5 h-5 text-white" />
                {t('transactionHistory')}
              </CardTitle>
              <CardDescription className="text-neutral-400">
                {t('transactionHistoryDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dbLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full bg-neutral-800" />
                  ))}
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-12 text-neutral-500">
                  <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{t('noTransactions')}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-neutral-800 hover:bg-transparent">
                        <TableHead className="text-xs font-medium text-neutral-400 tracking-wider">{t('timeLabel')}</TableHead>
                        <TableHead className="text-xs font-medium text-neutral-400 tracking-wider">{t('typeLabel')}</TableHead>
                        <TableHead className="text-xs font-medium text-neutral-400 tracking-wider">{t('fromLabel')}</TableHead>
                        <TableHead className="text-xs font-medium text-neutral-400 tracking-wider w-8"></TableHead>
                        <TableHead className="text-xs font-medium text-neutral-400 tracking-wider">{t('toLabel')}</TableHead>
                        <TableHead className="text-xs font-medium text-neutral-400 tracking-wider text-right">{t('amountLabel')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((tx: MCDTransaction) => {
                        const isIncome = tx.to_account_id === user?.uid
                        return (
                          <TableRow key={tx.id} className="border-b border-neutral-800 hover:bg-neutral-800">
                            <TableCell className="text-neutral-500 text-sm font-mono">
                              {formatDate(tx.created_at)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={TX_TYPE_COLORS[tx.tx_type] || 'bg-neutral-500/20 text-neutral-300'}
                              >
                                {TX_TYPE_NAMES[tx.tx_type] || tx.tx_type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-neutral-400 text-sm font-mono">
                              {tx.from_account_type === 'station_vault'
                                ? `Station #${tx.from_account_id}`
                                : tx.from_account_type === 'system'
                                ? t('system')
                                : `${t('userLabel')} ${tx.from_account_id?.slice(0, 8)}...`}
                            </TableCell>
                            <TableCell className="text-neutral-600">
                              <ArrowRight className="w-4 h-4" />
                            </TableCell>
                            <TableCell className="text-neutral-400 text-sm font-mono">
                              {tx.to_account_type === 'station_vault'
                                ? `Station #${tx.to_account_id}`
                                : tx.to_account_type === 'system'
                                ? t('system')
                                : `${t('userLabel')} ${tx.to_account_id?.slice(0, 8)}...`}
                            </TableCell>
                            <TableCell className="text-right">
                              <span
                                className={`font-medium font-mono ${
                                  isIncome ? 'text-white' : 'text-red-400'
                                }`}
                              >
                                {isIncome ? '+' : '-'}{tx.amount.toLocaleString()} MCD
                              </span>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
