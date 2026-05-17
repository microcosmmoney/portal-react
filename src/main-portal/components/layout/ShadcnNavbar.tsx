// AI-generated · AI-managed · AI-maintained
"use client"

import { useState, useRef, useEffect } from "react"
import { Link } from "../../i18n/navigation"
import { Menu, X, ChevronDown, FileText, Bot, Send, BarChart3, User, LogOut, LayoutDashboard, TrendingUp, Users, Pickaxe, Coins, Crosshair, Gem } from "lucide-react"
import { cn } from "../../lib/utils"
import { useAuth } from "../../hooks/useAuth"
import { logOut } from "../../lib/auth-service"
import { useTranslations } from "next-intl"
import { LocaleSwitcher } from "./LocaleSwitcher"
import { HoverAvatar } from "../ui/hover-avatar"

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

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showBlockchainMenu, setShowBlockchainMenu] = useState(false)
  const [showDeveloperMenu, setShowDeveloperMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showGameMenu, setShowGameMenu] = useState(false)
  const [mobileBlockchainExpanded, setMobileBlockchainExpanded] = useState(false)
  const [mobileDevExpanded, setMobileDevExpanded] = useState(false)
  const [mobileGameExpanded, setMobileGameExpanded] = useState(false)
  const blockchainMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const developerMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const userMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const gameMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { user, userInfo, loading } = useAuth()
  const t = useTranslations("nav")
  const tc = useTranslations("common")

  const blockchainSubItems = [
    { label: t("quickMining"), href: "https://m.microcosm.money", icon: Pickaxe, description: t("quickMiningDesc"), external: true },
    { label: t("market"), href: "/market", icon: TrendingUp, description: t("marketDesc") },
    { label: t("community"), href: "/community", icon: Users, description: t("communityDesc") },
    { label: t("mccEconomics"), href: "/blockchain/economics", icon: Coins, description: t("mccEconomicsDesc") },
  ]

  const developerSubItems = [
    { label: t("techDocs"), href: "/developers/api", icon: FileText, description: t("techDocsDesc") },
    { label: t("projectDev"), href: "/developers/assistant", icon: Bot, description: t("projectDevDesc") },
    { label: t("projectSubmit"), href: "/developers/submit", icon: Send, description: t("projectSubmitDesc") },
    { label: t("projectStats"), href: "/developers/stats", icon: BarChart3, description: t("projectStatsDesc") },
  ]

  const gameSubItems = [
    { label: "Crash Challenge", href: "/game/crash-challenge", icon: Crosshair, description: t("crashChallengeDesc") },
    { label: "Diamond Hands", href: "/game/diamond-hands", icon: Gem, description: t("hodlChallengeDesc") },
  ]

  const navItems = [
    { label: "TITAN", href: "/titan", isTitan: true },
    { label: t("blockchain"), href: "/blockchain", submenuType: "blockchain" },
    { label: t("developers"), href: "/developers", submenuType: "developer" },
    { label: t("mainnetPlan"), href: "/mainnet" },
    { label: "GAME", href: "/game/crash-challenge", isGame: true, submenuType: "game" },
  ]

  const handleLogout = async () => {
    try {
      await logOut()
      setShowUserMenu(false)
    } catch (error) {
      console.error(tc('logoutFailed'), error)
    }
  }

  const displayName = userInfo?.display_name || userInfo?.email?.split('@')[0] || tc('defaultUser')

  const handleUserMouseEnter = () => {
    if (userMenuTimeoutRef.current) clearTimeout(userMenuTimeoutRef.current)
    setShowUserMenu(true)
  }
  const handleUserMouseLeave = () => {
    userMenuTimeoutRef.current = setTimeout(() => setShowUserMenu(false), 150)
  }
  const handleDeveloperMouseEnter = () => {
    if (developerMenuTimeoutRef.current) clearTimeout(developerMenuTimeoutRef.current)
    setShowDeveloperMenu(true)
  }
  const handleDeveloperMouseLeave = () => {
    developerMenuTimeoutRef.current = setTimeout(() => setShowDeveloperMenu(false), 150)
  }
  const handleGameMouseEnter = () => {
    if (gameMenuTimeoutRef.current) clearTimeout(gameMenuTimeoutRef.current)
    setShowGameMenu(true)
  }
  const handleGameMouseLeave = () => {
    gameMenuTimeoutRef.current = setTimeout(() => setShowGameMenu(false), 150)
  }
  const handleBlockchainMouseEnter = () => {
    if (blockchainMenuTimeoutRef.current) clearTimeout(blockchainMenuTimeoutRef.current)
    setShowBlockchainMenu(true)
  }
  const handleBlockchainMouseLeave = () => {
    blockchainMenuTimeoutRef.current = setTimeout(() => setShowBlockchainMenu(false), 150)
  }

  useEffect(() => {
    return () => {
      if (blockchainMenuTimeoutRef.current) clearTimeout(blockchainMenuTimeoutRef.current)
      if (developerMenuTimeoutRef.current) clearTimeout(developerMenuTimeoutRef.current)
      if (userMenuTimeoutRef.current) clearTimeout(userMenuTimeoutRef.current)
      if (gameMenuTimeoutRef.current) clearTimeout(gameMenuTimeoutRef.current)
    }
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
      <div className="max-w-7xl mx-auto px-3 2xs:px-4 md:px-6">
        <div className="flex items-center justify-between h-14 2xs:h-16">
          {/* Logo \u2014 responsive sizing */}
          <Link href="/" className="flex items-center gap-2 xs:gap-3 shrink-0">
            <img src="/mcc-logo-40.png" alt="MCC" className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded" />
            <span className="font-sans font-semibold text-lg xs:text-xl sm:text-2xl tracking-wide text-foreground">
              M<span className="text-green-400">I</span>CROCOSM
            </span>
          </Link>

          {/* Desktop nav \u2014 show from lg (1024px) for CJK language safety */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              // Blockchain submenu (includes Market + Community)
              if (item.submenuType === "blockchain") {
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={handleBlockchainMouseEnter}
                    onMouseLeave={handleBlockchainMouseLeave}
                  >
                    <Link
                      href={item.href}
                      className="px-2.5 xl:px-4 py-2 text-sm xl:text-base text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded transition-colors duration-200 flex items-center gap-1 text-truncate-safe"
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-200 shrink-0",
                          showBlockchainMenu && "rotate-180"
                        )}
                      />
                    </Link>
                    {showBlockchainMenu && (
                      <div className="absolute top-full left-0 mt-2 w-64 rounded-xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-xl overflow-hidden z-50">
                        <div className="p-2">
                          {blockchainSubItems.map((subItem, subIdx) => (
                            <Link
                              key={subIdx}
                              href={subItem.href}
                              className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/50 transition-colors group"
                              onClick={() => setShowBlockchainMenu(false)}
                            >
                              <subItem.icon className="h-5 w-5 text-muted-foreground group-hover:text-green-400 transition-colors mt-0.5" />
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-foreground group-hover:text-green-400 transition-colors">
                                  {subItem.label}
                                </div>
                                <div className="text-xs text-muted-foreground break-safe">
                                  {subItem.description}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <div className="border-t border-border/50 px-4 py-3 bg-secondary/30">
                          <Link
                            href="/blockchain"
                            className="text-xs text-muted-foreground hover:text-green-400 transition-colors"
                            onClick={() => setShowBlockchainMenu(false)}
                          >
                            {t("blockchain")} →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )
              }

              // Developer submenu
              if (item.submenuType === "developer") {
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={handleDeveloperMouseEnter}
                    onMouseLeave={handleDeveloperMouseLeave}
                  >
                    <Link
                      href={item.href}
                      className="px-2.5 xl:px-4 py-2 text-sm xl:text-base text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded transition-colors duration-200 flex items-center gap-1 text-truncate-safe"
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-200 shrink-0",
                          showDeveloperMenu && "rotate-180"
                        )}
                      />
                    </Link>
                    {showDeveloperMenu && (
                      <div className="absolute top-full left-0 mt-2 w-64 rounded-xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-xl overflow-hidden z-50">
                        <div className="p-2">
                          {developerSubItems.map((subItem, subIdx) => (
                            <Link
                              key={subIdx}
                              href={subItem.href}
                              className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/50 transition-colors group"
                              onClick={() => setShowDeveloperMenu(false)}
                            >
                              <subItem.icon className="h-5 w-5 text-muted-foreground group-hover:text-green-400 transition-colors mt-0.5" />
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-foreground group-hover:text-green-400 transition-colors">
                                  {subItem.label}
                                </div>
                                <div className="text-xs text-muted-foreground break-safe">
                                  {subItem.description}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <div className="border-t border-border/50 px-4 py-3 bg-secondary/30">
                          <Link
                            href="/developers"
                            className="text-xs text-muted-foreground hover:text-green-400 transition-colors"
                            onClick={() => setShowDeveloperMenu(false)}
                          >
                            {tc('viewDeveloperCenter')}
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )
              }

              if (item.submenuType === "game") {
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={handleGameMouseEnter}
                    onMouseLeave={handleGameMouseLeave}
                  >
                    <Link
                      href={item.href}
                      className="px-2.5 xl:px-4 py-2 text-sm xl:text-base text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded transition-colors duration-200 flex items-center gap-1 text-truncate-safe"
                    >
                      <GameLabel />
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-200 shrink-0",
                          showGameMenu && "rotate-180"
                        )}
                      />
                    </Link>
                    {showGameMenu && (
                      <div className="absolute top-full right-0 mt-2 w-64 rounded-xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-xl overflow-hidden z-50">
                        <div className="p-2">
                          {gameSubItems.map((subItem, subIdx) => (
                            <Link
                              key={subIdx}
                              href={subItem.href}
                              className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/50 transition-colors group"
                              onClick={() => setShowGameMenu(false)}
                            >
                              <subItem.icon className="h-5 w-5 text-muted-foreground group-hover:text-green-400 transition-colors mt-0.5" />
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-foreground group-hover:text-green-400 transition-colors">
                                  {subItem.label}
                                </div>
                                <div className="text-xs text-muted-foreground break-safe">
                                  {subItem.description}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <div className="border-t border-border/50 px-4 py-3 bg-secondary/30">
                          <Link
                            href="/game/crash-challenge"
                            className="text-xs text-muted-foreground hover:text-green-400 transition-colors"
                            onClick={() => setShowGameMenu(false)}
                          >
                            GAME →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-2.5 xl:px-4 py-2 text-sm xl:text-base text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded transition-colors duration-200 text-truncate-safe"
                >
                  {"isTitan" in item && item.isTitan ? <TitanLabel /> : item.label}
                </Link>
              )
            })}
          </div>

          {/* Desktop right section \u2014 from lg */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            <LocaleSwitcher />
            {loading ? (
              <span className="px-4 py-2 text-foreground/50">{tc('loading')}</span>
            ) : user ? (
              <div
                className="relative"
                onMouseEnter={handleUserMouseEnter}
                onMouseLeave={handleUserMouseLeave}
              >
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors">
                  <HoverAvatar src={userInfo?.avatar_url} fallback={displayName} size={32} fallbackClassName="bg-green-500/20 text-green-400" />
                  <span className="text-sm font-medium text-foreground max-w-[100px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown
                    size={14}
                    className={cn(
                      "text-foreground/50 transition-transform duration-200",
                      showUserMenu && "rotate-180"
                    )}
                  />
                </button>
                {showUserMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 rounded-xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-xl overflow-hidden z-50">
                    <div className="p-2">
                      <Link
                        href="/user-system/dashboard"
                        className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-foreground/70 hover:text-foreground hover:bg-secondary/50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <LayoutDashboard size={16} />
                        {tc('dashboard')}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-foreground/70 hover:text-red-400 hover:bg-secondary/50 transition-colors"
                      >
                        <LogOut size={16} />
                        {tc('logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-foreground/70 hover:text-foreground transition-colors duration-200"
                >
                  {tc('login')}
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 bg-accent text-accent-foreground hover:bg-accent/90 rounded transition-colors duration-200"
                >
                  {tc('register')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile right: locale switcher + hamburger */}
          <div className="lg:hidden flex items-center gap-1 2xs:gap-2">
            <LocaleSwitcher />
            <button
              className="p-1.5 2xs:p-2 text-foreground/70 hover:text-foreground touch-target"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 2xs:w-6 2xs:h-6" /> : <Menu className="w-5 h-5 2xs:w-6 2xs:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu \u2014 full-screen overlay for better UX on small phones */}
      <div
        className={cn(
          "lg:hidden overflow-y-auto transition-all duration-300 bg-background/95 backdrop-blur-md border-b border-border/30",
          mobileMenuOpen ? "max-h-[calc(100vh-56px)] 2xs:max-h-[calc(100vh-64px)]" : "max-h-0"
        )}
      >
        <div className="px-3 2xs:px-4 py-3 2xs:py-4 space-y-1 2xs:space-y-2">
          {navItems.map((item) => {
            // Mobile blockchain submenu
            if (item.submenuType === "blockchain") {
              return (
                <div key={item.label}>
                  <button
                    onClick={() => setMobileBlockchainExpanded(!mobileBlockchainExpanded)}
                    className="w-full flex items-center justify-between px-3 2xs:px-4 py-2.5 2xs:py-3 font-mono text-xs 2xs:text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded transition-colors duration-200 touch-target"
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        mobileBlockchainExpanded && "rotate-180"
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      mobileBlockchainExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="ml-3 2xs:ml-4 border-l border-border/30 pl-1.5 2xs:pl-2 space-y-0.5 2xs:space-y-1 py-1.5 2xs:py-2">
                      <Link
                        href={item.href}
                        className="flex items-center gap-2 px-2 2xs:px-3 py-1.5 2xs:py-2 text-xs text-green-400 hover:text-green-300 hover:bg-foreground/5 rounded transition-colors duration-200 touch-target"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t("blockchain")}
                      </Link>
                      {blockchainSubItems.map((subItem, subIdx) => (
                        <Link
                          key={subIdx}
                          href={subItem.href}
                          className="flex items-center gap-2 px-2 2xs:px-3 py-1.5 2xs:py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded transition-colors duration-200 touch-target"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <subItem.icon className="h-3.5 w-3.5 2xs:h-4 2xs:w-4 shrink-0" />
                          <span className="text-truncate-safe">{subItem.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )
            }

            // Mobile developer submenu
            if (item.submenuType === "developer") {
              return (
                <div key={item.label}>
                  <button
                    onClick={() => setMobileDevExpanded(!mobileDevExpanded)}
                    className="w-full flex items-center justify-between px-3 2xs:px-4 py-2.5 2xs:py-3 font-mono text-xs 2xs:text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded transition-colors duration-200 touch-target"
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        mobileDevExpanded && "rotate-180"
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      mobileDevExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="ml-3 2xs:ml-4 border-l border-border/30 pl-1.5 2xs:pl-2 space-y-0.5 2xs:space-y-1 py-1.5 2xs:py-2">
                      <Link
                        href={item.href}
                        className="flex items-center gap-2 px-2 2xs:px-3 py-1.5 2xs:py-2 text-xs text-green-400 hover:text-green-300 hover:bg-foreground/5 rounded transition-colors duration-200 touch-target"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {tc('developerCenterHome')}
                      </Link>
                      {developerSubItems.map((subItem, subIdx) => (
                        <Link
                          key={subIdx}
                          href={subItem.href}
                          className="flex items-center gap-2 px-2 2xs:px-3 py-1.5 2xs:py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded transition-colors duration-200 touch-target"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <subItem.icon className="h-3.5 w-3.5 2xs:h-4 2xs:w-4 shrink-0" />
                          <span className="text-truncate-safe">{subItem.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )
            }

            if (item.submenuType === "game") {
              return (
                <div key={item.label}>
                  <button
                    onClick={() => setMobileGameExpanded(!mobileGameExpanded)}
                    className="w-full flex items-center justify-between px-3 2xs:px-4 py-2.5 2xs:py-3 font-mono text-xs 2xs:text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded transition-colors duration-200 touch-target"
                  >
                    <GameLabel />
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        mobileGameExpanded && "rotate-180"
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      mobileGameExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="ml-3 2xs:ml-4 border-l border-border/30 pl-1.5 2xs:pl-2 space-y-0.5 2xs:space-y-1 py-1.5 2xs:py-2">
                      {gameSubItems.map((subItem, subIdx) => (
                        <Link
                          key={subIdx}
                          href={subItem.href}
                          className="flex items-center gap-2 px-2 2xs:px-3 py-1.5 2xs:py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded transition-colors duration-200 touch-target"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <subItem.icon className="h-3.5 w-3.5 2xs:h-4 2xs:w-4 shrink-0" />
                          <span className="text-truncate-safe">{subItem.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className="block px-3 2xs:px-4 py-2.5 2xs:py-3 font-mono text-xs 2xs:text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded transition-colors duration-200 touch-target"
                onClick={() => setMobileMenuOpen(false)}
              >
                {"isTitan" in item && item.isTitan ? <TitanLabel /> : item.label}
              </Link>
            )
          })}
          <div className="pt-3 2xs:pt-4 border-t border-border/30">
            {user ? (
              <div className="space-y-2 2xs:space-y-3">
                <div className="flex items-center gap-2 2xs:gap-3 px-3 2xs:px-4 py-2.5 2xs:py-3 bg-foreground/5 rounded-lg">
                  <HoverAvatar src={userInfo?.avatar_url} fallback={displayName} size={32} fallbackClassName="bg-green-500/20 text-green-400" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm 2xs:text-base font-medium text-foreground truncate">{displayName}</p>
                    <p className="text-[10px] 2xs:text-xs text-muted-foreground truncate">{userInfo?.email}</p>
                  </div>
                </div>
                <Link
                  href="/user-system/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full px-3 2xs:px-4 py-2.5 2xs:py-3 font-mono text-xs 2xs:text-sm text-center bg-accent text-accent-foreground hover:bg-accent/90 rounded transition-colors duration-200 touch-target"
                >
                  {tc('enterDashboard')}
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full px-3 2xs:px-4 py-2.5 2xs:py-3 font-mono text-xs 2xs:text-sm text-center text-foreground/70 hover:text-red-400 border border-border/50 hover:border-red-500/50 rounded transition-colors duration-200 touch-target"
                >
                  {tc('logout')}
                </button>
              </div>
            ) : (
              <div className="flex gap-2 2xs:gap-3">
                <Link
                  href="/login"
                  className="flex-1 px-3 2xs:px-4 py-2.5 2xs:py-3 font-mono text-xs 2xs:text-sm text-center text-foreground/70 hover:text-foreground border border-border/50 rounded transition-colors duration-200 touch-target"
                >
                  {tc('login')}
                </Link>
                <Link
                  href="/register"
                  className="flex-1 px-3 2xs:px-4 py-2.5 2xs:py-3 font-mono text-xs 2xs:text-sm text-center bg-accent text-accent-foreground hover:bg-accent/90 rounded transition-colors duration-200 touch-target"
                >
                  {tc('register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
