<template>
  <div class="home-page">
    <!-- Banner轮播 -->
    <div class="banner-section">
      <div v-if="loading" class="banner-skeleton">
        <Skeleton type="rect" width="100%" height="140px" />
      </div>
      <div v-else-if="error" class="banner-error">
        <ErrorRetry message="加载失败" @retry="fetchData" />
      </div>
      <div v-else class="banner-wrapper">
        <div 
          class="banner-track" 
          :style="{ transform: `translateX(-${currentBanner * 100}%)` }"
        >
          <div 
            v-for="(banner, index) in banners" 
            :key="index" 
            class="banner-item"
          >
            <img :src="banner.image" :alt="banner.title" class="banner-bg" />
            <div class="banner-content">
              <h3>{{ banner.title }}</h3>
              <p>{{ banner.desc }}</p>
            </div>
          </div>
        </div>
        <div class="banner-dots">
          <span 
            v-for="(_, index) in banners" 
            :key="index"
            class="dot"
            :class="{ active: currentBanner === index }"
            @click="currentBanner = index"
          ></span>
        </div>
      </div>
    </div>

    <!-- 推荐歌单 -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">推荐歌单</h2>
      </div>
      
      <!-- 骨架屏 -->
      <div v-if="loading" class="playlist-grid">
        <div v-for="i in 6" :key="i" class="playlist-skeleton">
          <Skeleton type="rect" width="100%" style="padding-bottom: 100%;" />
          <Skeleton type="text" width="80%" style="margin-top: 8px;" />
        </div>
      </div>
      
      <!-- 错误重试 -->
      <ErrorRetry v-else-if="error" message="歌单加载失败" @retry="fetchData" />
      
      <!-- 正常内容 -->
      <div v-else class="playlist-grid">
        <div 
          v-for="playlist in playlists" 
          :key="playlist.id" 
          class="playlist-item"
        >
          <div class="playlist-cover">
            <img :src="playlist.cover" :alt="playlist.name" />
            <span class="play-count">
              <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              {{ formatCount(playlist.playCount) }}
            </span>
            <button class="play-btn" @click.stop="handlePlaylist(playlist)">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </button>
          </div>
          <p class="playlist-name">{{ playlist.name }}</p>
        </div>
      </div>
    </section>

    <!-- 新歌推荐 -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">新歌推荐</h2>
      </div>
      
      <!-- 骨架屏 -->
      <div v-if="loading" class="song-list">
        <div v-for="i in 5" :key="i" class="song-skeleton">
          <Skeleton type="text" width="24px" />
          <Skeleton type="rect" width="48px" height="48px" />
          <div class="song-skeleton-info">
            <Skeleton type="text" width="60%" />
            <Skeleton type="text" width="40%" style="margin-top: 8px;" />
          </div>
        </div>
      </div>
      
      <!-- 错误重试 -->
      <ErrorRetry v-else-if="error" message="新歌加载失败" @retry="fetchData" />
      
      <!-- 正常内容 -->
      <div v-else class="song-list">
        <div 
          v-for="(song, index) in newSongs" 
          :key="song.id" 
          class="song-item"
        >
          <span class="song-index">{{ String(index + 1).padStart(2, '0') }}</span>
          <img :src="song.cover" :alt="song.name" class="song-cover" />
          <div class="song-info">
            <p class="song-name">{{ song.name }}</p>
            <p class="song-artist">{{ song.artist }}</p>
          </div>
          <button class="song-play-btn" @click="handlePlaySong(song)">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Skeleton from '../components/Skeleton.vue'
import ErrorRetry from '../components/ErrorRetry.vue'
import { useToastStore } from '../stores/toast'
import config from '../config'
import logger from '../utils/logger'

const toast = useToastStore()
const currentBanner = ref(0)
const loading = ref(true)
const error = ref(false)
let bannerTimer = null

const banners = ref([])
const playlists = ref([])
const newSongs = ref([])

function formatCount(count) {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万'
  }
  return count
}

function handlePlaylist(playlist) {
  toast.info(`播放歌单: ${playlist.name}`)
}

function handlePlaySong(song) {
  toast.info(`播放: ${song.name}`)
}

async function fetchData() {
  try {
    loading.value = true
    error.value = false
    
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 800))
    
    banners.value = [
      { title: '每日推荐', desc: '根据你的口味生成专属歌单', image: 'https://picsum.photos/seed/music1/800/400' },
      { title: '私人FM', desc: '懂你的音乐电台', image: 'https://picsum.photos/seed/music2/800/400' },
      { title: '排行榜', desc: '发现最热门的音乐', image: 'https://picsum.photos/seed/music3/800/400' }
    ]
    
    playlists.value = [
      { id: 1, name: '治愈系轻音乐，放松心情', playCount: 128000, cover: 'https://picsum.photos/seed/playlist1/300/300' },
      { id: 2, name: '华语经典老歌回忆录', playCount: 256000, cover: 'https://picsum.photos/seed/playlist2/300/300' },
      { id: 3, name: '欧美流行音乐精选', playCount: 89000, cover: 'https://picsum.photos/seed/playlist3/300/300' },
      { id: 4, name: '深夜电台陪你入眠', playCount: 167000, cover: 'https://picsum.photos/seed/playlist4/300/300' },
      { id: 5, name: '运动健身必备歌单', playCount: 98000, cover: 'https://picsum.photos/seed/playlist5/300/300' },
      { id: 6, name: '学习工作专注音乐', playCount: 203000, cover: 'https://picsum.photos/seed/playlist6/300/300' }
    ]
    
    newSongs.value = [
      { id: 1, name: '晴天', artist: '周杰伦', cover: 'https://picsum.photos/seed/song1/100/100' },
      { id: 2, name: '稻香', artist: '周杰伦', cover: 'https://picsum.photos/seed/song2/100/100' },
      { id: 3, name: '七里香', artist: '周杰伦', cover: 'https://picsum.photos/seed/song3/100/100' },
      { id: 4, name: '青花瓷', artist: '周杰伦', cover: 'https://picsum.photos/seed/song4/100/100' },
      { id: 5, name: '夜曲', artist: '周杰伦', cover: 'https://picsum.photos/seed/song5/100/100' }
    ]
    
    logger.log('首页数据加载成功')
  } catch (err) {
    logger.error('获取首页数据失败:', err)
    error.value = true
    toast.error('数据加载失败，请重试')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchData()
  bannerTimer = setInterval(() => {
    if (banners.value.length > 0) {
      currentBanner.value = (currentBanner.value + 1) % banners.value.length
    }
  }, config.banner.autoPlayInterval)
})

onUnmounted(() => {
  if (bannerTimer) {
    clearInterval(bannerTimer)
  }
})
</script>

<style scoped>
.home-page {
  padding-bottom: 20px;
}

.banner-section {
  padding: 16px;
}

.banner-skeleton,
.banner-error {
  border-radius: 12px;
  overflow: hidden;
}

.banner-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

.banner-track {
  display: flex;
  transition: transform 0.5s ease;
}

.banner-item {
  min-width: 100%;
  height: 140px;
  display: flex;
  align-items: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.banner-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-content {
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.banner-content h3 {
  color: #fff;
  font-size: 20px;
  margin-bottom: 8px;
}

.banner-content p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.banner-dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s;
}

.dot.active {
  width: 18px;
  background: #fff;
}

.section {
  margin-top: 24px;
  padding: 0 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.playlist-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

/* 响应式适配 */
@media (max-width: 320px) {
  .playlist-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 600px) {
  .playlist-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 900px) {
  .playlist-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

.playlist-skeleton {
  display: flex;
  flex-direction: column;
}

.playlist-item {
  cursor: pointer;
}

.playlist-cover {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  border-radius: 8px;
  overflow: hidden;
  background: #f0f0f0;
}

.playlist-cover img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-count {
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 10px;
  color: #fff;
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 6px;
  border-radius: 10px;
}

.play-btn {
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.play-btn:active {
  transform: scale(0.9);
  box-shadow: 0 2px 8px rgba(236, 65, 65, 0.4);
}

.play-btn svg {
  width: 12px;
  height: 12px;
  color: #ec4141;
  margin-left: 2px;
}

.playlist-name {
  font-size: 12px;
  color: #333;
  margin-top: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.song-list {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.song-skeleton {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 12px;
}

.song-skeleton-info {
  flex: 1;
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
