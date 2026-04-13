'use client'

import { useState } from 'react'
import { useMCCPrice } from '@microcosmmoney/auth-react'
import { TerminalCard } from '../terminal'

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
  title = 'Reincarnation Pool',
  subtitle = '2140 Protocol autonomous market making',
}: MicrocosmReincarnationPageProps = {}) {
  const { data: priceData, loading } = useMCCPrice({ refetchInterval: 60_000 })
  const basePrice = priceData?.price ?? 0

  return (
    <div className="max-w-7xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6 font-mono">
      <div>
        <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wider">{title}</h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">{subtitle}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <TerminalCard>
          <div className="text-xs text-neutral-400 tracking-wider mb-2">BASE PRICE</div>
          <div className="text-2xl font-bold text-cyan-400">
            {loading ? '—' : formatNumber(basePrice, 4)}
            <span className="text-sm font-normal text-neutral-500 ml-1">USD</span>
          </div>
        </TerminalCard>

        <TerminalCard>
          <div className="text-xs text-neutral-400 tracking-wider mb-2">PROTOCOL</div>
          <div className="text-2xl font-bold text-white">2140</div>
          <div className="text-xs text-neutral-500 mt-1">EMA weighted</div>
        </TerminalCard>

        <TerminalCard>
          <div className="text-xs text-neutral-400 tracking-wider mb-2">EPOCH</div>
          <div className="text-2xl font-bold text-white">1h</div>
          <div className="text-xs text-neutral-500 mt-1">Auto buyback</div>
        </TerminalCard>

        <TerminalCard>
          <div className="text-xs text-neutral-400 tracking-wider mb-2">DEX</div>
          <div className="text-2xl font-bold text-cyan-400">Raydium</div>
          <div className="text-xs text-neutral-500 mt-1">CPMM pool</div>
        </TerminalCard>
      </div>

      <TerminalCard title="Contract Addresses">
        <div className="space-y-3">
          <div className="bg-neutral-800 rounded p-3">
            <div className="text-xs text-neutral-400 tracking-wider mb-1">Reincarnation Pool PDA</div>
            <div className="flex items-center justify-between gap-2">
              <code className="text-sm text-cyan-400 break-all">{POOL_ADDRESS}</code>
              <div className="flex items-center gap-2 shrink-0">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-neutral-800 rounded p-3">
              <div className="text-xs text-neutral-400 tracking-wider mb-1">USDT Vault</div>
              <div className="flex items-center justify-between gap-2">
                <code className="text-xs text-neutral-400 break-all">{USDT_VAULT}</code>
                <CopyButton text={USDT_VAULT} />
              </div>
            </div>
            <div className="bg-neutral-800 rounded p-3">
              <div className="text-xs text-neutral-400 tracking-wider mb-1">USDC Vault</div>
              <div className="flex items-center justify-between gap-2">
                <code className="text-xs text-neutral-400 break-all">{USDC_VAULT}</code>
                <CopyButton text={USDC_VAULT} />
              </div>
            </div>
          </div>
        </div>
      </TerminalCard>

      <TerminalCard title="Mechanism">
        <div className="text-sm space-y-2">
          <div className="font-medium text-cyan-400 tracking-wider">Autonomous Market Making</div>
          <p className="text-neutral-400 leading-relaxed">
            The Reincarnation Pool is a Solana PDA-owned autonomous market maker. Every epoch (1 hour), it reads
            the CPMM spot price, updates an EMA-weighted oracle (weight 2140), and executes a permissionless
            buyback via CPMM swap. Proceeds flow to the Mining Vault for the next cycle of community mining.
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
            <span className="px-2 py-1 rounded bg-white/10 text-white">Raydium CPMM</span>
            <span className="px-2 py-1 rounded bg-cyan-400/20 text-cyan-400">PDA Autonomous</span>
            <span className="px-2 py-1 rounded bg-cyan-400/20 text-cyan-400">EMA Oracle</span>
            <span className="px-2 py-1 rounded bg-cyan-400/20 text-cyan-400">Permissionless</span>
          </div>
        </div>
      </TerminalCard>
    </div>
  )
}
