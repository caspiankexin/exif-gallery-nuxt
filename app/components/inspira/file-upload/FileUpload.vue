<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { Motion } from 'motion-v'
import { cn } from '~/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
  accept?: string
  multiple?: boolean
  showList?: boolean
}>()

const emit = defineEmits<{
  (e: 'change', files: File[]): void
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const files = ref<File[]>([])
const isActive = ref<boolean>(false)

function handleFileChange(newFiles: File[]) {
  emit('change', newFiles)
  files.value = [...files.value, ...newFiles]
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files)
    return
  handleFileChange(Array.from(input.files))
}

function handleClick() {
  fileInputRef.value?.click()
}

function handleEnter() {
  isActive.value = true
}
function handleLeave() {
  isActive.value = false
}
function handleDrop(e: DragEvent) {
  isActive.value = false
  const droppedFiles = e.dataTransfer?.files ? Array.from(e.dataTransfer.files) : []
  if (droppedFiles.length)
    handleFileChange(droppedFiles)
}
</script>

<template>
  <div
    :class="cn('w-full', $props.class)"
    @dragover.prevent="handleEnter"
    @dragleave="handleLeave"
    @drop.prevent="handleDrop"
    @mouseover="handleEnter"
    @mouseleave="handleLeave"
  >
    <div
      class="group/file p-10 rounded-lg w-full block cursor-pointer relative overflow-hidden"
      @click="handleClick"
    >
      <input
        ref="fileInputRef"
        type="file"
        class="hidden"
        :accept="props.accept"
        :multiple="props.multiple"
        @change="onFileChange"
      >

      <!-- Grid pattern -->
      <div
        class="pointer-events-none [mask-image:radial-gradient(ellipse_at_center,white,transparent)] inset-0 absolute"
      >
        <slot />
      </div>

      <!-- Content -->
      <div class="flex flex-col items-center justify-center">
        <p
          class="text-base text-neutral-700 font-bold font-sans relative z-20 dark:text-neutral-300"
        >
          {{ $t('file_upload.title') }}
        </p>
        <p
          class="text-base text-neutral-400 font-normal font-sans mt-2 relative z-20 dark:text-neutral-400"
        >
          {{ $t('file_upload.description') }}
        </p>

        <div class="mx-auto mt-10 flex flex-col gap-4 max-w-xl w-full relative">
          <template v-if="showList && files.length">
            <Motion
              v-for="(file, idx) in files"
              :key="`file-${idx}`"
              :initial="{ opacity: 0, scaleX: 0 }"
              :animate="{ opacity: 1, scaleX: 1 }"
              class="mx-auto p-4 rounded-md bg-white flex flex-col w-full shadow-sm items-start justify-start relative z-40 overflow-hidden dark:bg-neutral-900 md:h-24"
            >
              <div class="flex gap-4 w-full items-center justify-between">
                <Motion
                  as="p"
                  :initial="{ opacity: 0 }"
                  :animate="{ opacity: 1 }"
                  class="text-base text-neutral-700 max-w-xs truncate dark:text-neutral-300"
                >
                  {{ file.name }}
                </Motion>
                <Motion
                  as="p"
                  :initial="{ opacity: 0 }"
                  :animate="{ opacity: 1 }"
                  class="text-sm text-neutral-600 px-2 py-1 rounded-lg shrink-0 w-fit shadow-input dark:text-white dark:bg-neutral-800"
                >
                  {{ (file.size / (1024 * 1024)).toFixed(2) }} MB
                </Motion>
              </div>

              <div
                class="text-sm text-neutral-600 mt-2 flex flex-col w-full items-start justify-between dark:text-neutral-400 md:flex-row md:items-center"
              >
                <Motion
                  as="p"
                  :initial="{ opacity: 0 }"
                  :animate="{ opacity: 1 }"
                  class="text-sm px-1.5 py-1 rounded-md bg-gray-100 dark:bg-neutral-800"
                >
                  {{ file.type || $t('file_upload.type') }}
                </Motion>
                <Motion
                  as="p"
                  :initial="{ opacity: 0 }"
                  :animate="{ opacity: 1 }"
                >
                  {{ $t('file_upload.modified') }} {{ new Date(file.lastModified).toLocaleDateString() }}
                </Motion>
              </div>
            </Motion>
          </template>
          <template v-if="!showList || !files.length">
            <Motion
              as="div"
              class="mx-auto mt-4 rounded-md bg-white flex h-32 max-w-32 w-full shadow-[0px_10px_50px_rgba(0,0,0,0.1)] items-center justify-center relative z-40 dark:bg-neutral-900 group-hover/file:shadow-2xl"
              :initial="{
                x: 0,
                y: 0,
                opacity: 1,
              }"
              :transition="{
                type: 'spring',
                stiffness: 300,
                damping: 20,
              }"
              :animate="
                isActive
                  ? {
                    x: 20,
                    y: -20,
                    opacity: 0.9,
                  }
                  : {}
              "
            >
              <div class="i-lucide-upload text-20 text-neutral-600 dark:text-neutral-400" />
            </Motion>

            <div
              class="mx-auto mt-4 border border-primary rounded-md border-dashed bg-transparent flex h-32 max-w-32 w-full transition-opacity items-center inset-0 justify-center absolute z-30"
              :class="{ 'opacity-100': isActive, 'opacity-0': !isActive }"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.group-hover\/file\:shadow-2xl:hover {
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.25);
}

.transition-opacity {
  transition: opacity 0.3s ease;
}
</style>
