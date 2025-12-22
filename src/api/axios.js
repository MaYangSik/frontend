import axios from 'axios'
import { useUserStore } from '@/stores/user'
import router from '@/router'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

const refreshApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

api.interceptors.request.use(config => {
  const store = useUserStore()
  if (store.accessToken) {
    config.headers.Authorization = `Bearer ${store.accessToken}`
  }
  return config
})

api.interceptors.response.use(
  res => res,
  async error => {
    const store = useUserStore()
    const originalRequest = error.config
    const status = error.response?.status
    const message = error.response?.data?.message // ✅ 백엔드가 내려주는 TOKEN_EXPIRED 같은 값

    // ✅ 지금 뭐 때문에 튕기는지 바로 보이게 로그 찍기
    console.log('[API ERROR]', status, originalRequest?.url, message)

    if (!error.response) {
      alert('네트워크 오류가 발생했습니다.')
      return Promise.reject(error)
    }

    // ✅ refresh 자체 실패는 바로 로그아웃
    if (originalRequest?.url?.includes('/auth/refresh')) {
      store.logout()
      router.replace('/login')
      return Promise.reject(error)
    }

    // ✅ 403은 "권한/인가"일 수 있으니 여기서 로그아웃하지 말 것
    if (status === 403) {
      // 필요하면 안내만
      // alert('권한이 없거나 접근이 제한되었습니다.')
      return Promise.reject(error)
    }

    // ✅ 토큰 만료/위조 케이스만 처리 (백엔드 필터 메시지 기준)
    const isTokenError = status === 401 && (message === 'TOKEN_EXPIRED' || message === 'TOKEN_INVALID')

    if (!isTokenError) {
      return Promise.reject(error)
    }

    // ✅ 재시도했는데도 401 토큰에러면 로그아웃
    if (originalRequest._retry) {
      store.logout()
      router.replace('/login')
      return Promise.reject(error)
    }

    // ✅ 토큰 에러면 refresh 시도
    originalRequest._retry = true
    try {
      const { data } = await refreshApi.post('/auth/refresh')
      store.accessToken = data.accessToken
      localStorage.setItem('user', JSON.stringify(store.$state))

      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
      return api(originalRequest)
    } catch (e) {
      store.logout()
      router.replace('/login')
      return Promise.reject(e)
    }
  }
)

export default api
