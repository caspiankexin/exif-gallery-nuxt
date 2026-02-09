import type { NavigationType } from '~/stores/navigation'

export function usePhotoNavigation(photoId: MaybeRef<string>) {
  const localePath = useLocalePath()
  const navStore = useNavigationStore()
  const router = useRouter()

  const id = computed(() => toValue(photoId))

  // 是否有有效的浏览上下文
  const hasContext = computed(() => navStore.hasValidContext(id.value))

  // 是否可以翻页
  const canGoPrev = computed(() => hasContext.value && navStore.hasPrev(id.value))
  const canGoNext = computed(() => hasContext.value && navStore.hasNext(id.value))

  // 当前位置信息
  const currentIndex = computed(() => navStore.getCurrentIndex(id.value))
  const totalLoaded = computed(() => navStore.photoIds.length)
  const hasMore = computed(() => navStore.hasMore)

  // 是否正在加载更多
  const loading = computed(() => navStore.loading)

  // 跳转到上一张
  async function goPrev() {
    if (!canGoPrev.value)
      return

    const prevId = navStore.getPrevId(id.value)
    if (prevId) {
      await router.replace(localePath(`/p/${prevId}`))
    }
  }

  // 跳转到下一张
  async function goNext() {
    if (!canGoNext.value)
      return

    const nextId = await navStore.getNextId(id.value)
    if (nextId) {
      await router.replace(localePath(`/p/${nextId}`))
    }
  }

  // 键盘导航
  function handleKeydown(event: KeyboardEvent) {
    // 忽略输入框中的按键
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return
    }

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        goPrev()
        break
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
        event.preventDefault()
        goNext()
        break
    }
  }

  // 设置键盘监听
  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })

  return {
    hasContext,
    canGoPrev,
    canGoNext,
    currentIndex,
    totalLoaded,
    hasMore,
    loading,
    goPrev,
    goNext,
  }
}

// 在列表页使用的辅助函数：设置导航上下文
export function useNavigationSetup(
  type: NavigationType,
  params: NavigationContext['params'],
  photos: Ref<IPhoto[]>,
  hasMore: Ref<boolean>,
  limit: number,
) {
  const navStore = useNavigationStore()

  function setupNavigation() {
    navStore.setContext(
      { type, params },
      photos.value,
      hasMore.value,
      limit,
    )
  }

  // 当照片列表或hasMore变化时更新上下文
  watch([photos, hasMore], () => {
    setupNavigation()
  }, { deep: true })

  return {
    setupNavigation,
  }
}
