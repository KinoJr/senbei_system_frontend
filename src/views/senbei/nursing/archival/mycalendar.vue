<template>
  <el-dialog :title="title" v-model="open" width="80%" style="max-width: 800px;" append-to-body :destroy-on-close="true">
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
  <ExamineEveryday ref="examineEverydayRef" :roomOptions="roomOptions" @onClose="getList" />
</template>
<script setup name="ExamineEveryday">
import { ref } from 'vue';
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import esLocale from "@fullcalendar/core/locales/es";
import zhcnLocale from "@fullcalendar/core/locales/zh-cn";

import { getDailyCheckList } from "@/api/senbei/archival";
import ExamineEveryday from "./examineeveryday.vue";

const { proxy } = getCurrentInstance();
const emits = defineEmits(["onClose"]);

const open = ref(false);
const title = ref("");

// 档案信息
const aInfo = ref({});
const roomOptions = ref([]);

const eventGuid = ref(0);
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
  // proxy.$modal.msg("添加每日检查记录");
  // console.log("selectInfo ==> ", selectInfo.startStr+"T"+getCurrentTime());
  examineEverydayAdd(selectInfo.startStr + "T" + getCurrentTime())
  //   let title = prompt("Please enter a new title for your event");
  //   let calendarApi = selectInfo.view.calendar;
  //   calendarApi.unselect(); // clear date selection
  //   if (title) {
  //     let args = {
  //       id: createEventId(),
  //       title,
  //       start: selectInfo.startStr,
  //       end: selectInfo.endStr,
  //       allDay: selectInfo.allDay,
  //     };
  //     console.log("添加事件:", args);
  //     calendarApi.addEvent(args);
  //   }
}

// 点击日程事件触发事件(更新)
function handleEventClick(clickInfo) {
  // console.log("clickInfo ==> ", clickInfo.event);
  examineEverydayUpdate(clickInfo.event._def.publicId)
}

function handleEvents(events) {
  currentEvents.value = events;
}

// 构建事件ID
function createEventId() {
  return String(eventGuid.value++);
}

/** 修改按钮操作 */
function handleUpdate(row, rooms) {
  open.value = true;
  title.value = "每日检查";
  aInfo.value = row
  roomOptions.value = rooms
  getList()
}
function cancel() {
  open.value = false;
}

// 获取已录入的每日检查内容
function getList() {
  // 获取每日检查列表
  // 判断，如果非婴儿托管的，就查各个检查组宝妈列表就可以，如果是婴儿托管，则查各个组其中一个婴儿即可
  initialEvents.value = undefined
  getDailyCheckList(aInfo.value.archivalId, aInfo.value.archivalType).then((response) => {
    if (response) {
      initialEvents.value = response;
    } else {
      proxy.$modal.msgWarning("请先录入首日检查记录");
      cancel()
    }
  });
}

const examineEverydayRef = ref()
function examineEverydayAdd(timp) {
  examineEverydayRef.value?.handleAdd(aInfo.value, timp);
}
function examineEverydayUpdate(groupNo) {
  examineEverydayRef.value?.handleUpdate(aInfo.value, groupNo);
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

onMounted(() => {
  // let todayStr = new Date().toISOString().replace(/T.*$/, ""); // YYYY-MM-DD of today
  // let demoData = [
  // {
  //     id: createEventId(),
  //     title: "正常",
  //     start: "2024-09-07",
  //   //   end: todayStr + "T23:00:00",
  //   //   allDay: true,
  //   },
  //   {
  //     id: createEventId(),
  //     title: "正常",
  //     start: todayStr,
  //   },
  //   {
  //     id: createEventId(),
  //     title: "正常",
  //     start: "2024-09-08T02:31:10",
  //   //   end: todayStr + "T23:00:00",
  //   //   allDay: true,
  //   }
  // ];
  // setTimeout(function () {
  //   initialEvents.value = demoData;
  // }, 1000);
});

defineExpose({
  handleUpdate
})
</script>