<template>
  <div class="profile-page">
    <!-- 用户信息卡片 -->
    <div class="user-card">
      <div class="user-header">
        <div class="avatar">
          <img 
            v-if="user?.avatar" 
            :src="user.avatar" 
            alt="头像" 
          />
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div class="user-info">
          <h2 class="nickname">{{ user?.nickname || '未登录' }}</h2>
          <div class="user-meta">
            <span class="level">Lv.{{ user?.level || 0 }}</span>
            <span class="vip">VIP</span>
          </div>
        </div>
      </div>
      
      <div class="user-stats">
        <div class="stat-item" @click="handleStatClick('听歌', user?.listenSongs || 0)">
          <span class="stat-value">{{ user?.listenSongs || 0 }}</span>
          <span class="stat-label">听歌</span>
        </div>
        <div class="stat-item" @click="handleStatClick('粉丝', user?.followers || 0)">
          <span class="stat-value">{{ user?.followers || 0 }}</span>
          <span class="stat-label">粉丝</span>
        </div>
        <div class="stat-item" @click="handleStatClick('关注', user?.following || 0)">
          <span class="stat-value">{{ user?.following || 0 }}</span>
          <span class="stat-label">关注</span>
        </div>
      </div>
    </div>

    <!-- 我的音乐 -->
    <div class="music-section">
      <h3 class="section-title">我的音乐</h3>
      <div class="music-list">
        <div 
          v-for="item in myMusic" 
          :key="item.label" 
          class="music-item"
          @click="handleMusicClick(item)"
        >
          <div class="music-icon">
            <component :is="item.icon" />
          </div>
          <span class="music-label">{{ item.label }}</span>
          <span class="music-count">{{ item.count }}</span>
          <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- 创建的歌单 -->
    <div class="playlist-section">
      <div class="section-header">
        <h3 class="section-title">创建的歌单</h3>
        <span class="playlist-count">({{ createdPlaylists.length }}个)</span>
      </div>
      <div class="playlist-list">
        <div 
          v-for="playlist in createdPlaylists" 
          :key="playlist.id" 
          class="playlist-item"
          @click="handlePlaylistClick(playlist)"
        >
          <img :src="playlist.cover" :alt="playlist.name" class="playlist-cover-img" />
          <div class="playlist-info">
            <p class="playlist-name">{{ playlist.name }}</p>
            <p class="playlist-meta">{{ playlist.songCount }}首</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 退出登录 -->
    <div class="logout-section">
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </div>
  </div>
</template>

<script setup>
import { computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useToastStore } from '../stores/toast'
import { useFavoritesStore } from '../stores/favorites'
import logger from '../utils/logger'

const router = useRouter()
const userStore = useUserStore()
const toast = useToastStore()
const favoritesStore = useFavoritesStore()

const user = computed(() => userStore.user)

const createdPlaylists = [
  { id: 1, name: '我喜欢的音乐', songCount: 168, cover: 'https://picsum.photos/seed/mylist1/100/100' },
  { id: 2, name: '深夜独处时光', songCount: 45, cover: 'https://picsum.photos/seed/mylist2/100/100' },
  { id: 3, name: '运动健身', songCount: 32, cover: 'https://picsum.photos/seed/mylist3/100/100' }
]

const HeartIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' })
    ])
  }
}

const DownloadIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
      h('polyline', { points: '7 10 12 15 17 10' }),
      h('line', { x1: '12', y1: '15', x2: '12', y2: '3' })
    ])
  }
}

const ClockIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('polyline', { points: '12 6 12 12 16 14' })
    ])
  }
}

const RadioIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '12', cy: '12', r: '2' }),
      h('path', { d: 'M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14' })
    ])
  }
}

const myMusic = computed(() => [
  { label: '我的收藏', icon: HeartIcon, count: favoritesStore.count, route: '/favorites' },
  { label: '本地下载', icon: DownloadIcon, count: 52 },
  { label: '最近播放', icon: ClockIcon, count: 300 },
  { label: '我的电台', icon: RadioIcon, count: 8 }
])

function handleStatClick(type, value) {
  toast.info(`${type}: ${value}`)
}

function handleMusicClick(item) {
  if (item.route) {
    router.push(item.route)
  } else {
    toast.info(`${item.label}: ${item.count}首`)
  }
}

function handlePlaylistClick(playlist) {
  toast.info(`打开歌单: ${playlist.name}`)
}

function handleLogout() {
  userStore.logout()
  logger.log('用户退出登录')
  toast.success('已退出登录')
  router.push('/login')
}
</script>

<style scoped>
.profile-page {
  padding-bottom: 20px;
}

.user-card {
  background: linear-gradient(135deg, #ec4141 0%, #c93b3b 100%);
  padding: 20px 16px;
  margin: 16px;
  border-radius: 16px;
}

.user-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar svg {
  width: 36px;
  height: 36px;
  color: #fff;
}

.user-info {
  flex: 1;
}

.nickname {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
}

.user-meta {
  display: flex;
  gap: 8px;
}

.level {
  font-size: 11px;
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 10px;
}

.vip {
  font-size: 11px;
  color: #f5af19;
  background: rgba(245, 175, 25, 0.2);
  padding: 2px 8px;
  border-radius: 10px;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: transform 0.2s;
}

.stat-item:active {
  transform: scale(0.95);
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.music-section,
.playlist-section {
  background: #fff;
  margin: 16px;
  border-radius: 12px;
  padding: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.music-list {
  display: flex;
  flex-direction: column;
}

.music-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  gap: 12px;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.2s;
  margin: 0 -16px;
  padding-left: 16px;
  padding-right: 16px;
}

.music-item:active {
  background: #f9f9f9;
}

.music-item:last-child {
  border-bottom: none;
}

.music-icon {
  width: 36px;
  height: 36px;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.music-icon svg {
  width: 18px;
  height: 18px;
  color: #ec4141;
}

.music-label {
  flex: 1;
  font-size: 15px;
  color: #333;
}

.music-count {
  font-size: 13px;
  color: #999;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  color: #ccc;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 16px;
}

.section-header .section-title {
  margin-bottom: 0;
}

.playlist-count {
  font-size: 13px;
  color: #999;
}

.playlist-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.playlist-item {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px;
  margin: 0 -8px;
  border-radius: 8px;
  transition: background 0.2s;
}

.playlist-item:active {
  background: #f5f5f5;
}

.playlist-cover-img {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
  background: #f0f0f0;
}

.playlist-info {
  flex: 1;
}

.playlist-name {
  font-size: 15px;
  color: #333;
  margin-bottom: 4px;
}

.playlist-meta {
  font-size: 12px;
  color: #999;
}

.logout-section {
  padding: 16px;
}

.logout-btn {
  width: 100%;
  height: 48px;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 24px;
  font-size: 15px;
  color: #333;
  transition: all 0.2s;
}

.logout-btn:active {
  background: #f5f5f5;
  transform: scale(0.98);
}
</style>
