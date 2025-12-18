<template>
  <div class="bg-white">
    <!-- 커버 이미지 -->
    <div
      class="relative h-44 w-full bg-[url('/pattern-bg.png')] bg-repeat bg-[length:24px_24px] bg-gradient-to-r from-amber-100 to-yellow-100"
    >
      <!-- max-w-5xl 컨테이너 안으로 기준 변경 -->
      <div class="mx-auto max-w-5xl relative h-full">
        <!-- 프로필 이미지 (유저 이름 위쪽, x축 정렬선 맞춤) -->
        <div
          class="absolute bottom-0 left-4 translate-y-[40%] h-32 w-32 rounded-full border-4 border-white bg-gray-100 shadow-lg shadow-gray-200"
        ></div>
      </div>
    </div>

    <!-- 프로필 본문 -->
    <div class="mx-auto max-w-5xl px-4 pb-10 md:px-6">
      <!-- 프로필 헤더 -->
      <section class="mt-24 flex items-end justify-between gap-6">
        <div class="flex-1">
          <h1 class="text-2xl font-bold text-gray-900">김독서</h1>
          <p class="text-sm text-gray-500">@bookworm</p>
          <p class="mt-2 text-sm text-gray-700">
            책을 사랑하는 독자입니다. 주로 고전문학과 철학 서적을 읽습니다.
          </p>

          <div class="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
            <span>📍 서울, 한국</span>
            <span>📅 가입일: 2023년 3월</span>
          </div>

          <div class="mt-3 flex gap-4 text-sm text-gray-700">
            <span><strong>245</strong> 팔로잉</span>
            <span><strong>1823</strong> 팔로워</span>
          </div>
        </div>

        <button
          class="hidden rounded-full border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 md:inline-flex"
        >
          프로필 수정
        </button>
      </section>

      <!-- 탭 -->
      <section class="mt-10">
        <div class="flex gap-6 border-b text-sm">
          <button class="border-b-2 border-gray-900 pb-3 font-semibold text-gray-900">
            게시물
          </button>
          <button class="pb-3 text-gray-500">히스토리</button>
          <button class="pb-3 text-gray-500">읽은 책</button>
        </div>

        <!-- 게시물 리스트 -->
        <div class="mt-4 divide-y">
          <ReviewCard v-for="item in reviews" :key="item.id" :review="item" />
        </div>
      </section>

      <!-- 읽은 책 -->
      <section class="mt-8">
        <h2 class="mb-3 text-sm font-semibold text-gray-900">읽은 책</h2>
        <div class="grid grid-cols-3 gap-3 md:grid-cols-5">
          <div
            v-for="n in 10"
            :key="n"
            class="h-32 w-full rounded-md bg-gray-100"
          ></div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import ReviewCard from '@/components/ReviewCard.vue'

const reviews = [
  {
    id: 'r1',
    title: '5권: 관계가 어긋나는 순간',
    body: '스포 없이 감정만 남겼습니다. 대화 톤이 급격히 변하면서 캐릭터가 보이는 단면이 인상적.',
    authorNickname: '김독서',
    authorId: 'bookworm',
    createdAtLabel: '2시간 전',
    contentTitle: '이방인',
    categoryLabel: '도서',
    myProgress: 5,
    spoilerProtected: true,
    tags: ['감정', '기록'],
  },
]
</script>
