// AI-generated · AI-managed · AI-maintained
"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { cn } from "../../lib/utils"
import { Globe, Map as MapIcon, Grid3x3, Building2, CircleDashed, Users, GripVertical } from "lucide-react"

interface DiagramNodeProps {
  id: string
  label: string
  sublabel?: string
  type: "system" | "sector" | "matrix" | "station" | "empty" | "team"
  x: number
  y: number
  system: string
  isSelected: boolean
  isConnected: boolean
  isHovered: boolean
  onSelect: () => void
  onHover: (hovered: boolean) => void
  onDrag: (nodeId: string, x: number, y: number) => void
}

const typeConfig = {
  system: {
    icon: Globe,
    className: "border-purple-500/50 bg-purple-500/10 text-purple-400 shadow-purple-500/20",
    glowColor: "shadow-purple-500/50",
  },
  sector: {
    icon: MapIcon,
    className: "border-blue-500/50 bg-blue-500/5 text-blue-400 shadow-blue-500/20",
    glowColor: "shadow-blue-500/50",
  },
  matrix: {
    icon: Grid3x3,
    className: "border-cyan-500/50 bg-cyan-500/5 text-cyan-400 shadow-cyan-500/20",
    glowColor: "shadow-cyan-500/50",
  },
  station: {
    icon: Building2,
    className: "border-emerald-500/50 bg-emerald-500/5 text-emerald-400 shadow-emerald-500/20",
    glowColor: "shadow-emerald-500/50",
  },
  empty: {
    icon: CircleDashed,
    className: "border-dashed border-zinc-500/50 bg-zinc-500/5 text-zinc-400 shadow-zinc-500/20",
    glowColor: "shadow-zinc-500/50",
  },
  team: {
    icon: Users,
    className: "border-orange-500/50 bg-orange-500/5 text-orange-400 shadow-orange-500/20",
    glowColor: "shadow-orange-500/50",
  },
}

export function DiagramNode({
  id,
  label,
  sublabel,
  type,
  x,
  y,
  isSelected,
  isConnected,
  isHovered,
  onSelect,
  onHover,
  onDrag,
}: DiagramNodeProps) {
  const config = typeConfig[type]
  const Icon = config.icon
  const [isDragging, setIsDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const nodeRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()

    setIsDragging(true)
    dragOffset.current = {
      x: e.clientX - x,
      y: e.clientY - y,
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation()
    const touch = e.touches[0]
    setIsDragging(true)
    dragOffset.current = {
      x: touch.clientX - x,
      y: touch.clientY - y,
    }
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragOffset.current.x
      const newY = e.clientY - dragOffset.current.y
      onDrag(id, Math.max(0, newX), Math.max(0, newY))
    }

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      const newX = touch.clientX - dragOffset.current.x
      const newY = touch.clientY - dragOffset.current.y
      onDrag(id, Math.max(0, newX), Math.max(0, newY))
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    const handleTouchEnd = () => {
      setIsDragging(false)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("touchmove", handleTouchMove, { passive: false })
    document.addEventListener("touchend", handleTouchEnd)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isDragging, id, onDrag])

  return (
    <div
      ref={nodeRef}
      className={cn(
        "absolute transition-all duration-300 ease-out select-none",
        "w-[120px]",
        isDragging && "cursor-grabbing z-50 transition-none",
        !isDragging && "cursor-grab",
      )}
      style={{ left: x, top: y }}
      onClick={(e) => {
        if (!isDragging) {
          e.stopPropagation()
          onSelect()
        }
      }}
      onMouseEnter={() => !isDragging && onHover(true)}
      onMouseLeave={() => !isDragging && onHover(false)}
    >
      <div
        className={cn(
          "relative p-3 rounded-lg border-2 backdrop-blur-sm",
          "transition-all duration-300",
          config.className,
          (isSelected || isHovered || isDragging) && ["scale-110 z-20", "shadow-lg", config.glowColor],
          isConnected && !isHovered && "opacity-100",
          !isConnected && !isHovered && !isSelected && "opacity-60",
          isDragging && "ring-2 ring-white/30",
        )}
      >
        <div
          className="absolute -top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 p-1 rounded bg-background/80 border border-border/50 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{ opacity: isHovered || isDragging ? 1 : 0 }}
        >
          <GripVertical className="w-3 h-3 text-muted-foreground" />
        </div>

        {isSelected && <div className="absolute inset-0 rounded-lg border-2 border-current animate-ping opacity-30" />}

        <div onMouseDown={handleMouseDown} onTouchStart={handleTouchStart}>
          <div className="flex justify-center mb-2">
            <Icon className="w-6 h-6" />
          </div>

          <div className="text-center">
            <div className="text-xs font-medium truncate">{label}</div>
            {sublabel && <div className="text-[10px] opacity-70 truncate">{sublabel}</div>}
          </div>
        </div>

        {(isSelected || isHovered) && !isDragging && (
          <>
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-current animate-pulse" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-current animate-pulse" />
            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 rounded-full bg-current animate-pulse" />
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 rounded-full bg-current animate-pulse" />
          </>
        )}
      </div>
    </div>
  )
}
