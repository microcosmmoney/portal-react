// AI-generated · AI-managed · AI-maintained
const MCC_POOL_ADDRESS = "4AiaTd9bAWf3u8ScZWhXadJF1roc8bJKEKvaDudKacZd"
const API_BASE = "https://api.geckoterminal.com/api/v2"

export interface OHLCVData {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export type PriceTimeRange = "1D" | "7D" | "30D" | "1Y"

function getOHLCVParams(range: PriceTimeRange): { timeframe: string; aggregate: number; limit: number } {
  switch (range) {
    case "1D":
      return { timeframe: "hour", aggregate: 1, limit: 24 }
    case "7D":
      return { timeframe: "day", aggregate: 1, limit: 7 }
    case "30D":
      return { timeframe: "day", aggregate: 1, limit: 30 }
    case "1Y":
      return { timeframe: "day", aggregate: 1, limit: 365 }
  }
}

export async function fetchPriceHistory(range: PriceTimeRange): Promise<OHLCVData[]> {
  const { timeframe, aggregate, limit } = getOHLCVParams(range)

  const url = `${API_BASE}/networks/solana/pools/${MCC_POOL_ADDRESS}/ohlcv/${timeframe}?aggregate=${aggregate}&limit=${limit}&currency=usd`

  const response = await fetch(url, {
    headers: {
      "Accept": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`GeckoTerminal API error: ${response.status}`)
  }

  const json = await response.json()

  const ohlcvList = json?.data?.attributes?.ohlcv_list

  if (!Array.isArray(ohlcvList)) {
    return []
  }

  return ohlcvList.map((item: number[]) => ({
    timestamp: item[0],
    open: item[1],
    high: item[2],
    low: item[3],
    close: item[4],
    volume: item[5],
  })).sort((a: OHLCVData, b: OHLCVData) => a.timestamp - b.timestamp)
}
