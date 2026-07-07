import { useState, useRef, useCallback } from 'react'
import { useDiets } from './hooks/useDiets'
import { useCatalog } from './hooks/useCatalog'
import Header from './components/Header'
import DayTabs from './components/DayTabs'
import MacroBanner from './components/MacroBanner'
import MealCard from './components/MealCard'
import EditorPanel from './components/Editor/EditorPanel'
import CatalogPanel from './components/Catalog/CatalogPanel'
import PrintView from './components/PrintView'
import { MEAL_DEFS, GG } from './data/diets'

export default function App() {
  const { diets, dietNames, saveDiet, deleteDiet, draft, saveDraft, clearDraft, exportDiets, importDiets } = useDiets()
  const catalogState = useCatalog()

  const [curDietIdx, setCurDietIdx] = useState(0)
  const [curDay, setCurDay] = useState(0)
  const [openMeal, setOpenMeal] = useState(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorDietKey, setEditorDietKey] = useState(null)
  const [catalogOpen, setCatalogOpen] = useState(false)

  const touchStartX = useRef(null)

  const safeIdx = Math.min(curDietIdx, dietNames.length - 1)
  const curDietName = dietNames[safeIdx] || dietNames[0]
  const curDiet = diets[curDietName]
  const curDayData = curDiet?.days?.[curDay] || {}

  const openEditor = useCallback((dietKey) => {
    setEditorDietKey(dietKey ?? null)
    setEditorOpen(true)
  }, [])

  const closeEditor = useCallback(() => {
    setEditorOpen(false)
    setEditorDietKey(null)
  }, [])

  const handleSaveDiet = useCallback((name, targets, days) => {
    saveDiet(name, targets, days)
    clearDraft()
    closeEditor()
    // Select the saved diet after re-render
    setTimeout(() => {
      const idx = Object.keys({ ...diets, [name]: {} }).indexOf(name)
      if (idx >= 0) setCurDietIdx(idx)
    }, 0)
  }, [saveDiet, clearDraft, closeEditor, diets])

  const handleDeleteDiet = useCallback((name) => {
    deleteDiet(name)
    setCurDietIdx(0)
    closeEditor()
  }, [deleteDiet, closeEditor])

  const toggleMeal = (mealId) => {
    setOpenMeal(prev => prev === mealId ? null : mealId)
  }

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(dx) > 50) {
      setCurDay(prev => {
        const next = dx < 0 ? Math.min(6, prev + 1) : Math.max(0, prev - 1)
        if (next !== prev) setOpenMeal(null)
        return next
      })
    }
  }

  if (!curDiet) return null

  return (
    <div className="min-h-screen bg-bg dark:bg-slate-900 font-sans">
      <Header
        dietNames={dietNames}
        diets={diets}
        curDietIdx={safeIdx}
        onSelectDiet={(i) => { setCurDietIdx(i); setCurDay(0); setOpenMeal(null) }}
        onEditDiet={openEditor}
        onNewDiet={() => openEditor(null)}
        onOpenCatalog={() => setCatalogOpen(true)}
        onPrint={() => window.print()}
        onExport={exportDiets}
        onImport={importDiets}
      />

      <DayTabs
        curDay={curDay}
        onSelectDay={(i) => { setCurDay(i); setOpenMeal(null) }}
      />

      <main
        className="max-w-3xl mx-auto px-4 pt-4 sm:pb-8"
        style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <MacroBanner
          day={curDayData}
          targets={curDiet.targets}
          dayName={GG[curDay]}
          catalog={catalogState.catalog}
        />
        <div className="flex flex-col gap-2">
          {MEAL_DEFS.map(md => (
            <MealCard
              key={md.id}
              meal={md}
              foods={curDayData[md.id] || []}
              isOpen={openMeal === md.id}
              onToggle={() => toggleMeal(md.id)}
              catalog={catalogState.catalog}
            />
          ))}
        </div>
      </main>

      <PrintView diet={curDiet} name={curDietName} catalog={catalogState.catalog} />

      <EditorPanel
        open={editorOpen}
        dietKey={editorDietKey}
        diets={diets}
        catalog={catalogState.catalog}
        draft={draft}
        onSave={handleSaveDiet}
        onDelete={handleDeleteDiet}
        onClose={closeEditor}
        onSaveDraft={saveDraft}
        onClearDraft={clearDraft}
      />

      <CatalogPanel
        open={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        {...catalogState}
      />

      {/* Mobile bottom nav */}
      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0 bg-navy border-t border-navy2 flex z-30"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)', paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)' }}
      >
        <button
          className="flex-1 flex flex-col items-center py-3 gap-0.5 text-white/55 active:text-white"
          style={{ minHeight: 44 }}
          onClick={() => { setCatalogOpen(false); setEditorOpen(false) }}
        >
          <span className="text-xl">🥗</span>
          <span className="text-[10px] font-bold">Vista</span>
        </button>
        <button
          className="flex-1 flex flex-col items-center py-3 gap-0.5 text-white/55 active:text-white"
          style={{ minHeight: 44 }}
          onClick={() => openEditor(curDietName)}
        >
          <span className="text-xl">✏️</span>
          <span className="text-[10px] font-bold">Editor</span>
        </button>
        <button
          className="flex-1 flex flex-col items-center py-3 gap-0.5 text-white/55 active:text-white"
          style={{ minHeight: 44 }}
          onClick={() => setCatalogOpen(true)}
        >
          <span className="text-xl">📋</span>
          <span className="text-[10px] font-bold">Catalogo</span>
        </button>
      </nav>
    </div>
  )
}
