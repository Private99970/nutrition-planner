import { useRef } from 'react'
import DietPills from './DietPills'

export default function Header({
  dietNames, diets, curDietIdx,
  onSelectDiet, onEditDiet, onNewDiet,
  onOpenCatalog, onPrint, onExport, onImport,
}) {
  const fileRef = useRef(null)

  const handleExport = () => {
    const n = onExport()
    if (n === 0) alert('Non hai ancora diete personali da esportare.\nCreane una e salvala prima.')
  }

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const res = onImport(String(reader.result))
      if (res.ok) alert(`✓ Importate ${res.count} diete con successo!`)
      else alert('❌ Errore: ' + res.error)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <header
      className="bg-navy text-white px-4 sticky top-0 z-20 shadow-md"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="pt-4 pb-0">
        <div className="flex justify-between items-center mb-3 gap-2">
          <div className="flex items-center gap-2.5 flex-shrink-0 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-[15px] flex-shrink-0">🥗</div>
            <div className="min-w-0">
              <div className="text-[16px] font-bold tracking-tight truncate">Nutrition Planner</div>
              <div className="text-[10px] text-white/40 hidden sm:block">Piano dieta settimanale</div>
            </div>
          </div>
          <div className="flex gap-1.5 flex-shrink-0 items-center">
            {/* Backup: esporta / importa (sempre visibili) */}
            <button
              onClick={handleExport}
              title="Esporta diete (backup su file)"
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-colors text-[13px]"
            >
              📤
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              title="Importa diete da file"
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-colors text-[13px]"
            >
              📥
            </button>
            <input ref={fileRef} type="file" accept="application/json,.json" onChange={handleFile} className="hidden" />

            <button
              onClick={onOpenCatalog}
              className="btn-ghost hidden sm:flex items-center gap-1"
            >
              📋 Catalogo
            </button>
            <button
              onClick={onPrint}
              className="btn-ghost hidden sm:flex items-center gap-1"
            >
              🖨️ Stampa
            </button>
            <button
              onClick={onNewDiet}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11.5px] font-bold bg-ind/70 border border-indigo-400/80 hover:bg-ind transition-colors whitespace-nowrap"
            >
              ＋ Nuova dieta
            </button>
          </div>
        </div>
        <DietPills
          dietNames={dietNames}
          diets={diets}
          curDietIdx={curDietIdx}
          onSelectDiet={onSelectDiet}
          onEditDiet={onEditDiet}
          onNewDiet={onNewDiet}
        />
      </div>
    </header>
  )
}
