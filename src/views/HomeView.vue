<template>
  <div class="mx-auto flex max-w-5xl gap-8 px-4 pt-8 md:px-6">
    <!-- Left (피드) -->
    <section class="flex-1">
      <!-- 탭 -->
      <div class="mb-4 flex gap-4 border-b text-sm">
        <button
          class="border-b-2 pb-3 pt-2"
          :class="activeTab === 'recommend' ? 'border-gray-900 font-semibold text-gray-900' : 'border-transparent text-gray-500'"
          @click="activeTab = 'recommend'"
        >
          추천
        </button>
        <button
          class="pb-3 pt-2 text-gray-400"
          :class="activeTab === 'following' ? 'border-b-2 border-gray-900 font-semibold text-gray-900' : 'border-transparent text-gray-500'"
          @click="activeTab = 'following'"
        >
          팔로잉
        </button>
      </div>

      <!-- 필터 -->
      <div class="mb-4 flex gap-3 text-xs">
        <button class="rounded-full bg-gray-900 px-4 py-1.5 text-white">전체</button>
        <button class="rounded-full bg-gray-100 px-4 py-1.5 text-gray-700">내 진행도 이하</button>
        <button class="rounded-full bg-gray-100 px-4 py-1.5 text-gray-700">완독자</button>
      </div>

      <!-- 리뷰 리스트 -->
      <div class="divide-y">
        <ReviewCard v-for="item in reviews" :key="item.id" :review="item" />
      </div>
    </section>

    <!-- Right (사이드바) -->
    <HomeSidebar />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ReviewCard from '@/components/ReviewCard.vue'
import HomeSidebar from '@/components/HomeSidebar.vue'

const activeTab = ref('recommend')

const reviews = [
  {
    id: 'r1',
    title: '12화: 감정선 정리',
    body: '주인공이 처음으로 갈등을 드러내는 장면. 앞으로의 선택을 가늠하기 좋은 포인트라 간단히 키워드만 남김.',
    authorNickname: '김독서',
    authorId: 'bookworm',
    createdAtLabel: '2시간 전',
    contentTitle: '전지적 독자 시점',
    categoryLabel: '웹툰',
    myProgress: 20,
    spoilerProtected: true,
    tags: ['감정', '기록'],
  },
  {
    id: 'r2',
    title: '8권: 전개가 말이 됨',
    body: '초반에 깔아둔 복선이 8권에서 회수됨. 스포 없이도 읽은 사람은 알만한 감정 포인트.',
    authorNickname: '이서평',
    authorId: 'readmore',
    createdAtLabel: '5시간 전',
    contentTitle: '데미안',
    categoryLabel: '도서',
    myProgress: 8,
    spoilerProtected: false,
    tags: ['복선', '감정선'],
  },
]
</script>
