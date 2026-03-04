// AI-generated · AI-managed · AI-maintained
"use client"

import React from 'react'
import { cn } from '../lib/cn'

export interface VoteOption {
  label: string
  votes: number
  color?: string
}

export interface VoteResultBarProps {
  options: VoteOption[]
  totalVotes?: number
  showPercentage?: boolean
  showCount?: boolean
  className?: string
}

const defaultColors = [
  'bg-indigo-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-purple-500',
  'bg-cyan-500',
]

export function VoteResultBar({
  options,
  totalVotes: explicitTotal,
  showPercentage = true,
  showCount = true,
  className,
}: VoteResultBarProps) {
  const totalVotes = explicitTotal ?? options.reduce((s, o) => s + o.votes, 0)

  return (
    <div className={cn("font-mono space-y-3", className)}>
      {options.map((opt, i) => {
        const pct = totalVotes > 0 ? (opt.votes / totalVotes) * 100 : 0
        const color = opt.color || defaultColors[i % defaultColors.length]

        return (
          <div key={i}>
            <div className="flex justify-between items-center mb-1 text-sm">
              <span className="text-zinc-300">{opt.label}</span>
              <span className="text-zinc-500">
                {showCount && <span>{opt.votes.toLocaleString()}</span>}
                {showCount && showPercentage && <span className="mx-1">·</span>}
                {showPercentage && <span>{pct.toFixed(1)}%</span>}
              </span>
            </div>
            <div className="w-full bg-zinc-800 rounded h-2">
              <div
                className={cn("h-2 rounded transition-all", color)}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )
      })}
      {totalVotes > 0 && (
        <div className="text-xs text-zinc-600 text-right">
          Total: {totalVotes.toLocaleString()} votes
        </div>
      )}
    </div>
  )
}
