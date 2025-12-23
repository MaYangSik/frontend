<template>
  <article class="py-5">
    <div class="flex gap-3 cursor-pointer" @click="goDetail">
      <!-- ❌ Avatar 제거 -->

      <!-- Body -->
      <div class="min-w-0 flex-1 space-y-3">
        <!-- 메타 블록 (책 정보 + 날짜) -->
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 space-y-1">
            <p class="truncate text-xs text-gray-500">
              <span class="font-medium text-gray-800">
                {{ review.contentTitle }}
              </span>
              <span v-if="review.contentAuthor" class="ml-1 text-gray-400">
                · {{ review.contentAuthor }}
              </span>
              <span v-if="spoilerRangeLabel" class="ml-1 text-amber-700">
                ({{ spoilerRangeLabel }})
              </span>
            </p>
          </div>

          <span class="shrink-0 text-xs text-gray-400">
            {{ review.createdAtLabel }}
          </span>
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
          <p class="whitespace-pre-line">
            {{ review.body }}
          </p>

          <div
            v-if="isSpoiler && !revealed"
            class="absolute inset-0 flex items-center justify-center
                   bg-white/40 text-xs text-amber-800"
          >
            스포일러 보호 중 · 보기 버튼을 눌러 확인
          </div>
        </div>

        <!-- 태그 + 액션 -->
        <div class="flex flex-wrap items-center gap-y-2 text-xs text-gray-500">
          <!-- 태그 -->
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

          <!-- 스포일러 버튼만 유지 -->
          <div class="flex w-full justify-end">
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
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  review: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

/* ===============================
   스포일러 처리
================================ */
const revealed = ref(false);
const toggleReveal = () => {
  revealed.value = !revealed.value;
};

const isSpoiler = computed(
  () =>
    props.review.spoiler ??
    props.review.isSpoiler ??
    false
);

/* ===============================
   스포 범위 라벨
================================ */
const unitLabel = computed(() => {
  const catId = Number(props.review.contentCategoryId);
  if (!Number.isNaN(catId)) {
    return catId === 1 ? "권" : "화";
  }
  return "화";
});

const spoilerRangeLabel = computed(() => {
  if (props.review.spoilerUntil != null) {
    return `스포 ${props.review.spoilerUntil}${unitLabel.value}까지`;
  }
  return "";
});

/* ===============================
   상세 이동
================================ */
const goDetail = () => {
  if (!props.review?.id) return;
  router.push({
    name: "reviewDetail",
    params: { reviewId: props.review.id },
  });
};
</script>
