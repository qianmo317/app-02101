<template>
  <div class="main-layout">
    <header class="header">
      <div class="header-content">
        <h1 class="header-title">{{ pageTitle }}</h1>
      </div>
    </header>
    
    <main class="main-content">
      <router-view />
    </main>
    
    <nav class="tab-bar">
      <router-link 
        v-for="tab in tabs" 
        :key="tab.path" 
        :to="tab.path" 
        class="tab-item"
        :class="{ active: currentPath === tab.path }"
      >
        <component :is="tab.icon" class="tab-icon" />
        <span class="tab-label">{{ tab.label }}</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { computed, h } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const currentPath = computed(() => route.path)

const pageTitle = computed(() => {
  const titles = {
    '/': '发现音乐',
    '/search': '搜索',
    '/profile': '我的'
  }
  return titles[route.path] || '网易云音乐'
})

const HomeIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }),
      h('polyline', { points: '9 22 9 12 15 12 15 22' })
    ])
  }
}

const SearchIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '11', cy: '11', r: '8' }),
      h('line', { x1: '21', y1: '21', x2: '16.65', y2: '16.65' })
    ])
  }
}

const ProfileIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' }),
      h('circle', { cx: '12', cy: '7', r: '4' })
    ])
  }
}

const tabs = [
  { path: '/', label: '首页', icon: HomeIcon },
  { path: '/search', label: '搜索', icon: SearchIcon },
  { path: '/profile', label: '我的', icon: ProfileIcon }
]
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: #ec4141;
  z-index: 100;
}

.header-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

.main-content {
  flex: 1;
  padding-top: 56px;
  padding-bottom: 60px;
  overflow-y: auto;
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #fff;
  display: flex;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #999;
  transition: color 0.3s, transform 0.2s;
}

.tab-item:active {
  transform: scale(0.9);
}

.tab-item.active {
  color: #ec4141;
}

.tab-icon {
  width: 24px;
  height: 24px;
  transition: transform 0.2s;
}

.tab-item.active .tab-icon {
  animation: tabBounce 0.3s ease;
}

@keyframes tabBounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.tab-label {
  font-size: 11px;
}
</style>
