"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, ImageIcon, Trash2, Eye } from "lucide-react"

interface UploadedFile {
  name: string
  url: string
  size: number
  type: string
}

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxFiles?: number
  maxSizePerFile?: number
}

export function ImageUpload({ images, onImagesChange, maxFiles = 10, maxSizePerFile = 10 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState("")
  const [dragActive, setDragActive] = useState(false)

  const handleFiles = useCallback(
    async (files: FileList) => {
      if (files.length === 0) return

      // Check if adding these files would exceed the limit
      if (images.length + files.length > maxFiles) {
        setError(`Maximum ${maxFiles} images allowed. You can upload ${maxFiles - images.length} more.`)
        return
      }

      setError("")
      setUploading(true)
      setUploadProgress(0)

      try {
        const formData = new FormData()
        Array.from(files).forEach((file) => {
          formData.append("files", file)
        })

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return 90
            }
            return prev + 10
          })
        }, 200)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        clearInterval(progressInterval)
        setUploadProgress(100)

        const result = await response.json()

        if (response.ok) {
          const newImageUrls = result.files.map((file: UploadedFile) => file.url)
          onImagesChange([...images, ...newImageUrls])

          // Reset progress after a short delay
          setTimeout(() => {
            setUploadProgress(0)
          }, 1000)
        } else {
          setError(result.error || "Upload failed")
        }
      } catch (err) {
        setError("Network error. Please try again.")
      } finally {
        setUploading(false)
      }
    },
    [images, onImagesChange, maxFiles],
  )

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles],
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : uploading
              ? "border-gray-300 bg-gray-50"
              : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleInputChange}
          className="hidden"
          id="image-upload"
          disabled={uploading || images.length >= maxFiles}
        />

        {uploading ? (
          <div className="space-y-4">
            <div className="animate-spin mx-auto h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <div className="space-y-2">
              <p className="text-gray-600">Uploading images...</p>
              <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
              <p className="text-sm text-gray-500">{uploadProgress}%</p>
            </div>
          </div>
        ) : (
          <label htmlFor="image-upload" className="cursor-pointer block">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              {dragActive ? "Drop images here" : "Upload Property Images"}
            </p>
            <p className="text-gray-500 mb-2">Drag and drop images here, or click to select files</p>
            <p className="text-sm text-gray-400">
              PNG, JPG, WebP up to {maxSizePerFile}MB each • Maximum {maxFiles} images
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {images.length}/{maxFiles} images uploaded
            </p>
          </label>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Uploaded Images ({images.length})</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Property image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Image Actions Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0"
                      onClick={() => window.open(image, "_blank")}
                    >
                      <Eye size={14} />
                    </Button>
                    <Button size="sm" variant="destructive" className="h-8 w-8 p-0" onClick={() => removeImage(index)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>

                {/* Image Number Badge */}
                <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <ImageIcon className="text-blue-600 mt-0.5" size={20} />
          <div className="text-sm">
            <p className="font-medium text-blue-900 mb-1">Image Upload Tips:</p>
            <ul className="text-blue-700 space-y-1">
              <li>• Use high-quality images for better property presentation</li>
              <li>• Include photos of all rooms, exterior, and amenities</li>
              <li>• The first image will be used as the main property photo</li>
              <li>• You can reorder images by deleting and re-uploading</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
