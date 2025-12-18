<template>
  <div class="min-h-screen bg-[#EFEEE9] text-gray-800 py-12">
    <div class="mx-auto max-w-2xl bg-[#FAF9F7] border border-[#E1DFDA] rounded-2xl p-10 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
      <h1 class="text-3xl font-bold text-gray-900 mb-10 text-center tracking-tight">
        프로필 수정
      </h1>

      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- 프로필 이미지 -->
        <div class="flex flex-col items-center gap-4">
          <div
            class="relative h-28 w-28 rounded-full overflow-hidden border border-[#D9D7D2] bg-[#F4F3F0] shadow-inner"
          >
            <img
              v-if="preview || profile_image_url"
              :src="preview || profile_image_url"
              alt="profile"
              class="h-full w-full object-cover"
            />
            <div v-else class="flex items-center justify-center h-full text-gray-400 text-sm">
              No Image
            </div>
          </div>
          <label
            class="cursor-pointer text-xs text-gray-700 border border-[#D9D7D2] rounded-full px-3 py-1 bg-[#F4F3F0] hover:bg-[#EAE9E5] transition"
          >
            이미지 변경
            <input type="file" @change="onFileChange" class="hidden" />
          </label>
        </div>

        <hr class="border-[#E5E4E1]" />

        <!-- 닉네임 -->
        <div>
          <label class="block text-sm font-semibold text-gray-800 mb-2">닉네임</label>
          <input
            v-model="form.nickname"
            type="text"
            placeholder="닉네임을 입력하세요"
            class="w-full rounded-lg border border-[#DAD8D2] bg-[#F8F7F4] px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#B3B1AB]"
          />
        </div>

  

        <!-- 소개글 -->
        <div>
          <label class="block text-sm font-semibold text-gray-800 mb-2">소개글</label>
          <textarea
            v-model="form.bio"
            rows="4"
            placeholder="자기소개를 입력해주세요."
            class="w-full rounded-lg border border-[#DAD8D2] bg-[#F8F7F4] px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#B3B1AB]"
          ></textarea>
        </div>

        <hr class="border-[#E5E4E1]" />

        <!-- 저장 버튼 -->
        <div class="flex justify-center">
          <button
            type="submit"
            class="rounded-full bg-gradient-to-b from-[#F1F0EC] to-[#E9E7E2] px-8 py-2.5 text-sm font-semibold text-gray-800 border border-[#D8D6D1] hover:from-[#E9E7E2] hover:to-[#E3E1DC] transition"
          >
            변경사항 저장
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { updateUserProfile } from '@/api/user'

const router = useRouter()
const store = useUserStore()

const form = ref({
  nickname: store.nickname || '',
  password: '',
  bio: store.bio || '',
  profile_image_url: store.user?.profile_image_url || '',
})

const preview = ref(null)
const selectedFile = ref(null)

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  selectedFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => (preview.value = e.target.result)
  reader.readAsDataURL(file)
}

const handleSubmit = async () => {
  const formData = new FormData()
  formData.append('nickname', form.value.nickname)
  formData.append('bio', form.value.bio)
  if (selectedFile.value) {
    // 여기에 이제 이미지 업로드 기능 추가해야 함
    formData.append('profile_image', selectedFile.value)
  }

  try {
    await updateUserProfile(store.userId, formData)
    alert('프로필이 성공적으로 수정되었습니다!')
    router.push(`/users/${store.userId}`)
  } catch (err) {
    console.error(err)
    alert('프로필 수정 중 오류가 발생했습니다.')
  }
}
</script>

<style scoped>
input[type='file']::-webkit-file-upload-button {
  background: #f1f0ec;
  border: 1px solid #d9d7d2;
  border-radius: 9999px;
  padding: 4px 10px;
  font-size: 12px;
  cursor: pointer;
}
</style>
