<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
         <el-form-item label="系统模块" prop="title">
            <el-input v-model="queryParams.title" placeholder="请输入系统模块" clearable style="width: 240px;"
               @keyup.enter="handleQuery" />
         </el-form-item>
         <el-form-item label="操作人员" prop="operName">
            <el-input v-model="queryParams.operName" placeholder="请输入操作人员" clearable style="width: 240px;"
               @keyup.enter="handleQuery" />
         </el-form-item>
         <el-form-item label="类型" prop="businessType">
            <el-select v-model="queryParams.businessType" placeholder="操作类型" clearable style="width: 240px">
               <el-option :key="'0'" :label="$t('operlog.d.type.0')" :value="'0'"></el-option>
               <el-option :key="'1'" :label="$t('operlog.d.type.1')" :value="'1'"></el-option>
               <el-option :key="'2'" :label="$t('operlog.d.type.2')" :value="'2'"></el-option>
               <el-option :key="'3'" :label="$t('operlog.d.type.3')" :value="'3'"></el-option>
               <el-option :key="'4'" :label="$t('operlog.d.type.4')" :value="'4'"></el-option>
               <el-option :key="'5'" :label="$t('operlog.d.type.5')" :value="'5'"></el-option>
               <el-option :key="'6'" :label="$t('operlog.d.type.6')" :value="'6'"></el-option>
               <el-option :key="'7'" :label="$t('operlog.d.type.7')" :value="'7'"></el-option>
               <el-option :key="'8'" :label="$t('operlog.d.type.8')" :value="'8'"></el-option>
               <el-option :key="'9'" :label="$t('operlog.d.type.9')" :value="'9'"></el-option>
            </el-select>
         </el-form-item>
         <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="操作状态" clearable style="width: 240px">
               <el-option :key="'0'" :label="$t('dict.resStatus.0')" :value="'0'"></el-option>
               <el-option :key="'1'" :label="$t('dict.resStatus.1')" :value="'1'"></el-option>
            </el-select>
         </el-form-item>
         <el-form-item label="操作时间" style="width: 308px">
            <el-date-picker v-model="dateRange" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" range-separator="-"
               start-placeholder="开始日期" end-placeholder="结束日期"
               :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
         </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
         </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
         <!-- <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
               v-hasPermi="['system:operlog:remove']">删除</el-button>
         </el-col> -->
         <!-- <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" @click="handleClean"
               v-hasPermi="['system:operlog:remove']">清空</el-button>
         </el-col> -->
         <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
               v-hasPermi="['system:operlog:export']">导出</el-button>
         </el-col>
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table ref="operlogRef" v-loading="loading" :data="operlogList" @selection-change="handleSelectionChange"
         :default-sort="defaultSort" @sort-change="handleSortChange">
         <template #empty>
            <el-empty description="No Data" />
         </template>
         <!-- <el-table-column type="selection" width="50" align="center" /> -->
         <el-table-column label="日志编号" align="center" prop="_timestamp" />
         <el-table-column label="操作日期" align="center" prop="time" width="180" sortable="custom"
            :sort-orders="['descending', 'ascending']" />
         <el-table-column label="系统模块" align="center" prop="data_title" :show-overflow-tooltip="true" />
         <el-table-column label="操作类型" align="center" prop="data_businesstype">
            <template #default="scope">
               <el-tag v-if="scope.row.data_businesstype === 0" effect="light" type="info">
                  {{ $t('operlog.d.type.0') }}
               </el-tag>
               <el-tag v-if="scope.row.data_businesstype === 1" effect="light" type="info">
                  {{ $t('operlog.d.type.1') }}
               </el-tag>
               <el-tag v-if="scope.row.data_businesstype === 2" effect="light" type="info">
                  {{ $t('operlog.d.type.2') }}
               </el-tag>
               <el-tag v-if="scope.row.data_businesstype === 3" effect="light" type="danger">
                  {{ $t('operlog.d.type.3') }}
               </el-tag>
               <el-tag v-if="scope.row.data_businesstype === 4" effect="light">
                  {{ $t('operlog.d.type.4') }}
               </el-tag>
               <el-tag v-if="scope.row.data_businesstype === 5" effect="light" type="warning">
                  {{ $t('operlog.d.type.5') }}
               </el-tag>
               <el-tag v-if="scope.row.data_businesstype === 6" effect="light" type="warning">
                  {{ $t('operlog.d.type.6') }}
               </el-tag>
               <el-tag v-if="scope.row.data_businesstype === 7" effect="light" type="danger">
                  {{ $t('operlog.d.type.7') }}
               </el-tag>
               <el-tag v-if="scope.row.data_businesstype === 8" effect="light" type="warning">
                  {{ $t('operlog.d.type.8') }}
               </el-tag>
               <el-tag v-if="scope.row.data_businesstype === 9" effect="light" type="danger">
                  {{ $t('operlog.d.type.9') }}
               </el-tag>
            </template>
         </el-table-column>
         <el-table-column label="操作人员" align="center" width="110" prop="data_opername" :show-overflow-tooltip="true"
            sortable="custom" :sort-orders="['descending', 'ascending']" />
         <el-table-column label="主机" align="center" prop="data_operip" width="130" :show-overflow-tooltip="true" />
         <el-table-column label="请求状态" align="center" prop="data_status" />
         <el-table-column label="消耗时间" align="center" prop="data_costtime" width="110" :show-overflow-tooltip="true"
            sortable="custom" :sort-orders="['descending', 'ascending']">
            <template #default="scope">
               <span>{{ scope.row.data_costtime }}毫秒</span>
            </template>
         </el-table-column>
         <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
               <el-button link type="primary" icon="View" @click="handleView(scope.row, scope.index)">
                  详情</el-button>
            </template>
         </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
         v-model:limit="queryParams.pageSize" @pagination="getList" />

      <!-- 操作日志详细 -->
      <el-dialog title="操作日志详细" v-model="open" width="90%" style="max-width: 800px;" append-to-body>
         <el-form :model="form" label-width="100px">
            <el-row>
               <el-col :span="12">
                  <el-form-item label="操作模块：">{{ form.data_title }} / {{ $t('operlog.d.type.' + form.data_businesstype)
                     }}</el-form-item>
                  <el-form-item label="登录信息：">{{ form.data_opername }} / {{ form.data_operip }} / {{
         form.data_operlocation
      }}</el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="请求地址：">{{ form.data_operurl }}</el-form-item>
                  <el-form-item label="请求方式：">{{ form.data_requestmethod }}</el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item label="操作方法：">{{ form.data_method }}</el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item label="请求参数：">{{ form.data_operparam }}</el-form-item>
               </el-col>
               <el-col :span="6">
                  <el-form-item label="请求状态：">{{ form.data_status }}</el-form-item>
               </el-col>
               <el-col :span="8">
                  <el-form-item label="消耗时间：">{{ form.data_costtime }}毫秒</el-form-item>
               </el-col>
               <el-col :span="10">
                  <el-form-item label="操作时间：">{{ form.time }}</el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item label="异常信息：">{{ form.data_errormsg }}</el-form-item>
               </el-col>
            </el-row>
         </el-form>
         <template #footer>
            <div class="dialog-footer">
               <el-button @click="open = false">关 闭</el-button>
            </div>
         </template>
      </el-dialog>
   </div>
</template>

<script setup name="Operlog">
import { list, delOperlog, cleanOperlog } from "@/api/system/operlog";

const { proxy } = getCurrentInstance();

const operlogList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dateRange = ref([]);
const defaultSort = ref({ prop: "operTime", order: "descending" });

const data = reactive({
   form: {},
   queryParams: {
      pageNum: 1,
      pageSize: 10,
      title: undefined,
      operName: undefined,
      businessType: undefined,
      status: undefined
   }
});

const { queryParams, form } = toRefs(data);

/** 查询登录日志 */
function getList() {
   loading.value = true;
   list(proxy.addDateRange(queryParams.value, dateRange.value)).then(response => {
      operlogList.value = response.rows;
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
   proxy.$refs["operlogRef"].sort(defaultSort.value.prop, defaultSort.value.order);
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
   ids.value = selection.map(item => item.operId);
   multiple.value = !selection.length;
}
/** 排序触发事件 */
function handleSortChange(column, prop, order) {
   queryParams.value.orderByColumn = column.prop;
   queryParams.value.isAsc = column.order;
   getList();
}
/** 详细按钮操作 */
function handleView(row) {
   open.value = true;
   form.value = row;
}
/** 删除按钮操作 */
function handleDelete(row) {
   const operIds = row.operId || ids.value;
   proxy.$modal.confirm('是否确认删除日志编号为"' + operIds + '"的数据项?').then(function () {
      return delOperlog(operIds);
   }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
   }).catch(() => { });
}
/** 清空按钮操作 */
function handleClean() {
   proxy.$modal.confirm("是否确认清空所有操作日志数据项?").then(function () {
      return cleanOperlog();
   }).then(() => {
      getList();
      proxy.$modal.msgSuccess("清空成功");
   }).catch(() => { });
}
/** 导出按钮操作 */
function handleExport() {
   proxy.download("system/operlog/export", {
      ...queryParams.value,
   }, `operlog_${new Date().getTime()}.xlsx`);
}
// function timestampToDatetime(timestamp) {
//   const dateObj = new Date(timestamp);
//   const year = dateObj.getFullYear();
//   const month = (dateObj.getMonth() + 1) < 10 ? "0" + (dateObj.getMonth() + 1) : (dateObj.getMonth() + 1);
//   const day = dateObj.getDate() < 10 ? "0" + dateObj.getDate() : dateObj.getDate();
//   const hours = dateObj.getHours() < 10 ? "0" + dateObj.getHours() : dateObj.getHours();
//   const minutes = dateObj.getMinutes() < 10 ? "0" + dateObj.getMinutes() : dateObj.getMinutes();
//   const seconds = dateObj.getSeconds() < 10 ? "0" + dateObj.getSeconds() : dateObj.getSeconds();
//   return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
// }


getList();
</script>
