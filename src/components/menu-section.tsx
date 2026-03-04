// AI-generated · AI-managed · AI-maintained
import React from 'react'
import {
  microcosmMenuGroups,
  resolveMenuPath,
  type MicrocosmMenuGroup,
  type MicrocosmMenuItem,
} from '../menu-config'

export interface MicrocosmMenuSectionProps {
  basePath?: string
  currentPath?: string
  onNavigate?: (path: string) => void
  onItemClick?: (item: MicrocosmMenuItem, resolvedPath: string) => void
  groups?: MicrocosmMenuGroup[]
  className?: string
  filterItems?: (item: MicrocosmMenuItem) => boolean
  extraItems?: MicrocosmMenuItem[]
  extraItemsPosition?: 'top' | 'bottom'
  renderItem?: (item: MicrocosmMenuItem, resolvedPath: string, isActive: boolean) => React.ReactNode
  renderSectionHeader?: (group: MicrocosmMenuGroup) => React.ReactNode
}

function isActive(itemPath: string, currentPath?: string): boolean {
  if (!currentPath) return false
  if (itemPath === '/') return currentPath === '/'
  return currentPath.startsWith(itemPath)
}

export function MicrocosmMenuSection({
  basePath,
  currentPath,
  onNavigate,
  onItemClick,
  groups = microcosmMenuGroups,
  className = '',
  filterItems,
  extraItems,
  extraItemsPosition = 'bottom',
  renderItem,
  renderSectionHeader,
}: MicrocosmMenuSectionProps) {
  const renderMenuItem = (item: MicrocosmMenuItem) => {
    const resolved = resolveMenuPath(item.path, basePath)
    const active = isActive(resolved, currentPath)

    if (renderItem) {
      return (
        <React.Fragment key={item.key}>
          {renderItem(item, resolved, active)}
        </React.Fragment>
      )
    }

    return (
      <button
        key={item.key}
        onClick={() => {
          onItemClick?.(item, resolved)
          onNavigate?.(resolved)
        }}
        title={item.description}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
          padding: '8px 12px',
          border: 'none',
          background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
          color: active ? '#fff' : 'rgba(255,255,255,0.7)',
          cursor: 'pointer',
          fontSize: '13px',
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
          textAlign: 'left' as const,
          borderRadius: '6px',
          transition: 'background 0.15s, color 0.15s',
        }}
        onMouseEnter={(e) => {
          if (!active) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
            e.currentTarget.style.color = '#fff'
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
          }
        }}
      >
        <item.icon size={16} />
        <span style={{ flex: 1 }}>{item.title}</span>
        {item.badge && (
          <span style={{
            fontSize: '10px',
            padding: '1px 6px',
            borderRadius: '9999px',
            background: 'rgba(99,102,241,0.2)',
            color: 'rgb(129,140,248)',
          }}>
            {item.badge}
          </span>
        )}
      </button>
    )
  }

  const extraElements = extraItems?.map(renderMenuItem) || []

  return (
    <div className={`microcosm-menu ${className}`}>
      {extraItemsPosition === 'top' && extraElements}
      {groups.map((group) => {
        const items = filterItems ? group.items.filter(filterItems) : group.items
        if (!items.length) return null

        return (
          <div key={group.key} className="microcosm-menu-group">
            {renderSectionHeader ? (
              renderSectionHeader(group)
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.05em',
                  opacity: 0.5,
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
                }}
              >
                <group.icon size={14} />
                <span>{group.title}</span>
              </div>
            )}
            {items.map(renderMenuItem)}
          </div>
        )
      })}
      {extraItemsPosition === 'bottom' && extraElements}
    </div>
  )
}
