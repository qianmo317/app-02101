<template>
  <div class="favorites-page">
    <div class="page-header">
      <button class="back-btn" @click="goBack">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <h2 class="page-title">我的收藏</h2>
      <button 
        class="clear-btn" 
        :disabled="favoritesStore.count === 0"
        @click="handleClear"
      >
        清空
      </button>
    </div>

    <div class="count-bar">
      共 {{ favoritesStore.count }} 首
    </div>

    <div v-if="favoritesStore.count === 0" class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      <p>暂无收藏歌曲</p>
      <span>去发现更多好听的音乐吧</span>
    </div>

    <div v-else class="song-list">
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
        <button 
          class="song-fav-btn active" 
          @click="handleRemove(song)"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
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

    <!-- 清空确认弹窗 -->
    <div v-if="showConfirm" class="confirm-mask" @click="showConfirm = false">
      <div class="confirm-dialog" @click.stop>
        <h3>确认清空</h3>
        <p>确定要清空所有收藏的歌曲吗？此操作不可恢复。</p>
        <div class="confirm-actions">
          <button class="confirm-btn cancel" @click="showConfirm = false">取消</button>
          <button class="confirm-btn confirm" @click="confirmClear">确定</button>
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
const favoritesStore = useFavoritesStore()
const toast = useToastStore()
const showConfirm = ref(false)

function goBack() {
  router.back()
}

function handlePlaySong(song) {
  toast.info(`播放: ${song.name}`)
}

function handleRemove(song) {
  favoritesStore.removeFavorite(song.id)
  toast.info(`已取消收藏: ${song.name}`)
}

function handleClear() {
  if (favoritesStore.count === 0) return
  showConfirm.value = true
}

function confirmClear() {
  favoritesStore.clearFavorites()
  showConfirm.value = false
  toast.success('收藏列表已清空')
  logger.log('清空收藏列表')
}
</script>

<style scoped>
.favorites-page {
  min-height: calc(100vh - 116px);
  background: #f5f5f5;
}

.page-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.back-btn {
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.back-btn svg {
  width: 20px;
  height: 20px;
  color: #333;
}

.page-title {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-right: 32px;
}

.clear-btn {
  font-size: 14px;
  color: #ec4141;
  background: transparent;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
}

.clear-btn:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.count-bar {
  padding: 12px 16px;
  font-size: 13px;
  color: #999;
  background: #fff;
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

.song-list {
  background: #fff;
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
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 4px;
  transition: transform 0.2s;
  cursor: pointer;
}

.song-fav-btn:active {
  transform: scale(0.85);
}

.song-fav-btn svg {
  width: 18px;
  height: 18px;
  color: #ec4141;
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
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.confirm-dialog {
  background: #fff;
  width: 80%;
  max-width: 320px;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.confirm-dialog h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.confirm-dialog p {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 20px;
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
  transition: opacity 0.2s;
}

.confirm-btn.cancel {
  background: #f5f5f5;
  color: #666;
}

.confirm-btn.confirm {
  background: #ec4141;
  color: #fff;
}

.confirm-btn:active {
  opacity: 0.8;
}
</style>
