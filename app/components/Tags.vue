<script setup lang="ts">
const { data } = await useFetch('/api/tags', {
  key: '/api/tags',
})
const tags = computed(() => data.value?.data)
</script>

<template>
  <div class="text-sm text-muted-foreground pr-10 flex flex-col gap-1">
    <NuxtLinkLocale
      v-for="tag in tags"
      :key="tag.id"
      :to="`/tag/${tag.name}`"
      class="group px-1 rounded-lg bg-muted w-fit transition-colors relative"
    >
      <Tag :label="tag.name" />
      <div class="text-sm op-50 translate-x-full bottom-0 right-0 top-0 absolute md:hidden md:group-hover:block">
        {{ tag.photoCount }}
      </div>
    </NuxtLinkLocale>
  </div>
</template>
