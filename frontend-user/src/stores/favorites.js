import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref(JSON.parse(localStorage.getItem('favorites') || '[]'))

  const count = computed(() => favorites.value.length)

  function isFavorite(songId) {
    return favorites.value.some(item => item.id === songId)
  }

  function addFavorite(song) {
    if (!isFavorite(song.id)) {
      favorites.value.push({ ...song })
      localStorage.setItem('favorites', JSON.stringify(favorites.value))
    }
  }

  function removeFavorite(songId) {
    favorites.value = favorites.value.filter(item => item.id !== songId)
    localStorage.setItem('favorites', JSON.stringify(favorites.value))
  }

  function toggleFavorite(song) {
    if (isFavorite(song.id)) {
      removeFavorite(song.id)
      return false
    } else {
      addFavorite(song)
      return true
    }
  }

  function clearFavorites() {
    favorites.value = []
    localStorage.removeItem('favorites')
  }

  return {
    favorites,
    count,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites
  }
})
