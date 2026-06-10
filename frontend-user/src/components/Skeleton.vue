<template>
  <div class="skeleton" :class="type" :style="customStyle">
    <div class="skeleton-animation"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'rect' // rect, circle, text
  },
  width: String,
  height: String
})

const customStyle = computed(() => ({
  width: props.width,
  height: props.height
}))
</script>

<style scoped>
.skeleton {
  background: #f0f0f0;
  position: relative;
  overflow: hidden;
}

.skeleton.rect {
  border-radius: 8px;
}

.skeleton.circle {
  border-radius: 50%;
}

.skeleton.text {
  border-radius: 4px;
  height: 14px;
}

.skeleton-animation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
