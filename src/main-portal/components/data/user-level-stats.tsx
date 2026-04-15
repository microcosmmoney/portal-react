// AI-generated · AI-managed · AI-maintained
"use client"

import { useUserLevelStats } from "../../hooks/useStats"
import { UserLevelPieChart } from "./charts"
import { useTranslations } from "next-intl"

const LEVEL_COLORS: Record<number, string> = {
  1: "#2DD4BF",
  2: "#14B8A6",
  3: "#0D9488",
  4: "#0F766E",
  5: "#115E59",
}

export function UserLevelStats() {
  const { data: stats, loading, error } = useUserLevelStats()
  const t = useTranslations("data")

  const getLevelDescription = (level: number): string => {
    const key = `levelDesc${level}` as const
    return t(key)
  }

  return (
    <section className="bg-muted/30 py-20 md:py-24 px-4 sm:px-6" aria-labelledby="user-level-title">
      <div className="max-w-7xl mx-auto">
        {}
        <header className="text-center mb-12 md:mb-16">
          <p className="font-mono text-xs sm:text-sm uppercase tracking-widest text-[#5EEAD4] mb-3 md:mb-4">
            USER DISTRIBUTION
          </p>
          <h2
            id="user-level-title"
            className="font-sans font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-4 md:mb-5 text-balance"
          >
            {t('userLevelDist')}
          </h2>
          <div className="max-w-3xl mx-auto space-y-2">
            <p className="font-mono text-sm sm:text-base text-foreground/60 text-balance">
              {t('userLevelDesc')}
            </p>
            <p className="font-mono text-xs sm:text-sm text-foreground/40 text-balance">
              {t('userLevelSubDesc')}
            </p>
          </div>
        </header>

        {loading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="blockchain-card border border-border/30 bg-background/50 rounded-lg p-4">
                  <div className="h-3 w-16 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-7 w-24 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-12 font-mono text-sm">
            {t('loadFailed')}: {error}
          </div>
        ) : stats ? (
          <>
            {}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-8">
              <OverviewCard label={t('totalUsers')} value={stats.total_users.toLocaleString()} highlight />
              <OverviewCard label={t('minerAndAbove')} value={stats.miners_and_above.toLocaleString()} highlightColor="blue" />
              <OverviewCard label={t('newToday')} value={`+${stats.new_users_today}`} highlight />
              <OverviewCard label={t('monthlyActiveRate')} value={`${stats.monthly_active_rate}%`} />
            </div>

            {}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
              {}
              <div className="blockchain-card border border-border/30 bg-background/50 rounded-lg p-4 sm:p-6">
                <h3 className="font-sans font-medium text-base sm:text-lg text-foreground mb-4 text-center">
                  {t('userLevelDistChart')}
                </h3>
                <div className="flex items-center justify-center h-[280px]">
                  <UserLevelPieChart data={stats.levels} className="w-full h-full" />
                </div>
              </div>

              {}
              <div className="blockchain-card border border-border/30 bg-background/50 rounded-lg p-4 sm:p-6">
                <h3 className="font-sans font-medium text-base sm:text-lg text-foreground mb-4">
                  {t('upgradeSystem')}
                </h3>
                <div className="space-y-1">
                  {stats.levels.map((level) => (
                    <div
                      key={level.level}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-background/70 transition-colors"
                    >
                      {}
                      <div
                        className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${LEVEL_COLORS[level.level] || '#5EEAD4'}15`, border: `1px solid ${LEVEL_COLORS[level.level] || '#5EEAD4'}25` }}
                      >
                        <span className="font-mono text-sm font-bold" style={{ color: LEVEL_COLORS[level.level] || '#5EEAD4' }}>
                          {level.level}
                        </span>
                      </div>

                      {}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-sans font-medium text-base text-foreground">{level.name}</span>
                          <span className="font-mono text-xs text-foreground/40">({level.chinese})</span>
                        </div>
                        <p className="font-mono text-xs text-foreground/40 truncate">
                          {getLevelDescription(level.level)}
                        </p>
                      </div>

                      {}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="w-16 h-1.5 bg-border/30 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.max(level.percentage, 2)}%`,
                              backgroundColor: LEVEL_COLORS[level.level] || '#5EEAD4'
                            }}
                          />
                        </div>
                        <span className="font-sans font-bold text-base text-foreground tabular-nums w-14 text-right">
                          {level.count.toLocaleString()}
                        </span>
                        <span className="font-mono text-xs text-foreground/40 w-12 text-right tabular-nums">
                          {level.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {}
                <div className="mt-4 p-3 bg-[#5EEAD4]/5 border border-[#5EEAD4]/15 rounded-lg">
                  <p className="font-mono text-xs sm:text-sm text-foreground/50">
                    <span className="text-[#5EEAD4] font-medium">{t('onchainVerification')}</span>
                    {t('onchainVerificationDesc')}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </section>
  )
}

function OverviewCard({
  label,
  value,
  highlight = false,
  highlightColor,
}: {
  label: string
  value: string
  highlight?: boolean
  highlightColor?: "blue"
}) {
  const colorClass = highlightColor === "blue"
    ? "text-[#5EBCD4]"
    : highlight
      ? "text-[#5EEAD4]"
      : "text-foreground"

  return (
    <div className="blockchain-card border border-border/30 bg-background/50 rounded-lg p-4 transition-colors duration-200 hover:bg-background/70 hover:border-border/50">
      <p className="font-mono text-xs sm:text-sm uppercase tracking-widest text-foreground/50 mb-1">
        {label}
      </p>
      <p className={`font-sans font-bold text-2xl sm:text-3xl tabular-nums ${colorClass}`}>
        {value}
      </p>
    </div>
  )
}
