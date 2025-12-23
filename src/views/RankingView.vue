<template>
  <div class="mx-auto max-w-5xl px-4 pt-8 md:px-6">
    <!-- 헤더 -->
    <header class="mb-6">
      <h1 class="text-2xl font-bold text-[#2E2A24]">랭킹</h1>
      <p class="mt-1 text-sm text-[#7A766E]">
        지금 사람들이 많이 읽고 공감한 기록
      </p>
    </header>

    <!-- 랭킹 종류 탭 -->
    <div class="mb-4 flex gap-2 text-sm">
      <button
        v-for="tab in rankTabs"
        :key="tab.key"
        @click="activeRankTab = tab.key"
        class="rounded-full px-4 py-1.5 transition"
        :class="
          activeRankTab === tab.key
            ? 'bg-[#EAE9E3] text-[#2E2A24] font-semibold'
            : 'text-[#7A766E] hover:bg-[#F1F0EC]'
        "
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 기간 필터 -->
    <div class="mb-6 flex gap-2 text-xs">
      <button
        v-for="p in periodTabs"
        :key="p.key"
        @click="activePeriod = p.key"
        class="rounded-full px-3 py-1 border transition"
        :class="
          activePeriod === p.key
            ? 'border-[#B3B1AB] bg-white text-[#2E2A24]'
            : 'border-[#DDD9CF] bg-[#F8F7F3] text-[#7A766E]'
        "
      >
        {{ p.label }}
      </button>
    </div>

    <!-- 🔹 랭킹 없음 상태 -->
    <div
      v-if="!isLoading && isEmpty"
      class="flex flex-col items-center justify-center
             rounded-2xl border border-[#EAE9E3]
             bg-[#FAF9F7] py-16 text-center"
    >
      <p class="text-lg font-semibold text-[#2E2A24]">
        아직 랭킹 데이터가 없습니다
      </p>
      <p class="mt-2 text-sm text-[#7A766E]">
        이번 주 첫 리뷰를 남겨보세요!
      </p>
      <p class="mt-1 text-xs text-[#9B978D]">
        랭킹은 리뷰가 쌓이면 자동으로 생성됩니다
      </p>
    </div>

    <!-- ================= 리뷰 많은 순 ================= -->
    <section
      v-if="activeRankTab === 'review' && !isEmpty && !isLoading"
    >
      <div>
        <template v-for="(item, idx) in reviewRankings" :key="item.rank">
          <article
            class="flex items-stretch gap-5 px-2 py-6
                   hover:bg-[#FAF9F7] transition"
          >
            <!-- 순위 -->
            <div class="flex w-10 flex-col items-center pt-1">
              <div class="text-[11px] text-[#8A867D]">RANK</div>
              <div class="mt-1 text-2xl font-extrabold text-[#2E2A24]">
                {{ item.rank }}
              </div>
              <div
                class="mt-2 h-10 w-[2px]"
                :class="item.rank <= 3 ? 'bg-[#2E2A24]' : 'bg-[#DDD9CF]'"
              />
            </div>

            <!-- 이미지 -->
            <div
              class="relative h-36 w-24 flex-shrink-0 overflow-hidden
                     rounded-md bg-gradient-to-br from-[#E9E7E2] to-[#DAD8D2]"
            >
              <img
                v-if="item.image"
                :src="item.image"
                class="h-full w-full object-cover"
              />
              <div v-else class="flex h-full w-full flex-col justify-between p-3">
                <div class="text-[10px] text-[#6B675E] opacity-70">MYANGSIK</div>
                <div class="space-y-1">
                  <div class="h-2 w-10 bg-white/60" />
                  <div class="h-2 w-14 bg-white/50" />
                </div>
                <div class="text-[10px] text-[#6B675E] opacity-60">CUSTOM</div>
              </div>
            </div>

            <!-- 텍스트 -->
            <div class="flex min-w-0 flex-1 flex-col justify-between">
              <div>
                <p class="truncate text-lg font-semibold text-[#2E2A24]">
                  {{ item.book }}
                </p>
                <p class="mt-1 text-sm text-[#7A766E]">
                  {{ item.author }}
                </p>

                <div class="mt-3 flex flex-wrap gap-1.5">
                  <span
                    v-for="tag in item.tags"
                    :key="tag"
                    class="text-[11px] text-[#5E594F]"
                  >
                    #{{ tag }}
                  </span>
                </div>
              </div>

              <div class="mt-4 text-xs text-[#8A867D]">
                리뷰 {{ item.reviewCount }}개
              </div>
            </div>
          </article>

          <div
            v-if="idx !== reviewRankings.length - 1"
            class="border-t border-[#EAE9E3]"
          />
        </template>
      </div>
    </section>

    <!-- ================= 좋아요 많은 순 ================= -->
    <section
      v-else-if="activeRankTab === 'like' && !isEmpty && !isLoading"
    >
      <div>
        <template v-for="(item, idx) in likeRankings" :key="item.review.id">
          <article
            class="flex gap-5 px-2 py-6 hover:bg-[#FAF9F7] transition"
          >
            <!-- 순위 -->
            <div class="flex w-10 flex-col items-center pt-1">
              <div class="text-[11px] text-[#8A867D]">RANK</div>
              <div class="mt-1 text-2xl font-extrabold text-[#2E2A24]">
                {{ idx + 1 }}
              </div>
              <div
                class="mt-2 h-10 w-[2px]"
                :class="idx < 3 ? 'bg-[#2E2A24]' : 'bg-[#DDD9CF]'"
              />
            </div>

            <!-- 프로필 -->
            <div
              class="flex h-12 w-12 items-center justify-center
                     rounded-full bg-gradient-to-br from-[#D9D5CA] to-[#F0EEE9]
                     text-sm font-bold text-white"
            >
              {{ item.review.authorNickname.charAt(0) }}
            </div>

            <!-- 텍스트 -->
            <div class="flex min-w-0 flex-1 flex-col justify-between">
              <div>
                <p class="truncate text-lg font-semibold text-[#2E2A24]">
                  {{ item.review.title }}
                </p>
                <p class="mt-1 text-sm text-[#7A766E]">
                  {{ item.review.contentTitle }}
                  <span v-if="item.review.contentAuthor">
                    · {{ item.review.contentAuthor }}
                  </span>
                </p>
                <p class="mt-1 text-xs text-[#9B978D]">
                  by {{ item.review.authorNickname }}
                </p>
              </div>

              <div class="mt-4 flex gap-3 text-xs text-[#8A867D]">
                <span>♥ {{ item.review.likeCount }}</span>
                <span>조회 {{ item.review.viewCount }}</span>
              </div>
            </div>
          </article>

          <div
            v-if="idx !== likeRankings.length - 1"
            class="border-t border-[#EAE9E3]"
          />
        </template>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { getRanking } from "@/api/ranking";

const rankTabs = [
  { key: "reviews", label: "리뷰 많은 순" },
  { key: "likes", label: "좋아요 많은 순" },
];

const periodTabs = [
  { key: "today", label: "오늘" },
  { key: "week", label: "주간" },
];

const activeRankTab = ref("reviews");
const activePeriod = ref("today");

const reviewRankings = ref([]);
const likeRankings = ref([]);

const isLoading = ref(false);
const isEmpty = ref(false);

watch([activeRankTab, activePeriod], () => {
  fetchRanking();
});

async function fetchRanking() {
  isLoading.value = true;
  isEmpty.value = false;

  try {
    const res = await getRanking({
      type: activeRankTab.value,
      period: activePeriod.value,
    });

    const items = res.items ?? [];

    if (items.length === 0) {
      isEmpty.value = true;
      reviewRankings.value = [];
      likeRankings.value = [];
      return;
    }

    if (activeRankTab.value === "reviews") {
      reviewRankings.value = items;
    } else {
      likeRankings.value = items;
    }
  } catch (e) {
    console.error("랭킹 조회 실패", e);
    isEmpty.value = true;
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchRanking();
});
</script>
