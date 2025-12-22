<template>
  <div class="bg-white min-h-screen">
    <div class="mx-auto max-w-md px-4 md:px-6 pt-32">
      <section>
        <h1 class="text-2xl font-bold text-gray-900">로그인</h1>
        <p class="mt-2 text-sm text-gray-500">
          마이페이지와 리뷰 작성 기능을 사용하려면 로그인이 필요합니다.
        </p>

        <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
          <!-- 아이디 -->
          <div>
            <label class="block text-xs font-medium text-gray-500">아이디</label>
            <input
              v-model="user_id"
              type="text"
              class="mt-1 w-full border-b border-gray-300 bg-transparent px-0 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black focus:outline-none"
              placeholder="아이디를 입력하세요"
              required
            />
          </div>

          <!-- 비밀번호 -->
          <div>
            <label class="block text-xs font-medium text-gray-500">비밀번호</label>
            <input
              v-model="password"
              type="password"
              class="mt-1 w-full border-b border-gray-300 bg-transparent px-0 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black focus:outline-none"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          <!-- 하단 안내 -->
          <div class="flex items-center justify-between text-xs text-gray-500">
            <span>비밀번호를 잊으셨나요?</span>
          </div>

          <!-- 버튼 -->
          <button
            type="submit"
            class="mt-4 w-full border border-black bg-black py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
          >
            로그인
          </button>
        </form>

        <p class="mt-6 text-xs text-gray-500">
          아직 계정이 없으신가요?
          <router-link to="/signup" class="underline">
            회원가입 하기
          </router-link>
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { login } from '@/api/user'

const user_id = ref('')
const password = ref('')
const router = useRouter()
const store = useUserStore()

const handleLogin = async () => {
  try {
  
    const res = await login({
      user_id: user_id.value,
      password: password.value,
    })

    if (res && res.data) {
      store.login(res.data)
      alert('로그인 성공!')
      router.push('/') 
    }
  } catch (err) {
    console.error(err)
    alert('로그인 실패. 이메일 또는 비밀번호를 확인하세요.')
  }
}
</script>
