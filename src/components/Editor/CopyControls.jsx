import { SS, GG } from '../../data/diets'

export function CopyDayBar({ curDay, onCopyTo }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800 no-scrollbar overflow-x-auto">
      <span className="text-[11.5px] font-semibold text-blue-800 dark:text-blue-300 whitespace-nowrap flex-shrink-0">Copia in:</span>
      {SS.map((d, i) => i !== curDay && (
        <button
          key={i}
          onClick={() => {
            if (window.confirm(`Copia ${GG[curDay]} → ${GG[i]}? Il giorno di destinazione verrà sovrascritto.`)) {
              onCopyTo(i)
            }
          }}
          className="flex-shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-800 border border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
        >
          {d}
        </button>
      ))}
    </div>
  )
}

export function MealCopyButtons({ mealId, mealLabel, curDay, onCopyMealTo }) {
  return (
    <div className="flex items-center gap-1 ml-auto">
      <span className="text-[13px] opacity-50 cursor-default" title="Copia pasto in altro giorno">📋</span>
      {SS.map((d, i) => i !== curDay && (
        <button
          key={i}
          onClick={() => onCopyMealTo(mealId, i)}
          title={`Copia ${mealLabel} in ${GG[i]}`}
          className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-bdr2 text-slate-500 hover:bg-ind hover:border-ind hover:text-white transition-all"
        >
          {d}
        </button>
      ))}
    </div>
  )
}
