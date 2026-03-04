// AI-generated · AI-managed · AI-maintained
import {
  Coins,
  Wallet,
  ArrowDownUp,
  Ticket,
  Gift,
  Building2,
  Vote,
  Users,
  Pickaxe,
  LayoutDashboard,
  type LucideIcon,
} from 'lucide-react'

export interface MicrocosmMenuItem {
  title: string
  key: string
  path: string
  icon: LucideIcon
  description?: string
  badge?: string
}

export interface MicrocosmMenuGroup {
  title: string
  key: string
  icon: LucideIcon
  items: MicrocosmMenuItem[]
}

export const dashboardMenu: MicrocosmMenuGroup = {
  title: 'Overview',
  key: 'overview',
  icon: LayoutDashboard,
  items: [
    {
      title: 'Dashboard',
      key: 'dashboard',
      path: '/user-system/dashboard',
      icon: LayoutDashboard,
      description: 'Account overview and statistics',
    },
  ],
}

export const blockchainMenu: MicrocosmMenuGroup = {
  title: 'Blockchain',
  key: 'blockchain',
  icon: Coins,
  items: [
    {
      title: 'Mining',
      key: 'mining',
      path: '/mcc/mining',
      icon: Pickaxe,
      description: 'Mine MCC with stablecoin',
    },
    {
      title: 'Reincarnation',
      key: 'reincarnation',
      path: '/mcc/reincarnation',
      icon: ArrowDownUp,
      description: 'Buyback MCC for stablecoin',
    },
    {
      title: 'Wallet',
      key: 'wallet',
      path: '/mcc/wallet',
      icon: Wallet,
      description: 'MCC asset overview',
    },
    {
      title: 'MCD Credits',
      key: 'mcd',
      path: '/mcc/mcd',
      icon: Ticket,
      description: 'MCD balance and records',
    },
  ],
}

export const web3OsMenu: MicrocosmMenuGroup = {
  title: 'Web3 OS',
  key: 'web3os',
  icon: Users,
  items: [
    {
      title: 'Auctions',
      key: 'auctions',
      path: '/mcc/auctions',
      icon: Gift,
      description: 'Territory auction bidding',
    },
    {
      title: 'Territories',
      key: 'territory',
      path: '/user-system/territory',
      icon: Building2,
      description: 'Territory list and details',
    },
    {
      title: 'Voting',
      key: 'voting',
      path: '/mcc/voting',
      icon: Vote,
      description: 'Community proposal voting',
    },
    {
      title: 'Organization',
      key: 'organization',
      path: '/user-system/organization',
      icon: Users,
      description: 'Organization structure',
    },
  ],
}

export const microcosmMenuGroups: MicrocosmMenuGroup[] = [
  dashboardMenu,
  blockchainMenu,
  web3OsMenu,
]

export function getAllMenuItems(): MicrocosmMenuItem[] {
  return microcosmMenuGroups.flatMap(group => group.items)
}

export function resolveMenuPath(path: string, basePath?: string): string {
  if (!basePath) return path
  const base = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath
  return `${base}${path}`
}
