'use client'

import { MessageSquare } from 'lucide-react'
import { TerminalCard } from '../terminal'

export interface MicrocosmMessagesPageProps {
  accentColor?: string
  title?: string
  subtitle?: string
  emptyText?: string
}

export function MicrocosmMessagesPage({
  accentColor,
  title = 'Messages',
  subtitle = 'Private messages and system replies',
  emptyText = 'No messages yet',
}: MicrocosmMessagesPageProps = {}) {
  return (
    <div className="max-w-7xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6 font-mono">
      <div>
        <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wider">{title}</h1>
        <p className="text-xs sm:text-sm text-neutral-400">{subtitle}</p>
      </div>

      <TerminalCard>
        <div className="text-center py-8 text-neutral-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-neutral-500" />
          <p>{emptyText}</p>
        </div>
      </TerminalCard>
    </div>
  )
}
