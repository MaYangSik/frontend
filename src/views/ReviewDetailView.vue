<template>
  <main class="mx-auto max-w-4xl px-4 pt-24 pb-12 md:px-6">
    <div v-if="isLoading" class="rounded-xl border bg-white p-6 shadow-sm">
      <p class="text-sm text-gray-500">불러오는 중...</p>
    </div>

    <div v-else-if="error" class="rounded-xl border bg-white p-6 shadow-sm">
      <p class="text-sm text-red-600">리뷰를 불러오지 못했습니다.</p>
    </div>

    <article
      v-else
      class="space-y-6 rounded-xl border bg-white p-6 shadow-sm"
    >
      <header class="flex flex-col gap-2 border-b pb-4">
        <p class="text-xs text-gray-500">
          <span class="font-semibold text-gray-900">{{ review.contentTitle }}</span>
          <span v-if="review.contentAuthor" class="ml-1 text-gray-400">· {{ review.contentAuthor }}</span>
          <span v-if="review.categoryLabel" class="ml-1 text-gray-400">· {{ review.categoryLabel }}</span>
        </p>
        <h1 class="text-xl font-bold text-gray-900">{{ review.title }}</h1>
        <div class="flex items-center gap-3 text-xs text-gray-500">
          <span class="font-semibold text-gray-800">{{ review.authorNickname }}</span>
          <span class="text-gray-300">·</span>
          <span>{{ review.createdAtLabel || review.createdAt }}</span>
          <span class="text-gray-300">·</span>
          <span>조회수 {{ review.viewCount ?? 0 }}</span>
          <span class="text-gray-300">·</span>
          <span>좋아요 {{ review.likeCount ?? 0 }}</span>
          <span v-if="review.spoilerUntil != null" class="ml-auto text-amber-700">
            스포 {{ review.spoilerUntil }}{{ unitLabel }}
          </span>
        </div>
      </header>

      <section class="space-y-3">
        <div
          class="relative rounded-xl bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-800"
          :class="isSpoiler && !revealed ? 'filter blur-[3px] select-none' : ''"
        >
          <p class="whitespace-pre-line">{{ review.body }}</p>
          <div
            v-if="isSpoiler && !revealed"
            class="absolute inset-0 flex items-center justify-center bg-white/40 text-xs text-amber-800"
          >
            스포일러 보호 중 · 보기 버튼을 눌러 확인
          </div>
        </div>
        <button
          v-if="isSpoiler"
          type="button"
          class="text-xs text-amber-700 underline"
          @click="revealed = !revealed"
        >
          {{ revealed ? "스포일러 숨기기" : "스포일러 보기" }}
        </button>
      </section>

      <section v-if="review.tags?.length" class="flex flex-wrap gap-2">
        <span
          v-for="t in review.tags"
          :key="t"
          class="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
        >
          #{{ t }}
        </span>
      </section>
    </article>
  </main>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { getReview } from "@/api/review";

const route = useRoute();
const reviewId = computed(() => route.params.reviewId);
const review = ref({});
const isLoading = ref(true);
const error = ref(null);
const revealed = ref(false);

const unitLabel = computed(() => {
  const catId = Number(review.value.contentCategoryId);
  if (!Number.isNaN(catId)) {
    return catId === 1 ? "권" : "화";
  }
  return "화";
});

const isSpoiler = computed(
  () =>
    (review.value.spoiler ?? review.value.isSpoiler ?? review.value.spoilerProtected ?? false) ||
    (review.value.spoilerUntil != null && Number(review.value.spoilerUntil) > 0)
);

const normalizeReview = (r) => {
  const tags = Array.isArray(r.tags)
    ? r.tags.map((t) => t?.tagName || t).filter(Boolean)
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
    viewCount: r.viewCount,
    spoilerUntil: r.spoilerUntil,
    spoiler: r.spoiler ?? r.isSpoiler,
    tags,
  };
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
