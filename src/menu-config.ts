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
  titles: { zh: '\u6982\u89c8', ja: '\u6982\u8981', ko: '개요' },
  key: 'overview',
  icon: LayoutDashboard,
  items: [
    {
      title: 'Dashboard',
      titles: { zh: '\u4eea\u8868\u76d8', ja: 'ダッシュボード', ko: '대시보드' },
      key: 'dashboard',
      path: '/user-system/dashboard',
      icon: LayoutDashboard,
      description: 'Account overview and statistics',
      descriptions: { zh: '\u8d26\u6237\u603b\u89c8\u4e0e\u7edf\u8ba1', ja: 'アカウント\u6982\u8981と\u7d71\u8a08', ko: '계정 개요 및 통계' },
    },
  ],
}

export const blockchainMenu: MicrocosmMenuGroup = {
  title: 'Blockchain',
  titles: { zh: '\u533a\u5757\u94fe', ja: 'ブロックチェーン', ko: '블록체인' },
  key: 'blockchain',
  icon: Coins,
  items: [
    {
      title: 'Mining',
      titles: { zh: '\u6316\u77ff', ja: 'マイニング', ko: '마이닝' },
      key: 'mining',
      path: '/mcc/mining',
      icon: Pickaxe,
      description: 'Mine MCC with stablecoin',
      descriptions: { zh: '\u7528\u7a33\u5b9a\u5e01\u6316\u77ff MCC', ja: 'ステーブルコインでMCCをマイニング', ko: '스테이블코인으로 MCC 채굴' },
    },

    {
      title: 'Wallet',
      titles: { zh: '\u94b1\u5305', ja: 'ウォレット', ko: '지갑' },
      key: 'wallet',
      path: '/mcc/wallet',
      icon: Wallet,
      description: 'MCC asset overview',
      descriptions: { zh: 'MCC \u8d44\u4ea7\u603b\u89c8', ja: 'MCC\u8cc7\u7523\u6982\u8981', ko: 'MCC 자산 개요' },
    },
    {
      title: 'MCD Credits',
      titles: { zh: 'MCD \u79ef\u5206', ja: 'MCDクレジット', ko: 'MCD 크레딧' },
      key: 'mcd',
      path: '/mcc/mcd',
      icon: Ticket,
      description: 'MCD balance and records',
      descriptions: { zh: 'MCD \u4f59\u989d\u4e0e\u8bb0\u5f55', ja: 'MCD\u6b8b\u9ad8と\u5c65\u6b74', ko: 'MCD 잔액 및 기록' },
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
      titles: { zh: '\u62cd\u5356', ja: 'オークション', ko: '경매' },
      key: 'auctions',
      path: '/mcc/auctions',
      icon: Gift,
      description: 'Territory auction bidding',
      descriptions: { zh: '\u9886\u5730\u62cd\u5356\u7ade\u4ef7', ja: '\u9818\u5730オークション\u5165\u672d', ko: '영토 경매 입찰' },
    },
    {
      title: 'Territories',
      titles: { zh: '\u9886\u5730\u7ba1\u7406', ja: '\u9818\u5730\u7ba1\u7406', ko: '영토 관리' },
      key: 'territory',
      path: '/user-system/territory',
      icon: Building2,
      description: 'Territory list and details',
      descriptions: { zh: '\u9886\u5730\u5217\u8868\u4e0e\u8be6\u60c5', ja: '\u9818\u5730\u4e00\u89a7と\u8a73\u7d30', ko: '영토 목록 및 상세' },
    },
    {
      title: 'NFT Fragments',
      titles: { zh: 'NFT \u788e\u7247\u5316', ja: 'NFTフラグメント', ko: 'NFT 프래그먼트' },
      key: 'fragments',
      path: '/mcc/fragments',
      icon: Puzzle,
      description: 'Fractionalize territory NFTs',
      descriptions: { zh: '\u9886\u5730 NFT \u788e\u7247\u5316\u4ea4\u6613', ja: '\u9818\u5730NFTのフラクション\u5316', ko: '영토 NFT 분할화 거래' },
    },
    {
      title: 'Lending',
      titles: { zh: '\u53bb\u4e2d\u5fc3\u5316\u501f\u8d37', ja: 'レンディング', ko: '대출' },
      key: 'lending',
      path: '/mcc/lending',
      icon: Landmark,
      description: 'Borrow MCC with NFT collateral',
      descriptions: { zh: 'NFT \u62b5\u62bc\u501f\u8d37 MCC', ja: 'NFT\u62c5\u4fddでMCCを\u501f\u5165', ko: 'NFT 담보 MCC 대출' },
    },
    {
      title: 'Voting',
      titles: { zh: '\u6295\u7968', ja: '\u6295\u7968', ko: '투표' },
      key: 'voting',
      path: '/mcc/voting',
      icon: Vote,
      description: 'Community proposal voting',
      descriptions: { zh: '\u793e\u533a\u63d0\u6848\u6295\u7968', ja: 'コミュニティ\u63d0\u6848\u6295\u7968', ko: '커뮤니티 제안 투표' },
    },
    {
      title: 'Organization',
      titles: { zh: '\u7ec4\u7ec7', ja: '\u7d44\u7e54', ko: '조직' },
      key: 'organization',
      path: '/user-system/organization',
      icon: Users,
      description: 'Organization structure',
      descriptions: { zh: '\u7ec4\u7ec7\u67b6\u6784\u7ba1\u7406', ja: '\u7d44\u7e54\u69cb\u9020\u7ba1\u7406', ko: '조직 구조 관리' },
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
