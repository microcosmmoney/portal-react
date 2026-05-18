// AI-generated · AI-managed · AI-maintained
'use client'

import { useWallet } from '../../contexts/WalletContext'
import { Loader2, AlertTriangle } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import MarketOverviewBar from './MarketOverviewBar'
import QuickActions from './QuickActions'
import EcosystemStatsCard from './EcosystemStatsCard'
import MyAssetsSummary from './MyAssetsSummary'
import MCCPriceChart from './MCCPriceChart'
import MintingStatsCard from './MintingStatsCard'
import MiningWeightCard from './MiningWeightCard'
import LockPeriodsCard from './LockPeriodsCard'
import MyMiningCard from './MyMiningCard'
import MCCTokenStatsCard from './MCCTokenStatsCard'
import MCDStatsCard from './MCDStatsCard'
import { WaveText } from '../mainnet/wave-text'
import { useTranslations } from 'next-intl'

export default function UserDashboardPage() {
  const t = useTranslations('mccDashboard')
  const { loading, error } = useWallet()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-mono">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-cyan-400" />
          <div className="text-neutral-500">loading user_data...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-mono">
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">{error}</span>
            </div>
            <p className="text-neutral-500 text-sm">{t('refreshRetry')}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto font-mono px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6">
      <div className="text-center">
        <WaveText text="SHARED NETWORK · SHARED FUTURE" className="text-lg 2xs:text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-[var(--font-bebas)] tracking-tight" />
{/*<WaveText text="FROM MICROCOSMO TO MACROCOSMO" className="text-5xl font-[var(--font-bebas)] tracking-tight" />*/}
      </div>

      <MarketOverviewBar />

      <QuickActions />

      <MyAssetsSummary />

      <MCCPriceChart />

      <div className="grid lg:grid-cols-2 gap-3 sm:gap-6">
        <MyMiningCard />
        <MiningWeightCard />
      </div>

      <div className="grid lg:grid-cols-2 gap-3 sm:gap-6">
        <MintingStatsCard />
        <EcosystemStatsCard />
      </div>

      <div className="grid lg:grid-cols-2 gap-3 sm:gap-6">
        <MCCTokenStatsCard />
        <MCDStatsCard />
      </div>

      <LockPeriodsCard />

      {/* Data refresh notice — 4 languages */}
      <div className="text-center py-4 space-y-1">
        <div className="text-xs text-cyan-400/60 font-mono">
          Data refreshes every 4 hours · For real-time data, please check on-chain directly
        </div>
        <div className="text-xs text-cyan-400/60 font-mono">
          \u6570\u636e\u6bcf 4 \u5c0f\u65f6\u66f4\u65b0 · \u5373\u65f6\u6570\u636e\u8bf7\u76f4\u63a5\u67e5\u8be2\u94fe\u4e0a
        </div>
        <div className="text-xs text-cyan-400/60 font-mono">
          \u30c7\u30fc\u30bf\u306f4\u6642\u9593\u3054\u3068\u306b\u66f4\u65b0 · \u30ea\u30a2\u30eb\u30bf\u30a4\u30e0\u30c7\u30fc\u30bf\u306f\u30aa\u30f3\u30c1\u30a7\u30fc\u30f3\u3067\u78ba\u8a8d
        </div>
        <div className="text-xs text-cyan-400/60 font-mono">
          \ub370\uc774\ud130\ub294 4\uc2dc\uac04\ub9c8\ub2e4 \uac31\uc2e0 · \uc2e4\uc2dc\uac04 \ub370\uc774\ud130\ub294 \uc628\uccb4\uc778\uc5d0\uc11c \ud655\uc778
        </div>
      </div>
    </div>
  )
}
