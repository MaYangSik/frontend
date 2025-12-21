import { ref } from 'vue'
import { searchReviews } from '@/api/review'

export function useReviewSearch(defaultParams = {}) {
  const reviews = ref([])
  const total = ref(0)
  const isLoading = ref(false)
  const error = ref(null)

  const fetchReviews = async (params = {}) => {
    const append = params.append === true
    const merged = { ...defaultParams, ...params }
    delete merged.append

    if (!append) isLoading.value = true
    error.value = null

    // 빈 값은 쿼리로 보내지 않도록 필터링
    const payload = Object.entries(merged).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value
      }
      return acc
    }, {})

    try {
      const { data } = await searchReviews(payload)
      const list = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : []
      const totalCount = typeof data?.total === 'number' ? data.total : list.length
      reviews.value = append ? reviews.value.concat(list) : list
      total.value = append ? Math.max(total.value, totalCount) : totalCount
      return list
    } catch (err) {
      console.error('🔍 리뷰 검색 실패', err)
      error.value = err
      return []
    } finally {
      if (!append) isLoading.value = false
    }
  }

  return {
    reviews,
    total,
    isLoading,
    error,
    fetchReviews,
  }
}
