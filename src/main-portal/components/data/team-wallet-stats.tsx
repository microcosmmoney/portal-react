// AI-generated · AI-managed · AI-maintained
"use client"

import { useTeamWalletStats } from "../../hooks/useStats"
import { TeamWalletChart } from "./charts"
import { Copy, ExternalLink } from "lucide-react"
import { useState } from "react"
import { useTranslations } from "next-intl"

export function TeamWalletStats() {
  const { data: stats, loading, error } = useTeamWalletStats()
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)
  const t = useTranslations("data")

  const formatLargeNumber = (num: number): string => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(2)}B`
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`
    return num.toLocaleString()
  }

  const shortenAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyAddress = async (address: string) => {
    await navigator.clipboard.writeText(address)
    setCopiedAddress(address)
    setTimeout(() => setCopiedAddress(null), 2000)
  }

  return (
    <section className="py-20 md:py-24 px-4 sm:px-6" aria-labelledby="foundation-wallet-title">
      <div className="max-w-7xl mx-auto">
        {}
        <header className="text-center mb-12 md:mb-16">
          <p className="font-mono text-xs sm:text-sm uppercase tracking-widest text-[#5EEAD4] mb-3 md:mb-4">
            FOUNDATION WALLETS
          </p>
          <h2
            id="foundation-wallet-title"
            className="font-sans font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-4 md:mb-5 text-balance"
          >
            {t('foundationTitle')}
          </h2>
          <div className="max-w-3xl mx-auto space-y-2">
            <p className="font-mono text-sm sm:text-base text-foreground/60 text-balance">
              {t('foundationDesc')}
            </p>
            <p className="font-mono text-xs sm:text-sm text-foreground/40 text-balance">
              {t('foundationSubDesc')}
            </p>
          </div>
        </header>

        {loading ? (
          <div className="space-y-6">
            <div className="blockchain-card border border-border/30 bg-background/50 rounded-lg p-6">
              <div className="h-8 w-48 bg-muted animate-pulse rounded mb-6" />
              <div className="h-[300px] bg-muted animate-pulse rounded" />
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-12 font-mono text-sm">
            {t('loadFailed')}: {error}
          </div>
        ) : stats ? (
          <>
            {}
            <div className="blockchain-card border border-border/30 bg-background/50 rounded-lg p-4 sm:p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-sans font-medium text-base sm:text-lg text-foreground">{t('mccBalanceDist')}</h3>
                <div className="font-mono text-sm text-foreground/50">
                  {t('totalLabel')}: <span className="text-[#5EEAD4] font-medium">{formatLargeNumber(stats.total_mcc)} MCC</span>
                </div>
              </div>
              <TeamWalletChart data={stats.wallets} className="h-[300px]" />
            </div>

            {}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {stats.wallets.map((wallet) => (
                <div
                  key={wallet.key}
                  className="blockchain-card border border-border/30 bg-background/50 rounded-lg p-4 transition-colors duration-200 hover:bg-background/70 hover:border-border/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-sans font-medium text-base text-foreground">{wallet.label}</span>
                    <span className="font-mono text-xs text-foreground/40 tabular-nums">{wallet.percentage}%</span>
                  </div>

                  <p className="font-sans font-bold text-3xl text-[#5EEAD4] tabular-nums mb-3">
                    {formatLargeNumber(wallet.mcc_balance)}
                    <span className="text-base text-foreground/40 ml-1 font-normal">MCC</span>
                  </p>

                  {}
                  <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
                    <span className="font-mono text-sm text-foreground/50 flex-1 tabular-nums">
                      {shortenAddress(wallet.address)}
                    </span>
                    <button
                      onClick={() => copyAddress(wallet.address)}
                      className="p-1 hover:bg-background/50 rounded transition-colors"
                      title={t('copyAddress')}
                    >
                      <Copy className={`w-3.5 h-3.5 ${copiedAddress === wallet.address ? 'text-[#5EEAD4]' : 'text-foreground/40'}`} />
                    </button>
                    <a
                      href={`https://solscan.io/account/${wallet.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-background/50 rounded transition-colors"
                      title={t('viewOnSolscan')}
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-foreground/40 hover:text-[#5EEAD4]" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {}
            <div className="mt-8 p-4 bg-[#5EEAD4]/5 border border-[#5EEAD4]/15 rounded-lg">
              <p className="font-mono text-xs sm:text-sm text-foreground/50 leading-relaxed">
                <span className="text-[#5EEAD4] font-medium">{t('legalDisclaimer')}</span>
                {t('legalDisclaimerText')}
              </p>
            </div>

            {stats.updated_at && (
              <p className="font-mono text-xs text-foreground/30 text-center mt-4 tabular-nums">
                {t('dataUpdatedAt')} {new Date(stats.updated_at).toLocaleString()}
              </p>
            )}
          </>
        ) : null}
      </div>
    </section>
  )
}
