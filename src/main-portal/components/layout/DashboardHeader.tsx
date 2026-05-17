// AI-generated · AI-managed · AI-maintained
"use client"

import { useState, useRef, useEffect } from "react"
import { Link } from "../../i18n/navigation"
import { ChevronDown, User, LogOut, LayoutDashboard, FileText, Bot, Send, BarChart3, TrendingUp, Users, Bell, Pickaxe, Coins, Crosshair, Gem } from "lucide-react"
import { cn } from "../../lib/utils"
import { useAuth } from "../../hooks/useAuth"
import { logOut } from "../../lib/auth-service"
import { useTranslations } from "next-intl"
import { LocaleSwitcher } from "./LocaleSwitcher"
import { HoverAvatar } from "../ui/hover-avatar"

const navItemDefs = [
  { labelKey: "titan", href: "/titan", isTitan: true },
  { labelKey: "blockchain", href: "/blockchain", submenu: "blockchain" },
  { labelKey: "developers", href: "/developers", submenu: "developer" },
  { labelKey: "mainnetPlan", href: "/mainnet" },
  { labelKey: "game", href: "/game/crash-challenge", submenu: "game", isGame: true },
]

const developerSubItemDefs = [
  { labelKey: "techDocs", href: "/developers/api", icon: FileText },
  { labelKey: "projectDev", href: "/developers/assistant", icon: Bot },
  { labelKey: "projectSubmit", href: "/developers/submit", icon: Send },
  { labelKey: "projectStats", href: "/developers/stats", icon: BarChart3 },
]

const blockchainSubItemDefs = [
  { labelKey: "quickMining", href: "https://m.microcosm.money", icon: Pickaxe, external: true },
  { labelKey: "market", href: "/market", icon: TrendingUp },
  { labelKey: "community", href: "/community", icon: Users },
  { labelKey: "mccEconomics", href: "/blockchain/economics", icon: Coins },
]

const gameSubItemDefs = [
  { label: "Crash Challenge", href: "/game/crash-challenge", icon: Crosshair },
  { label: "Diamond Hands", href: "/game/diamond-hands", icon: Gem },
]

function TitanLabel() {
  return (
    <span className="tracking-wide">
      T<span className="text-green-400 font-bold">I</span>TAN
    </span>
  )
}

function GameLabel() {
  return (
    <span className="tracking-wide">
      G<span className="text-green-400 font-bold">A</span>ME
    </span>
  )
}

export function DashboardHeader() {
  const [showDeveloperMenu, setShowDeveloperMenu] = useState(false)
  const [showBlockchainMenu, setShowBlockchainMenu] = useState(false)
  const [showGameMenu, setShowGameMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const developerMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const blockchainMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const gameMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const userMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { user, userInfo, loading } = useAuth()
  const t = useTranslations("nav")
  const tc = useTranslations("common")

  const handleLogout = () => {
    setShowUserMenu(false)
    logOut()
  }

  const displayName = userInfo?.display_name || userInfo?.email?.split('@')[0] || tc('defaultUser')

  const navItems = navItemDefs.map(i => ({ ...i, label: i.labelKey === "game" ? "GAME" : t(i.labelKey) }))
  const developerSubItems = developerSubItemDefs.map(i => ({ ...i, label: t(i.labelKey) }))
  const blockchainSubItems = blockchainSubItemDefs.map(i => ({ ...i, label: t(i.labelKey) }))

  const handleDeveloperMouseEnter = () => {
    if (developerMenuTimeoutRef.current) clearTimeout(developerMenuTimeoutRef.current)
    setShowDeveloperMenu(true)
  }
  const handleDeveloperMouseLeave = () => {
    developerMenuTimeoutRef.current = setTimeout(() => setShowDeveloperMenu(false), 150)
  }
  const handleBlockchainMouseEnter = () => {
    if (blockchainMenuTimeoutRef.current) clearTimeout(blockchainMenuTimeoutRef.current)
    setShowBlockchainMenu(true)
  }
  const handleBlockchainMouseLeave = () => {
    blockchainMenuTimeoutRef.current = setTimeout(() => setShowBlockchainMenu(false), 150)
  }
  const handleGameMouseEnter = () => {
    if (gameMenuTimeoutRef.current) clearTimeout(gameMenuTimeoutRef.current)
    setShowGameMenu(true)
  }
  const handleGameMouseLeave = () => {
    gameMenuTimeoutRef.current = setTimeout(() => setShowGameMenu(false), 150)
  }
  const handleUserMouseEnter = () => {
    if (userMenuTimeoutRef.current) clearTimeout(userMenuTimeoutRef.current)
    setShowUserMenu(true)
  }
  const handleUserMouseLeave = () => {
    userMenuTimeoutRef.current = setTimeout(() => setShowUserMenu(false), 150)
  }

  useEffect(() => {
    return () => {
      if (developerMenuTimeoutRef.current) clearTimeout(developerMenuTimeoutRef.current)
      if (blockchainMenuTimeoutRef.current) clearTimeout(blockchainMenuTimeoutRef.current)
      if (gameMenuTimeoutRef.current) clearTimeout(gameMenuTimeoutRef.current)
      if (userMenuTimeoutRef.current) clearTimeout(userMenuTimeoutRef.current)
    }
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 2xs:h-16 bg-neutral-950 border-b border-neutral-800">
      <div className="h-full px-2 2xs:px-3 xs:px-4 md:px-6 flex items-center relative">
        {/* Desktop logo \u2014 hidden below md */}
        <Link href="/" className="hidden md:flex items-center gap-2 lg:gap-3 shrink-0">
          <img src="/mcc-logo-40.png" alt="MCC" className="w-8 h-8 lg:w-10 lg:h-10 rounded" />
          <span className="font-bold text-base lg:text-lg tracking-wider text-white">
            M<span className="text-cyan-400">I</span>CROCOSM
          </span>
        </Link>
        {/* Mobile logo \u2014 left-aligned, with left padding for hamburger */}
        <Link href="/" className="md:hidden flex items-center gap-1.5 2xs:gap-2 ml-10 2xs:ml-12">
          <img src="/mcc-logo-40.png" alt="MCC" className="w-6 h-6 2xs:w-7 2xs:h-7 xs:w-8 xs:h-8 rounded" />
          <span className="font-bold text-xs 2xs:text-sm xs:text-base tracking-wider text-white">
            M<span className="text-cyan-400">I</span>CROCOSM
          </span>
        </Link>

        {/* Nav \u2014 only show on lg+ (1024px) to avoid cramping on tablets */}
        <nav className="hidden lg:flex flex-1 items-center justify-center gap-0.5 xl:gap-1">
          {navItems.map((item) => {
            if (item.submenu === "developer") {
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={handleDeveloperMouseEnter}
                  onMouseLeave={handleDeveloperMouseLeave}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 px-2 xl:px-3 2xl:px-4 py-2 text-xs xl:text-sm text-neutral-400 hover:text-white rounded transition-colors text-truncate-safe"
                  >
                    {item.label}
                    <ChevronDown size={14} className={cn("transition-transform shrink-0", showDeveloperMenu && "rotate-180")} />
                  </Link>
                  {showDeveloperMenu && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-56 bg-neutral-900 border border-neutral-700 rounded shadow-2xl overflow-hidden">
                      {developerSubItems.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                        >
                          <sub.icon size={16} className="text-neutral-500" />
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }
            if (item.submenu === "blockchain") {
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={handleBlockchainMouseEnter}
                  onMouseLeave={handleBlockchainMouseLeave}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 px-2 xl:px-3 2xl:px-4 py-2 text-xs xl:text-sm text-neutral-400 hover:text-white rounded transition-colors text-truncate-safe"
                  >
                    {item.label}
                    <ChevronDown size={14} className={cn("transition-transform shrink-0", showBlockchainMenu && "rotate-180")} />
                  </Link>
                  {showBlockchainMenu && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-56 bg-neutral-900 border border-neutral-700 rounded shadow-2xl overflow-hidden">
                      {blockchainSubItems.map((sub) => (
                        "external" in sub && sub.external ? (
                          <a
                            key={sub.href}
                            href={sub.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                          >
                            <sub.icon size={16} className="text-neutral-500" />
                            {sub.label}
                          </a>
                        ) : (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                          >
                            <sub.icon size={16} className="text-neutral-500" />
                            {sub.label}
                          </Link>
                        )
                      ))}
                    </div>
                  )}
                </div>
              )
            }
            if (item.submenu === "game") {
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={handleGameMouseEnter}
                  onMouseLeave={handleGameMouseLeave}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 px-2 xl:px-3 2xl:px-4 py-2 text-xs xl:text-sm text-neutral-400 hover:text-white rounded transition-colors text-truncate-safe"
                  >
                    <GameLabel />
                    <ChevronDown size={14} className={cn("transition-transform shrink-0", showGameMenu && "rotate-180")} />
                  </Link>
                  {showGameMenu && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-56 bg-neutral-900 border border-neutral-700 rounded shadow-2xl overflow-hidden">
                      {gameSubItemDefs.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                        >
                          <sub.icon size={16} className="text-neutral-500" />
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }
            return (
              <Link
                key={item.label}
                href={item.href}
                className="px-2 xl:px-3 2xl:px-4 py-2 text-xs xl:text-sm text-neutral-400 hover:text-white rounded transition-colors text-truncate-safe"
              >
                {"isTitan" in item && item.isTitan ? <TitanLabel /> : "isGame" in item && item.isGame ? <GameLabel /> : item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right actions \u2014 responsive sizing */}
        <div className="flex items-center justify-end gap-0.5 2xs:gap-1 ml-auto">
          {/* Locale switcher \u2014 always visible but compact on small screens */}
          <LocaleSwitcher />

          {/* Notifications \u2014 hidden on small phones */}
          {user && (
            <Link
              href="/notifications"
              className="relative p-1.5 xs:p-2 rounded text-neutral-400 hover:text-cyan-400 transition-colors hidden xs:block touch-target"
              title={tc('notifications')}
            >
              <Bell size={16} className="xs:hidden" />
              <Bell size={18} className="hidden xs:block" />
            </Link>
          )}

          {loading ? (
            <span className="text-xs 2xs:text-sm text-neutral-500">...</span>
          ) : user ? (
            <div
              className="relative"
              onMouseEnter={handleUserMouseEnter}
              onMouseLeave={handleUserMouseLeave}
            >
              <button className="flex items-center gap-1 2xs:gap-1.5 xs:gap-2 px-1.5 2xs:px-2 xs:px-2.5 py-1 2xs:py-1.5 rounded hover:bg-neutral-700 transition-colors touch-target">
                <HoverAvatar src={userInfo?.avatar_url} fallback={userInfo?.display_name || userInfo?.uid} size={28} fallbackClassName="bg-cyan-400/20 text-cyan-400" />
                {/* Username \u2014 hidden on small phones, truncated on medium */}
                <span className="text-xs xs:text-sm text-neutral-300 max-w-[60px] xs:max-w-[80px] sm:max-w-[100px] truncate hidden sm:block">
                  {displayName}
                </span>
                <ChevronDown size={14} className={cn("text-neutral-500 transition-transform hidden md:block", showUserMenu && "rotate-180")} />
              </button>

              {showUserMenu && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-neutral-900 border border-neutral-700 rounded shadow-2xl overflow-hidden">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User size={16} className="text-neutral-500" />
                    {tc('profile')}
                  </Link>
                  <Link
                    href="/user-system/dashboard"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <LayoutDashboard size={16} className="text-neutral-500" />
                    {tc('dashboard')}
                  </Link>
                  <div className="border-t border-neutral-700" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-400 hover:text-red-500 hover:bg-neutral-800 transition-colors"
                  >
                    <LogOut size={16} className="text-neutral-500" />
                    {tc('logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1 2xs:gap-2">
              <Link href="/login" className="px-2 2xs:px-3 xs:px-4 py-1.5 text-xs 2xs:text-sm text-neutral-400 hover:text-white transition-colors">
                {tc('login')}
              </Link>
              <Link href="/register" className="px-2 2xs:px-3 xs:px-4 py-1.5 text-xs 2xs:text-sm bg-cyan-700 hover:bg-cyan-600 text-white rounded transition-colors">
                {tc('register')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
