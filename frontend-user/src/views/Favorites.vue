<template>
  <div class="favorites-page">
    <div class="favorites-header">
      <button class="back-btn" @click="goBack">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <h1 class="page-title">我的收藏</h1>
      <button v-if="favoritesStore.count > 0" class="clear-all-btn" @click="handleClearAll">清空</button>
      <span v-else class="placeholder"></span>
    </div>

    <div v-if="favoritesStore.count === 0" class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      <p>还没有收藏的歌曲</p>
      <span>去发现喜欢的音乐吧</span>
    </div>

    <div v-else class="favorites-list">
      <div class="list-info">
        <span>共 {{ favoritesStore.count }} 首</span>
      </div>
      <div
        v-for="(song, index) in favoritesStore.favorites"
        :key="song.id"
        class="song-item"
      >
        <span class="song-index">{{ String(index + 1).padStart(2, '0') }}</span>
        <img :src="song.cover" :alt="song.name" class="song-cover" />
        <div class="song-info">
          <p class="song-name">{{ song.name }}</p>
          <p class="song-artist">{{ song.artist }}</p>
        </div>
        <button class="song-fav-btn" @click="handleToggleFavorite(song)">
          <svg viewBox="0 0 24 24" fill="#ec4141" stroke="#ec4141" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        <button class="song-play-btn" @click="handlePlaySong(song)">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useFavoritesStore } from '../stores/favorites'
import { useToastStore } from '../stores/toast'

const router = useRouter()
const favoritesStore = useFavoritesStore()
const toast = useToastStore()

function goBack() {
  router.back()
}

function handlePlaySong(song) {
  toast.info(`播放: ${song.name}`)
}

function handleToggleFavorite(song) {
  favoritesStore.toggleFavorite(song)
  toast.success('已取消收藏')
}

function handleClearAll() {
  favoritesStore.clearAll()
  toast.success('收藏已清空')
}
</script>

<style scoped>
.favorites-page {
  min-height: calc(100vh - 56px);
  background: #f5f5f5;
}

.favorites-header {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fff;
  z-index: 10;
}

.back-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.back-btn:active {
  background: #f5f5f5;
}

.back-btn svg {
  width: 20px;
  height: 20px;
  color: #333;
}

.page-title {
  font-size: 17px;
  font-weight: 600;
  color: #333;
}

.clear-all-btn {
  font-size: 14px;
  color: #ec4141;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  transition: opacity 0.2s;
}

.clear-all-btn:active {
  opacity: 0.7;
}

.placeholder {
  width: 50px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  color: #999;
}

.empty-state svg {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
  color: #ddd;
}

.empty-state p {
  font-size: 15px;
  color: #666;
  margin-bottom: 8px;
}

.empty-state span {
  font-size: 13px;
}

.list-info {
  padding: 12px 16px;
  font-size: 13px;
  color: #999;
}

.favorites-list {
  background: #fff;
  border-radius: 12px;
  margin: 0 16px;
  overflow: hidden;
}

.song-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 12px;
  transition: background 0.2s;
}

.song-item:active {
  background: #f5f5f5;
}

.song-index {
  font-size: 14px;
  color: #999;
  width: 24px;
}

.song-cover {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  flex-shrink: 0;
  object-fit: cover;
  background: #f0f0f0;
}

.song-info {
  flex: 1;
  min-width: 0;
}

.song-name {
  font-size: 15px;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-artist {
  font-size: 12px;
  color: #999;
}

.song-fav-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.2s;
  cursor: pointer;
}

.song-fav-btn:active {
  transform: scale(0.9);
}

.song-fav-btn svg {
  width: 18px;
  height: 18px;
}

.song-play-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #e5e5e5;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.2s, border-color 0.2s;
  cursor: pointer;
}

.song-play-btn:active {
  transform: scale(0.9);
  border-color: #ec4141;
}

.song-play-btn svg {
  width: 12px;
  height: 12px;
  color: #ec4141;
  margin-left: 2px;
}
</style>
