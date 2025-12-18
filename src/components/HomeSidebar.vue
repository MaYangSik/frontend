<template>
  <aside class="hidden w-72 flex-shrink-0 border-l bg-white px-6 pt-8 lg:block text-gray-800">
    <!-- 내 활동 (읽은 책 + 리뷰 통합) -->
    <section class="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 class="mb-3 text-sm font-semibold text-gray-900">내 활동</h2>
      <div class="grid grid-cols-3 items-center text-sm text-gray-700">
        <div class="flex flex-col items-center">
          <p class="text-lg font-bold text-gray-900">{{ booksRead }}</p>
          <span class="text-xs text-gray-500">읽은 책</span>
        </div>
        <div class="flex justify-center">
          <div class="h-8 w-[1px] bg-gray-200"></div>
        </div>
        <div class="flex flex-col items-center">
          <p class="text-lg font-bold text-gray-900">{{ reviewsWritten }}</p>
          <span class="text-xs text-gray-500">리뷰</span>
        </div>
      </div>
    </section>

    <!-- 친구 추천 -->
    <section class="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 class="mb-3 text-sm font-semibold text-gray-900">📚 이런 친구는 어때요?</h2>
      <div class="space-y-3">
        <div
          v-for="f in recommendedFriends"
          :key="f.username"
          class="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-2.5 hover:bg-gray-100 transition"
        >
          <div class="flex items-center gap-3">
            <img
              :src="f.image"
              alt="profile"
              class="h-8 w-8 rounded-full object-cover border border-gray-200"
            />
            <div>
              <p class="text-sm font-medium text-gray-900">{{ f.name }}</p>
              <p class="text-xs text-gray-500">@{{ f.username }}</p>
            </div>
          </div>
          <button
            class="rounded-full border border-gray-300 bg-white px-3 py-0.5 text-xs text-gray-700 hover:bg-gray-100 transition"
            @click="handleFollow(f.username)"
          >
            팔로우
          </button>
        </div>
      </div>
    </section>

    <!-- 최근 읽은 책 -->
    <section class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 class="mb-3 text-sm font-semibold text-gray-900">📖 최근 읽은 책</h2>
      <div class="space-y-3 text-xs text-gray-600">
        <div
          v-for="book in recentBooks"
          :key="book.title"
          class="flex items-center gap-3 rounded-md p-2 hover:bg-gray-50 transition"
        >
          <div class="h-10 w-8 flex-shrink-0 rounded-md bg-gray-100" />
          <div class="flex flex-col">
            <span class="text-sm font-medium text-gray-900">{{ book.title }}</span>
            <span class="text-[11px] text-gray-500">{{ book.author }}</span>
          </div>
        </div>
      </div>
    </section>
  </aside>
</template>

<script setup>
import { followUser } from '@/api/user'  // 백엔드 API 요청 함수라고 가정

const booksRead = 24
const reviewsWritten = 42

const recommendedFriends = [
  { name: '이서평', username: 'user001', image: 'https://i.pravatar.cc/100?img=5' },
  { name: '박문장', username: 'user002', image: 'https://i.pravatar.cc/100?img=9' },
  { name: '최책방', username: 'user005', image: 'https://i.pravatar.cc/100?img=11' },
  { name: '정서재', username: 'user100', image: 'https://i.pravatar.cc/100?img=7' },
]

const recentBooks = [
  { title: '책 제목 1', author: '저자명' },
  { title: '책 제목 2', author: '저자명' },
  { title: '책 제목 3', author: '저자명' },
]

const handleFollow = async (username) => {
  try {
    await followUser(username)
    alert(`${username}님을 팔로우했습니다!`)
  } catch (err) {
    console.error(err)
    alert('팔로우 요청 중 오류가 발생했습니다.')
  }
}



</script>
