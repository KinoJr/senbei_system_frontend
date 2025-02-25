<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
         <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model="queryParams.menuName" placeholder="请输入菜单名称" clearable style="width: 200px"
               @keyup.enter="handleQuery" />
         </el-form-item>
         <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="菜单状态" clearable style="width: 200px">
               <el-option :label="$t('dict.disable.0')" :value="'1'"></el-option>
               <el-option :label="$t('dict.disable.1')" :value="'0'"></el-option>
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
               v-hasPermi="['system:menu:add']">新增</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button type="info" plain icon="Sort" @click="toggleExpandAll">展开/折叠</el-button>
         </el-col>
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-if="refreshTable" v-loading="loading" :data="menuList" row-key="menuId"
         :default-expand-all="isExpandAll" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" border>
         <template #empty>
            <el-empty description="No Data" />
         </template>
         <el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" width="160"></el-table-column>
         <el-table-column prop="icon" label="图标" align="center" width="100">
            <template #default="scope">
               <svg-icon :icon-class="scope.row.icon" />
            </template>
         </el-table-column>
         <el-table-column prop="orderNum" label="排序" width="60"></el-table-column>
         <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true"></el-table-column>
         <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
         <el-table-column prop="status" label="状态" width="80">
            <template #default="scope">
               <el-tag v-if="scope.row.status == '1'" effect="light">
                  {{ $t('dict.disable.0') }}
               </el-tag>
               <el-tag v-if="scope.row.status == '0'" effect="light" type="danger">
                  {{ $t('dict.disable.1') }}
               </el-tag>
            </template>
         </el-table-column>
         <el-table-column label="创建时间" align="center" width="160" prop="createdAt">
         </el-table-column>
         <el-table-column label="操作" align="center" width="210" class-name="small-padding fixed-width">
            <template #default="scope">
               <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:menu:edit']">修改</el-button>
               <el-button link type="primary" icon="Plus" @click="handleAdd(scope.row)"
                  v-hasPermi="['system:menu:add']">新增</el-button>
               <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                  v-hasPermi="['system:menu:remove']">删除</el-button>
            </template>
         </el-table-column>
      </el-table>

      <Edit ref="editRef" @onClose="getList()" />
   </div>
</template>

<script setup name="Menu">
import { delMenu, listMenu } from "@/api/system/menu";
import SvgIcon from "@/components/SvgIcon";
import Edit from "./edit.vue";

const { proxy } = getCurrentInstance();

const menuList = ref([]);
const loading = ref(true);
const showSearch = ref(false);
const isExpandAll = ref(false);
const refreshTable = ref(true);

const editRef = ref();

const queryParams = ref({
   menuName: undefined,
   visible: undefined
});

/** 查询菜单列表 */
function getList() {
   loading.value = true;
   listMenu(queryParams.value).then(res => {
      const data = res || []
      menuList.value = proxy.handleTree(data, "menuId");
      loading.value = false;
   });
}
/** 搜索按钮操作 */
function handleQuery() {
   getList();
}
/** 重置按钮操作 */
function resetQuery() {
   proxy.resetForm("queryRef");
   handleQuery();
}
/** 展开/折叠操作 */
function toggleExpandAll() {
   refreshTable.value = false;
   isExpandAll.value = !isExpandAll.value;
   nextTick(() => {
      refreshTable.value = true;
   });
}
/** 新增按钮操作 */
function handleAdd(row) {
   editRef.value?.handleAdd(row)
}
/** 修改按钮操作 */
function handleUpdate(row) {
   editRef.value?.handleUpdate(row)
}
/** 删除按钮操作 */
function handleDelete(row) {
   proxy.$modal.confirm('是否确认删除名称为"' + row.menuName + '"的数据项?').then(function () {
      return delMenu(row.menuId);
   }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
   }).catch(() => { });
}

getList();
</script>
