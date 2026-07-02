import { SS } from '../data/diets'

export default function DayTabs({ curDay, onSelectDay }) {
  return (
    <div className="bg-white dark:bg-slate-800 border-b border-bdr dark:border-slate-700 flex no-scrollbar overflow-x-auto sticky top-[76px] z-10">
      {SS.map((d, i) => (
        <button
          key={i}
          onClick={() => onSelectDay(i)}
          className={`
            px-4 py-3 text-[13px] font-semibold whitespace-nowrap border-b-2 transition-colors flex-shrink-0
            ${i === curDay
              ? 'text-navy border-navy dark:text-white dark:border-white'
              : 'text-slate-400 border-transparent hover:text-slate-600 dark:hover:text-slate-300'
            }
          `}
          style={{ minWidth: 44 }}
        >
          {d}
        </button>
      ))}
    </div>
  )
}
