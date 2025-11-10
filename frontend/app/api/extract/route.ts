import { type NextRequest, NextResponse } from "next/server"
import FormData from "form-data"
import { Readable } from "stream"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || "http://localhost:3001"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 })
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Create FormData for backend using form-data package
    const backendFormData = new FormData()
    const stream = Readable.from(buffer)
    backendFormData.append("file", stream, {
      filename: file.name,
      contentType: file.type || "application/octet-stream",
    })

    // Proxy request to backend Express server
    const backendResponse = await fetch(`${BACKEND_URL}/api/upload`, {
      method: "POST",
      body: backendFormData as any,
      headers: backendFormData.getHeaders(),
    })

    if (!backendResponse.ok) {
      const error = await backendResponse.json().catch(() => ({ error: "Backend request failed" }))
      return NextResponse.json(
        { error: error.error || "Failed to extract content from file" },
        { status: backendResponse.status || 500 },
      )
    }

    const backendData = await backendResponse.json()

    // Transform backend response to match frontend expectations
    return NextResponse.json(
      {
        success: true,
        content: backendData.content || "",
        fileName: backendData.fileName || file.name,
        fileSize: file.size,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("File extraction error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to extract content from file" },
      { status: 500 },
    )
  }
}
