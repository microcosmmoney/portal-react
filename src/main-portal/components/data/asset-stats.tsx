// AI-generated · AI-managed · AI-maintained
"use client"

import { useMCCStats, useMCDStats } from "../../hooks/useStats"
import { MCCSupplyChart } from "./charts"
import { useTranslations } from "next-intl"

export function AssetStats() {
  const { data: mccStats, loading: mccLoading } = useMCCStats()
  const { data: mcdStats, loading: mcdLoading } = useMCDStats()
  const t = useTranslations("data")

  const loading = mccLoading || mcdLoading

  const formatLargeNumber = (num: number): string => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(2)}B`
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`
    return num.toLocaleString()
  }

  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {}
        <div className="text-center mb-12">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-3">
            ASSET OVERVIEW
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('assetOverview')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('assetSubtitle')}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-card/50 border border-border/50 rounded-2xl p-6">
              <div className="h-8 w-48 bg-muted animate-pulse rounded mb-6" />
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-6 bg-muted animate-pulse rounded" />
                ))}
              </div>
            </div>
            <div className="bg-card/50 border border-border/50 rounded-2xl p-6">
              <div className="h-8 w-48 bg-muted animate-pulse rounded mb-6" />
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-6 bg-muted animate-pulse rounded" />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {}
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">MCC</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Microcosm Coin</h3>
                    <p className="text-sm text-muted-foreground">{t('platformToken')}</p>
                  </div>
                </div>

                {mccStats && (
                  <>
                    <div className="space-y-4">
                      <AssetRow label={t('totalSupply')} value={formatLargeNumber(mccStats.total_supply)} unit="MCC" />
                      <AssetRow label={t('minted')} value={formatLargeNumber(mccStats.circulating_supply)} unit="MCC" highlight />
                      <AssetRow label={t('genesisPool')} value={formatLargeNumber(mccStats.genesis_pool_balance)} unit="MCC" />
                      <AssetRow label={t('holdersCount')} value={mccStats.holders_count.toLocaleString()} unit={t('holdersUnit')} />
                      <AssetRow label={t('currentMiningDifficulty')} value={`${2 ** mccStats.current_phase}:1`} unit={`(${t('phaseLabel')} ${mccStats.current_phase})`} />
                      <AssetRow label={t('nextHalving')} value={formatLargeNumber(mccStats.remaining_to_halving)} unit={`MCC ${t('afterUnit')}`} />
                    </div>

                    {}
                    <div className="mt-6 pt-6 border-t border-border/50">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">{t('mintProgress')} ({t('phaseLabel')} {mccStats.current_phase})</span>
                        <span className="text-foreground font-medium">
                          {((mccStats.circulating_supply / mccStats.total_supply) * 100).toFixed(2)}%
                        </span>
                      </div>
                      <div className="h-3 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary via-primary to-cyan-300 rounded-full"
                          style={{ width: `${(mccStats.circulating_supply / mccStats.total_supply) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {t('halvingRemaining')} {formatLargeNumber(mccStats.remaining_to_halving)} MCC
                      </p>
                    </div>

                    {}
                    <div className="mt-6 pt-6 border-t border-border/50">
                      <p className="text-sm text-muted-foreground mb-4 text-center">{t('supplyDistribution')}</p>
                      <MCCSupplyChart
                        circulating={mccStats.circulating_supply}
                        remaining={mccStats.genesis_pool_balance}
                        className="h-[180px]"
                      />
                    </div>
                  </>
                )}
              </div>

              {}
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center">
                    <span className="text-cyan-300 font-bold text-lg">MCD</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Microcosm Dollar</h3>
                    <p className="text-sm text-muted-foreground">{t('onchainCredits')}</p>
                  </div>
                </div>

                {mcdStats && (
                  <>
                    <div className="space-y-4">
                      <AssetRow label={t('totalSupply')} value={formatLargeNumber(mcdStats.total_supply)} unit="MCD" />
                      <AssetRow label={t('circulatingSupply')} value={formatLargeNumber(mcdStats.circulating_supply)} unit="MCD" />
                      <AssetRow label={t('vaultLocked')} value={formatLargeNumber(mcdStats.total_vault_balance)} unit="MCD" highlight />
                      <AssetRow label={t('userHeld')} value={formatLargeNumber(mcdStats.user_balance)} unit="MCD" />
                      <AssetRow label={t('dailyDistribution')} value={formatLargeNumber(mcdStats.daily_distribution)} unit="MCD" />
                      <AssetRow label={t('activeVaults')} value={mcdStats.active_vaults.toLocaleString()} unit={t('vaultUnit')} />
                    </div>

                    {}
                    <div className="mt-6 pt-6 border-t border-border/50">
                      <p className="text-sm text-muted-foreground mb-3">{t('vaultMcdDaily')}</p>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-secondary/50 rounded-lg p-3 text-center">
                          <p className="text-lg font-bold text-foreground">{(mcdStats.daily_distribution_rate * 100).toFixed(0)}%</p>
                          <p className="text-xs text-muted-foreground">{t('dailyDistRate')}</p>
                        </div>
                        <div className="bg-secondary/50 rounded-lg p-3 text-center">
                          <p className="text-lg font-bold text-foreground">{mcdStats.holders_count.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{t('holdersCountLabel')}</p>
                        </div>
                        <div className="bg-secondary/50 rounded-lg p-3 text-center">
                          <p className="text-lg font-bold text-foreground">
                            {mcdStats.holders_count > 0
                              ? (mcdStats.daily_distribution / mcdStats.holders_count).toFixed(2)
                              : '0.00'}
                          </p>
                          <p className="text-xs text-muted-foreground">{t('avgPerPerson')}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {}
            <div className="mt-8 bg-card/30 border border-border/50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">{t('distributionTitle')}</h3>
              <p className="text-sm text-muted-foreground mb-6">
                {t('distributionDesc')}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <DistributionCard
                  percentage={50}
                  label={t('distUser')}
                  description={t('distUserDesc')}
                  color="bg-primary"
                />
                <DistributionCard
                  percentage={10}
                  label={t('distTeam')}
                  description={t('distTeamDesc')}
                  color="bg-cyan-400"
                />
                <DistributionCard
                  percentage={10}
                  label={t('distMagistrate')}
                  description={t('distMagistrateDesc')}
                  color="bg-cyan-400"
                />
                <DistributionCard
                  percentage={10}
                  label={t('distDeveloperMcd')}
                  description={t('distDeveloperMcdDesc')}
                  color="bg-cyan-400"
                />
                <DistributionCard
                  percentage={20}
                  label={t('distTerritoryVault')}
                  description={t('distTerritoryVaultDesc')}
                  color="bg-cyan-400"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function AssetRow({
  label,
  value,
  unit,
  highlight
}: {
  label: string
  value: string
  unit: string
  highlight?: boolean
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`font-medium ${highlight ? "text-primary" : "text-foreground"}`}>
        {value} <span className="text-muted-foreground text-sm">{unit}</span>
      </span>
    </div>
  )
}

function DistributionCard({
  percentage,
  label,
  description,
  color
}: {
  percentage: number
  label: string
  description: string
  color: string
}) {
  return (
    <div className="bg-card/50 border border-border/50 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-3 h-3 rounded-full ${color}`} />
        <span className="text-2xl font-bold text-foreground">{percentage}%</span>
      </div>
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  )
}
