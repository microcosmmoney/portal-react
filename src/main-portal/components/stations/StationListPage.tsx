// AI-generated · AI-managed · AI-maintained
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { toast } from 'sonner'
import { useAuth } from '../../hooks/useAuth'
import { getCurrentUserToken } from '../../lib/auth-service'
import { HoverAvatar } from '../ui/hover-avatar'
import {
  getUnits,
  updateUnit,
  getUnitsSummary,
  getUnitDetailedStats,
} from '../../lib/api-service'
import type { Unit, UnitType } from '../../lib/types/api'
import type { UnitsSummary } from '../../lib/api/services'
import {
  Building2,
  Grid3x3,
  Map,
  Globe,
  Users,
  Vault,
  Zap,
  Search,
  Edit3,
  Loader2,
  Upload,
  ImageIcon,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
} from 'lucide-react'
import { useTranslations } from 'next-intl'

const getUnitTypeIcon = (type: UnitType, className: string = 'w-4 h-4') => {
  switch (type) {
    case 'station': return <Building2 className={className} />
    case 'matrix': return <Grid3x3 className={className} />
    case 'sector': return <Map className={className} />
    case 'system': return <Globe className={className} />
    default: return <Building2 className={className} />
  }
}

const getTechBonusPercentage = (type: UnitType): number => {
  switch (type) {
    case 'station': return 10
    case 'matrix': return 20
    case 'sector': return 30
    case 'system': return 40
    default: return 0
  }
}

const getMagistrateTitle = (type: UnitType): string => {
  switch (type) {
    case 'station': return 'Commander'
    case 'matrix': return 'Pioneer'
    case 'sector': return 'Warden'
    case 'system': return 'Admiral'
    default: return 'Magistrate'
  }
}

interface UnitDataCache {
  memberCount: number
  maxCapacity: number
  vaultBalance: number
  occupancyRate: number
}

const cropToSquare = (file: File, size: number): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      if (!ctx) { reject(new Error('Canvas not supported')); return }
      const side = Math.min(img.width, img.height)
      const sx = (img.width - side) / 2
      const sy = (img.height - side) / 2
      ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size)
      canvas.toBlob((blob) => {
        if (!blob) { reject(new Error('Blob creation failed')); return }
        resolve(new File([blob], file.name, { type: 'image/jpeg' }))
      }, 'image/jpeg', 0.85)
    }
    img.onerror = () => reject(new Error('Image load failed'))
    img.src = URL.createObjectURL(file)
  })
}

export default function StationListPage() {
  const t = useTranslations('stationList')
  const router = useRouter()
  const { isAdmin, user } = useAuth()
  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | UnitType>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const [unitDataCache, setUnitDataCache] = useState<Record<string, UnitDataCache>>({})
  const [summary, setSummary] = useState<UnitsSummary | null>(null)

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null)
  const [editFormData, setEditFormData] = useState({ unit_name: '', description: '' })
  const [submitting, setSubmitting] = useState(false)

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getUnitTypeLabel = (type: UnitType) => {
    switch (type) {
      case 'station': return t('station')
      case 'matrix': return t('matrix')
      case 'sector': return t('sector')
      case 'system': return t('system')
      default: return type
    }
  }

  const getImageStatusBadge = (status?: string) => {
    if (status === 'pending') return <Badge className="bg-yellow-400/20 text-yellow-400 text-[10px]"><Clock className="w-2.5 h-2.5 mr-0.5" />{t('reviewPending')}</Badge>
    if (status === 'rejected') return <Badge className="bg-red-400/20 text-red-400 text-[10px]"><XCircle className="w-2.5 h-2.5 mr-0.5" />{t('reviewRejected')}</Badge>
    return null
  }

  useEffect(() => { loadUnits(); loadSummary() }, [filter])

  const loadSummary = async () => {
    try {
      const response = await getUnitsSummary()
      if (response.success) {
        const flat = response as unknown as UnitsSummary & { success: boolean; data?: UnitsSummary }
        const summaryData: UnitsSummary = response.data || {
          total_stations: flat.total_stations,
          total_members: flat.total_members,
          total_vault_balance: flat.total_vault_balance,
          total_vault_mcd: flat.total_vault_mcd,
          avg_kpi_score: flat.avg_kpi_score,
          stations_by_type: flat.stations_by_type,
        }
        setSummary(summaryData)
      }
    } catch (error) {
      console.error('Failed to load summary:', error)
    }
  }

  const loadUnits = async () => {
    try {
      setLoading(true)
      const filterParam = filter === 'all' ? undefined : filter
      const response = await getUnits(filterParam)
      if (response.success && response.data) {
        setUnits(response.data)
        for (const unit of response.data) {
          loadUnitData(unit.unit_id)
        }
      } else {
        toast.error(t('loadFailed'))
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('loadFailed'))
    } finally {
      setLoading(false)
    }
  }

  const loadUnitData = async (unitId: string) => {
    try {
      const response = await getUnitDetailedStats(unitId)
      if (response.success && response.data) {
        const { metrics } = response.data
        setUnitDataCache(prev => ({
          ...prev,
          [unitId]: {
            memberCount: metrics.member_count,
            maxCapacity: metrics.max_capacity,
            vaultBalance: metrics.vault_mcd ?? 0,
            occupancyRate: metrics.occupancy_rate,
          },
        }))
      }
    } catch (error) {
      console.error(`Failed to load unit ${unitId} data:`, error)
    }
  }

  const filteredUnits = units.filter(unit => {
    const lowerSearch = searchTerm.toLowerCase()
    return unit.unit_name.toLowerCase().includes(lowerSearch) ||
      (unit.description?.toLowerCase().includes(lowerSearch)) ||
      (unit.location?.toLowerCase().includes(lowerSearch)) ||
      (unit.short_id?.toLowerCase().includes(lowerSearch)) ||
      (unit.full_path?.toLowerCase().includes(lowerSearch))
  })

  const canEditUnit = (unit: Unit): boolean => {
    if (isAdmin()) return true
    if (user?.uid && (unit.manager_uid === user.uid || unit.manager_id === user.uid)) return true
    return false
  }

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error(t('imageSelectError')); return }
    if (file.size > 2 * 1024 * 1024) { toast.error(t('imageSizeError')); return }
    cropToSquare(file, 512).then(cropped => {
      setImageFile(cropped)
      const reader = new FileReader()
      reader.onload = (ev) => setImagePreview(ev.target?.result as string)
      reader.readAsDataURL(cropped)
    }).catch(() => toast.error(t('imageProcessError')))
  }, [t])

  const handleImageUpload = async (unitId: string): Promise<boolean> => {
    if (!imageFile) return true
    setUploadingImage(true)
    try {
      const token = await getCurrentUserToken()
      if (!token) throw new Error(t('notLoggedIn'))
      const formData = new FormData()
      formData.append('image', imageFile, imageFile.name)
      const response = await fetch(`/api/territories/${unitId}/image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || t('imageUploadFailed'))
      }
      return true
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('imageUploadFailed'))
      return false
    } finally {
      setUploadingImage(false)
    }
  }

  const handleImageReview = async (unitId: string, status: 'approved' | 'rejected') => {
    try {
      const token = await getCurrentUserToken()
      if (!token) return
      const response = await fetch(`/api/territories/${unitId}/image/review`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (response.ok) {
        toast.success(status === 'approved' ? t('reviewSuccess') : t('reviewRejectSuccess'))
        loadUnits()
        if (editingUnit && editingUnit.unit_id === unitId) {
          setEditingUnit({ ...editingUnit, image_status: status })
        }
      } else {
        toast.error(t('reviewFailed'))
      }
    } catch {
      toast.error(t('reviewFailed'))
    }
  }

  const handleEdit = async () => {
    if (!editingUnit) return
    if (!editFormData.unit_name.trim()) { toast.error(t('unitNameRequired')); return }
    try {
      setSubmitting(true)
      if (imageFile) {
        const uploadOk = await handleImageUpload(editingUnit.unit_id)
        if (!uploadOk) { setSubmitting(false); return }
      }
      const response = await updateUnit(editingUnit.unit_id, {
        unit_name: editFormData.unit_name,
        description: editFormData.description,
      })
      if (response.success) {
        toast.success(t('updateSuccess'))
        setIsEditDialogOpen(false)
        setEditingUnit(null)
        setImageFile(null)
        setImagePreview(null)
        loadUnits()
      } else {
        toast.error(response.error || t('updateFailed'))
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('updateFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  const openEditDialog = (unit: Unit, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingUnit(unit)
    setEditFormData({
      unit_name: unit.unit_name,
      description: unit.description || '',
    })
    setImageFile(null)
    setImagePreview(null)
    setIsEditDialogOpen(true)
  }

  const handleCardClick = (unit: Unit) => {
    const urlId = unit.short_id || unit.territory_id || unit.unit_id
    router.push(`/user-system/territory/${urlId}`)
  }

  const getManagerDisplay = (unit: Unit) => {
    const title = getMagistrateTitle(unit.unit_type)
    if (unit.manager_wallet) {
      return { title, subtitle: unit.manager_display_name || t('magistrate'), avatar: unit.manager_avatar_url }
    }
    return { title, subtitle: t('foundation'), avatar: null }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      <span className="ml-2 text-neutral-400 text-sm">loading territories...</span>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6">
      <div>
        <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wider">{t('title')}</h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
          <CardContent className="p-3 sm:p-6">
            <div className="text-xs text-neutral-400 tracking-wider mb-1">total_territories</div>
            <div className="text-2xl font-bold text-white font-mono">{summary?.total_stations ?? 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
          <CardContent className="p-3 sm:p-6">
            <div className="text-xs text-neutral-400 tracking-wider mb-1">total_members</div>
            <div className="text-2xl font-bold text-white font-mono">{summary?.total_members ?? 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
          <CardContent className="p-3 sm:p-6">
            <div className="text-xs text-neutral-400 tracking-wider mb-1">total_vault_mcd</div>
            <div className="text-2xl font-bold text-white font-mono">{summary?.total_vault_mcd ?? 0} <span className="text-sm font-normal text-neutral-500">MCD</span></div>
          </CardContent>
        </Card>
        <Card className="bg-neutral-900 border-neutral-700 hover:border-cyan-400/50 dash-card">
          <CardContent className="p-3 sm:p-6">
            <div className="text-xs text-neutral-400 tracking-wider mb-1">avg_kpi</div>
            <div className="text-2xl font-bold text-white font-mono">{(summary?.avg_kpi_score ?? 0).toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-neutral-900 border-neutral-700 dash-card">
        <CardContent className="p-3 sm:p-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-600 text-white pl-10 px-3 py-2 rounded text-sm focus:border-cyan-400 focus:outline-none placeholder:text-neutral-400"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(['all', 'station', 'matrix', 'sector', 'system'] as const).map((f) => (
                <Button
                  key={f}
                  variant="outline"
                  size="sm"
                  onClick={() => setFilter(f)}
                  className={
                    filter === f
                      ? 'bg-cyan-700 hover:bg-cyan-600 text-white border-cyan-700'
                      : 'border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent'
                  }
                >
                  {f === 'all' ? t('filterAll') : getUnitTypeLabel(f)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-700 dash-card">
        <CardContent className="p-3 sm:p-6">
          {filteredUnits.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 text-sm">{t('noTerritories')}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUnits.map((unit) => {
                const unitData = unitDataCache[unit.unit_id]
                const memberCount = unitData?.memberCount ?? 0
                const vaultBalance = unitData?.vaultBalance ?? 0
                const techBonus = getTechBonusPercentage(unit.unit_type)
                const hasEditPermission = canEditUnit(unit)
                const occupancyRate = unitData?.occupancyRate ?? 0

                return (
                  <div
                    key={unit.unit_id}
                    onClick={() => handleCardClick(unit)}
                    className="flex flex-col border border-neutral-700 rounded-lg cursor-pointer hover:border-cyan-400/50 transition-all group"
                  >
                    <div className="relative flex-shrink-0 aspect-[4/3] overflow-hidden rounded-t-lg">
                      {unit.image_url ? (
                        <img
                          src={unit.image_url}
                          alt={unit.unit_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-neutral-800">
                          {getUnitTypeIcon(unit.unit_type, 'w-16 h-16 text-neutral-600')}
                        </div>
                      )}
                      {hasEditPermission && (
                        <button
                          onClick={(e) => openEditDialog(unit, e)}
                          className="absolute bottom-2 right-2 p-1.5 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-cyan-400 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="p-3 space-y-2 rounded-b-lg" style={{backgroundColor: '#0a0e14'}}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-300 border border-neutral-600 px-1.5 py-0.5 rounded">
                            {getUnitTypeLabel(unit.unit_type)}
                          </span>
                          <span className="text-xs text-neutral-300">
                            <Zap className="w-3 h-3 inline mr-0.5" />+{techBonus}%
                          </span>
                          {getImageStatusBadge(unit.image_status)}
                        </div>
                        {unit.short_id && (
                          <span className="text-xs text-neutral-400 font-mono">
                            {unit.short_id}
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="text-white text-sm font-bold">{unit.unit_name}</span>
                        {unit.full_path && (
                          <div className="text-xs text-neutral-500 truncate font-mono">{unit.full_path}</div>
                        )}
                      </div>

                      <div className="text-xs text-neutral-400 line-clamp-2">
                        {unit.description || t('noDescription')}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-neutral-700 text-xs">
                        <div className="flex items-center gap-1 text-neutral-400">
                          <Users className="w-3 h-3" />
                          <span className="text-white font-mono">{memberCount}</span>
                          <span className="text-neutral-500">members</span>
                        </div>
                        <div className="flex items-center gap-1 text-neutral-400">
                          <Vault className="w-3 h-3" />
                          <span className="text-white font-mono">{vaultBalance.toLocaleString()}</span>
                          <span className="text-neutral-500">MCD</span>
                        </div>
                        <div className="text-neutral-400 font-mono">
                          {occupancyRate.toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={(open) => { setIsEditDialogOpen(open); if (!open) { setEditingUnit(null); setImageFile(null); setImagePreview(null) } }}>
        <DialogContent className="bg-neutral-900 border-neutral-700 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white tracking-wider">{t('editTitle')}</DialogTitle>
            <DialogDescription className="text-neutral-400" asChild>
              <div>
                {editingUnit && (
                  <span className="text-xs font-mono mt-1 block">
                    {getUnitTypeLabel(editingUnit.unit_type)} {t('coordinate')}: {editingUnit.full_path || editingUnit.short_id || editingUnit.territory_id}
                  </span>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>

          {editingUnit && (
            <div className="space-y-4 py-2">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 flex flex-col items-center justify-center self-center space-y-1.5">
                  <div
                    className="w-28 h-28 rounded border border-neutral-700 bg-neutral-800 overflow-hidden cursor-pointer hover:border-cyan-400/50 transition-colors relative group/img"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {(imagePreview || editingUnit.image_url) ? (
                      <>
                        <img src={imagePreview || editingUnit.image_url} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload className="w-5 h-5 text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 gap-1">
                        <ImageIcon className="w-6 h-6" />
                        <span className="text-[10px]">{t('clickToUpload')}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-[10px] text-neutral-500 text-center">512x512 &middot; &le;2MB</div>
                  {!isAdmin() && <div className="text-[10px] text-yellow-400/80 text-center">{t('needsReview')}</div>}
                  <div className="flex items-center justify-center gap-1 flex-wrap">
                    {editingUnit.image_status && editingUnit.image_status !== 'approved' && getImageStatusBadge(editingUnit.image_status)}
                    {editingUnit.image_status === 'approved' && editingUnit.image_url && (
                      <Badge className="bg-green-400/20 text-green-400 text-[10px]"><CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />{t('approved')}</Badge>
                    )}
                    {imageFile && <Badge className="bg-cyan-400/20 text-cyan-400 text-[10px]">{t('newImage')}</Badge>}
                  </div>
                  {isAdmin() && editingUnit.image_status === 'pending' && !imageFile && (
                    <div className="flex gap-1 justify-center">
                      <Button size="sm" className="h-5 text-[10px] bg-green-700 hover:bg-green-600 text-white px-1.5" onClick={() => handleImageReview(editingUnit.unit_id, 'approved')}>
                        <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />{t('approve')}
                      </Button>
                      <Button size="sm" className="h-5 text-[10px] bg-red-700 hover:bg-red-600 text-white px-1.5" onClick={() => handleImageReview(editingUnit.unit_id, 'rejected')}>
                        <XCircle className="w-2.5 h-2.5 mr-0.5" />{t('reject')}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-3 min-w-0">
                  <div>
                    <div className="text-xs text-neutral-400 tracking-wider mb-1">unit_name *</div>
                    <input
                      value={editFormData.unit_name}
                      onChange={(e) => setEditFormData({ ...editFormData, unit_name: e.target.value })}
                      className="w-full bg-neutral-800 border border-neutral-600 text-white px-3 py-2 rounded text-sm focus:border-cyan-400 focus:outline-none"
                    />
                    <div className="text-[10px] text-neutral-500 mt-1">{t('nameChangeHint')}</div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-400 tracking-wider mb-1">description</div>
                    <textarea
                      value={editFormData.description}
                      onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                      rows={3}
                      className="w-full bg-neutral-800 border border-neutral-600 text-white px-3 py-2 rounded text-sm focus:border-cyan-400 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileSelect} className="hidden" />

              <div className="flex items-center gap-3 p-3 rounded bg-neutral-800/50 border border-neutral-700">
                {(() => {
                  const mgr = getManagerDisplay(editingUnit)
                  return (
                    <>
                      <HoverAvatar src={mgr.avatar} fallback={mgr.title} size={32} fallbackClassName="bg-cyan-400/20 text-cyan-400" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white truncate">{mgr.title}</div>
                        <div className="text-xs text-neutral-500">{mgr.subtitle}</div>
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
              onClick={() => { setIsEditDialogOpen(false); setEditingUnit(null); setImageFile(null); setImagePreview(null) }}
              disabled={submitting || uploadingImage}
            >
              {t('cancel')}
            </Button>
            <Button
              size="sm"
              onClick={handleEdit}
              disabled={submitting || uploadingImage}
              className="bg-cyan-700 hover:bg-cyan-600 text-white"
            >
              {(submitting || uploadingImage) ? t('saving') : t('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
