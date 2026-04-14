export interface DocItem {
  slug: string
  titleKey: string
  subtitle?: string
  file: string
}

export interface DocCategory {
  id: string
  titleKey: string
  icon: string
  items: DocItem[]
}

export const docsCategories: DocCategory[] = [
  {
    id: "whitepaper",
    titleKey: "catWhitepaper",
    icon: "FileText",
    items: [
      { slug: "whitepaper/overview", titleKey: "wpOverview", file: "whitepaper/00-cover-and-toc.md" },
      { slug: "whitepaper/vision", titleKey: "wpVision", subtitle: "Vision & Mission", file: "whitepaper/01-vision-and-mission.md" },
      { slug: "whitepaper/titan-world", titleKey: "wpTitanWorld", subtitle: "Carbon-Silicon Symbiosis", file: "whitepaper/01b-titan-world.md" },
      { slug: "whitepaper/architecture", titleKey: "wpArchitecture", subtitle: "Core Architecture", file: "whitepaper/02-core-architecture.md" },
      { slug: "whitepaper/organization", titleKey: "wpOrganization", subtitle: "Organization System", file: "whitepaper/03-organization-system.md" },
      { slug: "whitepaper/tokenomics", titleKey: "wpTokenomics", subtitle: "Token Economics", file: "whitepaper/04-tokenomics.md" },
      { slug: "whitepaper/mining-detail", titleKey: "wpMiningDetail", subtitle: "Mining Mechanism", file: "whitepaper/04a-mining-mechanism.md" },
      { slug: "whitepaper/mcc-value", titleKey: "wpMccValue", subtitle: "MCC Value Proposition", file: "whitepaper/04b-mcc-value-proposition.md" },
      { slug: "whitepaper/2140-protocol", titleKey: "wp2140Protocol", subtitle: "2140 Protocol", file: "whitepaper/04c-2140-protocol.md" },
      { slug: "whitepaper/x402", titleKey: "wpX402", subtitle: "x402 Payment Protocol", file: "whitepaper/05-x402-payment-protocol.md" },
      { slug: "whitepaper/tech", titleKey: "wpTech", subtitle: "Technical Implementation", file: "whitepaper/06-technical-implementation.md" },
      { slug: "whitepaper/developer-eco", titleKey: "wpDevEco", subtitle: "Developer Ecosystem", file: "whitepaper/07-developer-ecosystem.md" },
      { slug: "whitepaper/roadmap", titleKey: "wpRoadmap", subtitle: "Roadmap", file: "whitepaper/08-roadmap.md" },
      { slug: "whitepaper/governance", titleKey: "wpGovernance", subtitle: "Community Governance", file: "whitepaper/09-community-governance.md" },
      { slug: "whitepaper/security", titleKey: "wpSecurity", subtitle: "Security & Compliance", file: "whitepaper/10-security-and-compliance.md" },
      { slug: "whitepaper/conclusion", titleKey: "wpConclusion", subtitle: "Conclusion", file: "whitepaper/11-conclusion.md" },
      { slug: "whitepaper/appendix", titleKey: "wpAppendix", subtitle: "Appendix", file: "whitepaper/12-appendix.md" },
    ],
  },
  {
    id: "deep-dive",
    titleKey: "catDeepDive",
    icon: "Layers",
    items: [
      { slug: "deep-dive/active-buyback", titleKey: "ddReincarnation", subtitle: "Active Buyback Mechanism", file: "whitepaper/reincarnation-mechanism.md" },
      { slug: "deep-dive/mcd-voucher", titleKey: "ddMcdVoucher", subtitle: "MCD Ecosystem Voucher", file: "whitepaper/mcd-ecosystem-voucher.md" },
      { slug: "deep-dive/erc8004", titleKey: "ddErc8004", subtitle: "ERC-8004 Comparison", file: "whitepaper/erc-8004-comparison.md" },
    ],
  },
  {
    id: "concepts",
    titleKey: "catConcepts",
    icon: "BookOpen",
    items: [
      { slug: "concepts/terminology", titleKey: "coTerminology", subtitle: "Terminology", file: "_definitions/terminology.md" },
      { slug: "concepts/user-levels", titleKey: "coUserLevels", subtitle: "User Levels", file: "_definitions/user-levels.md" },
      { slug: "concepts/distribution", titleKey: "coDistribution", subtitle: "Distribution Ratios", file: "_definitions/distribution-ratios.md" },
      { slug: "concepts/mining-flow", titleKey: "coMiningFlow", subtitle: "Mining Flow", file: "_definitions/mining-flow.md" },
      { slug: "concepts/solana-contracts", titleKey: "coSolanaContracts", subtitle: "Solana Contracts", file: "_definitions/solana-contracts.md" },
      { slug: "concepts/price-oracle", titleKey: "coPriceOracle", subtitle: "Price Oracle", file: "_definitions/price-oracle.md" },
      { slug: "concepts/tech-bonus", titleKey: "coTechBonus", subtitle: "Tech Bonus", file: "_definitions/tech-bonus.md" },
    ],
  },
  {
    id: "developer",
    titleKey: "catDeveloper",
    icon: "Terminal",
    items: [
      { slug: "developer/integration-guide", titleKey: "devIntegrationGuide", subtitle: "SDK + Hooks + Components", file: "microcosm-integration-guide.md" },
      { slug: "developer/api-reference", titleKey: "devApiReference", subtitle: "85 REST API Endpoints", file: "microcosm-api-reference.md" },
      { slug: "developer/code-examples", titleKey: "devCodeExamples", subtitle: "91 Hooks + 12 Components", file: "microcosm-code-examples.md" },
      { slug: "developer/auth-sdk-design", titleKey: "devAuthSdkDesign", subtitle: "SDK Architecture (3 packages)", file: "microcosm-auth-sdk-design.md" },
      { slug: "developer/auth-service", titleKey: "devAuthService", subtitle: "OAuth Proxy Service", file: "microcosm-auth-proxy-service.md" },
      { slug: "developer/open-api", titleKey: "devOpenApi", subtitle: "Open API Implementation Plan", file: "Microcosm-Open-API-Implementation-Plan.md" },
      { slug: "developer/oauth-format", titleKey: "devOauthFormat", subtitle: "OAuth Data Format", file: "_definitions/oauth-data-format.md" },
    ],
  },
  {
    id: "legal",
    titleKey: "catLegal",
    icon: "Scale",
    items: [
      { slug: "legal/registration-agreement", titleKey: "legalRegistration", subtitle: "Registration Agreement", file: "legal/registration-agreement.md" },
      { slug: "legal/terms-of-service", titleKey: "legalTerms", subtitle: "Terms of Service", file: "legal/terms-of-service.md" },
      { slug: "legal/privacy-policy", titleKey: "legalPrivacy", subtitle: "Privacy Policy", file: "legal/privacy-policy.md" },
    ],
  },
]

export function getAllDocs(): (DocItem & { categoryId: string; categoryTitleKey: string })[] {
  return docsCategories.flatMap((cat) =>
    cat.items.map((item) => ({
      ...item,
      categoryId: cat.id,
      categoryTitleKey: cat.titleKey,
    }))
  )
}

export function getDocBySlug(slug: string) {
  for (const cat of docsCategories) {
    const doc = cat.items.find((item) => item.slug === slug)
    if (doc) {
      return { ...doc, categoryId: cat.id, categoryTitleKey: cat.titleKey }
    }
  }
  return null
}

export function getCategoryById(id: string) {
  return docsCategories.find((cat) => cat.id === id)
}

export function getAdjacentDocs(slug: string) {
  const allDocs = getAllDocs()
  const index = allDocs.findIndex((d) => d.slug === slug)
  return {
    prev: index > 0 ? allDocs[index - 1] : null,
    next: index < allDocs.length - 1 ? allDocs[index + 1] : null,
  }
}
