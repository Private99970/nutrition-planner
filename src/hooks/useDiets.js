import { useState, useCallback } from 'react'
import { BASE_DIETS } from '../data/diets'

const LS_CUSTOM = 'np_custom_v2'
const LS_DRAFT  = 'np_draft_v2'

function loadCustom() {
  try { return JSON.parse(localStorage.getItem(LS_CUSTOM) || '{}') }
  catch { return {} }
}

function loadDraft() {
  try { return JSON.parse(localStorage.getItem(LS_DRAFT) || 'null') }
  catch { return null }
}

function buildDiets(custom) {
  const result = {}
  for (const [k, v] of Object.entries(BASE_DIETS)) result[k] = { ...v, custom: false }
  for (const [k, v] of Object.entries(custom)) result[k] = { ...v, custom: true }
  return result
}

export function useDiets() {
  const [customDiets, setCustomDiets] = useState(loadCustom)
  const [draft, setDraft] = useState(loadDraft)

  const diets = buildDiets(customDiets)
  const dietNames = Object.keys(diets)

  const saveDiet = useCallback((name, targets, days) => {
    setCustomDiets(prev => {
      const next = { ...prev, [name]: { targets, days, custom: true } }
      localStorage.setItem(LS_CUSTOM, JSON.stringify(next))
      return next
    })
  }, [])

  const deleteDiet = useCallback((name) => {
    setCustomDiets(prev => {
      const next = { ...prev }
      delete next[name]
      localStorage.setItem(LS_CUSTOM, JSON.stringify(next))
      return next
    })
  }, [])

  const saveDraft = useCallback((data) => {
    const withTs = { ...data, ts: Date.now() }
    setDraft(withTs)
    localStorage.setItem(LS_DRAFT, JSON.stringify(withTs))
  }, [])

  const clearDraft = useCallback(() => {
    setDraft(null)
    localStorage.removeItem(LS_DRAFT)
  }, [])

  // Esporta tutte le diete personali in un file JSON (backup)
  const exportDiets = useCallback(() => {
    const payload = {
      type: 'nutrition-planner-backup',
      version: 1,
      exportedAt: new Date().toISOString(),
      diets: customDiets,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `diete-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    return Object.keys(customDiets).length
  }, [customDiets])

  // Importa diete da un file JSON (le aggiunge / sovrascrive quelle con lo stesso nome)
  const importDiets = useCallback((jsonText) => {
    let parsed
    try { parsed = JSON.parse(jsonText) } catch { return { ok: false, error: 'File non valido' } }
    const incoming = parsed && parsed.diets ? parsed.diets : parsed
    if (!incoming || typeof incoming !== 'object') return { ok: false, error: 'Formato non riconosciuto' }
    const valid = Object.entries(incoming).filter(([, v]) => v && v.targets && v.days)
    if (valid.length === 0) return { ok: false, error: 'Nessuna dieta valida nel file' }
    setCustomDiets(prev => {
      const next = { ...prev }
      for (const [k, v] of valid) next[k] = { targets: v.targets, days: v.days, custom: true }
      localStorage.setItem(LS_CUSTOM, JSON.stringify(next))
      return next
    })
    return { ok: true, count: valid.length }
  }, [])

  return { diets, dietNames, saveDiet, deleteDiet, draft, saveDraft, clearDraft, exportDiets, importDiets }
}
