import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFavoritesStore = defineStore('favorites', () => {
  const songs = ref(JSON.parse(localStorage.getItem('favorites') || '[]'))

  const count = computed(() => songs.value.length)

  function isFavorite(songId) {
    return songs.value.some(s => s.id === songId)
  }

  function toggleFavorite(song) {
    const index = songs.value.findIndex(s => s.id === song.id)
    if (index === -1) {
      songs.value.unshift(song)
    } else {
      songs.value.splice(index, 1)
    }
    localStorage.setItem('favorites', JSON.stringify(songs.value))
  }

  function addFavorite(song) {
    if (!isFavorite(song.id)) {
      songs.value.unshift(song)
      localStorage.setItem('favorites', JSON.stringify(songs.value))
    }
  }

  function removeFavorite(songId) {
    const index = songs.value.findIndex(s => s.id === songId)
    if (index !== -1) {
      songs.value.splice(index, 1)
      localStorage.setItem('favorites', JSON.stringify(songs.value))
    }
  }

  function clearAll() {
    songs.value = []
    localStorage.removeItem('favorites')
  }

  return {
    songs,
    count,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearAll
  }
})
