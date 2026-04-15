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
      <div className="max-w-7xl mx-auto px-2 py-3 space-y-2 2xs:px-3 2xs:py-4 2xs:space-y-3 sm:px-6 sm:py-6 sm:space-y-6 font-mono">
        <div>
          <h1 className="text-base 2xs:text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-wider truncate">{t('title', 'Manager Income')}</h1>
          <p className="text-[10px] 2xs:text-xs sm:text-sm text-neutral-400">{t('subtitle', 'View your MCC minting share income as a multi-level manager')}</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <span className="text-neutral-400">{t('loading', 'Loading income data...')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-2 py-3 space-y-2 2xs:px-3 2xs:py-4 2xs:space-y-3 sm:px-6 sm:py-6 sm:space-y-6 font-mono">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h1 className="text-base 2xs:text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-wider truncate">{t('title', 'Manager Income')}</h1>
          <p className="text-[10px] 2xs:text-xs sm:text-sm text-neutral-400">{t('subtitle', 'View your MCC minting share income as a multi-level manager')}</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-2 py-1 2xs:px-3 2xs:py-1.5 text-[10px] 2xs:text-xs border border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white rounded transition-colors disabled:opacity-50 whitespace-nowrap shrink-0"
        >
          {refreshing ? t('refreshing', 'Refreshing...') : t('refresh', 'Refresh')}
        </button>
      </div>

      <TerminalCard title={t('distributionRatio', 'Distribution Ratio (Companion Yield per Mining Event)')}>
        <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-6 gap-1.5 2xs:gap-2">
          <div className="text-center p-2 2xs:p-3 bg-neutral-800 rounded border border-neutral-700 min-w-0">
            <div className="text-base 2xs:text-lg font-bold text-white truncate">16%</div>
            <div className="text-[10px] 2xs:text-xs text-neutral-500 truncate">{t('commander', 'Commander')}</div>
          </div>
          <div className="text-center p-2 2xs:p-3 bg-neutral-800 rounded border border-neutral-700 min-w-0">
            <div className="text-base 2xs:text-lg font-bold text-cyan-400 truncate">12%</div>
            <div className="text-[10px] 2xs:text-xs text-neutral-500 truncate">{t('pioneer', 'Pioneer')}</div>
          </div>
          <div className="text-center p-2 2xs:p-3 bg-neutral-800 rounded border border-neutral-700 min-w-0">
            <div className="text-base 2xs:text-lg font-bold text-cyan-400 truncate">8%</div>
            <div className="text-[10px] 2xs:text-xs text-neutral-500 truncate">{t('warden', 'Warden')}</div>
          </div>
          <div className="text-center p-2 2xs:p-3 bg-neutral-800 rounded border border-neutral-700 min-w-0">
            <div className="text-base 2xs:text-lg font-bold text-cyan-400 truncate">4%</div>
            <div className="text-[10px] 2xs:text-xs text-neutral-500 truncate">{t('admiral', 'Admiral')}</div>
          </div>
          <div className="text-center p-2 2xs:p-3 bg-neutral-800 rounded border border-neutral-700 min-w-0">
            <div className="text-base 2xs:text-lg font-bold text-cyan-400 truncate">30%</div>
            <div className="text-[10px] 2xs:text-xs text-neutral-500 truncate">{t('lpReserve', 'LP Reserve')}</div>
          </div>
          <div className="text-center p-2 2xs:p-3 bg-neutral-800 rounded border border-neutral-700 min-w-0">
            <div className="text-base 2xs:text-lg font-bold text-cyan-400 truncate">30%</div>
            <div className="text-[10px] 2xs:text-xs text-neutral-500 truncate">{t('vaultMcd', 'Vault MCD')}</div>
          </div>
        </div>
      </TerminalCard>

      <TerminalCard>
        <div className="flex flex-col 2xs:flex-row gap-2 2xs:gap-3 sm:gap-4 items-stretch 2xs:items-end">
          <div className="flex gap-1.5 2xs:gap-2 flex-wrap">
            {(['7d', '30d', '90d', 'all'] as const).map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-2 2xs:px-3 py-1 2xs:py-1.5 text-[11px] 2xs:text-xs sm:text-sm rounded transition-colors whitespace-nowrap ${
                  dateRange === range ? 'bg-cyan-700 text-white' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
                }`}
              >
                {range === '7d' ? t('days7', '7 Days') : range === '30d' ? t('days30', '30 Days') : range === '90d' ? t('days90', '90 Days') : t('allTime', 'All Time')}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5 2xs:gap-2 items-end flex-wrap flex-1">
            <div className="min-w-0">
              <label className="text-neutral-400 text-[10px] 2xs:text-xs tracking-wider block mb-1">{t('startDate', 'Start Date')}</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-neutral-800 border border-neutral-600 text-white w-32 2xs:w-36 h-8 text-[11px] 2xs:text-xs sm:text-sm rounded px-2"
              />
            </div>
            <div className="min-w-0">
              <label className="text-neutral-400 text-[10px] 2xs:text-xs tracking-wider block mb-1">{t('endDate', 'End Date')}</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-neutral-800 border border-neutral-600 text-white w-32 2xs:w-36 h-8 text-[11px] 2xs:text-xs sm:text-sm rounded px-2"
              />
            </div>
            <button
              onClick={() => loadData()}
              className="px-2 2xs:px-3 py-1 2xs:py-1.5 text-[10px] 2xs:text-xs border border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white rounded transition-colors h-8 whitespace-nowrap"
            >
              {t('query', 'Query')}
            </button>
          </div>
        </div>
      </TerminalCard>

      <TerminalCard>
        <div className="flex items-center justify-between min-w-0">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] 2xs:text-xs text-[#5EEAD4] tracking-widest uppercase mb-1 truncate">{t('totalIncome', 'Total Income')}</div>
            <div className="text-xl 2xs:text-2xl xs:text-3xl sm:text-4xl font-bold text-white truncate">
              {totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-sm 2xs:text-base sm:text-lg text-neutral-500 ml-2">MCC</span>
            </div>
          </div>
        </div>
      </TerminalCard>

      <div className="grid grid-cols-1 2xs:grid-cols-2 gap-2 2xs:gap-3 sm:gap-4">
        {levelIncomes.map(({ level, data, share, role }) => {
          const incomeAmount = data?.total_income ? parseFloat(data.total_income) : 0
          const recordCount = data?.record_count || 0
          const percentage = maxIncome > 0 ? (incomeAmount / maxIncome) * 100 : 0
          return (
            <TerminalCard key={level}>
              <div className="flex items-center justify-between gap-2 mb-3 2xs:mb-4">
                <div className="min-w-0 flex-1">
                  <div className="text-white font-medium text-xs 2xs:text-sm sm:text-base truncate">{LEVEL_LABELS[level]}</div>
                  <div className="text-[10px] 2xs:text-xs text-neutral-500 truncate">{role} · {(share * 100).toFixed(0)}%</div>
                </div>
                <span
                  className={`px-1.5 2xs:px-2 py-0.5 2xs:py-1 rounded text-[10px] 2xs:text-xs whitespace-nowrap shrink-0 ${
                    incomeAmount > 0 ? 'bg-white/20 text-white' : 'bg-neutral-800 text-neutral-500'
                  }`}
                >
                  {incomeAmount > 0 ? t('hasIncome', 'Has Income') : t('noIncome', 'None')}
                </span>
              </div>
              <div className="mb-3 2xs:mb-4">
                <div className="flex justify-between gap-2 text-[11px] 2xs:text-xs sm:text-sm mb-1">
                  <span className="text-neutral-400 truncate">{t('cumulativeIncome', 'Cumulative Income')}</span>
                  <span className="text-white whitespace-nowrap shrink-0">{incomeAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} MCC</span>
                </div>
                <div className="bg-neutral-800 rounded-full h-2">
                  <div className="bg-cyan-400 h-2 rounded-full transition-all" style={{ width: `${percentage}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 2xs:gap-3 sm:gap-4 pt-2 2xs:pt-3 border-t border-neutral-700">
                <div className="text-center min-w-0">
                  <div className="text-base 2xs:text-lg xs:text-xl font-bold text-white truncate">{recordCount}</div>
                  <div className="text-[10px] 2xs:text-xs text-neutral-500 truncate">{t('outputRecords', 'Output Records')}</div>
                </div>
                <div className="text-center min-w-0">
                  <div className="text-base 2xs:text-lg xs:text-xl font-bold text-white truncate">
                    {recordCount > 0 ? (incomeAmount / recordCount).toFixed(2) : '0.00'}
                  </div>
                  <div className="text-[10px] 2xs:text-xs text-neutral-500 truncate">{t('avgPerRecord', 'Average Per Record')}</div>
                </div>
              </div>
            </TerminalCard>
          )
        })}
      </div>
    </div>
  )
}
