// Client-side API utilities for content generation

export interface GenerateOptions {
  prompt: string
}

export interface ExtractOptions {
  file: File
}

export interface CompileOptions {
  sections: Array<{ name: string; content: string; id: string }>
}

export async function generateContent(options: GenerateOptions): Promise<string> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: options.prompt,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to generate content")
  }

  const data = await response.json()
  return data.content
}

export async function extractFromFile(options: ExtractOptions): Promise<string> {
  const formData = new FormData()
  formData.append("file", options.file)

  const response = await fetch("/api/extract", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to extract content from file")
  }

  const data = await response.json()
  return data.content
}

export async function compileReport(options: CompileOptions): Promise<{
  success: boolean
  downloadUrl: string
  message: string
  pdfBase64?: string
  blob?: Blob
}> {
  const response = await fetch("/api/compile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sections: options.sections,
    }),
  })

  if (!response.ok) {
    // Try to parse error as JSON
    const error = await response.json().catch(() => ({ error: "Failed to compile report" }))
    throw new Error(error.error || error.details || "Failed to compile report")
  }

  // Check if response is PDF (binary)
  const contentType = response.headers.get("content-type")
  if (contentType?.includes("application/pdf")) {
    // Response is PDF binary data
    const blob = await response.blob()
    const filename = response.headers.get("content-disposition")?.match(/filename="?(.+)"?/)?.[1] || "kisaanmittr-report.pdf"
    
    // Create object URL for download
    const downloadUrl = URL.createObjectURL(blob)
    
    return {
      success: true,
      downloadUrl: downloadUrl,
      message: "Report compiled successfully",
      blob: blob,
    }
  } else {
    // Fallback: JSON response with base64 (legacy support)
    const data = await response.json()
    return {
      success: data.success,
      downloadUrl: data.downloadUrl || (data.pdfBase64 ? `data:application/pdf;base64,${data.pdfBase64}` : ""),
      message: data.message || "Report compiled successfully",
      pdfBase64: data.pdfBase64,
    }
  }
}
