<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
         <el-form-item label="员工账号" prop="userId">
            <el-select v-model="queryParams.userId" filterable placeholder="请选择员工账号" style="width: 200px">
               <el-option v-for="item in userOptions" :key="item.userId" :label="item.userName" :value="item.userId" />
            </el-select>
         </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
         </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" @click="handleJieSuan">结算提成</el-button>
         </el-col>
         <!-- <el-col :span="1.5">
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
         </el-col> -->
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
         <template #empty>
            <el-empty description="No Data" />
         </template>
         <el-table-column type="selection" width="55" align="center" />
         <el-table-column label="序号" type="index" width="80" />
         <el-table-column label="员工账号" align="center" prop="userId">
            <template #default="scope">
               {{ getUserNameById(scope.row.userId) }}
            </template>
         </el-table-column>
         <el-table-column label="提成总额" align="center" prop="commissionAmount" >
            <template #default="scope">
               <el-text type="danger">{{ (scope.row.commissionAmount / 100).toFixed(2) }}</el-text>
            </template>
         </el-table-column>
         <el-table-column label="创建时间" align="center" prop="createdAt" />
         <el-table-column label="创建者" align="center" prop="createdBy" />
         <!-- <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
               <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:post:edit']">修改</el-button>
               <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                  v-hasPermi="['system:post:remove']">删除</el-button>
            </template>
         </el-table-column> -->
      </el-table>
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
         v-model:limit="queryParams.pageSize" @pagination="getList" />

      <Edit ref="editRef" @onClose="getList" />
      <JieSuan ref="jieSuanRef" @onClose="getList" />
   </div>
</template>

<script setup name="Post">
import { listCommission, delCommission } from "@/api/senbei/commission";
import { listUser } from "@/api/system/user";
import { ref } from "vue";
import Edit from "./edit.vue";
import JieSuan from "./jiesuan.vue";

const { proxy } = getCurrentInstance();

const postList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const editRef = ref()

const userOptions = ref([])

const queryParams = ref({
   pageNum: 1,
   pageSize: 20,
   postCode: undefined,
   postName: undefined,
   status: undefined
});

const jieSuanRef = ref()
function handleJieSuan() {
   jieSuanRef.value?.handleAdd(userOptions.value)
}

function getUserNameById(userId) {
   for (let item of userOptions.value) {
      if (item.userId === userId) {
         return item.userName
      }
   }
   return "未知"
}

/** 查询分类列表 */
function getList() {
   loading.value = true;
   // 获取员工列表
   listUser({ pageNum: 1, pageSize: 1000 }).then((response) => {
      userOptions.value = response.rows
   })
   listCommission(queryParams.value).then(response => {
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
   ids.value = selection.map(item => item.commissionId);
   single.value = selection.length != 1;
   multiple.value = !selection.length;
}
/** 新增按钮操作 */
function handleAdd() {
   editRef.value?.handleAdd()
}
/** 修改按钮操作 */
function handleUpdate(row) {
   const tIds = row.commissionId || ids.value;
   editRef.value?.handleUpdate(tIds)

}
/** 删除按钮操作 */
function handleDelete(row) {
   const tIds = row.commissionId || ids.value;
   proxy.$modal.confirm('是否确认删除分类编号为"' + tIds + '"的数据项？').then(function () {
      return delCommission(tIds);
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
