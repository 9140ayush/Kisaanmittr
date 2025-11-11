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

    console.log(`📄 Proxying PDF compilation request to backend (${backendSections.length} sections)`)

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
      // Backend returned an error (JSON response)
      const error = await backendResponse.json().catch(() => ({ error: "Backend request failed" }))
      console.error("❌ Backend compilation error:", error)
      return NextResponse.json(
        { 
          success: false,
          error: error.error || "Failed to compile report",
          details: error.details || error.message,
        },
        { status: backendResponse.status || 500 },
      )
    }

    // Check if response is PDF (backend returns PDF directly)
    const contentType = backendResponse.headers.get("content-type")
    if (contentType?.includes("application/pdf")) {
      // Backend returned PDF binary data
      const pdfBuffer = await backendResponse.arrayBuffer()
      const filename = backendResponse.headers.get("content-disposition")?.match(/filename="?(.+)"?/)?.[1] || "kisaanmittr-report.pdf"

      console.log(`✅ PDF received from backend (${pdfBuffer.byteLength} bytes)`)

      // Return PDF as binary response with proper headers
      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Content-Length": pdfBuffer.byteLength.toString(),
          "Cache-Control": "no-cache",
        },
      })
    } else {
      // Fallback: backend returned JSON (legacy support)
      const backendData = await backendResponse.json()
      const pdfBase64 = backendData.pdf
      
      if (!pdfBase64) {
        return NextResponse.json(
          { 
            success: false,
            error: "No PDF data received from backend" 
          },
          { status: 500 },
        )
      }

      // Convert base64 to buffer for download
      const pdfBuffer = Buffer.from(pdfBase64, "base64")
      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="kisaanmittr-report.pdf"`,
          "Content-Length": pdfBuffer.length.toString(),
          "Cache-Control": "no-cache",
        },
      })
    }
  } catch (error: any) {
    console.error("❌ Compilation error:", error)
    return NextResponse.json(
      { 
        success: false,
        error: error.message || "Failed to compile report" 
      },
      { status: 500 },
    )
  }
}
