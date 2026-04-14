// AI-generated · AI-managed · AI-maintained
"use client"

import { Card, CardContent } from "../ui/card"
import { MessageSquare } from "lucide-react"
import { useTranslations } from 'next-intl'

export default function MessagesPage() {
  const t = useTranslations('messages')
  return (
    <div className="max-w-7xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6 font-mono">
      <div>
        <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wider">{t('title')}</h1>
        <p className="text-xs sm:text-sm text-neutral-400">{t('subtitle')}</p>
      </div>

      <Card className="bg-neutral-900 border-neutral-700 dash-card">
        <CardContent className="p-8 text-center">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-neutral-500" />
          <p className="text-neutral-500">{t('noMessages')}</p>
        </CardContent>
      </Card>
    </div>
  )
}
