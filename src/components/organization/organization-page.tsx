'use client'

import { useState } from 'react'
import { useOrganizationSummary, useDashboardUserStats } from '@microcosmmoney/auth-react'

export interface MicrocosmOrganizationPageProps {
  basePath?: string
  onNavigate?: (path: string) => void
}

const IconUsers = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const IconNetwork = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="16" y="16" width="6" height="6" rx="1" />
    <rect x="2" y="16" width="6" height="6" rx="1" />
    <rect x="9" y="2" width="6" height="6" rx="1" />
    <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
    <path d="M12 12V8" />
  </svg>
)

const IconBuilding = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" />
    <path d="M16 6h.01" />
    <path d="M12 6h.01" />
    <path d="M12 10h.01" />
    <path d="M12 14h.01" />
    <path d="M16 10h.01" />
    <path d="M16 14h.01" />
    <path d="M8 10h.01" />
    <path d="M8 14h.01" />
  </svg>
)

const IconCrown = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
    <path d="M5 21h14" />
  </svg>
)

const IconGlobe = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
)

const IconMap = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m3 7 6-3 6 3 6-3v13l-6 3-6-3-6 3Z" />
    <path d="M9 4v13" />
    <path d="M15 7v13" />
  </svg>
)

const IconGrid = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M3 9h18" />
    <path d="M3 15h18" />
    <path d="M9 3v18" />
    <path d="M15 3v18" />
  </svg>
)

const IconPickaxe = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.531 12.469 6.619 20.38a1 1 0 1 1-3-3l7.912-7.912" />
    <path d="M15.686 4.314A12.5 12.5 0 0 0 5.461 2.958l-.834 2.22a5.25 5.25 0 0 0 4.626 7.065l.172-.003a5.25 5.25 0 0 0 5.022-3.89l.39-1.507a12.5 12.5 0 0 0 .849-2.53Z" />
  </svg>
)

const IconCompass = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
)

const IconUserCheck = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <polyline points="16 11 18 13 22 9" />
  </svg>
)

const IconUserX = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="17" x2="22" y1="8" y2="13" />
    <line x1="22" x2="17" y1="8" y2="13" />
  </svg>
)

const IconLayers = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
    <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
    <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
  </svg>
)

const fmt = (n: number) => n.toLocaleString('en-US')

const formatMCD = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`
  return value.toLocaleString('en-US')
}

function Spinner() {
  return <span className="inline-block w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
}

function FlipCard({ front, back }: { front: React.ReactNode; back: React.ReactNode }) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div style={{ perspective: '1500px' }}>
      <div
        className="relative w-full cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div
          className="group relative overflow-hidden rounded-lg border border-neutral-700 bg-neutral-900 hover:border-cyan-400/50 transition-colors"
          style={{
            backfaceVisibility: 'hidden',
            display: isFlipped ? 'none' : undefined,
          }}
        >
          <div className="relative z-10 p-2 2xs:p-3 sm:p-4 md:p-6">{front}</div>
        </div>

        <div
          className="overflow-hidden rounded-lg border border-cyan-400/30 bg-neutral-900"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: isFlipped ? undefined : 'none',
          }}
        >
          <div className="relative z-10 p-2 2xs:p-3 sm:p-4 md:p-6">{back}</div>
        </div>
      </div>
    </div>
  )
}

export function MicrocosmOrganizationPage({ basePath = '', onNavigate }: MicrocosmOrganizationPageProps) {
  const { data: summary, loading: summaryLoading } = useOrganizationSummary()
  const { data: userStats, loading: userStatsLoading } = useDashboardUserStats()

  const loading = summaryLoading || userStatsLoading
  const org = summary as any
  const us = userStats as any

  const totalUsers = us?.total_users ?? org?.total_members ?? 0
  const miners = us?.by_level?.miner ?? 0
  const commanders = us?.by_level?.commander ?? 0
  const pioneers = us?.by_level?.pioneer ?? 0
  const unassigned = Math.max(0, totalUsers - miners - commanders - pioneers)

  const stationCount = org?.total_stations ?? 0
  const matrixCount = org?.total_matrices ?? 0
  const sectorCount = org?.total_sectors ?? 0
  const systemCount = org?.total_systems ?? 0

  const totalVaultMCD = org?.total_vault_mcd ?? 0

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-2 py-3 space-y-2 2xs:px-3 2xs:py-4 2xs:space-y-3 sm:px-6 sm:py-6 sm:space-y-6">
        <div className="min-w-0">
          <h1 className="text-base 2xs:text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-wider truncate">Organization</h1>
          <p className="text-[10px] 2xs:text-xs sm:text-sm text-neutral-400 mt-1">Ecosystem structure & territory management</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <Spinner />
          <span className="ml-3 text-neutral-400 text-xs 2xs:text-sm">Loading organization data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-2 py-3 space-y-2 2xs:px-3 2xs:py-4 2xs:space-y-3 sm:px-6 sm:py-6 sm:space-y-6">
      {}
      <div className="min-w-0">
        <h1 className="text-base 2xs:text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-wider truncate">Organization</h1>
        <p className="text-[10px] 2xs:text-xs sm:text-sm text-neutral-400 mt-1">Ecosystem structure & territory management</p>
      </div>

      {}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-2 2xs:p-3 sm:p-4 md:p-6 hover:border-cyan-400/50 transition-colors">
        <div className="mb-1.5 2xs:mb-2 sm:mb-3 md:mb-4 flex items-center gap-1.5 2xs:gap-2 sm:gap-3 min-w-0">
          <IconUsers size={18} className="text-cyan-400 shrink-0" />
          <div className="min-w-0">
            <div className="text-xs 2xs:text-sm sm:text-base font-bold text-cyan-400 tracking-wide truncate">User Statistics</div>
            <div className="text-[8px] 2xs:text-[9px] sm:text-[10px] text-neutral-500 font-mono tracking-wider truncate">User Statistics</div>
          </div>
        </div>
        <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-5 gap-1.5 2xs:gap-2 sm:gap-3">
          {[
            { label: 'Total Users', value: totalUsers, icon: <IconUsers size={14} className="text-cyan-400/70 shrink-0" /> },
            { label: 'Miner', value: miners, icon: <IconPickaxe size={14} className="text-cyan-400/70 shrink-0" /> },
            { label: 'Commander', value: commanders, icon: <IconUserCheck size={14} className="text-cyan-400/70 shrink-0" /> },
            { label: 'Pioneer', value: pioneers, icon: <IconCompass size={14} className="text-cyan-400/70 shrink-0" /> },
            { label: 'Unassigned', value: unassigned, icon: <IconUserX size={14} className="text-cyan-400/70 shrink-0" /> },
          ].map(({ label, value, icon }) => (
            <div key={label} className="p-2 2xs:p-3 bg-neutral-800 rounded border border-neutral-700 min-w-0">
              <div className="flex items-center gap-1 2xs:gap-1.5 mb-1 min-w-0">
                {icon}
                <span className="text-[10px] 2xs:text-xs text-cyan-400/70 tracking-wider truncate">{label}</span>
              </div>
              <div className="text-base 2xs:text-lg xs:text-xl sm:text-2xl font-bold text-white font-mono truncate">{fmt(value)}</div>
            </div>
          ))}
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 2xs:gap-2 sm:gap-3 md:gap-4">
        {}
        <FlipCard
          front={
            <>
              <div className="mb-2 2xs:mb-3 sm:mb-4 flex items-center gap-1.5 2xs:gap-2 sm:gap-3 min-w-0">
                <IconNetwork size={18} className="text-cyan-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs 2xs:text-sm sm:text-base font-bold text-cyan-400 tracking-wide truncate">Territory Distribution</div>
                  <div className="text-[8px] 2xs:text-[9px] sm:text-[10px] text-neutral-500 font-mono tracking-wider truncate">Territory Distribution</div>
                </div>
              </div>
              <div className="grid grid-cols-2 2xs:grid-cols-4 gap-1.5 2xs:gap-2 sm:gap-3">
                {[
                  { label: 'Station', count: stationCount, icon: <IconBuilding size={18} className="text-cyan-400/70 mx-auto mb-1 2xs:mb-2" /> },
                  { label: 'Matrix', count: matrixCount, icon: <IconGrid size={18} className="text-cyan-400/70 mx-auto mb-1 2xs:mb-2" /> },
                  { label: 'Sector', count: sectorCount, icon: <IconMap size={18} className="text-cyan-400/70 mx-auto mb-1 2xs:mb-2" /> },
                  { label: 'System', count: systemCount, icon: <IconGlobe size={18} className="text-cyan-400/70 mx-auto mb-1 2xs:mb-2" /> },
                ].map(({ label, count, icon }) => (
                  <div key={label} className="text-center p-2 2xs:p-3 bg-neutral-800 rounded border border-neutral-700 min-w-0">
                    {icon}
                    <div className="text-base 2xs:text-lg xs:text-xl font-bold text-white font-mono">{count}</div>
                    <div className="text-[10px] 2xs:text-xs text-cyan-400/70 tracking-wider truncate">{label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-2 2xs:mt-3 text-[10px] 2xs:text-xs text-neutral-500">
                Four-tier architecture: System &gt; Sector &gt; Matrix &gt; Station
              </div>
            </>
          }
          back={
            <div className="space-y-2 2xs:space-y-3">
              <div className="flex items-center gap-1.5 2xs:gap-2 sm:gap-3 min-w-0">
                <IconNetwork size={18} className="text-cyan-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs 2xs:text-sm sm:text-base font-bold text-cyan-400 tracking-wide truncate">Territory System</div>
                  <div className="text-[8px] 2xs:text-[9px] sm:text-[10px] text-neutral-500 font-mono tracking-wider truncate">Territory System</div>
                </div>
              </div>
              <p className="text-xs 2xs:text-sm text-neutral-300 leading-relaxed">
                The territory system is the organizational backbone of the Microcosm ecosystem, structuring all users into a hierarchical governance model.
              </p>
              <div className="text-xs 2xs:text-sm text-neutral-400 leading-relaxed space-y-1 2xs:space-y-1.5">
                <p><span className="text-cyan-400/80 font-mono">Station</span> \u2014 Base unit housing up to 1,000 users</p>
                <p><span className="text-cyan-400/80 font-mono">Matrix</span> \u2014 Regional group managing 10 Stations</p>
                <p><span className="text-cyan-400/80 font-mono">Sector</span> \u2014 Area governance overseeing 10 Matrices</p>
                <p><span className="text-cyan-400/80 font-mono">System</span> \u2014 Top-level domain containing 10 Sectors</p>
              </div>
              <p className="hidden 2xs:block text-xs 2xs:text-sm text-neutral-400 leading-relaxed">
                Magistrates are territory managers elected through the auction system. They govern their territory and receive a share of mining companion yield.
              </p>
            </div>
          }
        />

        {}
        <FlipCard
          front={
            <>
              <div className="mb-2 2xs:mb-3 sm:mb-4 flex items-center gap-1.5 2xs:gap-2 sm:gap-3 min-w-0">
                <IconBuilding size={18} className="text-cyan-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs 2xs:text-sm sm:text-base font-bold text-cyan-400 tracking-wide truncate">Vault Balance</div>
                  <div className="text-[8px] 2xs:text-[9px] sm:text-[10px] text-neutral-500 font-mono tracking-wider truncate">Vault Balance</div>
                </div>
              </div>
              <div className="p-2 2xs:p-3 sm:p-4 bg-neutral-800 rounded border border-neutral-700 min-w-0">
                <div className="text-lg 2xs:text-xl xs:text-2xl sm:text-3xl font-bold text-cyan-300 font-mono truncate">{formatMCD(totalVaultMCD)}</div>
                <div className="text-[10px] 2xs:text-xs sm:text-sm text-cyan-400/50 mt-1">MCD</div>
              </div>
              <div className="mt-2 2xs:mt-3 text-[10px] 2xs:text-xs text-neutral-500">
                Daily distribution: 1% of vault balance distributed to territory miners
              </div>
            </>
          }
          back={
            <div className="space-y-2 2xs:space-y-3">
              <div className="flex items-center gap-1.5 2xs:gap-2 sm:gap-3 min-w-0">
                <IconBuilding size={18} className="text-cyan-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs 2xs:text-sm sm:text-base font-bold text-cyan-400 tracking-wide truncate">Vault Mechanism</div>
                  <div className="text-[8px] 2xs:text-[9px] sm:text-[10px] text-neutral-500 font-mono tracking-wider truncate">Vault Mechanism</div>
                </div>
              </div>
              <p className="text-xs 2xs:text-sm text-neutral-300 leading-relaxed">
                Each territory maintains a vault that accumulates MCD from mining companion yield and distributes it to active miners daily.
              </p>
              <div className="text-xs 2xs:text-sm text-neutral-400 leading-relaxed space-y-1 2xs:space-y-1.5">
                <p><span className="text-cyan-400/80">Source</span> \u2014 30% of mining companion yield flows to territory vault as MCD</p>
                <p><span className="text-cyan-400/80">Distribution</span> \u2014 1% of vault balance distributed daily to territory miners</p>
                <p><span className="text-cyan-400/80">Peg</span> \u2014 MCD is pegged 1:1 to USDT/USDC</p>
                <p className="hidden 2xs:block"><span className="text-cyan-400/80">Transparency</span> \u2014 All vault balances and distributions are on-chain verifiable</p>
              </div>
              <p className="hidden 2xs:block text-xs 2xs:text-sm text-neutral-400 leading-relaxed">
                The vault creates a positive feedback loop: more mining activity increases the vault, which increases daily payouts, attracting more miners.
              </p>
            </div>
          }
        />
      </div>

      {}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-2 2xs:p-3 sm:p-4 md:p-6 hover:border-cyan-400/50 transition-colors">
        <div className="mb-2 2xs:mb-3 sm:mb-4 flex items-center gap-1.5 2xs:gap-2 sm:gap-3 min-w-0">
          <IconCrown size={18} className="text-cyan-400 shrink-0" />
          <div className="min-w-0">
            <div className="text-xs 2xs:text-sm sm:text-base font-bold text-cyan-400 tracking-wide truncate">Level Progression</div>
            <div className="text-[8px] 2xs:text-[9px] sm:text-[10px] text-neutral-500 font-mono tracking-wider truncate">Level Progression</div>
          </div>
        </div>
        <div className="grid grid-cols-1 2xs:grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 2xs:gap-2 sm:gap-3">
          {[
            { level: 3, en: 'Miner', zh: '\u77FF\u5DE5', condition: 'Register account' },
            { level: 4, en: 'Commander', zh: '\u6307\u6325\u5B98', condition: 'Station NFT' },
            { level: 5, en: 'Pioneer', zh: '\u5148\u9A71\u8005', condition: '10 Stations (auto-mint Matrix)' },
            { level: 6, en: 'Warden', zh: '\u5B88\u62A4\u8005', condition: '10 Matrices (auto-mint Sector)' },
            { level: 7, en: 'Admiral', zh: '\u63D0\u7763', condition: '10 Sectors (auto-mint System)' },
          ].map(({ level, en, zh, condition }) => (
            <div key={level} className="flex items-center gap-2 2xs:gap-3 p-2 2xs:p-3 bg-neutral-800 rounded border border-neutral-700 min-w-0">
              <div className="text-lg 2xs:text-xl xs:text-2xl font-bold text-cyan-400 font-mono leading-none shrink-0">{level}</div>
              <div className="min-w-0 flex-1">
                <div className="text-xs 2xs:text-sm font-medium text-neutral-200 truncate">{en}</div>
                <div className="text-[10px] 2xs:text-xs text-neutral-400 truncate">{zh}</div>
                <div className="text-[10px] 2xs:text-xs text-neutral-500 truncate">{condition}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-2 2xs:p-3 sm:p-4 md:p-6 hover:border-cyan-400/50 transition-colors">
        <div className="flex items-center justify-between mb-2 2xs:mb-3 sm:mb-4 gap-2 min-w-0">
          <div className="flex items-center gap-1.5 2xs:gap-2 sm:gap-3 min-w-0">
            <IconLayers size={18} className="text-cyan-400 shrink-0" />
            <div className="min-w-0">
              <div className="text-xs 2xs:text-sm sm:text-base font-bold text-cyan-400 tracking-wide truncate">Territory Architecture</div>
              <div className="text-[8px] 2xs:text-[9px] sm:text-[10px] text-neutral-500 font-mono tracking-wider truncate">Territory Structure</div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono text-neutral-500">
            {[
              { label: 'System', color: 'bg-purple-400' },
              { label: 'Sector', color: 'bg-blue-400' },
              { label: 'Matrix', color: 'bg-cyan-400' },
              { label: 'Station', color: 'bg-emerald-400' },
            ].map(({ label, color }) => (
              <span key={label} className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${color}`} />
                {label}
              </span>
            ))}
          </div>
        </div>

        {}
        <div className="relative rounded-lg border border-neutral-800 overflow-hidden bg-neutral-950/50 p-2 2xs:p-3 sm:p-4 md:p-6">
          {}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full">
              <defs>
                <pattern id="org-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#22d3ee" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#org-grid)" />
            </svg>
          </div>

          <div className="relative z-10 space-y-0">
            {}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-purple-500/40 bg-purple-500/10">
                <IconGlobe size={16} className="text-purple-400" />
                <span className="text-sm font-bold text-purple-300 font-mono">System</span>
                <span className="text-[10px] text-purple-400/60 ml-1">100,000 users</span>
              </div>
            </div>

            {}
            <div className="flex justify-center py-1">
              <div className="w-px h-6 bg-gradient-to-b from-purple-500/40 to-blue-500/40" />
            </div>
            <div className="flex justify-center pb-1">
              <span className="text-[9px] text-neutral-600 font-mono">10x</span>
            </div>

            {}
            <div className="flex justify-center gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-500/40 bg-blue-500/10">
                  <IconMap size={14} className="text-blue-400" />
                  <span className="text-xs font-bold text-blue-300 font-mono">Sector</span>
                </div>
              ))}
              <div className="inline-flex items-center px-3 py-2 rounded-lg border border-neutral-700 bg-neutral-800/50">
                <span className="text-xs text-neutral-500 font-mono">... x10</span>
              </div>
            </div>

            {}
            <div className="flex justify-center py-1">
              <div className="w-px h-6 bg-gradient-to-b from-blue-500/40 to-cyan-500/40" />
            </div>
            <div className="flex justify-center pb-1">
              <span className="text-[9px] text-neutral-600 font-mono">10x</span>
            </div>

            {}
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10">
                  <IconGrid size={14} className="text-cyan-400" />
                  <span className="text-xs font-bold text-cyan-300 font-mono">Matrix</span>
                </div>
              ))}
              <div className="inline-flex items-center px-3 py-2 rounded-lg border border-neutral-700 bg-neutral-800/50">
                <span className="text-xs text-neutral-500 font-mono">... x10</span>
              </div>
            </div>

            {}
            <div className="flex justify-center py-1">
              <div className="w-px h-6 bg-gradient-to-b from-cyan-500/40 to-emerald-500/40" />
            </div>
            <div className="flex justify-center pb-1">
              <span className="text-[9px] text-neutral-600 font-mono">10x</span>
            </div>

            {}
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10">
                  <IconBuilding size={14} className="text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-300 font-mono">Station</span>
                </div>
              ))}
              <div className="inline-flex items-center px-3 py-2 rounded-lg border border-neutral-700 bg-neutral-800/50">
                <span className="text-xs text-neutral-500 font-mono">... x10</span>
              </div>
            </div>

            {}
            <div className="flex justify-center pt-4">
              <span className="text-[10px] text-neutral-600 font-mono">Each station: 1,000 users capacity | Managed by Magistrate (via auction)</span>
            </div>
          </div>

          {}
          <div className="relative z-10 mt-3 2xs:mt-4 sm:mt-6 grid grid-cols-1 2xs:grid-cols-2 lg:grid-cols-4 gap-1.5 2xs:gap-2 sm:gap-3">
            {[
              { type: 'System', color: 'border-purple-500/30 bg-purple-500/5', textColor: 'text-purple-300', desc: 'Top-level domain', capacity: '100,000', count: systemCount },
              { type: 'Sector', color: 'border-blue-500/30 bg-blue-500/5', textColor: 'text-blue-300', desc: 'Area governance', capacity: '10,000', count: sectorCount },
              { type: 'Matrix', color: 'border-cyan-500/30 bg-cyan-500/5', textColor: 'text-cyan-300', desc: 'Regional group', capacity: '1,000 x10', count: matrixCount },
              { type: 'Station', color: 'border-emerald-500/30 bg-emerald-500/5', textColor: 'text-emerald-300', desc: 'Base unit', capacity: '1,000', count: stationCount },
            ].map(({ type, color, textColor, desc, capacity, count }) => (
              <div key={type} className={`rounded-lg border p-2 2xs:p-3 min-w-0 ${color}`}>
                <div className={`text-xs 2xs:text-sm font-bold font-mono truncate ${textColor}`}>{type}</div>
                <div className="text-[10px] 2xs:text-xs text-neutral-400 mt-0.5 truncate">{desc}</div>
                <div className="flex items-baseline justify-between mt-1 2xs:mt-2 gap-2 min-w-0">
                  <span className="text-[8px] 2xs:text-[10px] text-neutral-500 font-mono truncate">{capacity} users</span>
                  <span className={`text-base 2xs:text-lg font-bold font-mono shrink-0 ${textColor}`}>{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
