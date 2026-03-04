// AI-generated · AI-managed · AI-maintained
"use client"

import React from 'react'
import { cn } from '../lib/cn'

export interface TerminalTableColumn<T> {
  key: string
  header: string
  render?: (row: T, index: number) => React.ReactNode
  align?: 'left' | 'center' | 'right'
  width?: string
}

export interface TerminalTableProps<T> {
  columns: TerminalTableColumn<T>[]
  data: T[]
  rowKey?: (row: T, index: number) => string
  onRowClick?: (row: T, index: number) => void
  className?: string
  emptyMessage?: string
  striped?: boolean
}

export function TerminalTable<T extends Record<string, any>>({
  columns,
  data,
  rowKey,
  onRowClick,
  className,
  emptyMessage = 'no records found',
  striped = true,
}: TerminalTableProps<T>) {
  const alignClass = (align?: string) =>
    align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'

  if (!data.length) {
    return (
      <div className="text-center py-8 text-zinc-500 font-mono text-sm">
        <span className="text-yellow-400">warning:</span> {emptyMessage}
      </div>
    )
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full font-mono text-sm">
        <thead>
          <tr className="border-b border-zinc-700">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn("px-3 py-2 text-zinc-500 font-normal text-xs uppercase tracking-wider", alignClass(col.align))}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={rowKey ? rowKey(row, i) : i}
              className={cn(
                "border-b border-zinc-800/50 last:border-0 transition-colors",
                striped && i % 2 === 1 && "bg-zinc-900/30",
                onRowClick && "cursor-pointer hover:bg-zinc-800/50"
              )}
              onClick={() => onRowClick?.(row, i)}
            >
              {columns.map((col) => (
                <td key={col.key} className={cn("px-3 py-2 text-white", alignClass(col.align))}>
                  {col.render ? col.render(row, i) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
