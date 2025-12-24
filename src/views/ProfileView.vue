<template>
  <div class="min-h-screen bg-[#F1F0EC]">
    <div class="mx-auto flex max-w-5xl gap-8 px-4 md:px-6 py-10">
      <!-- 왼쪽: 프로필 -->
      <aside
        class="sticky top-10 h-fit w-64 flex-shrink-0 rounded-xl border border-gray-200 bg-white px-6 py-7 shadow-sm"
      >
        <div class="flex flex-col items-center text-center">
          <div
            class="h-24 w-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mb-4"
          >
            <img
              v-if="user.profile_image_url"
              :src="`${S3_BASE_URL}/${user.profile_image_url}`"
              class="h-full w-full object-cover"
            />
            <span v-else class="text-white text-2xl font-bold">
              {{ user?.nickname?.charAt(0) || "M" }}
            </span>
          </div>

          <h1 class="mt-2 text-lg font-semibold text-gray-900">
            {{ user.nickname }}
          </h1>
          <p class="text-xs text-gray-500">@{{ user.user_id }}</p>

          <p class="mt-4 text-sm text-[#5E594F] leading-snug">
            {{ user.bio }}
          </p>

          <div class="mt-4 flex gap-3 text-xs text-gray-600">
            <RouterLink :to="`/users/${store.userId}/followees`">
              <strong>{{ followCount.followees }}</strong> 팔로잉
            </RouterLink>
            <RouterLink :to="`/users/${store.userId}/followers`">
              <strong>{{ followCount.followers }}</strong> 팔로워
            </RouterLink>
          </div>
          <div class="flex gap-2 w-full mt-6">
            <RouterLink
              :to="`/users/${store.userId}/edit`"
              class="flex-1 rounded-full border border-gray-300 py-2 text-xs text-gray-700 hover:bg-gray-50"
            >
              프로필 수정
            </RouterLink>
            <RouterLink
              :to="`/users/${store.userId}/settings`"
              class="flex-1 rounded-full border border-gray-300 py-2 text-xs text-gray-700 hover:bg-gray-50"
            >
              설정
            </RouterLink>
          </div>

          <div class="mt-6 w-full rounded-xl bg-[#F8F7F3] px-4 py-3">
            <div class="flex justify-between text-xs py-2">
              <div class="flex-1 text-center">
                <span class="text-lg font-semibold">{{
                  stats.libraryCount
                }}</span>
                <div>내 서재</div>
              </div>

              <div class="flex-1 text-center">
                <span class="text-lg font-semibold">{{
                  stats.reviewCount
                }}</span>
                <div>리뷰</div>
              </div>

              <div class="flex-1 text-center">
                <span class="text-lg font-semibold">{{ stats.likeCount }}</span>
                <div>좋아요</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- 오른쪽 -->
      <main class="flex-1 flex justify-center">
        <div class="w-full max-w-2xl">
          <!-- 탭 -->
          <div class="flex gap-6 mb-8 border-b border-gray-200">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              @click="handleTabClick(tab.key)"
              class="pb-3 px-1 text-sm transition"
              :class="
                activeTab === tab.key
                  ? 'font-semibold text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-900'
              "
            >
              {{ tab.label }}
            </button>
          </div>

          <!-- 나의 리뷰 -->
          <div v-if="activeTab === 'reviews'" class="divide-y">
            <ReviewCard v-for="r in reviews" :key="r.id" :review="r" />

            <p
              v-if="!reviews.length"
              class="py-20 text-center text-sm text-gray-500"
            >
              표시할 리뷰가 없습니다.
            </p>
          </div>

          <!-- 좋아요 -->
          <!-- 좋아요 -->
          <div v-else-if="activeTab === 'likes'" class="divide-y">
            <ReviewCard v-for="r in likedReviews" :key="r.id" :review="r" />

            <!-- ✅ 좋아요 없음 안내 문구 (복구) -->
            <p
              v-if="!likedReviews.length"
              class="py-20 text-center text-sm text-gray-500"
            >
              좋아요한 글이 없습니다.
            </p>
          </div>

          <!-- 내 서재 -->
          <div v-else-if="activeTab === 'library'">
            <div
              v-if="viewMode === 'library'"
              class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-14"
            >
              <div
                v-for="book in library"
                :key="book.id"
                class="flex flex-col items-center cursor-pointer"
                @click="goToMyReviews(book)"
              >
                <!-- 책 -->
                <div
                  class="relative w-[145px] h-[205px] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group"
                >
                  <div
                    class="absolute inset-0 rounded-r-md shadow-md overflow-hidden border-l-[3px] border-black/10"
                    :class="book.theme.cover"
                  >
                    <div
                      class="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-white/10"
                    />

                    <div
                      class="absolute bottom-6 left-0 right-0 bg-white/90 backdrop-blur-sm py-2 px-3 transform translate-x-1 shadow-sm"
                    >
                      <p
                        class="text-[10px] font-bold text-gray-800 tracking-tighter truncate"
                      >
                        {{ book.title }}
                      </p>
                      <div class="w-4 h-[1px] bg-gray-400 mt-1"></div>
                    </div>

                    <div
                      class="absolute right-1 top-0 bottom-0 w-[1px] bg-black/5"
                    ></div>
                  </div>
                </div>

                <div class="mt-4 w-[140px] text-center">
                  <p class="text-sm font-semibold line-clamp-2">
                    {{ book.title }}
                  </p>
                  <p class="text-xs text-gray-500">{{ book.author }}</p>
                </div>
              </div>

              <p
                v-if="!library.length"
                class="col-span-full py-20 text-center text-sm text-gray-500"
              >
                아직 서재에 담긴 책이 없습니다.
              </p>
            </div>

            <!-- 책 리뷰 -->
            <div v-else class="space-y-6">
              <!-- 뒤로가기 -->
              <button
                class="text-sm text-[#6B675E] hover:underline"
                @click="backToLibrary"
              >
                ← 내 서재
              </button>

              <!-- ✅ 책 소개 헤더 (복구됨) -->
              <div class="flex gap-6 items-start">
                <!-- 책 오브젝트 (작은 버전) -->
                <div class="relative w-28 h-40 flex-shrink-0">
                  <!-- 책등 -->
                  <div
                    class="absolute left-0 top-0 h-full w-[10px] shadow-inner"
                    :class="selectedBook.theme.spine"
                  />

                  <!-- 표지 -->
                  <div
                    class="absolute inset-0 ml-[10px] rounded-sm shadow-md overflow-hidden"
                  >
                    <div
                      class="absolute inset-0"
                      :class="selectedBook.theme.cover"
                    />
                    <div
                      class="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/20"
                    />

                    <!-- 중앙 타이틀 -->
                    <div
                      class="absolute left-1/2 top-1/2 w-[70px] -translate-x-1/2 -translate-y-1/2 bg-white/85 px-2 py-2 shadow-sm"
                    >
                      <p
                        class="text-[10px] font-medium text-[#2E2A24] text-center line-clamp-4"
                      >
                        {{ selectedBook.title }}
                      </p>
                    </div>

                    <!-- 하단 -->
                    <div
                      class="absolute bottom-0 h-7 w-full"
                      :class="selectedBook.theme.bottom"
                    />
                  </div>
                </div>

                <!-- 책 메타 정보 -->
                <div class="min-w-0 flex-1 space-y-3">
                  <div class="space-y-1">
                    <p
                      class="text-lg font-semibold text-[#2E2A24] leading-snug"
                    >
                      {{ selectedBook.title }}
                    </p>
                    <p class="text-sm text-[#7A766E]">
                      {{ selectedBook.author }}
                    </p>
                  </div>

                  <!-- 태그 -->
                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="tag in selectedBookTags"
                      :key="tag"
                      class="rounded-full border border-[#E5E3DD] bg-[#F8F7F3] px-2.5 py-1 text-[11px] text-[#5E594F]"
                    >
                      #{{ tag }}
                    </span>
                  </div>

                  <!-- 문구 -->
                  <div class="flex items-center gap-2">
                    <span
                      class="inline-flex items-center rounded-full border border-[#DDD9CF] bg-white px-2.5 py-1 text-[11px] text-[#6B675E]"
                    >
                      내 리뷰 {{ bookReviews.length }}개
                    </span>
                    <p class="text-xs text-[#8A867D]">
                      이 책에 남긴 나의 기록을 모아봤어요.
                    </p>
                  </div>
                </div>
              </div>

              <!-- 리뷰 리스트 -->
              <div class="divide-y">
                <ReviewCard v-for="r in bookReviews" :key="r.id" :review="r" />

                <p
                  v-if="!bookReviews.length"
                  class="py-10 text-center text-sm text-gray-500"
                >
                  이 책에 작성한 리뷰가 아직 없습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useUserStore } from "@/stores/user";
import {
  getFollowCount,
  getUserInfo,
  getMyLibrary,
  getMyLikedReviews,
} from "@/api/user";
import ReviewCard from "@/components/ReviewCard.vue";

const S3_BASE_URL =
  "https://mayangsik-uploaded-files.s3.ap-northeast-2.amazonaws.com/";

const store = useUserStore();

const followCount = ref({ followers: 0, followees: 0 });
const stats = ref({ libraryCount: 0, reviewCount: 0, likeCount: 0 });

const tabs = [
  { key: "library", label: "내 서재" },
  { key: "reviews", label: "나의 리뷰" },
  { key: "likes", label: "좋아요" },
];

const activeTab = ref("library");
const viewMode = ref("library");
const selectedBook = ref(null);
const bookReviews = ref([]);

const library = ref([]);
const reviews = ref([]);
const likedReviews = ref([]);

const user = ref({
  user_id: "",
  nickname: "",
  bio: "",
  profile_image_url: "",
});

/* -----------------------------
   🎨 Book Theme
----------------------------- */
const BOOK_THEMES = [
  {
    cover: "bg-[#EAE7E1]", // 미색 베이지
    spine: "bg-[#D1CDC2]",
    bottom: "bg-[#BDB8AC]",
  },
  {
    cover: "bg-[#3D4C5A]", // 딥 네이비 (흰색 글자 추천)
    spine: "bg-[#2D3945]",
    bottom: "bg-[#1E262E]",
  },
  {
    cover: "bg-[#7B8B6F]", // 세이지 그린
    spine: "bg-[#65735A]",
    bottom: "bg-[#545F4B]",
  },
];

const getTheme = (id) => BOOK_THEMES[id % BOOK_THEMES.length];

/* -----------------------------
   ✅ ReviewCard 공통 매핑 (내 리뷰 / 서재)
----------------------------- */
const toReviewCardShape = (item) => ({
  id: String(item.reviewId),
  title: item.title,
  body: item.content,
  authorNickname: user.value.nickname,
  userId: user.value.user_id,
  contentTitle: item.contentName,
  contentAuthor: item.contentAuthor,
  tags: item.tags?.map((t) => t.tagName) ?? [],
  createdAt: item.createdAt,
  likeCount: item.likeCount ?? 0,
  likedByMe: item.likedByMe ?? false,
  imageUrls: item.imageUrls ?? [],
  contentCategoryId: item.contentCategoryId,
});

/* -----------------------------
   ✅ 좋아요 전용 매핑 (🔥 핵심 추가)
----------------------------- */
const toReviewCardFromLiked = (item) => ({
  id: String(item.reviewId),

  // ReviewCard 기본 필드
  title: item.title,
  body: item.content,

  authorNickname: item.nickname,
  userId: item.userId,

  contentTitle: item.contentName,
  contentAuthor: item.contentAuthor,
  contentCategoryId: item.contentCategoryId,

  tags: Array.isArray(item.tags) ? item.tags.map((t) => t.tagName) : [],

  // 날짜 / 메타
  createdAt: item.createdAt,
  spoilerUntil: item.spoilerUntil,

  // 좋아요
  likeCount: item.likeCount ?? 0,
  likedByMe: item.likedByMe ?? false,

  // 이미지
  imageUrls: item.imageUrls ?? [],
});

/* -----------------------------
   User / Library / Reviews
----------------------------- */
watch(
  () => store.userId,
  async (uid) => {
    if (!uid) return;

    const [userRes, followRes] = await Promise.all([
      getUserInfo(uid),
      getFollowCount(uid),
    ]);

    user.value = userRes.data;
    followCount.value = followRes.data;

    const raw = (await getMyLibrary()).data ?? [];
    stats.value.reviewCount = raw.length;

    const map = {};
    raw.forEach((r) => {
      if (!map[r.contentId]) {
        map[r.contentId] = {
          id: r.contentId,
          title: r.contentName,
          author: r.contentAuthor,
          theme: getTheme(r.contentId),
          reviews: [],
        };
      }
      map[r.contentId].reviews.push(toReviewCardShape(r));
    });

    library.value = Object.values(map);
    stats.value.libraryCount = library.value.length;
    reviews.value = raw.map(toReviewCardShape);
  },
  { immediate: true }
);

/* -----------------------------
   Tabs / Navigation
----------------------------- */
const handleTabClick = (k) => {
  activeTab.value = k;
  if (k === "library") {
    viewMode.value = "library";
    selectedBook.value = null;
    bookReviews.value = [];
  }
};

const goToMyReviews = (book) => {
  selectedBook.value = book;
  viewMode.value = "bookReviews";
  bookReviews.value = book.reviews;
};

const backToLibrary = () => {
  viewMode.value = "library";
  selectedBook.value = null;
  bookReviews.value = [];
};

/* -----------------------------
   ✅ 좋아요 목록 (여기만 바뀜)
----------------------------- */
onMounted(async () => {
  const res = await getMyLikedReviews();

  console.log(res);
  likedReviews.value = (res.data.items ?? []).map(toReviewCardFromLiked);

  stats.value.likeCount = likedReviews.value.length;
});
</script>
