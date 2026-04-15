// AI-generated · AI-managed · AI-maintained
export type Platform = 'web' | 'android' | 'ios';
export type UserOrderAction = 'open' | 'close' | 'modify' | 'cancel' | 'add';

export class OrderIDGenerator {
  static generateUserOrderId(platform: Platform, action: UserOrderAction): string {
    const timestamp = Date.now();
    const clientOrderId = `user-${platform}-${action}-${timestamp}`;

    if (clientOrderId.length > 32) {
      throw new Error(`\u751f\u6210\u7684\u8ba2\u5355ID\u957f\u5ea6\u8d85\u8fc732\u5b57\u7b26: ${clientOrderId} (${clientOrderId.length}\u5b57\u7b26)`);
    }

    return clientOrderId;
  }

  static parseOrderSource(clientOrderId: string): {
    source: 'bot' | 'user' | 'unknown';
    strategy: 'energy' | 'power' | 'claude' | null;
    platform: Platform | null;
    action: string | null;
  } {
    const parts = clientOrderId.split('-');

    if (parts[0] === 'energy') {
      return {
        source: 'bot',
        strategy: 'energy',
        platform: null,
        action: parts[1] || null
      };
    }

    if (parts[0] === 'power') {
      return {
        source: 'bot',
        strategy: 'power',
        platform: null,
        action: parts[1] || null
      };
    }

    if (parts[0] === 'claude') {
      return {
        source: 'bot',
        strategy: 'claude',
        platform: null,
        action: parts[1] || null
      };
    }

    if (parts[0] === 'user') {
      return {
        source: 'user',
        strategy: null,
        platform: (parts[1] as Platform) || null,
        action: parts[2] || null
      };
    }

    return {
      source: 'unknown',
      strategy: null,
      platform: null,
      action: null
    };
  }

  static isBotOrder(clientOrderId: string): boolean {
    const { source } = this.parseOrderSource(clientOrderId);
    return source === 'bot';
  }

  static isUserOrder(clientOrderId: string): boolean {
    const { source } = this.parseOrderSource(clientOrderId);
    return source === 'user';
  }

  static getOrderSourceText(clientOrderId: string): string {
    const info = this.parseOrderSource(clientOrderId);

    if (info.source === 'bot') {
      const strategyNames: Record<string, string> = {
        energy: 'Energy\u7b56\u7565',
        power: 'Power\u7b56\u7565',
        claude: 'Claude AI\u7b56\u7565'
      };
      return strategyNames[info.strategy || ''] || 'Bot\u7b56\u7565';
    }

    if (info.source === 'user') {
      const platformNames: Record<Platform, string> = {
        web: '\u7f51\u9875',
        android: 'Android',
        ios: 'iOS'
      };
      const platform = platformNames[info.platform || 'web'] || '\u672a\u77e5\u5e73\u53f0';
      const actionNames: Record<string, string> = {
        open: '\u5f00\u4ed3',
        close: '\u5e73\u4ed3',
        add: '\u52a0\u4ed3',
        modify: '\u4fee\u6539',
        cancel: '\u53d6\u6d88'
      };
      const action = actionNames[info.action || ''] || '\u64cd\u4f5c';
      return `${platform} - ${action}`;
    }

    return '\u672a\u77e5\u6765\u6e90';
  }
}

export const generateUserOrderId = OrderIDGenerator.generateUserOrderId.bind(OrderIDGenerator);
export const parseOrderSource = OrderIDGenerator.parseOrderSource.bind(OrderIDGenerator);
export const isBotOrder = OrderIDGenerator.isBotOrder.bind(OrderIDGenerator);
export const isUserOrder = OrderIDGenerator.isUserOrder.bind(OrderIDGenerator);
export const getOrderSourceText = OrderIDGenerator.getOrderSourceText.bind(OrderIDGenerator);
