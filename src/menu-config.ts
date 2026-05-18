import {
  Coins,
  Wallet,
  Ticket,
  Gift,
  Building2,
  Vote,
  Users,
  Pickaxe,
  LayoutDashboard,
  Puzzle,
  Landmark,
  Share2,
  type LucideIcon,
} from 'lucide-react'

export type MenuLocale = 'en' | 'zh' | 'ja' | 'ko'

export interface MicrocosmMenuItem {
  title: string
  titles?: Partial<Record<MenuLocale, string>>
  key: string
  path: string
  icon: LucideIcon
  description?: string
  descriptions?: Partial<Record<MenuLocale, string>>
  badge?: string
}

export interface MicrocosmMenuGroup {
  title: string
  titles?: Partial<Record<MenuLocale, string>>
  key: string
  icon: LucideIcon
  items: MicrocosmMenuItem[]
}

export function getMenuTitle(item: { title: string; titles?: Partial<Record<MenuLocale, string>> }, locale?: MenuLocale): string {
  if (!locale || !item.titles) return item.title
  return item.titles[locale] ?? item.title
}

export function getMenuDescription(item: MicrocosmMenuItem, locale?: MenuLocale): string {
  if (!locale || !item.descriptions) return item.description ?? ''
  return item.descriptions[locale] ?? item.description ?? ''
}

export const dashboardMenu: MicrocosmMenuGroup = {
  title: 'Overview',
  titles: { zh: '\u6982\u89c8', ja: '\u6982\u8981', ko: '\uac1c\uc694' },
  key: 'overview',
  icon: LayoutDashboard,
  items: [
    {
      title: 'Dashboard',
      titles: { zh: '\u4eea\u8868\u76d8', ja: '\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9', ko: '\ub300\uc2dc\ubcf4\ub4dc' },
      key: 'dashboard',
      path: '/user-system/dashboard',
      icon: LayoutDashboard,
      description: 'Account overview and statistics',
      descriptions: { zh: '\u8d26\u6237\u603b\u89c8\u4e0e\u7edf\u8ba1', ja: '\u30a2\u30ab\u30a6\u30f3\u30c8\u6982\u8981\u3068\u7d71\u8a08', ko: '\uacc4\uc815 \uac1c\uc694 \ubc0f \ud1b5\uacc4' },
    },
    {
      title: 'Share',
      titles: { zh: '\u5206\u4eab', ja: '\u30b7\u30a7\u30a2', ko: '\uacf5\uc720' },
      key: 'share',
      path: '/user-system/share',
      icon: Share2,
      description: 'Share your MCC position card',
      descriptions: { zh: '\u5206\u4eab\u6211\u7684\u6301\u4ed3\u5361\u7247', ja: '\u4fdd\u6709\u30dd\u30b8\u30b7\u30e7\u30f3\u3092\u30b7\u30a7\u30a2', ko: '\ub0b4 \ud3ec\uc9c0\uc158 \uacf5\uc720' },
    },
  ],
}

export const blockchainMenu: MicrocosmMenuGroup = {
  title: 'Blockchain',
  titles: { zh: '\u533a\u5757\u94fe', ja: '\u30d6\u30ed\u30c3\u30af\u30c1\u30a7\u30fc\u30f3', ko: '\ube14\ub85d\uccb4\uc778' },
  key: 'blockchain',
  icon: Coins,
  items: [
    {
      title: 'Mining',
      titles: { zh: '\u6316\u77ff', ja: '\u30de\u30a4\u30cb\u30f3\u30b0', ko: '\ub9c8\uc774\ub2dd' },
      key: 'mining',
      path: '/mcc/mining',
      icon: Pickaxe,
      description: 'Mine MCC with stablecoin',
      descriptions: { zh: '\u7528\u7a33\u5b9a\u5e01\u6316\u77ff MCC', ja: '\u30b9\u30c6\u30fc\u30d6\u30eb\u30b3\u30a4\u30f3\u3067MCC\u3092\u30de\u30a4\u30cb\u30f3\u30b0', ko: '\uc2a4\ud14c\uc774\ube14\ucf54\uc778\uc73c\ub85c MCC \ucc44\uad74' },
    },

    {
      title: 'Wallet',
      titles: { zh: '\u94b1\u5305', ja: '\u30a6\u30a9\u30ec\u30c3\u30c8', ko: '\uc9c0\uac11' },
      key: 'wallet',
      path: '/mcc/wallet',
      icon: Wallet,
      description: 'MCC asset overview',
      descriptions: { zh: 'MCC \u8d44\u4ea7\u603b\u89c8', ja: 'MCC\u8cc7\u7523\u6982\u8981', ko: 'MCC \uc790\uc0b0 \uac1c\uc694' },
    },
    {
      title: 'MCD Credits',
      titles: { zh: 'MCD \u79ef\u5206', ja: 'MCD\u30af\u30ec\u30b8\u30c3\u30c8', ko: 'MCD \ud06c\ub808\ub527' },
      key: 'mcd',
      path: '/mcc/mcd',
      icon: Ticket,
      description: 'MCD balance and records',
      descriptions: { zh: 'MCD \u4f59\u989d\u4e0e\u8bb0\u5f55', ja: 'MCD\u6b8b\u9ad8\u3068\u5c65\u6b74', ko: 'MCD \uc794\uc561 \ubc0f \uae30\ub85d' },
    },
  ],
}

export const web3OsMenu: MicrocosmMenuGroup = {
  title: 'Web3 OS',
  titles: { zh: 'Web3 \u64cd\u4f5c\u7cfb\u7edf', ja: 'Web3 OS', ko: 'Web3 OS' },
  key: 'web3os',
  icon: Users,
  items: [
    {
      title: 'Auctions',
      titles: { zh: '\u62cd\u5356', ja: '\u30aa\u30fc\u30af\u30b7\u30e7\u30f3', ko: '\uacbd\ub9e4' },
      key: 'auctions',
      path: '/mcc/auctions',
      icon: Gift,
      description: 'Territory auction bidding',
      descriptions: { zh: '\u9886\u5730\u62cd\u5356\u7ade\u4ef7', ja: '\u9818\u5730\u30aa\u30fc\u30af\u30b7\u30e7\u30f3\u5165\u672d', ko: '\uc601\ud1a0 \uacbd\ub9e4 \uc785\ucc30' },
    },
    {
      title: 'Territories',
      titles: { zh: '\u9886\u5730\u7ba1\u7406', ja: '\u9818\u5730\u7ba1\u7406', ko: '\uc601\ud1a0 \uad00\ub9ac' },
      key: 'territory',
      path: '/user-system/territory',
      icon: Building2,
      description: 'Territory list and details',
      descriptions: { zh: '\u9886\u5730\u5217\u8868\u4e0e\u8be6\u60c5', ja: '\u9818\u5730\u4e00\u89a7\u3068\u8a73\u7d30', ko: '\uc601\ud1a0 \ubaa9\ub85d \ubc0f \uc0c1\uc138' },
    },
    {
      title: 'NFT Fragments',
      titles: { zh: 'NFT \u788e\u7247\u5316', ja: 'NFT\u30d5\u30e9\u30b0\u30e1\u30f3\u30c8', ko: 'NFT \ud504\ub798\uadf8\uba3c\ud2b8' },
      key: 'fragments',
      path: '/mcc/fragments',
      icon: Puzzle,
      description: 'Fractionalize territory NFTs',
      descriptions: { zh: '\u9886\u5730 NFT \u788e\u7247\u5316\u4ea4\u6613', ja: '\u9818\u5730NFT\u306e\u30d5\u30e9\u30af\u30b7\u30e7\u30f3\u5316', ko: '\uc601\ud1a0 NFT \ubd84\ud560\ud654 \uac70\ub798' },
    },
    {
      title: 'Lending',
      titles: { zh: '\u53bb\u4e2d\u5fc3\u5316\u501f\u8d37', ja: '\u30ec\u30f3\u30c7\u30a3\u30f3\u30b0', ko: '\ub300\ucd9c' },
      key: 'lending',
      path: '/mcc/lending',
      icon: Landmark,
      description: 'Borrow MCC with NFT collateral',
      descriptions: { zh: 'NFT \u62b5\u62bc\u501f\u8d37 MCC', ja: 'NFT\u62c5\u4fdd\u3067MCC\u3092\u501f\u5165', ko: 'NFT \ub2f4\ubcf4 MCC \ub300\ucd9c' },
    },
    {
      title: 'Voting',
      titles: { zh: '\u6295\u7968', ja: '\u6295\u7968', ko: '\ud22c\ud45c' },
      key: 'voting',
      path: '/mcc/voting',
      icon: Vote,
      description: 'Community proposal voting',
      descriptions: { zh: '\u793e\u533a\u63d0\u6848\u6295\u7968', ja: '\u30b3\u30df\u30e5\u30cb\u30c6\u30a3\u63d0\u6848\u6295\u7968', ko: '\ucee4\ubba4\ub2c8\ud2f0 \uc81c\uc548 \ud22c\ud45c' },
    },
    {
      title: 'Organization',
      titles: { zh: '\u7ec4\u7ec7', ja: '\u7d44\u7e54', ko: '\uc870\uc9c1' },
      key: 'organization',
      path: '/user-system/organization',
      icon: Users,
      description: 'Organization structure',
      descriptions: { zh: '\u7ec4\u7ec7\u67b6\u6784\u7ba1\u7406', ja: '\u7d44\u7e54\u69cb\u9020\u7ba1\u7406', ko: '\uc870\uc9c1 \uad6c\uc870 \uad00\ub9ac' },
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
