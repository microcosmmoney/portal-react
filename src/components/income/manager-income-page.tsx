'use client'

import { useState, useEffect, useCallback } from 'react'
import { useMicrocosmApi } from '@microcosmmoney/auth-react'
import { TerminalCard } from '../terminal'
import { useTranslations } from '../../i18n-context'

type ManagerLevel = 'station' | 'matrix' | 'sector' | 'system'
type DateRange = '7d' | '30d' | '90d' | 'all'

interface LevelIncomeData {
  total_income?: string
  record_count?: number
}

interface ManagerIncomeSummary {
  total_income?: string
  income_by_level?: Record<ManagerLevel, LevelIncomeData | undefined>
}

const SHARE_RATIOS: Record<ManagerLevel, number> = { station: 0.16, matrix: 0.12, sector: 0.08, system: 0.04 }
const LEVEL_LABELS: Record<ManagerLevel, string> = { station: 'Station', matrix: 'Matrix', sector: 'Sector', system: 'System' }
const LEVEL_ROLES: Record<ManagerLevel, string> = { station: 'Commander', matrix: 'Pioneer', sector: 'Warden', system: 'Admiral' }

export interface MicrocosmManagerIncomePageProps {
  basePath?: string
  onNavigate?: (path: string) => void
}

export function MicrocosmManagerIncomePage({}: MicrocosmManagerIncomePageProps = {}) {
  const t = useTranslations('managerIncome')
  const api = useMicrocosmApi()
  const [income, setIncome] = useState<ManagerIncomeSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange>('30d')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      const now = new Date()
      let start: string | undefined
      if (dateRange === '7d') { const d = new Date(now); d.setDate(d.getDate() - 7); start = d.toISOString().split('T')[0] }
      else if (dateRange === '30d') { const d = new Date(now); d.setDate(d.getDate() - 30); start = d.toISOString().split('T')[0] }
      else if (dateRange === '90d') { const d = new Date(now); d.setDate(d.getDate() - 90); start = d.toISOString().split('T')[0] }
      if (startDate) start = startDate
      if (start) params.set('start', start)
      if (endDate) params.set('end', endDate)
      const qs = params.toString()
      const res = await api.get<{ success: boolean; data: ManagerIncomeSummary }>(`/territories/manager/income${qs ? '?' + qs : ''}`)
      setIncome(res?.data ?? (res as any))
    } catch {
      setIncome(null)
    } finally {
      setLoading(false)
    }
  }, [api, dateRange, startDate, endDate])

  useEffect(() => { loadData() }, [dateRange])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  const totalIncome = income?.total_income ? parseFloat(income.total_income) : 0
  const levels: ManagerLevel[] = ['station', 'matrix', 'sector', 'system']
  const levelIncomes = levels.map(level => ({
    level,
    data: income?.income_by_level?.[level],
    share: SHARE_RATIOS[level],
    role: LEVEL_ROLES[level],
  }))
  const maxIncome = Math.max(...levelIncomes.map(l => l.data?.total_income ? parseFloat(l.data.total_income) : 0)) || 1

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6 font-mono">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wider">{t('title', 'Manager Income')}</h1>
          <p className="text-xs sm:text-sm text-neutral-400">{t('subtitle', 'View your MCC minting share income as a multi-level manager')}</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <span className="text-neutral-400">{t('loading', 'Loading income data...')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6 font-mono">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wider">{t('title', 'Manager Income')}</h1>
          <p className="text-xs sm:text-sm text-neutral-400">{t('subtitle', 'View your MCC minting share income as a multi-level manager')}</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-3 py-1.5 text-xs border border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white rounded transition-colors disabled:opacity-50"
        >
          {refreshing ? t('refreshing', 'Refreshing...') : t('refresh', 'Refresh')}
        </button>
      </div>

      <TerminalCard title={t('distributionRatio', 'Distribution Ratio (Companion Yield per Mining Event)')}>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          <div className="text-center p-3 bg-neutral-800 rounded border border-neutral-700">
            <div className="text-lg font-bold text-white">16%</div>
            <div className="text-xs text-neutral-500">{t('commander', 'Commander')}</div>
          </div>
          <div className="text-center p-3 bg-neutral-800 rounded border border-neutral-700">
            <div className="text-lg font-bold text-cyan-400">12%</div>
            <div className="text-xs text-neutral-500">{t('pioneer', 'Pioneer')}</div>
          </div>
          <div className="text-center p-3 bg-neutral-800 rounded border border-neutral-700">
            <div className="text-lg font-bold text-cyan-400">8%</div>
            <div className="text-xs text-neutral-500">{t('warden', 'Warden')}</div>
          </div>
          <div className="text-center p-3 bg-neutral-800 rounded border border-neutral-700">
            <div className="text-lg font-bold text-cyan-400">4%</div>
            <div className="text-xs text-neutral-500">{t('admiral', 'Admiral')}</div>
          </div>
          <div className="text-center p-3 bg-neutral-800 rounded border border-neutral-700">
            <div className="text-lg font-bold text-cyan-400">30%</div>
            <div className="text-xs text-neutral-500">{t('lpReserve', 'LP Reserve')}</div>
          </div>
          <div className="text-center p-3 bg-neutral-800 rounded border border-neutral-700">
            <div className="text-lg font-bold text-cyan-400">30%</div>
            <div className="text-xs text-neutral-500">{t('vaultMcd', 'Vault MCD')}</div>
          </div>
        </div>
      </TerminalCard>

      <TerminalCard>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex gap-2 flex-wrap">
            {(['7d', '30d', '90d', 'all'] as const).map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  dateRange === range ? 'bg-cyan-700 text-white' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
                }`}
              >
                {range === '7d' ? t('days7', '7 Days') : range === '30d' ? t('days30', '30 Days') : range === '90d' ? t('days90', '90 Days') : t('allTime', 'All Time')}
              </button>
            ))}
          </div>
          <div className="flex gap-2 items-end flex-1">
            <div>
              <label className="text-neutral-400 text-xs tracking-wider block mb-1">{t('startDate', 'Start Date')}</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-neutral-800 border border-neutral-600 text-white w-36 h-8 text-sm rounded px-2"
              />
            </div>
            <div>
              <label className="text-neutral-400 text-xs tracking-wider block mb-1">{t('endDate', 'End Date')}</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-neutral-800 border border-neutral-600 text-white w-36 h-8 text-sm rounded px-2"
              />
            </div>
            <button
              onClick={() => loadData()}
              className="px-3 py-1.5 text-xs border border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white rounded transition-colors h-8"
            >
              {t('query', 'Query')}
            </button>
          </div>
        </div>
      </TerminalCard>

      <TerminalCard>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-[#5EEAD4] tracking-widest uppercase mb-1">{t('totalIncome', 'Total Income')}</div>
            <div className="text-4xl font-bold text-white">
              {totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-lg text-neutral-500 ml-2">MCC</span>
            </div>
          </div>
        </div>
      </TerminalCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {levelIncomes.map(({ level, data, share, role }) => {
          const incomeAmount = data?.total_income ? parseFloat(data.total_income) : 0
          const recordCount = data?.record_count || 0
          const percentage = maxIncome > 0 ? (incomeAmount / maxIncome) * 100 : 0
          return (
            <TerminalCard key={level}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-white font-medium">{LEVEL_LABELS[level]}</div>
                  <div className="text-xs text-neutral-500">{role} · {(share * 100).toFixed(0)}%</div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    incomeAmount > 0 ? 'bg-white/20 text-white' : 'bg-neutral-800 text-neutral-500'
                  }`}
                >
                  {incomeAmount > 0 ? t('hasIncome', 'Has Income') : t('noIncome', 'None')}
                </span>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-neutral-400">{t('cumulativeIncome', 'Cumulative Income')}</span>
                  <span className="text-white">{incomeAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} MCC</span>
                </div>
                <div className="bg-neutral-800 rounded-full h-2">
                  <div className="bg-cyan-400 h-2 rounded-full transition-all" style={{ width: `${percentage}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-neutral-700">
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{recordCount}</div>
                  <div className="text-xs text-neutral-500">{t('outputRecords', 'Output Records')}</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">
                    {recordCount > 0 ? (incomeAmount / recordCount).toFixed(2) : '0.00'}
                  </div>
                  <div className="text-xs text-neutral-500">{t('avgPerRecord', 'Average Per Record')}</div>
                </div>
              </div>
            </TerminalCard>
          )
        })}
      </div>
    </div>
  )
}
