<template>
  <div>
    <div style="width: 30px;margin:6px auto;">
      <el-icon :size="25" @click="onClick()">
        <el-badge :value="unRead" :max="99" :show-zero="false">
          <Message />
        </el-badge>
      </el-icon>
    </div>
    <el-drawer v-model="visible">
      <template #header="{ close, titleId, titleClass }">
        <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect" :ellipsis="false">
          <el-menu-item index="1">
            <el-badge :value="znxUnRead" :max="99" :offset="[8, 15]" :show-zero="false">
              站内信
            </el-badge>
          </el-menu-item>
        </el-menu>
      </template>
      <el-scrollbar>
        <el-timeline style="max-width: 500px;margin-right: 10px;">
          <el-empty v-if="!listData || listData.length == 0" description="暂无消息" :image-size="100" />
          <el-timeline-item v-else :timestamp="item.createdAt" placement="top" v-for="(item, index) in listData"
            :key="index">
            <el-card shadow="hover" @click="clickCard(item, index)">
              <el-row>
                <el-col :span="20">
                  <el-text size="large" truncated>{{ item.title }}</el-text>
                </el-col>
                <el-col :span="4" style="text-align: right;">
                  <el-tag v-if="item.type === '1'" type="warning">通知</el-tag>
                  <el-tag v-if="item.type === '2'" type="success">公告</el-tag>
                  <el-tag v-if="item.type === '3'" type="warning">告警</el-tag>
                  <el-tag v-if="item.type === '4'" type="danger">异常</el-tag>
                </el-col>
              </el-row>
              <el-tag v-if="item.read" type="info">已读</el-tag>
              <el-tag v-else type="danger">未读</el-tag>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-scrollbar>
    </el-drawer>
    <el-dialog v-model="dialogVisible" width="800">
      <template #header="{ close, titleId, titleClass }">
        <el-row>
          <el-col :span="20">
            <el-text size="large">{{ dialogDetails.dTitle }}</el-text>
          </el-col>
          <el-col :span="4" style="text-align: right;">
            <el-tag v-if="dialogDetails.dType === '1'" type="warning">通知</el-tag>
            <el-tag v-if="dialogDetails.dType === '2'" type="success">提醒</el-tag>
          </el-col>
        </el-row>
      </template>

      <editor v-model="dialogDetails.dContent" :min-height="192" />
      <span>
        创建时间：{{ dialogDetails.dTime }} 创建者：{{ dialogDetails.dBy }}
      </span>
      <template #footer>
        <div class="dialog-footer">
          <el-button v-if="activeIndex === '2'" @click="onDel">删除</el-button>
          <el-button type="primary" @click="onRead(dialogDetails.dId, dialogDetails.dIndex)">
            已读
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { listNotice, delNotice, readNotice } from "@/api/system/notice";
import useUserStore from '@/store/modules/user'

const userStore = useUserStore()

const visible = ref(false)
const activeIndex = ref("1")

const unRead = ref(0)
const listData = ref([])

const timer = ref()

// 站内信内容
const znxUnRead = ref(0)
const znxTotal = ref(0)
const znxList = ref([])
const znxQueryParams = ref({
  pageNum: 1,
  pageSize: 20,
  status: "1",
  belong: "2",
  userid: userStore.userId
})

// 详情
const dialogVisible = ref(false)
const dialogDetails = ref({
  dIndex: 0,
  dId: 0,
  dTitle: "",
  dType: "",
  dContent: "",
  dTime: "",
  dBy: "",
})

// 点击站内信
function onClick() {
  // console.log("点击站内信");
  visible.value = true
  getList()
}
// 点击菜单
function handleSelect(key, event) {
  // console.log("点击菜单", key, event);
  activeIndex.value = key
  if (key === "1") {
    listData.value = znxList.value
  } else if (key === "2") {
    listData.value = []
  } else {
    listData.value = []
  }
}
// 点击卡片
function clickCard(msg, index) {
  // console.log("点击卡片", msg);
  dialogDetails.value = {
    dIndex: index,
    dId: msg.noticeId,
    dTitle: msg.title,
    dType: msg.type,
    dContent: msg.content,
    dTime: msg.createdAt,
    dBy: msg.createdBy
  }
  dialogVisible.value = true
}
// 已读
function onRead(id, index) {
  if (activeIndex.value === '1') {
    znxUnRead.value--;
    znxList.value[index].read = true
    listData.value = znxList.value
    // 更新信息读取标识为已读
    readNotice()
  }
  dialogVisible.value = false
}
// 删除
function onDel() {
  dialogVisible.value = false
}

// 获取信息内容
async function getList() {
  // 获取站内信
  listNotice(znxQueryParams.value).then(response => {
    znxList.value = response.rows || [];
    znxTotal.value = response.total;
    let tp = 0
    if (znxList.value.length > 0) {
      for (let i = 0; i < znxList.value.length; i++) {
        if (znxList.value[i].read === "0") {
          tp++
        }
      }
    }
    znxUnRead.value = tp;
    listData.value = znxList.value
  });
}

watch(znxUnRead, (newValue, oldValue) => {
  unRead.value = znxUnRead.value;
});

onMounted(() => {
  getList()
  // 站内信定时执行
  // timer.value = setInterval(getList, 60 * 1000);
})

onUnmounted(()=>{
  // clearInterval(timer.value)
})

</script>

<style lang='scss' scoped>
.demo-tabs>.el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>