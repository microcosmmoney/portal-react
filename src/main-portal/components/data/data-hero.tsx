// AI-generated · AI-managed · AI-maintained
"use client"

import { useEffect, useState } from "react"
import { useOverviewStats } from "../../hooks/useStats"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

export function DataHero() {
  const [svgContent, setSvgContent] = useState<string>("")
  const [mounted, setMounted] = useState(false)
  const { data: stats, loading, error } = useOverviewStats()
  const t = useTranslations("data")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const loadSVG = async () => {
      try {
        const response = await fetch("/map-dark.svg")
        const svgText = await response.text()
        setSvgContent(svgText)
      } catch (error) {
        console.error("Failed to load SVG:", error)
      }
    }

    if (mounted) {
      loadSVG()
    }
  }, [mounted])

  useEffect(() => {
    if (svgContent) {
      const timer = setTimeout(() => {
        const rects = document.querySelectorAll("#zion-map rect")

        rects.forEach((rect) => {
          const duration = Math.random() * 1.5 + 0.5
          const delay = Math.random() * 1

          rect.setAttribute(
            "style",
            `animation: glimmer ${duration}s ease-in-out ${delay}s infinite alternate;`
          )
        })

        if (!document.getElementById("glimmer-style")) {
          const style = document.createElement("style")
          style.id = "glimmer-style"
          style.textContent = `
            @keyframes glimmer {
              0% { opacity: 1; }
              100% { opacity: 0.1; }
            }
          `
          document.head.appendChild(style)
        }
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [svgContent])

  const formatNumber = (num: number): string => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString()
  }

  const formatCurrency = (num: number): string => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`
    return `$${num.toLocaleString()}`
  }

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-primary/5" />

      {}
      <div className="absolute inset-0 flex items-center justify-center opacity-50" style={{ transform: 'translateY(140px) scale(1.2)' }}>
        {svgContent ? (
          <div
            id="zion-map"
            className="w-full h-full max-w-[1400px] flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <div className="w-[800px] h-[500px] bg-muted/20 animate-pulse rounded-lg" />
        )}
      </div>

      {}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">
          MICROCOSM NETWORK STATUS
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
          {t('heroTitle')}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          {t('heroSubtitle')}
        </p>

        {}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-12">
          {loading ? (
            <>
              <QuickStatSkeleton />
              <QuickStatSkeleton />
              <QuickStatSkeleton />
              <QuickStatSkeleton />
            </>
          ) : error ? (
            <div className="col-span-4 text-center text-red-400">
              {t('loadFailed')}: {error}
            </div>
          ) : stats ? (
            <>
              <QuickStat
                label={t('activeUsers')}
                value={formatNumber(stats.total_users)}
                change={`+${stats.new_users_today} ${t('today')}`}
              />
              <QuickStat
                label={t('totalTerritories')}
                value={formatNumber(stats.total_territories)}
                change={`${t('active')} ${stats.active_users_24h}`}
              />
              <QuickStat
                label={t('mccCirculating')}
                value={formatNumber(stats.mcc_circulating)}
                change={t('onchainVerified')}
              />
              <QuickStat
                label="MCD"
                value={formatNumber(stats.mcd_locked)}
                change="Vault Total"
              />
            </>
          ) : null}
        </div>

        {}
        {stats?.updated_at && (
          <p className="text-xs text-muted-foreground mt-6">
            {t('dataUpdatedAt')} {new Date(stats.updated_at).toLocaleString()}
          </p>
        )}
      </div>

      {}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}

function QuickStat({ label, value, change }: { label: string; value: string; change: string }) {
  const isPositive = change.startsWith("+") || change.includes("today") || change.includes("active") || change.includes("\u4eca\u65e5") || change.includes("\u6d3b\u8dc3")

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 sm:p-5">
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl sm:text-3xl font-bold text-foreground">{value}</p>
      <p className={`text-xs mt-1 ${isPositive ? "text-primary" : "text-muted-foreground"}`}>
        {change}
      </p>
    </div>
  )
}

function QuickStatSkeleton() {
  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 sm:p-5">
      <div className="h-3 w-16 bg-muted animate-pulse rounded mb-2" />
      <div className="h-8 w-24 bg-muted animate-pulse rounded mb-2" />
      <div className="h-3 w-12 bg-muted animate-pulse rounded" />
    </div>
  )
}
