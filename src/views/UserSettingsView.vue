<template>
  <div class="min-h-screen bg-[#F1F0EC]">
    <div class="mx-auto flex max-w-5xl px-6 py-10 gap-8">
      <!-- 왼쪽 사이드 메뉴 -->
      <aside
        class="w-64 flex-shrink-0 rounded-2xl border border-[#EAE9E3] bg-white p-6 shadow-sm flex flex-col justify-between"
      >
        <div>
          <h2 class="text-sm font-semibold text-gray-700 mb-4">설정</h2>

          <ul class="space-y-1">
            <li
              v-for="item in menuItems"
              :key="item.key"
              @click="selectMenu(item.key)"
              :class="[
                'cursor-pointer rounded-lg px-3 py-2 text-sm flex items-center gap-2 transition',
                selectedMenu === item.key
                  ? 'bg-[#F5F4F0] text-[#1f2937] font-semibold'
                  : 'text-gray-600 hover:bg-[#F9F8F5]'
              ]"
            >
              <component :is="item.icon" class="w-4 h-4" />
              <span>{{ item.label }}</span>
            </li>
          </ul>
        </div>

        <!-- 🚨 계정 관리 -->
        <div class="mt-8 border-t border-[#EAE9E3] pt-5">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">계정 관리</h3>
          <ul>
            <li
              class="cursor-pointer rounded-lg px-3 py-2 text-sm flex items-center gap-2 transition text-[#b91c1c] hover:bg-[#FDF2F2]"
              @click="selectMenu('withdraw')"
            >
              <span>회원 탈퇴</span>
            </li>
          </ul>
        </div>
      </aside>

      <!-- 오른쪽 콘텐츠 -->
      <main
        class="flex-1 bg-white rounded-2xl border border-[#EAE9E3] p-8 shadow-sm transition-all"
      >
        <SettingContent :selectedMenu="selectedMenu" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  UserCog,
  ShieldBan,
  Lock,
  ShieldCheck,
  CreditCard,
} from 'lucide-vue-next'
import SettingContent from '@/components/SettingContent.vue'

const selectedMenu = ref('profile')

const menuItems = [
  { key: 'personal', label: '프로필 및 정보 수정', icon: UserCog },
  { key: 'block', label: '차단한 계정 관리', icon: ShieldBan },
  { key: 'security', label: '비밀번호 및 보안', icon: Lock },
  { key: 'permissions', label: '내 정보 및 권한', icon: ShieldCheck },
  { key: 'billing', label: '결제 및 구독 관리', icon: CreditCard },
]

const selectMenu = (key) => {
  selectedMenu.value = key
}
</script>
