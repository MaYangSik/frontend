import api from './axios'

// 로그인
export const login = (data) => api.post('/login', data)

// 로그아웃
export const logout = (refreshToken) =>
  api.post('/auth/logout', {}, {
    headers: {
      'Refresh-Token': refreshToken
    }
  })

// 회원가입
export const signup = (data) => api.post('/users', data)

// 사용자 검색 (ES)
export const searchUsers = (payload) => api.post('/search/users', payload)
