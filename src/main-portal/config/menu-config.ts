// AI-generated · AI-managed · AI-maintained
import {
  LayoutDashboard,
  User,
  Coins,
  Wallet,
  Gift,
  Users,
  Building2,
  Puzzle,
  Landmark,

  Ticket,
  Shield,
  Bell,
  UserCog,
  Server,
  FileText,
  ShieldCheck,
  Bot,
  Eye,
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
    roles: ["user", "agent", "admin"],
    descriptionKey: "overviewDesc"
  },

  { titleKey: "blockchainSection", href: "#blockchain", icon: Coins, roles: ["user", "agent", "admin"], isSection: true },
  {
    titleKey: "mint",
    href: "/mcc/mining",
    icon: Pickaxe,
    roles: ["user", "agent", "admin"],
    descriptionKey: "mintDesc"
  },
  {
    titleKey: "wallet",
    href: "/mcc/wallet",
    icon: Wallet,
    roles: ["user", "agent", "admin"],
    descriptionKey: "walletDesc"
  },
  {
    titleKey: "mcdCredits",
    href: "/mcc/mcd",
    icon: Ticket,
    roles: ["user", "agent", "admin"],
    descriptionKey: "mcdCreditsDesc"
  },

  { titleKey: "web3osSection", href: "#web3os", icon: Users, roles: ["user", "agent", "admin"], isSection: true },
  {
    titleKey: "auctionMarket",
    href: "/mcc/auctions",
    icon: Gift,
    roles: ["user", "agent", "admin"],
    descriptionKey: "auctionMarketDesc"
  },
  {
    titleKey: "territoryManagement",
    href: "/user-system/territory",
    icon: Building2,
    roles: ["user", "agent", "admin"],
    descriptionKey: "territoryManagementDesc"
  },
  {
    titleKey: "nftFragments",
    href: "/mcc/fragment",
    icon: Puzzle,
    roles: ["user", "agent", "admin"],
    descriptionKey: "nftFragmentsDesc"
  },
  {
    titleKey: "lending",
    href: "/mcc/lending",
    icon: Landmark,
    roles: ["user", "agent", "admin"],
    descriptionKey: "lendingDesc"
  },
  {
    titleKey: "communityVoting",
    href: "/mcc/voting",
    icon: Vote,
    roles: ["user", "agent", "admin"],
    descriptionKey: "communityVotingDesc"
  },
  {
    titleKey: "orgStructure",
    href: "/user-system/organization",
    icon: Users,
    roles: ["user", "agent", "admin"],
    descriptionKey: "orgStructureDesc"
  }
]

export const agentMenuItems: MenuItem[] = []

export const adminMenuItems: MenuItem[] = [
  {
    titleKey: "systemAddresses",
    href: "/admin/system-addresses",
    icon: Server,
    roles: ["admin"],
    descriptionKey: "systemAddressesDesc"
  },
  {
    titleKey: "projectReview",
    href: "/admin/project-applications",
    icon: FileText,
    roles: ["admin"],
    descriptionKey: "projectReviewDesc"
  },
  {
    titleKey: "userManagement",
    href: "/admin/members",
    icon: UserCog,
    roles: ["admin"],
    descriptionKey: "userManagementDesc"
  },
  {
    titleKey: "alertCenter",
    href: "/admin/alerts",
    icon: Bell,
    roles: ["admin"],
    descriptionKey: "alertCenterDesc"
  },
  {
    titleKey: "simulationEngine",
    href: "/admin/simulation",
    icon: Bot,
    roles: ["admin"],
    descriptionKey: "simulationEngineDesc"
  },
  {
    titleKey: "mccHolders",
    href: "/admin/mcc-holders",
    icon: Eye,
    roles: ["admin"],
    descriptionKey: "mccHoldersDesc"
  },
  {
    titleKey: "aiManagement",
    href: "/admin/ai-management",
    icon: Bot,
    roles: ["admin"],
    descriptionKey: "aiManagementDesc"
  }
]

export function filterMenuByRole(
  menuItems: MenuItem[],
  userRole: UserRole
): MenuItem[] {
  const roleHierarchy: Record<UserRole, UserRole[]> = {
    admin: ["admin", "agent", "user"],
    agent: ["agent", "user"],
    user: ["user"]
  }

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
    agentMenu: filterMenuByRole(agentMenuItems, userRole),
    adminMenu: filterMenuByRole(adminMenuItems, userRole)
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
