<template>
  <div class="mx-auto max-w-5xl px-4 py-8 md:px-6">
    <div class="grid gap-8 md:grid-cols-[minmax(0,1fr)_280px]">
      <!-- Left: main results -->
      <section class="min-w-0">
        <!-- Summary -->
        <header class="mb-6">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <h1 class="text-xl font-semibold text-gray-900">검색</h1>
              <p class="mt-1 text-sm text-gray-600">
                <span class="font-medium text-gray-900">'{{ query }}'</span>
                <span class="text-gray-300">·</span>
                결과 {{ totalCount }}개
                <span v-if="resultSize" class="text-gray-400"> (최대 {{ resultSize }}개)</span>
              </p>
            </div>

            <div class="flex items-center gap-2">
              <label class="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700">
                <span class="text-gray-500">표시</span>
                <select
                  class="bg-transparent text-sm outline-none"
                  :value="resultSize"
                  @change="onChangeSize"
                >
                  <option v-for="s in sizeOptions" :key="s" :value="s">{{ s }}</option>
                </select>
              </label>

              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                @click="isFilterOpen = true"
              >
                <span aria-hidden="true">⚙️</span>
                필터
              </button>
            </div>
          </div>

          <div v-if="appliedFilterChips.length" class="mt-4 flex flex-wrap gap-2">
            <button
              v-for="chip in appliedFilterChips"
              :key="chip.key"
              type="button"
              class="inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
              @click="chip.onRemove()"
            >
              <span>{{ chip.label }}</span>
              <span class="text-gray-400" aria-hidden="true">✕</span>
            </button>
          </div>

          <div v-if="anyError" class="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            검색 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
          </div>
        </header>

        <!-- Tabs -->
        <SearchTabs v-model="activeTab" :tabs="tabs" />

        <!-- Results -->
        <div class="mt-4">
          <div v-if="!query.trim()" class="rounded-2xl bg-gray-50 px-5 py-6">
            <p class="text-sm text-gray-700">검색어를 입력해 주세요.</p>
            <p class="mt-1 text-xs text-gray-500">
              기록 중심 탐색을 위해 제목·태그·닉네임을 먼저 추천합니다.
            </p>
          </div>

          <div v-else-if="activeList.length === 0" class="rounded-2xl bg-gray-50 px-5 py-6">
            <p class="text-sm text-gray-700">조건에 맞는 결과가 없습니다.</p>
            <p class="mt-1 text-xs text-gray-500">
              필터를 줄이거나, 다른 키워드로 다시 검색해 보세요.
            </p>
          </div>

          <div v-else class="divide-y divide-gray-100">
            <template v-if="activeTab === 'all'">
              <div v-if="filteredContents.length" class="py-2">
                <p class="px-1 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  컨텐츠
                </p>
                <div class="divide-y divide-gray-100">
                  <SearchContentCard v-for="c in filteredContents" :key="c.id" :item="c" />
                </div>
              </div>

              <div v-if="filteredReviews.length" class="py-2">
                <p class="px-1 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  리뷰/기록
                </p>
                <div class="divide-y divide-gray-100">
                  <ReviewCard v-for="r in filteredReviews" :key="r.id" :review="r" />
                </div>
              </div>

              <div v-if="filteredUsers.length" class="py-2">
                <p class="px-1 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  사용자
                </p>
                <div class="divide-y divide-gray-100">
                  <SearchUserCard
                    v-for="u in filteredUsers"
                    :key="u.userId"
                    :item="u"
                    :show-follow="true"
                    @toggle-follow="toggleFollow"
                  />
                </div>
              </div>
            </template>

            <template v-else-if="activeTab === 'contents'">
              <div class="divide-y divide-gray-100">
                <SearchContentCard v-for="c in filteredContents" :key="c.id" :item="c" />
              </div>
            </template>

            <template v-else-if="activeTab === 'reviews'">
              <div class="divide-y divide-gray-100">
                <ReviewCard v-for="r in filteredReviews" :key="r.id" :review="r" />
              </div>
            </template>

            <template v-else>
              <div class="divide-y divide-gray-100">
                <SearchUserCard
                  v-for="u in filteredUsers"
                  :key="u.userId"
                  :item="u"
                  :show-follow="true"
                  @toggle-follow="toggleFollow"
                />
              </div>
            </template>
          </div>
        </div>
      </section>

      <!-- Right rail -->
    <SearchRightRail
        :popular-keywords="popularKeywords"
        :recommended-contents="recommendedContents"
        :suggested-tags="suggestedTags"
        @select-keyword="selectKeyword"
        @select-content="selectContent"
        @select-tag="selectTag"
      />
    </div>

    <SearchFilterDrawer
      v-model="isFilterOpen"
      :filters="filters"
      :content-options="contentOptions"
      @reset="resetFilters"
      @apply="isFilterOpen = false"
    />
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useContentSearch } from '@/composables/useContentSearch'
import { useReviewSearch } from '@/composables/useReviewSearch'
import { useUserSearch } from '@/composables/useUserSearch'
import SearchTabs from '@/components/search/SearchTabs.vue'
import SearchFilterDrawer from '@/components/search/SearchFilterDrawer.vue'
import SearchRightRail from '@/components/search/SearchRightRail.vue'
import SearchContentCard from '@/components/search/SearchContentCard.vue'
import ReviewCard from '@/components/ReviewCard.vue'
import SearchUserCard from '@/components/search/SearchUserCard.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
userStore.loadUser()

const query = computed(() => String(route.query.q || ''))
const resultSize = computed(() => {
  const v = Number(route.query.size || 30)
  if (!Number.isFinite(v)) return 30
  return Math.min(Math.max(v, 5), 100)
})
const sizeOptions = [10, 20, 30, 50]

// URL query와 상태 연동(최소): tab
const allowedTabs = new Set(['all', 'contents', 'reviews', 'users'])
const activeTab = ref(allowedTabs.has(String(route.query.tab)) ? String(route.query.tab) : 'all')
watch(
  () => route.query.tab,
  (t) => {
    const next = String(t || 'all')
    activeTab.value = allowedTabs.has(next) ? next : 'all'
  }
)

watch(activeTab, (next) => {
  if (String(route.query.tab || 'all') === next) return
  router.replace({ query: { ...route.query, tab: next } })
})

const isFilterOpen = ref(false)

// -----------------------------
// API data (Elasticsearch + DB)
// -----------------------------
// TODO: 서버에서 page/size/정렬 등 확장 시, querystring과 payload 구성도 함께 확장하세요.
const { contents: rawContents, isLoading: isContentLoading, error: contentError, fetchContents } =
  useContentSearch()
const { reviews: rawReviews, isLoading: isReviewLoading, error: reviewError, fetchReviews } =
  useReviewSearch()
const { users: rawUsers, isLoading: isUserLoading, error: userError, fetchUsers } =
  useUserSearch()

const stripHtml = (s) => String(s || '').replace(/<[^>]*>/g, '')

const categoryKeyFromId = (contentCategoryId) => {
  const id = Number(contentCategoryId)
  if (id === 1) return 'book'
  if (id === 2) return 'webnovel'
  if (id === 3) return 'webtoon'
  return 'unknown'
}

const contentCategoryIdFromKey = (key) => {
  if (key === 'book') return 1
  if (key === 'webnovel') return 2
  if (key === 'webtoon') return 3
  return null
}

const categoryLabelFromKey = (key) => {
  if (key === 'book') return '도서'
  if (key === 'webnovel') return '웹소설'
  if (key === 'webtoon') return '웹툰'
  return ''
}

const filters = reactive({
  targets: { title: true, body: true, tag: true, nickname: true },
  categories: { book: true, webnovel: true, webtoon: true },
  myOnly: false,
  seenOnly: false,
  limitToMyProgress: false,
  onlySpoilerSafe: false,
  noSpoilerOnly: false,
  dateFrom: '',
  dateTo: '',
  contentId: '',
})

const defaultFilterValue = () => ({
  targets: { title: true, body: true, tag: true, nickname: true },
  categories: { book: true, webnovel: true, webtoon: true },
  myOnly: false,
  seenOnly: false,
  limitToMyProgress: false,
  onlySpoilerSafe: false,
  noSpoilerOnly: false,
  dateFrom: '',
  dateTo: '',
  contentId: '',
})

const resetFilters = () => {
  const next = defaultFilterValue()
  filters.targets.title = next.targets.title
  filters.targets.body = next.targets.body
  filters.targets.tag = next.targets.tag
  filters.targets.nickname = next.targets.nickname
  filters.categories.book = next.categories.book
  filters.categories.webnovel = next.categories.webnovel
  filters.categories.webtoon = next.categories.webtoon
  filters.myOnly = next.myOnly
  filters.seenOnly = next.seenOnly
  filters.limitToMyProgress = next.limitToMyProgress
  filters.onlySpoilerSafe = next.onlySpoilerSafe
  filters.noSpoilerOnly = next.noSpoilerOnly
  filters.dateFrom = next.dateFrom
  filters.dateTo = next.dateTo
  filters.contentId = next.contentId
}

// -----------------------------------
// URL sync (filters)
// -----------------------------------
const parseList = (v) => {
  if (typeof v !== 'string') return []
  return v
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

const parseBool = (v) => v === '1' || v === 'true'

let suppressUrlWrite = false
let urlWriteTimer = null

const applyFiltersFromQuery = (q) => {
  suppressUrlWrite = true

  const defaults = defaultFilterValue()

  const tgt = parseList(q.tgt)
  const cat = parseList(q.cat)

  const targetKeys = Object.keys(defaults.targets)
  const catKeys = Object.keys(defaults.categories)

  targetKeys.forEach((k) => {
    filters.targets[k] = tgt.length ? tgt.includes(k) : defaults.targets[k]
  })
  catKeys.forEach((k) => {
    filters.categories[k] = cat.length ? cat.includes(k) : defaults.categories[k]
  })

  filters.myOnly = q.my !== undefined ? parseBool(q.my) : defaults.myOnly
  filters.seenOnly = q.seen !== undefined ? parseBool(q.seen) : defaults.seenOnly
  filters.limitToMyProgress = q.limit !== undefined ? parseBool(q.limit) : defaults.limitToMyProgress
  filters.onlySpoilerSafe = q.safe !== undefined ? parseBool(q.safe) : defaults.onlySpoilerSafe
  filters.noSpoilerOnly = q.nospoiler !== undefined ? parseBool(q.nospoiler) : defaults.noSpoilerOnly

  filters.dateFrom = typeof q.from === 'string' ? q.from : defaults.dateFrom
  filters.dateTo = typeof q.to === 'string' ? q.to : defaults.dateTo
  filters.contentId = typeof q.cid === 'string' ? q.cid : defaults.contentId

  suppressUrlWrite = false
}

const encodeFiltersToQuery = () => {
  const defaults = defaultFilterValue()
  const out = {}

  const selectedTargets = Object.entries(filters.targets)
    .filter(([, v]) => v)
    .map(([k]) => k)
  const defaultTargets = Object.entries(defaults.targets)
    .filter(([, v]) => v)
    .map(([k]) => k)
  if (selectedTargets.length !== defaultTargets.length) out.tgt = selectedTargets.join(',')

  const selectedCats = Object.entries(filters.categories)
    .filter(([, v]) => v)
    .map(([k]) => k)
  const defaultCats = Object.entries(defaults.categories)
    .filter(([, v]) => v)
    .map(([k]) => k)
  if (selectedCats.length !== defaultCats.length) out.cat = selectedCats.join(',')

  if (filters.myOnly) out.my = '1'
  if (filters.seenOnly) out.seen = '1'
  if (filters.limitToMyProgress) out.limit = '1'
  if (filters.onlySpoilerSafe) out.safe = '1'
  if (filters.noSpoilerOnly) out.nospoiler = '1'

  if (filters.dateFrom) out.from = filters.dateFrom
  if (filters.dateTo) out.to = filters.dateTo
  if (filters.contentId) out.cid = String(filters.contentId)

  return out
}

watch(
  () => route.query,
  (q) => {
    applyFiltersFromQuery(q)
  },
  { deep: true, immediate: true }
)

watch(
  filters,
  () => {
    if (suppressUrlWrite) return
    if (urlWriteTimer) clearTimeout(urlWriteTimer)
    urlWriteTimer = setTimeout(() => {
      const filterKeys = ['tgt', 'cat', 'my', 'seen', 'limit', 'safe', 'nospoiler', 'from', 'to', 'cid']
      const base = { ...route.query }
      filterKeys.forEach((k) => delete base[k])

      const next = { ...base, ...encodeFiltersToQuery() }
      router.replace({ query: next })
    }, 200)
  },
  { deep: true }
)

const withinDateRange = (isoDate) => {
  if (!isoDate) return true
  const from = filters.dateFrom ? new Date(filters.dateFrom) : null
  const to = filters.dateTo ? new Date(filters.dateTo) : null
  const d = new Date(isoDate)
  if (from && d < from) return false
  if (to) {
    const end = new Date(to)
    end.setHours(23, 59, 59, 999)
    if (d > end) return false
  }
  return true
}

const makeDateLabel = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

const contentNameById = computed(() => {
  const map = new Map()
  ;(rawContents.value || []).forEach((c) => map.set(Number(c.contentId), c.contentName))
  return map
})

const contentCategoryByContentId = computed(() => {
  const map = new Map()
  ;(rawContents.value || []).forEach((c) => map.set(Number(c.contentId), categoryKeyFromId(c.contentCategoryId)))
  return map
})

const normalizedContents = computed(() => {
  const list = Array.isArray(rawContents.value) ? rawContents.value : []
  return list.map((c) => ({
    id: String(c.contentId),
    title: c.contentName,
    summary: '', // TODO: 콘텐츠 소개/줄거리 등 DB 필드가 있다면 여기에서 표시
    tags: Array.isArray(c.tags) ? c.tags : [],
    category: categoryKeyFromId(c.contentCategoryId),
    recordCount: Number(c.reviewCount || 0),
    lastRecordedAtLabel: '',
    spoilerProtected: false,
    spoilerSafeUntil: null,
    isMine: false,
    myProgress: c.myProgress != null ? { current: Number(c.myProgress), total: null } : null,
    mySpoilerSafeProgress: c.mySpoilerSafeProgress ?? null,
  }))
})

const normalizedReviews = computed(() => {
  const list = Array.isArray(rawReviews.value) ? rawReviews.value : []
  return list.map((r) => {
    const contentId = Number(r.contentId)
    const categoryId = r.contentCategoryId ?? null
    const category =
      categoryId != null ? categoryKeyFromId(categoryId) : contentCategoryByContentId.value.get(contentId) || 'unknown'
    const tags = Array.isArray(r.tags) ? r.tags.map((t) => t?.tagName).filter(Boolean) : []
    return {
      id: String(r.reviewId),
      title: r.title,
      body: r.content,
      tags,
      userId: r.userId,
      authorNickname: r.nickname || r.userId,
      createdAt: r.createdAt,
      createdAtLabel: makeDateLabel(r.createdAt),
      contentId: String(r.contentId),
      contentTitle: r.contentName || contentNameById.value.get(contentId) || `콘텐츠 #${contentId}`,
      category,
      categoryLabel: categoryLabelFromKey(category),
      isMine: Boolean(userStore.userId && r.userId === userStore.userId),
      myProgressAtWrite: null,
      spoilerProtected: Boolean(r.spoilerProtected),
      spoilerSafeUntil: r.spoilerSafeUntil ?? null,
      spoilerRiskAt: r.spoilerRiskAt ?? null,
      myProgress: r.myProgress ?? null,
      mySpoilerSafeProgress: r.mySpoilerSafeProgress ?? null,
      highlight: stripHtml(r.highlight),
    }
  })
})

const followingById = reactive({})
const normalizedUsers = computed(() => {
  const list = Array.isArray(rawUsers.value) ? rawUsers.value : []
  return list.map((u) => ({
    userId: u.userId,
    nickname: u.nickname || u.userId,
    bio: u.bio,
    avatarUrl: u.profileImageUrl,
    levelId: u.levelId,
    highlight: stripHtml(u.highlight),
    isFollowing: Boolean(followingById[u.userId]),
  }))
})

const contentOptions = computed(() =>
  normalizedContents.value.map((c) => ({
    id: c.id,
    title: c.title,
  }))
)

const keyword = computed(() => query.value.trim().toLowerCase())

const categoryAllowed = (category) => {
  if (!category || category === 'unknown') return true
  return Boolean(filters.categories[category])
}

const matchesByTargets = (fields) => {
  if (!keyword.value) return true
  const k = keyword.value
  const haystacks = []
  if (filters.targets.title && fields.title) haystacks.push(fields.title)
  if (filters.targets.title && fields.contentTitle) haystacks.push(fields.contentTitle)
  if (filters.targets.body && fields.body) haystacks.push(fields.body)
  if (filters.targets.tag && fields.tags?.length) haystacks.push(fields.tags.join(' '))
  if (filters.targets.nickname && fields.nickname) haystacks.push(fields.nickname)
  return haystacks.some((h) => String(h).toLowerCase().includes(k))
}

const filteredContents = computed(() => {
  return normalizedContents.value
    .filter((c) => categoryAllowed(c.category))
    .filter((c) => withinDateRange(c.lastRecordedAt))
    .filter((c) => {
      if (filters.seenOnly && !c.myProgress) return false
      if (filters.contentId && String(c.id) !== String(filters.contentId)) return false
      return true
    })
    .filter((c) =>
      matchesByTargets({
        title: c.title,
        body: c.summary,
        tags: c.tags,
      })
    )
})

const filteredReviews = computed(() => {
  return normalizedReviews.value
    .filter((r) => categoryAllowed(r.category))
    .filter((r) => withinDateRange(r.createdAt))
    .filter((r) => {
      if (filters.contentId && r.contentId !== filters.contentId) return false
      if (filters.myOnly && !r.isMine) return false
      if (filters.seenOnly && (r.myProgress == null || Number(r.myProgress) <= 0)) return false
      if (filters.noSpoilerOnly && r.spoilerProtected) return false
      if (filters.limitToMyProgress) {
        if (r.myProgress == null) return false
        if (r.spoilerProtected && r.spoilerRiskAt == null) return false
        if (r.spoilerRiskAt != null && Number(r.spoilerRiskAt) > Number(r.myProgress)) return false
      }
      if (filters.onlySpoilerSafe && r.spoilerProtected) {
        const safe = r.mySpoilerSafeProgress ?? r.myProgress
        if (safe == null) return false
        if (r.spoilerSafeUntil == null) return false
        if (Number(r.spoilerSafeUntil) > Number(safe)) return false
      }
      return true
    })
    .filter((r) =>
      matchesByTargets({
        title: r.title,
        body: r.spoilerProtected ? '' : r.body,
        tags: r.tags,
        nickname: r.authorNickname,
        contentTitle: r.contentTitle,
      })
    )
})

const filteredUsers = computed(() => {
  return normalizedUsers.value.filter((u) =>
    matchesByTargets({
      title: u.nickname,
      body: u.bio,
      tags: u.preferenceTags,
      nickname: u.nickname,
    })
  )
})

const tabs = computed(() => [
  { id: 'all', label: '전체', count: filteredContents.value.length + filteredReviews.value.length + filteredUsers.value.length },
  { id: 'contents', label: '컨텐츠', count: filteredContents.value.length },
  { id: 'reviews', label: '리뷰', count: filteredReviews.value.length },
  { id: 'users', label: '사용자', count: filteredUsers.value.length },
])

const totalCount = computed(() => tabs.value[0].count)

const activeList = computed(() => {
  if (activeTab.value === 'contents') return filteredContents.value
  if (activeTab.value === 'reviews') return filteredReviews.value
  if (activeTab.value === 'users') return filteredUsers.value
  return [
    ...filteredContents.value,
    ...filteredReviews.value,
    ...filteredUsers.value,
  ]
})

const appliedFilterChips = computed(() => {
  const chips = []

  const enabledTargets = Object.entries(filters.targets)
    .filter(([, v]) => v)
    .map(([k]) => k)
  if (enabledTargets.length && enabledTargets.length < 4) {
    const labelMap = { title: '제목', body: '본문', tag: '태그', nickname: '닉네임' }
    chips.push({
      key: 'targets',
      label: `대상: ${enabledTargets.map((t) => labelMap[t]).join(', ')}`,
      onRemove: () => {
        filters.targets.title = true
        filters.targets.body = true
        filters.targets.tag = true
        filters.targets.nickname = true
      },
    })
  }

  const enabledCats = Object.entries(filters.categories)
    .filter(([, v]) => v)
    .map(([k]) => k)
  if (enabledCats.length && enabledCats.length < 3) {
    const labelMap = { book: '도서', webnovel: '웹소설', webtoon: '웹툰' }
    chips.push({
      key: 'categories',
      label: `카테고리: ${enabledCats.map((c) => labelMap[c]).join(', ')}`,
      onRemove: () => {
        filters.categories.book = true
        filters.categories.webnovel = true
        filters.categories.webtoon = true
      },
    })
  }

  if (filters.myOnly) {
    chips.push({ key: 'myOnly', label: '내 기록만', onRemove: () => (filters.myOnly = false) })
  }
  if (filters.seenOnly) {
    chips.push({ key: 'seenOnly', label: '내가 본 컨텐츠만', onRemove: () => (filters.seenOnly = false) })
  }
  if (filters.limitToMyProgress) {
    chips.push({ key: 'limitToMyProgress', label: '내가 읽은 만큼만', onRemove: () => (filters.limitToMyProgress = false) })
  }
  if (filters.onlySpoilerSafe) {
    chips.push({ key: 'onlySpoilerSafe', label: '스포 안전', onRemove: () => (filters.onlySpoilerSafe = false) })
  }
  if (filters.noSpoilerOnly) {
    chips.push({ key: 'noSpoilerOnly', label: '스포 없는 리뷰만', onRemove: () => (filters.noSpoilerOnly = false) })
  }
  if (filters.dateFrom || filters.dateTo) {
    const label = `기간: ${filters.dateFrom || '…'} ~ ${filters.dateTo || '…'}`
    chips.push({
      key: 'date',
      label,
      onRemove: () => {
        filters.dateFrom = ''
        filters.dateTo = ''
      },
    })
  }
  if (filters.contentId) {
    const c = normalizedContents.value.find((x) => String(x.id) === String(filters.contentId))
    chips.push({
      key: 'contentId',
      label: `작품: ${c ? c.title : filters.contentId}`,
      onRemove: () => (filters.contentId = ''),
    })
  }
  return chips
})

const tagFrequency = computed(() => {
  const freq = new Map()
  ;[...normalizedContents.value, ...normalizedReviews.value].forEach((x) => {
    ;(x.tags || []).forEach((t) => freq.set(t, (freq.get(t) || 0) + 1))
  })
  return Array.from(freq.entries()).sort((a, b) => b[1] - a[1])
})

const popularKeywords = computed(() => tagFrequency.value.slice(0, 6).map(([t]) => t))

const recommendedContents = computed(() =>
  normalizedContents.value
    .slice()
    .sort((a, b) => Number(b.recordCount || 0) - Number(a.recordCount || 0))
    .slice(0, 4)
    .map((c) => ({
      id: c.id,
      title: c.title,
      recordCount: c.recordCount,
      categoryLabel: c.category === 'book' ? '도서' : c.category === 'webnovel' ? '웹소설' : c.category === 'webtoon' ? '웹툰' : '기타',
    }))
)

const suggestedTags = computed(() => popularKeywords.value.slice(0, 10))

const selectKeyword = (k) => router.push({ name: 'search', query: { ...route.query, q: k } })
const selectTag = (t) => router.push({ name: 'search', query: { ...route.query, q: t } })
const selectContent = (c) => {
  filters.contentId = c.id
  isFilterOpen.value = true
}

const toggleFollow = (userId) => {
  followingById[userId] = !followingById[userId]
  // TODO: 실제 팔로우 API 연동 (성공/실패에 따른 롤백 처리)
}

// -----------------------------------
// Fetch
// -----------------------------------
const runSearch = async () => {
  const q = query.value.trim()
  if (!q) return

  // TODO: backend paging/size 정책에 맞게 조정
  const size = resultSize.value
  const selectedCats = Object.entries(filters.categories)
    .filter(([, v]) => v)
    .map(([k]) => k)
  const singleCategoryId =
    selectedCats.length === 1 ? contentCategoryIdFromKey(selectedCats[0]) : null

  const myUserId = userStore.userId || undefined
  const contentId = filters.contentId ? Number(filters.contentId) : undefined

  await Promise.all([
    fetchContents({
      keyword: q,
      contentCategoryId: singleCategoryId ?? undefined,
      seenOnly: Boolean(filters.seenOnly),
      page: 0,
      size,
    }),
    fetchReviews({
      keyword: q,
      // NOTE: reviews index에 content_category_id가 없는 문서가 있을 수 있어(기존 데이터),
      // 서버 필터로 걸면 결과가 비는 문제가 생길 수 있습니다.
      // 카테고리 필터는 프론트단에서 우선 적용하고, ES 재색인 후 서버 필터를 켜는 것을 권장합니다.
      contentId,
      userId: filters.myOnly ? myUserId : undefined,
      seenOnly: Boolean(filters.seenOnly),
      limitToMyProgress: Boolean(filters.limitToMyProgress),
      onlySpoilerSafe: Boolean(filters.onlySpoilerSafe),
      noSpoilerOnly: Boolean(filters.noSpoilerOnly),
      page: 0,
      size,
      sort: 'latest',
    }),
    fetchUsers({ keyword: q, page: 0, size }),
  ])
}

let searchTimer = null
watch(
  () => [route.query.q, route.query.cat, route.query.cid, route.query.my, route.query.size],
  () => {
    if (searchTimer) clearTimeout(searchTimer)
    searchTimer = setTimeout(() => runSearch(), 200)
  },
  { immediate: true }
)

const anyError = computed(() => contentError.value || reviewError.value || userError.value)

const onChangeSize = (e) => {
  const next = Number(e.target.value)
  router.replace({ query: { ...route.query, size: String(next) } })
}
</script>
