// AI-generated · AI-managed · AI-maintained
"use client"

import React from 'react'
import { cn } from '../lib/cn'

export interface TerminalInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  prefix?: string
  suffix?: React.ReactNode
  inputSize?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base',
}

export function TerminalInput({
  label,
  error,
  prefix = '$',
  suffix,
  inputSize = 'md',
  className,
  ...props
}: TerminalInputProps) {
  return (
    <div className="font-mono">
      {label && <div className="text-zinc-500 text-xs mb-1">{label}</div>}
      <div className={cn(
        "flex items-center bg-zinc-950 border rounded",
        error ? "border-red-500/50" : "border-zinc-800 focus-within:border-indigo-500/50",
        className
      )}>
        {prefix && <span className="text-indigo-400 pl-3 select-none">{prefix}</span>}
        <input
          {...props}
          className={cn(
            "flex-1 bg-transparent text-white outline-none font-mono placeholder:text-zinc-600",
            sizeClasses[inputSize]
          )}
        />
        {suffix && <span className="pr-3 text-zinc-500">{suffix}</span>}
      </div>
      {error && <div className="text-red-400 text-xs mt-1">{error}</div>}
    </div>
  )
}
