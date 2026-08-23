import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { loadFromStorage, saveToStorage } from './persist.js'

const TEMP_MIN = 0
const TEMP_MAX = 40

export const usePreferenceStore = defineStore('preference', () => {
  // 기본값은 미선택 상태 (필터를 아예 안 건 것과 동일)
  const rainFilter = ref(loadFromStorage('preference.rainFilter', 'all')) // 'all' | 'rain' | 'no-rain'
  const tempRange = ref(loadFromStorage('preference.tempRange', [TEMP_MIN, TEMP_MAX])) // [최저, 최고]

  const isFilterActive = computed(
    () =>
      rainFilter.value !== 'all' ||
      tempRange.value[0] !== TEMP_MIN ||
      tempRange.value[1] !== TEMP_MAX,
  )

  // 같은 버튼을 다시 누르면 선택 해제
  function setRainFilter(value) {
    rainFilter.value = rainFilter.value === value ? 'all' : value
  }
  function setTempRange(range) {
    tempRange.value = range
  }
  function resetFilters() {
    rainFilter.value = 'all'
    tempRange.value = [TEMP_MIN, TEMP_MAX]
  }

  watch([rainFilter, tempRange], () => {
    saveToStorage('preference.rainFilter', rainFilter.value)
    saveToStorage('preference.tempRange', tempRange.value)
  })

  return {
    rainFilter,
    tempRange,
    TEMP_MIN,
    TEMP_MAX,
    isFilterActive,
    setRainFilter,
    setTempRange,
    resetFilters,
  }
})
