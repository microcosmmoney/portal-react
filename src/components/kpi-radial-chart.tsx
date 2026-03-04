// AI-generated · AI-managed · AI-maintained
"use client"

import React from 'react'
import { cn } from '../lib/cn'

export interface KPIRadialChartProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  label?: string
  unit?: string
  color?: string
  trackColor?: string
  className?: string
}

export function KPIRadialChart({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  label,
  unit,
  color = '#6366f1',
  trackColor = '#27272a',
  className,
}: KPIRadialChartProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const percentage = Math.min(value / max, 1)
  const offset = circumference * (1 - percentage)
  const center = size / 2

  return (
    <div className={cn("inline-flex flex-col items-center font-mono", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span className="text-white font-bold text-lg">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {unit && <span className="text-zinc-500 text-xs">{unit}</span>}
      </div>
      {label && <span className="text-zinc-500 text-xs mt-2">{label}</span>}
    </div>
  )
}
