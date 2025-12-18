<template>
  <div class="min-h-screen bg-white font-sans text-gray-900">
    <MainNavigation />

    <main class="pt-16 pb-16">
      <RouterView />
    </main>

    <MobileNavigation
      class="fixed bottom-0 left-0 right-0 block border-t bg-white md:hidden"
    />
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import MainNavigation from "@/components/MainNavigation.vue";
import MobileNavigation from "@/components/MobileNavigation.vue";
</script>
