import api from "./axios";

// 홈 피드 조회: type = 'recommend' | 'following'
export const fetchHomeFeed = (params = {}) =>
  api.get("/home/feed", { params });
