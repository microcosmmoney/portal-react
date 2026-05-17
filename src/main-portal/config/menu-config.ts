// AI-generated · AI-managed · AI-maintained
import {
  LayoutDashboard,
  Coins,
  Wallet,
  Gift,
  Users,
  Building2,
  Puzzle,
  Landmark,
  Ticket,
  Pickaxe,
  Vote,
  type LucideIcon,
} from "lucide-react"

import { UserRole } from "../hooks/useAuth"

export interface MenuItem {
  titleKey: string
  href: string
  icon: LucideIcon
  roles: UserRole[]
  children?: MenuItem[]
  badge?: string | number
  isSection?: boolean
  descriptionKey?: string
}

export const userMenuItems: MenuItem[] = [
  {
    titleKey: "overview",
    href: "/user-system/dashboard",
    icon: LayoutDashboard,
    roles: ["user"],
    descriptionKey: "overviewDesc"
  },

  { titleKey: "blockchainSection", href: "#blockchain", icon: Coins, roles: ["user"], isSection: true },
  {
    titleKey: "mint",
    href: "/mcc/mining",
    icon: Pickaxe,
    roles: ["user"],
    descriptionKey: "mintDesc"
  },
  {
    titleKey: "wallet",
    href: "/mcc/wallet",
    icon: Wallet,
    roles: ["user"],
    descriptionKey: "walletDesc"
  },
  {
    titleKey: "mcdCredits",
    href: "/mcc/mcd",
    icon: Ticket,
    roles: ["user"],
    descriptionKey: "mcdCreditsDesc"
  },

  { titleKey: "web3osSection", href: "#web3os", icon: Users, roles: ["user"], isSection: true },
  {
    titleKey: "auctionMarket",
    href: "/mcc/auctions",
    icon: Gift,
    roles: ["user"],
    descriptionKey: "auctionMarketDesc"
  },
  {
    titleKey: "territoryManagement",
    href: "/user-system/territory",
    icon: Building2,
    roles: ["user"],
    descriptionKey: "territoryManagementDesc"
  },
  {
    titleKey: "nftFragments",
    href: "/mcc/fragment",
    icon: Puzzle,
    roles: ["user"],
    descriptionKey: "nftFragmentsDesc"
  },
  {
    titleKey: "lending",
    href: "/mcc/lending",
    icon: Landmark,
    roles: ["user"],
    descriptionKey: "lendingDesc"
  },
  {
    titleKey: "communityVoting",
    href: "/mcc/voting",
    icon: Vote,
    roles: ["user"],
    descriptionKey: "communityVotingDesc"
  },
  {
    titleKey: "orgStructure",
    href: "/user-system/organization",
    icon: Users,
    roles: ["user"],
    descriptionKey: "orgStructureDesc"
  }
]

export const agentMenuItems: MenuItem[] = []

export function filterMenuByRole(
  menuItems: MenuItem[],
  userRole: UserRole
): MenuItem[] {
  const roleHierarchy: Record<UserRole, UserRole[]> = {
    agent: ["agent", "user"],
    user: ["user"]
  } as any

  const allowedRoles = roleHierarchy[userRole] || ["user"]

  return menuItems
    .filter(item => item.roles.some(role => allowedRoles.includes(role)))
    .map(item => ({
      ...item,
      children: item.children
        ? filterMenuByRole(item.children, userRole)
        : undefined
    }))
}

export function getUserMenus(userRole: UserRole) {
  return {
    userMenu: filterMenuByRole(userMenuItems, userRole),
    agentMenu: filterMenuByRole(agentMenuItems, userRole)
  }
}

export function isMenuItemActive(itemHref: string, currentPath: string): boolean {
  // Strip locale prefix: /zh/mcc/mining → /mcc/mining
  const stripped = currentPath.replace(/^\/(en|zh|ja|ko)(\/|$)/, '/')
  const path = stripped || '/'

  if (itemHref === '#' || itemHref.startsWith('#')) return false
  if (itemHref === "/") return path === "/"
  return path.startsWith(itemHref)
}
