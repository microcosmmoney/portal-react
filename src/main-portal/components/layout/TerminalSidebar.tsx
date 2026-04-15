// AI-generated · AI-managed · AI-maintained
"use client"

import * as React from "react"
import { Link } from "../../i18n/navigation"
import { usePathname } from "next/navigation"
import { ChevronRight, Menu, X, User, LogOut, Link2 } from "lucide-react"

import { cn } from "../../lib/utils"
import { useAuth } from "../../hooks/useAuth"
import { logOut } from "../../lib/auth-service"
import {
  getUserMenus,
  isMenuItemActive,
  type MenuItem,
} from "../../config/menu-config"
import { HoverAvatar } from "../ui/hover-avatar"
import { useTranslations } from "next-intl"

function TerminalMenuItem({
  item,
  collapsed,
  onNavigate,
}: {
  item: MenuItem
  collapsed: boolean
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const isActive = isMenuItemActive(item.href, pathname)
  const [isOpen, setIsOpen] = React.useState(isActive)
  const tm = useTranslations("menu")

  React.useEffect(() => {
    if (isActive) setIsOpen(true)
  }, [isActive])

  if (item.isSection) {
    if (collapsed) return null
    return (
      <div className="px-2 xs:px-3 py-1.5 xs:py-2 text-[10px] xs:text-xs text-neutral-500 uppercase tracking-wider font-medium">
        {tm(item.titleKey)}
      </div>
    )
  }

  if (item.children && item.children.length > 0) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full flex items-center gap-2 xs:gap-3 px-2 xs:px-3 py-2 xs:py-2.5 text-xs xs:text-sm rounded transition-colors touch-target",
            isActive
              ? "bg-cyan-700 text-white"
              : "text-neutral-400 hover:text-white hover:bg-neutral-800"
          )}
        >
          <item.icon className="w-4 h-4 xs:w-5 xs:h-5 flex-shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left font-medium text-truncate-safe">{tm(item.titleKey)}</span>
              <ChevronRight
                className={cn(
                  "w-3.5 h-3.5 xs:w-4 xs:h-4 transition-transform",
                  isOpen && "rotate-90"
                )}
              />
            </>
          )}
        </button>
        {isOpen && !collapsed && (
          <div className="ml-3 xs:ml-4 border-l border-neutral-700 pl-1.5 xs:pl-2 mt-1 space-y-0.5">
            {item.children.map((child) => {
              const childActive = isMenuItemActive(child.href, pathname)
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-1.5 xs:gap-2 px-2 xs:px-3 py-1.5 text-xs xs:text-sm rounded transition-colors",
                    childActive
                      ? "bg-cyan-700 text-white"
                      : "text-neutral-500 hover:text-white hover:bg-neutral-800"
                  )}
                >
                  <child.icon className="w-3 h-3 xs:w-3.5 xs:h-3.5" />
                  <span className="text-truncate-safe">{tm(child.titleKey)}</span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-2 xs:gap-3 px-2 xs:px-3 py-2 xs:py-2.5 text-xs xs:text-sm rounded transition-colors touch-target",
        isActive
          ? "bg-cyan-700 text-white"
          : "text-neutral-400 hover:text-white hover:bg-neutral-800"
      )}
      title={collapsed ? tm(item.titleKey) : undefined}
    >
      <item.icon className="w-4 h-4 xs:w-5 xs:h-5 flex-shrink-0" />
      {!collapsed && <span className="font-medium text-truncate-safe">{tm(item.titleKey)}</span>}
      {!collapsed && item.badge && (
        <span className="ml-auto px-1 xs:px-1.5 py-0.5 text-[10px] xs:text-xs bg-cyan-400/20 text-cyan-400 rounded">
          {item.badge}
        </span>
      )}
    </Link>
  )
}

export function TerminalSidebar() {
  const { user, userInfo } = useAuth()
  const userRole = userInfo?.role || "user"
  const menus = React.useMemo(() => getUserMenus(userRole), [userRole])
  const [collapsed, setCollapsed] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const tc = useTranslations("common")
  const displayName = userInfo?.display_name || userInfo?.email?.split('@')[0] || tc('defaultUser')

  React.useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // Close mobile sidebar on navigation
  const handleMobileNavigate = React.useCallback(() => {
    setMobileOpen(false)
  }, [])

  const handleLogout = () => {
    logOut()
  }

  const sidebarContent = (
    <div className="flex flex-col h-full md:bg-neutral-900 border-r border-neutral-700/50 md:border-neutral-700">
      {/* Collapse toggle — hidden on small phones (always expanded in overlay) */}
      <div className="hidden xs:flex items-center justify-end px-2 xs:px-3 py-1">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded text-neutral-400 hover:text-cyan-400 transition-colors"
          title={collapsed ? tc('expandSidebar') : tc('collapseSidebar')}
        >
          <ChevronRight className={cn("w-4 h-4 transition-transform", !collapsed && "rotate-180")} />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 xs:px-3 space-y-0.5 xs:space-y-1">
        <div className="space-y-0.5 xs:space-y-1 mb-4 xs:mb-6">
          {menus.userMenu.map((item) => (
            <TerminalMenuItem key={item.href} item={item} collapsed={collapsed} onNavigate={handleMobileNavigate} />
          ))}
        </div>

        {menus.agentMenu && menus.agentMenu.length > 0 && (
          <div className="space-y-0.5 xs:space-y-1 mb-4 xs:mb-6">
            {!collapsed && (
              <div className="px-2 xs:px-3 py-1.5 xs:py-2 text-[10px] xs:text-xs text-neutral-500 uppercase tracking-wider font-medium">
                AGENT
              </div>
            )}
            {menus.agentMenu.map((item) => (
              <TerminalMenuItem key={item.href} item={item} collapsed={collapsed} onNavigate={handleMobileNavigate} />
            ))}
          </div>
        )}

      </nav>

      {/* Bottom section — compact on small screens */}
      <div className="mt-4 xs:mt-6 pt-3 xs:pt-4 border-t border-neutral-800 px-2 xs:px-3 pb-2 xs:pb-3 safe-area-bottom">
        {!collapsed && (
          <Link
            href="/profile"
            onClick={handleMobileNavigate}
            className="mb-3 xs:mb-4 p-2 xs:p-3 bg-neutral-800 border border-neutral-700 rounded-lg block hover:border-neutral-600 hover:bg-neutral-800/80 transition-colors"
          >
            <div className="flex items-center gap-2 xs:gap-3">
              <HoverAvatar src={userInfo?.avatar_url} fallback={displayName} size={36} fallbackClassName="bg-neutral-700 text-neutral-400" />
              <div className="flex-1 min-w-0">
                <p className="text-xs xs:text-sm font-medium text-white truncate">{displayName}</p>
                <div className="flex items-center gap-1 xs:gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-[9px] xs:text-[10px] text-neutral-500 uppercase tracking-wider">
                    {userRole === 'admin' ? 'ADMIN' : 'USER'}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {collapsed && (
          <Link href="/profile" className="flex justify-center mb-3">
            <HoverAvatar src={userInfo?.avatar_url} fallback={displayName} size={32} fallbackClassName="bg-neutral-700 text-neutral-400" />
          </Link>
        )}

        <Link
          href="/profile"
          onClick={handleMobileNavigate}
          className="w-full flex items-center gap-2 xs:gap-3 px-2 xs:px-3 py-2 xs:py-2.5 rounded transition-colors text-neutral-400 hover:text-cyan-400 hover:bg-cyan-400/10 touch-target"
          title={collapsed ? tc('accountManagement') : undefined}
        >
          <Link2 className="w-4 h-4 xs:w-5 xs:h-5 shrink-0" />
          {!collapsed && <span className="text-xs xs:text-sm font-medium text-truncate-safe">{tc('accountManagement')}</span>}
        </Link>

        <button
          onClick={handleLogout}
          className={cn(
            "w-full mt-1 flex items-center gap-2 xs:gap-3 px-2 xs:px-3 py-2 xs:py-2.5 rounded text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors touch-target",
            collapsed ? "justify-center" : ""
          )}
          title={collapsed ? tc('logout') : undefined}
        >
          <LogOut className="w-4 h-4 xs:w-5 xs:h-5 shrink-0" />
          {!collapsed && <span className="text-xs xs:text-sm">{tc('logout')}</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile menu toggle — responsive positioning */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-3 2xs:top-3.5 left-2 2xs:left-3 xs:left-4 z-[60] p-1.5 2xs:p-2 bg-neutral-800/60 backdrop-blur-md border border-neutral-700/50 rounded text-neutral-400 hover:text-white touch-target"
      >
        {mobileOpen ? <X className="w-4 h-4 2xs:w-5 2xs:h-5" /> : <Menu className="w-4 h-4 2xs:w-5 2xs:h-5" />}
      </button>

      {/* Backdrop overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 top-14 2xs:top-16 bg-black/60 z-40 overscroll-contain touch-none"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — full width overlay on small phones, 72% on larger phones, fixed width on desktop */}
      <aside
        className={cn(
          "fixed md:relative md:flex-shrink-0 top-14 2xs:top-16 md:top-0 z-[45] md:z-40 sidebar-frost",
          "h-[calc(100vh-56px)] 2xs:h-[calc(100vh-64px)] md:h-full",
          "transition-[left,width] duration-300 md:transition-all",
          // Width: full on tiny, 80% on small phone, w-64 on tablet+
          mobileOpen
            ? "left-0 w-[85%] 2xs:w-[80%] xs:w-72 sm:w-72"
            : "-left-[100%] xs:-left-72 md:left-0",
          // Desktop: collapsible
          !mobileOpen && (collapsed ? "md:w-16" : "md:w-64"),
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
