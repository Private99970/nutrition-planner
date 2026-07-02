export default function DietPills({ dietNames, diets, curDietIdx, onSelectDiet, onEditDiet, onNewDiet }) {
  return (
    <div className="flex gap-1.5 no-scrollbar overflow-x-auto pb-3 items-center">
      {dietNames.map((name, i) => {
        const d = diets[name]
        const isOn = i === curDietIdx
        const isCustom = d?.custom
        return (
          <div key={name} className="flex items-center flex-shrink-0">
            <button
              onClick={() => onSelectDiet(i)}
              className={`
                px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap transition-all
                ${isCustom
                  ? `border rounded-l-full border-r-0 ${isOn ? 'bg-ind/40 border-indigo-400 text-white' : 'border-indigo-400/40 text-indigo-300 hover:border-indigo-300'}`
                  : `border rounded-l-full border-r-0 ${isOn ? 'bg-white/18 border-white/40 text-white' : 'border-white/18 text-white/55 hover:text-white/80'}`
                }
              `}
              style={{ borderRadius: '999px 0 0 999px' }}
            >
              {name}
            </button>
            <button
              onClick={() => onEditDiet(name)}
              className={`
                px-2 py-1.5 text-[10px] border rounded-r-full transition-all
                ${isCustom
                  ? `border-indigo-400/40 ${isOn ? 'bg-ind/20 text-indigo-300' : 'text-white/40 hover:text-white hover:bg-white/15'}`
                  : `border-white/18 ${isOn ? 'bg-white/10 text-white/70' : 'text-white/40 hover:text-white hover:bg-white/15'}`
                }
              `}
              style={{ borderRadius: '0 999px 999px 0', borderLeft: '1px solid rgba(255,255,255,0.1)' }}
              title="Modifica"
            >
              ✎
            </button>
          </div>
        )
      })}
      <button
        onClick={onNewDiet}
        className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold text-white/40 border border-dashed border-white/30 hover:border-white/60 hover:text-white/80 transition-all whitespace-nowrap"
      >
        ＋ Nuova
      </button>
    </div>
  )
}
