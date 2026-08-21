import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { loadFromStorage, saveToStorage } from './persist.js'

export const useFavoriteStore = defineStore('favorite', () => {
  const favoriteIds = ref(loadFromStorage('favorite.ids', []))

  function isFavorite(id) {
    return favoriteIds.value.includes(id)
  }

  function toggleFavorite(id) {
    if (favoriteIds.value.includes(id)) {
      favoriteIds.value = favoriteIds.value.filter((favId) => favId !== id)
    } else {
      favoriteIds.value.push(id)
    }
  }

  watch(favoriteIds, (newVal) => saveToStorage('favorite.ids', newVal), { deep: true })

  return { favoriteIds, isFavorite, toggleFavorite }
})
