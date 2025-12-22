<template>
  <div v-if="modelValue" class="fixed inset-0 z-50">
    <div class="absolute inset-0 bg-black/30" @click="close" />

    <aside
      class="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white shadow-xl"
      role="dialog"
      aria-modal="true"
      aria-label="검색 필터"
    >
      <header
        class="sticky top-0 z-10 border-b border-gray-100 bg-white/95 backdrop-blur"
      >
        <div class="flex items-center justify-between px-5 py-4">
          <div>
            <h2 class="text-base font-semibold text-gray-900">검색 필터</h2>
            <p class="mt-0.5 text-xs text-gray-500">
              필터는 즉시 결과에 반영됩니다.
            </p>
          </div>
          <button
            type="button"
            class="rounded-lg px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
            @click="close"
          >
            닫기
          </button>
        </div>
      </header>

      <div class="space-y-6 px-5 py-5">
        <!-- Search targets -->
        <section class="space-y-3">
          <h3
            class="text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            검색 대상
          </h3>
          <div class="grid grid-cols-2 gap-2">
            <label
              class="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm"
            >
              <input
                v-model="filters.targets.title"
                type="checkbox"
                class="h-4 w-4"
              />
              제목
            </label>
            <label
              class="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm"
            >
              <input
                v-model="filters.targets.body"
                type="checkbox"
                class="h-4 w-4"
              />
              본문
            </label>
            <label
              class="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm"
            >
              <input
                v-model="filters.targets.tag"
                type="checkbox"
                class="h-4 w-4"
              />
              태그
            </label>
            <label
              class="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm"
            >
              <input
                v-model="filters.targets.nickname"
                type="checkbox"
                class="h-4 w-4"
              />
              닉네임
            </label>
          </div>
        </section>

        <!-- Content category -->
        <section class="space-y-3">
          <h3
            class="text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            컨텐츠 카테고리
          </h3>
          <div class="flex flex-wrap gap-2">
            <label
              class="inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1.5 text-sm"
            >
              <input
                v-model="filters.categories.book"
                type="checkbox"
                class="h-4 w-4"
              />
              도서
            </label>
            <label
              class="inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1.5 text-sm"
            >
              <input
                v-model="filters.categories.webnovel"
                type="checkbox"
                class="h-4 w-4"
              />
              웹소설
            </label>
            <label
              class="inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1.5 text-sm"
            >
              <input
                v-model="filters.categories.webtoon"
                type="checkbox"
                class="h-4 w-4"
              />
              웹툰
            </label>
          </div>
        </section>

        <!-- Ownership / progress -->
        <section class="space-y-3">
          <h3
            class="text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            내 기준
          </h3>
          <label
            class="flex items-start gap-3 rounded-xl border border-gray-100 px-4 py-3"
          >
            <input
              v-model="filters.myOnly"
              type="checkbox"
              class="mt-1 h-4 w-4"
            />
            <div>
              <p class="text-sm font-medium text-gray-900">내 기록만 표시</p>
              <p class="mt-0.5 text-xs text-gray-500">
                내가 작성한 리뷰만 모아봅니다.
              </p>
            </div>
          </label>
          <label
            class="flex items-start gap-3 rounded-xl border border-gray-100 px-4 py-3"
          >
            <input
              v-model="filters.seenOnly"
              type="checkbox"
              class="mt-1 h-4 w-4"
            />
            <div>
              <p class="text-sm font-medium text-gray-900">내가 본 컨텐츠만</p>
              <p class="mt-0.5 text-xs text-gray-500">
                내 진행도가 있는 작품만 보여줍니다.
              </p>
            </div>
          </label>
          <label
            class="flex items-start gap-3 rounded-xl border border-gray-100 px-4 py-3"
          >
            <input
              v-model="filters.limitToMyProgress"
              type="checkbox"
              class="mt-1 h-4 w-4"
            />
            <div>
              <p class="text-sm font-medium text-gray-900">내가 읽은 만큼만</p>
              <p class="mt-0.5 text-xs text-gray-500">
                내 진행도보다 앞선 리뷰는 제외합니다.
              </p>
            </div>
          </label>
          <label
            class="flex items-start gap-3 rounded-xl border border-gray-100 px-4 py-3"
          >
            <input
              v-model="filters.noSpoilerOnly"
              type="checkbox"
              class="mt-1 h-4 w-4"
            />
            <div>
              <p class="text-sm font-medium text-gray-900">
                스포일러 없는 리뷰만
              </p>
              <p class="mt-0.5 text-xs text-gray-500">
                모두가 볼 수 있는 리뷰만 보여줍니다.
              </p>
            </div>
          </label>
          <p class="text-xs text-gray-400 text-right">
            위 옵션들은 '내 진행도' 가 있어야 제대로 동작합니다.
          </p>
        </section>

        <!-- Date range -->
        <section class="space-y-3">
          <h3
            class="text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            검색 기간
          </h3>
          <div class="grid grid-cols-2 gap-3">
            <label class="block">
              <input
                v-model="filters.dateFrom"
                type="date"
                class="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              />
            </label>
            <label class="block">
              <input
                v-model="filters.dateTo"
                type="date"
                class="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              />
            </label>
          </div>
        </section>
      </div>

      <footer class="sticky bottom-0 border-t border-gray-100 bg-white">
        <div class="flex items-center justify-between gap-3 px-5 py-4">
          <button
            type="button"
            class="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            @click="$emit('reset')"
          >
            초기화
          </button>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
              @click="close"
            >
              닫기
            </button>
            <!-- <button
              type="button"
              class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              @click="close"
            >
              닫기
            </button>
            <button
              type="button"
              class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
              @click="$emit('apply')"
            >
              적용
            </button> -->
          </div>
        </div>
      </footer>
    </aside>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Boolean, required: true },
  filters: { type: Object, required: true },
  // contentOptions: { type: Array, default: () => [] },
});

const emit = defineEmits(["update:modelValue", "apply", "reset"]);

const close = () => emit("update:modelValue", false);
</script>
