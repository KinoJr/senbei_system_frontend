<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
         <el-form-item label="姓名" prop="completedName">
            <el-input v-model="queryParams.completedName" placeholder="请输入姓名" clearable style="width: 200px"
               @keyup.enter="handleQuery" />
         </el-form-item>
         <el-form-item label="电话" prop="completedPhone">
            <el-input v-model="queryParams.completedPhone" placeholder="请输入电话" clearable style="width: 200px"
               @keyup.enter="handleQuery" />
         </el-form-item>
         <el-form-item label="房号" prop="completedRoomNo">
            <el-input v-model="queryParams.completedRoomNo" placeholder="请输入房号" clearable style="width: 200px"
               @keyup.enter="handleQuery" />
         </el-form-item>
         <!-- <el-form-item label="状态" prop="completedStatus">
            <el-select v-model="queryParams.completedStatus" placeholder="分类状态" clearable style="width: 200px">
               <el-option :label="$t('dict.disable.1')" value="0" />
               <el-option :label="$t('dict.disable.0')" value="1" />
            </el-select>
         </el-form-item> -->
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
         </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd"
               v-hasPermi="['system:post:add']">新增</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
               v-hasPermi="['system:post:edit']">修改</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
               v-hasPermi="['system:post:remove']">删除</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
               v-hasPermi="['system:post:export']">导出</el-button>
         </el-col>
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
         <template #empty>
            <el-empty description="No Data" />
         </template>
         <el-table-column type="selection" width="55" align="center" />
         <el-table-column type="index" width="80" />
         <!-- <el-table-column label="分类ID" align="center" prop="completedId" /> -->
         <el-table-column label="姓名" align="center" prop="completedName" />
         <el-table-column label="电话" align="center" prop="completedPhone" />
         <el-table-column label="房号" align="center" prop="completedRoomNo" />
         <!-- <el-table-column label="地址" align="center" prop="completedAddress" /> -->
         <el-table-column label="入馆时间" align="center" prop="completedEnterTime" />
         <el-table-column label="出馆时间" align="center" prop="completedOutTime" />
         <el-table-column label="创建者" align="center" prop="createdBy" />
         <!-- <el-table-column label="状态" align="center" prop="completedStatus">
            <template #default="scope">
               <el-tag v-if="scope.row.completedStatus == '1'" effect="light">
                  {{ $t('dict.disable.0') }}
               </el-tag>
               <el-tag v-if="scope.row.completedStatus == '0'" effect="light" type="danger">
                  {{ $t('dict.disable.1') }}
               </el-tag>
            </template>
         </el-table-column> -->
         <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
               <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:post:edit']">修改</el-button>
               <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                  v-hasPermi="['system:post:remove']">删除</el-button>
            </template>
         </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
         v-model:limit="queryParams.pageSize" @pagination="getList" />

      <Edit ref="editRef" @onClose="getList" />
   </div>
</template>

<script setup name="Post">
import { listCompleted, delCompleted } from "@/api/senbei/completed";
import { ref } from "vue";
import Edit from "./edit.vue";

const { proxy } = getCurrentInstance();

const postList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const editRef = ref()

const queryParams = ref({
   pageNum: 1,
   pageSize: 20,
   postCode: undefined,
   postName: undefined,
   status: undefined
});

/** 查询分类列表 */
function getList() {
   loading.value = true;
   listCompleted(queryParams.value).then(response => {
      postList.value = response.rows;
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
   ids.value = selection.map(item => item.completedId);
   single.value = selection.length != 1;
   multiple.value = !selection.length;
}
/** 新增按钮操作 */
function handleAdd() {
   editRef.value?.handleAdd()
}
/** 修改按钮操作 */
function handleUpdate(row) {
   const tIds = row.completedId || ids.value;
   editRef.value?.handleUpdate(tIds)

}
/** 删除按钮操作 */
function handleDelete(row) {
   const tIds = row.completedId || ids.value;
   proxy.$modal.confirm('是否确认删除分类编号为"' + tIds + '"的数据项？').then(function () {
      return delCompleted(tIds);
   }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
   }).catch(() => { });
}
/** 导出按钮操作 */
function handleExport() {
   proxy.download("senbei/completed/export", {
      ...queryParams.value
   }, `completed_${new Date().getTime()}.xlsx`);
}

getList();
</script>
