import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 })
    }

    // Validate file types and sizes
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    const maxSize = 10 * 1024 * 1024 // 10MB

    const uploadedFiles = []

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.type}. Only JPEG, PNG, and WebP are allowed.` },
          { status: 400 },
        )
      }

      if (file.size > maxSize) {
        return NextResponse.json({ error: `File ${file.name} is too large. Maximum size is 10MB.` }, { status: 400 })
      }

      // For demo purposes, we'll generate placeholder URLs
      // In a real app, you'd upload to a cloud storage service
      const fileUrl = `/placeholder.svg?height=400&width=600&query=property-${Date.now()}-${Math.random()}`

      uploadedFiles.push({
        name: file.name,
        url: fileUrl,
        size: file.size,
        type: file.type,
      })
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
