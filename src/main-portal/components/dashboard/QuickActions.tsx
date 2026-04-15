// AI-generated · AI-managed · AI-maintained
'use client'

import { Droplets, Repeat, Eye, BarChart3, LineChart } from 'lucide-react'
import {
  RAYDIUM_POOL_URL,
  JUPITER_TRADE_URL,
  BIRDEYE_TOKEN_URL,
  GMGN_TOKEN_URL,
  OKX_DEX_URL,
  DEXSCREENER_URL,
} from '../../lib/api/dexscreener'

const exchanges = [
  {
    label: 'OKX DEX',
    href: OKX_DEX_URL,
    icon: Repeat,
    color: 'text-cyan-300 border-cyan-400/30 hover:bg-cyan-950/30',
  },
  {
    label: 'Raydium',
    href: RAYDIUM_POOL_URL,
    icon: Droplets,
    color: 'text-cyan-300 border-cyan-400/30 hover:bg-cyan-950/30',
  },
  {
    label: 'Jupiter',
    href: JUPITER_TRADE_URL,
    icon: Repeat,
    color: 'text-white border-neutral-700 hover:bg-neutral-800',
  },
  {
    label: 'BirdEye',
    href: BIRDEYE_TOKEN_URL,
    icon: Eye,
    color: 'text-cyan-300 border-cyan-400/30 hover:bg-cyan-950/30',
  },
  {
    label: 'GMGN',
    href: GMGN_TOKEN_URL,
    icon: BarChart3,
    color: 'text-white border-neutral-700 hover:bg-neutral-800',
  },
  {
    label: 'DexScreener',
    href: DEXSCREENER_URL,
    icon: LineChart,
    color: 'text-cyan-300 border-cyan-400/30 hover:bg-cyan-950/30',
  },
]

export default function QuickActions() {
  return (
    <div className="mb-3 sm:mb-6">
      <div className="grid grid-cols-3 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
        {exchanges.map((ex) => (
          <a
            key={ex.label}
            href={ex.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div
              className={`bg-neutral-900 border ${ex.color} rounded-lg p-2.5 sm:p-4 flex items-center gap-2 sm:gap-3 cursor-pointer active:scale-[0.98] dash-card`}
            >
              <ex.icon size={16} className="shrink-0 sm:w-5 sm:h-5" />
              <span className="font-mono text-xs sm:text-sm font-bold tracking-wider truncate">
                {ex.label}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
