import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import RankingView from '@/views/RankingView.vue'
import ProfileView from '@/views/ProfileView.vue'
import SearchResultsView from '@/views/SearchResultsView.vue'
import WriteView from '@/views/WriteView.vue'
import NotificationsView from '@/views/NotificationsView.vue'
import SignUpView from '@/views/SignUpView.vue'
import LoginView from '@/views/LoginView.vue'
import UserProfileView from '@/views/ProfileEditView.vue'
import FollowListView from '@/views/FollowListView.vue'
import UserSettingsView from '@/views/UserSettingsView.vue'
import { useUserStore } from '@/stores/user' 



const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/ranking', name: 'ranking', component: RankingView },
  { path: '/users/:userId?/edit', name: 'profileEdit', component: UserProfileView, meta: { requiresAuth : true }},
  { path: '/users/:userId?', name: 'profile', component: ProfileView, meta: { requiresAuth: true }},
  { path: '/search', name: 'search', component: SearchResultsView },
  { path: '/users/:userId?/write', name: 'write', component: WriteView , meta: { requiresAuth: true }},
  { path: '/notifications', name: 'notifications', component: NotificationsView },
  { path: '/login', name: 'login', component: LoginView},
  { path: '/signup', name: 'signup', component: SignUpView},
  { path: '/users/:userId?/followers', name: 'followers', component: FollowListView, meta: {type: "followers", title:"팔로워"}},
  { path: '/users/:userId?/followees', name: 'followees', component: FollowListView, meta: {type: "followees", title:"팔로잉"}},
  { path: '/users/:userId?/settings', name: 'userSettings', component: UserSettingsView, meta:{requiresAuth: true}},
  
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