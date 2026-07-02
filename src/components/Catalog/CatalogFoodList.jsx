export default function CatalogFoodList({ title, foods, isCustom, onEdit, onDelete, query }) {
  const entries = Object.entries(foods)
    .filter(([name]) => !query || name.toLowerCase().includes(query.toLowerCase()))
    .sort(([a], [b]) => a.localeCompare(b))

  if (!entries.length) return null

  return (
    <div className="mb-4">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">{title}</div>
      <div className="divide-y divide-bdr dark:divide-slate-700 border border-bdr dark:border-slate-700 rounded-xl overflow-hidden">
        {entries.map(([name, vals]) => (
          <div key={name} className="flex items-center gap-2 px-3 py-2.5 bg-white dark:bg-slate-800 hover:bg-surf2 dark:hover:bg-slate-750 transition-colors">
            <span className="flex-1 text-[12.5px] font-medium text-slate-800 dark:text-slate-200">{name}</span>
            <span className="text-[10px] text-slate-400 flex gap-2 flex-shrink-0">
              <span title="Kcal">🔥{Math.round(vals[0])}</span>
              <span style={{color:'#d97706'}}>C{vals[2]}</span>
              <span style={{color:'#0d9488'}}>P{vals[1]}</span>
              <span style={{color:'#dc2626'}}>G{vals[3]}</span>
            </span>
            {isCustom && (
              <div className="flex gap-1 flex-shrink-0 ml-1">
                <button
                  onClick={() => onEdit(name, vals)}
                  className="px-2 py-1 text-[10px] rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-ind dark:text-indigo-400 hover:bg-indigo-100 transition-colors font-bold"
                >
                  ✎
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Eliminare "${name}" dal catalogo?`)) onDelete(name)
                  }}
                  className="px-2 py-1 text-[10px] rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-colors font-bold"
                >
                  🗑
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
