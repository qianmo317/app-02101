<template>
  <div class="error-retry">
    <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    <p class="error-text">{{ message }}</p>
    <button class="retry-btn" @click="$emit('retry')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="23 4 23 10 17 10"/>
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
      </svg>
      点击重试
    </button>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: '加载失败'
  }
})

defineEmits(['retry'])
</script>

<style scoped>
.error-retry {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #999;
}

.error-icon {
  width: 48px;
  height: 48px;
  color: #ddd;
  margin-bottom: 12px;
}

.error-text {
  font-size: 14px;
  margin-bottom: 16px;
}

.retry-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #f5f5f5;
  border-radius: 20px;
  font-size: 13px;
  color: #666;
  transition: all 0.2s;
}

.retry-btn:active {
  transform: scale(0.95);
  background: #eee;
}

.retry-btn svg {
  width: 14px;
  height: 14px;
}
</style>
