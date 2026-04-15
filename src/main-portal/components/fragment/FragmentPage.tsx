// AI-generated · AI-managed · AI-maintained
'use client'

import {
  Puzzle,
  Wallet,
  Info,
  ImageIcon,
} from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { useTranslations } from 'next-intl'

export default function FragmentPage() {
  const t = useTranslations('fragmentDash')

  return (
    <div className="max-w-7xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6 font-mono">
      <div>
        <h1 className="text-lg sm:text-2xl font-bold text-white">{t('title')}</h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">{t('subtitle')}</p>
      </div>

      <Card className="bg-neutral-900 border-neutral-700 dash-card">
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center gap-2 text-neutral-400 text-sm mb-4">
            <Wallet className="w-4 h-4" />
            <span>{t('myHoldings')}</span>
          </div>
          <div className="text-center py-8 text-neutral-400">
            <Puzzle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>{t('noHoldings')}</p>
            <p className="text-sm mt-1">{t('noHoldingsHint')}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-700 dash-card">
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center gap-2 text-neutral-400 text-sm mb-4">
            <ImageIcon className="w-4 h-4" />
            <span>{t('fragmentVaults')}</span>
          </div>
          <div className="text-center py-8 text-neutral-400">
            <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>{t('noVaults')}</p>
            <p className="text-sm mt-1">{t('noVaultsHint')}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-700 dash-card">
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center gap-2 text-neutral-400 text-sm mb-4">
            <Info className="w-4 h-4" />
            <span>{t('protocolInfo')}</span>
          </div>

          <div className="space-y-4 text-sm">
            <div className="p-4 bg-neutral-800 rounded border border-neutral-700">
              <div className="font-medium text-white mb-2">{t('whatIsFragmentation')}</div>
              <p className="text-neutral-400">{t('fragmentationDesc')}</p>
            </div>

            <div className="p-4 bg-neutral-800 rounded border border-neutral-700">
              <div className="font-medium text-white mb-2">{t('fragmentRights')}</div>
              <ul className="list-disc list-inside space-y-1 text-neutral-400">
                <li>{t('fragmentRight1')}</li>
                <li>{t('fragmentRight2')}</li>
                <li>{t('fragmentRight3')}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
