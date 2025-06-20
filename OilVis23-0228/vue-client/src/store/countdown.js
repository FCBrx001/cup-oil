// 倒计时状态管理 - 用于VaporizationWarning和test_chart组件之间的数据同步
import Vue from 'vue'

// 创建一个Vue实例作为事件总线和状态管理
const countdownStore = new Vue({
  data() {
    return {
      // 倒计时数据 - 两个组件共享
      countdowns: {
        '高点#1': {
          minutes: 15,
          seconds: 30,
          isActive: true
        },
        '高点#2': {
          minutes: 42,
          seconds: 15,
          isActive: true
        }
      },
      countdownTimer: null
    }
  },
  
  computed: {
    // 格式化倒计时显示
    formattedCountdowns() {
      const result = {}
      Object.keys(this.countdowns).forEach(key => {
        const countdown = this.countdowns[key]
        result[key] = `${countdown.minutes.toString().padStart(2, '0')}:${countdown.seconds.toString().padStart(2, '0')}`
      })
      return result
    }
  },
  
  methods: {
    // 启动全局倒计时
    startCountdown() {
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer)
      }
      
      this.countdownTimer = setInterval(() => {
        Object.keys(this.countdowns).forEach(key => {
          const countdown = this.countdowns[key]
          if (countdown.isActive) {
            if (countdown.seconds > 0) {
              countdown.seconds--
            } else if (countdown.minutes > 0) {
              countdown.minutes--
              countdown.seconds = 59
            } else {
              // 倒计时结束
              countdown.isActive = false
              console.log(`⏰ ${key} 倒计时结束！`)
              this.$emit('countdown-finished', key)
            }
          }
        })
        
        // 通知所有监听的组件更新
        this.$emit('countdown-updated', {
          countdowns: this.countdowns,
          formatted: this.formattedCountdowns
        })
      }, 1000)
    },
    
    // 停止倒计时
    stopCountdown() {
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer)
        this.countdownTimer = null
      }
    },
    
    // 重置倒计时
    resetCountdown(pointName) {
      if (this.countdowns[pointName]) {
        // 重置为初始值
        if (pointName === '高点#1') {
          this.countdowns[pointName] = { minutes: 15, seconds: 30, isActive: true }
        } else if (pointName === '高点#2') {
          this.countdowns[pointName] = { minutes: 42, seconds: 15, isActive: true }
        }
        
        this.$emit('countdown-reset', pointName)
      }
    },
    
    // 暂停/继续倒计时
    toggleCountdown(pointName) {
      if (this.countdowns[pointName]) {
        this.countdowns[pointName].isActive = !this.countdowns[pointName].isActive
        this.$emit('countdown-toggled', pointName, this.countdowns[pointName].isActive)
      }
    },
    
    // 获取当前倒计时状态
    getCountdownData() {
      return {
        countdowns: this.countdowns,
        formatted: this.formattedCountdowns
      }
    }
  },
  
  created() {
    // 自动启动倒计时
    this.startCountdown()
  },
  
  beforeDestroy() {
    this.stopCountdown()
  }
})

export default countdownStore 