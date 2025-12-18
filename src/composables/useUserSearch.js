import { ref } from "vue";
import { searchUsers } from "@/api/user";

export function useUserSearch(defaultParams = {}) {
  const users = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const fetchUsers = async (params = {}) => {
    isLoading.value = true;
    error.value = null;

    const payload = Object.entries({ ...defaultParams, ...params }).reduce(
      (acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );

    try {
      const { data } = await searchUsers(payload);
      users.value = Array.isArray(data) ? data : [];
    } catch (err) {
      console.error("🔍 사용자 검색 실패", err);
      error.value = err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    users,
    isLoading,
    error,
    fetchUsers,
  };
}
