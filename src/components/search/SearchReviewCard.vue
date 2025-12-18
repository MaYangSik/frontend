<template>
  <article class="py-5">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <div class="flex flex-wrap items-center gap-2">
          <span
            class="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
          >
            {{ categoryLabel }}
          </span>
          <span
            v-if="item.isMine"
            class="inline-flex items-center rounded-full bg-gray-900 px-2 py-0.5 text-xs font-medium text-white"
          >
            내 기록
          </span>
          <span
            v-if="item.spoilerProtected"
            class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700"
          >
            <span aria-hidden="true">⚠️</span>
            스포 주의
          </span>
        </div>

        <h3 class="mt-2 truncate text-base font-semibold text-gray-900">
          {{ item.title || "(제목 없음)" }}
        </h3>

        <p class="mt-1 text-sm text-gray-500">
          <span class="font-medium text-gray-700">{{ item.contentTitle }}</span>
          <span class="text-gray-300">·</span>
          <span>{{ item.authorNickname }}</span>
          <span class="text-gray-300">·</span>
          <span>{{ item.createdAtLabel }}</span>
        </p>

        <div class="mt-3">
          <div
            v-if="item.spoilerProtected"
            class="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-900"
          >
            <p class="font-medium">스포일러 보호 중</p>
            <p class="mt-1 text-xs text-amber-700">
              {{
                item.spoilerSafeUntil
                  ? `${item.spoilerSafeUntil}${unitLabel}까지`
                  : "보호 설정됨"
              }}
              · 검색에서는 요약을 숨깁니다.
            </p>
          </div>
          <p v-else class="line-clamp-3 text-sm text-gray-700">
            {{ item.body }}
          </p>
        </div>

        <div v-if="item.tags?.length" class="mt-3 flex flex-wrap gap-1.5">
          <span
            v-for="t in item.tags"
            :key="t"
            class="rounded-full bg-gray-50 px-2 py-0.5 text-xs text-gray-600"
          >
            #{{ t }}
          </span>
        </div>
      </div>

      <div class="flex flex-col items-end gap-2">
        <div
          v-if="item.myProgressAtWrite"
          class="rounded-xl bg-gray-900 px-3 py-2 text-right text-xs text-white"
          title="작성 당시 내 진행도"
        >
          <p class="font-medium">작성 시점</p>
          <p class="mt-0.5">{{ item.myProgressAtWrite }}{{ unitLabel }}</p>
        </div>
        <p class="text-xs text-gray-400">
          {{ item.createdAtLabel }}
        </p>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  item: { type: Object, required: true },
});

const categoryLabel = computed(() => {
  const v = props.item.category;
  if (v === "book") return "도서";
  if (v === "webnovel") return "웹소설";
  if (v === "webtoon") return "웹툰";
  return "리뷰";
});

const unitLabel = computed(() =>
  props.item.category === "book" ? "권" : "화"
);
</script>
