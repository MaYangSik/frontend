import { ref } from "vue";
import { searchContents } from "@/api/content";

export function useContentSearch(defaultParams = {}) {
  const contents = ref([]);
  const total = ref(0);
  const isLoading = ref(false);
  const error = ref(null);

  const fetchContents = async (params = {}) => {
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
      const { data } = await searchContents(payload);
      const list = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      const totalCount = typeof data?.total === "number" ? data.total : list.length;
      contents.value = append ? contents.value.concat(list) : list;
      total.value = append ? Math.max(total.value, totalCount) : totalCount;
      return list;
    } catch (err) {
      console.error("🔍 콘텐츠 검색 실패", err);
      error.value = err;
      return [];
    } finally {
      if (!append) isLoading.value = false;
    }
  };

  return { contents, total, isLoading, error, fetchContents };
}
