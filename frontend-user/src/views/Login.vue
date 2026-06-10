<template>
  <div class="login-page">
    <div class="login-container">
      <div class="logo-section">
        <div class="logo">
          <svg viewBox="0 0 100 100" class="logo-icon">
            <circle cx="50" cy="50" r="45" fill="#ec4141"/>
            <path d="M50 20 L50 55 L75 55" stroke="white" stroke-width="6" fill="none" stroke-linecap="round"/>
            <circle cx="50" cy="55" r="8" fill="white"/>
          </svg>
        </div>
        <h1 class="app-title">网易云音乐</h1>
        <p class="app-slogan">发现音乐的美好</p>
      </div>
      
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <input 
              v-model="form.phone" 
              type="text" 
              placeholder="请输入手机号"
              maxlength="11"
            />
          </div>
          <span v-if="errors.phone" class="error-msg">{{ errors.phone }}</span>
        </div>
        
        <div class="form-group">
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <input 
              v-model="form.password" 
              :type="showPassword ? 'text' : 'password'" 
              placeholder="请输入密码"
            />
            <button type="button" class="toggle-password" @click="showPassword = !showPassword">
              <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
          </div>
          <span v-if="errors.password" class="error-msg">{{ errors.password }}</span>
        </div>
        
        <div v-if="errors.general" class="general-error">{{ errors.general }}</div>
        
        <button type="submit" class="login-btn" :disabled="loading">
          <span v-if="loading" class="loading-spinner"></span>
          <span v-else>登 录</span>
        </button>
      </form>
      
      <div class="login-footer">
        <p class="agreement">
          登录即表示同意《用户协议》和《隐私政策》
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useToastStore } from '../stores/toast'
import logger from '../utils/logger'

const router = useRouter()
const userStore = useUserStore()
const toast = useToastStore()

const form = reactive({
  phone: '',
  password: ''
})

const errors = reactive({
  phone: '',
  password: '',
  general: ''
})

const showPassword = ref(false)
const loading = ref(false)

function validate() {
  let valid = true
  errors.phone = ''
  errors.password = ''
  errors.general = ''
  
  if (!form.phone) {
    errors.phone = '请输入手机号'
    valid = false
  } else if (!/^1[3-9]\d{9}$/.test(form.phone)) {
    errors.phone = '请输入正确的手机号'
    valid = false
  }
  
  if (!form.password) {
    errors.password = '请输入密码'
    valid = false
  } else if (form.password.length < 6) {
    errors.password = '密码至少6位'
    valid = false
  }
  
  return valid
}

async function handleLogin() {
  if (!validate()) return
  
  loading.value = true
  errors.general = ''
  
  try {
    // 模拟登录请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const userData = {
      id: Date.now(),
      phone: form.phone,
      nickname: '音乐爱好者',
      avatar: 'https://picsum.photos/seed/avatar/200/200',
      level: 8,
      listenSongs: 2580,
      followers: 128,
      following: 56
    }
    
    userStore.login(userData)
    logger.log('登录成功:', form.phone)
    toast.success('登录成功')
    router.push('/')
  } catch (error) {
    logger.error('登录失败:', error)
    errors.general = error.message || '登录失败，请稍后重试'
    toast.error('登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ec4141 0%, #c93b3b 100%);
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 16px;
  padding: 40px 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.logo-section {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
}

.logo-icon {
  width: 100%;
  height: 100%;
}

.app-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.app-slogan {
  font-size: 14px;
  color: #999;
}

.login-form {
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 0 16px;
  height: 50px;
  transition: all 0.3s;
}

.input-wrapper:focus-within {
  background: #fff;
  box-shadow: 0 0 0 2px rgba(236, 65, 65, 0.2);
}

.input-icon {
  width: 20px;
  height: 20px;
  color: #999;
  flex-shrink: 0;
}

.input-wrapper input {
  flex: 1;
  height: 100%;
  padding: 0 12px;
  font-size: 15px;
  background: transparent;
  color: #333;
}

.input-wrapper input::placeholder {
  color: #bbb;
}

.toggle-password {
  width: 24px;
  height: 24px;
  background: transparent;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-password svg {
  width: 18px;
  height: 18px;
  color: #999;
}

.error-msg {
  display: block;
  font-size: 12px;
  color: #ec4141;
  margin-top: 4px;
}

.general-error {
  background: #fff1f0;
  border: 1px solid #ffa39e;
  color: #cf1322;
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
}

.login-btn {
  width: 100%;
  height: 50px;
  background: linear-gradient(135deg, #ec4141 0%, #c93b3b 100%);
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(236, 65, 65, 0.4);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.login-footer {
  text-align: center;
}

.agreement {
  font-size: 12px;
  color: #999;
}
</style>
