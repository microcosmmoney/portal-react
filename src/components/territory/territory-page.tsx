'use client'

import { useState, useMemo, useCallback, useRef, useId } from 'react'
import { useTranslations } from '../../i18n-context'
import {
  useTerritories,
  useTerritorySummary,
  useTerritoryDetailedStats,
  useTerritoryMembers,
  useTerritoryIncome,
  useTerritoryKPI,
  useTerritoryRanking,
  useTerritoryUpdate,
} from '@microcosmmoney/auth-react'
import type { Territory, UnitType } from '@microcosmmoney/auth-core'
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const IconBuilding2 = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
    <path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" />
  </svg>
)

const IconGrid3x3 = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M3 9h18" /><path d="M3 15h18" /><path d="M9 3v18" /><path d="M15 3v18" />
  </svg>
)

const IconMap = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
    <path d="M15 5.764v15" /><path d="M9 3.236v15" />
  </svg>
)

const IconGlobe = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
)

const IconUsers = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const IconVault = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <circle cx="12" cy="12" r="4" />
    <path d="M12 8v8" /><path d="M8 12h8" />
    <path d="M2 10h2" /><path d="M2 14h2" /><path d="M20 10h2" /><path d="M20 14h2" />
  </svg>
)

const IconZap = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
)

const IconSearch = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
  </svg>
)

const IconArrowLeft = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
  </svg>
)

const IconShield = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67 0C8.5 20.5 5 18 5 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C15.5 3.8 18 5 20 5a1 1 0 0 1 1 1z" />
  </svg>
)

const IconCalendar = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2v4" /><path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
)

const IconImage = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
)

const IconSettings = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const IconEdit3 = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.855z" />
  </svg>
)

const fmt = (n: number) => n.toLocaleString('en-US')

const TECH_BONUS: Record<string, number> = {
  station: 10,
  matrix: 20,
  sector: 30,
  system: 40,
}

const getTypeIcon = (type: string, className = 'w-5 h-5') => {
  switch (type?.toLowerCase()) {
    case 'station': return <IconBuilding2 className={className} />
    case 'matrix': return <IconGrid3x3 className={className} />
    case 'sector': return <IconMap className={className} />
    case 'system': return <IconGlobe className={className} />
    default: return <IconSettings className={className} />
  }
}

const getTypeBadgeColor = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'station': return 'border-cyan-400/40 text-cyan-400'
    case 'matrix': return 'border-white/40 text-white'
    case 'sector': return 'border-cyan-300/40 text-cyan-300'
    case 'system': return 'border-cyan-200/40 text-cyan-200'
    default: return 'border-neutral-600 text-neutral-400'
  }
}

const UNIT_TYPE_LABELS: { key: UnitType | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'station', label: 'Station' },
  { key: 'matrix', label: 'Matrix' },
  { key: 'sector', label: 'Sector' },
  { key: 'system', label: 'System' },
]

function Spinner() {
  return <span className="inline-block w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-neutral-800 rounded-lg ${className}`} />
}

function TerritoryCard({ unit, onClick }: { unit: Territory; onClick: () => void }) {
  const unitType = (unit.unit_type || 'station') as string
  const techBonus = TECH_BONUS[unitType.toLowerCase()] ?? 0
  const occupancy = unit.max_capacity && unit.max_capacity > 0
    ? Math.round(((unit.member_count ?? 0) / unit.max_capacity) * 100)
    : 0

  return (
    <div
      className="bg-neutral-900 border border-neutral-700 rounded-lg hover:border-cyan-400/50 cursor-pointer transition-colors overflow-hidden"
      onClick={onClick}
    >
      {}
      <div className="aspect-[4/3] bg-neutral-800 relative flex items-center justify-center overflow-hidden">
        {unit.image_url ? (
          <img src={unit.image_url} alt={unit.unit_name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center text-neutral-600">
            {getTypeIcon(unitType, 'w-10 h-10')}
            <span className="text-xs mt-2 capitalize">{unitType}</span>
          </div>
        )}
      </div>

      {}
      <div className="p-3 space-y-2" style={{ backgroundColor: '#0a0e14' }}>
        {}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`border px-1.5 py-0.5 rounded text-xs capitalize ${getTypeBadgeColor(unitType)}`}>
            {unitType}
          </span>
          <span className="text-xs text-yellow-400">
            <IconZap className="w-3 h-3 inline-block -mt-0.5 mr-0.5" />+{techBonus}%
          </span>
          {unit.short_id && (
            <span className="text-xs text-neutral-500 font-mono ml-auto">{unit.short_id}</span>
          )}
        </div>

        {}
        <div>
          <h3 className="text-white font-bold text-sm truncate">{unit.unit_name}</h3>
          {unit.full_path && (
            <p className="text-neutral-500 text-xs font-mono truncate">{unit.full_path}</p>
          )}
        </div>

        {}
        {unit.description && (
          <p className="text-neutral-400 text-xs line-clamp-2">{unit.description}</p>
        )}

        {}
        <div className="flex items-center gap-4 pt-2 border-t border-neutral-700/50 text-xs text-neutral-400">
          <span className="flex items-center gap-1">
            <IconUsers className="w-3.5 h-3.5" />
            {fmt(unit.member_count ?? 0)}
          </span>
          <span className="flex items-center gap-1">
            <IconVault className="w-3.5 h-3.5" />
            {fmt(Math.round(unit.vault_balance ?? 0))} MCD
          </span>
          <span className="ml-auto">{occupancy}%</span>
        </div>
      </div>
    </div>
  )
}

function IncomeChart({ territoryId }: { territoryId: string }) {
  const { data: raw, loading } = useTerritoryIncome(territoryId, '30d')
  const uid = useId()

  const chartData = useMemo(() => {
    if (!raw) return []
    
    if (Array.isArray(raw)) return raw
    if (raw.labels && raw.datasets) {
      return raw.labels.map((label: string, i: number) => ({
        date: label,
        income: raw.datasets.income?.[i] ?? 0,
        cumulative: raw.datasets.cumulative?.[i] ?? 0,
      }))
    }
    return raw.data ?? []
  }, [raw])

  if (loading) return <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6"><div className="h-64 flex items-center justify-center"><Spinner /></div></div>
  if (chartData.length === 0) return null

  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg hover:border-cyan-400/50 transition-colors p-6">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm">
        <IconZap className="w-4 h-4 text-cyan-400" />
        Income Trend (30D)
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
            <XAxis dataKey="date" tick={{ fill: '#a3a3a3', fontSize: 11 }} axisLine={{ stroke: '#525252' }} />
            <YAxis tick={{ fill: '#a3a3a3', fontSize: 11 }} axisLine={{ stroke: '#525252' }} />
            <Tooltip contentStyle={{ backgroundColor: '#171717', border: '1px solid #404040', borderRadius: '8px' }} labelStyle={{ color: '#a3a3a3' }} itemStyle={{ color: '#fff' }} />
            <Line type="monotone" dataKey="income" name="Daily Income" stroke="#22d3ee" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="cumulative" name="Cumulative" stroke="#ffffff" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 mt-3">
        <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-cyan-400" /><span className="text-xs text-neutral-400">Daily Income</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-white" /><span className="text-xs text-neutral-400">Cumulative</span></div>
      </div>
    </div>
  )
}

const RANK_BADGE: Record<number, string> = { 1: 'bg-cyan-400/20 text-cyan-400', 2: 'bg-white/20 text-white', 3: 'bg-cyan-300/20 text-cyan-300' }

function MemberRanking({ territoryId }: { territoryId: string }) {
  const { data: raw, loading } = useTerritoryRanking(territoryId, { page_size: 10 })

  const rankList = useMemo(() => {
    if (!raw) return []
    return Array.isArray(raw) ? raw : raw.data ?? []
  }, [raw])

  if (loading) return <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6"><div className="h-64 flex items-center justify-center"><Spinner /></div></div>
  if (rankList.length === 0) return null

  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg hover:border-cyan-400/50 transition-colors p-6">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm">
        <IconShield className="w-4 h-4 text-cyan-400" />
        Member Contribution Ranking
      </h3>
      <div className="space-y-2">
        {rankList.map((m: any, idx: number) => {
          const rank = m.rank ?? idx + 1
          const name = m.nickname || m.display_name || 'Unknown'
          return (
            <div key={m.user_id || idx} className="flex items-center gap-3 p-2 bg-neutral-800 rounded hover:bg-neutral-700 transition-colors">
              <div className="w-8 text-center">
                {rank <= 3 ? (
                  <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-bold ${RANK_BADGE[rank] ?? ''}`}>#{rank}</span>
                ) : (
                  <span className="text-neutral-500 font-mono text-sm">#{rank}</span>
                )}
              </div>
              <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                {name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm truncate">{name}</div>
                {m.email && <div className="text-neutral-500 text-xs truncate">{m.email}</div>}
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-white font-mono font-medium text-sm">{(m.contribution ?? 0).toLocaleString()}</span>
                <span className="text-neutral-500 text-xs ml-1">MCD</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function KPIHistoryChart({ territoryId }: { territoryId: string }) {
  const { data: raw, loading } = useTerritoryKPI(territoryId)
  const uid = useId()

  const chartData = useMemo(() => {
    if (!raw) return []
    if (Array.isArray(raw)) return raw
    return raw.data ?? []
  }, [raw])

  if (loading) return <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6"><div className="h-64 flex items-center justify-center"><Spinner /></div></div>
  if (chartData.length === 0) return null

  const gradMember = `kpi-member-${uid}`
  const gradVolume = `kpi-volume-${uid}`

  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg hover:border-cyan-400/50 transition-colors p-6">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm">
        <IconEdit3 className="w-4 h-4 text-cyan-400" />
        KPI History
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id={gradMember} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
              <linearGradient id={gradVolume} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
            <XAxis dataKey="date" tick={{ fill: '#a3a3a3', fontSize: 11 }} axisLine={{ stroke: '#525252' }} />
            <YAxis domain={[0, 100]} tick={{ fill: '#a3a3a3', fontSize: 11 }} axisLine={{ stroke: '#525252' }} tickFormatter={(v: number) => `${v}%`} />
            <Tooltip contentStyle={{ backgroundColor: '#171717', border: '1px solid #404040', borderRadius: '8px' }} labelStyle={{ color: '#a3a3a3' }} formatter={(value: any) => [`${Number(value).toFixed(1)}%`, '']} />
            <Area type="monotone" dataKey="member_progress" name="Member Progress" stroke="#22d3ee" strokeWidth={2} fill={`url(#${gradMember})`} />
            <Area type="monotone" dataKey="volume_progress" name="Volume Progress" stroke="#ffffff" strokeWidth={2} fill={`url(#${gradVolume})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 mt-3">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-cyan-400" /><span className="text-xs text-neutral-400">Member Progress</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-white" /><span className="text-xs text-neutral-400">Volume Progress</span></div>
      </div>
    </div>
  )
}

function EditTerritoryDialog({ territory, open, onClose, onSaved }: {
  territory: Territory
  open: boolean
  onClose: () => void
  onSaved: () => void
}) {
  const { update, loading: updating } = useTerritoryUpdate()
  const [name, setName] = useState(territory.unit_name)
  const [desc, setDesc] = useState(territory.description || '')
  const [error, setError] = useState('')

  const handleSave = useCallback(async () => {
    if (!name.trim()) { setError('Name is required'); return }
    try {
      setError('')
      await update(territory.unit_id, { unit_name: name, description: desc })
      onSaved()
      onClose()
    } catch (e: any) {
      setError(e.message || 'Update failed')
    }
  }, [update, territory.unit_id, name, desc, onSaved, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="fixed inset-0 bg-black/60" />
      <div className="relative bg-neutral-900 border border-neutral-700 rounded-lg w-full max-w-lg p-6 space-y-4 mx-4" onClick={(e) => e.stopPropagation()}>
        <div>
          <h3 className="text-white font-bold text-lg">Edit Territory</h3>
          <p className="text-neutral-500 text-xs font-mono mt-1">
            {territory.unit_type} &middot; {territory.full_path || territory.short_id || territory.unit_id}
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-neutral-400 tracking-wider block mb-1">unit_name *</label>
            <input
              value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded text-sm focus:border-cyan-400/50 outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-neutral-400 tracking-wider block mb-1">description</label>
            <textarea
              value={desc} onChange={(e) => setDesc(e.target.value)} rows={3}
              className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded text-sm focus:border-cyan-400/50 outline-none resize-none"
            />
          </div>
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} disabled={updating} className="px-4 py-2 text-sm text-neutral-400 border border-neutral-700 rounded hover:bg-neutral-800 transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={updating} className="px-4 py-2 text-sm text-white bg-cyan-700 hover:bg-cyan-600 rounded transition-colors disabled:opacity-50">
            {updating ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

function TerritoryDetailView({ territoryId, territory, onBack }: {
  territoryId: string
  territory?: Territory
  onBack: () => void
}) {
  const { data: detailedStats, loading: statsLoading } = useTerritoryDetailedStats(territoryId)
  const { data: members, loading: membersLoading } = useTerritoryMembers(territoryId)
  const [editOpen, setEditOpen] = useState(false)

  const stats = detailedStats as any
  const memberList = Array.isArray(members) ? members : []
  const unitType = (territory?.unit_type || 'station') as string
  const techBonus = TECH_BONUS[unitType.toLowerCase()] ?? 0
  const memberCount = territory?.member_count ?? stats?.stats?.member_count ?? stats?.metrics?.member_count ?? 0
  const maxCapacity = territory?.max_capacity ?? stats?.stats?.max_capacity ?? stats?.metrics?.max_capacity ?? 0
  const vaultBalance = territory?.vault_balance ?? stats?.stats?.vault_balance ?? stats?.metrics?.vault_mcd ?? 0
  const occupancy = maxCapacity > 0 ? Math.round((memberCount / maxCapacity) * 100) : 0

  return (
    <div className="space-y-6">
      {}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
        >
          <IconArrowLeft className="w-4 h-4" />
          Back to list
        </button>
        {territory && (
          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white bg-cyan-700 hover:bg-cyan-600 rounded transition-colors"
          >
            <IconEdit3 className="w-3.5 h-3.5" />
            Edit
          </button>
        )}
      </div>

      {}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg hover:border-cyan-400/50 transition-colors p-6">
        <div className="flex items-start gap-5">
          <div className="w-28 h-28 bg-neutral-800 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
            {territory?.image_url ? (
              <img src={territory.image_url} alt={territory.unit_name} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-neutral-600">
                {getTypeIcon(unitType, 'w-10 h-10')}
                <span className="text-[10px] mt-1 capitalize">{unitType}</span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-white">{territory?.unit_name ?? territoryId}</h2>
              {territory?.short_id && (
                <span className="text-sm text-neutral-400 font-mono bg-neutral-800 px-2 py-0.5 rounded">{territory.short_id}</span>
              )}
              <span className={`border px-1.5 py-0.5 rounded text-xs capitalize ${getTypeBadgeColor(unitType)}`}>
                {unitType}
              </span>
              {occupancy >= 90 ? (
                <span className="text-xs bg-white/20 text-white px-1.5 py-0.5 rounded">Qualified</span>
              ) : (
                <span className="text-xs bg-neutral-500/20 text-neutral-400 px-1.5 py-0.5 rounded">Not Qualified</span>
              )}
            </div>
            {territory?.manager_display_name && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400">
                <IconShield className="w-3.5 h-3.5" />
                Magistrate: {territory.manager_display_name}
              </div>
            )}
            {territory?.full_path && (
              <p className="text-neutral-500 text-sm font-mono mt-1">{territory.full_path}</p>
            )}
            {territory?.description && (
              <p className="text-neutral-400 text-sm mt-2">{territory.description}</p>
            )}
          </div>
        </div>
      </div>

      {}
      {statsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg hover:border-cyan-400/50 transition-colors p-4">
            <div className="flex items-center gap-2 mb-2"><IconUsers className="w-5 h-5 text-neutral-400" /><span className="text-xs text-neutral-400">Members</span></div>
            <p className="text-2xl font-bold text-white font-mono">{fmt(memberCount)}</p>
            <p className="text-xs text-neutral-500 mt-1">Capacity: <span className="font-mono">{fmt(maxCapacity)}</span></p>
          </div>
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg hover:border-cyan-400/50 transition-colors p-4">
            <div className="flex items-center gap-2 mb-2"><IconVault className="w-5 h-5 text-neutral-400" /><span className="text-xs text-neutral-400">Vault Balance</span></div>
            <p className="text-2xl font-bold text-white font-mono">{fmt(Math.round(vaultBalance))}</p>
            <p className="text-xs text-neutral-500 mt-1">MCD</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg hover:border-cyan-400/50 transition-colors p-4">
            <div className="flex items-center gap-2 mb-2"><IconZap className="w-5 h-5 text-yellow-400" /><span className="text-xs text-neutral-400">Tech Bonus</span></div>
            <p className="text-2xl font-bold text-white font-mono">+{stats?.tech_bonus ?? techBonus}%</p>
            <p className="text-xs text-neutral-500 mt-1">Mining output bonus</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg hover:border-cyan-400/50 transition-colors p-4">
            <div className="flex items-center gap-2 mb-2"><IconSettings className="w-5 h-5 text-neutral-400" /><span className="text-xs text-neutral-400">Occupancy</span></div>
            <p className="text-2xl font-bold text-white font-mono">{occupancy}%</p>
            <p className="text-xs text-neutral-500 mt-1">Members / Capacity</p>
          </div>
        </div>
      )}

      {}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg hover:border-cyan-400/50 transition-colors p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm">
          <IconEdit3 className="w-4 h-4 text-cyan-400" />
          KPI Progress
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-neutral-400">Members</span>
              <span className="text-white font-mono">{fmt(memberCount)} / {fmt(maxCapacity)}</span>
            </div>
            <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-400 rounded-full transition-all duration-500" style={{ width: `${Math.min(occupancy, 100)}%` }} />
            </div>
            <p className="text-xs text-neutral-500 font-mono mt-1">{occupancy}% filled</p>
          </div>
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-neutral-400">Vault Balance</span>
              <span className="text-white font-mono">{fmt(Math.round(vaultBalance))} MCD</span>
            </div>
            <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-400 rounded-full transition-all duration-500" style={{ width: `${Math.min(vaultBalance > 0 ? Math.max(Math.log10(vaultBalance) * 10, 5) : 0, 100)}%` }} />
            </div>
            <p className="text-xs text-neutral-500 mt-1">Current vault funds</p>
          </div>
        </div>
      </div>

      {}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg hover:border-cyan-400/50 transition-colors p-6">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm">
          <IconSettings className="w-4 h-4 text-cyan-400" />
          Distribution Mechanism
        </h3>
        <div className="bg-neutral-800 rounded p-4">
          <h4 className="text-white font-semibold text-sm mb-2">Auto Distribution by Contribution</h4>
          <p className="text-neutral-400 text-sm">
            Vault MCD is distributed daily at 1% of balance, allocated to miners proportional to their mining activity.
          </p>
          <p className="text-neutral-500 text-xs mt-2">Distribution ratio: Miners 100% (by contribution)</p>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncomeChart territoryId={territoryId} />
        <MemberRanking territoryId={territoryId} />
      </div>

      {}
      <KPIHistoryChart territoryId={territoryId} />

      {}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg hover:border-cyan-400/50 transition-colors">
        <div className="p-4 border-b border-neutral-700/50">
          <h3 className="text-white font-semibold flex items-center gap-2 text-sm">
            <IconUsers className="w-4 h-4 text-cyan-400" />
            Members ({memberList.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          {membersLoading ? (
            <div className="p-6 flex justify-center"><Spinner /></div>
          ) : memberList.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 text-sm">No members found</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-700/50">
                  <th className="text-left px-4 py-3 text-neutral-400 font-medium">Name / UID</th>
                  <th className="text-left px-4 py-3 text-neutral-400 font-medium">Role</th>
                  <th className="text-left px-4 py-3 text-neutral-400 font-medium">Email</th>
                  <th className="text-left px-4 py-3 text-neutral-400 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member: any, idx: number) => (
                  <tr key={member.uid || idx} className="border-b border-neutral-800/50 hover:bg-neutral-800/30">
                    <td className="px-4 py-3">
                      <div className="text-white">{member.display_name || member.username || 'Unknown'}</div>
                      <div className="text-neutral-500 text-xs font-mono">{member.uid ? `${member.uid.slice(0, 12)}...` : '-'}</div>
                    </td>
                    <td className="px-4 py-3"><span className="text-neutral-300 capitalize">{member.role || member.level_name || 'Miner'}</span></td>
                    <td className="px-4 py-3"><span className="text-neutral-400 font-mono text-xs">{member.email ? (member.email.length > 20 ? member.email.slice(0, 20) + '...' : member.email) : '-'}</span></td>
                    <td className="px-4 py-3">
                      <span className="text-neutral-400 flex items-center gap-1">
                        <IconCalendar className="w-3 h-3" />
                        {member.joined_at || member.created_at ? new Date(member.joined_at || member.created_at).toLocaleDateString() : '-'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {}
      {territory && (
        <EditTerritoryDialog
          territory={territory}
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSaved={() => {  }}
        />
      )}
    </div>
  )
}

export interface MicrocosmTerritoryPageProps {
  basePath?: string
  onNavigate?: (path: string) => void
}

export function MicrocosmTerritoryPage({ basePath = '', onNavigate }: MicrocosmTerritoryPageProps) {
  const t = useTranslations('territoryDash')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<UnitType | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const { data: summary, loading: summaryLoading } = useTerritorySummary()
  const { data: territories, loading: territoriesLoading } = useTerritories(
    filterType === 'all' ? {} : { unitType: filterType }
  )

  const territoryList = Array.isArray(territories) ? territories : []
  const sum = summary as any

  const filteredTerritories = useMemo(() => {
    if (!searchTerm.trim()) return territoryList
    const q = searchTerm.toLowerCase()
    return territoryList.filter((t: Territory) =>
      (t.unit_name && t.unit_name.toLowerCase().includes(q)) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      (t.short_id && t.short_id.toLowerCase().includes(q)) ||
      (t.full_path && t.full_path.toLowerCase().includes(q))
    )
  }, [territoryList, searchTerm])

  const selectedTerritory = selectedId
    ? territoryList.find((t: Territory) => t.unit_id === selectedId)
    : undefined

  if (selectedId) {
    return (
      <TerritoryDetailView
        territoryId={selectedId}
        territory={selectedTerritory}
        onBack={() => setSelectedId(null)}
      />
    )
  }

  
  if (summaryLoading && territoriesLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-56" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-14" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-72" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {}
      <div>
        <h1 className="text-2xl font-bold text-white">{t('title', 'Territory Management')}</h1>
        <p className="text-neutral-400 text-sm mt-1">{t('subtitle', 'Manage territories, view KPI and vault balances')}</p>
      </div>

      {}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Territories', value: sum?.total_stations ?? 0, icon: <IconBuilding2 className="w-4 h-4 text-cyan-400" />, suffix: '' },
          { label: 'Total Members', value: sum?.total_members ?? 0, icon: <IconUsers className="w-4 h-4 text-neutral-400" />, suffix: '' },
          { label: 'Total Vault MCD', value: Math.round(sum?.total_vault_mcd ?? 0), icon: <IconVault className="w-4 h-4 text-neutral-400" />, suffix: ' MCD' },
          { label: 'Avg KPI', value: sum?.avg_kpi_score != null ? Math.round(sum.avg_kpi_score * 100) : 0, icon: <IconEdit3 className="w-4 h-4 text-neutral-400" />, suffix: '%' },
        ].map((s) => (
          <div key={s.label} className="bg-neutral-900 border border-neutral-700 rounded-lg hover:border-cyan-400/50 transition-colors p-4">
            <div className="flex items-center gap-2 mb-2">
              {s.icon}
              <span className="text-sm text-neutral-400">{s.label}</span>
            </div>
            <p className="text-2xl font-bold text-white font-mono">
              {summaryLoading ? <Spinner /> : <>{fmt(s.value)}{s.suffix}</>}
            </p>
          </div>
        ))}
      </div>

      {}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg hover:border-cyan-400/50 transition-colors p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {}
          <div className="relative flex-1">
            <IconSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder={t('searchPlaceholder', 'Search territories...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm placeholder:text-neutral-500 outline-none focus:border-cyan-400/50 transition-colors"
            />
          </div>

          {}
          <div className="flex gap-2 flex-wrap">
            {UNIT_TYPE_LABELS.map((ut) => (
              <button
                key={ut.key}
                onClick={() => setFilterType(ut.key)}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  filterType === ut.key
                    ? 'bg-cyan-700 text-white border-cyan-700'
                    : 'bg-transparent border-neutral-700 text-neutral-400 hover:text-neutral-200 hover:border-neutral-500'
                }`}
              >
                {ut.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {}
      {territoriesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-72" />)}
        </div>
      ) : filteredTerritories.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg hover:border-cyan-400/50 transition-colors">
          <div className="p-12 text-center">
            <IconImage className="w-12 h-12 mx-auto mb-4 text-neutral-600" />
            <p className="text-neutral-400">{t('nftNotFound', 'No territories found')}</p>
            {searchTerm && (
              <p className="text-xs text-neutral-500 mt-1">{t('searchHint', 'Try adjusting your search or filter criteria')}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTerritories.map((unit: Territory) => (
            <TerritoryCard
              key={unit.unit_id}
              unit={unit}
              onClick={() => setSelectedId(unit.unit_id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
