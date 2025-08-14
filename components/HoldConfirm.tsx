"use client"
import { useRef, useEffect, useState } from "react"

export default function HoldButton({
  onComplete,
  className,
  fillColor,
  fillColorText,
  text,
}: {
  onComplete: () => void
  className?: string
  fillColor?: string
  fillColorText?: string
  text?: string
}) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [overlayClip, setOverlayClip] = useState("inset(0px 100% 0px 0px)")
  const [overlayTransition, setOverlayTransition] = useState(
    "clip-path 200ms ease-out"
  )

  const handlePointerDown = () => {
    setIsActive(true)
    setOverlayTransition("clip-path 2s linear")
    setOverlayClip("inset(0px 0px 0px 0px)")
    timeoutRef.current = setTimeout(() => {
      onComplete()
      timeoutRef.current = null
      setIsActive(false)
      setOverlayTransition("clip-path 200ms ease-out")
      setOverlayClip("inset(0px 100% 0px 0px)")
    }, 2000)
  }

  const handlePointerUp = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsActive(false)
    setOverlayTransition("clip-path 200ms ease-out")
    setOverlayClip("inset(0px 100% 0px 0px)")
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <button
      type="button"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={className}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
        transition: "transform 160ms ease-out",
        cursor: "pointer",
        width: "100%",
        fontSize: "0.875rem",
        outline: "none",
        transform: isActive ? "scale(0.97)" : undefined,
        borderColor: isActive ? fillColor : "#e5e7eb",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          backgroundColor: fillColor,
          color: fillColorText,
          clipPath: overlayClip,
          transition: overlayTransition,
          pointerEvents: "none",
          borderRadius: "5px",
        }}
      >
        {text}
      </div>
      {text}
    </button>
  )
}
