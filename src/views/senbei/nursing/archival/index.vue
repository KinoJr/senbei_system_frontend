<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="房号" prop="archivalRoomId">
        <el-select v-model="queryParams.archivalRoomId" filterable placeholder="请选择房号" style="width: 200px">
          <el-option v-for="item in roomOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="档案编号" prop="archivalName">
        <el-input v-model="queryParams.archivalName" placeholder="请输入档案编号" clearable style="width: 200px"
          @keyup.enter="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="姓名" prop="archivalName">
        <el-input v-model="queryParams.archivalName" placeholder="请输入姓名" clearable style="width: 200px"
          @keyup.enter="handleQuery" />
      </el-form-item> -->
      <el-form-item label="档案状态" prop="status">
        <el-select v-model="queryParams.archivalStatus" placeholder="档案状态" clearable style="width: 200px">
          <el-option label="预定中" value="0" />
          <el-option label="进行中" value="1" />
          <el-option label="结束" value="2" />
          <el-option label="归档" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport">导出</el-button>
      </el-col> -->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="archivalList" @selection-change="handleSelectionChange" border>
      <template #empty>
        <el-empty description="No Data" />
      </template>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="80" />
      <!-- <el-table-column label="档案ID" align="center" prop="archivalId" /> -->
      <!-- <el-table-column label="档案编号" align="center" prop="archivalNo" /> -->
      <el-table-column label="房号" align="center" prop="archivalRoomId">
        <template #default="scope">
          {{ rN(roomOptions, scope.row.archivalRoomId) }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" prop="archivalName" />
      <el-table-column label="入住时长" align="center" prop="nights">
        <template #default="scope">
          {{ scope.row.nights }}天
        </template>
      </el-table-column>
      <el-table-column label="起止日期" align="center">
        <template #default="scope">
          {{ scope.row.archivalStartDate }}~{{ scope.row.archivalEndDate }}
        </template>
      </el-table-column>

      <el-table-column label="类型" align="center" prop="archivalType">
        <template #default="scope">
          <el-tag v-if="scope.row.archivalType === 'a'" effect="light">
            母婴
          </el-tag>
          <el-tag v-if="scope.row.archivalType === 'b'" effect="light" type="success">
            宝妈
          </el-tag>
          <el-tag v-if="scope.row.archivalType === 'c'" effect="light" type="warning">
            宝宝
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="archivalStatus">
        <template #default="scope">
          <el-tag v-if="scope.row.archivalStatus === '0'" effect="light">
            待处理
          </el-tag>
          <el-tag v-if="scope.row.archivalStatus === '1'" effect="light" type="warning">
            进行中
          </el-tag>
          <el-tag v-if="scope.row.archivalStatus === '2'" effect="light" type="success">
            完成
          </el-tag>
          <el-tag v-if="scope.row.archivalStatus === '3'" effect="light" type="info">
            归档
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createdAt" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
          <el-button link type="primary" icon="Edit" @click="examineFirstShow(scope.row)">首日</el-button>
          <el-button link type="primary" icon="Calendar" @click="myCalendarShow(scope.row)">每日</el-button>
          <el-button link type="primary" icon="Calendar" @click="dmyCalendarShow(scope.row)">医生查房</el-button>
          <el-button v-if="scope.row.archivalStatus === '2' || scope.row.archivalStatus === '3'" link type="primary"
            icon="Edit" @click="evaluationShow(scope.row)">出馆评估</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <Edit ref="editRef" @onClose="getList" :appOptions="appOptions" :roomOptions="roomOptions" />

    <ExamineFirst ref="examineFirstRef" :roomOptions="roomOptions" @onClose="getList" />
    <MyCalendar ref="myCalendarRef" @onClose="getList" />
    <DMyCalendar ref="dmyCalendarRef" @onClose="getList" />

    <Evaluation ref="evaluationRef" :roomOptions="roomOptions" @onClose="getList" />
  </div>
</template>

<script setup name="Archival">
import {
  listArchival,
  delArchival,
  getAppList,
  getRoomList,
} from "@/api/senbei/archival";
import { onMounted, ref } from "vue";
import Edit from "./edit.vue";
import ExamineFirst from "./examinefirst.vue";
import MyCalendar from "./mycalendar.vue";
import DMyCalendar from "../doctorrounds/mycalendar.vue";
import Evaluation from "../evaluation/evaluation.vue";
import { getMomAndBabyList } from "@/api/senbei/mom";

const { proxy } = getCurrentInstance();

const appOptions = ref([]);
const roomOptions = ref([]);

const archivalList = ref([]);
const loading = ref(true);
const showSearch = ref(false);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const editRef = ref();

const queryParams = ref({
  pageNum: 1,
  pageSize: 20,

  archivalStatus: "1"
});

const examineFirstRef = ref();
function examineFirstShow(row) {
  examineFirstRef.value?.handleUpdate(row);
}

const myCalendarRef = ref();
function myCalendarShow(row) {
  myCalendarRef.value?.handleUpdate(row, roomOptions.value);
}

const dmyCalendarRef = ref();
function dmyCalendarShow(row) {
  // 获取首日检查记录
  getMomAndBabyList(row.archivalId, row.archivalType).then((response) => {
    if (!(response.mom && response.mom.momId) && row.archivalType !== 'c') {
      proxy.$modal.msgWarning("请先完成首日检查记录");
      return
    }
    if (!response.babyList && row.archivalType === 'c') {
      proxy.$modal.msgWarning("请先完成首日检查记录");
      return
    }
    dmyCalendarRef.value?.handleUpdate(row, roomOptions.value);
  })
}

const evaluationRef = ref();
function evaluationShow(row) {
  evaluationRef.value?.handleUpdate(row);
}

function initDict() {
  getAppList().then((response) => {
    appOptions.value = response;
  });
  getRoomList().then((response) => {
    roomOptions.value = response;
  });
}
function rN(array, k) {
  for (let index = 0; index < array.length; index++) {
    const it = array[index];
    if (it.value === k) {
      return it.label;
    }
  }
}

/** 查询档案列表 */
function getList() {
  loading.value = true;
  initDict();
  listArchival(queryParams.value).then((response) => {
    archivalList.value = response.rows || [];
    total.value = response.total;
    loading.value = false;
  });
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.archivalId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
/** 新增按钮操作 */
function handleAdd() {
  editRef.value?.handleAdd();
}
/** 修改按钮操作 */
function handleUpdate(row) {
  const archivalId = row.archivalId || ids.value;
  editRef.value?.handleUpdate(archivalId);
}
/** 删除按钮操作 */
function handleDelete(row) {
  const archivalIds = row.archivalId || ids.value;
  proxy.$modal
    .confirm('是否确认删除档案编号为"' + archivalIds + '"的数据项？')
    .then(function () {
      return delArchival(archivalIds);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => { });
}
/** 导出按钮操作 */
function handleExport() {
  proxy.download(
    "senbei/archival/export",
    {
      ...queryParams.value,
    },
    `archival_${new Date().getTime()}.xlsx`
  );
}

onMounted(() => {
  proxy.$modal.notifyWarning("请及时更新超过使用期限的档案状态！");
  getList();
})
</script>
