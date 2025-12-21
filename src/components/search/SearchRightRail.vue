<template>
  <aside class="hidden md:block">
    <div class="sticky top-20 space-y-6">
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
