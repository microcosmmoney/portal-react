// AI-generated · AI-managed · AI-maintained
"use client"

import { useState } from "react"
import { useMiningHistory } from "../../hooks/useStats"
import { MiningTrendChart } from "./charts"
import { useTranslations } from "next-intl"

export function MiningHistoryStats() {
  const [days, setDays] = useState(7)
  const { data: stats, loading, error } = useMiningHistory(days)
  const t = useTranslations("data")

  const formatLargeNumber = (num: number): string => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(2)}B`
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`
    return num.toLocaleString()
  }

  const formatAmount = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`
    return num.toLocaleString()
  }

  return (
    <section className="py-20 md:py-24 px-4 sm:px-6">
      <div className="max-w-[1400px] mx-auto">
        {}
        <header className="text-center mb-12 md:mb-16">
          <p className="font-mono text-xs sm:text-sm uppercase tracking-widest text-[#5EEAD4] mb-3 md:mb-4">
            MINTING HISTORY
          </p>
          <h2 className="font-sans font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-4 md:mb-5 text-balance">
            {t('miningHistory')}
          </h2>
          <p className="font-mono text-sm sm:text-base text-foreground/60 max-w-3xl mx-auto text-balance">
            {t('miningHistoryDesc')}
          </p>
        </header>

        {}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-background/50 border border-border/30 rounded-lg p-1">
            <button
              onClick={() => setDays(7)}
              className={`px-4 py-2 rounded-md font-mono text-sm font-medium transition-colors ${
                days === 7
                  ? "bg-[#5EEAD4]/15 text-[#5EEAD4] border border-[#5EEAD4]/25"
                  : "text-foreground/50 hover:text-foreground"
              }`}
            >
              {t('days7')}
            </button>
            <button
              onClick={() => setDays(30)}
              className={`px-4 py-2 rounded-md font-mono text-sm font-medium transition-colors ${
                days === 30
                  ? "bg-[#5EEAD4]/15 text-[#5EEAD4] border border-[#5EEAD4]/25"
                  : "text-foreground/50 hover:text-foreground"
              }`}
            >
              {t('days30')}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border border-border/30 bg-background/50 rounded-lg p-4 blockchain-card">
                  <div className="h-3 w-16 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-7 w-24 bg-muted animate-pulse rounded mb-1" />
                  <div className="h-3 w-12 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
            <div className="border border-border/30 bg-background/50 rounded-lg p-6 blockchain-card">
              <div className="h-[350px] bg-muted animate-pulse rounded" />
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-12 font-mono text-sm">
            {t('loadFailed')}: {error}
          </div>
        ) : stats ? (
          <>
            {}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-8">
              <SummaryCard
                label={t('usdcInput')}
                value={formatAmount(stats.summary.total_usdc)}
                sub={t('stablecoin')}
                highlight
              />
              <SummaryCard
                label={t('usdtInput')}
                value={formatAmount(stats.summary.total_usdt)}
                sub={t('stablecoin')}
                highlightColor="blue"
              />
              <SummaryCard
                label={t('mccMinted')}
                value={formatLargeNumber(stats.summary.total_mcc)}
                sub={t('tokenOutput')}
                highlight
              />
              <SummaryCard
                label={t('mcdMinted')}
                value={formatLargeNumber(stats.summary.total_mcd)}
                sub={t('creditsOutput')}
                highlightColor="blue"
              />
              <SummaryCard
                label={t('dailyAvgInput')}
                value={formatAmount(stats.summary.avg_daily)}
                sub="USDC+USDT"
              />
              <SummaryCard
                label={t('totalTx')}
                value={stats.summary.total_tx.toLocaleString()}
                sub={t('onchainRecords')}
              />
            </div>

            {}
            <div className="border border-border/30 bg-background/50 rounded-lg p-4 sm:p-6 blockchain-card">
              <h3 className="font-sans font-medium text-base sm:text-lg text-foreground mb-6">
                {days}{t('daysMintTrend')}
              </h3>
              <MiningTrendChart data={stats.history} className="h-[350px] w-full" />
            </div>

          </>
        ) : null}
      </div>
    </section>
  )
}

function SummaryCard({
  label,
  value,
  sub,
  highlight = false,
  highlightColor,
}: {
  label: string
  value: string
  sub: string
  highlight?: boolean
  highlightColor?: "blue"
}) {
  const colorClass = highlightColor === "blue"
    ? "text-[#5EBCD4]"
    : highlight
      ? "text-[#5EEAD4]"
      : "text-foreground"

  return (
    <div className="border border-border/30 bg-background/50 rounded-lg p-4 blockchain-card">
      <p className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-foreground/50 mb-1">
        {label}
      </p>
      <p className={`font-sans font-bold text-xl sm:text-2xl tabular-nums ${colorClass}`}>
        {value}
      </p>
      <p className="font-mono text-[10px] sm:text-xs text-foreground/40 mt-0.5 tabular-nums">{sub}</p>
    </div>
  )
}
