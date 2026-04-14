'use client'

import { Component, type ReactNode, useState, useEffect, useRef } from 'react'
import { MicrocosmMarketBar } from './market-overview-bar'
import { MicrocosmQuickActions } from './quick-actions'
import { MicrocosmAssetsSummary } from './assets-summary'
import { MicrocosmPriceChart } from './price-chart'
import { MicrocosmMyMining } from './my-mining'
import { MicrocosmMiningWeight } from './mining-weight'
import { MicrocosmMintingStats } from './minting-stats'
import { MicrocosmEcosystemStats } from './ecosystem-stats'
import { MicrocosmMCCTokenStats } from './mcc-token-stats'
import { MicrocosmMCDStats } from './mcd-stats'
import { MicrocosmLockPeriods } from './lock-periods'
import { useTranslations } from '../../i18n-context'

class SafeRender extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  render() { return this.state.hasError ? null : this.props.children }
}

function CardSkeleton({ height = 'h-48' }: { height?: string }) {
  return (
    <div className={`backdrop-blur-md bg-white/5 border border-white/10 rounded-xl ${height} animate-pulse blockchain-card`}>
      <div className="p-6 space-y-3">
        <div className="h-3 bg-neutral-800 rounded w-24" />
        <div className="h-6 bg-neutral-800 rounded w-40" />
        <div className="h-4 bg-neutral-800 rounded w-32" />
      </div>
    </div>
  )
}

function LazySection({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') { setVisible(true); return }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return <div ref={ref}>{visible ? children : fallback}</div>
}

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16)
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`
}

export interface MicrocosmDashboardOverviewProps {
  basePath?: string
  onNavigate?: (path: string) => void
  showHeader?: boolean
  headerText?: string
  accentColor?: string
}

export function MicrocosmDashboardOverview({
  basePath = '',
  onNavigate,
  showHeader = true,
  headerText,
  accentColor,
}: MicrocosmDashboardOverviewProps) {
  const t = useTranslations('mccDashboard')
  const resolvedHeader = headerText ?? t('headerText', 'SHARED NETWORK · SHARED FUTURE')
  const rootStyle = accentColor
    ? { '--mc-accent': accentColor, '--mc-accent-rgb': hexToRgb(accentColor) } as React.CSSProperties
    : undefined

  return (
    <div className="max-w-7xl mx-auto font-mono px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6" style={rootStyle}>
      {showHeader && (
        <div className="text-center">
          <h1
            className={accentColor ? 'text-lg 2xs:text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight' : 'text-lg 2xs:text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200'}
            style={accentColor ? { backgroundImage: `linear-gradient(to right, ${accentColor}, ${accentColor}cc)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' } : undefined}
          >
            {resolvedHeader}
          </h1>
        </div>
      )}

      <SafeRender><MicrocosmMarketBar accentColor={accentColor} /></SafeRender>
      <SafeRender><MicrocosmQuickActions basePath={basePath} onNavigate={onNavigate} accentColor={accentColor} /></SafeRender>
      <SafeRender><MicrocosmAssetsSummary basePath={basePath} onNavigate={onNavigate} accentColor={accentColor} /></SafeRender>

      {}
      <SafeRender><MicrocosmPriceChart accentColor={accentColor} /></SafeRender>

      {}
      <LazySection fallback={
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-6"><CardSkeleton height="h-56" /><CardSkeleton height="h-56" /></div>
      }>
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-6">
          <SafeRender><MicrocosmMyMining detailsPath={`${basePath}/mcc/mining`} onNavigate={onNavigate} accentColor={accentColor} /></SafeRender>
          <SafeRender><MicrocosmMiningWeight accentColor={accentColor} /></SafeRender>
        </div>
      </LazySection>

      <LazySection fallback={
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-6"><CardSkeleton height="h-56" /><CardSkeleton height="h-56" /></div>
      }>
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-6">
          <SafeRender><MicrocosmMintingStats accentColor={accentColor} /></SafeRender>
          <SafeRender><MicrocosmEcosystemStats accentColor={accentColor} /></SafeRender>
        </div>
      </LazySection>

      <LazySection fallback={
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-6"><CardSkeleton /><CardSkeleton /></div>
      }>
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-6">
          <SafeRender><MicrocosmMCCTokenStats accentColor={accentColor} /></SafeRender>
          <SafeRender><MicrocosmMCDStats accentColor={accentColor} /></SafeRender>
        </div>
      </LazySection>

      <LazySection fallback={<CardSkeleton />}>
        <SafeRender><MicrocosmLockPeriods accentColor={accentColor} /></SafeRender>
      </LazySection>

      {}
      <div className="text-center py-4 space-y-1">
        <div className={accentColor ? 'text-xs font-mono' : 'text-xs text-cyan-400/60 font-mono'} style={accentColor ? { color: `rgba(${hexToRgb(accentColor)},0.6)` } : undefined}>
          Data refreshes every 4 hours · For real-time data, please check on-chain directly
        </div>
        <div className={accentColor ? 'text-xs font-mono' : 'text-xs text-cyan-400/60 font-mono'} style={accentColor ? { color: `rgba(${hexToRgb(accentColor)},0.6)` } : undefined}>
          \u6570\u636e\u6bcf 4 \u5c0f\u65f6\u66f4\u65b0 · \u5373\u65f6\u6570\u636e\u8bf7\u76f4\u63a5\u67e5\u8be2\u94fe\u4e0a
        </div>
        <div className={accentColor ? 'text-xs font-mono' : 'text-xs text-cyan-400/60 font-mono'} style={accentColor ? { color: `rgba(${hexToRgb(accentColor)},0.6)` } : undefined}>
          \u30c7\u30fc\u30bf\u306f4\u6642\u9593\u3054\u3068\u306b\u66f4\u65b0 · \u30ea\u30a2\u30eb\u30bf\u30a4\u30e0\u30c7\u30fc\u30bf\u306f\u30aa\u30f3\u30c1\u30a7\u30fc\u30f3\u3067\u78ba\u8a8d
        </div>
        <div className={accentColor ? 'text-xs font-mono' : 'text-xs text-cyan-400/60 font-mono'} style={accentColor ? { color: `rgba(${hexToRgb(accentColor)},0.6)` } : undefined}>
          \ub370\uc774\ud130\ub294 4\uc2dc\uac04\ub9c8\ub2e4 \uac31\uc2e0 · \uc2e4\uc2dc\uac04 \ub370\uc774\ud130\ub294 \uc628\uccb4\uc778\uc5d0\uc11c \ud655\uc778
        </div>
      </div>
    </div>
  )
}
