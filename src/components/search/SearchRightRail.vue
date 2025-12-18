<template>
  <aside class="hidden md:block">
    <div class="sticky top-20 space-y-6">
      <!-- Popular -->
      <section v-if="popularKeywords.length" class="rounded-2xl bg-gray-50 px-4 py-4">
        <h3 class="text-sm font-semibold text-gray-900">자주 등장한 키워드</h3>
        <p class="mt-1 text-xs text-gray-500">검색 결과에서 많이 나온 태그/키워드</p>
        <div class="mt-3 space-y-1">
          <button
            v-for="(k, idx) in popularKeywords"
            :key="k"
            type="button"
            class="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm text-gray-700 hover:bg-white"
            @click="$emit('select-keyword', k)"
          >
            <span class="truncate">
              <span class="mr-2 text-xs text-gray-400">{{ idx + 1 }}</span>
              #{{ k }}
            </span>
            <span class="text-xs text-gray-400">검색</span>
          </button>
        </div>
      </section>

      <!-- Recommended contents -->
      <section v-if="recommendedContents.length" class="rounded-2xl bg-gray-50 px-4 py-4">
        <h3 class="text-sm font-semibold text-gray-900">추천 컨텐츠</h3>
        <p class="mt-1 text-xs text-gray-500">최근 기록이 많은 작품</p>
        <div class="mt-3 space-y-2">
          <button
            v-for="c in recommendedContents"
            :key="c.id"
            type="button"
            class="w-full rounded-xl bg-white px-3 py-3 text-left hover:bg-gray-50"
            @click="$emit('select-content', c)"
          >
            <p class="truncate text-sm font-semibold text-gray-900">{{ c.title }}</p>
            <p class="mt-1 text-xs text-gray-500">
              {{ c.categoryLabel }} · 기록 {{ c.recordCount }}개
            </p>
          </button>
        </div>
      </section>

      <!-- Suggested tags -->
      <section v-if="suggestedTags?.length" class="rounded-2xl bg-gray-50 px-4 py-4">
        <h3 class="text-sm font-semibold text-gray-900">추천 태그</h3>
        <div class="mt-3 flex flex-wrap gap-2">
          <button
            v-for="t in suggestedTags"
            :key="t"
            type="button"
            class="rounded-full bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
            @click="$emit('select-tag', t)"
          >
            #{{ t }}
          </button>
        </div>
      </section>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  popularKeywords: { type: Array, default: () => [] },
  recommendedContents: { type: Array, default: () => [] },
  suggestedTags: { type: Array, default: () => [] },
})

defineEmits(['select-keyword', 'select-content', 'select-tag'])
</script>
