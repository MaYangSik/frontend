<template>
  <div>
    <!-- ✅ 비밀번호 및 보안 -->
    <div v-if="selectedMenu === 'security'">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">비밀번호 및 보안</h2>
      <p class="text-sm text-gray-600 mb-4">
        비밀번호 변경 및 보안 설정을 관리하세요.
      </p>

     
      <div class="mt-5 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">현재 비밀번호</label>
          <input
            type="password"
            v-model="form.currentPassword"
            placeholder="현재 비밀번호를 입력하세요"
            class="w-full rounded-lg border border-[#DAD8D2] bg-[#F8F7F4] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#B3B1AB]"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">새 비밀번호</label>
          <input
            type="password"
            v-model="form.newPassword"
            placeholder="새 비밀번호를 입력하세요"
            class="w-full rounded-lg border border-[#DAD8D2] bg-[#F8F7F4] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#B3B1AB]"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
          <input
            type="password"
            v-model="form.confirmPassword"
            placeholder="새 비밀번호를 다시 입력하세요"
            class="w-full rounded-lg border border-[#DAD8D2] bg-[#F8F7F4] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#B3B1AB]"
          />
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button
            @click="cancelPasswordChange"
            class="rounded-full border border-[#DDD9CF] bg-white px-4 py-2 text-sm text-gray-700 hover:bg-[#F5F4F0] transition"
          >
            취소
          </button>
          <button
            @click="submitPasswordChange"
            class="rounded-full border border-[#D3CBC4] bg-[#E8E2DC] px-4 py-2 text-sm font-semibold text-[#533333] hover:bg-[#E1D8D0] transition"
          >
            변경하기
          </button>
        </div>
      </div>
    </div>

    <!-- ✅ 개인정보 수정 -->
    <div v-else-if="selectedMenu === 'personal'">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">개인정보 수정</h2>
      <p class="text-sm text-gray-600 mb-3">이메일, 연락처 등 기본 정보를 수정하세요.</p>
      <form class="space-y-3">
        <div>
          <label class="text-sm text-gray-700">이메일</label>
          <input
            type="email"
            class="w-full mt-1 border border-[#DDD9CF] rounded-md px-3 py-2 text-sm bg-[#F8F7F4] focus:ring-1 focus:ring-[#B3B1AB]"
            placeholder="you@example.com"
          />
        </div>
      
      </form>
    </div>

    <!-- ✅ 내 정보 및 권한 -->
    <div v-else-if="selectedMenu === 'permissions'">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">내 정보 및 권한</h2>
      <p class="text-sm text-gray-600">계정 권한, 활동 내역 및 접근 권한 관리.</p>
    </div>

    <!-- ✅ 결제 관리 -->
    <div v-else-if="selectedMenu === 'billing'">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">결제 및 구독 관리</h2>
      <p class="text-sm text-gray-600">결제 내역 확인 및 구독 상태를 관리하세요.</p>
    </div>

      <div v-if="selectedMenu === 'withdraw'" class="space-y-4">
      <h2 class="text-lg font-semibold text-[#1f2937]">회원 탈퇴</h2>
      <p class="text-sm text-gray-600 leading-relaxed">
        탈퇴 시, 계정 정보와 활동 내역이 모두 삭제되며 복구가 불가능합니다.<br />
        탈퇴 전 결제 및 구독 상태를 반드시 확인해주세요.
      </p>

      <button
        @click="confirmWithdraw"
        class="mt-4 rounded-full border border-[#D9D1CA] bg-[#FBEAEA] px-4 py-2 text-sm font-semibold text-[#b91c1c] hover:bg-[#F9DADA] transition"
      >
        회원 탈퇴하기
      </button>
    </div>


    <!-- ✅ 차단한 계정 관리 -->
<div v-else-if="selectedMenu === 'block'">
  <h2 class="text-lg font-semibold text-gray-800 mb-4">차단한 계정 관리</h2>
  <p class="text-sm text-gray-600 mb-5">
    차단된 사용자는 내 프로필과 게시글을 볼 수 없습니다. 필요 시 차단을 해제할 수 있습니다.
  </p>

  <!-- 차단된 유저 리스트 -->
  <div v-if="blockedUsers.length" class="space-y-3">
    <div
      v-for="user in blockedUsers"
      :key="user.userId"
      class="flex items-center justify-between rounded-xl border border-[#E4E1DA] bg-white px-4 py-3 shadow-sm hover:shadow-md transition"
    >
      <div class="flex items-center gap-3">
        <div
          class="h-10 w-10 rounded-full overflow-hidden border border-[#E4E1DA] bg-[#F3F1EC] flex items-center justify-center text-xs text-gray-400"
        >
          <img
            v-if="user.image"
            :src="user.image"
            alt="profile"
            class="h-full w-full object-cover"
          />
          <span v-else>{{ user.nickname?.charAt(0) || '유' }}</span>
        </div>

        <div>
          <p class="text-sm font-semibold text-[#1f2937]">
            {{ user.nickname }}
          </p>
          <p class="text-xs text-gray-500">@{{ user.userId }}</p>
        </div>
      </div>

      <button
        @click="handleUnblock(user.userId)"
        class="rounded-full border border-[#D9D1CA] bg-[#F8F6F2] px-3 py-1 text-xs text-[#7a3b3b] hover:bg-[#EDEAE6] transition"
      >
        차단 해제
      </button>
    </div>
  </div>

  <!-- 차단된 유저가 없을 때 -->
  <div v-else class="text-center text-gray-500 mt-10">
    현재 차단한 사용자가 없습니다.
  </div>
</div>



  </div>
</template>

<script setup>
import { ref , onMounted } from 'vue'
import {passwordChange, getBlockUsers, withdraw, blockUser, unblockUser} from '@/api/user'

defineProps({
  selectedMenu: String,
})

const showPasswordForm = ref(false)

const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const cancelPasswordChange = () => {
  showPasswordForm.value = false
  form.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
}

const submitPasswordChange = async () => {
  if (!form.value.currentPassword || !form.value.newPassword || !form.value.confirmPassword) {
    alert('모든 칸을 입력해주세요.')
    return
  }

  if (form.value.newPassword !== form.value.confirmPassword) {
    alert('새 비밀번호가 일치하지 않습니다.')
    return
  }

  console.log('비밀번호 변경 요청:', form.value)
  try{
    const data = {
        prevPass: form.value.currentPassword,
        newPass: form.value.newPassword
    }

    await passwordChange(data)
    alert('비밀번호가 성공적으로 변경되었습니다.')
    cancelPasswordChange()
  }catch(err){
    console.log(err)
  }

}

const blockedUsers = ref([])
const fetchBlockedUsers = async () => {
  try {
    const res = await getBlockUsers()
    blockedUsers.value = res.data
  } catch (err) {
    console.error('차단 목록 불러오기 실패:', err)
  }
}

const confirmWithdraw = async () => {
  try {
    const res = await withdraw()
    alert('탈퇴가 완료되었습니다ㅏ.')
  } catch (err) {
    console.error('탈퇴하기 실패:', err)
  }
}

// const blockUser = async (userId) => {
//     try{
//         await blockUser()
//     }catch(err){

//     }
// }

const handleUnblock = async (userId) => {
  if (!confirm('이 사용자의 차단을 해제하시겠습니까?')) return
  try {
    await unblockUser(userId)
    blockedUsers.value = blockedUsers.value.filter((u) => u.userId !== userId)
    alert('차단이 해제되었습니다.')
  } catch (err) {
    console.error('차단 해제 실패:', err)
    alert('차단 해제 중 오류가 발생했습니다.')
  }
}

onMounted(() => {
  fetchBlockedUsers()
})

</script>
