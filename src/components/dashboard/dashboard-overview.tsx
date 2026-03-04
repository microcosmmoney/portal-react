// AI-generated · AI-managed · AI-maintained
'use client'

import { Component, type ReactNode } from 'react'
import { MicrocosmMarketBar } from './market-overview-bar'
import { MicrocosmQuickActions } from './quick-actions'
import { MicrocosmAssetsSummary } from './assets-summary'
import { MicrocosmPriceChart } from './price-chart'
import { MicrocosmMintingStats } from './minting-stats'
import { MicrocosmMiningWeight } from './mining-weight'
import { MicrocosmLockPeriods } from './lock-periods'

class SafeRender extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  render() { return this.state.hasError ? null : this.props.children }
}

export interface MicrocosmDashboardOverviewProps {
  basePath?: string
  onNavigate?: (path: string) => void
  showHeader?: boolean
  headerText?: string
}

export function MicrocosmDashboardOverview({
  basePath = '',
  onNavigate,
  showHeader = true,
  headerText = 'SHARED NETWORK · SHARED FUTURE',
}: MicrocosmDashboardOverviewProps) {
  return (
    <div className="max-w-7xl mx-auto font-mono p-6 space-y-6">
      {showHeader && (
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">
            {headerText}
          </h1>
        </div>
      )}

      <SafeRender><MicrocosmMarketBar /></SafeRender>
      <SafeRender><MicrocosmQuickActions basePath={basePath} onNavigate={onNavigate} /></SafeRender>

      <div className="grid lg:grid-cols-2 gap-6">
        <SafeRender><MicrocosmAssetsSummary basePath={basePath} onNavigate={onNavigate} /></SafeRender>
        <SafeRender><MicrocosmPriceChart /></SafeRender>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <SafeRender><MicrocosmMintingStats /></SafeRender>
        <SafeRender><MicrocosmMiningWeight /></SafeRender>
      </div>

      <SafeRender><MicrocosmLockPeriods /></SafeRender>
    </div>
  )
}
