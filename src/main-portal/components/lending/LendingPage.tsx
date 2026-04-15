// AI-generated · AI-managed · AI-maintained
'use client'

import {
  Landmark,
  Wallet,
  CreditCard,
  Info,
} from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { useTranslations } from 'next-intl'

export default function LendingPage() {
  const t = useTranslations('lendingDash')

  const COLLATERAL_TYPES: Record<string, { value: number; label: string; description: string }> = {
    Station: { value: 1000, label: 'Station', description: t('stationDesc') },
    Matrix: { value: 15000, label: 'Matrix', description: t('matrixDesc') },
    Sector: { value: 200000, label: 'Sector', description: t('sectorDesc') },
    System: { value: 2500000, label: 'System', description: t('systemDesc') },
  }

  const formatNumber = (num: number, decimals = 2) =>
    num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

  return (
    <div className="max-w-7xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6 font-mono">
      <div>
        <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wider">{t('title')}</h1>
        <p className="text-xs sm:text-sm text-neutral-400">{t('subtitle')}</p>
      </div>

      <Card className="bg-neutral-900 border-neutral-700 dash-card">
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center gap-2 text-neutral-400 text-sm mb-4">
            <Wallet className="w-4 h-4" />
            <span className="tracking-wider">{t('myDeposits')}</span>
          </div>
          <div className="text-center py-8 text-neutral-500">
            <Wallet className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>{t('noDeposits')}</p>
            <p className="text-sm mt-1">{t('noDepositsHint')}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-700 dash-card">
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center gap-2 text-neutral-400 text-sm mb-4">
            <CreditCard className="w-4 h-4" />
            <span className="tracking-wider">{t('myLoans')}</span>
          </div>
          <div className="text-center py-8 text-neutral-500">
            <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>{t('noLoans')}</p>
            <p className="text-sm mt-1">{t('noLoansHint')}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-700 dash-card">
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center gap-2 text-neutral-400 text-sm mb-4">
            <Info className="w-4 h-4" />
            <span className="tracking-wider">{t('protocolInfo')}</span>
          </div>

          <div className="space-y-4 text-sm">
            <div className="p-4 bg-neutral-800 rounded">
              <div className="font-medium text-white mb-2">{t('loanRules')}</div>
              <ul className="list-disc list-inside space-y-1 text-neutral-400">
                <li>{t('loanRule1')}</li>
                <li>{t('loanRule2')}</li>
                <li>{t('loanRule3')}</li>
                <li>{t('loanRule4')}</li>
              </ul>
            </div>

            <div className="p-4 bg-neutral-800 rounded">
              <div className="font-medium text-white mb-2">{t('liquidationRules')}</div>
              <ul className="list-disc list-inside space-y-1 text-neutral-400">
                <li>{t('liquidationRule1')}</li>
                <li>{t('liquidationRule2')}</li>
                <li>{t('liquidationRule3')}</li>
              </ul>
            </div>

            <div className="p-4 bg-neutral-800 rounded">
              <div className="font-medium text-white mb-2">{t('nftValuation')}</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                {Object.entries(COLLATERAL_TYPES).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-neutral-400 text-xs">{value.description}</div>
                    <div className="text-white font-bold font-mono">{formatNumber(value.value)}</div>
                    <div className="text-neutral-500 text-xs">MCC</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
