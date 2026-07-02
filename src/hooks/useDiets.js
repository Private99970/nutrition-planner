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

  return { diets, dietNames, saveDiet, deleteDiet, draft, saveDraft, clearDraft }
}
