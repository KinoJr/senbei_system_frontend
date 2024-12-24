<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
         <el-form-item label="登录地址" prop="ipaddr">
            <el-input v-model="queryParams.ipaddr" placeholder="请输入登录地址" clearable style="width: 240px;"
               @keyup.enter="handleQuery" />
         </el-form-item>
         <el-form-item label="用户名称" prop="userName">
            <el-input v-model="queryParams.userName" placeholder="请输入用户名称" clearable style="width: 240px;"
               @keyup.enter="handleQuery" />
         </el-form-item>
         <el-form-item label="用户类型" prop="userType">
            <el-input v-model="queryParams.userType" placeholder="请输入用户类型" clearable style="width: 240px;"
               @keyup.enter="handleQuery" />
         </el-form-item>
         <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="登录状态" clearable style="width: 240px">
               <el-option :key="'0'" :label="$t('dict.resStatus.0')" :value="'0'"></el-option>
               <el-option :key="'1'" :label="$t('dict.resStatus.1')" :value="'1'"></el-option>
            </el-select>
         </el-form-item>
         <el-form-item label="登录时间" style="width: 308px">
            <el-date-picker v-model="dateRange" value-format="YYYY-MM-DD HH:mm:ss.SSS" type="daterange"
               range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
               :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
         </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
         </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
            <el-button type="danger" plain icon="CircleClose" :disabled="multiple" @click="handleQuit"
               v-hasPermi="['system:logininfor:remove']">强退</el-button>
         </el-col>
         <!-- <el-col :span="1.5">
            <el-button
               type="danger"
               plain
               icon="Delete"
               @click="handleClean"
               v-hasPermi="['system:logininfor:remove']"
            >清空</el-button>
         </el-col> -->
         <el-col :span="1.5">
            <el-button type="primary" plain icon="Unlock" :disabled="single" @click="handleUnlock"
               v-hasPermi="['system:logininfor:unlock']">解锁</el-button>
         </el-col>
         <!-- <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
               v-hasPermi="['system:logininfor:export']">导出</el-button>
         </el-col> -->
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table ref="logininforRef" v-loading="loading" :data="logininforList" @selection-change="handleSelectionChange"
         :default-sort="defaultSort" @sort-change="handleSortChange">
         <template #empty>
            <el-empty description="No Data" />
         </template>
         <!-- <el-table-column type="selection" width="55" align="center" /> -->
         <el-table-column type="index"/>
         <!-- <el-table-column label="访问编号" align="center" prop="_timestamp" /> -->
         <el-table-column label="访问时间" align="center" prop="time" sortable="custom"
            :sort-orders="['descending', 'ascending']" width="200" />
         <el-table-column label="在线" align="center" prop="data_online">
            <template #default="scope">
               <el-tag v-if="scope.row.data_online" effect="light">
                  在线
               </el-tag>
               <el-tag v-else effect="light" type="info">
                  离线
               </el-tag>
            </template>
         </el-table-column>
         <el-table-column label="用户名称" align="center" prop="data_username" :show-overflow-tooltip="true" />
         <el-table-column label="用户类型" align="center" prop="data_usertype" :show-overflow-tooltip="true" />
         <el-table-column label="IP地址" align="center" prop="data_ipaddr" :show-overflow-tooltip="true" />
         <el-table-column label="登录地点" align="center" width="200" prop="data_loginlocation"
            :show-overflow-tooltip="true" />
         <el-table-column label="操作系统" align="center" prop="data_os" :show-overflow-tooltip="true" />
         <el-table-column label="浏览器" align="center" prop="data_browser" :show-overflow-tooltip="true" />
         <!-- <el-table-column label="请求状态" align="center" prop="data_status" /> -->
         <el-table-column label="描述" align="center" width="200" prop="data_msg" :show-overflow-tooltip="true" />
         <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
               <el-button link type="primary" icon="Edit" @click="handleDetails(scope.row)">详情</el-button>
            </template>
         </el-table-column> -->
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
         v-model:limit="queryParams.pageSize" @pagination="getList" />
   </div>
</template>

<script setup name="Logininfor">
import { list, delLogininfor, cleanLogininfor, quitLogininfor, unlockLogininfor } from "@/api/system/logininfor";
import dayjs from 'dayjs';

const { proxy } = getCurrentInstance();

const logininforList = ref([]);
const loading = ref(true);
const showSearch = ref(false);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const selectName = ref("");
const total = ref(0);
const dateRange = ref([]);
const defaultSort = ref({ prop: "loginTime", order: "descending" });

// 查询参数
const queryParams = ref({
   pageNum: 1,
   pageSize: 10,
   ipaddr: undefined,
   userName: undefined,
   status: undefined,
   orderByColumn: undefined,
   isAsc: undefined
});

/** 查询登录日志列表 */
function getList() {
   loading.value = true;
   list(proxy.addDateRange(queryParams.value, dateRange.value)).then(response => {
      logininforList.value = response.rows;
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
   dateRange.value = [];
   proxy.resetForm("queryRef");
   queryParams.value.pageNum = 1;
   proxy.$refs["logininforRef"].sort(defaultSort.value.prop, defaultSort.value.order);
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
   // ids.value = selection.map(item => item.infoId);
   ids.value = selection;
   multiple.value = !selection.length;
   single.value = selection.length != 1;
   selectName.value = selection.map(item => item.data_username);
}
/** 排序触发事件 */
function handleSortChange(column, prop, order) {
   queryParams.value.orderByColumn = column.prop;
   queryParams.value.isAsc = column.order;
   getList();
}
/** 删除按钮操作 */
function handleDelete(row) {
   const infoIds = row.infoId || ids.value;
   proxy.$modal.confirm('是否确认删除访问编号为"' + infoIds + '"的数据项?').then(function () {
      return delLogininfor(infoIds);
   }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
   }).catch(() => { });
}
/** 清空按钮操作 */
function handleClean() {
   proxy.$modal.confirm("是否确认清空所有登录日志数据项?").then(function () {
      return cleanLogininfor();
   }).then(() => {
      getList();
      proxy.$modal.msgSuccess("清空成功");
   }).catch(() => { });
}
/** 强退按钮操作 */
function handleQuit() {
   const username = selectName.value;
   proxy.$modal.confirm('是否确认强退用户"' + username + '"数据项?').then(function () {
      return quitLogininfor(ids.value?.map(item => item.data_token));
   }).then(() => {
      getList();
      proxy.$modal.msgSuccess("用户" + username + "强退成功");
   }).catch(() => { });
}
/** 解锁按钮操作 */
function handleUnlock() {
   const username = selectName.value;
   proxy.$modal.confirm('是否确认解锁用户"' + username + '"数据项?').then(function () {
      return unlockLogininfor(ids.value?.map(item => item.data_username));
   }).then(() => {
      getList();
      proxy.$modal.msgSuccess("用户" + username + "解锁成功");
   }).catch(() => { });
}
/** 导出按钮操作 */
function handleExport() {
   proxy.download("system/logininfor/export", {
      ...queryParams.value,
   }, `logininfor_${new Date().getTime()}.xlsx`);
}

getList();
</script>
