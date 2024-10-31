<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
         <el-form-item label="公告标题" prop="noticeTitle">
            <el-input v-model="queryParams.noticeTitle" placeholder="请输入公告标题" clearable style="width: 200px"
               @keyup.enter="handleQuery" />
         </el-form-item>
         <el-form-item label="操作人员" prop="createBy">
            <el-input v-model="queryParams.createBy" placeholder="请输入操作人员" clearable style="width: 200px"
               @keyup.enter="handleQuery" />
         </el-form-item>
         <el-form-item label="类型" prop="type">
            <el-select v-model="queryParams.type" placeholder="公告类型" clearable style="width: 200px">
               <el-option :label="$t('notice.d.type.1')" value="1" />
               <el-option :label="$t('notice.d.type.2')" value="2" />
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
               v-hasPermi="['system:notice:add']">新增</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
               v-hasPermi="['system:notice:edit']">修改</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
               v-hasPermi="['system:notice:remove']">删除</el-button>
         </el-col>
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="noticeList" @selection-change="handleSelectionChange">
         <template #empty>
            <el-empty description="No Data" />
         </template>
         <el-table-column type="selection" width="55" align="center" />
         <el-table-column label="序号" align="center" prop="noticeId" width="100" />
         <el-table-column label="公告标题" align="center" prop="title" :show-overflow-tooltip="true" />
         <el-table-column label="公告类型" align="center" prop="type" width="100">
            <template #default="scope">
               <el-tag v-if="scope.row.type === '1'" effect="light" type="warning">
                  {{ $t('notice.d.type.1') }}
               </el-tag>
               <el-tag v-if="scope.row.type === '2'" effect="light" type="success">
                  {{ $t('notice.d.type.2') }}
               </el-tag>
            </template>
         </el-table-column>
         <el-table-column label="状态" align="center" prop="status" width="100">
            <template #default="scope">
               <el-tag v-if="scope.row.status == '1'" effect="light">
                  {{ $t('dict.disable.0') }}
               </el-tag>
               <el-tag v-if="scope.row.status == '0'" effect="light" type="danger">
                  {{ $t('dict.disable.1') }}
               </el-tag>
            </template>
         </el-table-column>
         <el-table-column label="创建者" align="center" prop="createdBy" width="100" />
         <el-table-column label="创建时间" align="center" prop="createdAt" width="180" />

         <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
               <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:notice:edit']">修改</el-button>
               <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                  v-hasPermi="['system:notice:remove']">删除</el-button>
            </template>
         </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
         v-model:limit="queryParams.pageSize" @pagination="getList" />

      <Edit ref="editRef" @onClose="getList" />
   </div>
</template>

<script setup name="Notice">
import { listNotice, delNotice } from "@/api/system/notice";
import Edit from "./edit.vue";

const { proxy } = getCurrentInstance();

const noticeList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const editRef = ref();
const queryParams = ref({
   pageNum: 1,
   pageSize: 10,
   noticeTitle: undefined,
   createBy: undefined,
   status: undefined,
   belong: "1"
});

/** 查询公告列表 */
function getList() {
   loading.value = true;
   listNotice(queryParams.value).then(response => {
      noticeList.value = response.rows;
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
   ids.value = selection.map(item => item.noticeId);
   single.value = selection.length != 1;
   multiple.value = !selection.length;
}
/** 新增按钮操作 */
function handleAdd() {
   open.value = true;
   editRef.value?.handleAdd()
}
/**修改按钮操作 */
function handleUpdate(row) {
   const noticeId = row.noticeId || ids.value;
   editRef.value?.handleUpdate(noticeId)
}
/** 删除按钮操作 */
function handleDelete(row) {
   const noticeIds = row.noticeId || ids.value
   proxy.$modal.confirm('是否确认删除公告编号为"' + noticeIds + '"的数据项？').then(function () {
      return delNotice(noticeIds);
   }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
   }).catch(() => { });
}

getList();
</script>
