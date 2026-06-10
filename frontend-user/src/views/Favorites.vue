<template>
  <div class="favorites-page">
    <div class="fav-header">
      <div class="fav-header-content">
        <div class="fav-cover">
          <svg viewBox="0 0 24 24" fill="#fff" width="48" height="48">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
        <div class="fav-info">
          <h2 class="fav-title">我喜欢的音乐</h2>
          <p class="fav-count">{{ favStore.count }}首歌曲</p>
        </div>
      </div>
      <div class="fav-actions">
        <button v-if="favStore.count > 0" class="clear-all-btn" @click="handleClearAll">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          清空
        </button>
        <button class="play-all-btn" @click="handlePlayAll" :disabled="favStore.count === 0">
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          播放全部
        </button>
      </div>
    </div>

    <div v-if="favStore.count === 0" class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="64" height="64">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      <p>还没有收藏的歌曲</p>
      <span>去发现喜欢的音乐吧</span>
    </div>

    <div v-else class="fav-list">
      <div 
        v-for="(song, index) in favStore.songs" 
        :key="song.id" 
        class="fav-item"
      >
        <span class="song-index">{{ String(index + 1).padStart(2, '0') }}</span>
        <img :src="song.cover" :alt="song.name" class="song-cover" />
        <div class="song-info">
          <p class="song-name">{{ song.name }}</p>
          <p class="song-artist">{{ song.artist }}</p>
        </div>
        <button class="song-fav-btn active" @click="handleToggleFavorite(song)">
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

    <div v-if="showConfirm" class="confirm-mask" @click.self="showConfirm = false">
      <div class="confirm-dialog">
        <p class="confirm-title">确认清空收藏？</p>
        <p class="confirm-desc">清空后将无法恢复</p>
        <div class="confirm-actions">
          <button class="confirm-btn cancel" @click="showConfirm = false">取消</button>
          <button class="confirm-btn confirm" @click="confirmClear">确认清空</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFavoritesStore } from '../stores/favorites'
import { useToastStore } from '../stores/toast'
import logger from '../utils/logger'

const router = useRouter()
const favStore = useFavoritesStore()
const toast = useToastStore()
const showConfirm = ref(false)

function handlePlaySong(song) {
  toast.info(`播放: ${song.name}`)
}

function handlePlayAll() {
  if (favStore.count > 0) {
    toast.success(`开始播放 ${favStore.count} 首收藏歌曲`)
  }
}

function handleToggleFavorite(song) {
  favStore.toggleFavorite(song)
  toast.success(`已取消收藏: ${song.name}`)
}

function handleClearAll() {
  showConfirm.value = true
}

function confirmClear() {
  favStore.clearAll()
  showConfirm.value = false
  toast.success('已清空所有收藏')
  logger.log('收藏列表已清空')
}
</script>

<style scoped>
.favorites-page {
  min-height: calc(100vh - 116px);
}

.fav-header {
  background: linear-gradient(135deg, #ec4141 0%, #c93b3b 100%);
  padding: 24px 16px;
}

.fav-header-content {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.fav-cover {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.fav-info {
  flex: 1;
}

.fav-title {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
}

.fav-count {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
}

.fav-actions {
  display: flex;
  gap: 12px;
}

.play-all-btn {
  flex: 1;
  height: 40px;
  background: #fff;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: #ec4141;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: transform 0.2s, opacity 0.2s;
  cursor: pointer;
}

.play-all-btn:active {
  transform: scale(0.98);
}

.play-all-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.clear-all-btn {
  height: 40px;
  padding: 0 16px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 20px;
  font-size: 14px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: transform 0.2s, background 0.2s;
  cursor: pointer;
}

.clear-all-btn:active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 0.3);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #999;
}

.empty-state svg {
  color: #ddd;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 15px;
  color: #666;
  margin-bottom: 8px;
}

.empty-state span {
  font-size: 13px;
}

.fav-list {
  background: #fff;
  margin: 12px 0;
}

.fav-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 12px;
  transition: background 0.2s;
}

.fav-item:active {
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
  width: 20px;
  height: 20px;
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

.confirm-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.confirm-dialog {
  width: 280px;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
}

.confirm-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.confirm-desc {
  font-size: 13px;
  color: #999;
  margin-bottom: 24px;
}

.confirm-actions {
  display: flex;
  gap: 12px;
}

.confirm-btn {
  flex: 1;
  height: 40px;
  border-radius: 20px;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
}

.confirm-btn:active {
  transform: scale(0.98);
}

.confirm-btn.cancel {
  background: #f5f5f5;
  color: #666;
}

.confirm-btn.confirm {
  background: #ec4141;
  color: #fff;
}
</style>
