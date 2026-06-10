// 应用配置
export default {
  // 轮播图配置
  banner: {
    autoPlayInterval: 4000 // 自动切换间隔(ms)
  },
  
  // 搜索配置
  search: {
    debounceTime: 300, // 防抖时间(ms)
    maxInputLength: 50, // 最大输入长度
    historyMaxCount: 10 // 历史记录最大数量
  },
  
  // 日志配置
  log: {
    enabled: import.meta.env.DEV // 仅开发环境启用
  }
}
