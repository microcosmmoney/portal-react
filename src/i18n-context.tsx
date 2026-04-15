'use client'

import React, { createContext, useContext, useMemo } from 'react'

type Messages = Record<string, any>

const I18nContext = createContext<Messages>({})

export interface MicrocosmI18nProviderProps {
  messages?: Messages
  children: React.ReactNode
}

export function MicrocosmI18nProvider({ messages, children }: MicrocosmI18nProviderProps) {
  const value = useMemo(() => messages || {}, [messages])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

function resolvePath(messages: Messages, key: string): any {
  const parts = key.split('.')
  let v: any = messages
  for (const p of parts) {
    if (v == null) return undefined
    v = v[p]
  }
  return v
}

function interpolate(template: string, values?: Record<string, any>): string {
  if (!values) return template
  return template.replace(/\{(\w+)\}/g, (_, k) => {
    const v = values[k]
    return v != null ? String(v) : `{${k}}`
  })
}

export type TranslateFn = (key: string, fallbackOrValues?: string | Record<string, any>, values?: Record<string, any>) => string

export function useTranslations(namespace?: string): TranslateFn {
  const messages = useContext(I18nContext)
  return useMemo(() => {
    return (key: string, fallbackOrValues?: string | Record<string, any>, values?: Record<string, any>) => {
      const fullKey = namespace ? `${namespace}.${key}` : key
      const raw = resolvePath(messages, fullKey)

      let fallback: string | undefined
      let interpValues: Record<string, any> | undefined
      if (typeof fallbackOrValues === 'string') {
        fallback = fallbackOrValues
        interpValues = values
      } else if (fallbackOrValues && typeof fallbackOrValues === 'object') {
        interpValues = fallbackOrValues
      }

      if (typeof raw === 'string') {
        return interpolate(raw, interpValues)
      }
      if (fallback) {
        return interpolate(fallback, interpValues)
      }
      return key
    }
  }, [messages, namespace])
}

export function useT() {
  return useTranslations()
}
