// AI-generated · AI-managed · AI-maintained
"use client"

import { useTerritoryStats, useMCCStats, useMCDStats, useUserGrowth } from "../../hooks/useStats"
import { useTranslations } from "next-intl"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const TerritoryIcons = {
  System: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#5EEAD4]">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  ),
  Sector: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#5EEAD4]">
      <path d="M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8L17 11V17L12 20L7 17V11L12 8Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Matrix: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#5EBCD4]">
      <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.5" rx="1" />
      <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.5" rx="1" />
      <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.5" rx="1" />
      <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.5" rx="1" />
    </svg>
  ),
  Station: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#5EBCD4]">
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}


const compactFormatter = new Intl.NumberFormat("zh-CN", {
  notation: "compact",
  compactDisplay: "short",
  maximumFractionDigits: 2,
})

export function TerritoryStats() {
  const { data: stats, loading, error } = useTerritoryStats()
  const { data: mccData } = useMCCStats()
  const { data: mcdData } = useMCDStats()
  const { data: growthData } = useUserGrowth(30)
  const t = useTranslations("data")

  const getIcon = (type: string) => {
    return TerritoryIcons[type as keyof typeof TerritoryIcons] || TerritoryIcons.Station
  }

  return (
    <section className="py-20 md:py-24 px-4 sm:px-6" aria-labelledby="territory-title">
      <div className="max-w-7xl mx-auto">
        {}
        <header className="text-center mb-12 md:mb-16">
          <p className="font-mono text-xs sm:text-sm uppercase tracking-widest text-[#5EEAD4] mb-3 md:mb-4">
            TERRITORY HIERARCHY
          </p>
          <h2
            id="territory-title"
            className="font-sans font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-4 md:mb-5 text-balance"
          >
            {t('territoryHierarchy')}
          </h2>
          <div className="max-w-3xl mx-auto space-y-2">
            <p className="font-mono text-sm sm:text-base text-foreground/60 text-balance">
              {t('territoryHierarchyDesc')}
            </p>
            <p className="font-mono text-xs sm:text-sm text-foreground/40 text-balance">
              {t('territoryHierarchySubDesc')}
            </p>
          </div>
        </header>

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="blockchain-card border border-border/30 bg-background/50 rounded-lg p-4">
                  <div className="h-3 w-16 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-7 w-24 bg-muted animate-pulse rounded mb-1" />
                  <div className="h-3 w-12 bg-muted animate-pulse rounded" />
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-8" role="list" aria-label={t('territoryHierarchy')}>
              <StatCard label={t('currentUsers')} value={stats.total_users_in_territories.toLocaleString()} sub={t('onchainRegistered')} highlight />
              <StatCard label={t('inTerritory')} value={stats.territories.reduce((a, tr) => a + (tr.population ?? 0), 0).toLocaleString()} sub={t('assignedTerritory')} highlight />
              <StatCard label={t('totalMinted')} value={compactFormatter.format(mccData?.circulating_supply ?? 0)} sub="MCC" highlightColor="blue" />
              <StatCard label={t('mintCount')} value={(mccData?.total_mining_count ?? 0).toLocaleString()} sub={t('onchainRecords')} />
              <StatCard label={t('vaultBalance')} value={compactFormatter.format(mcdData?.total_vault_balance ?? 0)} sub="MCD" highlightColor="blue" />
              <StatCard label={t('territoryTotal')} value={stats.territories.reduce((a, tr) => a + tr.total, 0).toString()} sub={t('activeTerritory')} />
            </div>

            {}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-8">
              {stats.territories.map((territory) => (
                <div
                  key={territory.type}
                  className="blockchain-card border border-border/30 bg-background/50 rounded-lg p-5 transition-colors duration-200 hover:bg-background/70 hover:border-border/50"
                >
                  <div className="flex items-center gap-3 mb-4">
                    {getIcon(territory.type)}
                    <div>
                      <h3 className="font-sans font-medium text-base text-foreground">{territory.type}</h3>
                      <p className="font-mono text-xs text-foreground/40">{territory.name}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-sm text-foreground/50">{t('totalCount')}</span>
                      <span className="font-sans font-bold text-xl text-foreground tabular-nums">{territory.total}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-sm text-foreground/50">{t('activeCount')}</span>
                      <span className="font-sans font-bold text-xl text-[#5EEAD4] tabular-nums">{territory.active}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-sm text-foreground/50">{t('population')}</span>
                      <span className="font-sans font-medium text-base text-foreground tabular-nums">{territory.population?.toLocaleString() || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
              <div className="blockchain-card border border-border/30 bg-background/50 rounded-lg p-4 sm:p-6 flex flex-col">
                <div className="flex justify-between items-baseline mb-4">
                  <h3 className="font-sans font-medium text-base sm:text-lg text-foreground">
                    {t('userGrowthTrend')}
                  </h3>
                  <span className="font-mono text-sm text-[#5EEAD4] font-bold tabular-nums">
                    {(growthData?.total_users ?? stats.total_users_in_territories).toLocaleString()}
                  </span>
                </div>
                <div className="flex-1 min-h-[260px]">
                  {growthData && growthData.history.length > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <AreaChart data={growthData.history} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                        <defs>
                          <linearGradient id="fillGrowth" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#5EEAD4" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="#5EEAD4" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }}
                          tickLine={false}
                          axisLine={false}
                          minTickGap={24}
                          tickFormatter={(v) => {
                            const d = new Date(v)
                            return `${d.getMonth() + 1}/${d.getDate()}`
                          }}
                        />
                        <YAxis
                          tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }}
                          tickLine={false}
                          axisLine={false}
                          width={32}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(23,23,23,0.95)",
                            border: "1px solid rgba(94,234,212,0.2)",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontFamily: "monospace",
                          }}
                          labelFormatter={(v) => `${v}`}
                          formatter={(value: number) => [value.toLocaleString(), t('currentOnchainUsers')]}
                        />
                        <Area
                          type="monotone"
                          dataKey="total_users"
                          stroke="#5EEAD4"
                          strokeWidth={2}
                          fill="url(#fillGrowth)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="font-mono text-3xl text-[#5EEAD4] font-bold tabular-nums">
                        {(stats.total_users_in_territories ?? 0).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {}
              <div className="blockchain-card border border-border/30 bg-background/50 rounded-lg p-4 sm:p-6">
                <h3 className="font-sans font-medium text-base sm:text-lg text-foreground mb-6">
                  {t('mcdEcoData')}
                </h3>
                <div className="space-y-4">
                  <div className="border border-border/30 bg-background/30 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono text-sm text-foreground/50">{t('mcdUsage')}</span>
                      <span className="font-mono text-xs text-foreground/30">{t('userToWhitelist')}</span>
                    </div>
                    <p className="font-sans font-bold text-2xl text-[#5EBCD4] tabular-nums">{compactFormatter.format(mcdData?.total_spent ?? 0)}</p>
                    <p className="font-mono text-xs text-foreground/40 mt-1">{t('spentToDeveloper')}</p>
                  </div>
                  <div className="border border-border/30 bg-background/30 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono text-sm text-foreground/50">{t('mcdAllocation')}</span>
                      <span className="font-mono text-xs text-foreground/30">{t('vaultToUser')}</span>
                    </div>
                    <p className="font-sans font-bold text-2xl text-[#5EEAD4] tabular-nums">{compactFormatter.format(mcdData?.user_balance ?? 0)}</p>
                    <p className="font-mono text-xs text-foreground/40 mt-1">{t('dailyAutoAllocation')}</p>
                  </div>
                  <div className="border border-border/30 bg-background/30 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono text-sm text-foreground/50">{t('vaultMcdBalance')}</span>
                      <span className="font-mono text-xs text-foreground/30">{t('allStationVaults')}</span>
                    </div>
                    <p className="font-sans font-bold text-2xl text-foreground tabular-nums">{compactFormatter.format(mcdData?.total_vault_balance ?? 0)}</p>
                    <p className="font-mono text-xs text-foreground/40 mt-1">{t('companionYieldInjection')}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </section>
  )
}

function StatCard({
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
    <div
      role="listitem"
      className="blockchain-card border border-border/30 bg-background/50 rounded-lg p-4 transition-colors duration-200 hover:bg-background/70 hover:border-border/50"
    >
      <p className="font-mono text-xs sm:text-sm uppercase tracking-widest text-foreground/50 mb-1">
        {label}
      </p>
      <p className={`font-sans font-bold text-2xl sm:text-3xl tabular-nums ${colorClass}`}>
        {value}
      </p>
      <p className="font-mono text-xs sm:text-sm text-foreground/40 mt-0.5 tabular-nums">{sub}</p>
    </div>
  )
}
