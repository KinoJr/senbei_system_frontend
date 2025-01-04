<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
         <el-form-item label="楼层" prop="roomFloor">
            <el-input v-model="queryParams.roomFloor" placeholder="请输入楼层" clearable style="width: 200px"
               @keyup.enter="handleQuery" />
         </el-form-item>
         <el-form-item label="房间编号" prop="roomNo">
            <el-input v-model="queryParams.roomNo" placeholder="请输入房间编号" clearable style="width: 200px"
               @keyup.enter="handleQuery" />
         </el-form-item>
         <el-form-item label="房间名称" prop="roomName">
            <el-input v-model="queryParams.roomName" placeholder="请输入房间名称" clearable style="width: 200px"
               @keyup.enter="handleQuery" />
         </el-form-item>
         <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="房间状态" clearable style="width: 200px">
               <el-option label="停用" value="0" />
               <el-option label="可用" value="1" />
               <el-option label="维修中" value="2" />
            </el-select>
         </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
         </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
         </el-col>
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

      <el-table v-loading="loading" :data="roomList" @selection-change="handleSelectionChange" border>
         <template #empty="">
            <el-empty description="暂无数据，去录入一些数据吧~" />
         </template>
         <el-table-column type="selection" width="55" align="center" />
         <el-table-column label="序号" type="index" width="80" />
         <!-- <el-table-column label="房间ID" align="center" prop="roomId" /> -->
         <el-table-column label="楼层" align="center" prop="roomFloor" />
         <el-table-column label="房间编号" align="center" prop="roomNo" />
         <el-table-column label="房间名称" align="center" prop="roomName" />
         <el-table-column label="房间排序" align="center" prop="roomSort" />
         <el-table-column label="状态" align="center" prop="status">
            <template #default="scope">
               <el-tag v-if="scope.row.status == '0'" effect="light" type="danger">
                  停用
               </el-tag>
               <el-tag v-if="scope.row.status == '1'" effect="light">
                  可用
               </el-tag>
               <el-tag v-if="scope.row.status == '2'" effect="light" type="warning">
                  维修中
               </el-tag>
               <el-tag v-if="scope.row.archivalNo != '-' && scope.row.archivalNo" effect="light" type="success" style="margin-left: 5px;">
                  已入住
               </el-tag>
            </template>
         </el-table-column>
         <el-table-column label="关联档案" align="center" prop="archivalNo" />
         <el-table-column label="创建时间" align="center" prop="createdAt" width="180" />
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

<script setup name="Room">
import { listRoom, delRoom } from "@/api/senbei/room";
import { ref } from "vue";
import Edit from "./edit.vue";

const { proxy } = getCurrentInstance();

const roomList = ref([]);
const loading = ref(true);
const showSearch = ref(false);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);

const editRef = ref()

const total = ref(0);
const queryParams = ref({
   pageNum: 1,
   pageSize: 20,
});

/** 查询房间列表 */
function getList() {
   loading.value = true;
   listRoom(queryParams.value).then(response => {
      roomList.value = response.rows;
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
   ids.value = selection.map(item => item.roomId);
   single.value = selection.length != 1;
   multiple.value = !selection.length;
}
/** 新增按钮操作 */
function handleAdd() {
   editRef.value?.handleAdd()
}
/** 修改按钮操作 */
function handleUpdate(row) {
   const roomId = row.roomId || ids.value;
   editRef.value?.handleUpdate(roomId)

}
/** 删除按钮操作 */
function handleDelete(row) {
   const roomIds = row.roomId || ids.value;
   proxy.$modal.confirm('是否确认删除房间编号为"' + roomIds + '"的数据项？').then(function () {
      return delRoom(roomIds);
   }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
   }).catch(() => { });
}
/** 导出按钮操作 */
function handleExport() {
   proxy.download("senbei/room/export", {
      ...queryParams.value
   }, `room_${new Date().getTime()}.xlsx`);
}

getList();
</script>
