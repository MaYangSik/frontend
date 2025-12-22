<template>
  <div class="min-h-screen bg-[#F1F0EC]">
    <div class="mx-auto flex max-w-6xl gap-8 px-6 py-10">
      <!-- 왼쪽: 프로필 사이드바 -->
      <aside
        class="sticky top-10 ml-4 h-fit w-64 flex-shrink-0 rounded-2xl border border-[#EAE9E3] bg-white p-6 shadow-sm"
      >
        <div class="flex flex-col items-center text-center">
          <!-- 프로필 이미지 -->
          <div
            class="h-20 w-20 rounded-full overflow-hidden shadow-sm
                   flex items-center justify-center
                   bg-gradient-to-br from-[#D9D5CA] to-[#F0EEE9]"
          >
            <img
              v-if="user.profile_image_url"
              :src="`${S3_BASE_URL}/${user.profile_image_url}`"
              alt="profile"
              class="h-full w-full object-cover"
            />
            <span v-else class="text-white text-2xl font-bold">
              {{ user?.nickname?.charAt(0) || 'M' }}
            </span>
          </div>

          <h1 class="mt-3 text-lg font-semibold text-[#2E2A24]">
            {{ user.nickname }}
          </h1>
          <p class="text-xs text-gray-500">@{{ user.user_id }}</p>

          <p class="mt-3 text-sm text-[#5E594F] leading-snug">
            {{ user.bio }}
          </p>

          <!-- 팔로워 / 팔로잉 -->
          <div class="mt-4 flex gap-3 text-xs text-gray-600">
            <RouterLink
              :to="`/users/${store.userId}/followers`"
              class="hover:text-[#3C3832] hover:underline transition"
            >
              <strong>{{ followCount.followers }}</strong> 팔로워
            </RouterLink>
            <RouterLink
              :to="`/users/${store.userId}/followees`"
              class="hover:text-[#3C3832] hover:underline transition"
            >
              <strong>{{ followCount.followees }}</strong> 팔로잉
            </RouterLink>
          </div>

          <!-- 프로필 버튼 -->
          <div class="mt-6 flex w-full gap-2">
            <RouterLink
              :to="`/users/${store.userId}/edit`"
              class="flex-1 rounded-full border border-[#DCD8D1] bg-[#F8F7F3] px-4 py-1.5 text-xs text-[#4B463B] hover:bg-[#EAE9E3] transition font-medium shadow-sm"
            >
              프로필 수정
            </RouterLink>
            <RouterLink
              :to="`/users/${store.userId}/settings`"
              class="flex-1 rounded-full border border-[#DCD8D1] bg-[#F8F7F3] px-4 py-1.5 text-xs text-[#4B463B] hover:bg-[#EAE9E3] transition font-medium shadow-sm"
            >
              설정
            </RouterLink>
          </div>

          <!-- 활동 요약 -->
          <div class="mt-5 w-full rounded-xl bg-[#F8F7F3] px-4 py-3">
            <div class="flex justify-between text-xs text-[#6B675E]">
              <div class="flex flex-col items-center flex-1">
                <span class="text-sm font-semibold text-[#2E2A24]">
                  {{ stats.libraryCount }}
                </span>
                <span>내 서재</span>
              </div>
              <div class="flex flex-col items-center flex-1">
                <span class="text-sm font-semibold text-[#2E2A24]">
                  {{ stats.reviewCount }}
                </span>
                <span>리뷰</span>
              </div>
              <div class="flex flex-col items-center flex-1">
                <span class="text-sm font-semibold text-[#2E2A24]">
                  {{ stats.likeCount }}
                </span>
                <span>좋아요</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- 오른쪽: 콘텐츠 영역 -->
      <main class="flex-1 flex justify-center">
        <div class="w-full max-w-2xl">
          <!-- 상단 탭 -->
          <div class="mb-4 flex gap-6 border-b border-[#EAE9E3] text-sm">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              @click="handleTabClick(tab.key)"
              class="pb-2 transition"
              :class="
                activeTab === tab.key
                  ? 'border-b-2 border-[#2E2A24] font-semibold text-[#2E2A24]'
                  : 'text-[#7A766E] hover:text-[#2E2A24]'
              "
            >
              {{ tab.label }}
            </button>
          </div>

          <!-- 정렬 옵션 (나의 리뷰만) -->
          <div
            v-if="activeTab === 'reviews'"
            class="mb-3 flex justify-end gap-2 text-xs text-gray-600"
          >
            <button
              class="rounded-full border border-[#DDD9CF] px-3 py-1 hover:bg-[#EAE9E3] transition"
            >
              최신순
            </button>
            <button
              class="rounded-full border border-[#DDD9CF] px-3 py-1 hover:bg-[#EAE9E3] transition"
            >
              좋아요순
            </button>
          </div>

          <!-- 나의 리뷰 -->
          <div v-if="activeTab === 'reviews'" class="divide-y">
            <ReviewCard v-for="item in reviews" :key="item.id" :review="item" />

            <p
              v-if="!isLoading && !reviews.length"
              class="py-8 text-center text-sm text-gray-500"
            >
              표시할 리뷰가 없습니다.
            </p>

            <div ref="reviewSentinel" class="h-1"></div>

            <p
              v-if="isLoadingMore"
              class="py-4 text-center text-xs text-gray-400"
            >
              불러오는 중...
            </p>
          </div>

          <!-- 좋아요 -->
          <div v-else-if="activeTab === 'likes'" class="divide-y">
            <ReviewCard
              v-for="item in likedReviews"
              :key="item.id"
              :review="item"
            />

            <p
              v-if="!isLikeLoading && !likedReviews.length"
              class="py-8 text-center text-sm text-gray-500"
            >
              좋아요한 글이 없습니다.
            </p>

            <div ref="likeSentinel" class="h-1"></div>

            <p
              v-if="isLikeLoadingMore"
              class="py-4 text-center text-xs text-gray-400"
            >
              불러오는 중...
            </p>
          </div>

          <!-- 내 서재 (탭 내부에서만 viewMode로 분기) -->
          <div v-else-if="activeTab === 'library'">
            <!-- ✅ 서재 그리드 -->
            <div
              v-if="viewMode === 'library'"
              class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-14"
            >
              <div
                v-for="book in library"
                :key="book.id"
                class="flex flex-col items-center"
              >
                <!-- 책 오브젝트 (크기 완전 고정) -->
                <div
                  class="relative w-[140px] h-[200px]
                         bg-[#EAE9E3]
                         shadow-[0_12px_30px_rgba(0,0,0,0.18)]
                         transition-transform duration-200
                         hover:-translate-y-1"
                >
                  <img
                    :src="book.coverImage"
                    alt="book cover"
                    class="absolute inset-0 h-full w-full object-cover"
                  />
                </div>

                <!-- 책 정보 -->
                <div class="mt-4 w-[140px] text-center space-y-0.5">
                  <p
                    class="text-sm font-semibold text-[#2E2A24] leading-snug line-clamp-2"
                  >
                    {{ book.title }}
                  </p>
                  <p class="text-xs text-[#7A766E]">
                    {{ book.author }}
                  </p>

                  <button
                    class="mt-1 text-xs text-[#6B675E]
                           hover:text-[#2E2A24]
                           underline-offset-2 hover:underline transition"
                    @click="goToMyReviews(book)"
                  >
                    내 리뷰 보기 &gt;
                  </button>
                </div>
              </div>

              <!-- 비어있을 때 -->
              <p
                v-if="!library.length"
                class="col-span-full py-20 text-center text-sm text-gray-500"
              >
                아직 서재에 담긴 책이 없습니다.
              </p>
            </div>

            <!-- ✅ 책 단위 리뷰 상세 (같은 톤 유지) -->
            <div v-else class="space-y-6">
              <div class="flex items-center gap-4">
                <button
                  class="text-sm text-[#6B675E] hover:underline"
                  @click="backToLibrary"
                >
                  ← 내 서재
                </button>

                <p class="text-sm text-gray-400">
                  {{ selectedBook?.title }}
                </p>
              </div>

              <!-- ✅ 책 헤더: 휑함 해결(태그/리뷰개수/문장) -->
              <div class="flex gap-6 items-start">
                <img
                  :src="selectedBook?.coverImage"
                  class="w-28 h-40 object-cover shadow-sm"
                  alt="cover"
                />
                <div class="min-w-0 flex-1 space-y-3">
                  <div class="space-y-1">
                    <p class="text-lg font-semibold text-[#2E2A24] leading-snug">
                      {{ selectedBook?.title }}
                    </p>
                    <p class="text-sm text-[#7A766E]">
                      {{ selectedBook?.author }}
                    </p>
                  </div>

                  <!-- 태그 (없으면 기본 태그 표시) -->
                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="tag in selectedBookTags"
                      :key="tag"
                      class="rounded-full border border-[#E5E3DD]
                             bg-[#F8F7F3]
                             px-2.5 py-1 text-[11px]
                             text-[#5E594F]"
                    >
                      #{{ tag }}
                    </span>
                  </div>

                  <!-- 리뷰 개수 + 문장 -->
                  <div class="flex items-center gap-2">
                    <span
                      class="inline-flex items-center rounded-full
                             border border-[#DDD9CF]
                             bg-white px-2.5 py-1 text-[11px]
                             text-[#6B675E]"
                    >
                      내 리뷰 {{ bookReviews.length }}개
                    </span>
                    <p class="text-xs text-[#8A867D]">
                      이 책에 남긴 나의 기록을 모아봤어요.
                    </p>
                  </div>
                </div>
              </div>

              <div class="divide-y">
                <ReviewCard
                  v-for="r in bookReviews"
                  :key="r.id"
                  :review="r"
                />

                <p
                  v-if="!bookReviews.length"
                  class="py-10 text-center text-sm text-gray-500"
                >
                  이 책에 작성한 리뷰가 아직 없습니다.
                </p>
              </div>
            </div>
          </div>

          <!-- fallback -->
          <div v-else class="py-10 text-center text-sm text-gray-500">
            표시할 콘텐츠가 없습니다.
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { getFollowCount, getUserInfo } from '@/api/user'
import ReviewCard from '@/components/ReviewCard.vue'


const store = useUserStore()

const followCount = ref({ followers: 0, followees: 0 })

const stats = ref({
  libraryCount: 12,
  reviewCount: 34,
  likeCount: 128,
})

const tabs = [
  { key: 'library', label: '내 서재' },
  { key: 'reviews', label: '나의 리뷰' },
  { key: 'likes', label: '좋아요' },
]

const activeTab = ref('reviews')

/** ✅ 내 서재 내부 화면 전환 상태 */
const viewMode = ref('library') // 'library' | 'bookReviews'
const selectedBook = ref(null)
const bookReviews = ref([])

const likedReviews = ref([])

const isLoading = ref(false)
const isLoadingMore = ref(false)
const isLikeLoading = ref(false)
const isLikeLoadingMore = ref(false)

const reviewSentinel = ref(null)
const likeSentinel = ref(null)

const S3_BASE_URL =
  'https://mayangsik-uploaded-files.s3.ap-northeast-2.amazonaws.com'

const user = ref({
  user_id: '',
  nickname: '',
  bio: '',
  profile_image_url: '',
})

watch(
  () => store.userId,
  async (newUserId) => {
    if (!newUserId) return

    try {
      const followRes = await getFollowCount(newUserId)
      followCount.value = followRes.data

      const userRes = await getUserInfo(newUserId)
      user.value = userRes.data
    } catch (e) {
      console.error(e)
    }
  },
  { immediate: true }
)

/** ✅ 탭 클릭 시, 내 서재 상세 상태는 항상 초기화 */
const handleTabClick = (key) => {
  activeTab.value = key
  if (key === 'library') {
    viewMode.value = 'library'
    selectedBook.value = null
    bookReviews.value = []
  }
}

/** ✅ 책 상세 태그: 없으면 기본값 */
const selectedBookTags = computed(() => {
  const tags = selectedBook.value?.tags
  if (Array.isArray(tags) && tags.length) return tags
  // 기본 태그(디자인용) — 나중에 API 붙이면 여기 제거해도 됨
  return ['기록', '독서', '내서재']
})

/** 더미 리뷰 */
const reviews = [
  {
    id: 'r1',
    authorNickname: '책벌레민경',
    userId: 'mayangsik',
    contentTitle: '이방인',
    contentAuthor: '알베르 카뮈',
    categoryLabel: '도서',
    contentCategoryId: 1,
    title: '1권: 무감정이라는 오해',
    body:
      '뫼르소가 느끼는 감정의 결핍은 냉정함이 아니라,\n사회가 기대하는 감정 표현을 따르지 않았을 뿐이라는 생각이 들었다.',
    createdAtLabel: '2시간 전',
    spoiler: false,
    tags: ['기록', '감정', '독서'],
  },
  {
    id: 'r2',
    authorNickname: '하루한권',
    userId: 'onebookaday',
    contentTitle: '소년이 온다',
    contentAuthor: '한강',
    categoryLabel: '도서',
    contentCategoryId: 1,
    title: '5권: 침묵이 이어질 때',
    body:
      '이 장면은 감정을 드러내지 않지만,\n그 침묵 자체가 가장 큰 외침처럼 느껴졌다.',
    createdAtLabel: '어제',
    spoiler: false,
    tags: ['스포주의', '기록'],
  },
  {
    id: 'r3',
    authorNickname: '웹툰덕후',
    userId: 'toonlover',
    contentTitle: '나 혼자만 레벨업',
    categoryLabel: '웹툰',
    contentCategoryId: 2,
    title: '97화: 전투의 흐름이 바뀌는 순간',
    body:
      '이 화부터 주인공의 전투 방식이 완전히 달라진다.\n이전까지 쌓아온 빌드업이 한 번에 터지는 느낌.',
    createdAtLabel: '3일 전',
    isSpoiler: false,
    spoilerUntil: 97,
    tags: ['웹툰', '전투'],
  },
]

/** 더미 서재 */
const library = ref([
  {
    id: 1,
    title: '이방인',
    author: '알베르 카뮈',
    coverImage: 'https://image.yes24.com/goods/12345/L',
    tags: ['소설', '실존주의', '기록'], // ✅ 태그 추가(없어도 안전하게 처리됨)
  },
  {
    id: 2,
    title: '소년이 온다',
    author: '한강',
    coverImage: 'https://image.yes24.com/goods/67890/L',
    tags: ['소설', '한국문학', '기록'],
  },
  {
    id: 3,
    title: '사피엔스',
    author: '유발 하라리',
    coverImage: 'https://image.yes24.com/goods/24680/L',
    tags: ['인문', '사유', '기록'],
  },
])

/** ✅ 내 리뷰 보기: 같은 화면에서 책 리뷰 상세로 내려가기 */
const goToMyReviews = (book) => {
  selectedBook.value = book
  viewMode.value = 'bookReviews'
  bookReviews.value = reviews.filter((r) => r.contentTitle === book.title)
}

/** ✅ 뒤로가기: 서재 그리드 복귀 */
const backToLibrary = () => {
  viewMode.value = 'library'
  selectedBook.value = null
  bookReviews.value = []
}
</script>
