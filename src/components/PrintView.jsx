import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { calcDayMacro, calcMealMacro, r0, kcalTarget } from '../hooks/useMacro'
import { MEAL_DEFS, GG } from '../data/diets'

// Adatta automaticamente la stampa a UNA sola pagina A4 orizzontale (zoom-to-fit).
function useFitToPage() {
  useEffect(() => {
    const mmToPx = (mm) => (mm * 96) / 25.4
    const before = () => {
      const el = document.getElementById('print-view')
      if (!el) return
      el.style.zoom = '1'
      el.style.width = '277mm'
      // altezza A4 orizzontale (210mm) meno margini 10mm + un piccolo margine di sicurezza
      const availH = mmToPx(210 - 20 - 4)
      const h = el.scrollHeight
      if (h > availH) {
        const s = Math.max(0.4, availH / h)
        el.style.zoom = String(s)
        // allarga il contenuto così, una volta rimpicciolito, riempie la larghezza del foglio
        el.style.width = (276 / s) + 'mm'
      }
    }
    const after = () => {
      const el = document.getElementById('print-view')
      if (el) { el.style.zoom = '1'; el.style.width = '277mm' }
    }
    window.addEventListener('beforeprint', before)
    window.addEventListener('afterprint', after)
    return () => {
      window.removeEventListener('beforeprint', before)
      window.removeEventListener('afterprint', after)
    }
  }, [])
}

function PrintContent({ diet, name, catalog }) {
  const t = diet.targets
  useFitToPage()

  return (
    <div id="print-view">
      <div style={{ textAlign: 'center', marginBottom: 8, paddingBottom: 6, borderBottom: '2px solid #1e293b' }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#1e293b' }}>🥗 {name}</div>
        <div style={{ fontSize: 9, color: '#64748b', marginTop: 2 }}>
          Target: {t.C}g Carbo · {t.P}g Proteine · {t.G}g Grassi · ~{kcalTarget(t)} kcal
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 8 }}>
        <thead>
          <tr>
            <th style={{ background: '#1e293b', color: '#fff', padding: '5px 6px', textAlign: 'left', fontSize: 7.5 }}>Giorno</th>
            {MEAL_DEFS.map(md => (
              <th key={md.id} style={{ background: '#334155', color: '#fff', padding: '5px 6px', textAlign: 'center', fontSize: 7.5 }}>
                {md.icon} {md.label}
              </th>
            ))}
            <th style={{ background: '#334155', color: '#fff', padding: '5px 6px', textAlign: 'center', fontSize: 7.5 }}>Totali</th>
          </tr>
        </thead>
        <tbody>
          {diet.days.map((day, di) => {
            const tot = calcDayMacro(day, catalog, MEAL_DEFS)
            return (
              <tr key={di}>
                <td style={{ border: '1px solid #e2e8f0', padding: '4px 5px', fontWeight: 800, fontSize: 9, color: '#1e293b', background: '#f8fafc', whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                  {GG[di]}
                </td>
                {MEAL_DEFS.map(md => (
                  <td key={md.id} style={{ border: '1px solid #e2e8f0', padding: '4px 5px', verticalAlign: 'top' }}>
                    <div style={{ fontSize: 7, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748b', marginBottom: 2 }}>{md.label}</div>
                    {(day[md.id] || []).map(([f, g], fi) => (
                      <div key={fi} style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #f1f5f9', fontSize: 7.5 }}>
                        <span>{f}</span>
                        <span style={{ fontWeight: 700, color: '#1e293b', marginLeft: 3, whiteSpace: 'nowrap' }}>{g}g</span>
                      </div>
                    ))}
                  </td>
                ))}
                <td style={{ border: '1px solid #e2e8f0', padding: '4px 5px', background: '#f8fafc', fontSize: 8, color: '#475569', lineHeight: 1.7, verticalAlign: 'top' }}>
                  <strong style={{ fontSize: 9 }}>{r0(tot.k)} kcal</strong><br />
                  C:{r0(tot.c)}/{t.C}g<br />
                  P:{r0(tot.p)}/{t.P}g<br />
                  G:{r0(tot.f)}/{t.G}g
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function PrintView({ diet, name, catalog }) {
  if (!diet) return null
  return createPortal(
    <PrintContent diet={diet} name={name} catalog={catalog} />,
    document.body
  )
}
