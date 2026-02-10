<script setup lang="ts">
import { cn } from '@/lib/utils'

definePageMeta({
  layout: 'home',
})

const route = useRoute()
const localePath = useLocalePath()

const id = route.params.id?.[0]
if (!id) {
  navigateTo(localePath('/'))
  throw new Error('id is required')
}

const { loggedIn } = useUserSession()

const { photo } = usePhoto(id)

const pStore = usePhotosStore()
const photosStore = pStore.photosStore

function onDeleted() {
  photosStore.clear()
  navigateTo(localePath('/'))
}

const { idle } = useIdle(2000, { initialState: true })
const idleState = useState('p-idle', () => true)
watch(idle, val => idleState.value = val, { immediate: true })
// 照片翻页导航
const { hasContext, canGoPrev, canGoNext, loading, goPrev, goNext }
  = usePhotoNavigation(id)

// 移动端滑动支持
const imageContainerRef = ref<HTMLElement>()
const { isSwiping, direction } = useSwipe(imageContainerRef, {
  threshold: 50,
  onSwipeEnd: () => {
    if (direction.value === 'left' && canGoNext.value) {
      goNext()
    }
    else if (direction.value === 'right' && canGoPrev.value) {
      goPrev()
    }
  },
})
</script>

<template>
  <section
    v-if="photo"
    ref="imageContainerRef"
    class="relative overflow-hidden h-dvh"
  >
    <div
      v-if="hasContext && canGoPrev"
      class="group cursor-pointer left-2 top-1/2 absolute z-10 -translate-y-1/2"
    >
      <Button
        variant="ghost"
        class="text-xl text-foreground/67 rounded-lg bg-background/30 size-16 shadow-lg transition-all duration-300 backdrop-blur hover:bg-background/50"
        :class="cn(
          (isSwiping ? direction === 'right' : !idle) ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none',
          'group-hover:translate-x-0 group-hover:opacity-100 group-hover:pointer-events-auto',
        )"
        @click="goPrev"
      >
        <div class="i-lucide-chevron-left" />
      </Button>
    </div>
    <div
      v-if="hasContext && canGoNext"
      class="group cursor-pointer right-2 top-1/2 absolute z-10 -translate-y-1/2"
    >
      <Button
        variant="ghost"
        class="text-xl text-foreground/67 rounded-lg bg-background/30 size-16 shadow-lg transition-all duration-300 backdrop-blur hover:bg-background/50"
        :class="cn(
          (isSwiping ? direction === 'left' : !idle) ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none',
          'group-hover:translate-x-0 group-hover:opacity-100 group-hover:pointer-events-auto',
        )"
        :loading="loading"
        @click="goNext"
      >
        <div class="i-lucide-chevron-right" />
      </Button>
    </div>

    <PhotoItem
      :photo="photo"
      :logged-in="loggedIn"
      image-class="current-image"
      :fullscreen="true"
      :idle="idle"
      editable
      @deleted="onDeleted()"
    />
  </section>
  <section v-else>
    <Skeleton class="w-full aspect-[4/3]" />
  </section>
</template>

<style scoped>
.current-image {
  view-transition-name: vtn-image;
}
</style>
