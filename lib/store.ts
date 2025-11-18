import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface ReportItem {
  id: string
  name: string
  completed: boolean
}

export interface ReportState {
  selectedItems: ReportItem[]
  customItems: ReportItem[]
  contentBySection: Record<string, { method: "ai" | "upload" | "manual"; text: string }>
  currentStep: number

  // Actions
  selectItem: (item: ReportItem) => void
  deselectItem: (id: string) => void
  addCustomItem: (name: string) => void
  removeCustomItem: (id: string) => void
  updateContent: (sectionId: string, method: "ai" | "upload" | "manual", text: string) => void
  markSectionComplete: (sectionId: string) => void
  setCurrentStep: (step: number) => void
  resetReport: () => void
  reorderSections: (newOrder: ReportItem[]) => void
  getCompletionStatus: () => { total: number; completed: number; percentage: number }
}

const initialReportItems: ReportItem[] = [
  { id: "crop-overview", name: "Crop Overview", completed: false },
  { id: "soil-health", name: "Soil Health", completed: false },
  { id: "weather-insights", name: "Weather Insights", completed: false },
  { id: "market-trends", name: "Market Trends", completed: false },
]

export const useReportStore = create<ReportState>()(
  persist(
    (set, get) => ({
      selectedItems: [],
      customItems: [],
      contentBySection: {},
      currentStep: 0,

      selectItem: (item) =>
        set((state) => {
          if (state.selectedItems.find((i) => i.id === item.id)) {
            return state
          }
          return { selectedItems: [...state.selectedItems, item] }
        }),

      deselectItem: (id) =>
        set((state) => ({
          selectedItems: state.selectedItems.filter((item) => item.id !== id),
        })),

      addCustomItem: (name) =>
        set((state) => {
          const newItem: ReportItem = {
            id: `custom-${Date.now()}`,
            name,
            completed: false,
          }
          return { customItems: [...state.customItems, newItem] }
        }),

      removeCustomItem: (id) =>
        set((state) => ({
          customItems: state.customItems.filter((item) => item.id !== id),
        })),

      updateContent: (sectionId, method, text) =>
        set((state) => ({
          contentBySection: {
            ...state.contentBySection,
            [sectionId]: { method, text },
          },
        })),

      markSectionComplete: (sectionId) =>
        set((state) => {
          return {
            selectedItems: state.selectedItems.map((item) =>
              item.id === sectionId ? { ...item, completed: true } : item,
            ),
            customItems: state.customItems.map((item) => (item.id === sectionId ? { ...item, completed: true } : item)),
          }
        }),

      setCurrentStep: (step) => set({ currentStep: step }),

      resetReport: () =>
        set({
          selectedItems: [],
          customItems: [],
          contentBySection: {},
          currentStep: 0,
        }),

      reorderSections: (newOrder) => {
        set((state) => {
          // Split into selected and custom items
          const newSelectedItems = newOrder.filter((item) => state.selectedItems.some((i) => i.id === item.id))
          const newCustomItems = newOrder.filter((item) => state.customItems.some((i) => i.id === item.id))

          return {
            selectedItems: newSelectedItems,
            customItems: newCustomItems,
          }
        })
      },

      getCompletionStatus: () => {
        const state = get()
        const allItems = [...state.selectedItems, ...state.customItems]
        const completed = allItems.filter((item) => state.contentBySection[item.id]?.text).length
        return {
          total: allItems.length,
          completed,
          percentage: allItems.length > 0 ? Math.round((completed / allItems.length) * 100) : 0,
        }
      },
    }),
    {
      name: "report-store",
      version: 1,
    },
  ),
)

