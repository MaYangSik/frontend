<script setup>
import {
  Home,
  Compass,
  Star,
  Users,
  Bookmark,
  TrendingUp,
  User,
  Settings
} from "lucide-vue-next";

const menuItems = [
  { icon: Home, label: "Home", active: true },
  { icon: Compass, label: "Discover", active: false },
  { icon: Star, label: "Reviews", active: false },
  { icon: Users, label: "Following", active: false },
  { icon: Bookmark, label: "Bookmarks", active: false },
  { icon: TrendingUp, label: "Ranking", active: false },
  { icon: User, label: "Profile", active: false },
  { icon: Settings, label: "Settings", active: false }
];
</script>

<template>
  <div class="h-full flex flex-col px-3 py-6 bg-white">
    <div class="px-2 mb-6">
      <span class="text-lg font-bold tracking-tight">MaYangSik</span>
    </div>

    <nav class="flex-1 space-y-1">
      <button
        v-for="item in menuItems"
        :key="item.label"
        type="button"
        class="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-colors"
        :class="item.active
          ? 'bg-gray-900 text-white'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'"
      >
        <component
          :is="item.icon"
          class="w-4 h-4 mr-2.5"
          :stroke-width="1.5"
        />
        <span>{{ item.label }}</span>
      </button>
    </nav>

    <button
      type="button"
      class="w-full bg-blue-50 text-blue-600 font-medium px-3 py-2 rounded-md hover:bg-blue-100 transition-colors mt-4 text-sm"
    >
      Write Review
    </button>
  </div>
</template>
