// AI-generated · AI-managed · AI-maintained
"use client"

import * as React from "react"
import { Link } from "../../i18n/navigation"
import { usePathname } from "next/navigation"
import { ChevronRight, LogOut } from "lucide-react"

import { cn } from "../../lib/utils"
import { useAuth } from "../../hooks/useAuth"
import {
  getUserMenus,
  isMenuItemActive,
  type MenuItem,
} from "../../config/menu-config"
import { useTranslations } from "next-intl"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "../ui/sidebar"
import { Separator } from "../ui/separator"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { logOut } from "../../lib/auth-service"

function NavMenuItem({ item }: { item: MenuItem }) {
  const pathname = usePathname()
  const isActive = isMenuItemActive(item.href, pathname)
  const [isOpen, setIsOpen] = React.useState(isActive)
  const tm = useTranslations("menu")

  React.useEffect(() => {
    if (isActive) {
      setIsOpen(true)
    }
  }, [isActive])

  if (item.isSection) {
    return (
      <SidebarMenuItem>
        <span className="flex w-full items-center px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50 pointer-events-none">
          {tm(item.titleKey)}
        </span>
      </SidebarMenuItem>
    )
  }

  if (item.children && item.children.length > 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full",
            isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
          )}
        >
          <item.icon className="h-4 w-4" />
          <span>{tm(item.titleKey)}</span>
          <ChevronRight
            className={cn(
              "ml-auto h-4 w-4 transition-transform",
              isOpen && "rotate-90"
            )}
          />
        </SidebarMenuButton>
        {isOpen && (
          <SidebarMenuSub>
            {item.children.map((subItem) => {
              const subIsActive = isMenuItemActive(subItem.href, pathname)
              return (
                <SidebarMenuSubItem key={subItem.href}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={subIsActive}
                  >
                    <Link href={subItem.href}>
                      <subItem.icon className="h-4 w-4" />
                      <span>{tm(subItem.titleKey)}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        )}
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.descriptionKey ? tm(item.descriptionKey) : undefined}
      >
        <Link href={item.href}>
          <item.icon className="h-4 w-4" />
          <span>{tm(item.titleKey)}</span>
          {item.badge && (
            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-sidebar-primary text-xs font-medium text-sidebar-primary-foreground">
              {item.badge}
            </span>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userInfo } = useAuth()
  const userRole = userInfo?.role || "user"
  const tc = useTranslations("common")

  const menus = React.useMemo(() => getUserMenus(userRole), [userRole])

  const handleLogout = async () => {
    try {
      await logOut()
    } catch (error) {
      console.error(tc("logoutFailed"), error)
    }
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      {}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/user-system/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#6366F1] text-white">
                  <span className="text-lg font-bold">M</span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Microcosm</span>
                  <span className="truncate text-xs text-sidebar-foreground/50">
                    Open User System
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {}
      <SidebarContent>
        {}
        <SidebarGroup>
          <SidebarGroupLabel>{tc('sidebarMenu')}</SidebarGroupLabel>
          <SidebarMenu>
            {menus.userMenu.map((item) => (
              <NavMenuItem key={item.href} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {}
        {menus.agentMenu && menus.agentMenu.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>{tc('sidebarAgentManagement')}</SidebarGroupLabel>
            <SidebarMenu>
              {menus.agentMenu.map((item) => (
                <NavMenuItem key={item.href} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}

      </SidebarContent>

      {}
      <SidebarFooter>
        <Separator className="mb-2" />
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-1.5">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-[#6366F1] text-white">
                  {userInfo?.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {userInfo?.email?.split("@")[0] || tc('defaultUser')}
                </span>
                <span className="truncate text-xs text-sidebar-foreground/50">
                  {userRole === "agent" ? tc('agent') : tc('normalUser')}
                </span>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {tc('logout')}
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
