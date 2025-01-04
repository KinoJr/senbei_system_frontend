<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
         <el-form-item label="客户账号" prop="userName">
            <el-select v-model="queryParams.userId" filterable placeholder="请选择客户账号" style="width: 200px">
               <el-option v-for="item in userOptions" :key="item.userId" :label="(item.userName + ' - ' + item.nickName)" :value="item.userId" />
            </el-select>
         </el-form-item>
         <el-form-item label="订单编号" prop="shoppingNo">
            <el-input v-model="queryParams.shoppingNo" placeholder="请输入订单编号" clearable style="width: 200px"
               @keyup.enter="handleQuery" />
         </el-form-item>
         <el-form-item label="订单状态" prop="shoppingStatus">
            <el-select v-model="queryParams.shoppingStatus" placeholder="请选择订单状态" clearable style="width: 200px">
               <el-option label="已创建" value="0" />
               <el-option label="进行中" value="1" />
               <el-option label="已完成" value="2" />
               <el-option label="已取消" value="3" />
               <el-option label="已锁定" value="4" />
            </el-select>
         </el-form-item>
         <el-form-item label="结算状态" prop="shoppingSettlement">
            <el-select v-model="queryParams.shoppingSettlement" placeholder="请选择结算状态" clearable style="width: 200px">
               <el-option label="未结算" value="0" />
               <el-option label="已结算" value="1" />
            </el-select>
         </el-form-item>
         <el-form-item :label="$t('public.createdTime')" style="width: 308px;">
            <el-date-picker v-model="dateRange" value-format="YYYY-MM-DD" type="daterange" range-separator="-"
               :start-placeholder="$t('public.startDate')" :end-placeholder="$t('public.endDate')"></el-date-picker>
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
         <!-- <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
               v-hasPermi="['system:post:remove']">删除</el-button>
         </el-col> -->
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
         <!-- <el-table-column label="订单ID" align="center" prop="shoppingId" /> -->
         <el-table-column label="订单编号" align="center" prop="shoppingNo" />
         <el-table-column label="客户账号" align="center" prop="shoppingSettlement">
            <template #default="scope">
               {{ getUserName(scope.row.userId) }}
            </template>
         </el-table-column>
         <el-table-column label="订单总额(¥)" align="center" prop="shoppingSum">
            <template #default="scope">
               {{ (scope.row.shoppingSum / 100).toFixed(2) }}
            </template>
         </el-table-column>
         <el-table-column label="订单状态" align="center" prop="shoppingStatus">
            <template #default="scope">
               <el-tag v-if="scope.row.shoppingStatus == '0'" effect="light">
                  已创建
               </el-tag>
               <el-tag v-if="scope.row.shoppingStatus == '1'" effect="light" type="warning">
                  进行中
               </el-tag>
               <el-tag v-if="scope.row.shoppingStatus == '2'" effect="light" type="success">
                  已完成
               </el-tag>
               <el-tag v-if="scope.row.shoppingStatus == '3'" effect="light" type="danger">
                  已取消
               </el-tag>
               <el-tag v-if="scope.row.shoppingStatus == '4'" effect="light" type="info">
                  已锁定
               </el-tag>
            </template>
         </el-table-column>
         <el-table-column label="结算状态" align="center" prop="shoppingSettlement">
            <template #default="scope">
               <el-tag v-if="scope.row.shoppingSettlement == '0'" effect="light" type="warning">
                  未结算
               </el-tag>
               <el-tag v-if="scope.row.shoppingSettlement == '1'" effect="light" type="success">
                  已结算
               </el-tag>
            </template>
         </el-table-column>
         <el-table-column label="创建时间" align="center" prop="createdAt" width="180" />
         <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
               <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:post:edit']">修改/详情</el-button>
               <!-- <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                  v-hasPermi="['system:post:remove']">删除</el-button> -->
            </template>
         </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
         v-model:limit="queryParams.pageSize" @pagination="getList" />

      <Edit ref="editRef" @onClose="getList" :userOptions="userOptions" />
   </div>
</template>

<script setup name="Post">
import { listShopping, delShopping } from "@/api/senbei/shopping";
import { listUser } from "@/api/app/user";
import { ref } from "vue";
import Edit from "./edit.vue";

const route = useRoute();

const { proxy } = getCurrentInstance();

const dataList = ref([]);
const loading = ref(true);
const showSearch = ref(false);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const editRef = ref()

const queryParams = ref({
   pageNum: 1,
   pageSize: 20
});

// 获取客户列表
const userOptions = ref([]);
function getUserList() {
   listUser({ pageNum: 1, pageSize: 10000 }).then(response => {
      userOptions.value = response.rows;
   });
}
function getUserName(uid) {
   const array = userOptions.value
   for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if (element.userId === uid) {
         return element.userName
      }
   }
   return "-"
}

/** 查询订单列表 */
function getList() {
   loading.value = true;
   getUserList()
   listShopping(proxy.addDateRange(queryParams.value, dateRange.value)).then(response => {
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
   ids.value = selection.map(item => item.shoppingId);
   single.value = selection.length != 1;
   multiple.value = !selection.length;
}
/** 新增按钮操作 */
function handleAdd() {
   editRef.value?.handleAdd()
}
/** 修改按钮操作 */
function handleUpdate(row) {
   const tIds = row.shoppingId || ids.value;
   editRef.value?.handleUpdate(tIds)
}
/** 删除按钮操作 */
function handleDelete(row) {
   const tIds = row.shoppingId || ids.value;
   proxy.$modal.confirm('是否确认删除订单编号为"' + tIds + '"的数据项？').then(function () {
      return delShopping(tIds);
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

const dateRange = ref([])
onMounted(() => {
   //获取传递过来的参数
   const query = route.query;
   if (query) {
      dateRange.value[0] = query.beginTime
      dateRange.value[1] = query.endTime
      queryParams.value.shoppingSettlement = query.shoppingSettlement
   }
   getList();
})
</script>
