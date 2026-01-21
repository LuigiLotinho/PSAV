"use client"

import { useMemo } from "react"
import { motion, useMotionValue } from "framer-motion"

type CarouselItem = {
  id: string
  title: string
  categoryName?: string
}

type ThreeDPhotoCarouselProps = {
  items: CarouselItem[]
  radius?: number
  cardWidth?: number
  cardHeight?: number
  className?: string
}

export function ThreeDPhotoCarousel({
  items,
  radius = 520,
  cardWidth = 260,
  cardHeight = 160,
  className = "",
}: ThreeDPhotoCarouselProps) {
  const pastelColors = [
    "#F8C8DC",
    "#CDE7FF",
    "#CDECCF",
    "#FFF2CC",
    "#E2D6FF",
    "#FFDCC8",
    "#D9F4FF",
    "#FFE0F0",
    "#D8F3DC",
    "#FDE2B6",
    "#D6E4FF",
    "#E6F7D4",
    "#F7D6E0",
  ]
  const rotation = useMotionValue(0)
  const step = useMemo(() => (items.length ? 360 / items.length : 0), [items.length])

  if (items.length === 0) {
    return (
      <div className={`flex min-h-[320px] items-center justify-center ${className}`}>
        <p className="text-sm text-muted-foreground">Keine Einträge vorhanden.</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="relative mx-auto h-[520px] w-full [perspective:1400px]">
        <motion.div
          className="relative h-full w-full cursor-grab active:cursor-grabbing"
          style={{ rotateY: rotation, transformStyle: "preserve-3d" }}
          onPan={(_, info) => {
            rotation.set(rotation.get() + info.delta.x * 0.4)
          }}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              className="absolute left-1/2 top-1/2 flex items-center justify-center rounded-xl p-4 text-center shadow-lg"
              style={{
                width: cardWidth,
                height: cardHeight,
                transform: `translate(-50%, -50%) rotateY(${index * step}deg) translateZ(${radius}px)`,
                transformStyle: "preserve-3d",
                backgroundColor: pastelColors[index % pastelColors.length],
              }}
            >
              {item.categoryName ? (
                <span className="text-base font-semibold uppercase tracking-wide text-slate-900">
                  {item.categoryName}
                </span>
              ) : (
                <span className="text-base font-semibold uppercase tracking-wide text-slate-900">{item.title}</span>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
