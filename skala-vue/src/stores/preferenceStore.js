import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { loadFromStorage, saveToStorage } from './persist.js'

export const usePreferenceStore = defineStore('preference', () => {
  // 기본값은 둘 다 미선택 상태 (필터를 아예 안 건 것과 동일)
  const rainFilter = ref(loadFromStorage('preference.rainFilter', 'all')) // 'all' | 'rain' | 'no-rain'
  const tempFilter = ref(loadFromStorage('preference.tempFilter', null)) // null | 'hot' | 'cool'

  const isFilterActive = computed(() => rainFilter.value !== 'all' || tempFilter.value !== null)

  // 같은 버튼을 다시 누르면 선택 해제
  function setRainFilter(value) {
    rainFilter.value = rainFilter.value === value ? 'all' : value
  }
  function setTempFilter(value) {
    tempFilter.value = tempFilter.value === value ? null : value
  }
  function resetFilters() {
    rainFilter.value = 'all'
    tempFilter.value = null
  }

  watch([rainFilter, tempFilter], () => {
    saveToStorage('preference.rainFilter', rainFilter.value)
    saveToStorage('preference.tempFilter', tempFilter.value)
  })

  return {
    rainFilter,
    tempFilter,
    isFilterActive,
    setRainFilter,
    setTempFilter,
    resetFilters,
  }
})
