// AI-generated · AI-managed · AI-maintained
"use client"

import type { TeamWalletItem } from "../../../hooks/useStats"

interface TeamWalletChartProps {
  data: TeamWalletItem[]
  className?: string
}

const GREEN_COLORS = [
  "#5EEAD4",
  "#2DD4BF",
  "#99F6E4",
  "#14B8A6",
  "#0D9488",
]

function formatValue(value: number): string {
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(2)}B`
  if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  return value.toLocaleString()
}

export function TeamWalletChart({ data, className }: TeamWalletChartProps) {
  const maxValue = Math.max(...data.map(d => d.mcc_balance), 1)

  return (
    <div className={className}>
      <div className="flex flex-col justify-center h-full gap-3 sm:gap-4">
        {data.map((wallet, index) => {
          const ratio = wallet.mcc_balance / maxValue
          const widthPercent = Math.max(ratio * 93, 2)

          return (
            <div key={wallet.key} className="flex items-center gap-2 sm:gap-3">
              {}
              <div className="w-20 sm:w-24 flex-shrink-0 text-right">
                <span className="font-mono text-xs sm:text-sm text-foreground/50 truncate block">
                  {wallet.label}
                </span>
              </div>

              {}
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 h-7 sm:h-8 bg-border/10 rounded-r overflow-hidden">
                  <div
                    className="h-full rounded-r transition-all duration-500 ease-out"
                    style={{
                      width: `${widthPercent}%`,
                      backgroundColor: GREEN_COLORS[index % GREEN_COLORS.length],
                    }}
                  />
                </div>
                <span className="font-mono text-xs sm:text-sm text-foreground/60 tabular-nums flex-shrink-0 w-12 sm:w-16 text-left">
                  {formatValue(wallet.mcc_balance)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
