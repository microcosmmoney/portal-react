// AI-generated · AI-managed · AI-maintained
"use client";

import * as React from "react";
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../ui/chart";
import { Coins, Vault, Users, CalendarDays, BarChart3, Pickaxe, Loader2 } from "lucide-react";
import { useMCDStats } from "../../hooks/useStats";
import { useTranslations } from "next-intl";

const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short",
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const numberFormatter = new Intl.NumberFormat("en-US");

// distributionData will be built dynamically from API

const pieChartColors = {
  genesis: "hsl(168, 80%, 40%)",
  vaults: "hsl(166, 76%, 64%)",
  users: "hsl(190, 62%, 60%)",
  developer: "hsl(190, 62%, 60%)",
};


export function MCDStatsSection() {
  const t = useTranslations("resources");
  const { data: mcdData, loading } = useMCDStats();

  const pieChartConfig = {
    genesis: { label: t("genesisPool"), color: pieChartColors.genesis },
    vaults: { label: t("territoryVaultsLabel"), color: pieChartColors.vaults },
    users: { label: t("userHoldingLabel"), color: pieChartColors.users },
  } satisfies ChartConfig;

  const stats = {
    totalSupply: 10_000_000_000,
    genesisPool: mcdData?.genesis_pool_balance ?? 10_000_000_000,
    stationVaults: mcdData?.total_vault_balance ?? 0,
    userBalances: mcdData?.user_balance ?? 0,
    dailyDistribution: mcdData?.daily_distribution ?? 0,
    secondaryMarket: 0,
    mcdMiningUsed: 0,
    activeStations: mcdData?.active_vaults ?? 0,
    activeMiner: mcdData?.holders_count ?? 0,
  };

  const distributionData = [
    { name: "Genesis Pool", value: stats.genesisPool, color: "hsl(168, 80%, 40%)" },
    { name: "Station Vaults", value: stats.stationVaults, color: "hsl(166, 76%, 64%)" },
    { name: "User Balances", value: stats.userBalances, color: "hsl(195, 54%, 53%)" },
  ];

  const formatNumber = (num: number) => compactFormatter.format(num);
  const formatFullNumber = (num: number) => numberFormatter.format(num);

  const totalDistributed = stats.stationVaults + stats.userBalances;
  const distributionRatio = totalDistributed / stats.totalSupply;
  const distributionPercent = percentFormatter.format(distributionRatio);

  return (
    <section
      id="mcd"
      aria-labelledby="mcd-title"
      className="min-h-screen bg-background py-20 md:py-24 px-4 sm:px-6"
    >
      <div className="max-w-[1400px] mx-auto">
        {}
        <header className="text-center mb-12 md:mb-16">
          <p className="font-mono text-xs sm:text-sm uppercase tracking-widest text-[#5EEAD4] mb-3 md:mb-4">
            MCD CREDITS
          </p>
          <h2
            id="mcd-title"
            className="font-sans font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-4 md:mb-5 text-balance"
          >
            {t("mcdTitle")}
          </h2>
          <div className="max-w-3xl mx-auto space-y-2">
            <p className="font-mono text-sm sm:text-base text-foreground/60 text-balance">
              {t("mcdDesc1")}
            </p>
            <p className="font-mono text-xs sm:text-sm text-foreground/40 text-balance">
              {t("mcdDesc2")}
            </p>
          </div>
        </header>

        {}
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-8"
          role="list"
          aria-label={t("mcdStatsAriaLabel")}
        >
          <StatCard
            icon={<Coins className="w-4 h-4 sm:w-5 sm:h-5 text-[#5EEAD4]" />}
            label={t("totalSupply")}
            value={formatNumber(stats.totalSupply)}
            sublabel={t("fixedIssuance")}
          />
          <StatCard
            icon={<Vault className="w-4 h-4 sm:w-5 sm:h-5 text-[#5EEAD4]" />}
            label={t("vaultStorage")}
            value={formatNumber(stats.stationVaults)}
            sublabel={t("nStations", { count: formatFullNumber(stats.activeStations) })}
            highlight
          />
          <StatCard
            icon={<Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#5EBCD4]" />}
            label={t("userHolding")}
            value={formatNumber(stats.userBalances)}
            sublabel={t("nMiners", { count: formatFullNumber(stats.activeMiner) })}
            highlightColor="blue"
          />
          <StatCard
            icon={<CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-[#5EBCD4]" />}
            label={t("dailyDistributionLabel")}
            value={formatNumber(stats.dailyDistribution)}
            sublabel={t("dailyToMiners")}
            highlightColor="blue"
          />
          <StatCard
            icon={<BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-[#2DD4BF]" />}
            label={t("secondaryMarket")}
            value={formatNumber(stats.secondaryMarket)}
            sublabel={t("onchainCirculation")}
          />
          <StatCard
            icon={<Pickaxe className="w-4 h-4 sm:w-5 sm:h-5 text-[#2DD4BF]" />}
            label={t("mcdMinting")}
            value={formatNumber(stats.mcdMiningUsed)}
            sublabel={t("usedForMCCMint")}
          />
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
          {}
          <Card className="bg-background/50 border-border/30 rounded-lg blockchain-card">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-foreground text-lg sm:text-xl">{t("mcdDistribution")}</CardTitle>
              <CardDescription className="text-foreground/60 text-sm">
                {t("mcdDistributionDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <ChartContainer
                config={pieChartConfig}
                className="h-[240px] sm:h-[280px] w-full"
                aria-label={t("mcdDistributionChartLabel")}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={85}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value) => formatNumber(Number(value))}
                        />
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>

              {}
              <div
                className="grid grid-cols-2 gap-3 sm:gap-4 mt-4"
                role="list"
                aria-label={t("distributionLegendLabel")}
              >
                {distributionData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2" role="listitem">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-mono text-[10px] sm:text-xs text-foreground/60">{item.name}</p>
                      <p className="font-mono text-xs sm:text-sm text-foreground tabular-nums">
                        {formatNumber(item.value)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {}
          <Card className="bg-background/50 border-border/30 rounded-lg blockchain-card">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-foreground text-lg sm:text-xl">{t("mcdCurrentStatus")}</CardTitle>
              <CardDescription className="text-foreground/60 text-sm">
                {t("mcdCurrentStatusDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-6 h-6 animate-spin text-[#5EEAD4]" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-border/30 bg-background/50 rounded-lg p-4 text-center blockchain-card">
                      <p className="font-mono text-[10px] text-foreground/50 uppercase tracking-widest mb-1">{t("vaultStorageLabel")}</p>
                      <p className="font-sans font-bold text-2xl text-[#5EEAD4] tabular-nums">{formatNumber(stats.stationVaults)}</p>
                      <p className="font-mono text-[10px] text-foreground/40 mt-1">{t("activeVaults", { count: stats.activeStations })}</p>
                    </div>
                    <div className="border border-border/30 bg-background/50 rounded-lg p-4 text-center blockchain-card">
                      <p className="font-mono text-[10px] text-foreground/50 uppercase tracking-widest mb-1">{t("userHoldingLabel")}</p>
                      <p className="font-sans font-bold text-2xl text-[#5EBCD4] tabular-nums">{formatNumber(stats.userBalances)}</p>
                      <p className="font-mono text-[10px] text-foreground/40 mt-1">{t("nHolders", { count: stats.activeMiner })}</p>
                    </div>
                  </div>
                  <div className="border border-border/30 bg-background/50 rounded-lg p-4 text-center blockchain-card">
                    <p className="font-mono text-[10px] text-foreground/50 uppercase tracking-widest mb-1">{t("dailyDistributionRate")}</p>
                    <p className="font-sans font-bold text-xl text-foreground tabular-nums">
                      {mcdData?.daily_distribution_rate ? `${(mcdData.daily_distribution_rate * 100).toFixed(1)}%` : "1.0%"}
                    </p>
                    <p className="font-mono text-[10px] text-foreground/40 mt-1">{t("vaultDistributeToMiner")}</p>
                  </div>
                  <div className="flex items-center justify-center gap-6">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(166, 76%, 64%)" }} />
                      <span className="font-mono text-[10px] sm:text-xs text-foreground/60">{t("vaultStorageLabel")}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(190, 62%, 60%)" }} />
                      <span className="font-mono text-[10px] sm:text-xs text-foreground/60">{t("userHoldingLabel")}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 mb-8">
          <FlowStep
            number={1}
            title={t("companionMining")}
            description={t("companionMiningDesc")}
            color="green"
          />
          <FlowStep
            number={2}
            title={t("vaultAccumulation")}
            description={t("vaultAccumulationDesc")}
            color="green"
          />
          <FlowStep
            number={3}
            title={t("dailyDistribution")}
            description={t("dailyDistributionDesc")}
            color="blue"
          />
        </div>

        {}
        <Card className="bg-background/50 border-border/30 rounded-lg blockchain-card">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-foreground text-lg sm:text-xl">{t("distributionProgress")}</CardTitle>
            <CardDescription className="text-foreground/60 text-sm">
              {t("distributionProgressDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-0 text-sm">
                <span className="font-mono text-foreground/60">{t("distributed")}</span>
                <span className="font-mono text-foreground tabular-nums">
                  {formatNumber(totalDistributed)} / {formatNumber(stats.totalSupply)} ({distributionPercent})
                </span>
              </div>
              <div
                className="h-3 sm:h-4 bg-muted rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={Math.round(distributionRatio * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${t("distributionProgress")} ${distributionPercent}`}
              >
                <div
                  className="h-full bg-gradient-to-r from-[#14B8A6] to-[#5EEAD4] transition-all duration-500 ease-out"
                  style={{ width: `${distributionRatio * 100}%` }}
                />
              </div>
              <div
                className="grid grid-cols-3 gap-2 sm:gap-4 text-center"
                role="list"
                aria-label={t("mcdDistributionDetails")}
              >
                <div role="listitem">
                  <p className="font-mono text-[10px] sm:text-xs text-foreground/40">{t("genesisPoolRemaining")}</p>
                  <p className="font-mono text-xs sm:text-sm text-[#14B8A6] tabular-nums">{formatNumber(stats.genesisPool)}</p>
                </div>
                <div role="listitem">
                  <p className="font-mono text-[10px] sm:text-xs text-foreground/40">{t("territoryVaultsLabel")}</p>
                  <p className="font-mono text-xs sm:text-sm text-[#5EEAD4] tabular-nums">{formatNumber(stats.stationVaults)}</p>
                </div>
                <div role="listitem">
                  <p className="font-mono text-[10px] sm:text-xs text-foreground/40">{t("userHoldingLabel")}</p>
                  <p className="font-mono text-xs sm:text-sm text-[#5EBCD4] tabular-nums">{formatNumber(stats.userBalances)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  sublabel,
  highlight = false,
  highlightColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel: string;
  highlight?: boolean;
  highlightColor?: "blue";
}) {
  const colorClass = highlightColor === "blue"
    ? "text-[#5EBCD4]"
    : highlight
      ? "text-[#5EEAD4]"
      : "text-foreground";

  return (
    <Card
      className="bg-background/50 border-border/30 rounded-lg blockchain-card"
      role="listitem"
    >
      <CardContent className="p-4 sm:pt-6 sm:p-6">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
          <span aria-hidden="true">{icon}</span>
          <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-foreground/50">
            {label}
          </p>
        </div>
        <p className={`font-sans font-bold text-xl sm:text-2xl tabular-nums ${colorClass}`}>
          {value}
        </p>
        <p className="font-mono text-[10px] sm:text-xs text-foreground/40 mt-1 tabular-nums">{sublabel}</p>
      </CardContent>
    </Card>
  );
}

function FlowStep({
  number,
  title,
  description,
  color,
}: {
  number: number;
  title: string;
  description: string;
  color: "green" | "blue";
}) {
  const colorClasses = {
    green: "bg-[#5EEAD4]/15 text-[#5EEAD4] border-[#5EEAD4]/25",
    blue: "bg-[#5EBCD4]/15 text-[#5EBCD4] border-[#5EBCD4]/25",
  };

  return (
    <div className="border border-border/30 bg-background/50 rounded-lg p-5 blockchain-card">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center border mb-3 ${colorClasses[color]}`}
        aria-hidden="true"
      >
        <span className="font-mono text-sm font-bold">{number}</span>
      </div>
      <p className="font-sans font-medium text-sm sm:text-base text-foreground mb-1.5">{title}</p>
      <p className="font-mono text-[10px] sm:text-xs text-foreground/50 leading-relaxed">{description}</p>
    </div>
  );
}
