import axios from 'axios'
import { useUserStore } from '@/stores/user'

const api = axios.create({
  baseURL: 'http://localhost:8080', // 백엔드 주소
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ✅ 요청 인터셉터: Access Token 자동 첨부
api.interceptors.request.use(
  (config) => {
    const store = useUserStore()

    if (store.accessToken) {
      config.headers.Authorization = `Bearer ${store.accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ✅ 응답 인터셉터: Access Token 만료 시 RefreshToken으로 재발급
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const store = useUserStore()
    const originalRequest = error.config

    // Access Token 만료 감지 (401) & 중복 재시도 방지
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // 새 Access Token 발급 요청
        const refreshResponse = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          {},
          {
            headers: {
              'Refresh-Token': store.refreshToken,
            },
          }
        )

        const newAccessToken = refreshResponse.data.accessToken
        store.accessToken = newAccessToken

        // 🔄 로컬스토리지 갱신
        localStorage.setItem('user', JSON.stringify(store.$state))

        // 새 토큰으로 재요청
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        console.error('🔒 토큰 재발급 실패:', refreshError)

        // Refresh Token도 만료된 경우 → 자동 로그아웃
        store.logout()
        alert('세션이 만료되었습니다. 다시 로그인해주세요.')
        window.location.href = '/login'
      }
    }

    // 다른 에러는 그대로 반환
    return Promise.reject(error)
  }
)

export default api
