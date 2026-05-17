// AI-generated · AI-managed · AI-maintained
"use client";

import { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../ui/chart";
import { useMCCStats, useMiningHistory } from "../../hooks/useStats";
import { useMCCPrice } from "../../contexts/MCCPriceContext";
import { Loader2, ExternalLink, Lock } from "lucide-react";
import { useTranslations } from "next-intl";

// Labels are static English \u2014 ChartLegend/Tooltip uses i18n overrides in MCCChart
const chartConfig = {
  mcc: {
    label: "MCC",
    color: "hsl(221, 83%, 53%)",
  },
  usdc: {
    label: "Stablecoin",
    color: "hsl(212, 95%, 68%)",
  },
} satisfies ChartConfig;

const numberFormatter = new Intl.NumberFormat("zh-CN", {
  notation: "compact",
  compactDisplay: "short",
  maximumFractionDigits: 1,
});

const priceFormatter = new Intl.NumberFormat("zh-CN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

const percentFormatter = new Intl.NumberFormat("zh-CN", {
  style: "percent",
  minimumFractionDigits: 1,
});

type RangeSummary = { total_mcc: number; total_stablecoin: number };

export function MCCStatsSection() {
  const t = useTranslations("resources");
  const { data: mccData, loading: mccLoading } = useMCCStats();
  const [chartDays, setChartDays] = useState(30);
  const { data: miningData, loading: miningLoading } = useMiningHistory(chartDays);
  const ticker = useMCCPrice();
  const [rangeSummaries, setRangeSummaries] = useState<Record<number, RangeSummary>>({});

  useEffect(() => {
    const rangeDays = [30, 180, 365];
    rangeDays.forEach(async (d) => {
      try {
        const res = await fetch(`/api/stats/mining-history?days=${d}`);
        const json = await res.json();
        if (json.success && json.data?.summary) {
          setRangeSummaries(prev => ({
            ...prev,
            [d]: {
              total_mcc: json.data.summary.total_mcc,
              total_stablecoin: json.data.summary.total_stablecoin,
            },
          }));
        }
      } catch {}
    });
  }, []);

  const stats = {
    totalSupply: 1_000_000_000,
    minted: mccData?.circulating_supply ?? 0,
    currentPhase: (mccData?.current_phase ?? 0) + 1,
    marketPrice: ticker.price ?? 0,
    mintPrice: ticker.miningPrice ?? 0,
  };

  const mintedPercent = stats.minted / stats.totalSupply;
  const loading = mccLoading || miningLoading;

  return (
    <section
      id="mcc"
      aria-labelledby="mcc-title"
      className="min-h-screen bg-background py-20 md:py-24 px-4 sm:px-6"
    >
      <div className="max-w-[1400px] mx-auto">
        {}
        <header className="text-center mb-12 md:mb-16">
          <p className="font-mono text-xs sm:text-sm uppercase tracking-widest text-[#5EEAD4] mb-3 md:mb-4">
            MCC STATISTICS
          </p>
          <h2
            id="mcc-title"
            className="font-sans font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-3 md:mb-4 text-balance"
          >
            {t("mccStatsTitle")}
          </h2>
          <p className="font-mono text-sm sm:text-base text-foreground/60 max-w-2xl mx-auto leading-relaxed">
            {t("mccStatsSubtitle")}
          </p>
        </header>

        {}
        <div
          className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-12 md:mb-16"
          role="list"
          aria-label={t("mccStatsAriaLabel")}
        >
          <StatCard
            label={t("totalSupply")}
            value={numberFormatter.format(stats.totalSupply)}
            sublabel={t("neverInflate")}
          />
          <StatCard
            label={t("minted")}
            value={numberFormatter.format(stats.minted)}
            sublabel={percentFormatter.format(mintedPercent)}
            highlight
          />
          <StatCard
            label={t("currentPhase")}
            value={t("phaseN", { phase: stats.currentPhase })}
            sublabel={t("halvingCycle")}
          />
          <StatCard
            label={t("marketPrice")}
            value={stats.marketPrice > 0 ? `$${priceFormatter.format(stats.marketPrice)}` : "..."}
            sublabel={t("realTimePrice")}
            highlightColor="blue"
          />
          <StatCard
            label={t("mintPrice")}
            value={stats.mintPrice > 0 ? `$${priceFormatter.format(stats.mintPrice)}` : "..."}
            sublabel={t("currentMint")}
            highlight
          />
        </div>

        {}
        <MCCChart
          chartData={miningData?.history ?? []}
          loading={loading}
          totalTx={miningData?.summary?.total_tx ?? 0}
          rangeSummaries={rangeSummaries}
          activeDays={chartDays}
          onDaysChange={setChartDays}
        />

        {}
        <StreamFlowLockSection />

      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  sublabel,
  highlight = false,
  highlightColor,
}: {
  label: string;
  value: string;
  sublabel: string;
  highlight?: boolean;
  highlightColor?: "green" | "blue";
}) {
  const colorClass = highlightColor === "blue"
    ? "text-[#5EBCD4]"
    : highlight
      ? "text-[#5EEAD4]"
      : "text-foreground";

  return (
    <article
      role="listitem"
      className="border border-border/30 bg-background/50 rounded-lg p-4 md:p-6 blockchain-card"
    >
      <p className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-foreground/50 mb-1.5 md:mb-2">
        {label}
      </p>
      <p className={`font-sans font-bold text-xl sm:text-2xl md:text-3xl tabular-nums ${colorClass}`}>
        {value}
      </p>
      <p className="font-mono text-[10px] sm:text-xs text-foreground/40 mt-1 tabular-nums">
        {sublabel}
      </p>
    </article>
  );
}

const TIME_RANGES = [
  { days: 30, labelKey: "range30d" },
  { days: 180, labelKey: "range180d" },
  { days: 365, labelKey: "range1y" },
] as const;

function MCCChart({
  chartData,
  loading,
  totalTx,
  rangeSummaries,
  activeDays,
  onDaysChange,
}: {
  chartData: Array<{ date: string; total_mcc: number; usdc_amount: number; usdt_amount: number }>;
  loading: boolean;
  totalTx: number;
  rangeSummaries: Record<number, RangeSummary>;
  activeDays: number;
  onDaysChange: (days: number) => void;
}) {
  const t = useTranslations("resources");

  const filled = (() => {
    if (chartData.length === 0) return [];
    const sorted = [...chartData].sort((a, b) => a.date.localeCompare(b.date));
    const map = new Map(sorted.map(d => [d.date, d]));
    const start = new Date(sorted[0].date);
    const end = new Date();
    const result: Array<{ date: string; mcc: number; usdc: number }> = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().slice(0, 10);
      const row = map.get(key);
      result.push({
        date: key,
        mcc: row ? row.total_mcc : 0,
        usdc: row ? row.usdc_amount + row.usdt_amount : 0,
      });
    }
    return result;
  })();

  const fmtCompact = (n: number) => {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`;
    return n.toLocaleString();
  };

  return (
    <Card className="bg-background/50 border-border/30 blockchain-card py-0">
      <CardHeader className="flex flex-col items-stretch border-b border-border/30 p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle className="text-foreground">{t("dailyMintOutput")}</CardTitle>
          <CardDescription className="text-foreground/60">
            {t("dailyMintDesc", { count: totalTx })}
          </CardDescription>
        </div>
        <div className="flex">
          {TIME_RANGES.map((range) => {
            const isActive = activeDays === range.days;
            const s = rangeSummaries[range.days];
            return (
              <button
                key={range.days}
                data-active={isActive}
                className="relative z-10 flex flex-1 flex-col justify-center gap-1 border-t border-border/30 px-4 py-3 text-left even:border-l even:border-border/30 data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:border-border/30 sm:px-6 sm:py-4"
                onClick={() => onDaysChange(range.days)}
              >
                <span className="text-xs text-foreground/50">
                  {t(range.labelKey)}
                </span>
                {!s ? (
                  <span className="text-lg font-bold leading-none text-foreground/30 sm:text-2xl">...</span>
                ) : (
                  <>
                    <span className="text-lg font-bold leading-none tabular-nums sm:text-2xl" style={{ color: "hsl(221, 83%, 53%)" }}>
                      {fmtCompact(s.total_mcc)}
                    </span>
                    <span className="text-sm font-semibold leading-none tabular-nums mt-1" style={{ color: "hsl(212, 95%, 68%)" }}>
                      {fmtCompact(s.total_stablecoin)}
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 pb-6 sm:px-6 sm:pt-6 sm:pb-8">
        {loading ? (
          <div className="flex items-center justify-center h-[250px]">
            <Loader2 className="w-6 h-6 animate-spin text-[#5EEAD4]" />
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filled} margin={{ bottom: 20 }}>
              <defs>
                <linearGradient id="fillMCC" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-mcc)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-mcc)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillUSDC" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-usdc)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-usdc)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("zh-CN", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("zh-CN", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="usdc"
                type="natural"
                fill="url(#fillUSDC)"
                stroke="var(--color-usdc)"
                stackId="a"
              />
              <Area
                dataKey="mcc"
                type="natural"
                fill="url(#fillMCC)"
                stroke="var(--color-mcc)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

const STREAMFLOW_LOCKS = [
  { name: "Y1",  stream: "DH1WCckEtdxZJPD588oQEfb4wHXoaxqJ19MpUE2Jbhyf", total: 1_200_000,   monthly: 100_000,    periods: 12, cliffMonths: 0,   year: "2026" },
  { name: "Y2",  stream: "2TnJxCfxbFxeiJV1eUimi9PFsQgLRHBPV4P7JqZSPf6a", total: 2_400_000,   monthly: 200_000,    periods: 12, cliffMonths: 12,  year: "2027" },
  { name: "Y3",  stream: "Fj262ioHH3gt23WAeW1HTLJmg9qPhjv4D8oeqMnJzyRb", total: 4_800_000,   monthly: 400_000,    periods: 12, cliffMonths: 24,  year: "2028" },
  { name: "Y4",  stream: "69Yshu5JgxceqE6aLrkLEz5PQuFeLnP46xFd2nCFzQWY", total: 9_600_000,   monthly: 800_000,    periods: 12, cliffMonths: 36,  year: "2029" },
  { name: "Y5",  stream: "BUYad5uqQTGB5kGEQreoxnQ432XVaYcqgJSCL8v1AHYU", total: 19_200_000,  monthly: 1_600_000,  periods: 12, cliffMonths: 48,  year: "2030" },
  { name: "Y6",  stream: "CKCD19Q41yM4ULeoWWvfiHkFsCBRZ2zrq5fWQS8NAw7F", total: 38_400_000,  monthly: 3_200_000,  periods: 12, cliffMonths: 60,  year: "2031" },
  { name: "Y7",  stream: "DErJ2g3X3stH2jkeAuracUutfNQQ5gfwHPaysUbvjGsn", total: 76_800_000,  monthly: 6_400_000,  periods: 12, cliffMonths: 72,  year: "2032" },
  { name: "Y8",  stream: "93e1DnLwvHjWhmntggm9vSz9bbc25MiNWFZmscKXdPpy", total: 153_600_000, monthly: 12_800_000, periods: 12, cliffMonths: 84,  year: "2033" },
  { name: "Y9",  stream: "5isyXJXWJTAdrSacPkmgYL9eHzfdUvqKTwF4Lgra13r",  total: 307_200_000, monthly: 25_600_000, periods: 12, cliffMonths: 96,  year: "2034" },
  { name: "Y10", stream: "DeWpZu5YVkBckEQNVwToW3R286biv5Cs5p68rMhZkuyk", total: 386_700_000, monthly: 48_337_500, periods: 8,  cliffMonths: 108, year: "2035-36" },
];

const LOCK_START = new Date("2026-03-01T17:32:00Z");
const TOTAL_LOCKED = 999_900_000;
const POOL_PDA = "GSBWtaX9WcBh8jUcmbXtQ1afQPHKSUKvsTxkqpJU3G9S";

function getReleasedAmount(): { released: number; currentTranche: string } {
  const now = Date.now();
  const elapsed = now - LOCK_START.getTime();
  if (elapsed <= 0) return { released: 0, currentTranche: "Y1" };

  const PERIOD_MS = 30 * 24 * 3600 * 1000;
  let totalReleased = 0;
  let currentTranche = "Y1";

  for (const lock of STREAMFLOW_LOCKS) {
    const cliffMs = lock.cliffMonths * PERIOD_MS;
    if (elapsed <= cliffMs) continue;

    const timeSinceCliff = elapsed - cliffMs;
    const periodsElapsed = Math.min(Math.floor(timeSinceCliff / PERIOD_MS), lock.periods);
    const released = periodsElapsed * lock.monthly;
    totalReleased += Math.min(released, lock.total);

    if (periodsElapsed > 0 && periodsElapsed < lock.periods) {
      currentTranche = lock.name;
    }
  }

  return { released: totalReleased, currentTranche };
}

function StreamFlowLockSection() {
  const t = useTranslations("resources");
  const { released, currentTranche } = getReleasedAmount();
  const releasedPct = (released / TOTAL_LOCKED) * 100;
  const [miningVaultMcc, setMiningVaultMcc] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/blockchain-service/blockchain/balance/pool/reincarnation")
      .then(r => r.json())
      .then(res => {
        if (res?.success && res?.data?.mining_vault_mcc != null) {
          setMiningVaultMcc(Number(res.data.mining_vault_mcc));
        }
      })
      .catch(() => {});
  }, []);

  const fmtAmount = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return n.toLocaleString();
  };

  return (
    <div className="mt-12 md:mt-16">
      <Card className="bg-background/50 border-border/30 blockchain-card">
        <CardHeader className="border-b border-border/30 py-5">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-[#5EEAD4]" />
            <div>
              <CardTitle className="text-foreground">{t("streamflowTitle")}</CardTitle>
              <CardDescription className="text-foreground/60">
                {t("streamflowDesc")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-6">
          {}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="border border-border/30 bg-background/50 rounded-lg p-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 mb-1">{t("totalLocked")}</p>
              <p className="font-sans font-bold text-lg text-[#5EEAD4] tabular-nums">999.9M</p>
              <p className="font-mono text-[10px] text-foreground/40">MCC</p>
            </div>
            <div className="border border-border/30 bg-background/50 rounded-lg p-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 mb-1">{t("released")}</p>
              <p className="font-sans font-bold text-lg text-foreground tabular-nums">{fmtAmount(released)}</p>
              <p className="font-mono text-[10px] text-foreground/40">{releasedPct.toFixed(2)}%</p>
            </div>
            <div className="border border-border/30 bg-background/50 rounded-lg p-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 mb-1">{t("currentTranche")}</p>
              <p className="font-sans font-bold text-lg text-foreground">{currentTranche}</p>
              <p className="font-mono text-[10px] text-foreground/40">{t("releasing")}</p>
            </div>
            <div className="border border-border/30 bg-background/50 rounded-lg p-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 mb-1">{t("receiverAddress")}</p>
              <p className="font-sans font-bold text-sm text-foreground truncate" title={POOL_PDA}>{POOL_PDA.slice(0, 8)}...{POOL_PDA.slice(-4)}</p>
              <p className="font-mono text-[10px] text-foreground/40">Pool PDA</p>
            </div>
          </div>

          {}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-foreground/50">
              <span>{t("releaseProgress")}</span>
              <span>{fmtAmount(released)} / {fmtAmount(TOTAL_LOCKED)}</span>
            </div>
            <div className="w-full bg-border/30 rounded-full h-2.5">
              <div
                className="bg-[#5EEAD4] h-2.5 rounded-full transition-all duration-700"
                style={{ width: `${Math.max(releasedPct, 0.5)}%` }}
              />
            </div>
          </div>

          {}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left font-mono text-[10px] uppercase tracking-widest text-foreground/50 py-2 pr-6">{t("lockTablePeriod")}</th>
                  <th className="text-left font-mono text-[10px] uppercase tracking-widest text-foreground/50 py-2 pr-6">{t("lockTableYear")}</th>
                  <th className="text-right font-mono text-[10px] uppercase tracking-widest text-foreground/50 py-2 pr-6">{t("lockTableTotal")}</th>
                  <th className="text-right font-mono text-[10px] uppercase tracking-widest text-foreground/50 py-2 pr-6">{t("lockTableMonthly")}</th>
                  <th className="text-right font-mono text-[10px] uppercase tracking-widest text-foreground/50 py-2 pr-6">{t("lockTableVault")}</th>
                  <th className="text-left font-mono text-[10px] uppercase tracking-widest text-foreground/50 py-2 pl-2">{t("lockTableAddress")}</th>
                </tr>
              </thead>
              <tbody>
                {STREAMFLOW_LOCKS.map((lock) => {
                  const isActive = lock.name === currentTranche;
                  return (
                    <tr key={lock.name} className={`border-b border-border/20 ${isActive ? "bg-[#5EEAD4]/5" : ""}`}>
                      <td className={`py-2.5 pr-6 font-mono text-sm ${isActive ? "text-[#5EEAD4] font-bold" : "text-foreground/70"}`}>
                        {lock.name}
                        {isActive && <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#5EEAD4] animate-pulse" />}
                      </td>
                      <td className="py-2.5 pr-6 font-mono text-sm text-foreground/60">{lock.year}</td>
                      <td className="py-2.5 pr-6 font-mono text-sm text-foreground tabular-nums text-right">{fmtAmount(lock.total)}</td>
                      <td className="py-2.5 pr-6 font-mono text-sm text-foreground/60 tabular-nums text-right">{fmtAmount(lock.monthly)}{t("perMonth")}</td>
                      <td className="py-2.5 pr-6 font-mono text-sm tabular-nums text-right">
                        {isActive && miningVaultMcc !== null ? (
                          <span className="text-[#5EEAD4] font-bold">{fmtAmount(Math.round(miningVaultMcc))} MCC</span>
                        ) : (
                          <span className="text-foreground/20">\u2014</span>
                        )}
                      </td>
                      <td className="py-2.5 pl-2">
                        <a
                          href={`https://solscan.io/account/${lock.stream}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-xs text-[#5EEAD4]/70 hover:text-[#5EEAD4] transition-colors"
                        >
                          {lock.stream.slice(0, 8)}...{lock.stream.slice(-4)}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {}
          <div className="flex flex-wrap gap-2 text-[10px] font-mono text-foreground/40">
            <span className="px-2 py-1 rounded bg-border/20">cancelable = false</span>
            <span className="px-2 py-1 rounded bg-border/20">transferable = false</span>
            <span className="px-2 py-1 rounded bg-border/20">{t("lockCreated")}</span>
            <span className="px-2 py-1 rounded bg-border/20">MCC Mint: MCCn6eq...Csb</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
