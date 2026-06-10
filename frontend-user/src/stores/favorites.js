import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref(JSON.parse(localStorage.getItem('favorites') || '[]'))

  const favoriteIds = computed(() => favorites.value.map(song => song.id))

  const count = computed(() => favorites.value.length)

  function isFavorite(songId) {
    return favoriteIds.value.includes(songId)
  }

  function toggleFavorite(song) {
    const index = favorites.value.findIndex(s => s.id === song.id)
    if (index > -1) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.unshift(song)
    }
    persistToStorage()
  }

  function addFavorite(song) {
    if (!isFavorite(song.id)) {
      favorites.value.unshift(song)
      persistToStorage()
    }
  }

  function removeFavorite(songId) {
    const index = favorites.value.findIndex(s => s.id === songId)
    if (index > -1) {
      favorites.value.splice(index, 1)
      persistToStorage()
    }
  }

  function clearFavorites() {
    favorites.value = []
    persistToStorage()
  }

  function persistToStorage() {
    localStorage.setItem('favorites', JSON.stringify(favorites.value))
  }

  return {
    favorites,
    favoriteIds,
    count,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites
  }
})
