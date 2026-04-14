// AI-generated · AI-managed · AI-maintained
'use client'

import { Bell } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { useTranslations } from 'next-intl'

export default function NotificationsPage() {
  const t = useTranslations('notificationsDash')

  return (
    <div className="max-w-4xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6 font-mono">
      <div>
        <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wider">{t('title')}</h1>
        <p className="text-xs sm:text-sm text-neutral-400">{t('subtitle')}</p>
      </div>

      <Card className="bg-neutral-900 border-neutral-700 dash-card">
        <CardContent className="p-3 sm:p-6">
          <div className="text-center py-12 text-neutral-500">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg">{t('noNotifications')}</p>
            <p className="text-sm mt-1">{t('noNotificationsHint')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
