'use client'

import { useTranslations } from '../../i18n-context'

export interface MicrocosmLendingPageProps {
  onNavigate?: (path: string) => void
}

function IconLandmark({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <line x1="3" y1="22" x2="21" y2="22" /><line x1="6" y1="18" x2="6" y2="11" /><line x1="10" y1="18" x2="10" y2="11" />
      <line x1="14" y1="18" x2="14" y2="11" /><line x1="18" y1="18" x2="18" y2="11" /><polygon points="12 2 20 7 4 7" />
    </svg>
  )
}

function IconWallet({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M19 7V4a1 1 0 00-1-1H5a2 2 0 000 4h15a1 1 0 011 1v4h-3a2 2 0 000 4h3a1 1 0 001-1v-2a1 1 0 00-1-1" />
      <path d="M3 5v14a2 2 0 002 2h15a1 1 0 001-1v-4" />
    </svg>
  )
}

function IconCreditCard({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  )
}

function IconInfo({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" /><path d="M12 8h.01" />
    </svg>
  )
}

const COLLATERAL_TYPES = [
  { label: 'Station', value: '1,000.00', description: 'Space Station (1,000 users)' },
  { label: 'Matrix', value: '15,000.00', description: 'Matrix (10 Stations)' },
  { label: 'Sector', value: '200,000.00', description: 'Sector (10 Matrices)' },
  { label: 'System', value: '2,500,000.00', description: 'System (10 Sectors)' },
]

export function MicrocosmLendingPage({ onNavigate }: MicrocosmLendingPageProps) {
  const t = useTranslations('lendingDash')
  return (
    <div className="max-w-7xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6 font-mono">
      <div>
        <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wider">{t('title', 'NFT Collateral Lending')}</h1>
        <p className="text-xs sm:text-sm text-neutral-400">{t('subtitle', 'Borrow MCC using territory NFTs as collateral')}</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-700 rounded-lg">
        <div className="p-3 sm:p-4 md:p-6">
          <div className="flex items-center gap-2 text-neutral-400 text-sm mb-4">
            <IconWallet className="w-4 h-4" />
            <span className="tracking-wider">{t('myDeposits', 'My Deposits')}</span>
          </div>
          <div className="text-center py-8 text-neutral-500">
            <IconWallet className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>{t('noDeposits', 'No deposits')}</p>
            <p className="text-sm mt-1">{t('noDepositsHint', 'Deposit MCC to earn interest')}</p>
          </div>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-700 rounded-lg">
        <div className="p-3 sm:p-4 md:p-6">
          <div className="flex items-center gap-2 text-neutral-400 text-sm mb-4">
            <IconCreditCard className="w-4 h-4" />
            <span className="tracking-wider">{t('myLoans', 'My Loans')}</span>
          </div>
          <div className="text-center py-8 text-neutral-500">
            <IconCreditCard className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>{t('noLoans', 'No loans')}</p>
            <p className="text-sm mt-1">{t('noLoansHint', 'Collateralize territory NFTs to borrow MCC')}</p>
          </div>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-700 rounded-lg">
        <div className="p-3 sm:p-4 md:p-6">
          <div className="flex items-center gap-2 text-neutral-400 text-sm mb-4">
            <IconInfo className="w-4 h-4" />
            <span className="tracking-wider">{t('protocolInfo', 'Protocol Info')}</span>
          </div>
          <div className="space-y-4 text-sm">
            <div className="p-4 bg-neutral-800 rounded">
              <div className="font-medium text-white mb-2">{t('loanRules', 'Loan Rules')}</div>
              <ul className="list-disc list-inside space-y-1 text-neutral-400">
                <li>{t('loanRule2', 'Collateral: Territory NFTs (Station/Matrix/Sector/System)')}</li>
                <li>{t('loanRule1', 'LTV (Loan-to-Value): Maximum 100%')}</li>
                <li>{t('loanRule3', 'Loan Asset: MCC Token')}</li>
                <li>{t('loanRule4', 'Repayment Cycle: 30 days')}</li>
              </ul>
            </div>
            <div className="p-4 bg-neutral-800 rounded">
              <div className="font-medium text-white mb-2">{t('liquidationRules', 'Liquidation Rules')}</div>
              <ul className="list-disc list-inside space-y-1 text-neutral-400">
                <li>{t('liquidationRule1', '3 consecutive missed payments triggers liquidation')}</li>
                <li>{t('liquidationRule2', 'Collateral NFT will be seized upon liquidation')}</li>
                <li>{t('liquidationRule3', 'Loan is automatically closed after liquidation')}</li>
              </ul>
            </div>
            <div className="p-4 bg-neutral-800 rounded">
              <div className="font-medium text-white mb-2">{t('nftValuation', 'NFT Valuation')}</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                {COLLATERAL_TYPES.map(ct => (
                  <div key={ct.label} className="text-center">
                    <div className="text-neutral-400 text-xs">{ct.description}</div>
                    <div className="text-white font-bold font-mono">{ct.value}</div>
                    <div className="text-neutral-500 text-xs">MCC</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
