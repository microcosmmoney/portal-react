// AI-generated · AI-managed · AI-maintained
'use client'

export interface MicrocosmQuickActionsProps {
  basePath?: string
  onNavigate?: (path: string) => void
}

const actions = [
  { label: 'Mining', path: '/mcc/mining', color: 'text-cyan-300 border-cyan-400/30 hover:bg-cyan-950/30' },
  { label: 'Reincarnation', path: '/mcc/reincarnation', color: 'text-white border-neutral-700 hover:bg-neutral-800' },
  { label: 'Jupiter Trade', href: 'https://jup.ag/swap/USDT-MCCn6eqiTGzaiPKECg3viPmkdkS9YmkguqKvRcTxCsb', color: 'text-cyan-300 border-cyan-400/30 hover:bg-cyan-950/30', external: true },
  { label: 'Market Data', path: '/market', color: 'text-white border-neutral-700 hover:bg-neutral-800' },
]

export function MicrocosmQuickActions({ basePath = '', onNavigate }: MicrocosmQuickActionsProps) {
  const resolvePath = (p: string) => basePath ? `${basePath.replace(/\/$/, '')}${p}` : p

  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((action) => {
          const content = (
            <div className={`bg-neutral-900 border ${action.color} rounded-lg p-4 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-colors`}>
              <span className="font-mono text-sm font-bold tracking-wider">{action.label}</span>
            </div>
          )

          if ('external' in action && action.external) {
            return (
              <a key={action.label} href={action.href} target="_blank" rel="noopener noreferrer">
                {content}
              </a>
            )
          }

          return (
            <div
              key={action.label}
              onClick={() => onNavigate?.(resolvePath(action.path!))}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onNavigate?.(resolvePath(action.path!))}
            >
              {content}
            </div>
          )
        })}
      </div>
    </div>
  )
}
