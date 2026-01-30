<script lang="ts" setup>
import { cn } from '@/lib/utils'

interface Props {
  text?: string
  class?: string
  disabled?: boolean
  loading?: boolean
  left?: string
}
const props = withDefaults(defineProps<Props>(), {
  text: 'Button',
})

const buttonRef = ref<HTMLButtonElement>()
</script>

<template>
  <button
    ref="buttonRef"
    :disabled="props.disabled"
    :class="
      cn(
        'group relative w-32 cursor-pointer overflow-hidden rounded-lg border bg-background p-2 text-center font-semibold',
        props.class,
        { 'op-50 cursor-default': props.disabled },
      )
    "
  >
    <span
      class="inline-block translate-x-1 transition-all duration-300 group-hover:opacity-0 group-hover:translate-x-12"
    >
      {{ text }}
    </span>

    <div
      class="text-primary-foreground opacity-0 flex gap-2 size-full translate-x-12 transition-all duration-300 items-center top-0 justify-center absolute z-10 group-hover:opacity-100 group-hover:-translate-x-1"
    >
      <span>{{ text }}</span>
      <div class="i-lucide-arrow-right text-6" />
    </div>
    <div
      class="rounded-lg bg-primary size-2 scale-100 transition-all duration-300 left-[18%] top-[40%] absolute group-hover:bg-primary group-hover:size-full group-hover:scale-[1.8] group-hover:left-0 group-hover:top-0"
      :class="{ 'animate-ping animate-delay-400': loading }"
      :style="{ left: props.left }"
    />
  </button>
</template>

<style></style>
