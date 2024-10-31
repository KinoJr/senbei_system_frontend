<template>
  <router-view />
</template>

<script setup>
import useSettingsStore from '@/store/modules/settings'
import useAppStore from "@/store/modules/app";
import { handleThemeStyle } from '@/utils/theme'
import { useI18n } from 'vue-i18n'
const { locale } = useI18n();

onMounted(() => {
  nextTick(() => {
    // 初始化国际翻译
    locale.value = useAppStore().language
    // 初始化主题样式
    handleThemeStyle(useSettingsStore().theme)
  })
})
</script>
