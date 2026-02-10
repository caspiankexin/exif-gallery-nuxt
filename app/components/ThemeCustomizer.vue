<script lang="ts" setup>
const { theme, radius, disable3DCard } = useTheme()
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const switchLocalePath = useSwitchLocalePath()
const { locale } = useI18n()

const colorModeValues = [
  { value: 'light', icon: 'i-lucide-sun' },
  { value: 'dark', icon: 'i-lucide-moon' },
  { value: 'system', icon: 'i-lucide-monitor' },
]

const languageValues = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' },
] as const
</script>

<template>
  <div class="flex flex-col gap-4 md:gap-6">
    <div class="flex flex-1 flex-col gap-4 md:gap-6">
      <div class="flex flex-col gap-1.5">
        <Label for="language" class="text-xs"> {{ $t('theme.language') }} </Label>
        <div class="flex gap-2">
          <NuxtLink
            v-for="(langValue, index) in languageValues"
            :key="index"
            :to="switchLocalePath(langValue.value)"
          >
            <Button
              variant="outline"
              class="h-8"
              :class="{ 'border-2 border-foreground': locale === langValue.value }"
            >
              <span class="text-xs">{{ langValue.label }}</span>
            </Button>
          </NuxtLink>
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <Label for="color" class="text-xs"> {{ $t('theme.color') }} </Label>
        <div class="gap-2 grid grid-cols-3">
          <Button
            v-for="(color, index) in baseColors"
            :key="index"
            variant="outline"
            class="px-3 h-8 justify-start"
            :class="
              color.name === theme
                ? 'border-foreground border-2'
                : ''
            "
            :style="{
              '--theme-primary': `oklch(${isDark ? color.primaryDark : color.primary})`,
            }"
            @click="theme = color.name"
          >
            <span
              class="rounded-full bg-[--theme-primary] flex shrink-0 h-5 w-5 items-center justify-center"
            >
              <div v-if="color.name === theme" class="i-lucide-check text-white h-3 w-3" />
            </span>
            <span class="text-xs ml-2 capitalize">
              {{ color.name }}
            </span>
          </Button>
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <Label for="radius" class="text-xs"> {{ $t('theme.radius') }} </Label>
        <div class="gap-2 grid grid-cols-5">
          <Button
            v-for="(r, index) in RADII"
            :key="index"
            variant="outline"
            class="px-3 h-8 justify-center"
            :class="
              r === radius
                ? 'border-foreground border-2'
                : ''
            "
            @click="radius = r"
          >
            <span class="text-xs">
              {{ r }}
            </span>
          </Button>
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <Label for="theme" class="text-xs"> {{ $t('theme.mode') }} </Label>

        <div class="flex gap-2">
          <Button
            v-for="(colorModeValue, index) in colorModeValues"
            :key="index"
            variant="outline"
            class="h-8"
            :class="{ 'border-2 border-foreground': colorMode.preference === colorModeValue.value }"
            @click="colorMode.preference = colorModeValue.value"
          >
            <div class="mr-2" :class="colorModeValue.icon" />
            <span class="text-xs">{{ $t(`theme.${colorModeValue.value}`) }}</span>
          </Button>
        </div>
      </div>
      <div>
        <div class="flex gap-2 items-center">
          <Label for="3dcard" class="text-xs"> {{ $t('theme.3dcard') }} </Label>
          <Checkbox
            id="3dcard"
            v-model="disable3DCard"
          />
        </div>
      </div>
    </div>
  </div>
</template>
