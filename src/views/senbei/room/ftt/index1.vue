<template>
  <div class="demo-app">
    <div class="demo-app-sidebar">
      <el-select v-model="rowsValues" multiple filterable @change="onSelectChange" placeholder="请输入房号"
        style="width: 100%" clearable>
        <el-option v-for="item in rows" :key="item.id" :label="item.title + '-' + item.name" :value="item.id" />
      </el-select>
      <el-table ref="multipleTableRef" :data="rows" @selection-change="handleSelectionChange" border>
        <el-table-column type="selection" width="28" />
        <el-table-column label="房号" align="center" prop="title">
          <template #default="scope">
            <p :style="{color: scope.row.color}">
              {{ scope.row.title }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center" prop="name" />
      </el-table>
    </div>
    <div class="demo-app-main">
      <FullCalendar ref="fullCalendarRef" v-if="initialEvents !== undefined" class="demo-app-calendar"
        :options="calendarOptions">
        <template v-slot:eventContent="arg">
          <b>{{ arg.timeText }}</b>
          <i>{{ arg.event.title }}</i>
        </template>
      </FullCalendar>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import multiMonthPlugin from "@fullcalendar/multimonth";
import esLocale from "@fullcalendar/core/locales/es";
import zhcnLocale from "@fullcalendar/core/locales/zh-cn";

import { getUseRooms } from "@/api/senbei/room";

const eventGuid = ref(0);
const initialEvents = ref();
const currentEvents = ref([]);
const fullCalendarRef = ref();
const calendarOptions = ref({
  locales: [esLocale, zhcnLocale],
  locale: "zh-cn",
  plugins: [
    dayGridPlugin,
    timeGridPlugin,
    interactionPlugin, // needed for dateClick
    multiMonthPlugin,
  ],
  initialView: "dayGridMonth", // 初始视图
  // 头部布局
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay", // 选择展示方式
  },
  initialEvents: [], // 初始事件
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

const rowsValues = ref([])
const rows = ref([])

const multipleTableRef = ref()

// 选择日期触发
function handleDateSelect(selectInfo) {
  let title = prompt("Please enter a new title for your event");
  let calendarApi = selectInfo.view.calendar;
  calendarApi.unselect(); // clear date selection
  if (title) {
    let args = {
      id: createEventId(),
      title,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
      color: 'red'
    };
    console.log("添加事件:", args);
    calendarApi.addEvent(args);
  }
}

// 点击日程事件触发事件
function handleEventClick(clickInfo) {
  if (
    confirm(
      `Are you sure you want to delete the event '${clickInfo.event.title}'`
    )
  ) {
    clickInfo.event.remove();
  }
}

function handleEvents(events) {
  currentEvents.value = events;
}

// 构建事件ID
function createEventId() {
  return String(eventGuid.value++);
}

function getList() {
  getUseRooms().then(response => {
    let array = response
    array.forEach(item => {
      item.color = getRandomColor()
    });
    calendarOptions.value.initialEvents = array
    initialEvents.value = array
    rows.value = array
  });
}
function getRandomColor() {
  var color = 'rgb(';
  color += Math.floor(Math.random() * 256) + ',';
  color += Math.floor(Math.random() * 256) + ',';
  color += Math.floor(Math.random() * 256) + ')';
  return color;
}

function handleSelectionChange(selection) {
  // rowsValues.value = []
  initialEvents.value = undefined;
  setTimeout(function () {
    if (selection.length == 0) {
      calendarOptions.value.initialEvents = rows.value
      initialEvents.value = rows.value
      return
    }
    calendarOptions.value.initialEvents = selection
    initialEvents.value = selection
    console.log("initialEvents.value => ", initialEvents.value);
  }, 1);
}

function onSelectChange(e) {
  if (e) {
    rows.value.map(item => {
      if (e.includes(item.id)) {
        multipleTableRef.value?.toggleRowSelection(item, true)
      }
    })
    return
  }

  initialEvents.value = undefined;
  setTimeout(function () {
    calendarOptions.value.initialEvents = rows.value
    initialEvents.value = rows.value
  }, 1);
}

onMounted(() => {
  getList()
  // let todayStr = new Date().toISOString().replace(/T.*$/, ""); // YYYY-MM-DD of today
  // let demoData = [
  //   {
  //     id: createEventId(),
  //     title: "A101",
  //     start: todayStr,
  //   },
  //   {
  //     id: createEventId(),
  //     title: "B101",
  //     start: todayStr + "T12:00:00",
  //     end: todayStr + "T23:00:00",
  //   },
  //   {
  //     id: createEventId(),
  //     title: "B105",
  //     start: "2024-09-09",
  //     end: "2024-09-14",
  //     allDay: true,
  //   },
  // ];
  // setTimeout(function () {
  //   initialEvents.value = demoData;
  // }, 1000);
});
</script>

<style lang="scss" scoped>
h2 {
  margin: 0;
  font-size: 16px;
}

ul {
  margin: 0;
  padding: 0 0 0 1.5em;
}

li {
  margin: 1.5em 0;
  padding: 0;
}

b {
  /* used for event dates/times */
  margin-right: 3px;
}

.demo-app {
  display: flex;
  min-height: 100%;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
}

.demo-app-sidebar {
  width: 300px;
  line-height: 1.5;
  background: #eaf9ff;
  border-right: 1px solid #d3e2e8;
}

.demo-app-sidebar-section {
  padding: 2em;
}

.demo-app-main {
  flex-grow: 1;
  padding: 3em;
}

.fc {
  /* the calendar root */
  max-width: 1100px;
  margin: 0 auto;
}
</style>
