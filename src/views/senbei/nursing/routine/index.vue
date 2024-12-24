<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
         <el-form-item label="记录编号" prop="routineCode">
            <el-input v-model="queryParams.routineCode" placeholder="请输入记录编号" clearable style="width: 200px"
               @keyup.enter="handleQuery" />
         </el-form-item>
         <el-form-item label="档案ID" prop="routineId">
            <el-input v-model="queryParams.routineId" placeholder="请输入档案ID" clearable style="width: 200px"
               @keyup.enter="handleQuery" />
         </el-form-item>
         <el-form-item label="名称(昵称)" prop="routineName">
            <el-input v-model="queryParams.routineName" placeholder="请输入名称" clearable style="width: 200px"
               @keyup.enter="handleQuery" />
         </el-form-item>
         <!-- <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="状态" clearable style="width: 200px">
               <el-option label="停用" value="0" />
               <el-option label="未使用" value="1" />
               <el-option label="使用中" value="2" />
               <el-option label="维修中" value="3" />
            </el-select>
         </el-form-item> -->
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
         </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
         <!-- <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
         </el-col> -->
         <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate">修改</el-button>
         </el-col>
         <!-- <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">删除</el-button>
         </el-col> -->
         <!-- <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport">导出</el-button>
         </el-col> -->
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
         <template #empty="">
            <el-empty description="暂无数据，去录入一些数据吧~" />
         </template>
         <el-table-column type="selection" width="55" align="center" />
         <el-table-column label="序号" type="index" width="80" />
         <el-table-column label="记录编号" align="center" prop="routine_code" />
         <el-table-column label="检查编号" align="center" prop="group_no" />
         <el-table-column label="姓名(昵称)" align="center" prop="routine_name" />
         <el-table-column label="档案ID" align="center" prop="routine_id" />
         <el-table-column label="检查时间" align="center" prop="record_time" width="180" />
         <el-table-column label="类型" align="center" prop="routine_type" />
         <el-table-column label="备注" align="center" prop="routine_remark" />
         <!-- <el-table-column label="记录ID" align="center" prop="record_rid" /> -->
         <!-- <el-table-column label="状态" align="center" prop="momStatus">
            <template #default="scope">
               <el-tag v-if="scope.row.momStatus == '0'" effect="light" type="danger">
                  {{ $t('dict.disable.1') }}
               </el-tag>
               <el-tag v-if="scope.row.momStatus == '1'" effect="light">
                  {{ $t('dict.disable.0') }}
               </el-tag>
            </template>
         </el-table-column> -->

         <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
               <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
               <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
            </template>
         </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
         v-model:limit="queryParams.pageSize" @pagination="getList" />
      <ExamineEveryday ref="examineEverydayRef" :roomOptions="roomOptions" @onClose="getList" />
   </div>
</template>

<script setup name="Routine">
import { listRoutine, delRoutine } from "@/api/senbei/routine";
import { delBaby } from "@/api/senbei/baby";
import { delMom } from "@/api/senbei/mom";
import { ref } from "vue";
import { getArchival, getRoomList } from "@/api/senbei/archival";
import ExamineEveryday from "../archival/examineeveryday.vue";



const { proxy } = getCurrentInstance();

const dataList = ref([]);
const loading = ref(true);
const showSearch = ref(false);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryParams = ref({
   pageNum: 1,
   pageSize: 20,
});

const examineEverydayRef = ref()
const roomOptions = ref([])

/** 查询列表 */
function getList() {
   loading.value = true;
   getRoomList().then((response) => {
      roomOptions.value = response;
   });
   listRoutine(queryParams.value).then(response => {
      dataList.value = response.rows;
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
   ids.value = selection.map(item => item.momId);
   single.value = selection.length != 1;
   multiple.value = !selection.length;
}
/** 新增按钮操作 */
function handleAdd() {
   editRef.value?.handleAdd()
}
/** 修改按钮操作 */
function handleUpdate(row) {
   // 查询关联档案
   getArchival(row.routine_id).then((response) => {
      examineEverydayRef.value?.handleUpdate(response, row.group_no);
   })
}
/** 删除按钮操作 */
function handleDelete(row) {
   const ids = row.record_rid;
   proxy.$modal.confirm('是否确认删除名为"' + row.routine_name + '"的数据项？').then(function () {
      if (row.routine_type === "baby") {
         return delBaby(ids);
      }
      return delMom(ids);
   }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
   }).catch(() => { });
}
/** 导出按钮操作 */
function handleExport() {
   proxy.download("senbei/mom/export", {
      ...queryParams.value
   }, `mom_${new Date().getTime()}.xlsx`);
}

getList();
</script>
