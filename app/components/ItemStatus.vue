<script setup lang="ts">
defineProps<{
  checked: boolean
  label: string
}>()
</script>

<template>
  <div class="flex gap-1 items-center">
    <div v-show="checked" class="text-4 text-primary w-4">
      <div class="i-lucide-check" />
    </div>
    <span :class="{ 'text-muted-foreground': !checked }">
      <slot>
        {{ label }}
      </slot>
    </span>
  </div>
</template>

<style scoped>

</style>
