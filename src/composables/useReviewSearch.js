import { ref } from 'vue'
import { searchReviews } from '@/api/review'

export function useReviewSearch(defaultParams = {}) {
  const reviews = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const fetchReviews = async (params = {}) => {
    isLoading.value = true
    error.value = null

    // 빈 값은 쿼리로 보내지 않도록 필터링
    const payload = Object.entries({ ...defaultParams, ...params }).reduce(
      (acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = value
        }
        return acc
      },
      {}
    )

    try {
      const { data } = await searchReviews(payload)
      reviews.value = Array.isArray(data) ? data : []
    } catch (err) {
      console.error('🔍 리뷰 검색 실패', err)
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  return {
    reviews,
    isLoading,
    error,
    fetchReviews,
  }
}
