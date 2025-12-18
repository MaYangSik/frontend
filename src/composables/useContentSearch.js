import { ref } from "vue";
import { searchContents } from "@/api/content";

export function useContentSearch(defaultParams = {}) {
  const contents = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const fetchContents = async (params = {}) => {
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
      const { data } = await searchContents(payload);
      contents.value = Array.isArray(data) ? data : [];
    } catch (err) {
      console.error("🔍 콘텐츠 검색 실패", err);
      error.value = err;
    } finally {
      isLoading.value = false;
    }
  };

  return { contents, isLoading, error, fetchContents };
}
