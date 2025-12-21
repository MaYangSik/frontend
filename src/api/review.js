import api from "./axios";

/**
 * 리뷰 검색 (ES)
 * POST /search/reviews
 * @param {Object} payload - ReviewSearchRequest
 */
export const searchReviews = (payload) => api.post("/search/reviews", payload);

// 페이지네이션 응답이 { items, total } 형태로 들어오므로 헬퍼 추가
export const searchReviewsPaged = (payload) => api.post("/search/reviews", payload);
