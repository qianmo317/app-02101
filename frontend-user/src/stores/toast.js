import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const message = ref('')
  const visible = ref(false)
  const type = ref('info') // info, success, error
  let timer = null
  
  function show(msg, msgType = 'info', duration = 2000) {
    message.value = msg
    type.value = msgType
    visible.value = true
    
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      visible.value = false
    }, duration)
  }
  
  function success(msg, duration) {
    show(msg, 'success', duration)
  }
  
  function error(msg, duration) {
    show(msg, 'error', duration)
  }
  
  function info(msg, duration) {
    show(msg, 'info', duration)
  }
  
  return {
    message,
    visible,
    type,
    show,
    success,
    error,
    info
  }
})
