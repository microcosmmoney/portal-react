// AI-generated · AI-managed · AI-maintained
"use client"

import React, { useState, useEffect } from 'react'
import { cn } from '../lib/cn'

export interface TerminalCountdownProps {
  targetTime: number | Date
  onComplete?: () => void
  label?: string
  className?: string
  format?: 'full' | 'compact'
}

function calcRemaining(target: number) {
  const diff = Math.max(0, target - Date.now())
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    total: diff,
  }
}

export function TerminalCountdown({
  targetTime,
  onComplete,
  label,
  className,
  format = 'full',
}: TerminalCountdownProps) {
  const target = typeof targetTime === 'number' ? targetTime : targetTime.getTime()
  const [remaining, setRemaining] = useState(() => calcRemaining(target))

  useEffect(() => {
    const id = setInterval(() => {
      const r = calcRemaining(target)
      setRemaining(r)
      if (r.total <= 0) {
        clearInterval(id)
        onComplete?.()
      }
    }, 1000)
    return () => clearInterval(id)
  }, [target, onComplete])

  const pad = (n: number) => String(n).padStart(2, '0')

  const timeStr = format === 'compact'
    ? `${remaining.days > 0 ? remaining.days + 'd ' : ''}${pad(remaining.hours)}:${pad(remaining.minutes)}:${pad(remaining.seconds)}`
    : `${remaining.days}d ${pad(remaining.hours)}h ${pad(remaining.minutes)}m ${pad(remaining.seconds)}s`

  return (
    <div className={cn("font-mono", className)}>
      {label && <div className="text-zinc-500 text-xs mb-1">{label}</div>}
      <div className={cn("text-xl font-bold tabular-nums", remaining.total <= 0 ? "text-red-400" : "text-white")}>
        {remaining.total <= 0 ? 'EXPIRED' : timeStr}
      </div>
    </div>
  )
}
