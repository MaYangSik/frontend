import api from "./axios";

/**
 * 리뷰 검색 (ES)
 * POST /search/reviews
 * @param {Object} payload - ReviewSearchRequest
 */
export const searchReviews = (payload) => api.post("/search/reviews", payload);
