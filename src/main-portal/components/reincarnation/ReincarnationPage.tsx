// AI-generated · AI-managed · AI-maintained
'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  RefreshCw, ArrowDownUp, Wallet, TrendingUp,
  ExternalLink, Copy, Check, DollarSign,
  BarChart3, Info, Loader2
} from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip'
import { toast } from 'sonner'
import { STABLECOIN_CONFIG } from '../../lib/solana/reincarnation-client'
import { useTranslations } from 'next-intl'

interface PoolStatus {
  usdc_balance: string
  usdt_balance: string
  total_buyback: string
  total_mcc_bought: string
  pool_address: string
}

const formatNumber = (num: number, decimals = 2) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M'
  }
  return num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

function CopyButton({ text, copiedText }: { text: string; copiedText: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success(copiedText)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button onClick={handleCopy} className="text-neutral-400 hover:text-white transition-colors">
      {copied ? <Check className="w-4 h-4 text-cyan-400" /> : <Copy className="w-4 h-4" />}
    </button>
  )
}

function InfoTip({ children }: { children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="w-3.5 h-3.5 text-neutral-500 hover:text-neutral-300 cursor-help inline-block ml-1" />
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs bg-neutral-800 text-neutral-200 border border-neutral-700">
        {children}
      </TooltipContent>
    </Tooltip>
  )
}

export default function ActiveBuybackPage() {
  const t = useTranslations('reincarnationDash')
  const [loading, setLoading] = useState(true)
  const [poolStatus, setPoolStatus] = useState<PoolStatus | null>(null)
  const [basePrice, setBasePrice] = useState<number>(0)

  const loadPoolStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/buyback/pool')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setPoolStatus(data.data)
        }
      }
    } catch (error) {
      console.error('Failed to load pool status:', error)
    }
  }, [])

  const loadPrice = useCallback(async () => {
    try {
      const response = await fetch('/api/buyback/price')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setBasePrice(parseFloat(data.data.base_price) || 0)
        }
      }
    } catch {}
  }, [])

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true)
      await Promise.all([loadPoolStatus(), loadPrice()])
      setLoading(false)
    }
    loadAll()
  }, [loadPoolStatus, loadPrice])

  const handleRefresh = async () => {
    await Promise.all([loadPoolStatus(), loadPrice()])
    toast.success(t('refreshed'))
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wider">{t('title')}</h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">{t('subtitle')}</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-400 mr-3" />
          <span className="text-neutral-400">{t('loading')}</span>
        </div>
      </div>
    )
  }

  const usdtBalance = poolStatus ? parseFloat(poolStatus.usdt_balance) : 0
  const usdcBalance = poolStatus ? parseFloat(poolStatus.usdc_balance) : 0
  const totalPool = usdtBalance + usdcBalance
  const totalMarketMade = poolStatus ? parseFloat(poolStatus.total_buyback) : 0
  const totalMccBought = poolStatus ? parseFloat(poolStatus.total_mcc_bought) : 0

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
          onClick={handleRefresh}
          className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          {t('refresh')}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 tracking-wider mb-2">
              <DollarSign className="w-3.5 h-3.5 text-white" />
              {t('stablecoinPool')}
              <InfoTip>{t('stablecoinPoolTip')}</InfoTip>
            </div>
            <div className="text-2xl font-bold text-cyan-400 font-mono">
              {formatNumber(totalPool)}
              <span className="text-sm font-normal text-neutral-500 ml-1">USD</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 tracking-wider mb-2">
              <ArrowDownUp className="w-3.5 h-3.5 text-white" />
              {t('mccBought')}
              <InfoTip>{t('mccBoughtTip')}</InfoTip>
            </div>
            <div className="text-2xl font-bold text-white font-mono">
              {formatNumber(totalMccBought)}
              <span className="text-sm font-normal text-neutral-500 ml-1">MCC</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 tracking-wider mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-white" />
              {t('totalMarketMade')}
              <InfoTip>{t('totalMarketMadeTip')}</InfoTip>
            </div>
            <div className="text-2xl font-bold text-cyan-400 font-mono">
              {formatNumber(totalMarketMade)}
              <span className="text-sm font-normal text-neutral-500 ml-1">USD</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 tracking-wider mb-2">
              <DollarSign className="w-3.5 h-3.5 text-white" />
              {t('avgPrice30d')}
            </div>
            <div className="text-2xl font-bold text-white font-mono">
              {basePrice > 0 ? formatNumber(basePrice, 4) : '--'}
              <span className="text-sm font-normal text-neutral-500 ml-1">USD</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center gap-2 text-neutral-400 text-sm mb-4">
            <BarChart3 className="w-4 h-4 text-white" />
            <span className="tracking-wider uppercase">{t('poolBreakdown')}</span>
            <InfoTip>{t('poolBreakdownTip')}</InfoTip>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            <div className="bg-neutral-800 rounded p-4">
              <div className="text-xs text-neutral-400 tracking-wider mb-1">{t('usdtBalance')}</div>
              <div className="text-xl font-bold text-cyan-400 font-mono">
                {formatNumber(usdtBalance)}
              </div>
            </div>
            <div className="bg-neutral-800 rounded p-4">
              <div className="text-xs text-neutral-400 tracking-wider mb-1">{t('usdcBalance')}</div>
              <div className="text-xl font-bold text-cyan-400 font-mono">
                {formatNumber(usdcBalance)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center gap-2 text-neutral-400 text-sm mb-4">
            <Wallet className="w-4 h-4 text-white" />
            <span className="tracking-wider uppercase">{t('contractAddresses')}</span>
            <InfoTip>{t('contractAddressesTip')}</InfoTip>
          </div>
          <div className="space-y-3">
            <div className="bg-neutral-800 rounded p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-neutral-400 tracking-wider mb-1">{t('marketMakingPool')}</div>
                  <code className="text-sm font-mono text-cyan-400">
                    {poolStatus?.pool_address || 'REDEh89TzpwCtoWQuuNPtxskrVoUDQgowR7e7sZpWj9'}
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <CopyButton text={poolStatus?.pool_address || 'REDEh89TzpwCtoWQuuNPtxskrVoUDQgowR7e7sZpWj9'} copiedText={t('copied')} />
                  <a href={`https://solscan.io/account/${poolStatus?.pool_address || 'REDEh89TzpwCtoWQuuNPtxskrVoUDQgowR7e7sZpWj9'}`} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-neutral-800 rounded p-3">
                <div className="text-xs text-neutral-400 tracking-wider mb-1">USDT Vault</div>
                <code className="text-xs font-mono text-neutral-400">{STABLECOIN_CONFIG.usdt.vault.toBase58().slice(0, 20)}...</code>
                <CopyButton text={STABLECOIN_CONFIG.usdt.vault.toBase58()} copiedText={t('copied')} />
              </div>
              <div className="bg-neutral-800 rounded p-3">
                <div className="text-xs text-neutral-400 tracking-wider mb-1">USDC Vault</div>
                <code className="text-xs font-mono text-neutral-400">{STABLECOIN_CONFIG.usdc.vault.toBase58().slice(0, 20)}...</code>
                <CopyButton text={STABLECOIN_CONFIG.usdc.vault.toBase58()} copiedText={t('copied')} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-start gap-3">
            <ArrowDownUp className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm space-y-2">
              <div className="font-medium text-cyan-400 tracking-wider">{t('mechanism')}</div>
              <p className="text-neutral-400 leading-relaxed">
                {t('mechanismDesc')}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <Badge className="bg-white/20 text-white border-transparent">Raydium CPMM</Badge>
                <Badge className="bg-cyan-400/20 text-cyan-400 border-transparent">PDA Autonomous</Badge>
                <Badge className="bg-cyan-400/20 text-cyan-400 border-transparent">Auto Market Making</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
