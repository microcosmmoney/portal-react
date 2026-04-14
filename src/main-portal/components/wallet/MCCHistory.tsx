// AI-generated · AI-managed · AI-maintained
'use client'

import { useState, useEffect } from 'react'
import { ArrowDownLeft, ArrowUpRight, Pickaxe, Gift, Lock, Unlock, RefreshCw, ExternalLink, Filter, RotateCcw, History, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { getMCCHistory } from '../../lib/api-service'
import type { MCCHistoryRecord } from '../../lib/types/api'
import { FormattedDateCustom } from '../ui/time-remaining'
import { cn } from '../../lib/utils'

const formatNumber = (num: number, decimals = 2) =>
  num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit'
}

const getTypeIcon = (type: string, direction: string) => {
  switch (type) {
    case 'mining':
      return <Pickaxe className="h-4 w-4 text-white" />
    case 'reward':
      return <Gift className="h-4 w-4 text-cyan-400" />
    case 'lock':
      return <Lock className="h-4 w-4 text-cyan-400" />
    case 'unlock':
      return <Unlock className="h-4 w-4 text-cyan-400" />
    case 'reincarnation':
      return <RotateCcw className="h-4 w-4 text-cyan-400" />
    case 'transfer':
      return direction === 'in'
        ? <ArrowDownLeft className="h-4 w-4 text-white" />
        : <ArrowUpRight className="h-4 w-4 text-red-400" />
    default:
      return direction === 'in'
        ? <ArrowDownLeft className="h-4 w-4 text-white" />
        : <ArrowUpRight className="h-4 w-4 text-red-400" />
  }
}

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    mining: '\u94f8\u9020',
    reincarnation: '\u505a\u5e02',
    transfer: '\u8f6c\u8d26',
    reward: '\u5956\u52b1',
    lock: '\u9501\u5b9a',
    unlock: '\u89e3\u9501',
  }
  return labels[type] || type
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'confirmed':
    case 'completed':
      return <Badge className="bg-white/20 text-white border border-white/30">\u5df2\u786e\u8ba4</Badge>
    case 'pending':
      return <Badge className="bg-cyan-400/20 text-cyan-400 border border-cyan-400/30">\u5904\u7406\u4e2d</Badge>
    case 'failed':
      return <Badge className="bg-red-500/20 text-red-500 border border-red-500/30">\u5931\u8d25</Badge>
    default:
      return <Badge className="bg-neutral-500/20 text-neutral-300 border border-neutral-500/30">{status}</Badge>
  }
}

interface MCCHistoryProps {
  userId: string | undefined
  showTitle?: boolean
  limit?: number
  defaultType?: string
  defaultExpanded?: boolean
}

export default function MCCHistory({ userId, showTitle = true, limit = 20, defaultType = 'all', defaultExpanded = false }: MCCHistoryProps) {
  const [history, setHistory] = useState<MCCHistoryRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState(defaultType)
  const [expanded, setExpanded] = useState(defaultExpanded)

  const fetchHistory = async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const res = await getMCCHistory(userId, { limit, type: filterType })
      if (res.success && res.data) {
        setHistory(res.data)
      }
    } catch (err) {
      console.error('[MCCHistory] \u83b7\u53d6\u5386\u53f2\u5931\u8d25:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [userId, filterType])

  const summaryText = history.length > 0
    ? `MCC \u4ea4\u6613\u5386\u53f2 · \u5171 ${history.length} \u7b14 · \u6700\u8fd1: ${new Date(history[0].created_at).toLocaleDateString('zh-CN')}`
    : 'MCC \u4ea4\u6613\u5386\u53f2 · \u6682\u65e0\u8bb0\u5f55'

  return (
    <div id="mcc-history">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-neutral-400 hover:text-neutral-300 text-sm transition-colors w-full justify-center py-2"
      >
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        {summaryText}
      </button>

      {expanded && (
        <Card className="bg-neutral-900 border-neutral-700 dash-card mt-2"><CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-neutral-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-neutral-800 border border-neutral-600 text-white text-xs rounded px-2 py-1.5 focus:outline-none focus:border-neutral-500"
              >
                <option value="all">\u5168\u90e8\u8bb0\u5f55</option>
                <option value="mining">\u94f8\u9020</option>
                <option value="reincarnation">\u505a\u5e02</option>
                <option value="transfer">\u8f6c\u8d26</option>
                <option value="reward">\u5956\u52b1</option>
                <option value="lock">\u9501\u5b9a</option>
                <option value="unlock">\u89e3\u9501</option>
              </select>
            </div>
            <button
              onClick={fetchHistory}
              disabled={loading}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-5 h-5 animate-spin text-neutral-500" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              <History className="w-6 h-6 mx-auto mb-2 opacity-50" />
              <p className="text-sm">\u6682\u65e0\u4ea4\u6613\u8bb0\u5f55</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((record) => (
                <div
                  key={record.id}
                  className="p-3 bg-neutral-800 border border-neutral-700 rounded hover:bg-neutral-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded bg-neutral-700">
                        {getTypeIcon(record.type, record.direction)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white">{record.source_display || getTypeLabel(record.type)}</span>
                          {getStatusBadge(record.status)}
                        </div>
                        <div className="text-xs text-neutral-500 mt-0.5">
                          <FormattedDateCustom dateTime={record.created_at} options={dateFormatOptions} />
                          {record.memo && <span className="ml-2">{record.memo}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={cn(
                        "text-sm font-bold font-mono",
                        record.direction === 'in' ? 'text-white' : 'text-red-400'
                      )}>
                        {record.direction === 'in' ? '+' : '-'}
                        {record.type === 'mining' && record.distribution_details?.user_mcc !== undefined
                          ? formatNumber(record.distribution_details.user_mcc)
                          : formatNumber(record.amount)}
                        <span className="text-xs font-normal text-neutral-500 ml-1">MCC</span>
                      </div>
                      {record.tx_hash && (
                        <a
                          href={`https://solscan.io/tx/${record.tx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 mt-1"
                        >
                          <code className="font-mono">{record.tx_hash.slice(0, 8)}...</code>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent></Card>
      )}
    </div>
  )
}
