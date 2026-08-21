import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { loadFromStorage, saveToStorage } from './persist.js'

const MAX_HISTORY = 5

export const useSearchHistoryStore = defineStore('searchHistory', () => {
  const history = ref(loadFromStorage('searchHistory.list', []))
  const recentSearches = computed(() => history.value.slice(0, MAX_HISTORY))

  function addSearch(query) {
    const trimmed = query.trim()
    if (!trimmed) return

    history.value = [trimmed, ...history.value.filter((item) => item !== trimmed)].slice(
      0,
      MAX_HISTORY,
    )
  }

  watch(history, (newVal) => saveToStorage('searchHistory.list', newVal), { deep: true })

  return { history, recentSearches, addSearch }
})
