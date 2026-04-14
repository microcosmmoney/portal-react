// AI-generated · AI-managed · AI-maintained
'use client'

import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Vote, Swords, Heart, Construction, Target, Shield, Users, Coins } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function VotingPage() {
  const t = useTranslations('votingDash')

  return (
    <div className="max-w-7xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wider">{t('title')}</h1>
          <Badge className="bg-cyan-400/20 text-cyan-400 border border-cyan-400/30">
            <Construction className="w-3 h-3 mr-1" />
            {t('underConstruction')}
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-neutral-400">{t('subtitle')}</p>
      </div>

      <Card className="bg-neutral-900 border-neutral-700 dash-card">
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center gap-2 text-neutral-400 text-sm mb-4">
            <Target className="w-4 h-4" />
            <span className="tracking-wider">{t('buildGoal')}</span>
          </div>
          <div className="space-y-4">
            <p className="text-neutral-300 text-sm leading-relaxed">
              {t('buildDesc')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-neutral-800 rounded border border-neutral-700 hover:border-cyan-400/50 dash-card">
                <Shield className="w-5 h-5 text-white mb-2" />
                <div className="text-white text-sm font-medium mb-1">{t('antiSybilTitle')}</div>
                <div className="text-neutral-500 text-xs">{t('antiSybilDesc')}</div>
              </div>
              <div className="p-4 bg-neutral-800 rounded border border-neutral-700 hover:border-cyan-400/50 dash-card">
                <Coins className="w-5 h-5 text-white mb-2" />
                <div className="text-white text-sm font-medium mb-1">{t('economicTitle')}</div>
                <div className="text-neutral-500 text-xs">{t('economicDesc')}</div>
              </div>
              <div className="p-4 bg-neutral-800 rounded border border-neutral-700 hover:border-cyan-400/50 dash-card">
                <Users className="w-5 h-5 text-white mb-2" />
                <div className="text-white text-sm font-medium mb-1">{t('governanceTitle')}</div>
                <div className="text-neutral-500 text-xs">{t('governanceDesc')}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded bg-neutral-800">
                <Swords className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-medium">{t('bettingModeTitle')}</div>
                <Badge className="bg-cyan-400/20 text-cyan-400 border border-cyan-400/30 mt-1">
                  Betting Mode
                </Badge>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-neutral-400 text-sm leading-relaxed">
                {t('bettingModeDesc')}
              </p>
              <div className="p-3 bg-neutral-800 rounded border border-neutral-700">
                <div className="text-xs text-neutral-400 tracking-wider mb-2">{t('mechanismLabel')}</div>
                <div className="space-y-1.5 text-xs text-neutral-400">
                  <div className="flex items-start gap-2">
                    <span className="text-neutral-500 mt-0.5">1.</span>
                    <span>{t('bettingStep1')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-neutral-500 mt-0.5">2.</span>
                    <span>{t('bettingStep2')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-neutral-500 mt-0.5">3.</span>
                    <span>{t('bettingStep3')}</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-neutral-500">
                {t('bettingScenarios')}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded bg-neutral-800">
                <Heart className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <div className="text-white font-medium">{t('welfareModeTitle')}</div>
                <Badge className="bg-white/20 text-white border border-white/30 mt-1">
                  Public Welfare Mode
                </Badge>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-neutral-400 text-sm leading-relaxed">
                {t('welfareModeDesc')}
              </p>
              <div className="p-3 bg-neutral-800 rounded border border-neutral-700">
                <div className="text-xs text-neutral-400 tracking-wider mb-2">{t('mechanismLabel')}</div>
                <div className="space-y-1.5 text-xs text-neutral-400">
                  <div className="flex items-start gap-2">
                    <span className="text-neutral-500 mt-0.5">1.</span>
                    <span>{t('welfareStep1')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-neutral-500 mt-0.5">2.</span>
                    <span>{t('welfareStep2')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-neutral-500 mt-0.5">3.</span>
                    <span>{t('welfareStep3')}</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-neutral-500">
                {t('welfareScenarios')}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-neutral-900 border-neutral-700 dash-card">
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center gap-2 text-neutral-400 text-sm mb-4">
            <Vote className="w-4 h-4" />
            <span className="tracking-wider">{t('votingRules')}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-800 rounded border border-neutral-700">
              <div className="text-xs text-neutral-400 tracking-wider mb-1">voting_currency</div>
              <div className="text-white text-sm font-medium">MCC (Microcosm Coin)</div>
              <div className="text-neutral-500 text-xs mt-1">{t('currencyDesc')}</div>
            </div>
            <div className="p-4 bg-neutral-800 rounded border border-neutral-700">
              <div className="text-xs text-neutral-400 tracking-wider mb-1">vote_weight</div>
              <div className="text-white text-sm font-medium">{t('voteWeight')}</div>
              <div className="text-neutral-500 text-xs mt-1">{t('voteWeightDesc')}</div>
            </div>
            <div className="p-4 bg-neutral-800 rounded border border-neutral-700">
              <div className="text-xs text-neutral-400 tracking-wider mb-1">min_participation</div>
              <div className="text-white text-sm font-medium">{t('minParticipation')}</div>
              <div className="text-neutral-500 text-xs mt-1">{t('minParticipationDesc')}</div>
            </div>
            <div className="p-4 bg-neutral-800 rounded border border-neutral-700">
              <div className="text-xs text-neutral-400 tracking-wider mb-1">foundation_fund</div>
              <div className="text-white text-sm font-medium">{t('foundationFund')}</div>
              <div className="text-neutral-500 text-xs mt-1">{t('foundationFundDesc')}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center py-8">
        <Construction className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
        <p className="text-neutral-500 text-sm">{t('comingSoon')}</p>
        <p className="text-neutral-500 text-xs mt-1">Coming Soon</p>
      </div>
    </div>
  )
}
