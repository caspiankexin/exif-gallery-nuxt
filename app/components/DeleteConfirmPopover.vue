<script setup lang="ts">
defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <slot />
    </PopoverTrigger>
    <PopoverContent align="end" :align-offset="-8" class="w-auto p-2">
      <div class="flex gap-2">
        <Button variant="outline" size="sm" @click="emit('cancel'); open = false">
          {{ $t('button.cancel') }}
        </Button>
        <Button variant="destructive" size="sm" :loading="loading" @click="emit('confirm'); open = false">
          {{ $t('button.confirm_delete') }}
        </Button>
      </div>
    </PopoverContent>
  </Popover>
</template>
