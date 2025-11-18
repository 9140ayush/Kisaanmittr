"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Navbar } from "@/components/navbar"
import { useReportStore, type ReportItem } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

const PREDEFINED_ITEMS: ReportItem[] = [
  { id: "crop-overview", name: "Crop Overview", completed: false },
  { id: "soil-health", name: "Soil Health", completed: false },
  { id: "weather-insights", name: "Weather Insights", completed: false },
  { id: "market-trends", name: "Market Trends", completed: false },
]

export default function ReportSelectionPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [customItemInput, setCustomItemInput] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)

  const { selectedItems, customItems, selectItem, deselectItem, addCustomItem, removeCustomItem } = useReportStore()

  const handleSelectItem = (item: ReportItem) => {
    selectItem(item)
  }

  const handleDeselectItem = (id: string) => {
    deselectItem(id)
  }

  const handleAddCustomItem = () => {
    if (customItemInput.trim()) {
      addCustomItem(customItemInput.trim())
      setCustomItemInput("")
      setShowCustomInput(false)
      toast({
        title: "Success",
        description: "Custom item added successfully",
      })
    }
  }

  const handleContinue = () => {
    if (selectedItems.length === 0 && customItems.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one item to continue",
        variant: "destructive",
      })
      return
    }

    router.push("/report/content")
  }

  const allSelectedItems = [...selectedItems, ...customItems]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-12">
        {/* Header */}
        <div className="mb-12 space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Select Report Items</h1>
          <p className="text-lg text-muted-foreground">Choose which sections to include in your agricultural report</p>
        </div>

        {/* Predefined Items */}
        <div className="mb-12 space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Available Items</h2>
          <div className="grid gap-3">
            {PREDEFINED_ITEMS.map((item) => {
              const isSelected = selectedItems.some((i) => i.id === item.id)
              return (
                <Card
                  key={item.id}
                  className={`flex cursor-pointer items-center gap-4 p-4 transition-colors ${
                    isSelected ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                  }`}
                  onClick={() => (isSelected ? handleDeselectItem(item.id) : handleSelectItem(item))}
                >
                  <Checkbox checked={isSelected} onChange={() => {}} className="h-5 w-5" />
                  <span className="font-medium text-foreground">{item.name}</span>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Custom Items Section */}
        <div className="mb-12 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">Custom Items</h2>
            {!showCustomInput && (
              <Button variant="outline" size="sm" onClick={() => setShowCustomInput(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Custom Item
              </Button>
            )}
          </div>

          {/* Custom Item Input */}
          {showCustomInput && (
            <Card className="flex gap-2 p-4">
              <Input
                placeholder="Enter custom item name"
                value={customItemInput}
                onChange={(e) => setCustomItemInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleAddCustomItem()
                }}
                autoFocus
              />
              <Button onClick={handleAddCustomItem} size="sm">
                Add
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowCustomInput(false)
                  setCustomItemInput("")
                }}
              >
                Cancel
              </Button>
            </Card>
          )}

          {/* Custom Items List */}
          {customItems.length > 0 && (
            <div className="grid gap-3">
              {customItems.map((item) => {
                const isSelected = selectedItems.some((i) => i.id === item.id)
                return (
                  <Card
                    key={item.id}
                    className={`flex cursor-pointer items-center justify-between gap-4 p-4 transition-colors ${
                      isSelected ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                    }`}
                  >
                    <div
                      className="flex flex-1 items-center gap-4"
                      onClick={() => (isSelected ? handleDeselectItem(item.id) : handleSelectItem(item))}
                    >
                      <Checkbox checked={isSelected} onChange={() => {}} className="h-5 w-5" />
                      <span className="font-medium text-foreground">{item.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCustomItem(item.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Summary */}
        {allSelectedItems.length > 0 && (
          <Card className="mb-12 border-primary/20 bg-primary/5 p-6">
            <h3 className="mb-3 font-semibold text-foreground">Selected Items ({allSelectedItems.length})</h3>
            <ul className="space-y-2">
              {allSelectedItems.map((item) => (
                <li key={item.id} className="flex items-center gap-2 text-foreground">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  {item.name}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => router.push("/")} className="flex-1">
            Back
          </Button>
          <Button onClick={handleContinue} className="flex-1">
            Continue
          </Button>
        </div>
      </main>
    </div>
  )
}
