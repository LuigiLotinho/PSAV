"use client"

import Link from "next/link"
import Image from "next/image"
import { useMemo, useRef } from "react"
import { motion, useMotionValue } from "framer-motion"
import { useIsMobile } from "@/hooks/use-mobile"

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
  radius: propRadius,
  cardWidth: propCardWidth,
  cardHeight: propCardHeight,
  className = "",
}: ThreeDPhotoCarouselProps) {
  const isMobile = useIsMobile()
  
  // Mobile adjustments
  const radius = propRadius ?? (isMobile ? 230 : 620)
  const cardWidth = propCardWidth ?? (isMobile ? 100 : 260)
  const cardHeight = propCardHeight ?? (isMobile ? 60 : 160)
  
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
      <div className={`relative mx-auto w-full [perspective:1400px] ${isMobile ? "h-[160px]" : "h-[520px]"}`}>
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
              ? `font-semibold uppercase tracking-wide text-white drop-shadow ${isMobile ? "text-sm" : "text-base"}`
              : `font-semibold uppercase tracking-wide text-slate-900 ${isMobile ? "text-sm" : "text-base"}`
            const content = item.categoryName ? (
              <span className={contentClass}>{item.categoryName}</span>
            ) : (
              <span className={contentClass}>{item.title}</span>
            )
            const sharedProps = {
              className:
                `absolute left-1/2 top-1/2 flex items-center justify-center rounded-xl text-center shadow-lg transition-shadow hover:shadow-xl overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${isMobile ? "p-2" : "p-4"}`,
              style: {
                width: cardWidth,
                height: cardHeight,
                transform: `translate(-50%, -50%) rotateY(${index * step}deg) translateZ(${radius}px)`,
                transformStyle: "preserve-3d" as const,
                backgroundColor: hasImage ? undefined : pastelColors[index % pastelColors.length],
              },
            }

            const cardContent = (
              <>
                {hasImage && (
                  <div className="absolute inset-0 -z-10">
                    <Image
                      src={item.imageSrc!}
                      alt={item.imageAlt || ""}
                      fill
                      sizes={`${cardWidth}px`}
                      className="object-cover"
                      priority={index < 4}
                    />
                    <div className="absolute inset-0 bg-black/35" />
                  </div>
                )}
                {content}
              </>
            )

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
                  {cardContent}
                </Link>
              )
            }

            return (
              <div key={item.id} {...sharedProps}>
                {cardContent}
              </div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
