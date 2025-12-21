import api from "./axios";

/**
 * 리뷰 검색 (ES)
 * POST /search/reviews
 * @param {Object} payload - ReviewSearchRequest
 */
export const searchReviews = (payload) => api.post("/search/reviews", payload);

// 페이지네이션 응답이 { items, total } 형태로 들어오므로 헬퍼 추가
export const searchReviewsPaged = (payload) => api.post("/search/reviews", payload);

// 특정 사용자 리뷰 목록 (최근 리뷰 조회용)
export const getReviewsByUser = (userId, params = {}) =>
  api.get(`/reviews/user/${userId}`, { params });

// 리뷰 생성
export const createReview = (payload) => api.post("/reviews", payload);

// 리뷰 단건 조회
export const getReview = (reviewId) => api.get(`/reviews/${reviewId}`);
