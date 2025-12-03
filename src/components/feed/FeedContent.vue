<script setup>
import FeedComposer from "./FeedComposer.vue";
import FeedCard from "./FeedCard.vue";

const mockFeedData = [
  {
    id: 1,
    user: { name: "지민", avatar: "👤", username: "@jimin_reads" },
    time: "2시간 전",
    book: {
      title: "달러구트 꿈 백화점",
      author: "이미예",
      thumbnail: "📕"
    },
    content:
      "꿈을 사고파는 상점이라는 설정이 정말 따뜻했어요. 힘들 때마다 꺼내보고 싶은 문장들이 많았습니다.",
    hashtags: ["#달러구트꿈백화점", "#힐링소설", "#요즘책"],
    likes: 42,
    comments: 15,
    bookmarks: 28,
    bgColor: "#F4F6F6"
  },
  {
    id: 2,
    user: { name: "수진", avatar: "👩", username: "@sujin_book" },
    time: "5시간 전",
    book: {
      title: "아몬드",
      author: "손원평",
      thumbnail: "📘"
    },
    content:
      "감정을 느끼지 못하는 소년의 이야기. 우리가 당연하게 여기는 감정들이 얼마나 소중한지 다시 생각하게 됩니다.",
    hashtags: ["#아몬드", "#성장소설"],
    likes: 37,
    comments: 9,
    bookmarks: 19,
    bgColor: "#F7FAFF"
  },
  {
    id: 3,
    user: { name: "현우", avatar: "👨", username: "@hyunwoo_lit" },
    time: "8시간 전",
    book: null,
    content:
      "“모든 것은 흘러간다.” 간결하지만 강렬한 문장이었어요. 변화를 받아들이는 것에 대한 깊은 통찰을 주네요.",
    hashtags: ["#오늘의문장", "#하이라이트"],
    likes: 54,
    comments: 18,
    bookmarks: 32,
    bgColor: "#F7F3F0"
  }
];

const userExplorers = [
  { id: 1, name: "민지", avatar: "👩" },
  { id: 2, name: "태형", avatar: "👨" },
  { id: 3, name: "지수", avatar: "👧" },
  { id: 4, name: "준서", avatar: "👦" },
  { id: 5, name: "하은", avatar: "👱‍♀️" },
  { id: 6, name: "시우", avatar: "👨‍💼" },
  { id: 7, name: "예진", avatar: "👩‍🦱" }
];
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <div class="sticky top-0 bg-white/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-gray-200">
      <h1 class="text-xl font-semibold text-gray-900">Feed</h1>
    </div>

    <!-- Explorers -->
 <!-- ✅ 수정된 '오늘의 탐험가' 부분 -->
<div class="px-6 py-3 border-b border-gray-100">
  <div class="mb-2">
    <p class="text-sm font-semibold text-gray-900">오늘의 탐험가</p>
    <p class="text-xs text-gray-500">지금 책을 읽고 있는 사람들</p>
  </div>

  <!-- 🔥 왼쪽 정렬 + 아바타 크기 확대 + 가로 스크롤 가능 -->
  <div
    class="flex items-center space-x-4 overflow-x-auto scrollbar-hide py-2"
  >
    <div
      v-for="user in userExplorers"
      :key="user.id"
      class="flex flex-col items-center flex-shrink-0"
    >
      <div
        class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl"
      >
        <span>{{ user.avatar }}</span>
      </div>
      <p class="text-xs text-gray-600 mt-1">{{ user.name }}</p>
    </div>
  </div>
</div>


    <!-- Composer -->
    <div class="px-6 py-4 border-b border-gray-100">
      <FeedComposer />
    </div>

    <!-- Feed list -->
    <div class="space-y-4 pb-6">
      <FeedCard
        v-for="item in mockFeedData"
        :key="item.id"
        :data="item"
      />
    </div>
  </div>
</template>
