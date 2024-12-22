<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
         <el-form-item label="档案ID" prop="archivalId">
            <el-input v-model="queryParams.archivalId" placeholder="请输入档案ID" clearable style="width: 200px"
               @keyup.enter="handleQuery" />
         </el-form-item>
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
         <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">删除</el-button>
         </el-col>
         <!-- <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport">导出</el-button>
         </el-col> -->
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="doctorroundsList" @selection-change="handleSelectionChange">
         <template #empty>
            <el-empty description="No Data" />
         </template>
         <el-table-column type="selection" width="55" align="center" />
         <el-table-column label="序号" type="index" width="80" />
         <!-- <el-table-column label="记录ID" align="center" prop="doctorRoundsId" /> -->
         <!-- <el-table-column label="房号" align="center" prop="doctorroundsCode" /> -->
         <!-- <el-table-column label="档案ID" align="center" prop="archivalId" /> -->
         <el-table-column label="医生名称" align="center" prop="createdBy" />
         <el-table-column label="登记时间" align="center" prop="doctorRoundsTime" />
         <el-table-column label="备注" align="center" prop="remark" />
         <!-- <el-table-column label="状态" align="center" prop="status">
            <template #default="scope">
               <el-tag v-if="scope.row.status == '1'" effect="light">
                  {{ $t('dict.disable.0') }}
               </el-tag>
               <el-tag v-if="scope.row.status == '0'" effect="light" type="danger">
                  {{ $t('dict.disable.1') }}
               </el-tag>
            </template>
         </el-table-column> -->
         <!-- <el-table-column label="创建时间" align="center" prop="createdAt" width="180" /> -->
         <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
               <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
               <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
            </template>
         </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
         v-model:limit="queryParams.pageSize" @pagination="getList" />

      <Edit ref="editRef" @onClose="getList" />
   </div>
</template>

<script setup name="DoctorRounds">
import { listDoctorRounds, delDoctorRounds } from "@/api/senbei/doctorrounds";
import { ref } from "vue";
import Edit from "./edit.vue";

const { proxy } = getCurrentInstance();

const doctorroundsList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const editRef = ref()

const queryParams = ref({
   pageNum: 1,
   pageSize: 20
});

/** 查询岗位列表 */
function getList() {
   loading.value = true;
   listDoctorRounds(queryParams.value).then(response => {
      doctorroundsList.value = response.rows;
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
   ids.value = selection.map(item => item.doctorRoundsId);
   single.value = selection.length != 1;
   multiple.value = !selection.length;
}
/** 新增按钮操作 */
function handleAdd() {
   editRef.value?.handleAdd()
}
/** 修改按钮操作 */
function handleUpdate(row) {
   const doctorRoundsId = row.doctorRoundsId || ids.value;
   editRef.value?.handleUpdate(doctorRoundsId)

}
/** 删除按钮操作 */
function handleDelete(row) {
   const doctorRoundsIds = row.doctorRoundsId || ids.value;
   proxy.$modal.confirm('是否确认删除查房记录ID为"' + doctorRoundsIds + '"的数据项？').then(function () {
      return delDoctorRounds(doctorRoundsIds);
   }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
   }).catch(() => { });
}
/** 导出按钮操作 */
function handleExport() {
   proxy.download("senbei/doctorrounds/export", {
      ...queryParams.value
   }, `doctorrounds_${new Date().getTime()}.xlsx`);
}

getList();
</script>
