<template>
  <div>
    <el-dropdown trigger="click" @command="handleSetSize">
      <div class="fy-icon--style">
        {{ languageOptions.find(item => item.value === language)?.label }}
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="item of languageOptions" :key="item.value" :disabled="language === item.value" :command="item.value">
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    
  </div>
</template>

<script setup>
import useAppStore from "@/store/modules/app";

import { useI18n } from 'vue-i18n'
const { locale, t } = useI18n();

const appStore = useAppStore();
const language = computed(() => appStore.language);
// const { proxy } = getCurrentInstance();
const languageOptions = ref([
  { label: "中文", value: "zh" },
  { label: "English", value: "en" },
]);

function handleSetSize(v) {
  // proxy.$modal.loading("正在切换语言，请稍候...");
  locale.value = v; // 切换语言
  appStore.setLanguage(v);
  // setTimeout("window.location.reload()", 1000);
}
</script>

<style lang='scss' scoped>
.fy-icon--style {
  font-size: 18px;
  line-height: 50px;
  padding-right: 7px;
}
</style>