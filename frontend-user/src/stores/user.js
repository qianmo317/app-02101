import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  
  const isLoggedIn = computed(() => !!user.value)
  
  function login(userData) {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }
  
  function logout() {
    user.value = null
    localStorage.removeItem('user')
  }
  
  function updateProfile(data) {
    if (user.value) {
      user.value = { ...user.value, ...data }
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }
  
  return {
    user,
    isLoggedIn,
    login,
    logout,
    updateProfile
  }
})
