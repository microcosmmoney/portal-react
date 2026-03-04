// AI-generated · AI-managed · AI-maintained
"use client"

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '../lib/cn'

export interface TerminalTooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
  delay?: number
}

const positionStyles: Record<string, React.CSSProperties> = {
  top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 6 },
  bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 6 },
  left: { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: 6 },
  right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: 6 },
}

export function TerminalTooltip({
  content,
  children,
  side = 'top',
  className,
  delay = 200,
}: TerminalTooltipProps) {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  const show = () => {
    timerRef.current = setTimeout(() => setVisible(true), delay)
  }
  const hide = () => {
    clearTimeout(timerRef.current)
    setVisible(false)
  }

  useEffect(() => () => clearTimeout(timerRef.current), [])

  return (
    <span className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {children}
      {visible && (
        <span
          className={cn(
            "absolute z-50 px-2 py-1 text-xs font-mono bg-zinc-800 text-zinc-200 border border-zinc-700 rounded shadow-lg whitespace-nowrap pointer-events-none",
            className
          )}
          style={positionStyles[side]}
          role="tooltip"
        >
          {content}
        </span>
      )}
    </span>
  )
}
