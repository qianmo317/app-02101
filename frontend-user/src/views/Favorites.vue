<template>
  <div class="favorites-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2 class="page-title">我的收藏</h2>
        <p class="page-subtitle">共 {{ favoritesStore.count }} 首歌曲</p>
      </div>
      <button 
        v-if="favoritesStore.count > 0" 
        class="clear-btn"
        @click="handleClearFavorites"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
        <span>清空</span>
      </button>
    </div>

    <!-- 收藏列表 -->
    <div v-if="favoritesStore.favorites.length > 0" class="favorites-list">
      <div 
        v-for="(song, index) in favoritesStore.favorites" 
        :key="song.id" 
        class="favorite-item"
        @click="handlePlaySong(song)"
      >
        <span class="song-index">{{ String(index + 1).padStart(2, '0') }}</span>
        <img :src="song.cover" :alt="song.name" class="song-cover" />
        <div class="song-info">
          <p class="song-name">{{ song.name }}</p>
          <p class="song-artist">{{ song.artist }}{{ song.album ? ' - ' + song.album : '' }}</p>
        </div>
        <button 
          class="song-favorite-btn active" 
          @click.stop="handleToggleFavorite(song)"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
        <button class="song-play-btn" @click.stop="handlePlaySong(song)">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      <p class="empty-text">还没有收藏的歌曲</p>
      <span class="empty-hint">快去发现喜欢的音乐吧~</span>
    </div>
  </div>
</template>

<script setup>
import { useFavoritesStore } from '../stores/favorites'
import { useToastStore } from '../stores/toast'

const favoritesStore = useFavoritesStore()
const toast = useToastStore()

function handlePlaySong(song) {
  toast.info(`播放: ${song.name}`)
}

function handleToggleFavorite(song) {
  favoritesStore.toggleFavorite(song)
  toast.info('已取消收藏')
}

function handleClearFavorites() {
  if (confirm('确定要清空所有收藏吗？')) {
    favoritesStore.clearFavorites()
    toast.success('收藏已清空')
  }
}
</script>

<style scoped>
.favorites-page {
  min-height: calc(100vh - 116px);
  background: #f5f5f5;
  padding-bottom: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 16px;
  background: #fff;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.page-subtitle {
  font-size: 13px;
  color: #999;
}

.clear-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 14px;
  background: #f5f5f5;
  border-radius: 20px;
  font-size: 13px;
  color: #666;
  transition: all 0.2s;
  cursor: pointer;
}

.clear-btn:active {
  transform: scale(0.95);
  background: #e5e5e5;
}

.clear-btn svg {
  width: 16px;
  height: 16px;
}

.favorites-list {
  background: #fff;
  margin-top: 10px;
}

.favorite-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 12px;
  transition: background 0.2s;
  cursor: pointer;
}

.favorite-item:active {
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-favorite-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.2s, color 0.2s;
  cursor: pointer;
  color: #ec4141;
}

.song-favorite-btn:active {
  transform: scale(0.9);
}

.song-favorite-btn svg {
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

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  color: #999;
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
  color: #ddd;
}

.empty-text {
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
}

.empty-hint {
  font-size: 13px;
}
</style>
