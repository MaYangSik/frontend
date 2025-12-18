<template>
  <div class="min-h-screen bg-[#F1F0EC]">
    <div class="mx-auto flex max-w-6xl gap-8 px-6 py-10">
      <!-- 왼쪽: 프로필 사이드바 -->
      <aside
        class="sticky top-10 h-fit w-64 flex-shrink-0 rounded-2xl border border-[#EAE9E3] bg-white p-6 shadow-sm"
      >
        <div class="flex flex-col items-center text-center">
          <!-- 프로필 이미지 -->
          <div
            class="h-20 w-20 rounded-full bg-gradient-to-br from-[#D9D5CA] to-[#F0EEE9] text-white text-2xl font-bold flex items-center justify-center shadow-sm"
          >
            {{ user.nickname.charAt(0) }}
          </div>

          <!-- 닉네임 / 아이디 -->
          <h1 class="mt-3 text-lg font-semibold text-[#2E2A24]">
            {{ user.nickname }}
          </h1>
          <p class="text-xs text-gray-500">@{{ user.user_id }}</p>

          <p class="mt-3 text-sm text-[#5E594F] leading-snug">
            {{ user.bio }}
          </p>

          <!-- 팔로잉 / 팔로워 -->
          <div class="mt-4 flex gap-3 text-xs text-gray-600">
            <RouterLink
              :to="`/users/${store.userId}/followers`"
              class="hover:text-[#3C3832] hover:underline transition"
            >
              <strong>{{ followCount.followers }}</strong> 팔로워
            </RouterLink>

            <RouterLink
              :to="`/users/${store.userId}/followees`"
              class="hover:text-[#3C3832] hover:underline transition"
            >
              <strong>{{ followCount.followees }}</strong> 팔로잉
            </RouterLink>
          </div>

          <!-- 수정 버튼 -->
          <div class="mt-6 flex w-full justify-center gap-2">
            <RouterLink
              :to="`/users/${store.userId}/edit`"
              class="flex-1 rounded-full border border-[#DCD8D1] bg-[#F8F7F3] px-4 py-1.5 text-xs text-[#4B463B] hover:bg-[#EAE9E3] transition font-medium shadow-sm"
            >
              프로필 수정
            </RouterLink>

            <RouterLink
              :to="`/users/${store.userId}/settings`"
              class="flex-1 rounded-full border border-[#DCD8D1] bg-[#F8F7F3] px-4 py-1.5 text-xs text-[#4B463B] hover:bg-[#EAE9E3] transition font-medium shadow-sm"
            >
              설정
            </RouterLink>
          </div>

          <hr class="my-6 w-full border-[#EAE9E3]" />

          <div class="w-full text-left text-sm space-y-2">
            <button class="w-full text-[#3A3731] font-medium">
              📚 내 리뷰
            </button>
            <button
              class="w-full text-[#6B675E] hover:text-[#2F2C27] transition"
            >
              💖 좋아요한 글
            </button>
            <button
              class="w-full text-[#6B675E] hover:text-[#2F2C27] transition"
            >
              📖 내 서재
            </button>
          </div>
        </div>
      </aside>

      <!-- 오른쪽: 리뷰 피드 -->
      <main class="flex-1 flex justify-center">
        <div class="w-full max-w-2xl space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-[#2E2A24]">📚 나의 리뷰</h2>
            <div class="flex gap-2 text-xs text-gray-600">
              <button
                class="rounded-full border border-[#DDD9CF] px-3 py-1 hover:bg-[#EAE9E3] transition"
              >
                최신순
              </button>
              <button
                class="rounded-full border border-[#DDD9CF] px-3 py-1 hover:bg-[#EAE9E3] transition"
              >
                좋아요순
              </button>
            </div>
          </div>

          <!-- 리뷰 리스트 -->
          <section>
            <div
              v-for="item in reviews"
              :key="item.id"
              class="rounded-xl border border-[#EAE9E3] bg-white p-5 shadow-sm hover:shadow-md transition-all"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-base font-semibold text-[#2E2A24]">
                    {{ item.book.title }}
                  </h3>
                  <p class="text-xs text-gray-500">{{ item.book.author }}</p>
                </div>
                <span
                  class="rounded-full bg-[#F0EEE9] px-3 py-0.5 text-[11px] text-[#4B463B] border border-[#EAE9E3]"
                >
                  {{ item.progress }}p
                </span>
              </div>

              <p class="mt-3 text-[13px] text-[#4B463B] leading-relaxed">
                {{ item.content }}
              </p>

              <div class="mt-3 flex flex-wrap gap-1.5">
                <span
                  v-for="tag in item.tags"
                  :key="tag"
                  class="rounded-full bg-[#F7F6F3] px-2.5 py-0.5 text-[11px] text-[#5A564C] border border-[#EAE9E3]"
                >
                  #{{ tag }}
                </span>
              </div>

              <div class="mt-3 flex justify-between text-[11px] text-gray-500">
                <div class="flex gap-4">
                  <span>❤️ {{ item.likes }}</span>
                  <span>💬 {{ item.comments }}</span>
                  <span>🔁 {{ item.shares }}</span>
                </div>
                <span>{{ item.time }}</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useUserStore } from "@/stores/user";
import { getFollowCount, getUserInfo } from "@/api/user";

const store = useUserStore();
const followCount = ref({ followers: 0, followees: 0 });

const user = ref({
  userId: "",
  nickname: "",
  bio: "",
  profile_image_url: "",
});

// ✅ store.userId를 직접 감시
watch(
  () => store.userId,
  async (newUserId) => {
    if (!newUserId) {
      console.log("⚠️ userId 없음");
      return;
    }

    console.log("✅ 감지된 userId:", newUserId);
    try {
      const followRes = await getFollowCount(newUserId);
      followCount.value = followRes.data;

      console.log("✅ followCount 불러오기 성공:", followRes.data);

      const userRes = await getUserInfo(newUserId);
      user.value = userRes.data;

      console.log("✅ user data 불러오기 성공:", userRes.data);
    } catch (err) {
      console.error("❌ 팔로우 수 불러오기 실패:", err);
    }
  },
  { immediate: true }
);

// 더미 리뷰
const reviews = [
  {
    id: "r1",
    title: "5권: 관계가 어긋나는 순간",
    body: "스포 없이 감정만 남겼습니다. 대화 톤이 급격히 변하면서 캐릭터가 보이는 단면이 인상적.",
    authorNickname: "김독서",
    authorId: "bookworm",
    createdAtLabel: "2시간 전",
    contentTitle: "이방인",
    categoryLabel: "도서",
    myProgress: 5,
    spoilerProtected: true,
    tags: ["감정", "기록"],
  },
  {
    id: "r2",
    title: "리뷰 제목",
    body: "리뷰 내용입니다. 강낭콩밥을 먹을래요. 계란후라이가 최고입니다.",
    authorNickname: "닉네임",
    authorId: "bookworm",
    createdAtLabel: "2시간 전",
    contentTitle: "이방인",
    categoryLabel: "도서",
    myProgress: 5,
    spoilerProtected: true,
    tags: ["감정", "기록"],
  },
];
</script>
