import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || "http://localhost:3001"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt } = body

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Proxy request to backend Express server
    const backendResponse = await fetch(`${BACKEND_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    })

    if (!backendResponse.ok) {
      const error = await backendResponse.json().catch(() => ({ error: "Backend request failed" }))
      return NextResponse.json(
        { error: error.error || "Failed to generate content" },
        { status: backendResponse.status || 500 },
      )
    }

    const backendData = await backendResponse.json()

    // Transform backend response to match frontend expectations
    return NextResponse.json(
      {
        success: true,
        content: backendData.content || "",
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Generation error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to generate content" },
      { status: 500 },
    )
  }
}
