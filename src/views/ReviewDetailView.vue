<template>
  <main class="mx-auto max-w-3xl px-4 pt-10 pb-12 md:px-6">
    <div
      v-if="isLoading"
      class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <p class="text-sm text-gray-500">불러오는 중...</p>
    </div>

    <div
      v-else-if="error"
      class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <p class="text-sm text-red-600">리뷰를 불러오지 못했습니다.</p>
    </div>

    <article v-else class="p-5">
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <button
          type="button"
          class="text-gray-400 hover:text-gray-700"
          @click="goBack"
        >
          ← 목록으로
        </button>
      </div>

      <header class="mt-4 flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700"
          >
            {{ authorInitial }}
          </div>
          <div class="flex flex-col">
            <div
              class="flex flex-wrap items-center gap-2 text-sm text-gray-800"
            >
              <span class="font-semibold text-gray-900">{{
                review.authorNickname
              }}</span>
              <span class="text-gray-400">@{{ review.userId }}</span>
              <span
                v-if="review.spoilerUntil != null && review.spoilerUntil > 0"
                class="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700"
              >
                스포 {{ review.spoilerUntil }}{{ unitLabel }}
              </span>
            </div>
          </div>
          <div class="ml-auto text-xs text-gray-400">
            <span>{{ formatDate(review.createdAt) }}</span>
            <span class="text-gray-300"> · </span>
            <span>조회 {{ review.viewCount ?? 0 }}</span>
          </div>
        </div>

        <h1 class="text-xl mt-1 font-semibold leading-snug text-gray-900">
          {{ review.title }}
        </h1>
      </header>

      <section class="mt-2 space-y-3 border-t border-gray-100 pt-4">
        <div class="relative text-base leading-relaxed text-gray-800">
          <p class="whitespace-pre-line">{{ review.body }}</p>
        </div>
      </section>

      <section v-if="review.tags?.length" class="mt-4 flex flex-wrap gap-2">
        <span
          v-for="t in review.tags"
          :key="t"
          class="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
        >
          #{{ t }}
        </span>
      </section>

      <section class="mt-6 ml-1 border-b border-gray-100 pb-4">
        <div class="flex items-center justify-between text-sm text-gray-600">
          <button
            type="button"
            class="flex items-center gap-2"
            :class="review.likedByMe ? 'text-rose-600' : 'text-gray-600'"
            :disabled="isLiking || !isLoggedIn"
            @click="handleLike"
          >
            <span>{{ review.likedByMe ? "♥" : "♡" }}</span>
            <span>{{ review.likeCount }}</span>
          </button>
          <button
            type="button"
            class="flex items-center gap-2 rounded-xl text-gray-600 hover:text-gray-900 transition"
          >
            <span class="text-xs text-gray-400">🔗</span>
            <span>공유하기</span>
          </button>
        </div>
      </section>

      <section class="mt-8 rounded-xl bg-gray-50 px-4 py-4">
        <h2 class="mb-3 text-sm font-semibold text-gray-900">이 리뷰의 작품</h2>
        <div class="flex items-center gap-4">
          <div class="h-16 w-16 flex-shrink-0 rounded-lg bg-gray-200"></div>
          <div class="flex flex-col">
            <p class="font-semibold text-gray-900">
              {{ review.contentTitle || "콘텐츠 제목" }}
            </p>
            <p class="text-xs text-gray-500">
              {{ review.contentAuthor || "작가 정보 없음" }}
              <span v-if="review.categoryLabel" class="ml-1 text-gray-400"
                >· {{ review.categoryLabel }}</span
              >
            </p>
            <div v-if="review.tags?.length" class="mt-2 flex flex-wrap gap-1">
              <span
                v-for="t in review.tags"
                :key="t"
                class="rounded-full bg-white px-2 py-0.5 text-[11px] text-gray-600"
              >
                #{{ t }}
              </span>
            </div>
          </div>
        </div>
      </section>
    </article>
  </main>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { getReview, toggleReviewLike } from "@/api/review";
import { useUserStore } from "@/stores/user";

const route = useRoute();
const reviewId = computed(() => route.params.reviewId);
const review = ref({});
const isLoading = ref(true);
const error = ref(null);
const revealed = ref(false);
const isLiking = ref(false);
const userStore = useUserStore();
const isLoggedIn = computed(() => userStore.isLoggedIn);

const unitLabel = computed(() => {
  const catId = Number(review.value.contentCategoryId);
  if (!Number.isNaN(catId)) {
    return catId === 1 ? "권" : "화";
  }
  return "화";
});

const formatDate = (isoString) => {
  const date = new Date(isoString);

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Seoul",
  }).format(date);
};

const authorInitial = computed(() => {
  const src = review.value.authorNickname || review.value.userId || "";
  return src ? src.charAt(0).toUpperCase() : "?";
});

const goBack = () => {
  window.history.length > 1 ? history.back() : null;
};

const normalizeReview = (r) => {
  const tags = Array.isArray(r.tags)
    ? r.tags.map((t) => t?.tagName || t).filter(Boolean)
    : Array.isArray(r.tagNames)
    ? r.tagNames.filter(Boolean)
    : [];
  return {
    id: r.reviewId ?? r.id,
    title: r.title,
    body: r.content,
    authorNickname: r.nickname || r.userId,
    userId: r.userId,
    contentId: r.contentId,
    contentTitle: r.contentName,
    contentAuthor: r.contentAuthor,
    contentCategoryId: r.contentCategoryId,
    categoryLabel: r.categoryLabel,
    createdAt: r.createdAt,
    createdAtLabel: r.createdAtLabel,
    likeCount: r.likeCount,
    likedByMe: Boolean(r.likedByMe),
    viewCount: r.viewCount,
    spoilerUntil: r.spoilerUntil,
    spoiler: r.spoiler ?? r.isSpoiler,
    tags: r.tagNames,
  };
};

const handleLike = async () => {
  if (!review.value?.id || isLiking.value || !isLoggedIn.value) return;
  isLiking.value = true;
  try {
    const { data } = await toggleReviewLike(review.value.id);
    review.value.likeCount = data?.likeCount ?? review.value.likeCount;
    review.value.likedByMe = Boolean(data?.liked);
  } catch (e) {
    console.error("리뷰 좋아요 토글 실패", e);
  } finally {
    isLiking.value = false;
  }
};

const fetchReview = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const { data } = await getReview(reviewId.value);
    review.value = normalizeReview(data);
  } catch (e) {
    error.value = e;
    console.error("리뷰 상세 조회 실패", e);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchReview();
});
</script>
