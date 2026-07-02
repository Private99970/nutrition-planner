import DietPills from './DietPills'

export default function Header({
  dietNames, diets, curDietIdx,
  onSelectDiet, onEditDiet, onNewDiet,
  onOpenCatalog, onPrint,
}) {
  return (
    <header
      className="bg-navy text-white px-4 sticky top-0 z-20 shadow-md"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="pt-4 pb-0">
        <div className="flex justify-between items-center mb-3 gap-2">
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-[15px]">🥗</div>
            <div>
              <div className="text-[16px] font-bold tracking-tight">Nutrition Planner</div>
              <div className="text-[10px] text-white/40 hidden sm:block">Piano dieta settimanale</div>
            </div>
          </div>
          <div className="flex gap-1.5 flex-shrink-0">
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
