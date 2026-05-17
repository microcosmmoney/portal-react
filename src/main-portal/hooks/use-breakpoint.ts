// AI-generated · AI-managed · AI-maintained
"use client"

import { useState, useEffect, useCallback } from "react"

/**
 * 9-Tier Responsive Breakpoint System
 * Matches globals.css @theme breakpoint definitions exactly
 */
export const BREAKPOINTS = {
  "3xs": 320,
  "2xs": 360,
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
  "3xl": 1920,
} as const

export type BreakpointKey = keyof typeof BREAKPOINTS

const BREAKPOINT_ORDER: BreakpointKey[] = [
  "3xs", "2xs", "xs", "sm", "md", "lg", "xl", "2xl", "3xl",
]

/**
 * Returns the current active breakpoint name based on window width.
 * Uses min-width (mobile-first): returns the largest breakpoint that fits.
 * Below 320px returns "base".
 */
function getActiveBreakpoint(width: number): BreakpointKey | "base" {
  for (let i = BREAKPOINT_ORDER.length - 1; i >= 0; i--) {
    if (width >= BREAKPOINTS[BREAKPOINT_ORDER[i]]) {
      return BREAKPOINT_ORDER[i]
    }
  }
  return "base"
}

/**
 * Comprehensive breakpoint hook for responsive JS logic.
 *
 * Usage:
 *   const { current, isAbove, isBelow, isBetween, width } = useBreakpoint()
 *   if (isAbove("md")) { ... }  // >= 768px
 *   if (isBelow("sm")) { ... }  // < 640px
 *   if (isBetween("xs", "lg")) { ... }  // >= 475px && < 1024px
 */
export function useBreakpoint() {
  const [width, setWidth] = useState(0)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
    setWidth(window.innerWidth)

    let rafId: number
    const handleResize = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        setWidth(window.innerWidth)
      })
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(rafId)
    }
  }, [])

  const isAbove = useCallback(
    (bp: BreakpointKey) => width >= BREAKPOINTS[bp],
    [width]
  )

  const isBelow = useCallback(
    (bp: BreakpointKey) => width < BREAKPOINTS[bp],
    [width]
  )

  const isBetween = useCallback(
    (min: BreakpointKey, max: BreakpointKey) =>
      width >= BREAKPOINTS[min] && width < BREAKPOINTS[max],
    [width]
  )

  const current = hasMounted ? getActiveBreakpoint(width) : "md"

  return {
    /** Current active breakpoint name */
    current,
    /** True if width >= given breakpoint */
    isAbove,
    /** True if width < given breakpoint */
    isBelow,
    /** True if width >= min and < max */
    isBetween,
    /** Raw viewport width in px */
    width: hasMounted ? width : 0,
    /** False during SSR / before hydration */
    hasMounted,
    /** Legacy compat: true when < md (768px) */
    isMobile: hasMounted ? width < BREAKPOINTS.md : false,
    /** true when < xs (475px) \u2014 small phones */
    isSmallPhone: hasMounted ? width < BREAKPOINTS.xs : false,
    /** true when >= md && < lg \u2014 tablets */
    isTablet: hasMounted ? width >= BREAKPOINTS.md && width < BREAKPOINTS.lg : false,
  }
}
