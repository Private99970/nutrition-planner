import { useState, useCallback } from 'react'
import { BASE_CAT } from '../data/catalog'

const LS_KEY = 'np_custom_foods_v1'

function load() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}') }
  catch { return {} }
}

export function useCatalog() {
  const [customFoods, setCustomFoods] = useState(load)

  const catalog = { ...BASE_CAT, ...customFoods }

  const persist = (next) => {
    setCustomFoods(next)
    localStorage.setItem(LS_KEY, JSON.stringify(next))
  }

  const addFood = useCallback((name, kcal, prot, carbs, fat) => {
    setCustomFoods(prev => {
      const next = { ...prev, [name]: [kcal, prot, carbs, fat] }
      localStorage.setItem(LS_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const editFood = useCallback((oldName, name, kcal, prot, carbs, fat) => {
    setCustomFoods(prev => {
      const next = { ...prev }
      if (oldName !== name) delete next[oldName]
      next[name] = [kcal, prot, carbs, fat]
      localStorage.setItem(LS_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const deleteFood = useCallback((name) => {
    setCustomFoods(prev => {
      const next = { ...prev }
      delete next[name]
      localStorage.setItem(LS_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { catalog, customFoods, baseFoods: BASE_CAT, addFood, editFood, deleteFood }
}
