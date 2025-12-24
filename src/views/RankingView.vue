<template>
  <div class="mx-auto max-w-5xl px-4 pt-8 md:px-6">
    <!-- 헤더 -->
    <header class="mb-6">
      <h1 class="text-2xl font-bold text-[#2E2A24]">랭킹</h1>
      <p class="mt-1 text-sm text-[#7A766E]">지금 사람들이 많이 읽고 공감한 기록</p>
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

    <!-- 로딩 상태 (간단) -->
    <div
      v-if="isLoading"
      class="flex items-center justify-center rounded-2xl border border-[#EAE9E3] bg-white py-16"
    >
      <p class="text-sm text-[#7A766E]">랭킹 불러오는 중...</p>
    </div>

    <!-- 랭킹 없음 상태 -->
    <div
      v-else-if="isEmpty"
      class="flex flex-col items-center justify-center rounded-2xl border border-[#EAE9E3] bg-[#FAF9F7] py-16 text-center"
    >
      <p class="text-lg font-semibold text-[#2E2A24]">아직 랭킹 데이터가 없습니다</p>
      <p class="mt-2 text-sm text-[#7A766E]">이번 주 첫 리뷰를 남겨보세요!</p>
      <p class="mt-1 text-xs text-[#9B978D]">랭킹은 리뷰가 쌓이면 자동으로 생성됩니다</p>
    </div>

    <!-- ================= 리뷰 많은 순 ================= -->
    <section v-else-if="activeRankTab === 'reviews'">
      <div>
        <template v-for="(item, idx) in reviewRankings" :key="item.rank ?? idx">
          <article class="flex items-stretch gap-5 px-2 py-6 hover:bg-[#FAF9F7] transition">
            <!-- 순위 -->
            <div class="flex w-10 flex-col items-center pt-1">
              <div class="text-[11px] text-[#8A867D]">RANK</div>
              <div class="mt-1 text-2xl font-extrabold text-[#2E2A24]">
                {{ item.rank ?? idx + 1 }}
              </div>
              <div
                class="mt-2 h-10 w-[2px]"
                :class="(item.rank ?? idx + 1) <= 3 ? 'bg-[#2E2A24]' : 'bg-[#DDD9CF]'"
              />
            </div>

            <!-- 이미지 -->
            <div
              class="relative h-36 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gradient-to-br from-[#E9E7E2] to-[#DAD8D2]"
            >
              <img v-if="item.image" :src="item.image" class="h-full w-full object-cover" />
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
              <div class="min-w-0">
                <p class="truncate text-lg font-semibold text-[#2E2A24]">
                  {{ item.book }}
                </p>
                <p class="mt-1 line-clamp-2 text-sm text-[#7A766E]">
                  {{ item.author }}
                </p>

                <!-- 태그: 너무 많으면 잘라서 +N 표시 -->
                <div class="mt-3 flex flex-wrap gap-1.5">
                  <span
                    v-for="tag in visibleTags(item.tags)"
                    :key="tag"
                    class="text-[11px] text-[#5E594F]"
                  >
                    #{{ tag }}
                  </span>

                  <span
                    v-if="hiddenTagCount(item.tags) > 0"
                    class="text-[11px] text-[#9B978D]"
                  >
                    +{{ hiddenTagCount(item.tags) }}
                  </span>
                </div>
              </div>

              <div class="mt-4 text-xs text-[#8A867D]">
                리뷰 {{ item.reviewCount ?? 0 }}개
              </div>
            </div>
          </article>

          <div v-if="idx !== reviewRankings.length - 1" class="border-t border-[#EAE9E3]" />
        </template>
      </div>
    </section>

    <!-- ================= 좋아요 많은 순 ================= -->
   <section v-else-if="activeRankTab === 'likes'">
  <div>
    <template v-for="(item, idx) in likeRankings" :key="item.id ?? idx">
      
      <!-- 🔥 article → div 로 변경 -->
      <div class="flex gap-5 px-2 py-6 hover:bg-[#FAF9F7] transition">

        
        <!-- RANK (절대 건들지 말라 했으니 그대로) -->
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
      

        <!-- ReviewCard -->
        <div class="flex-1 min-w-0">
          <ReviewCard
            :review="item"
            :is-logged-in="isLoggedIn"
          />
        </div>
      </div>

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
import ReviewCard from "@/components/ReviewCard.vue";


const rankTabs = [
  { key: "reviews", label: "리뷰 많은 순" },
  { key: "likes", label: "좋아요 많은 순" },
];

const periodTabs = [
  { key: "day", label: "오늘" },
  { key: "week", label: "주간" },
];

const activeRankTab = ref("reviews"); // ✅ key와 일치
const activePeriod = ref("day");

const reviewRankings = ref([]);
const likeRankings = ref([]);

const isLoading = ref(false);
const isEmpty = ref(false);

watch([activeRankTab, activePeriod], () => {
  fetchRanking();
});

function normalizeItems(items) {
  // items가 배열이 아니면 빈 배열
  return Array.isArray(items) ? items : [];
}

function normalizeReview(r) {
  if (!r) return {};

  return {
    ...r,

    // ReviewCard가 기대하는 필드 보정
    body: r.body ?? r.content ?? "",

    spoiler: Boolean(r.spoilerUntil && r.spoilerUntil > 0),

    createdAtLabel: r.createdAtLabel ?? "",

    // 혹시 없는 경우 대비
    tags: r.tags ?? [],
    likedByMe: Boolean(r.likedByMe),
  };
}


async function fetchRanking() {
  isLoading.value = true;
  isEmpty.value = false;

  try {
    const res = await getRanking({
      type: activeRankTab.value,
      period: activePeriod.value,
    });

    
    const items = normalizeItems(res?.data?.items);

    console.log(items)

    if (items.length === 0) {
      isEmpty.value = true;
      reviewRankings.value = [];
      likeRankings.value = [];
      return;
    }

    if (activeRankTab.value === "reviews") {
      reviewRankings.value = items;
      likeRankings.value = []; // 탭 전환 시 섞임 방지
    } else {
      likeRankings.value = items;
      reviewRankings.value = [];
    }
  } catch (e) {
    console.error("랭킹 조회 실패", e);
    isEmpty.value = true;
    reviewRankings.value = [];
    likeRankings.value = [];
  } finally {
    isLoading.value = false;
  }
}

/** 태그 너무 많아서 UI 터지는 거 방지: 앞 6개만 보여주고 +N */
const MAX_TAGS = 6;
function visibleTags(tags) {
  if (!Array.isArray(tags)) return [];
  return tags.slice(0, MAX_TAGS);
}
function hiddenTagCount(tags) {
  if (!Array.isArray(tags)) return 0;
  return Math.max(0, tags.length - MAX_TAGS);
}

onMounted(() => {
  fetchRanking();
});
</script>
