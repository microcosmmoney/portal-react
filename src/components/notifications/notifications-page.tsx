'use client'

import { Bell } from 'lucide-react'
import { TerminalCard } from '../terminal'

export interface MicrocosmNotificationsPageProps {
  accentColor?: string
  title?: string
  subtitle?: string
  emptyText?: string
  emptyHint?: string
}

export function MicrocosmNotificationsPage({
  accentColor,
  title = 'Notifications',
  subtitle = 'System alerts and messages',
  emptyText = 'No notifications',
  emptyHint = 'You will be notified when something important happens',
}: MicrocosmNotificationsPageProps = {}) {
  return (
    <div className="max-w-4xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6 font-mono">
      <div>
        <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wider">{title}</h1>
        <p className="text-xs sm:text-sm text-neutral-400">{subtitle}</p>
      </div>

      <TerminalCard>
        <div className="text-center py-12 text-neutral-500">
          <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg">{emptyText}</p>
          <p className="text-sm mt-1">{emptyHint}</p>
        </div>
      </TerminalCard>
    </div>
  )
}
