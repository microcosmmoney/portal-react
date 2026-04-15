export interface MainstreamToken {
  symbol: string
  name: string
  mint: string
  decimals: number
  color: string
  isStablecoin: boolean
  isNative?: boolean
  logoURI?: string
}

const T = 'https://microcosm.money/assets/tokens'

export const MAINSTREAM_TOKENS: MainstreamToken[] = [
  { symbol: "SOL", name: "Solana", mint: "So11111111111111111111111111111111111111112", decimals: 9, color: "bg-purple-500", isStablecoin: false, isNative: true, logoURI: `${T}/sol.png` },
  { symbol: "MCC", name: "Microcosm Coin", mint: "MCCn6eqiTGzaiPKECg3viPmkdkS9YmkguqKvRcTxCsb", decimals: 9, color: "bg-cyan-500", isStablecoin: false, logoURI: `${T}/mcc.jpg` },
  { symbol: "MCD", name: "Microcosm Dollar", mint: "MCDAhpfpKrsvXd1i95jToVd5SRL2xrZbeEriBbBJAn2", decimals: 9, color: "bg-amber-500", isStablecoin: true, logoURI: `${T}/mcd.jpg` },
  { symbol: "USDC", name: "USD Coin", mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", decimals: 6, color: "bg-blue-500", isStablecoin: true, logoURI: `${T}/usdc.png` },
  { symbol: "USDT", name: "Tether USD", mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", decimals: 6, color: "bg-green-500", isStablecoin: true, logoURI: `${T}/usdt.png` },
  { symbol: "WBTC", name: "Wrapped Bitcoin", mint: "3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh", decimals: 8, color: "bg-orange-500", isStablecoin: false, logoURI: `${T}/wbtc.png` },
  { symbol: "WETH", name: "Wrapped Ether", mint: "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs", decimals: 8, color: "bg-blue-400", isStablecoin: false, logoURI: `${T}/weth.png` },
  { symbol: "JUP", name: "Jupiter", mint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN", decimals: 6, color: "bg-lime-500", isStablecoin: false, logoURI: `${T}/jup.png` },
  { symbol: "RAY", name: "Raydium", mint: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R", decimals: 6, color: "bg-cyan-500", isStablecoin: false, logoURI: `${T}/ray.png` },
  { symbol: "ORCA", name: "Orca", mint: "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE", decimals: 6, color: "bg-yellow-500", isStablecoin: false, logoURI: `${T}/orca.png` },
  { symbol: "PYTH", name: "Pyth Network", mint: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3", decimals: 6, color: "bg-violet-500", isStablecoin: false, logoURI: `${T}/pyth.png` },
  { symbol: "JTO", name: "Jito", mint: "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL", decimals: 9, color: "bg-emerald-500", isStablecoin: false, logoURI: `${T}/jto.png` },
  { symbol: "BONK", name: "Bonk", mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", decimals: 5, color: "bg-orange-400", isStablecoin: false, logoURI: `${T}/bonk.png` },
  { symbol: "WIF", name: "dogwifhat", mint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm", decimals: 6, color: "bg-pink-500", isStablecoin: false, logoURI: `${T}/wif.png` },
  { symbol: "RENDER", name: "Render", mint: "rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof", decimals: 8, color: "bg-teal-500", isStablecoin: false, logoURI: `${T}/render.png` },
  { symbol: "HNT", name: "Helium", mint: "hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux", decimals: 8, color: "bg-sky-500", isStablecoin: false, logoURI: `${T}/hnt.png` },
  { symbol: "W", name: "Wormhole", mint: "85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ", decimals: 6, color: "bg-slate-500", isStablecoin: false, logoURI: `${T}/w.png` },
  { symbol: "MSOL", name: "Marinade SOL", mint: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So", decimals: 9, color: "bg-rose-500", isStablecoin: false, logoURI: `${T}/msol.png` },
  { symbol: "JITOSOL", name: "Jito Staked SOL", mint: "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn", decimals: 9, color: "bg-emerald-400", isStablecoin: false, logoURI: `${T}/jitosol.png` },
  { symbol: "BSOL", name: "BlazeStake SOL", mint: "bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1", decimals: 9, color: "bg-orange-300", isStablecoin: false, logoURI: `${T}/bsol.png` },
  { symbol: "INF", name: "Infinity", mint: "5oVNBeEEQvYi1cX3ir8Dx5n1P7pdxydbGF2X4TxVusJm", decimals: 9, color: "bg-indigo-500", isStablecoin: false, logoURI: `${T}/inf.png` },
  { symbol: "JUPSOL", name: "Jupiter Staked SOL", mint: "jupSoLaHXQiZZTSfEWMTRRgpnyFm8f6sZdosWBjx93v", decimals: 9, color: "bg-lime-400", isStablecoin: false, logoURI: `${T}/jupsol.png` },
  { symbol: "TRUMP", name: "Official Trump", mint: "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN", decimals: 6, color: "bg-red-500", isStablecoin: false, logoURI: `${T}/trump.png` },
  { symbol: "POPCAT", name: "Popcat", mint: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr", decimals: 9, color: "bg-orange-300", isStablecoin: false, logoURI: `${T}/popcat.png` },
  { symbol: "MEW", name: "Cat in a Dogs World", mint: "MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5", decimals: 5, color: "bg-stone-500", isStablecoin: false, logoURI: `${T}/mew.png` },
  { symbol: "FARTCOIN", name: "Fartcoin", mint: "9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump", decimals: 6, color: "bg-green-400", isStablecoin: false, logoURI: `${T}/fartcoin.png` },
  { symbol: "PNUT", name: "Peanut the Squirrel", mint: "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump", decimals: 6, color: "bg-amber-400", isStablecoin: false, logoURI: `${T}/pnut.png` },
  { symbol: "GOAT", name: "Goatseus Maximus", mint: "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump", decimals: 6, color: "bg-zinc-500", isStablecoin: false, logoURI: `${T}/goat.png` },
  { symbol: "MICHI", name: "michi", mint: "5mbK36SZ7J19An8jFochhQS4of8g6BwUjbeCSxBSoWdp", decimals: 6, color: "bg-yellow-400", isStablecoin: false, logoURI: `${T}/michi.png` },
  { symbol: "GIGA", name: "Gigachad", mint: "63LfDmNb3MQ8mw9MtZ2To9bEA2M71kZUUGq5tiJxcqj9", decimals: 5, color: "bg-stone-400", isStablecoin: false, logoURI: `${T}/giga.png` },
  { symbol: "MOTHER", name: "Mother Iggy", mint: "3S8qX1MsMqRbiwKg2cQyx7nis1oHMgaCuc9c4VfvVdPN", decimals: 6, color: "bg-pink-400", isStablecoin: false, logoURI: `${T}/mother.png` },
  { symbol: "SLERF", name: "Slerf", mint: "7BgBvyjrZX1YKz4oh9mjb8ZScatkkwb8DzFx7LoiVkM3", decimals: 9, color: "bg-amber-500", isStablecoin: false, logoURI: `${T}/slerf.png` },
  { symbol: "MOODENG", name: "Moo Deng", mint: "ED5nyyWEzpPPiWimP8vYm7sD7TD3LAt3Q3gRTWHzPJBY", decimals: 6, color: "bg-red-400", isStablecoin: false, logoURI: `${T}/moodeng.png` },
  { symbol: "AI16Z", name: "ai16z", mint: "HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC", decimals: 9, color: "bg-purple-400", isStablecoin: false, logoURI: `${T}/ai16z.png` },
  { symbol: "ARC", name: "AI Rig Complex", mint: "61V8vBaqAGMpgDQi4JcAwo1dmBGHsyhzodcPqnEVpump", decimals: 6, color: "bg-cyan-400", isStablecoin: false, logoURI: `${T}/arc.png` },
  { symbol: "GRIFFAIN", name: "GRIFFAIN", mint: "KENJSUYLASHUMfHyy5o4Hp2FdNqZg1AsUPhfH2kYvEP", decimals: 6, color: "bg-teal-400", isStablecoin: false, logoURI: `${T}/griffain.png` },
  { symbol: "ZEREBRO", name: "Zerebro", mint: "8x5VqbHA8D7NkD52uNuS5nnt3PwA8pLD34ymskeSo2Wn", decimals: 6, color: "bg-indigo-400", isStablecoin: false, logoURI: `${T}/zerebro.png` },
  { symbol: "LUCE", name: "Luce", mint: "CBdCxKo9QavR9hfShgpEBG3zekorAeD7W1jfq2o3pump", decimals: 6, color: "bg-yellow-300", isStablecoin: false, logoURI: `${T}/luce.png` },
  { symbol: "DRIFT", name: "Drift", mint: "DriFtupJYLTosbwoN8koMbEYSx54aFAVLddWsbksjwg7", decimals: 6, color: "bg-violet-400", isStablecoin: false, logoURI: `${T}/drift.png` },
  { symbol: "KMNO", name: "Kamino", mint: "KMNo3nJsBXfcpJTVhZcXLW7RmTwTt4GVFE7suUBo9sS", decimals: 6, color: "bg-fuchsia-500", isStablecoin: false, logoURI: `${T}/kmno.png` },
  { symbol: "MNGO", name: "Mango", mint: "MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac", decimals: 6, color: "bg-orange-500", isStablecoin: false, logoURI: `${T}/mngo.png` },
  { symbol: "FIDA", name: "Bonfida", mint: "EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp", decimals: 6, color: "bg-blue-400", isStablecoin: false, logoURI: `${T}/fida.png` },
  { symbol: "SRM", name: "Serum", mint: "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt", decimals: 6, color: "bg-cyan-300", isStablecoin: false, logoURI: `${T}/srm.png` },
  { symbol: "STEP", name: "Step", mint: "StepAscQoEioFxxWGnh2sLBDFp9d8rvKz2Yp39iDpyT", decimals: 9, color: "bg-amber-400", isStablecoin: false, logoURI: `${T}/step.png` },
  { symbol: "MAPS", name: "Maps", mint: "MAPS41MDahZ9QdKXhVa4dWB9RuyfV4XqhyAZ8XcYepb", decimals: 6, color: "bg-rose-400", isStablecoin: false, logoURI: `${T}/maps.png` },
  { symbol: "OXY", name: "Oxygen", mint: "z3dn17yLaGMKffVogeFHQ9zWVcXgqgf3PQnDsNs2g6M", decimals: 6, color: "bg-purple-300", isStablecoin: false, logoURI: `${T}/oxy.png` },
  { symbol: "DUST", name: "DUST Protocol", mint: "DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ", decimals: 9, color: "bg-stone-500", isStablecoin: false, logoURI: `${T}/dust.png` },
  { symbol: "FORGE", name: "Forge", mint: "FoRGERiW7odcCBGU1bztZi16osPBHjxharvDathL5eds", decimals: 9, color: "bg-orange-500", isStablecoin: false, logoURI: `${T}/forge.png` },
  { symbol: "AURY", name: "Aurory", mint: "AURYydfxJib1ZkTir1Jn1J9ECYUtjb6rKQVmtYaixWPP", decimals: 9, color: "bg-yellow-500", isStablecoin: false, logoURI: `${T}/aury.png` },
  { symbol: "PORT", name: "Port Finance", mint: "PoRTjZMPXb9T7dyU7tpLEZRQj7e6ssfAE62j2oQuc6y", decimals: 6, color: "bg-blue-300", isStablecoin: false, logoURI: `${T}/port.png` },
  { symbol: "LIQ", name: "LIQ", mint: "4wjPQJ6PrkC4dHhYghwJzGBVP78DkBzA2U3kHoFNBuhj", decimals: 6, color: "bg-emerald-300", isStablecoin: false, logoURI: `${T}/liq.png` },
  { symbol: "SUNNY", name: "Sunny", mint: "SUNNYWgPQmFxe9wTZzNK7iPnJ3vYDrkgnxJRJm1s3ag", decimals: 6, color: "bg-yellow-300", isStablecoin: false, logoURI: `${T}/sunny.png` },
  { symbol: "SAMO", name: "Samoyedcoin", mint: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU", decimals: 9, color: "bg-orange-400", isStablecoin: false, logoURI: `${T}/samo.png` },
  { symbol: "SHDW", name: "Shadow Token", mint: "SHDWyBxihqiCj6YekG2GUr7wqKLeLAMK1gHZck9pL6y", decimals: 9, color: "bg-zinc-500", isStablecoin: false, logoURI: `${T}/shdw.png` },
  { symbol: "ATLAS", name: "Star Atlas", mint: "ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx", decimals: 8, color: "bg-indigo-300", isStablecoin: false, logoURI: `${T}/atlas.png` },
  { symbol: "POLIS", name: "Star Atlas DAO", mint: "poLisWXnNRwC6oBu1vHiuKQzFjGL4XDSu4g9qjz9qVk", decimals: 8, color: "bg-indigo-500", isStablecoin: false, logoURI: `${T}/polis.png` },
]

export const TOKEN_BY_MINT = new Map(MAINSTREAM_TOKENS.map(t => [t.mint, t]))
export const TOKEN_BY_SYMBOL = new Map(MAINSTREAM_TOKENS.map(t => [t.symbol, t]))
