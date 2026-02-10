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
  const radius = propRadius ?? (isMobile ? 360 : 720)
  const cardWidth = propCardWidth ?? (isMobile ? 140 : 260)
  const cardHeight = propCardHeight ?? (isMobile ? 140 : 160)
  
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
  const didDragRef = useRef(false)
  const step = useMemo(() => (items.length ? 360 / items.length : 0), [items.length])
  const DRAG_THRESHOLD_PX = 12

  if (items.length === 0) {
    return (
      <div className={`flex min-h-[320px] items-center justify-center ${className}`}>
        <p className="text-sm text-muted-foreground">Keine Einträge vorhanden.</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className={`relative mx-auto w-full [perspective:1400px] ${isMobile ? "h-[300px]" : "h-[520px]"}`}>
        <motion.div
          className="relative h-full w-full cursor-grab active:cursor-grabbing"
          style={{ rotateY: rotation, transformStyle: "preserve-3d", touchAction: "none" }}
          onPan={(_, info) => {
            if (!didDragRef.current && Math.abs(info.offset.x) > DRAG_THRESHOLD_PX) {
              didDragRef.current = true
            }
            rotation.set(rotation.get() + info.delta.x * 0.4)
          }}
          onPanStart={() => {
            didDragRef.current = false
          }}
          onPanEnd={() => {
            setTimeout(() => {
              didDragRef.current = false
            }, 150)
          }}
        >
          {items.map((item, index) => {
            const hasImage = Boolean(item.imageSrc)
            const contentClass = hasImage
              ? `font-bold uppercase tracking-tight text-white drop-shadow-md text-center leading-tight ${isMobile ? "text-[12px]" : "text-base"}`
              : `font-bold uppercase tracking-tight text-slate-900 text-center leading-tight ${isMobile ? "text-[12px]" : "text-base"}`
            const content = (
              <div className="z-10 flex h-full w-full items-center justify-center p-2">
                {item.categoryName ? (
                  <span className={contentClass}>{item.categoryName}</span>
                ) : (
                  <span className={contentClass}>{item.title}</span>
                )}
              </div>
            )
            const sharedProps = {
              className:
                `absolute left-1/2 top-1/2 flex items-center justify-center rounded-xl text-center shadow-lg transition-shadow hover:shadow-xl overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary [backface-visibility:hidden]`,
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
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={item.imageSrc!}
                      alt={item.imageAlt || ""}
                      fill
                      sizes={`${cardWidth}px`}
                      className="object-cover"
                      priority={index < 4}
                    />
                    <div className="absolute inset-0 bg-black/40" />
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
                  onPointerDown={(e) => e.stopPropagation()}
                  onDragStart={(event) => {
                    event.preventDefault()
                  }}
                  onClick={(event) => {
                    if (didDragRef.current) {
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
