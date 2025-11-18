"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Download, GripVertical, Check, AlertCircle, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { useReportStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { compileReport } from "@/lib/api-client"

type DraggingItem = {
  id: string
  name: string
  completed: boolean
}

export default function AIReviewPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { selectedItems, customItems, contentBySection, reorderSections, resetReport } = useReportStore()

  const [sections, setSections] = useState([...selectedItems, ...customItems])
  const [draggedItem, setDraggedItem] = useState<DraggingItem | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [showPreview, setShowPreview] = useState(true)

  const allSectionsHaveContent = sections.every((section) => contentBySection[section.id]?.text)

  const handleDragStart = (item: DraggingItem) => {
    setDraggedItem(item)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.style.backgroundColor = "var(--color-muted)"
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.style.backgroundColor = "transparent"
  }

  const handleDrop = (e: React.DragEvent, targetItem: DraggingItem) => {
    e.preventDefault()
    e.currentTarget.style.backgroundColor = "transparent"

    if (!draggedItem || draggedItem.id === targetItem.id) return

    const draggedIndex = sections.findIndex((item) => item.id === draggedItem.id)
    const targetIndex = sections.findIndex((item) => item.id === targetItem.id)

    const newSections = Array.from(sections)
    newSections.splice(draggedIndex, 1)
    newSections.splice(targetIndex, 0, draggedItem)

    setSections(newSections)
    reorderSections(newSections)
    setDraggedItem(null)
    toast({
      title: "Success",
      description: "Section reordered",
    })
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const reportData = sections.map((section) => ({
        name: section.name,
        content: contentBySection[section.id]?.text || "",
        id: section.id,
      }))

      const result = await compileReport({ sections: reportData })

      if (!result.success) {
        throw new Error(result.message || "Failed to compile report")
      }

      if (!result.downloadUrl && !result.blob) {
        throw new Error("No download URL or blob received from server")
      }

      try {
        // Use blob if available (new direct PDF response), otherwise use downloadUrl
        const blob = result.blob || (result.downloadUrl && result.downloadUrl.startsWith("blob:") 
          ? await fetch(result.downloadUrl).then(r => r.blob())
          : null)

        if (blob) {
          // Download PDF from blob (preferred method)
          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.download = `kisaanmittr-report-${new Date().toISOString().split("T")[0]}.pdf`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        } else if (result.downloadUrl && result.downloadUrl.startsWith("data:application/pdf;base64,")) {
          // Fallback: Handle base64 data URL (legacy support)
          const base64 = result.downloadUrl.split(",")[1]
          const byteCharacters = atob(base64)
          const byteNumbers = new Array(byteCharacters.length)
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          const pdfBlob = new Blob([byteArray], { type: "application/pdf" })
          
          const url = URL.createObjectURL(pdfBlob)
          const link = document.createElement("a")
          link.href = url
          link.download = `kisaanmittr-report-${new Date().toISOString().split("T")[0]}.pdf`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        } else if (result.downloadUrl) {
          // Fallback: try direct download URL
          window.open(result.downloadUrl, "_blank")
        } else {
          throw new Error("No valid download method available")
        }

        toast({
          title: "Success",
          description: "Report downloaded successfully",
        })
      } catch (downloadError) {
        console.error("Download error:", downloadError)
        throw downloadError
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to download report",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleFinalizeReport = async () => {
    if (!allSectionsHaveContent) {
      toast({
        title: "Error",
        description: "All sections must have content before finalizing",
        variant: "destructive",
      })
      return
    }

    setIsDownloading(true)
    try {
      const reportData = sections.map((section) => ({
        name: section.name,
        content: contentBySection[section.id]?.text || "",
        id: section.id,
      }))

      await compileReport({ sections: reportData })

      toast({
        title: "Success",
        description: "Report finalized successfully",
      })

      setTimeout(() => {
        resetReport()
        router.push("/")
      }, 1500)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to finalize report",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  if (sections.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">No sections to review</p>
              <Button onClick={() => router.push("/report")} className="mt-4 w-full">
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Review & Finalize Report</h1>
          <p className="text-muted-foreground">
            Reorder sections, review content, and finalize your agricultural report
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Left Panel: Section Reorder */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sections</CardTitle>
                <CardDescription>Drag to reorder</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {sections.map((section) => {
                  const hasContent = contentBySection[section.id]?.text
                  return (
                    <div
                      key={section.id}
                      draggable
                      onDragStart={() => handleDragStart(section)}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, section)}
                      className="flex items-center gap-2 rounded-md border p-3 bg-card hover:bg-muted cursor-move transition-colors"
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{section.name}</p>
                      </div>
                      {hasContent && <Check className="h-4 w-4 text-primary shrink-0" />}
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Summary Stats */}
            <Card className="mt-4">
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Sections</span>
                  <span className="font-semibold text-foreground">{sections.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">With Content</span>
                  <span className="font-semibold text-foreground">
                    {sections.filter((s) => contentBySection[s.id]?.text).length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel: PDF Preview */}
          <div className="lg:col-span-3">
            <Card className="flex flex-col h-full">
              <CardHeader className="flex flex-row items-center justify-between border-b">
                <div>
                  <CardTitle>Report Preview</CardTitle>
                  <CardDescription>Review how your report will look</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)} className="gap-2">
                  <Eye className="h-4 w-4" />
                  {showPreview ? "Hide" : "Show"}
                </Button>
              </CardHeader>

              {showPreview && (
                <CardContent className="flex-1 overflow-auto py-6">
                  <div className="space-y-8 max-w-2xl mx-auto">
                    {sections.map((section, idx) => {
                      const content = contentBySection[section.id]?.text
                      return (
                        <div key={section.id} className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shrink-0">
                              {idx + 1}
                            </div>
                            <h2 className="text-xl font-bold text-foreground pt-1">{section.name}</h2>
                          </div>

                          {content ? (
                            <div className="ml-11 text-foreground whitespace-pre-wrap text-sm leading-relaxed bg-muted/30 p-4 rounded-lg">
                              {content}
                            </div>
                          ) : (
                            <div className="ml-11 rounded-lg bg-amber-50 dark:bg-amber-950 p-4 flex gap-2">
                              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                              <span className="text-sm text-amber-800 dark:text-amber-200">No content added</span>
                            </div>
                          )}

                          {idx < sections.length - 1 && <div className="ml-11 border-b border-border my-6"></div>}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              )}

              {!showPreview && (
                <CardContent className="flex-1 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <p>Preview hidden</p>
                    <p className="text-sm mt-2">Click "Show" to view the report preview</p>
                  </div>
                </CardContent>
              )}

              {/* Action Buttons */}
              <div className="border-t p-6 space-y-3">
                {!allSectionsHaveContent && (
                  <div className="rounded-lg bg-red-50 dark:bg-red-950 p-4 flex gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    <div className="text-sm text-red-800 dark:text-red-200">
                      All sections must have content before finalizing the report
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button variant="outline" onClick={() => router.push("/report/content")} className="flex-1">
                    Back to Editing
                  </Button>
                  <Button
                    onClick={handleDownload}
                    disabled={isDownloading || !allSectionsHaveContent}
                    className="flex-1 gap-2"
                  >
                    <Download className="h-4 w-4" />
                    {isDownloading ? "Downloading..." : "Download Report"}
                  </Button>
                  <Button
                    onClick={handleFinalizeReport}
                    disabled={isDownloading || !allSectionsHaveContent}
                    className="flex-1 bg-secondary hover:bg-secondary/90"
                  >
                    {isDownloading ? "Processing..." : "Finalize Report"}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
