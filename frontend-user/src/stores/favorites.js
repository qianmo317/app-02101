import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref(JSON.parse(localStorage.getItem('favorites') || '[]'))

  const favoriteIds = computed(() => favorites.value.map(s => s.id))

  const count = computed(() => favorites.value.length)

  function isFavorite(songId) {
    return favoriteIds.value.includes(songId)
  }

  function toggleFavorite(song) {
    const index = favorites.value.findIndex(s => s.id === song.id)
    if (index > -1) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.unshift({ id: song.id, name: song.name, artist: song.artist, cover: song.cover })
    }
    localStorage.setItem('favorites', JSON.stringify(favorites.value))
  }

  function clearAll() {
    favorites.value = []
    localStorage.removeItem('favorites')
  }

  return {
    favorites,
    favoriteIds,
    count,
    isFavorite,
    toggleFavorite,
    clearAll
  }
})
