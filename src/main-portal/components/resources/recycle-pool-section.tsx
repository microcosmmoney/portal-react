// AI-generated · AI-managed · AI-maintained
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ArrowDownRight, ArrowUpRight, Shield, ExternalLink, Ban, RotateCcw, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMCCPrice } from "../../contexts/MCCPriceContext";

interface PoolStats {
  poolBalance: number;
  totalInflow: number;
  totalMarketMade: number;
  marketMadeMcc: number;
  avgPrice30d: number;
}

const POOL_ADDRESS = "REDEh89TzpwCtoWQuuNPtxskrVoUDQgowR7e7sZpWj9";

export function RecyclePoolSection() {
  const t = useTranslations("resources");
  const ticker = useMCCPrice();
  const [stats, setStats] = useState<PoolStats>({
    poolBalance: 0,
    totalInflow: 0,
    totalMarketMade: 0,
    marketMadeMcc: 0,
    avgPrice30d: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const [priceRes, poolRes] = await Promise.all([
        fetch("/api/buyback/price").then(r => r.json()).catch(() => null),
        fetch("/api/buyback/pool").then(r => r.json()).catch(() => null),
      ]);

      const basePrice = Number(priceRes?.data?.base_price) || ticker.price || 0;

      const usdcBal = Number(poolRes?.data?.usdc_balance) || 0;
      const usdtBal = Number(poolRes?.data?.usdt_balance) || 0;
      const totalBuyback = Number(poolRes?.data?.total_buyback) || 0;
      const totalMccBought = Number(poolRes?.data?.total_mcc_bought) || 0;

      setStats({
        poolBalance: usdcBal + usdtBal,
        totalInflow: (usdcBal + usdtBal) + totalBuyback,
        totalMarketMade: totalBuyback,
        marketMadeMcc: totalMccBought > 0 ? Math.round(totalMccBought) : 0,
        avgPrice30d: basePrice,
      });
    } catch {} finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const formatValue = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toFixed(2);
  };

  return (
    <section
      id="recycle"
      aria-labelledby="recycle-title"
      className="bg-muted/30 py-20 md:py-24 px-4 sm:px-6"
    >
      <div className="max-w-[1400px] mx-auto">
        {}
        <header className="text-center mb-12 md:mb-16">
          <p className="font-mono text-xs sm:text-sm uppercase tracking-widest text-[#5EEAD4] mb-3 md:mb-4">
            MARKET MAKING
          </p>
          <h2
            id="recycle-title"
            className="font-sans font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-4 md:mb-5 text-balance"
          >
            {t("recycleTitle")}
          </h2>
          <div className="max-w-3xl mx-auto space-y-2">
            <p className="font-mono text-sm sm:text-base text-foreground/60 text-balance">
              {t("recycleDesc1")}
            </p>
            <p className="font-mono text-xs sm:text-sm text-foreground/40 text-balance">
              {t("recycleDesc2")}
            </p>
          </div>
        </header>

        {}
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-8"
          role="list"
          aria-label={t("recycleAriaLabel")}
        >
          {loadingStats ? (
            <div className="col-span-full flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#5EEAD4]" />
            </div>
          ) : (
            <>
              <PoolStatCard label={t("stablecoinPool")} value={formatValue(stats.poolBalance)} sub="USDC+USDT" highlight />
              <PoolStatCard label={t("totalInflow")} value={formatValue(stats.totalInflow)} sub={t("mintInjection")} />
              <PoolStatCard label={t("totalMarketMade")} value={formatValue(stats.totalMarketMade)} sub={t("stablecoinSpent")} highlightColor="blue" />
              <PoolStatCard label={t("marketMadeMcc")} value={formatValue(stats.marketMadeMcc)} sub={t("historicalTotal")} />
              <PoolStatCard label={t("avg30dPrice")} value={stats.avgPrice30d.toFixed(2)} sub={t("marketPriceLabel")} highlightColor="blue" />
            </>
          )}
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 md:gap-6 mb-8">
          {}
          <Card className="bg-background/50 border-border/30 rounded-lg blockchain-card">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-foreground flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5 text-[#5EEAD4]" aria-hidden="true" />
                {t("poolContractAddress")}
              </CardTitle>
              <CardDescription className="text-foreground/60 text-sm">
                {t("poolContractDesc")}
              </CardDescription>
              {}
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#5EEAD4]/10 border border-[#5EEAD4]/20 font-mono text-[10px] text-[#5EEAD4]">
                  {t("x402Protocol")}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#5EBCD4]/10 border border-[#5EBCD4]/20 font-mono text-[10px] text-[#5EBCD4]">
                  {t("pdaSelfGoverning")}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-foreground/5 border border-foreground/10 font-mono text-[10px] text-foreground/50">
                  {t("onchainVerifiable")}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
              <div className="bg-muted/50 p-3 sm:p-4 rounded-lg">
                <p className="font-mono text-xs sm:text-sm text-foreground break-all select-all">
                  {POOL_ADDRESS}
                </p>
              </div>
              <a
                href={`https://solscan.io/account/${POOL_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-sm text-[#5EEAD4] hover:text-[#99F6E4] transition-colors duration-200 min-h-[44px] py-2"
              >
                {t("viewOnSolana")}
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
            </CardContent>
          </Card>
        </div>

        {}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          <FlowCard
            step={1}
            icon={<Ban className="w-5 h-5" />}
            title={t("zeroAllocationGenesis")}
            description={t("zeroAllocationDesc")}
            color="green"
          />
          <FlowCard
            step={2}
            icon={<ArrowDownRight className="w-5 h-5" />}
            title={t("mintInjectionTitle")}
            description={t("mintInjectionDesc")}
            color="blue"
          />
          <FlowCard
            step={3}
            icon={<ArrowUpRight className="w-5 h-5" />}
            title={t("marketMakingSupport")}
            description={t("marketMakingSupportDesc")}
            color="blue"
          />
          <FlowCard
            step={4}
            icon={<RotateCcw className="w-5 h-5" />}
            title={t("cyclicalRecurrence")}
            description={t("cyclicalRecurrenceDesc")}
            color="green"
          />
        </div>
      </div>
    </section>
  );
}

function PoolStatCard({
  label,
  value,
  sub,
  highlight = false,
  highlightColor,
}: {
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
  highlightColor?: "blue";
}) {
  const colorClass = highlightColor === "blue"
    ? "text-[#5EBCD4]"
    : highlight
      ? "text-[#5EEAD4]"
      : "text-foreground";

  return (
    <div
      role="listitem"
      className="border border-border/30 bg-background/50 rounded-lg p-4 transition-colors duration-200 hover:bg-background/70 hover:border-border/50"
    >
      <p className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-foreground/50 mb-1">
        {label}
      </p>
      <p className={`font-sans font-bold text-xl sm:text-2xl tabular-nums ${colorClass}`}>
        {value}
      </p>
      <p className="font-mono text-[10px] sm:text-xs text-foreground/40 mt-0.5 tabular-nums">{sub}</p>
    </div>
  );
}

function FlowCard({
  step,
  icon,
  title,
  description,
  color,
}: {
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "green" | "blue";
}) {
  const colorClasses = {
    green: {
      badge: "bg-[#5EEAD4]/15 text-[#5EEAD4] border-[#5EEAD4]/25",
      icon: "text-[#5EEAD4]",
    },
    blue: {
      badge: "bg-[#5EBCD4]/15 text-[#5EBCD4] border-[#5EBCD4]/25",
      icon: "text-[#5EBCD4]",
    },
  };

  const c = colorClasses[color];

  return (
    <div className="border border-border/30 bg-background/50 rounded-lg p-5 blockchain-card">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${c.badge}`}>
          <span className="font-mono text-sm font-bold">{step}</span>
        </div>
        <span className={c.icon} aria-hidden="true">{icon}</span>
      </div>
      <p className="font-sans font-medium text-sm sm:text-base text-foreground mb-1.5">{title}</p>
      <p className="font-mono text-[10px] sm:text-xs text-foreground/50 leading-relaxed">{description}</p>
    </div>
  );
}
