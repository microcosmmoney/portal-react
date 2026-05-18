// AI-generated · AI-managed · AI-maintained
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'
import { ExternalLink, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'

interface MagistrateDistribution {
  total: number
  station: number
  matrix: number
  sector: number
  system: number
}

interface Distribution {
  user: number
  lp: number
  magistrate: MagistrateDistribution
  station_mcd: number
}

interface DistributionRecord {
  id: number
  uid: string
  user_email: string | null
  display_name: string | null
  territory_id: string | null
  amount: number
  distribution: Distribution
  source: string
  tx_signature: string | null
  reason: string | null
  onchain_status: string | null
  minted_at: string | null
}

interface DistributionHistoryProps {
  uid?: string
  territoryId?: string
  source?: 'x402' | 'cronjob'
  title?: string
  description?: string
  showUserColumn?: boolean
  limit?: number
}

export function MiningDistributionHistory({
  uid,
  territoryId,
  source,
  title = '\u94f8\u9020\u4ea7\u51fa\u5386\u53f2',
  description = '\u67e5\u770b\u94f8\u9020\u4ea7\u51fa\u660e\u7ec6',
  showUserColumn = true,
  limit = 20
}: DistributionHistoryProps) {
  const [records, setRecords] = useState<DistributionRecord[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const [offset, setOffset] = useState(0)

  const fetchHistory = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (uid) params.append('uid', uid)
      if (territoryId) params.append('territory_id', territoryId)
      if (source) params.append('source', source)
      params.append('limit', limit.toString())
      params.append('offset', offset.toString())

      const response = await fetch(`/api/blockchain/mcc/distribution-history?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setRecords(data.records)
        setTotalCount(data.total_count)
      } else {
        setError(data.error || '\u83b7\u53d6\u6570\u636e\u5931\u8d25')
      }
    } catch (err) {
      setError('\u7f51\u7edc\u9519\u8bef，\u8bf7\u7a0d\u540e\u91cd\u8bd5')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [uid, territoryId, source, offset])

  const formatNumber = (num: number, decimals = 4) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  }

  const getSolanaExplorerUrl = (signature: string) => {
    return `https://solscan.io/tx/${signature}`
  }

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'x402':
        return <Badge variant="default" className="bg-cyan-700">x402</Badge>
      case 'cronjob':
        return <Badge variant="secondary" className="bg-neutral-700 text-neutral-300">CronJob</Badge>
      default:
        return <Badge variant="outline" className="border-neutral-600 text-neutral-400">{source}</Badge>
    }
  }

  const toggleExpandRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id)
  }

  if (loading && records.length === 0) {
    return (
      <Card className="bg-neutral-900 border-neutral-700 dash-card">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">{title}</CardTitle>
          <CardDescription className="text-neutral-500">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full bg-neutral-800" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-neutral-900 border-neutral-700 dash-card">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">{title}</CardTitle>
          <CardDescription className="text-neutral-500">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchHistory} variant="outline" className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent">
              <RefreshCw className="mr-2 h-4 w-4" />
              \u91cd\u8bd5
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-neutral-900 border-neutral-700 dash-card">
      <CardHeader className="flex flex-row items-center justify-between gap-2 px-3 sm:px-6">
        <div className="min-w-0">
          <CardTitle className="text-xs sm:text-sm font-medium text-neutral-300 tracking-wider">{title}</CardTitle>
          <CardDescription className="text-neutral-500 text-[10px] sm:text-sm">{description} (\u5171 {totalCount} \u6761\u8bb0\u5f55)</CardDescription>
        </div>
        <Button onClick={fetchHistory} variant="outline" size="sm" disabled={loading} className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent shrink-0">
          <RefreshCw className={`mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden xs:inline">\u5237\u65b0</span>
        </Button>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        {records.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            \u6682\u65e0\u4ea7\u51fa\u8bb0\u5f55
          </div>
        ) : (
          <>
            {/* Desktop: Table view */}
            <div className="hidden md:block rounded-md border border-neutral-700 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-neutral-700 hover:bg-transparent">
                    <TableHead className="w-[50px] text-neutral-400">\u8be6\u60c5</TableHead>
                    <TableHead className="text-neutral-400">\u65f6\u95f4</TableHead>
                    {showUserColumn && <TableHead className="text-neutral-400">\u7528\u6237</TableHead>}
                    <TableHead className="text-right text-neutral-400">\u603b\u91cf (MCC)</TableHead>
                    <TableHead className="text-right text-neutral-400">\u7528\u6237 100%</TableHead>
                    <TableHead className="text-right text-neutral-400">LP 30%</TableHead>
                    <TableHead className="text-right text-neutral-400">\u653f\u52a1\u5b98 40%</TableHead>
                    <TableHead className="text-right text-neutral-400">\u91d1\u5e93 30% (MCD)</TableHead>
                    <TableHead className="text-neutral-400">\u6765\u6e90</TableHead>
                    <TableHead className="text-neutral-400">\u4ea4\u6613</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <>
                      <TableRow key={record.id} className="cursor-pointer border-neutral-700 hover:bg-neutral-800/50">
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpandRow(record.id)}
                            className="text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
                          >
                            {expandedRow === record.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-neutral-300">
                          {record.minted_at
                            ? format(new Date(record.minted_at), 'MM-dd HH:mm')
                            : '-'}
                        </TableCell>
                        {showUserColumn && (
                          <TableCell className="max-w-[150px] truncate text-neutral-300">
                            {record.display_name || record.user_email || record.uid.slice(0, 8)}
                          </TableCell>
                        )}
                        <TableCell className="text-right font-mono text-neutral-200">
                          {formatNumber(record.amount)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-cyan-500">
                          {formatNumber(record.distribution.user)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-cyan-500">
                          {formatNumber(record.distribution.lp)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-cyan-500">
                          {formatNumber(record.distribution.magistrate.total)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-cyan-500">
                          {formatNumber(record.distribution.station_mcd)}
                        </TableCell>
                        <TableCell>{getSourceBadge(record.source)}</TableCell>
                        <TableCell>
                          {record.tx_signature ? (
                            <a
                              href={getSolanaExplorerUrl(record.tx_signature)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-cyan-400 hover:text-cyan-300"
                            >
                              <span className="font-mono text-xs">
                                {record.tx_signature.slice(0, 8)}...
                              </span>
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-neutral-600">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                      {expandedRow === record.id && (
                        <TableRow key={`${record.id}-expanded`} className="bg-neutral-800/30 border-neutral-700">
                          <TableCell colSpan={showUserColumn ? 10 : 9}>
                            <div className="py-3 px-4">
                              <h4 className="font-semibold mb-3 text-neutral-200 text-sm">\u653f\u52a1\u5b98\u4ea7\u51fa\u660e\u7ec6 (40%)</h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="bg-neutral-800 rounded-lg p-2.5 border border-neutral-700">
                                  <div className="text-xs text-neutral-500">Station \u653f\u52a1\u5b98 (16%)</div>
                                  <div className="font-mono text-base text-neutral-200">
                                    {formatNumber(record.distribution.magistrate.station)}
                                  </div>
                                </div>
                                <div className="bg-neutral-800 rounded-lg p-2.5 border border-neutral-700">
                                  <div className="text-xs text-neutral-500">Matrix \u653f\u52a1\u5b98 (12%)</div>
                                  <div className="font-mono text-base text-neutral-200">
                                    {formatNumber(record.distribution.magistrate.matrix)}
                                  </div>
                                </div>
                                <div className="bg-neutral-800 rounded-lg p-2.5 border border-neutral-700">
                                  <div className="text-xs text-neutral-500">Sector \u653f\u52a1\u5b98 (8%)</div>
                                  <div className="font-mono text-base text-neutral-200">
                                    {formatNumber(record.distribution.magistrate.sector)}
                                  </div>
                                </div>
                                <div className="bg-neutral-800 rounded-lg p-2.5 border border-neutral-700">
                                  <div className="text-xs text-neutral-500">System \u653f\u52a1\u5b98 (4%)</div>
                                  <div className="font-mono text-base text-neutral-200">
                                    {formatNumber(record.distribution.magistrate.system)}
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3 text-xs text-neutral-500 space-y-0.5">
                                <p><span className="font-medium text-neutral-400">\u7528\u6237 UID:</span> {record.uid}</p>
                                {record.territory_id && <p><span className="font-medium text-neutral-400">\u5f52\u5c5e Station:</span> {record.territory_id}</p>}
                                <p><span className="font-medium text-neutral-400">\u539f\u56e0:</span> {record.reason || 'N/A'}</p>
                                <p>
                                  <span className="font-medium text-neutral-400">\u94fe\u4e0a\u72b6\u6001:</span>{' '}
                                  <Badge variant={record.onchain_status === 'confirmed' ? 'default' : 'secondary'} className={record.onchain_status === 'confirmed' ? 'bg-cyan-700' : 'bg-neutral-700 text-neutral-300'}>
                                    {record.onchain_status || 'pending'}
                                  </Badge>
                                </p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile: Card-based view */}
            <div className="md:hidden space-y-2">
              {records.map((record) => (
                <div key={record.id} className="bg-neutral-800 rounded-lg p-2.5 border border-neutral-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {record.minted_at ? format(new Date(record.minted_at), 'MM-dd HH:mm') : '-'}
                      </span>
                      {getSourceBadge(record.source)}
                    </div>
                    {record.tx_signature && (
                      <a href={getSolanaExplorerUrl(record.tx_signature)} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  {showUserColumn && (
                    <div className="text-[10px] text-neutral-400 mb-1.5 truncate">
                      {record.display_name || record.user_email || record.uid.slice(0, 8)}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                    <div className="flex justify-between bg-neutral-900 rounded px-2 py-1">
                      <span className="text-neutral-500">\u603b\u91cf</span>
                      <span className="text-neutral-200">{formatNumber(record.amount)}</span>
                    </div>
                    <div className="flex justify-between bg-neutral-900 rounded px-2 py-1">
                      <span className="text-neutral-500">\u7528\u6237</span>
                      <span className="text-cyan-500">{formatNumber(record.distribution.user)}</span>
                    </div>
                    <div className="flex justify-between bg-neutral-900 rounded px-2 py-1">
                      <span className="text-neutral-500">LP</span>
                      <span className="text-cyan-500">{formatNumber(record.distribution.lp)}</span>
                    </div>
                    <div className="flex justify-between bg-neutral-900 rounded px-2 py-1">
                      <span className="text-neutral-500">\u91d1\u5e93MCD</span>
                      <span className="text-cyan-500">{formatNumber(record.distribution.station_mcd)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleExpandRow(record.id)}
                    className="flex items-center gap-1 mt-1.5 text-[10px] text-neutral-500 hover:text-neutral-300"
                  >
                    {expandedRow === record.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    \u653f\u52a1\u5b98\u660e\u7ec6
                  </button>
                  {expandedRow === record.id && (
                    <div className="mt-2 pt-2 border-t border-neutral-700">
                      <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                        <div className="bg-neutral-900 rounded px-2 py-1">
                          <div className="text-neutral-500">Station (16%)</div>
                          <div className="text-neutral-200">{formatNumber(record.distribution.magistrate.station)}</div>
                        </div>
                        <div className="bg-neutral-900 rounded px-2 py-1">
                          <div className="text-neutral-500">Matrix (12%)</div>
                          <div className="text-neutral-200">{formatNumber(record.distribution.magistrate.matrix)}</div>
                        </div>
                        <div className="bg-neutral-900 rounded px-2 py-1">
                          <div className="text-neutral-500">Sector (8%)</div>
                          <div className="text-neutral-200">{formatNumber(record.distribution.magistrate.sector)}</div>
                        </div>
                        <div className="bg-neutral-900 rounded px-2 py-1">
                          <div className="text-neutral-500">System (4%)</div>
                          <div className="text-neutral-200">{formatNumber(record.distribution.magistrate.system)}</div>
                        </div>
                      </div>
                      <div className="mt-1.5 text-[10px] text-neutral-500 space-y-0.5">
                        <p>UID: {record.uid.slice(0, 12)}...</p>
                        {record.territory_id && <p>Station: {record.territory_id}</p>}
                        <p>
                          <Badge variant={record.onchain_status === 'confirmed' ? 'default' : 'secondary'} className={`text-[9px] ${record.onchain_status === 'confirmed' ? 'bg-cyan-700' : 'bg-neutral-700 text-neutral-300'}`}>
                            {record.onchain_status || 'pending'}
                          </Badge>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {totalCount > limit && (
              <div className="flex flex-col xs:flex-row items-center justify-between mt-3 sm:mt-4 gap-2">
                <p className="text-[10px] sm:text-sm text-neutral-500">
                  \u663e\u793a {offset + 1} - {Math.min(offset + limit, totalCount)} \u6761，\u5171 {totalCount} \u6761
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOffset(Math.max(0, offset - limit))}
                    disabled={offset === 0}
                    className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent text-xs"
                  >
                    \u4e0a\u4e00\u9875
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOffset(offset + limit)}
                    disabled={offset + limit >= totalCount}
                    className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent text-xs"
                  >
                    \u4e0b\u4e00\u9875
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default MiningDistributionHistory
