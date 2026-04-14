'use client'

const MCC_MINT = 'MCCn6eqiTGzaiPKECg3viPmkdkS9YmkguqKvRcTxCsb'
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
const POOL_ID = '4AiaTd9bAWf3u8ScZWhXadJF1roc8bJKEKvaDudKacZd'

const RAYDIUM_POOL_URL = `https://raydium.io/swap/?inputMint=${MCC_MINT}&outputMint=${USDC_MINT}`
const JUPITER_TRADE_URL = `https://jup.ag/swap/USDT-${MCC_MINT}`
const BIRDEYE_TOKEN_URL = `https://birdeye.so/token/${MCC_MINT}?chain=solana`
const GMGN_TOKEN_URL = `https://gmgn.ai/sol/token/${MCC_MINT}`
const OKX_DEX_URL = `https://www.okx.com/web3/dex-swap#inputChain=501&inputCurrency=${USDC_MINT}&outputChain=501&outputCurrency=${MCC_MINT}`
const DEXSCREENER_URL = `https://dexscreener.com/solana/${POOL_ID}`

const IconDroplets = ({ stroke = 'currentColor' }: { stroke?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 sm:w-5 sm:h-5">
    <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
    <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
  </svg>
)

const IconRepeat = ({ stroke = 'currentColor' }: { stroke?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 sm:w-5 sm:h-5">
    <path d="m17 1 4 4-4 4" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <path d="m7 23-4-4 4-4" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
)

const IconEye = ({ stroke = 'currentColor' }: { stroke?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 sm:w-5 sm:h-5">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const IconBarChart3 = ({ stroke = 'currentColor' }: { stroke?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 sm:w-5 sm:h-5">
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </svg>
)

const IconLineChart = ({ stroke = 'currentColor' }: { stroke?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 sm:w-5 sm:h-5">
    <path d="M3 3v18h18" />
    <path d="m19 9-5 5-4-4-3 3" />
  </svg>
)

function buildExchanges(accentColor?: string) {
  const accentClass = accentColor ? 'border-neutral-700 hover:bg-neutral-800' : 'text-cyan-300 border-cyan-400/30 hover:bg-cyan-950/30'
  const accentStyle = accentColor ? { color: accentColor } : undefined
  return [
    {
      label: 'OKX DEX',
      href: OKX_DEX_URL,
      icon: IconRepeat,
      color: accentClass,
      colorStyle: accentStyle,
      iconAccent: true,
    },
    {
      label: 'Raydium',
      href: RAYDIUM_POOL_URL,
      icon: IconDroplets,
      color: accentClass,
      colorStyle: accentStyle,
      iconAccent: true,
    },
    {
      label: 'Jupiter',
      href: JUPITER_TRADE_URL,
      icon: IconRepeat,
      color: 'text-white border-neutral-700 hover:bg-neutral-800',
      colorStyle: undefined,
      iconAccent: false,
    },
    {
      label: 'BirdEye',
      href: BIRDEYE_TOKEN_URL,
      icon: IconEye,
      color: accentClass,
      colorStyle: accentStyle,
      iconAccent: true,
    },
    {
      label: 'GMGN',
      href: GMGN_TOKEN_URL,
      icon: IconBarChart3,
      color: 'text-white border-neutral-700 hover:bg-neutral-800',
      colorStyle: undefined,
      iconAccent: false,
    },
    {
      label: 'DexScreener',
      href: DEXSCREENER_URL,
      icon: IconLineChart,
      color: accentClass,
      colorStyle: accentStyle,
      iconAccent: true,
    },
  ]
}

export interface MicrocosmQuickActionsProps {
  basePath?: string
  onNavigate?: (path: string) => void
  accentColor?: string
}

export function MicrocosmQuickActions({ basePath = '', onNavigate, accentColor }: MicrocosmQuickActionsProps) {
  const exchanges = buildExchanges(accentColor)

  return (
    <div className="mb-3 sm:mb-6">
      <div className="grid grid-cols-3 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
        {exchanges.map((ex) => {
          const Icon = ex.icon
          const iconStroke = ex.iconAccent && accentColor ? accentColor : undefined
          return (
            <a
              key={ex.label}
              href={ex.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div
                className={`backdrop-blur-md bg-white/5 border ${ex.color} rounded-xl p-2.5 sm:p-4 flex items-center gap-2 sm:gap-3 cursor-pointer active:scale-[0.98] blockchain-card`}
                style={ex.colorStyle}
              >
                <Icon stroke={iconStroke} />
                <span className="font-mono text-xs sm:text-sm font-bold tracking-wider truncate">
                  {ex.label}
                </span>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}
