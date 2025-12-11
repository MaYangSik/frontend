import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import RankingView from '@/views/RankingView.vue'
import ProfileView from '@/views/ProfileView.vue'
import SearchResultsView from '@/views/SearchResultsView.vue'
import WriteView from '@/views/WriteView.vue'
import NotificationsView from '@/views/NotificationsView.vue'
import SignUpView from '@/views/SignUpView.vue'
import LoginView from '@/views/LoginView.vue'
import { useUserStore } from '@/stores/user' 


const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/ranking', name: 'ranking', component: RankingView },
  { path: '/profile/:userId?', name: 'profile', component: ProfileView , meta: { requiresAuth: true }},
  { path: '/search', name: 'search', component: SearchResultsView },
  { path: '/write', name: 'write', component: WriteView , meta: { requiresAuth: true }},
  { path: '/notifications', name: 'notifications', component: NotificationsView },
  { path: '/login', name: 'login', component: LoginView},
  { path: '/signup', name: 'signup', component: SignUpView},
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
   const userStore = useUserStore() // ✅ Pinia store 사용
  const accessToken = userStore.accessToken || localStorage.getItem('accessToken')


  if (to.meta.requiresAuth && !accessToken) {
    // 로그인 안 한 상태에서 인증 필요한 페이지 접근
    alert('로그인이 필요합니다.')
    next('/login')
  } else {
    next()
  }
})

export default router