// AI-generated · AI-managed · AI-maintained
"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface WaveTextProps {
  text?: string
  className?: string
  color?: "cyan" | "red" | "gold" | "green"
  delay?: number
}

export function WaveText({ text = "", className = "", color = "cyan", delay = 0.1 }: WaveTextProps) {
  const [characters, setCharacters] = useState<string[]>([])

  useEffect(() => {
    if (text) {
      setCharacters(Array.from(text))
    }
  }, [text])

  if (!characters.length) return null

  const colorMap = {
    cyan: {
      gradient: "linear-gradient(180deg, #67e8f9 0%, #22d3ee 100%)",
      shadow: "0 0 20px rgba(34, 211, 238, 0.3)",
    },
    red: {
      gradient: "linear-gradient(180deg, #dc2626 0%, #991b1b 100%)",
      shadow: "0 0 20px rgba(220, 38, 38, 0.3)",
    },
    gold: {
      gradient: "linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%)",
      shadow: "0 0 20px rgba(245, 158, 11, 0.3)",
    },
    green: {
      gradient: "linear-gradient(180deg, #34d399 0%, #10b981 100%)",
      shadow: "0 0 20px rgba(16, 185, 129, 0.3)",
    },
  }

  const colors = colorMap[color]

  return (
    <span className={`inline-flex flex-wrap gap-[1px] ${className}`}>
      {characters.map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          className="relative inline-block font-semibold text-transparent bg-clip-text"
          style={{
            background: colors.gradient,
            WebkitBackgroundClip: "text",
            textShadow: colors.shadow,
          }}
          animate={{
            y: [0, -4, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            delay: index * delay,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  )
}
