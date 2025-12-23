<template>
  <aside
    class="hidden w-72 flex-shrink-0 border-l bg-white px-6 pt-3 lg:block text-gray-800"
  >
    <!-- 비로그인 광고 배너 -->
    <section
      v-if="!isLoggedIn"
      class="mb-6 overflow-hidden rounded-xl border border-gray-900/30 bg-gradient-to-br from-gray-800 via-gray-900 to-black p-5 shadow-lg shadow-gray-900/30 relative text-white"
    >
      <div
        class="pointer-events-none absolute inset-0 opacity-20"
        style="
          background-image: url('https://images.unsplash.com/photo-1594312915251-48db9280c8f1?auto=format&fit=crop&w=800&q=80'),
            radial-gradient(circle at 20% 20%, #fff 0, transparent 25%),
            radial-gradient(circle at 80% 0%, #fff 0, transparent 20%),
            radial-gradient(circle at 50% 80%, #fff 0, transparent 22%);
          background-size: cover, 200px 200px, 200px 200px, 200px 200px;
          background-blend-mode: overlay;
        "
      ></div>

      <div class="relative">
        <p class="text-lg font-semibold leading-relaxed">
          MaYangSik에 가입해서<br />다양한 리뷰를 남겨보세요.
        </p>
        <p class="mt-2 text-xs text-gray-200">
          작품 기록, 스포 안전 필터, 팔로우 피드를 한 번에!
        </p>
        <div class="mt-3 flex gap-2 text-sm">
          <RouterLink
            to="/signup"
            class="flex-1 rounded-full bg-white/90 px-2 py-2 text-center font-semibold text-gray-900 hover:bg-gray-100"
          >
            가입하기
          </RouterLink>
          <RouterLink
            to="/login"
            class="flex-1 rounded-full border border-white/60 px-2 py-2 text-center font-semibold text-white hover:bg-white/10"
          >
            로그인
          </RouterLink>
        </div>
      </div>
    </section>
    <!-- 내 활동 (읽은 책 + 리뷰 통합) -->
    <section
      v-if="isLoggedIn"
      class="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <h2 class="mb-3 text-sm font-semibold text-gray-900">내 활동</h2>
      <div class="flex items-center justify-center gap-9 text-sm text-gray-700">
        <div class="flex flex-col items-center">
          <RouterLink
            :to="{ name: 'profile', params: { userId: userId || undefined }, query: { tab: 'library' } }"
            class="flex flex-col items-center hover:text-blue-600"
          >
            <p class="text-lg font-bold text-gray-900">{{ booksRead }}</p>
            <span class="text-xs text-gray-500">읽은 책</span>
          </RouterLink>
        </div>
        <div class="h-8 w-[1px] bg-gray-200"></div>
        <div class="flex flex-col items-center">
          <RouterLink
            :to="{ name: 'profile', params: { userId: userId || undefined }, query: { tab: 'reviews' } }"
            class="flex flex-col items-center hover:text-blue-600"
          >
            <p class="text-lg font-bold text-gray-900">{{ reviewsWritten }}</p>
            <span class="text-xs text-gray-500">리뷰</span>
          </RouterLink>
        </div>
      </div>
      <RouterLink
        :to="{ name: 'write' }"
        class="mt-4 block w-full rounded-full bg-gray-900 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-gray-800"
      >
        리뷰 작성하기
      </RouterLink>
    </section>

    <!-- 최근 읽은 책 -->
    <section
      v-if="isLoggedIn"
      class="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <h2 class="mb-3 text-sm font-semibold text-gray-900">최근 읽은 책</h2>
      <div class="space-y-3 text-xs text-gray-600">
        <div
          v-for="item in recentReviews"
          :key="item.id"
          class="flex items-center gap-3 rounded-md hover:bg-gray-50 transition"
        >
          <div class="h-12 w-10 flex-shrink-0 rounded-md bg-gray-100" />
          <div class="flex flex-col">
            <span class="text-sm font-medium text-gray-900">{{
              item.contentTitle
            }}</span>
            <span class="text-[11px] text-gray-500">{{
              item.contentAuthor
            }}</span>
          </div>
        </div>
        <p
          v-if="isLoggedIn && !recentReviews.length"
          class="py-2 text-center text-xs text-gray-500"
        >
          아직 작성한 리뷰가 없습니다.
        </p>
      </div>
    </section>

    <!-- 친구 추천 -->
    <section class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 class="mb-3 text-sm font-semibold text-gray-900">
        이런 친구는 어때요?
      </h2>
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
  </aside>
</template>

<script setup>
import { computed, onMounted, watch, ref } from "vue";
import { followUser } from "@/api/user"; // 백엔드 API 요청 함수라고 가정
import { searchReviews } from "@/api/review";
import api from "@/api/axios";
import { useUserStore } from "@/stores/user";

const store = useUserStore();
const isLoggedIn = computed(() => store.isLoggedIn);
const userId = computed(() => store.userId);

const booksRead = ref(0);
const reviewsWritten = ref(0);
const recentReviews = computed(() => store.recentReviews || []);

const recommendedFriends = [
  {
    name: "이서평",
    username: "user001",
    image: "https://i.pravatar.cc/100?img=5",
  },
  {
    name: "박문장",
    username: "user002",
    image: "https://i.pravatar.cc/100?img=9",
  },
  {
    name: "최책방",
    username: "user005",
    image: "https://i.pravatar.cc/100?img=11",
  },
  {
    name: "정서재",
    username: "user100",
    image: "https://i.pravatar.cc/100?img=7",
  },
];

const handleFollow = async (username) => {
  try {
    await followUser(username);
    alert(`${username}님을 팔로우했습니다!`);
  } catch (err) {
    console.error(err);
    alert("팔로우 요청 중 오류가 발생했습니다.");
  }
};

const fetchRecentReviews = async () => {
  if (!isLoggedIn.value || !userId.value) return;
  try {
    const { data } = await searchReviews({
      userId: userId.value,
      page: 0,
      size: 3,
      sort: "latest",
    });
    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.items)
      ? data.items
      : [];
    store.recentReviews = list.slice(0, 3).map((r) => ({
      id: r.reviewId ?? r.id,
      contentTitle: r.contentName || r.title,
      contentAuthor: r.contentAuthor || "",
      reviewTitle: r.title,
    }));
  } catch (e) {
    console.error("최근 리뷰 로드 실패", e);
  }
};

const fetchStats = async () => {
  if (!isLoggedIn.value) return;
  try {
    const { data } = await api.get("/users/stats");
    booksRead.value = Number(data?.readCount ?? 0);
    reviewsWritten.value = Number(data?.reviewCount ?? 0);
  } catch (e) {
    console.error("통계 로드 실패", e);
  }
};

onMounted(() => {
  fetchRecentReviews();
  fetchStats();
});

watch(isLoggedIn, (v) => {
  if (v) {
    fetchRecentReviews();
    fetchStats();
  }
});
</script>
