<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
         <el-form-item label="产品分类" prop="productCategoryId">
            <el-select v-model="queryParams.productCategoryId" filterable placeholder="请选择产品分类" style="width: 200px"
               @change="getProductOpt">
               <el-option v-for="item in categorys" :key="item.productCategoryId" :label="item.productCategoryName"
                  :value="item.productCategoryId" />
            </el-select>
         </el-form-item>
         <el-form-item label="产品名称" prop="productId">
            <el-select v-model="queryParams.productId" filterable placeholder="请选择产品名称" style="width: 200px"
               @change="getSpecOpt">
               <el-option v-for="(item, index) in productOptions" :key="index" :label="item.productName"
                  :value="item.productId" />
            </el-select>
         </el-form-item>
         <el-form-item label="规格名称" prop="specId">
            <el-select v-model="queryParams.specId" filterable placeholder="请选择规格名称" style="width: 200px">
               <el-option v-for="(item, index) in specOptions" :key="index" :label="item.specName"
                  :value="item.specId" />
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

      <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
         <template #empty>
            <el-empty description="No Data" />
         </template>
         <el-table-column type="selection" width="55" align="center" />
         <el-table-column label="序号" type="index" width="80" />
         <!-- <el-table-column label="采购ID" align="center" prop="storeId" /> -->
         <el-table-column label="产品名称" align="center" prop="productName" />
         <el-table-column label="产品规格" align="center" prop="specName" />
         <el-table-column label="变动库存" align="center" prop="storeNum" />
         <el-table-column label="变动前库存" align="center" prop="storeBeforeNum" />
         <el-table-column label="变动后库存" align="center" prop="storeAfterNum" />
         <el-table-column label="采购状态" align="center" prop="storeType">
            <template #default="scope">
               <el-tag v-if="scope.row.storeType == '0'" effect="success">
                  入库
               </el-tag>
               <el-tag v-if="scope.row.storeType == '1'" effect="light" type="warning">
                  出库
               </el-tag>
               <el-tag v-if="scope.row.storeType == '2'" effect="light" type="danger">
                  损坏
               </el-tag>
            </template>
         </el-table-column>
         <el-table-column label="创建时间" align="center" prop="createdAt" width="180" />
         <el-table-column label="创建者" align="center" prop="createdBy" />
         <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
               <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:post:edit']">修改</el-button>
               <!-- <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                  v-hasPermi="['system:post:remove']">删除</el-button> -->
            </template>
         </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
         v-model:limit="queryParams.pageSize" @pagination="getList" />

      <Edit ref="editRef" @onClose="getList" />

      <Products ref="productsRef" @onClose="getList" @onSubmit="getList" />
   </div>
</template>

<script setup name="Store">
import { listStore, delStore } from "@/api/senbei/store";
import { listProductCategory } from "@/api/senbei/productCategory";
import { getProductSelectList } from "@/api/senbei/product";
import { getSpecSelectList } from "@/api/senbei/spec";
import { ref } from "vue";
import Edit from "./edit.vue";
import Products from "../store/products.vue";

const { proxy } = getCurrentInstance();

const postList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const editRef = ref()
const productsRef = ref()

const queryParams = ref({
   pageNum: 1,
   pageSize: 20,
   storeType: "2",
});

const categorys = ref([]);
const productOptions = ref([]);
const specOptions = ref([]);

function getProductOpt() {
   queryParams.value.productId = undefined
   queryParams.value.specId = undefined
   getProductSelectList(queryParams.value.productCategoryId).then(response => {
      productOptions.value = response;
   });
}

function getSpecOpt() {
   queryParams.value.specId = undefined
   getSpecSelectList(queryParams.value.productId).then(response => {
      specOptions.value = response;
   });
}

/** 查询采购列表 */
function getList() {
   loading.value = true;
   listProductCategory({ pageNum: 1, pageSize: 20 }).then(response => {
      categorys.value = response.rows;
   });
   listStore(queryParams.value).then(response => {
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
   ids.value = selection.map(item => item.storeId);
   single.value = selection.length != 1;
   multiple.value = !selection.length;
}
/** 新增按钮操作 */
function handleAdd() {
   productsRef.value?.handleShow("2")
}
/** 修改按钮操作 */
function handleUpdate(row) {
   const tIds = row.storeId || ids.value;
   editRef.value?.handleUpdate(tIds)
}
/** 删除按钮操作 */
function handleDelete(row) {
   const tIds = row.storeId || ids.value;
   proxy.$modal.confirm('是否确认删除采购编号为"' + tIds + '"的数据项？').then(function () {
      return delStore(tIds);
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
