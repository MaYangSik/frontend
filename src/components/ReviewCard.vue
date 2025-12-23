<template>
  <article class="py-5">
    <div class="flex gap-3 cursor-pointer" @click="goDetail">
      <!-- Avatar -->
      <div
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700"
      >
        {{ initial }}
      </div>

      <!-- Body -->
      <div class="min-w-0 flex-1 space-y-3">
        <!-- 메타 블록 -->
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 space-y-1">
            <div class="flex items-center gap-1 text-xs text-gray-800">
              <span class="font-semibold truncate">{{
                review.authorNickname
              }}</span>
              <span class="text-gray-400 truncate">{{
                review.userId ? `@${review.userId}` : ""
              }}</span>
            </div>
            <p class="truncate text-xs text-gray-500">
              <span class="font-medium text-gray-800">{{
                review.contentTitle
              }}</span>
              <span v-if="review.categoryLabel" class="ml-1 text-gray-400"
                >· {{ review.categoryLabel }}</span
              >
              <span v-if="review.contentAuthor" class="ml-1 text-gray-400"
                >· {{ review.contentAuthor }}</span
              >
              <span
                v-if="review.spoilerUntil != null && review.spoilerUntil > 0"
                class="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 ml-2 text-[11px] font-medium text-amber-700"
              >
                스포 {{ review.spoilerUntil }}{{ unitLabel }}
              </span>
              <!-- <span v-if="spoilerRangeLabel" class="ml-1 text-amber-700"
                >({{ spoilerRangeLabel }})</span
              > -->
            </p>
          </div>
          <div class="ml-auto text-xs text-gray-400">
            <span class="shrink-0">
              {{ review.createdAtLabel }}
            </span>
            <span class="text-gray-300"> · </span>
            <span>조회 {{ review.viewCount ?? 0 }}</span>
          </div>
        </div>

        <!-- 제목 -->
        <p class="truncate text-base font-semibold text-gray-900">
          {{ review.title || "기록" }}
        </p>

        <!-- 본문 -->
        <div
          v-if="review.body"
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

        <div class="flex flex-wrap items-center gap-y-2 text-xs text-gray-500">
          <div
            v-if="review.tags?.length"
            class="flex flex-wrap gap-1.5 text-gray-600"
          >
            <span
              v-for="t in review.tags"
              :key="t"
              class="rounded-full bg-gray-100 px-2 py-0.5"
            >
              #{{ t }}
            </span>
          </div>
          <div class="flex w-full items-center justify-between gap-3">
            <div class="flex items-center gap-3 text-gray-600 ml-1">
              <button
                type="button"
                class="inline-flex items-center gap-2"
                :class="likedByMe ? 'text-rose-600' : 'text-gray-600'"
                :disabled="isLiking || !isLoggedIn"
                @click.stop="handleLike"
              >
                <span class="text-sm">{{ likedByMe ? "♥" : "♡" }}</span>
                <span>{{ likeCount }}</span>
              </button>
            </div>
            <button
              v-if="isSpoiler"
              type="button"
              class="text-amber-700 underline"
              @click.stop="toggleReveal"
            >
              {{ revealed ? "스포일러 숨기기" : "스포일러 보기" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { toggleReviewLike } from "@/api/review";

const props = defineProps({
  review: {
    type: Object,
    required: true,
  },
  isLoggedIn: {
    type: Boolean,
    default: true,
  },
});

const revealed = ref(false);
const toggleReveal = () => {
  revealed.value = !revealed.value;
};

const likeCount = ref(props.review?.likeCount ?? 0);
const likedByMe = ref(Boolean(props.review?.likedByMe));
const isLiking = ref(false);

watch(
  () => props.review,
  (next) => {
    likeCount.value = next?.likeCount ?? 0;
    likedByMe.value = Boolean(next?.likedByMe);
  }
);

const handleLike = async () => {
  if (!props.review?.id || isLiking.value || !props.isLoggedIn) return;
  isLiking.value = true;
  try {
    const { data } = await toggleReviewLike(props.review.id);
    likeCount.value = data?.likeCount ?? likeCount.value;
    likedByMe.value = Boolean(data?.liked);
  } catch (error) {
    console.error("리뷰 좋아요 토글 실패", error);
  } finally {
    isLiking.value = false;
  }
};

const router = useRouter();
const goDetail = () => {
  if (!props.review?.id) return;
  router.push({ name: "reviewDetail", params: { reviewId: props.review.id } });
};

const initial = computed(() => {
  const src = props.review.authorNickname || props.review.userId || "";
  return src ? src.charAt(0) : "?";
});

const isSpoiler = computed(() => {
  const until = props.review.spoilerUntil;
  const baseProtected =
    props.review.spoiler ??
    props.review.isSpoiler ??
    props.review.spoilerProtected ??
    (until != null && until > 0);

  const myProgress =
    props.review.myProgress ?? props.review.myProgressAtWrite ?? null;

  if (
    baseProtected &&
    until != null &&
    myProgress != null &&
    myProgress >= until
  ) {
    return false; // 내가 본 진행도 이상이면 블러 해제
  }
  return baseProtected;
});

const unitLabel = computed(() => {
  const catId = Number(props.review.contentCategoryId);
  if (!Number.isNaN(catId)) {
    return catId === 1 ? "권" : "화"; // 1: 도서, 그 외: 화 단위
  }
  const cat = (props.review.categoryLabel || "").toLowerCase();
  if (cat.includes("도서") || cat.includes("book")) return "권";
  return "화";
});

const spoilerRangeLabel = computed(() => {
  if (props.review.spoilerUntil != null) {
    return `스포 ${props.review.spoilerUntil}${unitLabel.value}까지`;
  }
  return "";
});
</script>
