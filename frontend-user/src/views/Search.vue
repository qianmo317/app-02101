<template>
  <div class="search-page">
    <!-- 搜索框 -->
    <div class="search-header">
      <div class="search-input-wrapper">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="搜索歌曲、歌手、专辑"
          :maxlength="config.search.maxInputLength"
          @input="handleSearchInput"
          @focus="showHistory = true"
        />
        <button v-if="searchQuery" class="clear-btn" @click="clearSearch">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15" stroke="white" stroke-width="2"/>
            <line x1="9" y1="9" x2="15" y2="15" stroke="white" stroke-width="2"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 搜索历史 -->
    <div v-if="!searchQuery && searchHistory.length > 0" class="search-history">
      <div class="history-header">
        <h3>搜索历史</h3>
        <button class="clear-history" @click="clearHistory">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </div>
      <div class="history-tags">
        <span 
          v-for="(item, index) in searchHistory" 
          :key="index"
          class="history-tag"
          @click="searchFromHistory(item)"
        >
          {{ item }}
        </span>
      </div>
    </div>

    <!-- 热门搜索 -->
    <div v-if="!searchQuery" class="hot-search">
      <h3 class="section-title">热门搜索</h3>
      <div class="hot-list">
        <div 
          v-for="(item, index) in hotSearches" 
          :key="index"
          class="hot-item"
          @click="searchFromHot(item.keyword)"
        >
          <span class="hot-rank" :class="{ top: index < 3 }">{{ index + 1 }}</span>
          <span class="hot-keyword">{{ item.keyword }}</span>
          <span v-if="item.hot" class="hot-badge">热</span>
        </div>
      </div>
    </div>

    <!-- 搜索中 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <span>搜索中...</span>
    </div>

    <!-- 搜索结果 -->
    <div v-else-if="searchQuery && searchResults.length > 0" class="search-results">
      <div class="result-tabs">
        <button 
          v-for="tab in resultTabs" 
          :key="tab.key"
          class="tab-btn"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>
      
      <div class="result-list">
        <div 
          v-for="song in searchResults" 
          :key="song.id"
          class="result-item"
          @click="handlePlaySong(song)"
        >
          <img :src="song.cover" :alt="song.name" class="result-cover" />
          <div class="result-info">
            <p class="result-name">
              <span v-html="highlightKeyword(song.name)"></span>
            </p>
            <p class="result-artist">
              <span v-html="highlightKeyword(song.artist)"></span>
              <span class="separator">-</span>
              <span>{{ song.album }}</span>
            </p>
          </div>
          <button class="result-fav" @click.stop="handleToggleFavorite(song)">
            <svg viewBox="0 0 24 24" :fill="favStore.isFavorite(song.id) ? '#ec4141' : 'none'" :stroke="favStore.isFavorite(song.id) ? '#ec4141' : 'currentColor'" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          <button class="result-play" @click.stop="handlePlaySong(song)">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 无结果 -->
    <div v-else-if="searchQuery && searchResults.length === 0 && !loading && hasSearched" class="no-result">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <line x1="8" y1="11" x2="14" y2="11"/>
      </svg>
      <p>未找到相关结果</p>
      <span>换个关键词试试吧</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToastStore } from '../stores/toast'
import { useFavoritesStore } from '../stores/favorites'
import config from '../config'
import logger from '../utils/logger'

const toast = useToastStore()
const favStore = useFavoritesStore()
const searchQuery = ref('')
const showHistory = ref(false)
const loading = ref(false)
const hasSearched = ref(false)
const activeTab = ref('song')

const searchHistory = ref(
  JSON.parse(localStorage.getItem('searchHistory') || '[]')
)

const hotSearches = ref([])

const resultTabs = [
  { key: 'song', label: '单曲' },
  { key: 'album', label: '专辑' },
  { key: 'artist', label: '歌手' },
  { key: 'playlist', label: '歌单' }
]

const allSongs = [
  { id: 1, name: '晴天', artist: '周杰伦', album: '叶惠美', cover: 'https://picsum.photos/seed/search1/100/100' },
  { id: 2, name: '稻香', artist: '周杰伦', album: '魔杰座', cover: 'https://picsum.photos/seed/search2/100/100' },
  { id: 3, name: '七里香', artist: '周杰伦', album: '七里香', cover: 'https://picsum.photos/seed/search3/100/100' },
  { id: 4, name: '青花瓷', artist: '周杰伦', album: '我很忙', cover: 'https://picsum.photos/seed/search4/100/100' },
  { id: 5, name: '夜曲', artist: '周杰伦', album: '十一月的萧邦', cover: 'https://picsum.photos/seed/search5/100/100' },
  { id: 6, name: '江南', artist: '林俊杰', album: '第二天堂', cover: 'https://picsum.photos/seed/search6/100/100' },
  { id: 7, name: '修炼爱情', artist: '林俊杰', album: '因你而在', cover: 'https://picsum.photos/seed/search7/100/100' },
  { id: 8, name: '泡沫', artist: '邓紫棋', album: 'Xposed', cover: 'https://picsum.photos/seed/search8/100/100' },
  { id: 9, name: '光年之外', artist: '邓紫棋', album: '光年之外', cover: 'https://picsum.photos/seed/search9/100/100' },
  { id: 10, name: '演员', artist: '薛之谦', album: '绅士', cover: 'https://picsum.photos/seed/search10/100/100' }
]

const searchResults = ref([])

// 过滤特殊字符
function sanitizeInput(input) {
  return input.replace(/[<>\"'&]/g, '')
}

async function fetchHotSearches() {
  try {
    // 模拟API
    await new Promise(resolve => setTimeout(resolve, 300))
    hotSearches.value = [
      { keyword: '周杰伦', hot: true },
      { keyword: '林俊杰', hot: true },
      { keyword: '邓紫棋', hot: false },
      { keyword: '薛之谦', hot: true },
      { keyword: '陈奕迅', hot: false },
      { keyword: '华晨宇', hot: false },
      { keyword: '毛不易', hot: true },
      { keyword: '李荣浩', hot: false },
      { keyword: '张杰', hot: false },
      { keyword: '许嵩', hot: false }
    ]
    logger.log('热门搜索加载成功')
  } catch (error) {
    logger.error('获取热门搜索失败:', error)
    toast.error('热门搜索加载失败')
  }
}

onMounted(() => {
  fetchHotSearches()
})

let searchTimer = null

function handleSearchInput() {
  // 过滤特殊字符
  searchQuery.value = sanitizeInput(searchQuery.value)
  
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    hasSearched.value = false
    return
  }
  
  // 防抖处理
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    performSearch()
  }, config.search.debounceTime)
}

async function performSearch() {
  if (!searchQuery.value.trim()) return
  
  try {
    loading.value = true
    hasSearched.value = true
    
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const query = searchQuery.value.toLowerCase()
    searchResults.value = allSongs.filter(song => 
      song.name.toLowerCase().includes(query) || 
      song.artist.toLowerCase().includes(query) ||
      song.album.toLowerCase().includes(query)
    )
    
    // 保存搜索历史
    saveSearchHistory(searchQuery.value)
    
    logger.log('搜索完成:', searchQuery.value, '结果数:', searchResults.value.length)
  } catch (error) {
    logger.error('搜索失败:', error)
    toast.error('搜索失败，请重试')
    searchResults.value = []
  } finally {
    loading.value = false
  }
}

function saveSearchHistory(keyword) {
  if (!keyword.trim()) return
  
  const history = searchHistory.value.filter(h => h !== keyword)
  history.unshift(keyword)
  searchHistory.value = history.slice(0, config.search.historyMaxCount)
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
}

function searchFromHistory(keyword) {
  searchQuery.value = keyword
  performSearch()
}

function searchFromHot(keyword) {
  searchQuery.value = keyword
  performSearch()
}

function clearSearch() {
  searchQuery.value = ''
  searchResults.value = []
  hasSearched.value = false
}

function clearHistory() {
  searchHistory.value = []
  localStorage.removeItem('searchHistory')
  toast.success('搜索历史已清空')
}

function handlePlaySong(song) {
  toast.info(`播放: ${song.name}`)
}

function handleToggleFavorite(song) {
  const isFav = favStore.isFavorite(song.id)
  favStore.toggleFavorite(song)
  toast.success(isFav ? `已取消收藏: ${song.name}` : `已收藏: ${song.name}`)
}

function highlightKeyword(text) {
  if (!searchQuery.value) return text
  const escapedQuery = searchQuery.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  return text.replace(regex, '<span class="highlight">$1</span>')
}
</script>

<style scoped>
.search-page {
  min-height: calc(100vh - 116px);
  background: #fff;
}

.search-header {
  padding: 12px 16px;
  background: #fff;
  position: sticky;
  z-index: 10;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 20px;
  padding: 0 16px;
  height: 40px;
}

.search-icon {
  width: 18px;
  height: 18px;
  color: #999;
  flex-shrink: 0;
}

.search-input-wrapper input {
  flex: 1;
  height: 100%;
  padding: 0 12px;
  font-size: 14px;
  background: transparent;
  color: #333;
}

.search-input-wrapper input::placeholder {
  color: #bbb;
}

.clear-btn {
  width: 20px;
  height: 20px;
  background: transparent;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.clear-btn:active {
  transform: scale(0.9);
}

.clear-btn svg {
  width: 16px;
  height: 16px;
  color: #ccc;
}

.search-history {
  padding: 16px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.history-header h3 {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.clear-history {
  background: transparent;
  padding: 4px;
  transition: transform 0.2s;
}

.clear-history:active {
  transform: scale(0.9);
}

.clear-history svg {
  width: 18px;
  height: 18px;
  color: #999;
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.history-tag {
  padding: 6px 14px;
  background: #f5f5f5;
  border-radius: 15px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.history-tag:active {
  background: #e5e5e5;
  transform: scale(0.95);
}

.hot-search {
  padding: 16px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.hot-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0 24px;
}

.hot-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  cursor: pointer;
  transition: background 0.2s;
  border-radius: 8px;
  margin: 0 -8px;
  padding-left: 8px;
  padding-right: 8px;
}

.hot-item:active {
  background: #f5f5f5;
}

.hot-rank {
  width: 28px;
  font-size: 15px;
  font-weight: 600;
  color: #999;
  flex-shrink: 0;
}

.hot-rank.top {
  color: #ec4141;
}

.hot-keyword {
  flex: 1;
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 8px;
}

.hot-badge {
  font-size: 10px;
  color: #fff;
  background: #ec4141;
  padding: 2px 4px;
  border-radius: 2px;
  margin-left: 6px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #999;
  gap: 12px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f0f0f0;
  border-top-color: #ec4141;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.search-results {
  padding-bottom: 20px;
}

.result-tabs {
  display: flex;
  padding: 0 16px;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  background: #fff;
  z-index: 10;
}

.tab-btn {
  padding: 12px 16px;
  font-size: 14px;
  color: #666;
  background: transparent;
  position: relative;
  transition: color 0.3s;
}

.tab-btn.active {
  color: #ec4141;
  font-weight: 500;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: #ec4141;
  border-radius: 1px;
}

.result-list {
  padding: 8px 0;
}

.result-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  gap: 12px;
  transition: background 0.2s;
  cursor: pointer;
}

.result-item:active {
  background: #f5f5f5;
}

.result-cover {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  flex-shrink: 0;
  object-fit: cover;
  background: #f0f0f0;
}

.result-info {
  flex: 1;
  min-width: 0;
}

.result-name {
  font-size: 15px;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-artist {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.separator {
  margin: 0 4px;
}

.result-play {
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

.result-play:active {
  transform: scale(0.9);
  border-color: #ec4141;
}

.result-play svg {
  width: 12px;
  height: 12px;
  color: #ec4141;
  margin-left: 2px;
}

.result-fav {
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

.result-fav:active {
  transform: scale(0.9);
}

.result-fav svg {
  width: 20px;
  height: 20px;
  color: #999;
  transition: all 0.2s;
}

.result-fav svg[fill="#ec4141"] {
  color: #ec4141;
}

:deep(.highlight) {
  color: #ec4141;
}

.no-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #999;
}

.no-result svg {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
  color: #ddd;
}

.no-result p {
  font-size: 15px;
  color: #666;
  margin-bottom: 8px;
}

.no-result span {
  font-size: 13px;
}
</style>
