<template>
  <el-dialog :title="title" v-model="open" width="90%" style="max-width: 800px;" append-to-body :destroy-on-close="true">
    <FullCalendar v-if="initialEvents" class="demo-app-calendar" :options="calendarOptions">
      <template v-slot:eventContent="arg">
        <b>{{ arg.timeText }}</b>
        <i>{{ arg.event.title }}</i>
      </template>
    </FullCalendar>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="cancel">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
  <Edit ref="editRef" :roomOptions="roomOptions" @onClose="getList" />
</template>
<script setup name="ExamineEveryday">
import { ref } from 'vue';
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import esLocale from "@fullcalendar/core/locales/es";
import zhcnLocale from "@fullcalendar/core/locales/zh-cn";

import { getListByArchivalId } from "@/api/senbei/doctorrounds";
import Edit from "./edit.vue";

const { proxy } = getCurrentInstance();
const emits = defineEmits(["onClose"]);

const open = ref(false);
const title = ref("");

const editRef = ref()

// 档案信息
const aInfo = ref({});
const roomOptions = ref([]);

const initialEvents = ref();
const currentEvents = ref([]);
const calendarOptions = ref({
  locales: [esLocale, zhcnLocale],
  locale: "zh-cn",
  plugins: [
    dayGridPlugin,
    timeGridPlugin,
    interactionPlugin, // needed for dateClick
  ],
  initialView: "dayGridMonth", // 初始视图
  // 头部布局
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay", // 选择展示方式
  },
  initialEvents, // 初始事件
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventsSet: handleEvents,
  /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
});
// 选择日期触发(新增)
function handleDateSelect(selectInfo) {
  // proxy.$modal.msg("添加查房记录");
  // console.log("selectInfo ==> ", selectInfo.startStr+"T"+getCurrentTime());
  editRef.value?.handleAdd(aInfo.value.archivalId, selectInfo.startStr + "T" + getCurrentTime());
}
// 点击日程事件触发事件(更新)
function handleEventClick(clickInfo) {
  // console.log("clickInfo ==> ", clickInfo.event);
  editRef.value?.handleUpdate(clickInfo.event._def.publicId);
}
function handleEvents(events) {
  currentEvents.value = events;
}
/** 修改按钮操作 */
function handleUpdate(row, rooms) {
  open.value = true;
  title.value = "医生查房记录";
  aInfo.value = row
  roomOptions.value = rooms
  getList()
}
/** 取消按钮操作 */
function cancel() {
  open.value = false;
}
// 获取医生查房列表
function getList() {
  initialEvents.value = undefined
  getListByArchivalId(aInfo.value.archivalId).then((response) => {
    initialEvents.value = response || [];
  });
}

function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const hoursStr = hours < 10 ? '0' + hours : hours;
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  const secondsStr = seconds < 10 ? '0' + seconds : seconds;
  return hoursStr + ':' + minutesStr + ':' + secondsStr;
}

onMounted(() => {});

defineExpose({
  handleUpdate
})
</script>