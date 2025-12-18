import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null,
    nickname: null,
    userRole : null,
    accessToken: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.accessToken,
  },
  actions: {
    login(data) {
    console.log('✅ 로그인 응답 데이터:', data)  
      this.userId = data.userId
      this.nickname = data.nickname
      this.userRole = data.userRole
      this.accessToken = data.accessToken
      localStorage.setItem('user', JSON.stringify(this.$state))
    },
    loadUser() {
      const saved = localStorage.getItem('user')
      if (saved) Object.assign(this, JSON.parse(saved))
    },
    logout() {
      this.user = null
      this.accessToken = null
      localStorage.removeItem('user')
    },
  },
})
