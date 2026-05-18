export interface AiChatContext {
  roleKey: string
  accentColor: string
  questions: string[]
  placeholder: string
  label: string
}

interface RouteRule {
  prefix: string
  ctx: AiChatContext
}

const ROUTE_RULES: RouteRule[] = [
  {
    prefix: '/developers/assistant',
    ctx: {
      roleKey: 'apex_advisor',
      accentColor: '#22c55e',
      questions: ['APEX \u8bc4\u5ba1\u5982\u4f55\u8fd0\u4f5c？', '\u9879\u76ee\u8bc4\u5206\u6807\u51c6\u662f\u4ec0\u4e48？', 'Forge \u5de5\u7a0b\u56e2\u5982\u4f55\u6784\u5efa？'],
      placeholder: '\u63cf\u8ff0\u4f60\u7684\u9879\u76ee\u60f3\u6cd5，APEX \u8bc4\u5ba1\u9662\u5e2e\u4f60\u5b8c\u5584\u65b9\u6848...',
      label: 'APEX \u987e\u95ee',
    },
  },
  {
    prefix: '/developers',
    ctx: {
      roleKey: 'dev_assistant',
      accentColor: '#22c55e',
      questions: ['\u5982\u4f55\u63a5\u5165 Open API？', 'OAuth 2.0 \u8ba4\u8bc1\u6d41\u7a0b？', 'SDK \u600e\u4e48\u5b89\u88c5？'],
      placeholder: '\u8be2\u95ee\u5f00\u53d1\u76f8\u5173\u95ee\u9898...',
      label: 'APEX \u987e\u95ee',
    },
  },
  {
    prefix: '/docs',
    ctx: {
      roleKey: 'docs_helper',
      accentColor: '#e2e8f0',
      questions: ['\u6280\u672f\u6587\u6863\u5165\u53e3？', 'API \u53c2\u8003\u5728\u54ea？', '\u5feb\u901f\u4e0a\u624b\u6307\u5357？'],
      placeholder: '\u8be2\u95ee\u6587\u6863\u76f8\u5173\u95ee\u9898...',
      label: '\u6587\u6863\u52a9\u624b',
    },
  },
  {
    prefix: '/blockchain',
    ctx: {
      roleKey: 'blockchain_expert',
      accentColor: '#5EEAD4',
      questions: ['\u94fe\u4e0a\u6570\u636e\u5982\u4f55\u67e5\u8be2？', '\u5408\u7ea6\u72b6\u6001\u5982\u4f55\u67e5\u770b？', 'MCC \u5408\u7ea6\u5730\u5740\u662f\u4ec0\u4e48？'],
      placeholder: '\u8be2\u95ee\u533a\u5757\u94fe\u76f8\u5173\u95ee\u9898...',
      label: '\u94fe\u4e0a\u4e13\u5bb6',
    },
  },
  {
    prefix: '/data',
    ctx: {
      roleKey: 'data_analyst',
      accentColor: '#5EEAD4',
      questions: ['\u6301\u5e01\u4eba\u5206\u5e03？', '\u6316\u77ff\u8d8b\u52bf\u5982\u4f55？', '\u6d41\u52a8\u6027\u6df1\u5ea6？'],
      placeholder: '\u8be2\u95ee\u6570\u636e\u5206\u6790\u76f8\u5173\u95ee\u9898...',
      label: '\u6570\u636e\u5206\u6790',
    },
  },
  {
    prefix: '/resources/mining',
    ctx: {
      roleKey: 'mining_advisor',
      accentColor: '#f59e0b',
      questions: ['\u6316\u77ff\u4ef7\u683c\u5982\u4f55\u8ba1\u7b97？', '\u4f34\u751f\u77ff\u662f\u4ec0\u4e48？', '\u51cf\u534a\u673a\u5236\u662f\u4ec0\u4e48？'],
      placeholder: '\u8be2\u95ee\u6316\u77ff\u76f8\u5173\u95ee\u9898...',
      label: '\u6316\u77ff\u987e\u95ee',
    },
  },
  {
    prefix: '/mine',
    ctx: {
      roleKey: 'mining_advisor',
      accentColor: '#f59e0b',
      questions: ['\u5982\u4f55\u5f00\u59cb\u6316\u77ff？', '\u652f\u6301\u54ea\u4e9b\u94b1\u5305？', '\u6316\u77ff\u6536\u76ca\u5982\u4f55\u8ba1\u7b97？'],
      placeholder: '\u8be2\u95ee\u6316\u77ff\u76f8\u5173\u95ee\u9898...',
      label: '\u6316\u77ff\u987e\u95ee',
    },
  },
  {
    prefix: '/resources',
    ctx: {
      roleKey: 'resource_guide',
      accentColor: '#f59e0b',
      questions: ['MCC \u4ee3\u5e01\u603b\u91cf\u662f\u591a\u5c11？', '\u9886\u5730\u7cfb\u7edf\u600e\u4e48\u8fd0\u4f5c？', '\u5982\u4f55\u53c2\u4e0e\u62cd\u5356？'],
      placeholder: '\u8be2\u95ee\u8d44\u6e90\u76f8\u5173\u95ee\u9898...',
      label: '\u8d44\u6e90\u5411\u5bfc',
    },
  },
  {
    prefix: '/market',
    ctx: {
      roleKey: 'market_guide',
      accentColor: '#FF6B00',
      questions: ['MCC \u5f53\u524d\u4ef7\u683c？', '\u5982\u4f55\u8d2d\u4e70 MCC？', '\u6d41\u52a8\u6027\u6c60\u72b6\u6001？'],
      placeholder: '\u8be2\u95ee\u5e02\u573a\u76f8\u5173\u95ee\u9898...',
      label: '\u5e02\u573a\u5411\u5bfc',
    },
  },
  {
    prefix: '/community',
    ctx: {
      roleKey: 'community_guide',
      accentColor: '#5EEAD4',
      questions: ['\u5982\u4f55\u52a0\u5165\u793e\u533a？', '\u6cbb\u7406\u673a\u5236\u662f\u4ec0\u4e48？', '\u5982\u4f55\u53c2\u4e0e\u751f\u6001？'],
      placeholder: '\u8be2\u95ee\u793e\u533a\u76f8\u5173\u95ee\u9898...',
      label: '\u793e\u533a\u5411\u5bfc',
    },
  },
  {
    prefix: '/mainnet',
    ctx: {
      roleKey: 'mainnet_guide',
      accentColor: '#22D3EE',
      questions: ['\u5408\u7ea6\u90e8\u7f72\u72b6\u6001？', '\u5982\u4f55\u9a8c\u8bc1\u4ea4\u6613？', '\u4e3b\u7f51\u5730\u5740\u5728\u54ea？'],
      placeholder: '\u8be2\u95ee\u4e3b\u7f51\u76f8\u5173\u95ee\u9898...',
      label: '\u4e3b\u7f51\u5411\u5bfc',
    },
  },
  {
    prefix: '/game',
    ctx: {
      roleKey: 'game_guide',
      accentColor: '#a855f7',
      questions: ['Crash \u73a9\u6cd5\u89c4\u5219？', 'HODL \u5bf9\u8d4c\u600e\u4e48\u73a9？', '\u9000\u573a\u7f5a\u6ca1\u5982\u4f55\u5206\u914d？'],
      placeholder: '\u8be2\u95ee\u6e38\u620f\u76f8\u5173\u95ee\u9898...',
      label: '\u6e38\u620f\u5411\u5bfc',
    },
  },
]

const DEFAULT_CONTEXT: AiChatContext = {
  roleKey: 'home_guide',
  accentColor: '#22c55e',
  questions: ['Microcosm \u662f\u4ec0\u4e48？', 'MCC \u4ee3\u5e01\u4ecb\u7ecd', '\u5982\u4f55\u52a0\u5165\u751f\u6001？'],
  placeholder: '\u6709\u4ec0\u4e48\u60f3\u4e86\u89e3\u7684？',
  label: 'AI \u52a9\u624b',
}

function stripLocalePrefix(pathname: string): string {
  return pathname.replace(/^\/[a-z]{2}(?:\/|$)/, '/') || '/'
}

export function getAiChatContext(pathname: string): AiChatContext {
  const cleanPath = stripLocalePrefix(pathname)
  for (const rule of ROUTE_RULES) {
    if (cleanPath.startsWith(rule.prefix)) {
      return rule.ctx
    }
  }
  return DEFAULT_CONTEXT
}
