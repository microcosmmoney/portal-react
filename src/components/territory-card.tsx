// AI-generated · AI-managed · AI-maintained
"use client"

import React from 'react'
import { cn } from '../lib/cn'

export interface TerritoryCardProps {
  territoryId: string
  name: string
  type: 'station' | 'matrix' | 'sector' | 'system'
  level?: number
  memberCount?: number
  capacity?: number
  magistrate?: string
  mcdBalance?: number
  status?: 'active' | 'inactive' | 'full'
  onClick?: () => void
  className?: string
}

const typeLabels: Record<string, string> = {
  station: 'Station',
  matrix: 'Matrix',
  sector: 'Sector',
  system: 'System',
}

const typeColors: Record<string, string> = {
  station: 'text-indigo-400',
  matrix: 'text-emerald-400',
  sector: 'text-amber-400',
  system: 'text-purple-400',
}

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500',
  inactive: 'bg-zinc-500',
  full: 'bg-amber-500',
}

export function TerritoryCard({
  territoryId,
  name,
  type,
  level,
  memberCount,
  capacity,
  magistrate,
  mcdBalance,
  status = 'active',
  onClick,
  className,
}: TerritoryCardProps) {
  return (
    <div
      className={cn(
        "bg-zinc-900 border border-zinc-800 rounded-lg p-4 font-mono",
        onClick && "cursor-pointer hover:border-zinc-600 transition-colors",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={cn("text-xs font-bold uppercase", typeColors[type])}>
            [{typeLabels[type] || type}]
          </span>
          <span className="text-white font-bold">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", statusColors[status])} />
          <span className="text-zinc-600 text-xs">{territoryId}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {level !== undefined && (
          <div className="flex justify-between text-zinc-500">
            <span>Level:</span>
            <span className="text-white">{level}</span>
          </div>
        )}
        {memberCount !== undefined && (
          <div className="flex justify-between text-zinc-500">
            <span>Members:</span>
            <span className="text-white">{memberCount}{capacity ? `/${capacity}` : ''}</span>
          </div>
        )}
        {magistrate && (
          <div className="flex justify-between text-zinc-500">
            <span>Magistrate:</span>
            <span className="text-indigo-400 truncate ml-1 max-w-[100px]">{magistrate}</span>
          </div>
        )}
        {mcdBalance !== undefined && (
          <div className="flex justify-between text-zinc-500">
            <span>MCD Vault:</span>
            <span className="text-emerald-400">{mcdBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        )}
      </div>
      {capacity !== undefined && memberCount !== undefined && (
        <div className="mt-3">
          <div className="w-full bg-zinc-800 rounded h-1.5">
            <div
              className="h-1.5 rounded bg-indigo-500 transition-all"
              style={{ width: `${Math.min((memberCount / capacity) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
