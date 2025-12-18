import api from "./axios";

/**
 * 콘텐츠 검색 (ES)
 * POST /search/contents
 * @param {Object} payload - ContentSearchRequest
 */
export const searchContents = (payload) => api.post("/search/contents", payload);
