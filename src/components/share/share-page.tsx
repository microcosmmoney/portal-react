'use client'

import { useEffect, useMemo, useState } from 'react'
import { useMCC, useMCCAcquisitions, usePriceHistory } from '@microcosmmoney/auth-react'
import { TerminalCard } from '../terminal'
import { useTranslations } from '../../i18n-context'
import { pickRandomText, type ShareLocale } from './share-texts'

export interface MicrocosmSharePageProps {
  basePath?: string
  onNavigate?: (path: string) => void
  locale?: ShareLocale
  origin?: string
}

type Layout = 'desktop' | 'mobile'

const DEFAULT_ORIGIN = 'https://microcosm.money'
const SHARE_QR_TARGET = 'https://microcosm.money'
const MIN_SERIES_POINTS = 8

function detectIOS(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  if (/iPad|iPhone|iPod/.test(ua)) return true
  return navigator.platform === 'MacIntel' && (navigator as any).maxTouchPoints > 1
}

function fmtNum(n: number, max = 4): string {
  if (!Number.isFinite(n)) return '0'
  return n.toLocaleString('en-US', { maximumFractionDigits: max })
}

function fmtUsd(n: number, max = 2): string {
  if (!Number.isFinite(n)) return '$0.00'
  return '$' + n.toLocaleString('en-US', { maximumFractionDigits: max, minimumFractionDigits: max === 2 ? 2 : 0 })
}

interface SeriesPoint { ts: number; price: number }

interface AcquisitionMark { t: number; p: number }

interface PositionStats {
  holdings: number
  avgCost: number
  currentPrice: number
  totalCost: number
  pnlUsd: number
  pnlPct: number
  apyPct: number
  days: number
  entryDate: string
  hasData: boolean
}

function parseTs(s: string | null | undefined): number | null {
  if (!s) return null
  const t = Date.parse(s)
  return Number.isFinite(t) ? t : null
}

function computeStats(
  balanceMcc: number,
  currentPrice: number,
  acqTotalMcc: number,
  acqTotalCost: number,
  acqFirstAt: string | null,
): PositionStats {
  const holdings = balanceMcc > 0 ? balanceMcc : acqTotalMcc
  if (holdings <= 0) {
    return {
      holdings: 0, avgCost: 0, currentPrice, totalCost: 0,
      pnlUsd: 0, pnlPct: 0, apyPct: 0, days: 0, entryDate: '', hasData: false,
    }
  }
  const avgCost = acqTotalMcc > 0 ? acqTotalCost / acqTotalMcc : 0
  const totalCost = avgCost * holdings
  const value = holdings * currentPrice
  const pnlUsd = value - totalCost
  const pnlPct = avgCost > 0 ? ((currentPrice - avgCost) / avgCost) * 100 : 0

  let days = 0
  let entryDate = ''
  const firstTs = parseTs(acqFirstAt)
  if (firstTs) {
    days = Math.max(1, Math.floor((Date.now() - firstTs) / 86400000))
    entryDate = new Date(firstTs).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  let apyPct = 0
  if (avgCost > 0 && days > 0 && totalCost > 0) {
    apyPct = (pnlUsd / totalCost) * (365 / days) * 100
  }

  return {
    holdings, avgCost, currentPrice, totalCost,
    pnlUsd, pnlPct, apyPct, days, entryDate, hasData: true,
  }
}

function buildSeries(history: any[] | null, currentPrice: number, days: number): SeriesPoint[] {
  const raw: SeriesPoint[] = []
  if (Array.isArray(history)) {
    for (const r of history) {
      const ts = parseTs(r?.timestamp)
      const price = Number(r?.price)
      if (ts && Number.isFinite(price) && price > 0) raw.push({ ts, price })
    }
  }
  raw.sort((a, b) => a.ts - b.ts)

  if (raw.length < MIN_SERIES_POINTS) {
    const now = Date.now()
    const span = Math.max(days, 7) * 86400000
    const start = now - span
    const fallback: SeriesPoint[] = []
    const refPrice = currentPrice > 0 ? currentPrice : (raw[raw.length - 1]?.price || 1)
    for (let i = 0; i < 24; i++) {
      const t = start + (span * i) / 23
      fallback.push({ ts: t, price: refPrice * (0.95 + 0.05 * (i / 23)) })
    }
    return fallback
  }
  return raw
}

function buildMarks(
  events: any[] | null,
  series: SeriesPoint[],
  currentPrice: number,
): AcquisitionMark[] {
  if (!events || events.length === 0 || series.length < 2) return []
  const tStart = series[0].ts
  const tEnd = series[series.length - 1].ts
  const span = tEnd - tStart
  if (span <= 0) return []

  const buys = events.filter(e => Number(e.mcc_delta) > 0)
  const marks: AcquisitionMark[] = []
  for (const e of buys) {
    const eventTs = parseTs(e.event_at)
    if (!eventTs) continue
    if (eventTs < tStart - 86400000) continue
    let t = (eventTs - tStart) / span
    if (t < 0) t = 0
    if (t > 1) t = 1
    const price = Number(e.price_at_event) > 0 ? Number(e.price_at_event) : currentPrice
    marks.push({ t, p: price })
  }
  return marks
    .sort((a, b) => a.t - b.t)
    .filter((m, i, arr) => i === 0 || (m.t - arr[i - 1].t) > 0.04)
    .slice(0, 8)
}

function buildOgUrl(
  origin: string,
  layout: Layout,
  s: PositionStats,
  series: SeriesPoint[],
  marks: AcquisitionMark[],
): string {
  const path = layout === 'mobile' ? '/api/og/v2m/position' : '/api/og/v2/position'
  const params = new URLSearchParams()
  if (s.hasData) {
    params.set('holdings', s.holdings.toFixed(4))
    params.set('avg', s.avgCost.toFixed(6))
    params.set('now', s.currentPrice.toFixed(6))
    params.set('days', String(s.days))
    if (s.entryDate) params.set('entry', s.entryDate)
  }
  if (series.length >= 2) {
    const seriesStr = series.map(p => p.price.toFixed(6)).join(',')
    if (seriesStr.length < 2000) params.set('series', seriesStr)
  }
  if (marks.length > 0) {
    params.set('marks', marks.map(m => `${m.t.toFixed(4)}:${m.p.toFixed(6)}`).join(','))
  }
  params.set('qr', SHARE_QR_TARGET)
  return `${origin}${path}?${params.toString()}`
}

function fmtClock(iso: string | null | undefined): string {
  const t = parseTs(iso || undefined as any)
  if (!t) return '—'
  const d = new Date(t)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

export function MicrocosmSharePage({
  basePath,
  onNavigate,
  locale = 'en',
  origin,
}: MicrocosmSharePageProps = {}) {
  const t = useTranslations('sharePage')
  const { balance: mccBalance, price: mccPrice, loading: mccLoading, refresh: refreshMcc } = useMCC(60_000)
  const { data: acquisitions, loading: acqLoading, refreshing: acqRefreshing, refresh: refreshAcq } = useMCCAcquisitions({ refetchInterval: 300_000 })
  const { data: priceHistory, loading: historyLoading } = usePriceHistory('30D', { refetchInterval: 300_000 })

  const [layout, setLayout] = useState<Layout>('desktop')
  const [text, setText] = useState<string>('')
  const [textCopied, setTextCopied] = useState(false)
  const [imgCopied, setImgCopied] = useState(false)
  const [imgBusy, setImgBusy] = useState(false)
  const [imgErr, setImgErr] = useState<string | null>(null)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    setIsIOS(detectIOS())
    setText(pickRandomText(locale))
  }, [locale])

  const resolvedOrigin = useMemo(() => {
    if (origin) return origin.replace(/\/$/, '')
    if (typeof window !== 'undefined') return window.location.origin
    return DEFAULT_ORIGIN
  }, [origin])

  const balanceMcc = Number(mccBalance?.balance ?? 0)
  const currentPrice = Number(
    (mccPrice as any)?.spot_price
    ?? (mccPrice as any)?.market_price
    ?? mccPrice?.price
    ?? 0
  )
  const acqTotalMcc = Number(acquisitions?.total_mcc_in ?? 0)
  const acqTotalCost = Number(acquisitions?.total_usdc_cost ?? 0)
  const acqFirstAt = acquisitions?.first_event_at ?? null
  const acqEvents = acquisitions?.events ?? []
  const lastSyncedAt = acquisitions?.last_synced_at ?? null
  const wallets = mccBalance?.wallets ?? []

  const stats = useMemo(
    () => computeStats(balanceMcc, currentPrice, acqTotalMcc, acqTotalCost, acqFirstAt),
    [balanceMcc, currentPrice, acqTotalMcc, acqTotalCost, acqFirstAt],
  )

  const series = useMemo(
    () => buildSeries(priceHistory as any, currentPrice, stats.days || 30),
    [priceHistory, currentPrice, stats.days],
  )

  const marks = useMemo(
    () => buildMarks(acqEvents as any[], series, currentPrice),
    [acqEvents, series, currentPrice],
  )

  const ogUrl = useMemo(
    () => buildOgUrl(resolvedOrigin, layout, stats, series, marks),
    [resolvedOrigin, layout, stats, series, marks],
  )

  useEffect(() => {
    setImgLoaded(false)
    setImgErr(null)
  }, [ogUrl])

  const loading = mccLoading || acqLoading || historyLoading
  const refreshing = acqRefreshing

  const handleSwap = () => {
    setText(prev => pickRandomText(locale, prev))
  }

  const handleManualRefresh = async () => {
    setImgErr(null)
    await Promise.all([refreshMcc(), refreshAcq(true)])
  }

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setTextCopied(true)
      setTimeout(() => setTextCopied(false), 1800)
    } catch {
      setImgErr(t('copyTextFail', 'Copy failed. Long-press the text to copy manually.'))
    }
  }

  const handleImageAction = async () => {
    setImgErr(null)
    if (isIOS) {
      const a = document.createElement('a')
      a.href = ogUrl
      a.target = '_blank'
      a.rel = 'noopener noreferrer'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      return
    }
    setImgBusy(true)
    try {
      const res = await fetch(ogUrl, { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const blob = await res.blob()
      const supportsClipboardItem = typeof window !== 'undefined' && typeof (window as any).ClipboardItem !== 'undefined'
      if (supportsClipboardItem && navigator.clipboard && (navigator.clipboard as any).write) {
        const item = new (window as any).ClipboardItem({ [blob.type || 'image/png']: blob })
        await (navigator.clipboard as any).write([item])
        setImgCopied(true)
        setTimeout(() => setImgCopied(false), 2200)
      } else {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `microcosm-position-${layout}-${Date.now()}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (e: any) {
      setImgErr(t('imageActionFail', 'Action failed: {msg}', { msg: e?.message ?? 'unknown' }))
    } finally {
      setImgBusy(false)
    }
  }

  const imageActionLabel = isIOS
    ? t('saveImage', 'Save Image')
    : (imgBusy ? t('processing', 'Processing…') : (imgCopied ? t('copied', 'Copied!') : t('copyImage', 'Copy Image')))

  const aspectRatio = layout === 'mobile' ? '1080 / 1920' : '1200 / 630'
  const imageWrapperMaxWidth = layout === 'mobile' ? 'min(380px, 100%)' : '100%'

  const goMining = () => {
    if (onNavigate) onNavigate(`${basePath ?? ''}/mcc/mining`)
  }

  const isUp = stats.pnlUsd >= 0
  const pnlClass = isUp ? 'text-emerald-400' : 'text-red-400'
  const updatedLabel = lastSyncedAt ? fmtClock(lastSyncedAt) : (loading ? '…' : '—')

  return (
    <div className="max-w-7xl mx-auto px-3 py-4 space-y-4 sm:px-6 sm:py-6 sm:space-y-6 font-mono">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-wider">
          {t('title', 'Share My Position')}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          {t('subtitle', 'Generate a position card from your account and copy it anywhere')}
        </p>
      </div>

      <TerminalCard filename="share.png">
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setLayout('desktop')}
              className={
                'px-3 py-1.5 text-xs sm:text-sm rounded border transition-colors ' +
                (layout === 'desktop'
                  ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300'
                  : 'bg-transparent border-white/10 text-neutral-400 hover:text-white hover:border-white/30')
              }
            >
              {t('desktop', 'Desktop')}
            </button>
            <button
              onClick={() => setLayout('mobile')}
              className={
                'px-3 py-1.5 text-xs sm:text-sm rounded border transition-colors ' +
                (layout === 'mobile'
                  ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300'
                  : 'bg-transparent border-white/10 text-neutral-400 hover:text-white hover:border-white/30')
              }
            >
              {t('mobile', 'Mobile')}
            </button>
            <div className="flex-1 min-w-[20px]" />
            <div className="text-[10px] sm:text-xs text-neutral-500 flex items-center gap-2">
              <span>{t('updatedAt', 'Data:')} {updatedLabel}</span>
              <button
                onClick={handleManualRefresh}
                disabled={refreshing}
                className={
                  'px-2 py-1 rounded border text-[10px] sm:text-xs transition-colors ' +
                  (refreshing
                    ? 'border-white/10 text-neutral-500 cursor-not-allowed'
                    : 'border-white/15 text-neutral-300 hover:border-cyan-400/60 hover:text-cyan-300')
                }
                title={t('refreshTooltip', 'Re-scan your wallets from chain (slow)')}
              >
                {refreshing ? t('refreshing', 'Syncing…') : `↻ ${t('refresh', 'Refresh')}`}
              </button>
            </div>
            <div className="text-[10px] sm:text-xs text-neutral-500 ml-auto">
              {layout === 'desktop' ? '1200×630' : '1080×1920'}
            </div>
          </div>

          {!loading && !stats.hasData ? (
            <div className="bg-zinc-950 border border-zinc-800 rounded p-6 text-center space-y-3">
              <div className="text-base text-neutral-300">{t('emptyTitle', 'No MCC position yet')}</div>
              <div className="text-xs text-neutral-500">
                {t('emptyHint', 'Mine or buy MCC first, then come back to share your card.')}
              </div>
              {onNavigate && (
                <button
                  onClick={goMining}
                  className="px-4 py-1.5 text-xs rounded bg-cyan-500/20 border border-cyan-400/60 text-cyan-300 hover:bg-cyan-500/30 transition-colors"
                >
                  {t('goMine', 'Go mine MCC')}
                </button>
              )}
            </div>
          ) : (
            <div className="bg-black border border-white/10 rounded overflow-hidden flex justify-center">
              <div
                style={{
                  width: '100%',
                  maxWidth: imageWrapperMaxWidth,
                  aspectRatio,
                  position: 'relative',
                }}
              >
                {!imgLoaded && !imgErr && (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-neutral-500">
                    {t('renderingImage', 'Rendering image…')}
                  </div>
                )}
                <img
                  key={ogUrl}
                  src={ogUrl}
                  alt={t('alt', 'My MCC position card')}
                  loading="lazy"
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setImgErr(t('imgLoadFail', 'Image failed to load'))}
                  style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }}
                />
              </div>
            </div>
          )}

          {stats.hasData && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-zinc-950 border border-zinc-800 rounded p-2">
                  <div className="text-[10px] text-neutral-500 tracking-wider">{t('statHoldings', 'HOLDINGS')}</div>
                  <div className="text-cyan-400 font-bold mt-0.5">{fmtNum(stats.holdings)} MCC</div>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 rounded p-2">
                  <div className="text-[10px] text-neutral-500 tracking-wider">{t('statAvg', 'AVG COST')}</div>
                  <div className="text-white font-bold mt-0.5">
                    {stats.avgCost > 0 ? fmtUsd(stats.avgCost, 4) : '—'}
                  </div>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 rounded p-2">
                  <div className="text-[10px] text-neutral-500 tracking-wider">{t('statPnl', 'P&L')}</div>
                  <div className={`font-bold mt-0.5 ${pnlClass}`}>
                    {stats.avgCost > 0 ? fmtUsd(stats.pnlUsd) : '—'}
                  </div>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 rounded p-2">
                  <div className="text-[10px] text-neutral-500 tracking-wider">{t('statApy', 'APY')}</div>
                  <div className={`font-bold mt-0.5 ${pnlClass}`}>
                    {stats.apyPct !== 0 && Number.isFinite(stats.apyPct)
                      ? `${stats.apyPct >= 0 ? '+' : ''}${stats.apyPct.toFixed(1)}%`
                      : '—'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-zinc-950/60 border border-zinc-800/60 rounded p-2">
                  <div className="text-[10px] text-neutral-500 tracking-wider">{t('statValue', 'VALUE')}</div>
                  <div className="text-white font-bold mt-0.5">{fmtUsd(stats.holdings * stats.currentPrice)}</div>
                </div>
                <div className="bg-zinc-950/60 border border-zinc-800/60 rounded p-2">
                  <div className="text-[10px] text-neutral-500 tracking-wider">{t('statDays', 'HOLDING')}</div>
                  <div className="text-white font-bold mt-0.5">{stats.days || '—'}d</div>
                </div>
                <div className="bg-zinc-950/60 border border-zinc-800/60 rounded p-2">
                  <div className="text-[10px] text-neutral-500 tracking-wider">{t('statWallets', 'WALLETS')}</div>
                  <div className="text-white font-bold mt-0.5">{wallets.length}</div>
                </div>
                <div className="bg-zinc-950/60 border border-zinc-800/60 rounded p-2">
                  <div className="text-[10px] text-neutral-500 tracking-wider">{t('statEvents', 'ADDS')}</div>
                  <div className="text-white font-bold mt-0.5">{marks.length}</div>
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-[10px] sm:text-xs text-neutral-500 tracking-wider">
                {t('captionLabel', 'CAPTION')}
              </div>
              <button
                onClick={handleSwap}
                className="text-[10px] sm:text-xs text-neutral-400 hover:text-cyan-300 transition-colors"
              >
                {t('swap', 'Swap')} ⟳
              </button>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded p-3 text-sm text-neutral-200 min-h-[3.5rem] leading-relaxed">
              {text || '…'}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCopyText}
              className="flex-1 min-w-[120px] px-3 py-2 text-xs sm:text-sm rounded bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/30 transition-colors"
            >
              {textCopied ? `✓ ${t('copied', 'Copied!')}` : t('copyText', 'Copy Caption')}
            </button>
            <button
              onClick={handleImageAction}
              disabled={imgBusy || !!imgErr || (!stats.hasData && !loading)}
              className={
                'flex-1 min-w-[120px] px-3 py-2 text-xs sm:text-sm rounded transition-colors ' +
                (imgBusy
                  ? 'bg-cyan-500/10 border border-cyan-400/30 text-cyan-300/60 cursor-not-allowed'
                  : 'bg-cyan-500/20 border border-cyan-400/60 text-cyan-300 hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed')
              }
            >
              {imageActionLabel}
            </button>
          </div>

          {imgErr && (
            <div className="text-xs text-red-400 bg-red-950/30 border border-red-900/50 rounded p-2">
              {imgErr}
            </div>
          )}

          <div className="text-[10px] text-neutral-500 leading-relaxed">
            {isIOS
              ? t('iosHint', 'On iOS the image opens in a new tab — long-press it and choose Save Image.')
              : t('desktopHint', 'Image is copied to your clipboard. Paste it into any chat, post or doc.')
            }
          </div>
        </div>
      </TerminalCard>
    </div>
  )
}
