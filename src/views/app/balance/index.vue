<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
         <el-form-item label="账户编码" prop="balanceCode">
            <el-input v-model="queryParams.balanceCode" placeholder="请输入账户编码" clearable style="width: 200px"
               @keyup.enter="handleQuery" />
         </el-form-item>
         <el-form-item label="账户名称" prop="balanceName">
            <el-input v-model="queryParams.balanceName" placeholder="请输入账户名称" clearable style="width: 200px"
               @keyup.enter="handleQuery" />
         </el-form-item>
         <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="账户状态" clearable style="width: 200px">
               <el-option :label="$t('dict.disable.0')" value="1" />
               <el-option :label="$t('dict.disable.1')" value="0" />
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
               v-hasPermi="['app:balance:add']">新增</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
               v-hasPermi="['app:balance:edit']">修改</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
               v-hasPermi="['app:balance:remove']">删除</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
               v-hasPermi="['app:balance:export']">导出</el-button>
         </el-col>
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="balanceList" @selection-change="handleSelectionChange" border>
         <template #empty>
            <el-empty description="No Data" />
         </template>
         <el-table-column type="selection" width="55" align="center" />
         <el-table-column label="账户ID" align="center" prop="balanceId" />
         <el-table-column label="账户号" align="center" prop="balanceNo" />
         <el-table-column label="账户类型" align="center" prop="balanceType" />
         <el-table-column label="关联用户" align="center" prop="userid" />
         <el-table-column label="变更余额" align="center" prop="changeNum" />
         <el-table-column label="原余额" align="center" prop="originalNum" />
         <el-table-column label="当前余额" align="center" prop="currentNum" />
         <el-table-column label="账户状态" align="center" prop="status">
            <template #default="scope">
               <el-tag v-if="scope.row.status == '1'" effect="light">
                  {{ $t('dict.disable.0') }}
               </el-tag>
               <el-tag v-if="scope.row.status == '0'" effect="light" type="danger">
                  {{ $t('dict.disable.1') }}
               </el-tag>
            </template>
         </el-table-column>
         <el-table-column label="变更时间" align="center" prop="createdAt" width="180"></el-table-column>
         <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
               <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                  v-hasPermi="['app:balance:edit']">修改</el-button>
               <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                  v-hasPermi="['app:balance:remove']">删除</el-button>
            </template>
         </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
         v-model:limit="queryParams.pageSize" @pagination="getList" />

      <Edit ref="editRef" @onClose="getList" />
   </div>
</template>

<script setup name="Balance">
import { listBalance, delBalance } from "@/api/app/balance";
import { ref } from "vue";
import Edit from "./edit.vue";

const { proxy } = getCurrentInstance();

const balanceList = ref([]);
const loading = ref(true);
const showSearch = ref(false);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const editRef = ref()

const queryParams = ref({
   pageNum: 1,
   pageSize: 10,
});

/** 查询账户列表 */
function getList() {
   loading.value = true;
   listBalance(queryParams.value).then(response => {
      balanceList.value = response.rows;
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
   ids.value = selection.map(item => item.balanceId);
   single.value = selection.length != 1;
   multiple.value = !selection.length;
}
/** 新增按钮操作 */
function handleAdd() {
   editRef.value?.handleAdd()
}
/** 修改按钮操作 */
function handleUpdate(row) {
   const balanceId = row.balanceId || ids.value;
   editRef.value?.handleUpdate(balanceId)

}
/** 删除按钮操作 */
function handleDelete(row) {
   const balanceIds = row.balanceId || ids.value;
   proxy.$modal.confirm('是否确认删除账户编号为"' + balanceIds + '"的数据项？').then(function () {
      return delBalance(balanceIds);
   }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
   }).catch(() => { });
}
/** 导出按钮操作 */
function handleExport() {
   proxy.download("app/balance/export", {
      ...queryParams.value
   }, `balance_${new Date().getTime()}.xlsx`);
}

getList();
</script>
