"use client"

import { useState, useEffect, useRef } from "react"

interface HoverAvatarProps {
  src?: string | null
  fallback?: string
  size?: number
  className?: string
  fallbackClassName?: string
  index?: number
}

const FALLBACK_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='20' fill='%23312e81'/%3E%3Ccircle cx='20' cy='15' r='6' fill='%236366f1'/%3E%3Cellipse cx='20' cy='32' rx='10' ry='8' fill='%236366f1'/%3E%3C/svg%3E"

export function HoverAvatar({ src, fallback, size = 32, className = "", fallbackClassName = "", index = 0 }: HoverAvatarProps) {
  const [hovered, setHovered] = useState(false)
  const [popped, setPopped] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const px = `${size}px`
  const big = size * 2

  useEffect(() => {
    const el = containerRef.current
    if (!el || hasPlayed) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPlayed) {
          setHasPlayed(true)
          observer.disconnect()
          const delay = index * 150
          const t1 = setTimeout(() => setPopped(true), delay)
          const t2 = setTimeout(() => setPopped(false), delay + 400)
          return () => { clearTimeout(t1); clearTimeout(t2) }
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [index, hasPlayed])

  const show = hovered || popped

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null
    e.currentTarget.src = FALLBACK_SVG
  }

  const dimStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    backgroundColor: "rgba(0,0,0,0.8)",
    opacity: show ? 1 : 0,
    transition: "opacity 200ms ease-out",
    pointerEvents: "none",
    zIndex: 1,
  }

  const floatStyle: React.CSSProperties = {
    position: "absolute",
    width: `${big}px`,
    height: `${big}px`,
    minWidth: `${big}px`,
    minHeight: `${big}px`,
    maxWidth: `${big}px`,
    maxHeight: `${big}px`,
    aspectRatio: "1 / 1",
    top: "50%",
    left: "50%",
    marginTop: `-${big / 2}px`,
    marginLeft: `-${big / 2}px`,
    borderRadius: "50%",
    overflow: "hidden",
    opacity: show ? 1 : 0,
    transform: show ? "scale(1)" : "scale(0.5)",
    transition: "transform 300ms cubic-bezier(0.34,1.56,0.64,1), opacity 200ms ease-out",
    pointerEvents: "none",
    zIndex: 50,
    boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 2px rgba(255,255,255,0.1)",
  }

  return (
    <div
      ref={containerRef}
      className="relative shrink-0"
      style={{ width: px, height: px, minWidth: px, minHeight: px }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {src ? (
        <>
          <img
            src={src}
            alt=""
            className={`rounded-full object-cover ${className}`}
            style={{ width: px, height: px }}
            onError={handleError}
          />
          <div style={dimStyle} />
          <div style={floatStyle}>
            <img
              src={src}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", display: "block" }}
              onError={handleError}
            />
          </div>
        </>
      ) : (
        <>
          <div
            className={`rounded-full flex items-center justify-center text-xs font-bold ${fallbackClassName || "bg-neutral-800 text-neutral-400"}`}
            style={{ width: px, height: px }}
          >
            {(fallback || "?")[0].toUpperCase()}
          </div>
          <div style={dimStyle} />
          <div style={floatStyle}>
            <div
              className={`flex items-center justify-center font-bold ${fallbackClassName || "bg-neutral-800 text-neutral-400"}`}
              style={{ width: "100%", height: "100%", borderRadius: "50%", fontSize: `${big * 0.35}px` }}
            >
              {(fallback || "?")[0].toUpperCase()}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
