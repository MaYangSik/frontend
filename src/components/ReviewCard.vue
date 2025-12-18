<template>
  <article class="py-5">
    <div class="flex gap-3">
      <!-- Avatar -->
      <div
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700"
      >
        {{ initial }}
      </div>

      <!-- Body -->
      <div class="min-w-0 flex-1 space-y-2">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <!-- 메타 1: 작성자 -->
            <p class="truncate text-xs font-semibold text-gray-800">
              {{ authorLabel }}
            </p>
            <!-- 메타 2: 작품/진행도 -->
            <p class="truncate text-xs text-gray-500">
              <span v-if="contentLabel">{{ contentLabel }}</span>
              <span v-if="progressLabel" class="ml-1 text-gray-400">({{ progressLabel }})</span>
            </p>
            <!-- 제목 -->
            <p class="truncate text-base font-semibold text-gray-900">
              {{ review.title || "기록" }}
            </p>
          </div>
          <span class="shrink-0 text-xs text-gray-400">{{
            review.createdAtLabel || review.time
          }}</span>
        </div>

        <!-- Content -->
        <div
          v-if="review.body"
          class="relative rounded-xl bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-800"
          :class="
            review.spoilerProtected && !revealed
              ? 'filter blur-[3px] select-none'
              : ''
          "
        >
          <p class="whitespace-pre-line">{{ review.body }}</p>
          <div
            v-if="review.spoilerProtected && !revealed"
            class="absolute inset-0 flex items-center justify-center bg-white/40 text-xs text-amber-800"
          >
            스포일러 보호 중 · 보기 버튼을 눌러 확인
          </div>
        </div>

        <button
          v-if="review.spoilerProtected"
          type="button"
          class="text-xs text-amber-700 underline"
          @click="toggleReveal"
        >
          {{ revealed ? "스포일러 숨기기" : "스포일러 보기" }}
        </button>

        <div
          v-if="review.tags?.length"
          class="flex flex-wrap gap-1.5 text-xs text-gray-600"
        >
          <span
            v-for="t in review.tags"
            :key="t"
            class="rounded-full bg-gray-100 px-2 py-0.5"
          >
            #{{ t }}
          </span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  review: {
    type: Object,
    required: true,
  },
});

const revealed = ref(false);
const toggleReveal = () => {
  revealed.value = !revealed.value;
};

const initial = computed(() => {
  const src =
    props.review.authorNickname ||
    props.review.authorId ||
    props.review.user?.name ||
    "";
  return src ? src.charAt(0) : "?";
});

const authorLabel = computed(() => {
  const name = props.review.authorNickname || props.review.user?.name;
  const id = props.review.authorId || props.review.user?.username || props.review.userId;
  if (name && id) return `${name} · @${id}`;
  if (name) return name;
  if (id) return `@${id}`;
  return "";
});

const contentLabel = computed(() => {
  const title = props.review.contentTitle || props.review.book?.title;
  const cat = props.review.categoryLabel;
  if (title && cat) return `${title} · ${cat}`;
  return title || "";
});

const progressLabel = computed(() => {
  if (props.review.myProgress != null) return `진행 ${props.review.myProgress}`;
  if (props.review.progress != null) return `진행 ${props.review.progress}`;
  return "";
});
</script>
