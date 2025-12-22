<template>
  <nav
    :class="[
      'flex items-center justify-around border-t bg-white px-4 py-2 md:hidden',
      $attrs.class,
    ]"
  >
    <RouterLink
      to="/"
      class="flex flex-col items-center text-xs"
      :class="route.name === 'home' ? 'text-gray-900' : 'text-gray-400'"
    >
      <span class="text-xl">🏠</span>
      <span>홈</span>
    </RouterLink>
    <RouterLink
      to="/ranking"
      class="flex flex-col items-center text-xs"
      :class="route.name === 'ranking' ? 'text-gray-900' : 'text-gray-400'"
    >
      <span class="text-xl">📚</span>
      <span>랭킹</span>
    </RouterLink>
    <RouterLink
      to="/users/:userId?/write"
      class="flex flex-col items-center text-xs"
      :class="route.name === 'write' ? 'text-gray-900' : 'text-gray-400'"
    >
      <span class="text-2xl leading-none">✏️</span>
      <span>글쓰기</span>
    </RouterLink>
    <RouterLink
      to="/users/:userId?"
      class="flex flex-col items-center text-xs"
      :class="route.name === 'profile' ? 'text-gray-900' : 'text-gray-400'"
    >
      <span class="text-xl">👤</span>
      <span>마이페이지</span>
    </RouterLink>
  </nav>
</template>

<script setup>
import { useRoute, RouterLink } from "vue-router";
const route = useRoute();
</script>
