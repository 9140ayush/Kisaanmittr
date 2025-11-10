import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || "http://localhost:3001"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sections } = body

    if (!sections || !Array.isArray(sections)) {
      return NextResponse.json({ error: "Sections array is required" }, { status: 400 })
    }

    // Prepare sections for backend (backend expects name and content)
    const backendSections = sections.map((section: any) => ({
      name: section.name,
      content: section.content || "",
    }))

    // Proxy request to backend Express server
    const backendResponse = await fetch(`${BACKEND_URL}/api/compile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sections: backendSections,
        userId: "current-user", // You can get this from auth later
      }),
    })

    if (!backendResponse.ok) {
      const error = await backendResponse.json().catch(() => ({ error: "Backend request failed" }))
      return NextResponse.json(
        { error: error.error || "Failed to compile report" },
        { status: backendResponse.status || 500 },
      )
    }

    const backendData = await backendResponse.json()

    // Backend returns base64 PDF, create a data URL for download
    const pdfBase64 = backendData.pdf
    if (!pdfBase64) {
      return NextResponse.json(
        { error: "No PDF data received from backend" },
        { status: 500 },
      )
    }

    // Return success with base64 PDF data
    // Frontend will handle the download using this data
    return NextResponse.json(
      {
        success: true,
        message: backendData.message || "Report compiled successfully",
        pdfBase64: pdfBase64,
        downloadUrl: `data:application/pdf;base64,${pdfBase64}`, // Data URL for direct download
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Compilation error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to compile report" },
      { status: 500 },
    )
  }
}
