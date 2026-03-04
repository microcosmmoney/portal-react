// AI-generated · AI-managed · AI-maintained
"use client"

import React from 'react'
import { cn } from '../lib/cn'

export function TerminalCard({
  title,
  filename,
  children,
  className,
}: {
  title?: string
  filename?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden", className)}>
      {(title || filename) && (
        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 border-b border-zinc-700">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="ml-2 text-zinc-500 text-xs font-mono">
            {filename || title}
          </span>
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}

export function StatBox({
  label,
  value,
  unit,
  color = 'text-white',
  className,
}: {
  label: string
  value: string | number
  unit?: string
  color?: string
  className?: string
}) {
  return (
    <div className={cn("bg-zinc-950 border border-zinc-800 rounded p-4", className)}>
      <div className="text-zinc-500 text-xs mb-1 font-mono">{label}</div>
      <div className={cn("text-2xl font-bold font-mono", color)}>
        {typeof value === 'number'
          ? value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          : value
        }
      </div>
      {unit && <div className="text-zinc-600 text-xs mt-1">{unit}</div>}
    </div>
  )
}

export function TerminalCommand({
  command,
  className,
}: {
  command: string
  className?: string
}) {
  return (
    <div className={cn("text-zinc-500 text-sm mb-4 font-mono", className)}>
      <span className="text-indigo-400">$</span> {command}
    </div>
  )
}

export function TerminalPageHeader({
  command,
  title,
  description,
}: {
  command: string
  title: string
  description?: string
}) {
  return (
    <div className="mb-6 font-mono">
      <TerminalCommand command={command} className="mb-2" />
      <h1 className="text-2xl text-white mb-2"># {title}</h1>
      {description && (
        <p className="text-zinc-500 text-sm">{description}</p>
      )}
    </div>
  )
}

export function TerminalLoading({ message = "loading..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] font-mono">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <div className="text-zinc-500">
          <span className="text-indigo-400">$</span> {message}
        </div>
      </div>
    </div>
  )
}

export function TerminalError({
  error,
  suggestion = "Please refresh and try again",
}: {
  error: string
  suggestion?: string
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] font-mono">
      <TerminalCard filename="error.log">
        <div className="text-red-400 mb-2">error: {error}</div>
        <div className="text-zinc-500 text-sm">{suggestion}</div>
      </TerminalCard>
    </div>
  )
}

export function TerminalEmpty({ message = "no data" }: { message?: string }) {
  return (
    <div className="text-center py-12 text-zinc-500 font-mono">
      <span className="text-yellow-400">warning:</span> {message}
    </div>
  )
}

export function TerminalBadge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode
  variant?: "default" | "success" | "warning" | "error" | "info"
  className?: string
}) {
  const variants = {
    default: "bg-zinc-800 text-zinc-400",
    success: "bg-emerald-500/20 text-emerald-400",
    warning: "bg-yellow-500/20 text-yellow-400",
    error: "bg-red-500/20 text-red-400",
    info: "bg-indigo-500/20 text-indigo-400",
  }

  return (
    <span className={cn("px-2 py-0.5 text-xs rounded font-mono", variants[variant], className)}>
      {children}
    </span>
  )
}

export function TerminalDataRow({
  label,
  value,
  valueColor,
}: {
  label: string
  value: React.ReactNode
  valueColor?: string
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0 font-mono text-sm">
      <span className="text-zinc-500">{label}:</span>
      <span className={cn("text-white", valueColor)}>{value}</span>
    </div>
  )
}

export function TerminalProgress({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = "bg-indigo-500",
}: {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  color?: string
}) {
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div className="font-mono">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2 text-sm">
          {label && <span className="text-zinc-500">{label}</span>}
          {showPercentage && <span className="text-white">{percentage.toFixed(1)}%</span>}
        </div>
      )}
      <div className="w-full bg-zinc-800 rounded h-2">
        <div
          className={cn("h-2 rounded transition-all", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
