<template>
  <div class="flex items-center gap-1 border-b border-gray-100">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      class="relative -mb-px px-3 py-3 text-sm font-medium transition-colors"
      :class="
        modelValue === tab.id
          ? 'text-gray-900'
          : 'text-gray-500 hover:text-gray-700'
      "
      @click="$emit('update:modelValue', tab.id)"
    >
      <span>{{ tab.label }}</span>
      <span v-if="typeof tab.count === 'number'" class="ml-1 text-xs text-gray-400">
        {{ tab.count }}
      </span>
      <span
        v-if="modelValue === tab.id"
        class="absolute inset-x-2 bottom-0 h-0.5 rounded bg-gray-900"
      />
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, required: true },
  tabs: { type: Array, required: true },
})

defineEmits(['update:modelValue'])
</script>

