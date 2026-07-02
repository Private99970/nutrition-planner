import { calcMealMacro, calcMacro, r0, r1 } from '../../hooks/useMacro'
import FoodSearch from './FoodSearch'
import { SS, GG } from '../../data/diets'

export default function EditorMeal({ meal, foods, curDay, catalog, onUpdateGrams, onRemoveFood, onAddFood, onCopyMealTo }) {
  const mm = calcMealMacro(foods, catalog)

  const handleCopyMeal = (targetDay) => {
    if (foods.length === 0) { alert('Il pasto è vuoto, nulla da copiare.'); return }
    const msg = `Copia ${meal.label} di ${GG[curDay]} → ${GG[targetDay]}?\n\nIl pasto di destinazione verrà sovrascritto se presente.`
    if (window.confirm(msg)) onCopyMealTo(meal.id, targetDay)
  }

  return (
    <div
      className="bg-white dark:bg-slate-800 border border-bdr dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm"
      style={{ borderLeft: `4px solid ${meal.color}` }}
    >
      {/* Meal header */}
      <div className="px-3.5 pt-2.5 pb-2" style={{ background: `${meal.color}0f` }}>
        {/* Row 1: icon + label + macros */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[15px] flex-shrink-0">{meal.icon}</span>
          <span className="text-[11.5px] font-bold uppercase tracking-wide flex-shrink-0" style={{ color: meal.color }}>{meal.label}</span>
          <span className="flex items-center gap-1.5 text-[10.5px] font-semibold ml-1">
            <span style={{ color: '#d97706' }}>C{r0(mm.c)}</span>
            <span style={{ color: '#0d9488' }}>P{r0(mm.p)}</span>
            <span style={{ color: '#dc2626' }}>G{r0(mm.f)}</span>
          </span>
          <span className="ml-auto text-[11px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap flex-shrink-0">
            {r0(mm.k)} kcal
          </span>
        </div>
        {/* Row 2: copy buttons (wrap, aligned after label) */}
        <div className="flex items-start gap-1.5 mt-1.5">
          <span className="text-[10px] text-slate-400 flex-shrink-0 pt-0.5">Copia in:</span>
          <div className="flex flex-wrap gap-1.5">
            {SS.map((d, i) => i !== curDay && (
              <button
                key={i}
                onClick={() => handleCopyMeal(i)}
                className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-bdr2 text-slate-500 hover:bg-ind hover:border-ind hover:text-white transition-all"
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Food rows */}
      {foods.map(([food, grams], fi) => {
        const m = calcMacro(food, grams, catalog)
        const missing = !catalog[food]
        return (
          <div key={fi} className="flex items-center gap-2 px-3.5 py-2 border-t border-bdr dark:border-slate-700">
            <span className="flex-1 text-[12.5px] font-medium text-slate-800 dark:text-slate-200 min-w-0 truncate">
              {food}
              {missing && <span className="ml-1 text-amber-500 text-[10px]">⚠</span>}
            </span>
            <div className="flex items-center gap-1 flex-shrink-0">
              <input
                className="w-14 border-2 border-bdr2 dark:border-slate-600 rounded-lg px-2 py-1 text-[12px] text-center font-sans outline-none focus:border-ind dark:bg-slate-700 dark:text-white"
                type="number"
                min="1"
                max="9999"
                value={grams}
                onChange={e => onUpdateGrams(meal.id, fi, e.target.value)}
              />
              <span className="text-[11px] text-slate-400">g</span>
            </div>
            <span className="text-[10px] text-slate-400 min-w-[4.5rem] text-right hidden sm:block flex-shrink-0">
              C{r1(m.c)} P{r1(m.p)} G{r1(m.f)}
            </span>
            <button
              onClick={() => onRemoveFood(meal.id, fi)}
              className="px-2 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-600 hover:bg-red-200 transition-colors flex-shrink-0"
            >
              ✕
            </button>
          </div>
        )
      })}

      {/* Add food */}
      <FoodSearch
        catalog={catalog}
        mealId={meal.id}
        onSelect={(food, g) => onAddFood(meal.id, food, g)}
      />
    </div>
  )
}
