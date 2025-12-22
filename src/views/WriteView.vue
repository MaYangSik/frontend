<template>
  <div
    class="mx-auto max-w-5xl grid grid-cols-[1fr_1.5fr] gap-6 px-4 pt-10 pb-10 md:px-6"
  >
    <!-- 왼쪽: 도서 검색 -->
    <section class="relative rounded-2xl border bg-white p-5 shadow-sm md:p-6">
      <h2 class="mb-4 text-lg font-bold text-gray-900">도서 검색</h2>

      <div class="relative mb-4">
        <input
          v-model="searchQuery"
          @input="onInput"
          type="text"
          placeholder="책 제목을 입력하세요."
          class="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />

        <!-- 자동 완성 제안 리스트 -->
        <ul
          v-if="suggestions.length"
          class="absolute z-10 mt-1 w-full rounded-lg border bg-white text-sm shadow"
        >
          <li
            v-for="book in suggestions"
            :key="book.id"
            @click="selectBook(book)"
            class="cursor-pointer px-3 py-2 hover:bg-blue-50"
          >
            {{ book.title }} —
            <span class="text-gray-500">{{ book.author }}</span>
          </li>
        </ul>
      </div>

      <!-- 선택된 도서 상세 -->
      <div
        v-if="selectedBook"
        class="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-gray-700"
      >
        <div class="font-semibold text-gray-900">
          <p>{{ selectedBook.title }}</p>
          <p class="font-normal text-xs text-gray-500">
            {{ selectedBook.author }}
          </p>
        </div>
        <p class="mt-2">{{ selectedBook.description }}</p>
        <div class="mt-2 flex flex-wrap gap-1">
          <span
            v-for="tag in selectedBook.tags"
            :key="tag"
            class="rounded-full bg-white border px-2 py-0.5 text-xs text-gray-700"
          >
            #{{ tag }}
          </span>
        </div>

        <!-- 선택 취소 버튼 -->
        <div class="mt-4 text-right">
          <button
            @click="clearSelection"
            class="rounded-full border border-gray-400 px-3 py-1 text-xs text-gray-600 hover:bg-gray-100"
          >
            선택 취소
          </button>
        </div>
      </div>
    </section>

    <!-- 오른쪽: 리뷰 작성 -->
    <section class="rounded-2xl border bg-white p-5 shadow-sm md:p-6">
      <h2 class="mb-6 text-lg font-bold text-gray-900">리뷰 작성</h2>

      <div v-if="selectedBook" class="mb-6 text-sm text-gray-700">
        <strong>{{ selectedBook.title }}</strong>
        <span class="text-gray-500"> - {{ selectedBook.author }}</span>
      </div>

      <div v-else class="mb-6 text-sm text-gray-400 italic">
        도서를 선택해주세요.
      </div>

      <div class="space-y-5">
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-600"
            >리뷰 제목*</label
          >
          <input
            v-model="form.title"
            type="text"
            placeholder="리뷰 제목을 입력하세요."
            class="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-600"
            >리뷰 내용*</label
          >
          <textarea
            v-model="form.content"
            rows="6"
            placeholder="책에 대한 생각을 자유롭게 작성해보세요."
            class="w-full resize-none rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-600"
            >스포일러 범위 (최대 화/권)</label
          >
          <input
            v-model.number="form.spoilerUntil"
            type="number"
            min="0"
            placeholder="스포일러가 없는 경우 0을 입력하세요"
            class="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          <p class="mt-1 text-[11px] text-gray-500">
            스포일러가 없으면 0, 포함된다면 해당 리뷰가 다루는 마지막 화/권을
            입력하세요.
          </p>
        </div>

        <div>
          <label class="mb-2 block text-xs font-semibold text-gray-600"
            >리뷰 이미지 등록</label
          >
          <div class="flex items-center gap-3">
            <div
              v-if="imagePreview"
              class="relative h-24 w-24 overflow-hidden rounded-lg border bg-gray-50"
            >
              <img
                :src="imagePreview"
                alt="리뷰 이미지"
                class="h-full w-full object-cover"
              />
              <button
                @click="removeImage"
                class="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-700 text-[10px] text-white"
              >
                ✕
              </button>
            </div>
            <div
              v-else
              class="flex h-24 w-24 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400"
            >
              No Image
            </div>
            <div class="flex flex-col text-xs text-gray-500">
              <input type="file" @change="onImageUpload" accept="image/*" />
              <p class="mt-1">최대 10MB 이미지 파일을 업로드할 수 있습니다.</p>
            </div>
          </div>
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-600"
            >태그</label
          >
          <div class="flex flex-wrap gap-2">
            <input
              v-model="tagInput"
              @keyup.enter.prevent="addTag"
              placeholder="#태그 입력 후 엔터"
              class="rounded-full border px-3 py-1 text-xs focus:border-blue-500 focus:outline-none"
            />
            <div class="flex flex-wrap gap-1">
              <button
                v-for="tag in form.tags"
                :key="tag"
                class="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
                @click="removeTag(tag)"
              >
                #{{ tag }}
                <span class="text-gray-400">✕</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 text-right">
        <button
          @click="submitReview"
          class="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          리뷰 등록하기
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { searchContents } from "@/api/content";
import { createReview } from "@/api/review";
import { useRouter } from "vue-router";

const searchQuery = ref("");
const suggestions = ref([]);
const selectedBook = ref(null);
const imagePreview = ref(null);
const tagInput = ref("");
const router = useRouter();

const form = reactive({
  title: "",
  content: "",
  tags: [],
  image: null,
  contentId: null,
  spoilerUntil: 0,
});

let searchTimer = null;
const onInput = () => {
  const q = searchQuery.value.trim();
  if (!q) {
    suggestions.value = [];
    return;
  }
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => runContentSearch(q), 200);
};

const runContentSearch = async (keyword) => {
  try {
    const { data } = await searchContents({ keyword, page: 0, size: 5 });
    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.items)
      ? data.items
      : [];
    suggestions.value = list.map((c) => ({
      id: c.contentId,
      title: c.contentName,
      author: c.contentAuthor,
      categoryId: c.contentCategoryId,
      tags: Array.isArray(c.tags) ? c.tags : [],
      description: "",
    }));
  } catch (e) {
    console.error("콘텐츠 검색 실패", e);
    suggestions.value = [];
  }
};

// 도서 선택
const selectBook = (book) => {
  selectedBook.value = book;
  form.contentId = book.id;
  searchQuery.value = book.title;
  suggestions.value = [];
};

// 선택 취소
const clearSelection = () => {
  selectedBook.value = null;
  form.contentId = null;
};

// 이미지 업로드
const onImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    form.image = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};
const removeImage = () => {
  form.image = null;
  imagePreview.value = null;
};

// 태그
const addTag = () => {
  const value = tagInput.value.trim();
  if (value && !form.tags.includes(value)) {
    form.tags.push(value);
  }
  tagInput.value = "";
};
const removeTag = (tag) => {
  form.tags = form.tags.filter((t) => t !== tag);
};

// 리뷰 등록
const submitReview = async () => {
  if (!form.contentId) {
    alert("도서를 선택해주세요.");
    return;
  }
  if (!form.title || !form.content) {
    alert("리뷰 제목과 내용을 모두 입력해주세요.");
    return;
  }
  if (form.spoilerUntil == null) {
    alert("스포일러 범위를 입력해주세요. 스포 없으면 0을 입력하세요.");
    return;
  }

  const payload = {
    contentId: form.contentId,
    title: form.title,
    content: form.content,
    spoilerUntil: Number(form.spoilerUntil) || 0,
    tagIds: [], // TODO: 태그 ID 선택 로직이 생기면 교체
    imageUrls: [], // TODO: 이미지 업로드 API 연동 후 교체
  };

  try {
    const { data } = await createReview(payload);
    alert("리뷰가 등록되었습니다!");
    router.push({ name: "home" });
    return data;
  } catch (e) {
    console.error("리뷰 등록 실패", e);
    alert("리뷰 등록 중 오류가 발생했습니다.");
  }
};
</script>
