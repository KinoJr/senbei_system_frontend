<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
         <el-form-item label="员工账号" prop="userId">
            <el-select v-model="queryParams.userId" filterable placeholder="请选择员工账号" style="width: 200px">
               <el-option v-for="item in userOptions" :key="item.userId" :label="item.userName" :value="item.userId" />
            </el-select>
         </el-form-item>
         <el-form-item label="状态" prop="rehabilitationStatus">
            <el-select v-model="queryParams.rehabilitationStatus" placeholder="状态" clearable style="width: 200px">
               <el-option label="未结算" value="0" />
               <el-option label="已结算" value="1" />
               <el-option label="作废" value="2" />
            </el-select>
         </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
         </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="showAddUse"
               v-hasPermi="['system:post:add']">新增</el-button>
         </el-col>
         <!-- <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
               v-hasPermi="['system:post:edit']">修改</el-button>
         </el-col> -->
         <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
               v-hasPermi="['system:post:remove']">作废</el-button>
         </el-col>
         <!-- <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
               v-hasPermi="['system:post:export']">导出</el-button>
         </el-col> -->
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange" border>
         <template #empty>
            <el-empty description="No Data" />
         </template>
         <el-table-column type="selection" width="55" align="center" />
         <el-table-column label="序号" type="index" width="80" />
         <!-- <el-table-column label="分类ID" align="center" prop="rehabilitationId" /> -->
         <el-table-column label="员工账号" align="center" prop="userId">
            <template #default="scope">
               {{ getUserNameById(scope.row.userId) }}
            </template>
         </el-table-column>
         <!-- <el-table-column label="关联订单ID" align="center" prop="shoppingId" /> -->
         <el-table-column label="产品名" align="center" prop="productName" />
         <el-table-column label="规格名" align="center" prop="specName" />
         <el-table-column label="登记单价" align="center" prop="rehabilitationNetPrice" >
            <template #default="scope">
               {{ (scope.row.rehabilitationNetPrice / 100).toFixed(2) }}
            </template>
         </el-table-column>
         <!-- <el-table-column label="登记次数" align="center" prop="rehabilitationNum" /> -->
         <el-table-column label="状态" align="center" prop="rehabilitationStatus">
            <template #default="scope">
               <el-tag v-if="scope.row.rehabilitationStatus === '0'" effect="light" type="danger">
                  未结算
               </el-tag>
               <el-tag v-if="scope.row.rehabilitationStatus === '1'" effect="light">
                  已结算
               </el-tag>
               <el-tag v-if="scope.row.rehabilitationStatus === '2'" effect="light" type="info">
                  作废
               </el-tag>
            </template>
         </el-table-column>
         <el-table-column label="总次数" align="center" prop="shoppingListNum" />
         <el-table-column label="剩余次数" align="center" prop="shoppingListUse" >
            <template #default="scope">
               {{ scope.row.shoppingListNum - scope.row.shoppingListUse }}
            </template>
         </el-table-column>
         <el-table-column label="登记时间(摘)" align="center" prop="rehabilitationTime" />
         <el-table-column label="房号(摘)" align="center" prop="rehabilitationRoomNo" />
         <el-table-column label="创建者" align="center" prop="createdBy" />
         <el-table-column label="备注" align="center" prop="remark" />
         <!-- <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
               <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:post:edit']">修改</el-button>
               <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                  v-hasPermi="['system:post:remove']">作废</el-button>
            </template>
         </el-table-column> -->
      </el-table>
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
         v-model:limit="queryParams.pageSize" @pagination="getList" />

      <Edit ref="editRef" @onClose="getList" />
      <AddUse ref="addUseRef" @onClose="getList" />
   </div>
</template>

<script setup name="Post">
import { listRehabilitation, delRehabilitation } from "@/api/senbei/rehabilitation";
import { listUser } from "@/api/system/user";
import { ref } from "vue";
import Edit from "./edit.vue";
import AddUse from "./adduse.vue";

const { proxy } = getCurrentInstance();

const dataList = ref([]);
const loading = ref(true);
const showSearch = ref(false);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const editRef = ref()
const addUseRef = ref()

const userOptions = ref([])
const queryParams = ref({
   pageNum: 1,
   pageSize: 20,
});

function showAddUse(row){
    addUseRef.value?.handleAdd(row)
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
   listRehabilitation(queryParams.value).then(response => {
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
   ids.value = selection.map(item => item.rehabilitationId);
   single.value = selection.length != 1;
   multiple.value = !selection.length;
}
/** 新增按钮操作 */
function handleAdd() {
   editRef.value?.handleAdd()
}
/** 修改按钮操作 */
function handleUpdate(row) {
   const tIds = row.rehabilitationId || ids.value;
   editRef.value?.handleUpdate(tIds)

}
/** 删除按钮操作 */
function handleDelete(row) {
   const tIds = row.rehabilitationId || ids.value;

   // for (let item of dataList.value) {
   //    if (item.rehabilitationStatus !== "0" && tIds.includes(item.rehabilitationId)) {
   //       proxy.$modal.msgError("包含无法作废记录");
   //       return
   //    }
   // }

   proxy.$modal.confirm('是否确认作废ID为"' + tIds + '"的数据项？').then(function () {
      return delRehabilitation(tIds);
   }).then(() => {
      getList();
      proxy.$modal.msgSuccess("操作成功");
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
