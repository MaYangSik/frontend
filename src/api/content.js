import api from "./axios";

/**
 * 콘텐츠 검색 (ES)
 * POST /search/contents
 * @param {Object} payload - ContentSearchRequest
 */
export const searchContents = (payload) => api.post("/search/contents", payload);

/**
 * 콘텐츠 검색 (GET) - 페이지네이션 대응 (선택적으로 사용)
 * @deprecated 백엔드는 POST만 제공하면 위 함수를 사용
 */
export const searchContentsPaged = (params) =>
  api.get("/search/contents", { params });
