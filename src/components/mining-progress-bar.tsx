// AI-generated · AI-managed · AI-maintained
"use client"

import React from 'react'
import { cn } from '../lib/cn'

export interface MiningProgressBarProps {
  mined: number
  total: number
  halving?: number
  label?: string
  showStats?: boolean
  className?: string
}

const halvingColors = [
  'bg-indigo-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-purple-500',
  'bg-rose-500',
]

export function MiningProgressBar({
  mined,
  total,
  halving = 0,
  label,
  showStats = true,
  className,
}: MiningProgressBarProps) {
  const percentage = total > 0 ? Math.min((mined / total) * 100, 100) : 0
  const barColor = halvingColors[halving % halvingColors.length]

  return (
    <div className={cn("font-mono", className)}>
      {label && <div className="text-zinc-500 text-xs mb-1">{label}</div>}
      <div className="w-full bg-zinc-800 rounded h-3 relative overflow-hidden">
        <div
          className={cn("h-3 rounded transition-all", barColor)}
          style={{ width: `${percentage}%` }}
        />
        {halving > 0 && Array.from({ length: halving }, (_, i) => {
          const pos = ((i + 1) / (halving + 1)) * 100
          return (
            <div
              key={i}
              className="absolute top-0 h-full w-px bg-zinc-600/50"
              style={{ left: `${pos}%` }}
            />
          )
        })}
      </div>
      {showStats && (
        <div className="flex justify-between mt-1 text-xs">
          <span className="text-zinc-500">
            {mined.toLocaleString()} / {total.toLocaleString()} MCC
          </span>
          <span className="text-white">{percentage.toFixed(2)}%</span>
        </div>
      )}
    </div>
  )
}
