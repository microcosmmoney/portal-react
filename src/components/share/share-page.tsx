'use client'

import { useEffect, useMemo, useState } from 'react'
import { useMCC, useMCCMiningHistory } from '@microcosmmoney/auth-react'
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

function fmtUsd(n: number): string {
  if (!Number.isFinite(n)) return '$0.00'
  return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
}

interface PositionStats {
  holdings: number
  avgCost: number
  currentPrice: number
  days: number
  entryDate: string
  hasData: boolean
}

function buildStats(records: any[], currentPrice: number): PositionStats {
  if (!records || records.length === 0) {
    return { holdings: 0, avgCost: 0, currentPrice, days: 0, entryDate: '', hasData: false }
  }
  let totalMcc = 0
  let totalPaid = 0
  let firstDate: Date | null = null
  for (const r of records) {
    const mcc = Number(r.mcc_amount ?? r.distribution_user ?? 0)
    const paid = Number(r.paid_amount ?? r.stablecoin_amount ?? 0)
    totalMcc += mcc
    totalPaid += paid
    const dateStr = r.mined_at ?? r.created_at ?? r.minted_at
    if (dateStr) {
      const d = new Date(dateStr)
      if (!firstDate || d < firstDate) firstDate = d
    }
  }
  if (totalMcc <= 0) {
    return { holdings: 0, avgCost: 0, currentPrice, days: 0, entryDate: '', hasData: false }
  }
  const avg = totalPaid / totalMcc
  const now = new Date()
  const days = firstDate ? Math.max(1, Math.floor((now.getTime() - firstDate.getTime()) / 86400000)) : 0
  const entryDate = firstDate
    ? firstDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : ''
  return { holdings: totalMcc, avgCost: avg, currentPrice, days, entryDate, hasData: true }
}

function buildOgUrl(origin: string, layout: Layout, s: PositionStats): string {
  const path = layout === 'mobile' ? '/api/og/v2m/position' : '/api/og/v2/position'
  const params = new URLSearchParams()
  if (s.hasData) {
    params.set('holdings', s.holdings.toFixed(4))
    params.set('avg', s.avgCost.toFixed(6))
    params.set('now', s.currentPrice.toFixed(6))
    params.set('days', String(s.days))
    if (s.entryDate) params.set('entry', s.entryDate)
  }
  params.set('qr', SHARE_QR_TARGET)
  params.set('_v', String(Math.floor(Date.now() / 30000)))
  return `${origin}${path}?${params.toString()}`
}

export function MicrocosmSharePage({
  basePath,
  onNavigate,
  locale = 'en',
  origin,
}: MicrocosmSharePageProps = {}) {
  const t = useTranslations('sharePage')
  const { balance: mccBalance, price: mccPrice, loading: mccLoading } = useMCC(60_000)
  const { data: history, loading: historyLoading } = useMCCMiningHistory(180)

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

  const currentPrice = Number(mccPrice?.price ?? 0)
  const stats = useMemo(
    () => buildStats(Array.isArray(history) ? history : [], currentPrice),
    [history, currentPrice]
  )
  const balanceMcc = Number(mccBalance?.balance ?? 0)
  const displayedHoldings = stats.hasData && balanceMcc > 0 ? balanceMcc : stats.holdings

  const finalStats: PositionStats = useMemo(
    () => ({ ...stats, holdings: displayedHoldings }),
    [stats, displayedHoldings]
  )

  const ogUrl = useMemo(() => buildOgUrl(resolvedOrigin, layout, finalStats), [resolvedOrigin, layout, finalStats])

  useEffect(() => {
    setImgLoaded(false)
    setImgErr(null)
  }, [ogUrl])

  const loading = mccLoading || historyLoading

  const handleSwap = () => {
    setText(prev => pickRandomText(locale, prev))
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
          <div className="flex items-center gap-2">
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
            <div className="flex-1" />
            <div className="text-[10px] sm:text-xs text-neutral-500">
              {layout === 'desktop' ? '1200×630' : '1080×1920'}
            </div>
          </div>

          {!loading && !finalStats.hasData ? (
            <div className="bg-zinc-950 border border-zinc-800 rounded p-6 text-center space-y-3">
              <div className="text-base text-neutral-300">{t('emptyTitle', 'No mining records yet')}</div>
              <div className="text-xs text-neutral-500">
                {t('emptyHint', 'Mine some MCC first and your position card will be generated automatically.')}
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

          {finalStats.hasData && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-zinc-950 border border-zinc-800 rounded p-2">
                <div className="text-[10px] text-neutral-500 tracking-wider">{t('statHoldings', 'HOLDINGS')}</div>
                <div className="text-cyan-400 font-bold mt-0.5">{fmtNum(finalStats.holdings)} MCC</div>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded p-2">
                <div className="text-[10px] text-neutral-500 tracking-wider">{t('statAvg', 'AVG COST')}</div>
                <div className="text-white font-bold mt-0.5">{fmtUsd(finalStats.avgCost)}</div>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded p-2">
                <div className="text-[10px] text-neutral-500 tracking-wider">{t('statPrice', 'PRICE')}</div>
                <div className="text-white font-bold mt-0.5">{fmtUsd(finalStats.currentPrice)}</div>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded p-2">
                <div className="text-[10px] text-neutral-500 tracking-wider">{t('statDays', 'HOLDING')}</div>
                <div className="text-white font-bold mt-0.5">{finalStats.days}d</div>
              </div>
            </div>
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
              disabled={imgBusy || !!imgErr || (!finalStats.hasData && !loading)}
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
