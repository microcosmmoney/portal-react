// AI-generated · AI-managed · AI-maintained
"use client"

import React, { useState } from 'react'
import { cn } from '../lib/cn'

export interface TerminalTab {
  key: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
}

export interface TerminalTabsProps {
  tabs: TerminalTab[]
  activeKey?: string
  defaultKey?: string
  onChange?: (key: string) => void
  children?: (activeKey: string) => React.ReactNode
  className?: string
}

export function TerminalTabs({
  tabs,
  activeKey: controlledKey,
  defaultKey,
  onChange,
  children,
  className,
}: TerminalTabsProps) {
  const [internalKey, setInternalKey] = useState(defaultKey || tabs[0]?.key || '')
  const activeKey = controlledKey ?? internalKey

  const handleSelect = (key: string) => {
    if (controlledKey === undefined) setInternalKey(key)
    onChange?.(key)
  }

  return (
    <div className={cn("font-mono", className)}>
      <div className="flex border-b border-zinc-800 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && handleSelect(tab.key)}
            className={cn(
              "px-4 py-2 text-sm transition-colors border-b-2 -mb-px",
              activeKey === tab.key
                ? "border-indigo-400 text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-300",
              tab.disabled && "opacity-40 cursor-not-allowed"
            )}
          >
            {tab.icon && <span className="mr-2 inline-flex">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      {children && <div className="pt-4">{children(activeKey)}</div>}
    </div>
  )
}
