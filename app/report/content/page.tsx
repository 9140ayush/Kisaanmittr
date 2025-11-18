"use client"

import type React from "react"

import { useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Loader2, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"
import { useReportStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { generateContent, extractFromFile } from "@/lib/api-client"

export default function ContentCreationPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { selectedItems, customItems, contentBySection, updateContent, markSectionComplete, getCompletionStatus } =
    useReportStore()

  const allItems = useMemo(() => [...selectedItems, ...customItems], [selectedItems, customItems])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [activeTab, setActiveTab] = useState("manual")
  const [editorContent, setEditorContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")

  const currentItem = allItems[currentIndex]
  const loadedContent = contentBySection[currentItem?.id]
  const isCurrentItemComplete = currentItem?.completed
  const completionStatus = getCompletionStatus()

  const handleGenerateAI = useCallback(async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt for AI generation",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const generatedText = await generateContent({ prompt: aiPrompt })
      setEditorContent(generatedText)
      toast({
        title: "Success",
        description: "Content generated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate content",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }, [aiPrompt, toast])

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.currentTarget.files?.[0]
      if (!file) return

      setIsUploading(true)
      try {
        const extractedText = await extractFromFile({ file })
        setEditorContent(extractedText)
        toast({
          title: "Success",
          description: "File uploaded and content extracted",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to upload file",
          variant: "destructive",
        })
      } finally {
        setIsUploading(false)
      }
    },
    [toast],
  )

  const handleSaveContent = useCallback(() => {
    if (!editorContent.trim()) {
      toast({
        title: "Error",
        description: "Please add content before saving",
        variant: "destructive",
      })
      return
    }

    updateContent(currentItem.id, activeTab as "ai" | "upload" | "manual", editorContent)
    toast({
      title: "Saved",
      description: "Content saved successfully",
    })
  }, [editorContent, currentItem, activeTab, updateContent, toast])

  const handleMarkComplete = useCallback(() => {
    if (!editorContent.trim()) {
      toast({
        title: "Error",
        description: "Please add content before marking complete",
        variant: "destructive",
      })
      return
    }

    updateContent(currentItem.id, activeTab as "ai" | "upload" | "manual", editorContent)
    markSectionComplete(currentItem.id)
    toast({
      title: "Success",
      description: "Section marked as complete",
    })
  }, [editorContent, currentItem, activeTab, updateContent, markSectionComplete, toast])

  const handleNext = useCallback(() => {
    if (currentIndex < allItems.length - 1) {
      handleSaveContent()
      setCurrentIndex(currentIndex + 1)
      const nextItem = allItems[currentIndex + 1]
      setEditorContent(contentBySection[nextItem.id]?.text || "")
      setAiPrompt("")
    }
  }, [currentIndex, allItems, handleSaveContent, contentBySection])

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      handleSaveContent()
      setCurrentIndex(currentIndex - 1)
      const previousItem = allItems[currentIndex - 1]
      setEditorContent(contentBySection[previousItem.id]?.text || "")
      setAiPrompt("")
    }
  }, [currentIndex, allItems, handleSaveContent, contentBySection])

  const handleContinueToReview = useCallback(() => {
    handleSaveContent()
    router.push("/report/review")
  }, [handleSaveContent, router])

  if (!currentItem) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">No items selected</p>
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
          <h1 className="text-3xl font-bold text-foreground">Content Creation</h1>
          <p className="text-muted-foreground">
            Item {currentIndex + 1} of {allItems.length}: {currentItem.name}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Progress: {completionStatus.completed} of {completionStatus.total} items completed
            </span>
            <span className="text-sm text-muted-foreground">{completionStatus.percentage}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${completionStatus.percentage}%` }}
            ></div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Left Panel: Section List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {allItems.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (idx !== currentIndex) {
                        handleSaveContent()
                        setCurrentIndex(idx)
                        setEditorContent(contentBySection[item.id]?.text || "")
                        setAiPrompt("")
                      }
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm font-medium flex items-center justify-between ${
                      idx === currentIndex ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    <span className="truncate">{item.name}</span>
                    {contentBySection[item.id]?.text && <Check className="h-4 w-4 shrink-0 ml-2" />}
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel: Content Editor */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Add Content</CardTitle>
                <CardDescription>Choose a method to add content for this section</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                    <TabsTrigger value="ai">AI Generation</TabsTrigger>
                    <TabsTrigger value="upload">File Upload</TabsTrigger>
                  </TabsList>

                  {/* Manual Entry Tab */}
                  <TabsContent value="manual" className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Edit or paste content here</label>
                      <Textarea
                        placeholder="Enter or edit your content..."
                        value={editorContent}
                        onChange={(e) => setEditorContent(e.target.value)}
                        className="min-h-64"
                      />
                    </div>
                  </TabsContent>

                  {/* AI Generation Tab */}
                  <TabsContent value="ai" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Describe what you need</label>
                        <Textarea
                          placeholder="E.g., 'Generate a crop overview for wheat farming with yield predictions...'"
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          className="min-h-24"
                        />
                      </div>
                      <Button onClick={handleGenerateAI} disabled={isGenerating} className="w-full gap-2">
                        {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isGenerating ? "Generating..." : "Generate with AI"}
                      </Button>
                      {editorContent && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Generated Content (edit as needed)
                          </label>
                          <Textarea
                            value={editorContent}
                            onChange={(e) => setEditorContent(e.target.value)}
                            className="min-h-48"
                          />
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* File Upload Tab */}
                  <TabsContent value="upload" className="space-y-4">
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                        <label className="cursor-pointer space-y-2">
                          <div className="text-muted-foreground">Drag and drop your file here or click to browse</div>
                          <Input
                            type="file"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                            className="hidden"
                            accept=".txt,.pdf,.doc,.docx"
                          />
                          <Button variant="outline" size="sm" disabled={isUploading} asChild>
                            <span>{isUploading ? "Uploading..." : "Select File"}</span>
                          </Button>
                        </label>
                      </div>
                      {editorContent && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Extracted Content (edit as needed)
                          </label>
                          <Textarea
                            value={editorContent}
                            onChange={(e) => setEditorContent(e.target.value)}
                            className="min-h-48"
                          />
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4 pt-4 border-t">
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentIndex === 0}
                      className="gap-2 bg-transparent"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button onClick={handleSaveContent} variant="secondary" className="flex-1">
                      Save Content
                    </Button>
                    <Button onClick={handleNext} disabled={currentIndex === allItems.length - 1} className="gap-2">
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    onClick={handleMarkComplete}
                    variant={isCurrentItemComplete ? "secondary" : "default"}
                    className="w-full gap-2"
                  >
                    <Check className="h-4 w-4" />
                    {isCurrentItemComplete ? "Completed" : "Mark as Complete"}
                  </Button>

                  {currentIndex === allItems.length - 1 && completionStatus.completed > 0 && (
                    <Button
                      onClick={handleContinueToReview}
                      className="w-full gap-2 bg-secondary hover:bg-secondary/90"
                    >
                      Continue to Review
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {!editorContent && (
                  <div className="rounded-lg bg-amber-50 dark:bg-amber-950 p-4 flex gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-800 dark:text-amber-200">
                      Add content to this section before continuing
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
