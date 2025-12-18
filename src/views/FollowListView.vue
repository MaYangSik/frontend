<template>
  <div class="min-h-screen bg-[#F1F0EC] py-10">
    <div class="mx-auto max-w-2xl px-4">
      <h1 class="text-2xl font-bold text-[#1f2937] mb-6 text-center">
        {{ pageTitle }}
      </h1>

      <!-- 리스트 -->
      <div v-if="Array.isArray(users) && users.length > 0" class="space-y-4">
        <div
          v-for="u in users"
          :key="u.userId"
          class="flex items-center justify-between rounded-xl border border-[#E4E1DA] bg-white p-4 shadow-sm hover:shadow-md transition"
        >
          <div class="flex items-center gap-4">
            <div class="h-11 w-11 rounded-full overflow-hidden border border-[#E4E1DA] bg-[#F3F1EC]">
              <img
                v-if="u.image"
                :src="u.image"
                alt="profile"
                class="h-full w-full object-cover"
              />
              <div
                v-else
                class="flex h-full w-full items-center justify-center text-[11px] text-gray-400"
              >
                {{ u.nickname?.charAt(0) || '유' }}
              </div>
            </div>
            <div>
              <p class="text-sm font-semibold text-[#1f2937]">{{ u.nickname }}</p>
              <p class="text-xs text-gray-500">@{{ u.userId }}</p>
            </div>
          </div>

          <div 
           class="flex gap-2">
            <!-- 언팔로우 (팔로잉 목록일 때만) -->
             <div
             v-if="metaType === 'followees'">

  <button
              v-if=" u.isFollowing"
              @click="handleUnfollow(u)"
              class="rounded-full border border-[#DDD9D2] bg-[#F8F6F2] px-3 py-1 text-xs text-[#4b5563] hover:bg-[#F1EFEB] transition"
            >
              언팔로우
            </button>

            <button
            v-else
            @click="handleFollow(u)"
            class="rounded-full border border-[#C9C4BC] bg-[#EFECE6] px-3 py-1 text-xs text-[#1f2937] hover:bg-[#E6E2DB] transition"
            >
            팔로우
            </button>


             </div>
             <!-- 차단 -->
            <button
              @click="openBlockDialog(u.userId)"
              class="rounded-full border border-[#D9D1CA] bg-[#F3ECE7] px-3 py-1 text-xs text-[#7a3b3b] hover:bg-[#EADFD7] transition"
            >
              차단
            </button>
          </div>
        </div>
      </div>

      <!-- 빈 리스트 -->
      <div v-else class="text-center text-gray-500 mt-10">
        {{ metaType === 'followers'
          ? '아직 팔로워가 없습니다.'
          : '아직 팔로잉한 유저가 없습니다.' }}
      </div>
    </div>

    <!-- 차단 다이얼로그 -->
    <div
      v-if="showDialog"
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <!-- 배경 -->
      <div
        class="absolute inset-0 bg-black/30 backdrop-blur-sm"
        @click="closeDialog"
      ></div>

      <div
        class="relative w-[360px] rounded-2xl bg-[#FBFAF8] p-6 shadow-2xl border border-[#E4E1DA]"
      >
        <h2 class="text-lg font-semibold text-[#111827] mb-3">사용자 차단</h2>

        <p class="text-sm text-gray-600 mb-3">
          정말로 이 사용자를 차단하시겠습니까?<br />
          차단 사유를 적어두면 나중에 관리하기 더 쉬워요.
        </p>

        <textarea
          v-model="blockReason"
          rows="3"
          placeholder="차단 사유를 입력해주세요. (선택 사항)"
          class="w-full resize-none rounded-xl border border-[#E2DED7] bg-[#F6F4F0] px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D9D4CB] transition"
        ></textarea>

        <div class="mt-5 flex justify-end gap-3">
          <button
            @click="closeDialog"
            class="rounded-full border border-[#DDD9D2] bg-white px-4 py-2 text-sm text-gray-700 hover:bg-[#F5F4F0] transition"
          >
            취소
          </button>
          <button
            @click="confirmBlock"
            class="rounded-full border border-[#D3CBC4] bg-[#E8E2DC] px-4 py-2 text-sm font-semibold text-[#533333] hover:bg-[#E1D8D0] transition"
          >
            차단하기
          </button>
        </div>

        <button
          @click="closeDialog"
          class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-sm"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getFollowers, getFollowees, followUser, unfollowUser, blockUser } from '@/api/user'

const route = useRoute()
const metaType = route.meta.type
const pageTitle = route.meta.title || (metaType === 'followers' ? '팔로워 목록' : '팔로잉 목록')

const users = ref([]) // 배열 보장

const showDialog = ref(false)
const selectedUserId = ref(null)
const blockReason = ref('')

const openBlockDialog = (userId) => {
  selectedUserId.value = userId
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
  blockReason.value = ''
  selectedUserId.value = null
}

const confirmBlock = async () => {
  try {
    console.log(selectedUserId.value, blockReason.value)
    await blockUser({
      blocked_id: selectedUserId.value,
      reason: blockReason.value,
    })
    users.value = users.value.filter((u) => u.userId !== selectedUserId.value)
    alert('차단이 완료되었습니다.')
  } catch (e) {
    console.error(e)
    alert('차단 중 오류가 발생했습니다.')
  } finally {
    closeDialog()
  }
}

onMounted(async () => {
  try {
    const res =
      metaType === 'followers'
        ? await getFollowers(route.params.userId)
        : await getFollowees(route.params.userId)

     if (Array.isArray(res.data)) {
      users.value = res.data.map(u => ({
        ...u,
        isFollowing: metaType === 'followees' // 팔로잉 목록이면 true
      }))
    } else {
      users.value = []
    }

    console.log("users : ", users.value)
  } catch (e) {
    console.error(e)
    users.value = []
  }
})

const handleFollow = async (user) => {
  try {
    await followUser(user.userId)
    user.isFollowing = true
    console.log(user.userId +" 팔로우 성공")
    // users.value = users.value.filter((u) => u.userId !== targetId)
  } catch (e) {
    console.error(e)
  }
}

const handleUnfollow = async (user) => {
  try {
    await unfollowUser(user.userId)
    user.isFollowing = false
    console.log(user.userId +" 언팔로우 성공")
    // users.value = users.value.filter((u) => u.userId !== targetId)
  } catch (e) {
    console.error(e)
  }
}
</script>
