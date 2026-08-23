import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { loadFromStorage, saveToStorage } from './persist.js'

export const useConfigStore = defineStore('config', () => {
  const unit = ref(loadFromStorage('config.unit', 'celsius'))
  const unitSymbol = computed(() => (unit.value === 'celsius' ? '°C' : '°F'))

  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  watch(unit, (newVal) => saveToStorage('config.unit', newVal))

  return { unit, unitSymbol, toggleUnit }
})
