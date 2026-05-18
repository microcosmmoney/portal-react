'use client'

import { useState } from 'react'
import { useMCCPrice } from '@microcosmmoney/auth-react'
import { TerminalCard } from '../terminal'
import { useTranslations } from '../../i18n-context'

const POOL_ADDRESS = 'REDEh89TzpwCtoWQuuNPtxskrVoUDQgowR7e7sZpWj9'
const USDT_VAULT = 'BnHA9jSm88wzQS4c2nCgTXch1Byzc3FWn2G7Wgrvazy3'
const USDC_VAULT = '5L8vPTvGH14keLq4R6CGGvSFksZFjb7bRPXarCwZbmUA'

export interface MicrocosmReincarnationPageProps {
  basePath?: string
  onNavigate?: (path: string) => void
  title?: string
  subtitle?: string
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }
  return (
    <button onClick={handleCopy} className="text-neutral-400 hover:text-white transition-colors text-xs" aria-label="Copy">
      {copied ? '✓' : '⧉'}
    </button>
  )
}

function formatNumber(num: number, decimals = 2): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M'
  return num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

export function MicrocosmReincarnationPage({
  title,
  subtitle,
}: MicrocosmReincarnationPageProps = {}) {
  const t = useTranslations('reincarnationDash')
  const resolvedTitle = title ?? t('title', 'Reincarnation Pool')
  const resolvedSubtitle = subtitle ?? t('subtitle', '2140 Protocol autonomous market making')
  const { data: priceData, loading } = useMCCPrice({ refetchInterval: 60_000 })
  const basePrice = priceData?.price ?? 0

  return (
    <div className="max-w-7xl mx-auto px-2 py-3 space-y-2 2xs:px-3 2xs:py-4 2xs:space-y-3 sm:px-6 sm:py-6 sm:space-y-6 font-mono">
      <div className="min-w-0">
        <h1 className="text-base 2xs:text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-wider truncate">{resolvedTitle}</h1>
        <p className="text-[10px] 2xs:text-xs sm:text-sm text-neutral-400 mt-1">{resolvedSubtitle}</p>
      </div>

      <div className="grid grid-cols-2 2xs:grid-cols-2 xs:grid-cols-2 sm:grid-cols-4 gap-1.5 2xs:gap-2 sm:gap-3">
        <TerminalCard>
          <div className="text-[8px] 2xs:text-[9px] sm:text-[10px] text-neutral-400 tracking-wider mb-1 2xs:mb-2">BASE PRICE</div>
          <div className="text-lg 2xs:text-xl xs:text-2xl sm:text-3xl font-bold font-mono text-cyan-400 truncate">
            {loading ? '—' : formatNumber(basePrice, 4)}
            <span className="text-[10px] 2xs:text-xs sm:text-sm font-normal text-neutral-500 ml-1">USD</span>
          </div>
        </TerminalCard>

        <TerminalCard>
          <div className="text-[8px] 2xs:text-[9px] sm:text-[10px] text-neutral-400 tracking-wider mb-1 2xs:mb-2">PROTOCOL</div>
          <div className="text-lg 2xs:text-xl xs:text-2xl sm:text-3xl font-bold font-mono text-white">2140</div>
          <div className="text-[8px] 2xs:text-[9px] sm:text-[10px] text-neutral-500 mt-1">EMA weighted</div>
        </TerminalCard>

        <TerminalCard>
          <div className="text-[8px] 2xs:text-[9px] sm:text-[10px] text-neutral-400 tracking-wider mb-1 2xs:mb-2">EPOCH</div>
          <div className="text-lg 2xs:text-xl xs:text-2xl sm:text-3xl font-bold font-mono text-white">1h</div>
          <div className="text-[8px] 2xs:text-[9px] sm:text-[10px] text-neutral-500 mt-1">Auto buyback</div>
        </TerminalCard>

        <TerminalCard>
          <div className="text-[8px] 2xs:text-[9px] sm:text-[10px] text-neutral-400 tracking-wider mb-1 2xs:mb-2">DEX</div>
          <div className="text-lg 2xs:text-xl xs:text-2xl sm:text-3xl font-bold font-mono text-cyan-400">Raydium</div>
          <div className="text-[8px] 2xs:text-[9px] sm:text-[10px] text-neutral-500 mt-1">CPMM pool</div>
        </TerminalCard>
      </div>

      <TerminalCard title={t('contractAddresses', 'Contract Addresses')}>
        <div className="space-y-2 2xs:space-y-3">
          <div className="bg-white/5 border border-white/10 rounded-lg p-2 2xs:p-3 blockchain-sub-card min-w-0">
            <div className="text-[10px] 2xs:text-xs text-neutral-400 tracking-wider mb-1">Reincarnation Pool PDA</div>
            <div className="flex items-center justify-between gap-2 min-w-0">
              <code className="text-[10px] 2xs:text-xs sm:text-sm text-cyan-400 min-w-0 flex-1">{POOL_ADDRESS}</code>
              <div className="flex items-center gap-1.5 2xs:gap-2 shrink-0">
                <CopyButton text={POOL_ADDRESS} />
                <a
                  href={`https://solscan.io/account/${POOL_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white text-xs"
                >
                  ↗
                </a>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 2xs:gap-2 sm:gap-3">
            <div className="bg-white/5 border border-white/10 rounded-lg p-2 2xs:p-3 blockchain-sub-card min-w-0">
              <div className="text-[10px] 2xs:text-xs text-neutral-400 tracking-wider mb-1">{t('usdtBalance', 'USDT Vault')}</div>
              <div className="flex items-center justify-between gap-2 min-w-0">
                <code className="text-[10px] 2xs:text-xs text-neutral-400 min-w-0 flex-1">{USDT_VAULT}</code>
                <CopyButton text={USDT_VAULT} />
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-2 2xs:p-3 blockchain-sub-card min-w-0">
              <div className="text-[10px] 2xs:text-xs text-neutral-400 tracking-wider mb-1">{t('usdcBalance', 'USDC Vault')}</div>
              <div className="flex items-center justify-between gap-2 min-w-0">
                <code className="text-[10px] 2xs:text-xs text-neutral-400 min-w-0 flex-1">{USDC_VAULT}</code>
                <CopyButton text={USDC_VAULT} />
              </div>
            </div>
          </div>
        </div>
      </TerminalCard>

      <TerminalCard title={t('mechanism', 'Market Making Mechanism')}>
        <div className="text-xs 2xs:text-sm space-y-2">
          <div className="font-medium text-cyan-400 tracking-wider text-xs 2xs:text-sm sm:text-base">{t('mechanism', 'Market Making Mechanism')}</div>
          <p className="text-neutral-400 leading-relaxed text-xs 2xs:text-sm">
            {t('mechanismDesc', 'The Reincarnation Pool is a Solana PDA-owned autonomous market maker. Every epoch (1 hour), it reads the CPMM spot price, updates an EMA-weighted oracle (weight 2140), and executes a permissionless buyback via CPMM swap. Proceeds flow to the Mining Vault for the next cycle of community mining.')}
          </p>
          <div className="flex flex-wrap items-center gap-1.5 2xs:gap-2 mt-2 2xs:mt-3 text-[10px] 2xs:text-xs">
            <span className="px-1.5 2xs:px-2 py-0.5 2xs:py-1 rounded bg-white/10 text-white whitespace-nowrap">Raydium CPMM</span>
            <span className="px-1.5 2xs:px-2 py-0.5 2xs:py-1 rounded bg-cyan-400/20 text-cyan-400 whitespace-nowrap">PDA Autonomous</span>
            <span className="px-1.5 2xs:px-2 py-0.5 2xs:py-1 rounded bg-cyan-400/20 text-cyan-400 whitespace-nowrap">EMA Oracle</span>
            <span className="px-1.5 2xs:px-2 py-0.5 2xs:py-1 rounded bg-cyan-400/20 text-cyan-400 whitespace-nowrap">Permissionless</span>
          </div>
        </div>
      </TerminalCard>
    </div>
  )
}
