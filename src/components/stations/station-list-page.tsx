'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useMicrocosmApi, useMicrocosmContext } from '@microcosmmoney/auth-react'
import { TerminalCard } from '../terminal'

const API_BASE = 'https://api.microcosm.money/v1'

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

type UnitType = 'station' | 'matrix' | 'sector' | 'system'

interface Unit {
  unit_id: string
  unit_name: string
  unit_type: UnitType
  description?: string
  location?: string
  short_id?: string
  full_path?: string
  manager_uid?: string
  manager_id?: string
  image_url?: string
  image_status?: 'pending' | 'approved' | 'rejected'
}

interface UnitsSummary {
  total_stations?: number
  total_members?: number
  total_vault_balance?: number
  total_vault_mcd?: number
  avg_kpi_score?: number
  stations_by_type?: Record<UnitType, number>
}

interface UnitMetrics {
  member_count: number
  max_capacity: number
  vault_mcd?: number
  occupancy_rate: number
}

const UNIT_LABELS: Record<UnitType, string> = { station: 'Station', matrix: 'Matrix', sector: 'Sector', system: 'System' }
const MAGISTRATE_TITLES: Record<UnitType, string> = { station: 'Commander', matrix: 'Pioneer', sector: 'Warden', system: 'Admiral' }

export interface MicrocosmStationListPageProps {
  basePath?: string
  onNavigate?: (path: string) => void
  currentUid?: string
  isAdmin?: boolean
}

export function MicrocosmStationListPage({ currentUid, isAdmin = false }: MicrocosmStationListPageProps = {}) {
  const api = useMicrocosmApi()
  const { getAccessToken } = useMicrocosmContext()
  const [units, setUnits] = useState<Unit[]>([])
  const [summary, setSummary] = useState<UnitsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<UnitType | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [unitDataCache, setUnitDataCache] = useState<Record<string, UnitMetrics>>({})
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null)
  const [editFormData, setEditFormData] = useState({ unit_name: '', description: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadSummary = useCallback(async () => {
    try {
      const res = await api.get<{ success: boolean; data: UnitsSummary }>('/territories/summary')
      setSummary(res?.data ?? (res as any))
    } catch {}
  }, [api])

  const loadUnits = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = filter !== 'all' ? `?unit_type=${filter}` : ''
      const res = await api.get<{ success: boolean; data: Unit[] }>(`/territories${params}`)
      const list = res?.data ?? (res as any) ?? []
      setUnits(Array.isArray(list) ? list : [])
      for (const unit of list) {
        loadUnitData(unit.unit_id)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load units')
    } finally {
      setLoading(false)
    }
  }, [api, filter])

  const loadUnitData = async (unitId: string) => {
    try {
      const res = await api.get<{ success: boolean; data: { metrics: UnitMetrics } }>(`/territories/${unitId}/detailed-stats`)
      const metrics = res?.data?.metrics
      if (metrics) {
        setUnitDataCache(prev => ({ ...prev, [unitId]: metrics }))
      }
    } catch {}
  }

  useEffect(() => { loadUnits(); loadSummary() }, [loadUnits, loadSummary])

  const filteredUnits = units.filter(unit => {
    const q = searchTerm.toLowerCase()
    if (!q) return true
    return (
      unit.unit_name?.toLowerCase().includes(q) ||
      unit.description?.toLowerCase().includes(q) ||
      unit.location?.toLowerCase().includes(q) ||
      unit.short_id?.toLowerCase().includes(q) ||
      unit.full_path?.toLowerCase().includes(q)
    )
  })

  const canEditUnit = (unit: Unit): boolean => {
    if (!currentUid) return false
    return unit.manager_uid === currentUid || unit.manager_id === currentUid
  }

  const openEditDialog = (unit: Unit) => {
    setEditingUnit(unit)
    setEditFormData({ unit_name: unit.unit_name, description: unit.description || '' })
    setImageFile(null)
    setImagePreview(null)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Please select an image file'); return }
    if (file.size > 2 * 1024 * 1024) { setError('Image must be under 2MB'); return }
    cropToSquare(file, 512)
      .then(cropped => {
        setImageFile(cropped)
        const reader = new FileReader()
        reader.onload = (ev) => setImagePreview(ev.target?.result as string)
        reader.readAsDataURL(cropped)
      })
      .catch(() => setError('Image processing failed'))
  }

  const uploadImage = async (unitId: string): Promise<boolean> => {
    if (!imageFile) return true
    setUploadingImage(true)
    try {
      const token = await getAccessToken()
      if (!token) throw new Error('Not authenticated')
      const formData = new FormData()
      formData.append('image', imageFile, imageFile.name)
      const response = await fetch(`${API_BASE}/territories/${unitId}/image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.detail || err.error || 'Image upload failed')
      }
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Image upload failed')
      return false
    } finally {
      setUploadingImage(false)
    }
  }

  const handleImageReview = async (unitId: string, status: 'approved' | 'rejected') => {
    try {
      await api.put(`/territories/${unitId}/image/review`, { status })
      await loadUnits()
      if (editingUnit && editingUnit.unit_id === unitId) {
        setEditingUnit({ ...editingUnit, image_status: status })
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Review failed')
    }
  }

  const handleEdit = async () => {
    if (!editingUnit || !editFormData.unit_name.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      if (imageFile) {
        const ok = await uploadImage(editingUnit.unit_id)
        if (!ok) { setSubmitting(false); return }
      }
      await api.put(`/territories/${editingUnit.unit_id}`, {
        unit_name: editFormData.unit_name,
        description: editFormData.description,
      })
      setEditingUnit(null)
      setImageFile(null)
      setImagePreview(null)
      await loadUnits()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update unit')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-3 py-4 space-y-3 xs:px-4 xs:space-y-4 sm:px-6 sm:py-6 sm:space-y-6 font-mono">
      <div>
        <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wider">Station List</h1>
        <p className="text-xs sm:text-sm text-neutral-400">All territories (Station / Matrix / Sector / System)</p>
      </div>

      {error && (
        <div className="p-3 bg-red-900/20 border border-red-800 rounded text-sm text-red-300">{error}</div>
      )}

      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <TerminalCard>
            <div className="text-xs text-[#5EEAD4] tracking-widest uppercase mb-1">TOTAL STATIONS</div>
            <div className="text-2xl font-bold text-white">{summary.total_stations ?? 0}</div>
          </TerminalCard>
          <TerminalCard>
            <div className="text-xs text-[#5EEAD4] tracking-widest uppercase mb-1">TOTAL MEMBERS</div>
            <div className="text-2xl font-bold text-cyan-400">{summary.total_members ?? 0}</div>
          </TerminalCard>
          <TerminalCard>
            <div className="text-xs text-[#5EEAD4] tracking-widest uppercase mb-1">VAULT MCD</div>
            <div className="text-2xl font-bold text-cyan-400">
              {(summary.total_vault_mcd ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </TerminalCard>
          <TerminalCard>
            <div className="text-xs text-[#5EEAD4] tracking-widest uppercase mb-1">AVG KPI</div>
            <div className="text-2xl font-bold text-white">{(summary.avg_kpi_score ?? 0).toFixed(1)}</div>
          </TerminalCard>
        </div>
      )}

      <TerminalCard>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex gap-2 flex-wrap">
            {(['all', 'station', 'matrix', 'sector', 'system'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  filter === f ? 'bg-cyan-700 text-white' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
                }`}
              >
                {f === 'all' ? 'All' : UNIT_LABELS[f as UnitType]}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name / location / short_id..."
            className="flex-1 bg-neutral-800 border border-neutral-600 text-white rounded px-3 py-1.5 text-sm focus:outline-none focus:border-cyan-400"
          />
        </div>
      </TerminalCard>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="text-neutral-400">Loading units...</span>
        </div>
      ) : filteredUnits.length === 0 ? (
        <TerminalCard>
          <div className="text-center py-8 text-neutral-500">No units match your filter</div>
        </TerminalCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUnits.map(unit => {
            const metrics = unitDataCache[unit.unit_id]
            return (
              <TerminalCard key={unit.unit_id}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-white font-semibold">{unit.unit_name}</div>
                    <div className="text-xs text-neutral-500">
                      {UNIT_LABELS[unit.unit_type]} · {MAGISTRATE_TITLES[unit.unit_type]}
                    </div>
                    {unit.short_id && (
                      <div className="text-xs font-mono text-cyan-400 mt-1">{unit.short_id}</div>
                    )}
                  </div>
                  {canEditUnit(unit) && (
                    <button
                      onClick={() => openEditDialog(unit)}
                      className="text-xs px-2 py-1 border border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded"
                    >
                      Edit
                    </button>
                  )}
                </div>
                {unit.description && (
                  <div className="text-xs text-neutral-400 mb-3 line-clamp-2">{unit.description}</div>
                )}
                {metrics && (
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-neutral-700">
                    <div>
                      <div className="text-xs text-neutral-500">Members</div>
                      <div className="text-sm text-white">{metrics.member_count}/{metrics.max_capacity}</div>
                    </div>
                    <div>
                      <div className="text-xs text-neutral-500">Occupancy</div>
                      <div className="text-sm text-cyan-400">{(metrics.occupancy_rate * 100).toFixed(0)}%</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs text-neutral-500">Vault MCD</div>
                      <div className="text-sm text-white">
                        {(metrics.vault_mcd ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                  </div>
                )}
                {unit.image_status === 'pending' && (
                  <div className="mt-2 text-xs text-yellow-400">Image pending review</div>
                )}
              </TerminalCard>
            )
          })}
        </div>
      )}

      {editingUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setEditingUnit(null)}>
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-medium">Edit {editingUnit.unit_name}</h3>

            <div>
              <label className="text-xs text-[#5EEAD4] tracking-widest uppercase block mb-1">Name</label>
              <input
                type="text"
                value={editFormData.unit_name}
                onChange={(e) => setEditFormData({ ...editFormData, unit_name: e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-600 text-white rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-[#5EEAD4] tracking-widest uppercase block mb-1">Description</label>
              <textarea
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                rows={4}
                className="w-full bg-neutral-800 border border-neutral-600 text-white rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-[#5EEAD4] tracking-widest uppercase block mb-1">Image</label>
              <div className="flex items-start gap-3">
                {(imagePreview || editingUnit.image_url) ? (
                  <img
                    src={imagePreview || editingUnit.image_url}
                    alt=""
                    className="w-24 h-24 rounded object-cover border border-neutral-700"
                  />
                ) : (
                  <div className="w-24 h-24 rounded bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs text-neutral-500">
                    No image
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="w-full px-3 py-1.5 border border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white rounded text-sm"
                  >
                    {imageFile ? 'Change' : 'Select image'}
                  </button>
                  {imageFile && (
                    <div className="text-xs text-neutral-500">
                      {imageFile.name} ({(imageFile.size / 1024).toFixed(1)}KB)
                    </div>
                  )}
                  {editingUnit.image_status && (
                    <div
                      className={`text-xs px-2 py-0.5 rounded inline-block ${
                        editingUnit.image_status === 'approved'
                          ? 'bg-green-900/30 text-green-400'
                          : editingUnit.image_status === 'rejected'
                          ? 'bg-red-900/30 text-red-400'
                          : 'bg-yellow-900/30 text-yellow-400'
                      }`}
                    >
                      {editingUnit.image_status}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Max 2MB. Auto-cropped to square (512×512). JPG/PNG/WebP.
              </p>
            </div>

            {isAdmin && editingUnit.image_url && editingUnit.image_status === 'pending' && (
              <div className="pt-3 border-t border-neutral-700 space-y-2">
                <div className="text-xs text-cyan-400 tracking-wider">ADMIN REVIEW</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleImageReview(editingUnit.unit_id, 'approved')}
                    className="flex-1 px-3 py-1.5 bg-green-900/30 text-green-400 hover:bg-green-900/50 border border-green-800 rounded text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleImageReview(editingUnit.unit_id, 'rejected')}
                    className="flex-1 px-3 py-1.5 bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-red-800 rounded text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setEditingUnit(null)
                  setImageFile(null)
                  setImagePreview(null)
                }}
                className="flex-1 px-3 py-2 border border-neutral-700 text-neutral-400 hover:bg-neutral-800 rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={submitting || uploadingImage || !editFormData.unit_name.trim()}
                className="flex-1 px-3 py-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded text-sm disabled:opacity-50"
              >
                {uploadingImage ? 'Uploading...' : submitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
