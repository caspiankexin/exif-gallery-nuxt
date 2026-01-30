<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

const {
  mini,
} = defineProps<{
  loggedIn?: boolean
  imageClass?: HTMLAttributes['class']
  hideAction?: boolean
  mini?: boolean
  editable?: boolean
}>()

const emit = defineEmits<{
  deleted: [id: string]
  update: [photo: IPhoto]
}>()

const photo = defineModel<IPhoto>('photo', { required: true })
const photoWithExif = computed(() => photo.value.make || photo.value.model || photo.value.focalLength || photo.value.focalLengthIn35mmFormat || photo.value.fNumber || photo.value.exposureTime || photo.value.iso || photo.value.exposureCompensation)

const isMini = computed(() => mdScreen.value && mini)

const { deletingPhoto, deletePhoto: _deletePhoto } = useDeletePhoto()
const showDeletePopover = ref(false)
function deletePhoto(id: string) {
  _deletePhoto(id).then(() => emit('deleted', id)).finally(() => showDeletePopover.value = false)
}
</script>

<template>
  <div class="flex gap-1 lt-md:flex-col lg:gap-8 md:gap-4">
    <div v-if="isMini" class="relative md:flex-[2] xl:flex-[3]">
      <PhotoItemCard class="h-full w-full inset-0 absolute" :photo="photo" :image-class="imageClass" mini />
    </div>
    <PhotoItemCard v-else :photo="photo" class="md:flex-[2] xl:flex-[3]" :image-class="imageClass" />
    <div class="h-fit top-16 relative sticky z-1 md:flex-[1]" :class="{ 'md:top-0': isMini }">
      <div class="flex lt-md:mb-2 md:flex-col lt-md:justify-between">
        <div>
          <h3> {{ photo.title }}</h3>
          <p class="text-sm text-muted-foreground">
            {{ photo.caption }}
          </p>
        </div>
        <div v-if="!hideAction" class="ml--2.4 flex min-h-2 items-center">
          <slot name="action-button" />
          <EditPhotoDialog
            v-if="editable"
            :photo="photo"
          >
            <TooltipIconButton
              v-if="loggedIn"
              :label="$t('button.edit')"
              icon="i-lucide-edit text-muted-foreground"
            />
          </EditPhotoDialog>
          <DeleteConfirmPopover
            v-if="loggedIn"
            v-model:open="showDeletePopover"
            :loading="deletingPhoto === photo.id"
            @confirm="loggedIn && deletePhoto(photo.id)"
          >
            <TooltipIconButton
              :label="$t('button.delete')"
              icon="i-lucide-trash text-muted-foreground"
              @click="showDeletePopover = true"
            />
          </DeleteConfirmPopover>
        </div>
      </div>

      <div class="text-sm text-muted-foreground flex md:flex-col md:gap-2 lt-md:justify-between">
        <div class="flex flex-col gap-2">
          <span class="text-0.8em op-66">{{ formatDate(photo.takenAt) }}</span>
          <div>
            <div v-if="photoWithExif" class="flex gap-1 items-center">
              <div class="i-lucide-camera op-70" />
              <span>{{ formatCameraText(photo) }}</span>
            </div>
            <div v-if="photoWithExif" class="flex gap-1 items-center">
              <div class="i-lucide-aperture op-70" />
              <span>{{ formatLensText(photo) }}</span>
            </div>
          </div>
          <div class="flex flex-wrap gap-x-2 gap-y-1 md:flex-col">
            <NuxtLinkLocale
              v-for="tag in photo.tags?.split(',') || []"
              :key="tag"
              :to="`/tag/${tag}`"
              class="m--1 p-1 rounded-lg op-80 w-fit transition-colors hover:bg-muted"
            >
              <Tag :label="tag" />
            </NuxtLinkLocale>
          </div>
        </div>
        <div
          v-if="photoWithExif"
          class="text-muted-foreground leading-tight font-mono flex flex-col"
        >
          <div class="flex items-baseline">
            <span>{{ photo.focalLength ? toFixed(photo.focalLength, 1) : '--' }}mm</span>
            <span class="mx-1"> · </span>
            <span
              v-if="photo.focalLengthIn35mmFormat"
              :title="$t('camera_lens.focal_length_35mm')"
              class="text-xs op-50"
            >{{ photo.focalLengthIn35mmFormat }}mm</span>
          </div>
          <div class="flex items-baseline">
            <span class="text-1.1em op-60">ƒ</span>
            <span>/{{ photo.fNumber || '--' }}</span>
          </div>
          <div class="flex gap-1 items-baseline">
            <span>{{ photo.exposureTime ? formatExposureTime(photo.exposureTime) : '--' }}</span>
            <span class="text-0.8em op-50">s</span>
          </div>
          <div class="flex gap-1 items-baseline">
            <span class="text-0.8em op-50">ISO</span>
            <span>{{ photo.iso || '--' }}</span>
          </div>
          <div class="flex gap-1 items-baseline">
            <span>{{ photo.exposureCompensation ? `${photo.exposureCompensation > 0 ? '+' : ''}${photo.exposureCompensation.toFixed(1)}` : '0' }}</span>
            <span class="text-0.8em op-50">ev</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
