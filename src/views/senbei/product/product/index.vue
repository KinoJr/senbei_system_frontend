<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
         <el-form-item label="产品分类" prop="productCategoryId">
            <el-select v-model="queryParams.productCategoryId" filterable placeholder="请选择产品分类" style="width: 200px" @change="getOpt">
               <el-option v-for="item in categorys" :key="item.productCategoryId" :label="item.productCategoryName"
                  :value="item.productCategoryId" />
            </el-select>
         </el-form-item>
         <!-- <el-form-item label="产品名称" prop="productId">
            <el-select :disabled="!queryParams.productCategoryId" v-model="queryParams.productId" filterable placeholder="请选择产品名称" style="width: 200px">
               <el-option v-for="(item, index) in productOptions" :key="index" :label="item.productName" :value="item.productId" />
            </el-select>
         </el-form-item> -->
         <el-form-item label="产品名称" prop="productName">
            <el-input v-model="queryParams.productName" placeholder="请输入产品名称" clearable style="width: 200px"
                    @keyup.enter="handleQuery" />
         </el-form-item>

         <el-form-item label="产品类型" prop="productType">
            <el-select v-model="queryParams.productType" placeholder="请选择产品类型" clearable style="width: 200px">
               <el-option label="服务" value="0" />
               <el-option label="商品" value="1" />
            </el-select>
         </el-form-item>
         <el-form-item label="状态" prop="productStatus">
            <el-select v-model="queryParams.productStatus" placeholder="请选择产品状态" clearable style="width: 200px">
               <el-option :label="$t('dict.disable.1')" value="0" />
               <el-option :label="$t('dict.disable.0')" value="1" />
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
         <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
               v-hasPermi="['system:post:remove']">删除</el-button>
         </el-col>
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
         <el-table-column type="index" width="80" />
         <el-table-column label="IMG" width="105" align="center" prop="productImg">
            <template #default="scope">
               <ImagePreview width="80px" height="80px"
                  :src="scope.row.productImg && scope.row.productImg !== '#' ? baseImg + scope.row.productImg : '#'" />
            </template>
         </el-table-column>
         <!-- <el-table-column label="产品ID" align="center" prop="productId" /> -->
         <el-table-column label="产品编号" align="center" prop="productNo">
            <template #default="scope">
               <router-link :to="'/senbei/product/product/spec/' + scope.row.productId" class="link-type">
                  <span>{{ scope.row.productNo }}</span>
               </router-link>
            </template>
         </el-table-column>
         <el-table-column label="产品分类" align="center" prop="productCategoryId">
            <template #default="scope">
               {{ getCategorysName(scope.row.productCategoryId) }}
            </template>
         </el-table-column>
         <el-table-column label="产品类型" align="center" prop="productType">
            <template #default="scope">
               {{ scope.row.productType === "0" ? "服务" : "商品" }}
            </template>
         </el-table-column>
         <el-table-column label="产品名称" align="center" prop="productName" />
         <!-- <el-table-column label="产品排序" align="center" prop="productSort" /> -->
         <el-table-column label="状态" align="center" prop="productStatus">
            <template #default="scope">
               <el-tag v-if="scope.row.productStatus == '1'" effect="light">
                  {{ $t('dict.disable.0') }}
               </el-tag>
               <el-tag v-if="scope.row.productStatus == '0'" effect="light" type="danger">
                  {{ $t('dict.disable.1') }}
               </el-tag>
            </template>
         </el-table-column>
         <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
               <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:post:edit']">修改</el-button>
               <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                  v-hasPermi="['system:post:remove']">删除</el-button>
            </template>
         </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
         v-model:limit="queryParams.pageSize" @pagination="getList" />

      <Edit ref="editRef" @onClose="getList" :categorys="categorys" />
   </div>
</template>

<script setup name="Product">
import { listProduct, delProduct, getProductSelectList } from "@/api/senbei/product";
import { listProductCategory } from "@/api/senbei/productCategory";
import { ref } from "vue";
import Edit from "./edit.vue";

const baseImg = import.meta.env.VITE_APP_FILE

const { proxy } = getCurrentInstance();

const postList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const categorys = ref([]);
const productOptions = ref([]);

const editRef = ref()

const queryParams = ref({
   pageNum: 1,
   pageSize: 20
});

// 获取分类列表
function getCategorys() {
   listProductCategory({ pageNum: 1, pageSize: 20 }).then(response => {
      categorys.value = response.rows;
   });
}

// 获取商品名下拉列表
function getOpt() {
   queryParams.value.productId = undefined
   getProductSelectList(queryParams.value.productCategoryId).then(response => {
      productOptions.value = response;
   });
}

// 根据分类ID获取分类名
function getCategorysName(categoryId) {
   const array = categorys.value
   for (let index = 0; index < array.length; index++) {
      if (array[index].productCategoryId === categoryId) {
         return array[index].productCategoryName
      }
   }
   return "未定义"
}

/** 查询产品列表 */
function getList() {
   loading.value = true;
   getCategorys()
   listProduct(queryParams.value).then(response => {
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
   ids.value = selection.map(item => item.productId);
   single.value = selection.length != 1;
   multiple.value = !selection.length;
}
/** 新增按钮操作 */
function handleAdd() {
   editRef.value?.handleAdd()
}
/** 修改按钮操作 */
function handleUpdate(row) {
   const tIds = row.productId || ids.value;
   editRef.value?.handleUpdate(tIds)

}
/** 删除按钮操作 */
function handleDelete(row) {
   const tIds = row.productId || ids.value;
   proxy.$modal.confirm('是否确认删除详情编号为"' + tIds + '"的数据项？').then(function () {
      return delProduct(tIds);
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
