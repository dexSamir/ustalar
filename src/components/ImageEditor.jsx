import React from "react"
import { useState, useRef, useEffect } from "react"
import { ArrowLeft, ArrowRight, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'

const ImageEditor = ({ image, onSave, onCancel }) => {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [imageUrl, setImageUrl] = useState("")
  const [imageElement, setImageElement] = useState(null)

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image)
      setImageUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [image])

  useEffect(() => {
    if (imageUrl) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        setImageElement(img)
        const canvas = canvasRef.current
        if (canvas) {
          const containerSize = 300
          const imgAspect = img.width / img.height
          let initialScale = 1

          if (imgAspect > 1) {
            initialScale = containerSize / img.width
          } else {
            initialScale = containerSize / img.height
          }

          setScale(initialScale * 1.2)
          setPosition({ x: 0, y: 0 })
        }
      }
      img.src = imageUrl
    }
  }, [imageUrl])

  const drawImage = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx || !imageElement) return

    const size = 300
    canvas.width = size
    canvas.height = size

    ctx.clearRect(0, 0, size, size)

    ctx.save()

    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI)
    ctx.clip()

    const scaledWidth = imageElement.width * scale
    const scaledHeight = imageElement.height * scale

    const centerX = size / 2
    const centerY = size / 2

    const drawX = centerX - scaledWidth / 2 + position.x
    const drawY = centerY - scaledHeight / 2 + position.y

    if (rotation !== 0) {
      ctx.translate(centerX, centerY)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.translate(-centerX, -centerY)
    }

    ctx.drawImage(imageElement, drawX, drawY, scaledWidth, scaledHeight)

    ctx.restore()

    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2 - 2, 0, 2 * Math.PI)
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 4
    ctx.stroke()
  }

  useEffect(() => {
    drawImage()
  }, [imageElement, scale, position, rotation])

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return

    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev * 1.1, 3))
  }

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev * 0.9, 0.5))
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleReset = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
    setRotation(0)
  }

  const handleSave = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.toBlob(
      (blob) => {
        if (blob && image) {
          const editedFile = new File([blob], image.name, { type: image.type })
          onSave(editedFile)
        }
      },
      image?.type || "image/jpeg",
      0.9,
    )
  }

  if (!image) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md mx-4 text-center">
        <h3 className="text-lg font-semibold text-[#1A4862] mb-4">Şəkli dairəyə yerləşdirin</h3>

        <div className="relative mb-4" ref={containerRef}>
          <canvas
            ref={canvasRef}
            className="w-64 h-64 mx-auto rounded-full cursor-move select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>

        <div className="flex justify-center items-center gap-2 mb-4">
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
            title="Kiçilt"
          >
            <ZoomOut size={16} />
          </button>

          <div className="flex-1 px-2">
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          <button
            onClick={handleZoomIn}
            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
            title="Böyüt"
          >
            <ZoomIn size={16} />
          </button>
        </div>

        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={handleRotate}
            className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm flex items-center gap-1 transition-colors"
          >
            <RotateCcw size={14} />
            Döndər
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors"
          >
            Sıfırla
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">Şəkli sürüşdürərək yerini dəyişin və böyüklüyünü tənzimləyin</p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-[#1A4862] text-[#1A4862] py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Geri
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-[#1A4862] text-white py-3 rounded-lg font-medium hover:bg-[#1A4862]/90 transition-colors flex items-center justify-center gap-2"
          >
            Təsdiqlə
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #1A4862;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #1A4862;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}

export default ImageEditor
