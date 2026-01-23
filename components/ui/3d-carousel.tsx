"use client"

import Link from "next/link"
import { useMemo, useRef } from "react"
import { motion, useMotionValue } from "framer-motion"

type CarouselItem = {
  id: string
  title: string
  categoryName?: string
  href?: string
  imageSrc?: string
  imageAlt?: string
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
  radius = 620,
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
  const draggedRef = useRef(false)
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
          style={{ rotateY: rotation, transformStyle: "preserve-3d", touchAction: "none" }}
          onPan={(_, info) => {
            rotation.set(rotation.get() + info.delta.x * 0.4)
          }}
          onPanStart={() => {
            draggedRef.current = true
          }}
          onPanEnd={() => {
            setTimeout(() => {
              draggedRef.current = false
            }, 0)
          }}
        >
          {items.map((item, index) => {
            const hasImage = Boolean(item.imageSrc)
            const contentClass = hasImage
              ? "text-base font-semibold uppercase tracking-wide text-white drop-shadow"
              : "text-base font-semibold uppercase tracking-wide text-slate-900"
            const content = item.categoryName ? (
              <span className={contentClass}>{item.categoryName}</span>
            ) : (
              <span className={contentClass}>{item.title}</span>
            )
            const sharedProps = {
              className:
                "absolute left-1/2 top-1/2 flex items-center justify-center rounded-xl p-4 text-center shadow-lg transition-shadow hover:shadow-xl overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
              style: {
                width: cardWidth,
                height: cardHeight,
                transform: `translate(-50%, -50%) rotateY(${index * step}deg) translateZ(${radius}px)`,
                transformStyle: "preserve-3d" as const,
                backgroundColor: hasImage ? undefined : pastelColors[index % pastelColors.length],
                backgroundImage: hasImage
                  ? `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${item.imageSrc})`
                  : undefined,
                backgroundSize: hasImage ? "cover" : undefined,
                backgroundPosition: hasImage ? "center" : undefined,
              },
            }

            if (item.href) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  {...sharedProps}
                  draggable={false}
                  onDragStart={(event) => {
                    event.preventDefault()
                  }}
                  onPointerDown={() => {
                    draggedRef.current = false
                  }}
                  onClick={(event) => {
                    if (draggedRef.current) {
                      event.preventDefault()
                      event.stopPropagation()
                    }
                  }}
                >
                  {content}
                </Link>
              )
            }

            return (
              <div key={item.id} {...sharedProps}>
                {content}
              </div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
