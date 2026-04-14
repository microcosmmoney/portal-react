// AI-generated · AI-managed · AI-maintained
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Skeleton } from '../ui/skeleton'
import { Input } from '../ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog'
import {
  RefreshCw,
  Search,
  Building2,
  Grid3x3,
  Map,
  Globe,
  Image,
  ExternalLink,
  Copy,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'
import {
  getTerritoryNftCollection,
  getUserTerritoryNfts,
  getTerritoryNftMetadata,
} from '../../lib/api/services'
import type { TerritoryNftCollection, TerritoryNftMetadata } from '../../lib/types/api'
import { useTranslations } from 'next-intl'

const getNftTypeIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'station': return <Building2 className="w-5 h-5" />
    case 'matrix': return <Grid3x3 className="w-5 h-5" />
    case 'sector': return <Map className="w-5 h-5" />
    case 'system': return <Globe className="w-5 h-5" />
    default: return <Image className="w-5 h-5" />
  }
}

const getNftTypeColor = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'station': return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30'
    case 'matrix': return 'bg-cyan-400/20 text-cyan-300 border-cyan-400/30'
    case 'sector': return 'bg-cyan-400/10 text-cyan-200 border-cyan-300/30'
    case 'system': return 'bg-cyan-400/20 text-cyan-400 border-cyan-400/30'
    default: return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30'
  }
}

function truncateAddress(address: string, start = 4, end = 4): string {
  if (!address) return ''
  if (address.length <= start + end) return address
  return `${address.slice(0, start)}...${address.slice(-end)}`
}

function NFTCard({ nft, onClick, getNftTypeLabel }: { nft: TerritoryNftMetadata; onClick: () => void; getNftTypeLabel: (type: string) => string }) {
  return (
    <Card
      className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 cursor-pointer dash-card"
      onClick={onClick}
    >
      <CardContent className="p-4">
        {}
        <div className="aspect-square bg-neutral-800 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
          {nft.image ? (
            <img
              src={nft.image}
              alt={nft.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-neutral-600">
              {getNftTypeIcon(nft.nft_type)}
              <span className="text-xs mt-1">No Image</span>
            </div>
          )}
        </div>

        {}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white truncate">{nft.name}</h3>
            <Badge className={getNftTypeColor(nft.nft_type)}>
              {getNftTypeLabel(nft.nft_type)}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="truncate">Unit: {nft.unit_id}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="truncate font-mono">{truncateAddress(nft.mint, 8, 8)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function TerritoryNFTBrowser() {
  const t = useTranslations('territoryDash')
  const { user } = useAuth()

  const [collection, setCollection] = useState<TerritoryNftCollection | null>(null)
  const [myNfts, setMyNfts] = useState<TerritoryNftMetadata[]>([])
  const [searchResults, setSearchResults] = useState<TerritoryNftMetadata[]>([])

  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNft, setSelectedNft] = useState<TerritoryNftMetadata | null>(null)
  const [showNftDetail, setShowNftDetail] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  const getNftTypeLabel = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'station': return t('station')
      case 'matrix': return t('matrix')
      case 'sector': return t('sector')
      case 'system': return t('system')
      default: return type
    }
  }

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = async () => {
    try {
      setLoading(true)

      const [collectionRes, myNftsRes] = await Promise.all([
        getTerritoryNftCollection(),
        user ? getUserTerritoryNfts() : Promise.resolve({ success: true, data: [] })
      ])

      if (collectionRes.success && collectionRes.data) {
        setCollection(collectionRes.data)
      }

      if (myNftsRes.success && myNftsRes.data) {
        const nftsData = myNftsRes.data as TerritoryNftMetadata[] | { nfts: TerritoryNftMetadata[] }
        if (Array.isArray(nftsData)) {
          setMyNfts(nftsData)
        } else if (nftsData.nfts && Array.isArray(nftsData.nfts)) {
          setMyNfts(nftsData.nfts)
        } else {
          setMyNfts([])
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error)
      toast.error(t('loadFailed'))
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
    toast.success(t('refreshed'))
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      setSearching(true)
      const result = await getTerritoryNftMetadata(searchQuery.trim())

      if (result.success && result.data) {
        setSearchResults([result.data])
      } else {
        setSearchResults([])
        toast.info(t('nftNotFound'))
      }
    } catch (error) {
      console.error('Search failed:', error)
      toast.error(t('searchFailed'))
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopiedAddress(address)
    setTimeout(() => setCopiedAddress(null), 2000)
    toast.success(t('addressCopied'))
  }

  const openNftDetail = (nft: TerritoryNftMetadata) => {
    setSelectedNft(nft)
    setShowNftDetail(true)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('title')}</h1>
          <p className="text-neutral-400 text-sm mt-1">{t('subtitle')}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="border-neutral-700 text-neutral-300"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {t('refresh')}
        </Button>
      </div>

      {}
      {collection && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-neutral-900 border-neutral-700 dash-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-neutral-400" />
                <span className="text-sm text-neutral-400">{t('station')}</span>
              </div>
              <p className="text-2xl font-bold text-white font-mono">{collection.station_count}</p>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-700 dash-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Grid3x3 className="w-4 h-4 text-cyan-300" />
                <span className="text-sm text-neutral-400">{t('matrix')}</span>
              </div>
              <p className="text-2xl font-bold text-white font-mono">{collection.matrix_count}</p>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-700 dash-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Map className="w-4 h-4 text-cyan-300" />
                <span className="text-sm text-neutral-400">{t('sector')}</span>
              </div>
              <p className="text-2xl font-bold text-white font-mono">{collection.sector_count}</p>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-700 dash-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Image className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-neutral-400">{t('totalMinted')}</span>
              </div>
              <p className="text-2xl font-bold text-white font-mono">{collection.total_minted}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {}
      <Card className="bg-neutral-900 border-neutral-700 dash-card">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="bg-neutral-800 border-neutral-700 text-white"
            />
            <Button
              onClick={handleSearch}
              disabled={searching || !searchQuery.trim()}
              className="bg-neutral-800 hover:bg-neutral-700 text-white"
            >
              {searching ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>

          {}
          {searchResults.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm text-neutral-400 mb-2">{t('searchResults')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((nft) => (
                  <NFTCard key={nft.mint} nft={nft} onClick={() => openNftDetail(nft)} getNftTypeLabel={getNftTypeLabel} />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {}
      <Tabs defaultValue="my-nfts" className="w-full">
        <TabsList className="bg-neutral-900 border-neutral-700">
          <TabsTrigger value="my-nfts">{t('myNfts', { count: myNfts.length })}</TabsTrigger>
          <TabsTrigger value="all">{t('allNfts')}</TabsTrigger>
        </TabsList>

        <TabsContent value="my-nfts" className="mt-4">
          {myNfts.length === 0 ? (
            <Card className="bg-neutral-900 border-neutral-700 dash-card">
              <CardContent className="p-8 text-center">
                <Image className="w-12 h-12 mx-auto mb-4 text-neutral-600" />
                <p className="text-neutral-400">{t('noNfts')}</p>
                <p className="text-xs text-neutral-500 mt-1">{t('noNftsHint')}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {myNfts.map((nft) => (
                <NFTCard key={nft.mint} nft={nft} onClick={() => openNftDetail(nft)} getNftTypeLabel={getNftTypeLabel} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-4">
          <Card className="bg-neutral-900 border-neutral-700 dash-card">
            <CardContent className="p-8 text-center">
              <Search className="w-12 h-12 mx-auto mb-4 text-neutral-600" />
              <p className="text-neutral-400">{t('useSearch')}</p>
              <p className="text-xs text-neutral-500 mt-1">{t('useSearchHint')}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {}
      <Dialog open={showNftDetail} onOpenChange={setShowNftDetail}>
        <DialogContent className="bg-neutral-900 border-neutral-700 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">{selectedNft?.name}</DialogTitle>
            <DialogDescription className="text-neutral-400">
              {t('nftDetails')}
            </DialogDescription>
          </DialogHeader>

          {selectedNft && (
            <div className="space-y-4">
              {}
              <div className="aspect-square bg-neutral-800 rounded-lg flex items-center justify-center overflow-hidden">
                {selectedNft.image ? (
                  <img
                    src={selectedNft.image}
                    alt={selectedNft.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-neutral-600">
                    {getNftTypeIcon(selectedNft.nft_type)}
                    <span className="text-sm mt-2">No Image</span>
                  </div>
                )}
              </div>

              {}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 text-sm">{t('type')}</span>
                  <Badge className={getNftTypeColor(selectedNft.nft_type)}>
                    {getNftTypeLabel(selectedNft.nft_type)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 text-sm">{t('unitId')}</span>
                  <span className="text-white font-mono text-sm">{selectedNft.unit_id}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 text-sm">Symbol</span>
                  <span className="text-white font-mono text-sm">{selectedNft.symbol}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 text-sm">{t('mintAddress')}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono text-xs">{truncateAddress(selectedNft.mint, 8, 8)}</span>
                    <button
                      onClick={() => copyAddress(selectedNft.mint)}
                      className="text-neutral-400 hover:text-white"
                    >
                      {copiedAddress === selectedNft.mint ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 text-sm">{t('owner')}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono text-xs">{truncateAddress(selectedNft.owner, 8, 8)}</span>
                    <button
                      onClick={() => copyAddress(selectedNft.owner)}
                      className="text-neutral-400 hover:text-white"
                    >
                      {copiedAddress === selectedNft.owner ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {selectedNft.created_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 text-sm">{t('createdAt')}</span>
                    <span className="text-white text-sm">
                      {new Date(selectedNft.created_at * 1000).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-neutral-700 text-neutral-300"
                  onClick={() => window.open(`https://solscan.io/account/${selectedNft.mint}`, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Solana Explorer
                </Button>
                {selectedNft.uri && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-neutral-700 text-neutral-300"
                    onClick={() => window.open(selectedNft.uri, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Metadata
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
