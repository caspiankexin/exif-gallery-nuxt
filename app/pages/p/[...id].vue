<script setup lang="ts">
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
</script>

<template>
  <section
    v-if="photo"
    class="p-4 relative"
  >
    <PhotoItem
      :photo="photo"
      :logged-in="loggedIn"
      image-class="current-image"
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
