// AI-generated · AI-managed · AI-maintained
"use client"

import React, { useEffect, useCallback } from 'react'
import { cn } from '../lib/cn'

export interface TerminalDialogProps {
  open: boolean
  onClose: () => void
  title?: string
  filename?: string
  children: React.ReactNode
  className?: string
  width?: string
}

export function TerminalDialog({
  open,
  onClose,
  title,
  filename,
  children,
  className,
  width = 'max-w-lg',
}: TerminalDialogProps) {
  const handleEsc = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [open, handleEsc])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("relative w-full mx-4 bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden shadow-2xl", width, className)}>
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-800/50 border-b border-zinc-700">
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            {(filename || title) && (
              <span className="ml-2 text-zinc-500 text-xs font-mono">{filename || title}</span>
            )}
          </div>
        </div>
        <div className="p-6 font-mono">{children}</div>
      </div>
    </div>
  )
}
