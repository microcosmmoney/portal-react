// AI-generated · AI-managed · AI-maintained
"use client"

import { cn } from "../../lib/utils"

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
    <div className={cn("bg-neutral-900 border border-neutral-700 rounded overflow-hidden", className)}>
      {(title || filename) && (
        <div className="flex items-center gap-2 px-4 py-2 bg-neutral-800 border-b border-neutral-700">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          <div className="w-2 h-2 rounded-full bg-white" />
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
    <div className={cn("bg-neutral-800 rounded p-4", className)}>
      <div className="text-neutral-400 text-xs mb-1 font-mono tracking-wider">{label}</div>
      <div className={cn("text-2xl font-bold font-mono", color)}>
        {typeof value === 'number'
          ? value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          : value
        }
      </div>
      {unit && <div className="text-neutral-500 text-xs mt-1">{unit}</div>}
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
  return null
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
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-white tracking-wider mb-2">{title}</h1>
      {description && (
        <p className="text-neutral-400 text-sm">{description}</p>
      )}
    </div>
  )
}

export function TerminalLoading({ message = "loading..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] font-mono">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <div className="text-neutral-400">{message}</div>
      </div>
    </div>
  )
}

export function TerminalError({
  error,
  suggestion = "\u8bf7\u5237\u65b0\u9875\u9762\u91cd\u8bd5",
}: {
  error: string
  suggestion?: string
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] font-mono">
      <TerminalCard filename="error.log">
        <div className="text-red-500 mb-2">error: {error}</div>
        <div className="text-neutral-500 text-sm">{suggestion}</div>
      </TerminalCard>
    </div>
  )
}

export function TerminalEmpty({ message = "no data" }: { message?: string }) {
  return (
    <div className="text-center py-12 text-neutral-500 font-mono">
      <span className="text-cyan-400">warning:</span> {message}
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
    default: "bg-neutral-500/20 text-neutral-300",
    success: "bg-white/20 text-white",
    warning: "bg-cyan-400/20 text-cyan-400",
    error: "bg-red-500/20 text-red-500",
    info: "bg-cyan-400/20 text-cyan-400",
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
    <div className="flex items-center justify-between py-2 border-b border-neutral-800 last:border-0 font-mono text-sm">
      <span className="text-neutral-400">{label}:</span>
      <span className={cn("text-white", valueColor)}>{value}</span>
    </div>
  )
}

export function TerminalProgress({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = "bg-cyan-400",
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
          {label && <span className="text-neutral-400">{label}</span>}
          {showPercentage && <span className="text-white font-mono">{percentage.toFixed(1)}%</span>}
        </div>
      )}
      <div className="w-full bg-neutral-800 rounded-full h-2">
        <div
          className={cn("h-2 rounded-full transition-all", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
