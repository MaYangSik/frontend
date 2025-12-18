<template>
  <article class="py-5">
    <div class="flex items-start justify-between gap-3">
      <div class="flex min-w-0 items-start gap-3">
        <div class="h-11 w-11 flex-shrink-0 overflow-hidden rounded-full bg-gray-100">
          <img
            v-if="item.avatarUrl"
            :src="item.avatarUrl"
            :alt="`${item.nickname} 프로필`"
            class="h-full w-full object-cover"
          />
          <div v-else class="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-500">
            {{ item.nickname?.charAt(0) || 'U' }}
          </div>
        </div>

        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p class="truncate text-sm font-semibold text-gray-900">{{ item.nickname }}</p>
            <p class="truncate text-xs text-gray-400">@{{ item.userId }}</p>
          </div>
          <p class="mt-1 line-clamp-2 text-sm text-gray-600">
            {{ item.bio || '한 줄 소개가 아직 없어요.' }}
          </p>

          <div v-if="item.preferenceTags?.length" class="mt-3 flex flex-wrap gap-1.5">
            <span
              v-for="t in item.preferenceTags"
              :key="t"
              class="rounded-full bg-gray-50 px-2 py-0.5 text-xs text-gray-600"
            >
              #{{ t }}
            </span>
          </div>

          <div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
            <span v-if="item.primaryCategoryLabel">주로 {{ item.primaryCategoryLabel }}</span>
            <template v-if="item.primaryCategoryLabel && item.recentRecordCount != null">
              <span class="text-gray-300">·</span>
            </template>
            <span v-if="item.recentRecordCount != null">최근 30일 기록 {{ item.recentRecordCount }}개</span>
            <span v-if="item.levelId != null && !item.primaryCategoryLabel && item.recentRecordCount == null">
              레벨 {{ item.levelId }}
            </span>
          </div>
        </div>
      </div>

      <button
        v-if="showFollow"
        type="button"
        class="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        @click="$emit('toggle-follow', item.userId)"
      >
        {{ item.isFollowing ? '팔로잉' : '팔로우' }}
      </button>
    </div>
  </article>
</template>

<script setup>
defineProps({
  item: { type: Object, required: true },
  showFollow: { type: Boolean, default: true },
})

defineEmits(['toggle-follow'])
</script>
