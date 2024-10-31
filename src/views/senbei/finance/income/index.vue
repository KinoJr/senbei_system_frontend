<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
         <!-- <el-form-item label="收支名称" prop="incomeName">
            <el-input v-model="queryParams.incomeName" placeholder="请输入收支名称" clearable style="width: 200px"
               @keyup.enter="handleQuery" />
         </el-form-item> -->
         <el-form-item label="收支类型" prop="incomeType">
            <el-select v-model="queryParams.incomeType" placeholder="请选择收支类型" clearable style="width: 200px">
               <el-option label="收入" value="1" />
               <el-option label="支出" value="2" />
            </el-select>
         </el-form-item>
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
         <!-- <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
               v-hasPermi="['system:post:export']">导出</el-button>
         </el-col> -->
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
         <template #empty>
            <el-empty description="No Data" />
         </template>
         <el-table-column type="selection" width="55" align="center" />
         <el-table-column type="index" width="80" />
         <!-- <el-table-column label="收支ID" align="center" prop="incomeId" /> -->
         <el-table-column label="收支名称" align="center" prop="incomeName" />
         <el-table-column label="收支数量" align="center" prop="incomeNum" />
         <el-table-column label="收支单价" align="center" prop="incomePrice" >
            <template #default="scope">
               {{ (scope.row.incomePrice / 100).toFixed(2) }}
            </template>
         </el-table-column>
         <el-table-column label="收支总额" align="center" prop="incomeSum" >
            <template #default="scope">
               {{ (scope.row.incomeSum / 100).toFixed(2) }}
            </template>
         </el-table-column>
         <el-table-column label="收支类型" align="center" prop="incomeType">
            <template #default="scope">
               <el-tag v-if="scope.row.incomeType === '1'" effect="light">
                  收入
               </el-tag>
               <el-tag v-if="scope.row.incomeType === '2'" effect="light" type="danger">
                  支出
               </el-tag>
            </template>
         </el-table-column>
         <el-table-column label="收支时间" align="center" prop="incomeTime" />
         <!-- <el-table-column label="创建时间" align="center" prop="createdAt" /> -->
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
import { listIncome, delIncome } from "@/api/senbei/income";
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

/** 查询收支列表 */
function getList() {
   loading.value = true;
   listIncome(queryParams.value).then(response => {
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
   ids.value = selection.map(item => item.incomeId);
   single.value = selection.length != 1;
   multiple.value = !selection.length;
}
/** 新增按钮操作 */
function handleAdd() {
   editRef.value?.handleAdd()
}
/** 修改按钮操作 */
function handleUpdate(row) {
   const tIds = row.incomeId || ids.value;
   editRef.value?.handleUpdate(tIds)

}
/** 删除按钮操作 */
function handleDelete(row) {
   const tIds = row.incomeId || ids.value;
   proxy.$modal.confirm('是否确认删除收支编号为"' + tIds + '"的数据项？').then(function () {
      return delIncome(tIds);
   }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
   }).catch(() => { });
}
/** 导出按钮操作 */
function handleExport() {
   proxy.download("system/post/export", {
      ...queryParams.value
   }, `post_${new Date().getTime()}.xlsx`);
}

getList();
</script>
