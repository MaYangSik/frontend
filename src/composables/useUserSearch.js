import { ref } from "vue";
import { searchUsers } from "@/api/user";

export function useUserSearch(defaultParams = {}) {
  const users = ref([]);
  const total = ref(0);
  const isLoading = ref(false);
  const error = ref(null);

  const fetchUsers = async (params = {}) => {
    const append = params.append === true;
    const merged = { ...defaultParams, ...params };
    delete merged.append;

    if (!append) isLoading.value = true;
    error.value = null;

    const payload = Object.entries(merged).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        acc[key] = value;
      }
      return acc;
    }, {});

    try {
      const { data } = await searchUsers(payload);
      const list = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      const totalCount = typeof data?.total === "number" ? data.total : list.length;
      users.value = append ? users.value.concat(list) : list;
      total.value = append ? Math.max(total.value, totalCount) : totalCount;
      return list;
    } catch (err) {
      console.error("🔍 사용자 검색 실패", err);
      error.value = err;
      return [];
    } finally {
      if (!append) isLoading.value = false;
    }
  };

  return {
    users,
    total,
    isLoading,
    error,
    fetchUsers,
  };
}
