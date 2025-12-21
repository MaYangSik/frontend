import api from "./axios";

//회원
export const login = (data) => api.post("/login", data); // 로그인

export const logout = (refreshToken) =>
  api.post(
    "/auth/logout",
    {},
    {
      headers: {
        "Refresh-Token": refreshToken,
      },
    }
  ); // 로그아웃

// 사용자 검색 (ES)
export const searchUsers = (payload) => api.post("/search/users", payload);

export const searchUsersPaged = (payload) => api.post("/search/users", payload);

export const signup = (data) => api.post("/users", data); // 회원가입

export const withdraw = () => api.delete("/users");

export const passwordChange = (data) => api.patch("/users/password", data); //비밀번호 변경

export const getUserInfo = (userId) => api.get(`/users/${userId}`);

export const updateUserProfile = (userId, data) =>
  api.patch(`/users/${userId}`, data);

//팔로잉
export const getFollowCount = (userId) => api.get(`/follows/${userId}/count`);
export const followUser = (targetUserId) =>
  api.post(`/follows/${targetUserId}`);
export const unfollowUser = (targetUserId) =>
  api.delete(`/follows/${targetUserId}`);
export const getFollowers = (userId) => api.get(`/follows/${userId}/followers`);
export const getFollowees = (userId) => api.get(`/follows/${userId}/followees`);

//차단
export const blockUser = (payload) => {
  api.post(`/blocks`, payload);
};

export const unblockUser = (blockedId) => {
  api.delete(`/blocks/${blockedId}`);
};

export const getBlockUsers = () => api.get(`/blocks`);
