<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
         <el-form-item label="餐次名称" prop="mealName">
            <el-select v-model="queryParams.mealId" filterable placeholder="请选择餐次名称" style="width: 200px">
                    <el-option v-for="item in options" :key="item.mealId" :label="item.mealName"
                        :value="item.mealId" />
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
            <el-button type="success" plain icon="Edit" :disabled="!mealId" @click="onEdit">修改</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="!mealId" @click="handleDelete">删除</el-button>
         </el-col>
         <!-- <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
               v-hasPermi="['system:post:export']">导出</el-button>
         </el-col> -->
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" border stripe :data="dataList" table-layout="auto">
         <template #empty>
            <el-empty description="No Data" />
         </template>
         <el-table-column fixed label="时段第一周" align="center" prop="part">
            <template #header>
               {{ partTitle }}
            </template>
         </el-table-column>

         <el-table-column label="星期一" align="center" prop="monday">
            <template #default="scope">
               <el-button v-if="!scope.row.monday && isEdit" link type="primary" icon="Edit" @click="handleUpdate(scope.row, 'a')" />
               <div v-for="(item, index) in getStrs(scope.row.monday)" :key="index">
                  {{ item }} <el-button v-if="index === 0 && isEdit" link type="primary" icon="Edit" @click="handleUpdate(scope.row, 'a')" /><br>
               </div>
            </template>
         </el-table-column>
         <el-table-column label="星期二" align="center" prop="tuesday">
            <template #default="scope">
               <el-button v-if="!scope.row.tuesday && isEdit" link type="primary" icon="Edit" @click="handleUpdate(scope.row, 'b')" />
               <div v-for="(item, index) in getStrs(scope.row.tuesday)" :key="index">
                  {{ item }} <el-button v-if="index === 0 && isEdit" link type="primary" icon="Edit" @click="handleUpdate(scope.row, 'b')" /> <br>
               </div>
            </template>
         </el-table-column>
         <el-table-column label="星期三" align="center" prop="wednesday">
            <template #default="scope">
               <el-button v-if="!scope.row.wednesday && isEdit" link type="primary" icon="Edit" @click="handleUpdate(scope.row, 'c')" />
               <div v-for="(item, index) in getStrs(scope.row.wednesday)" :key="index">
                  {{ item }} <el-button v-if="index === 0 && isEdit" link type="primary" icon="Edit" @click="handleUpdate(scope.row, 'c')" /> <br>
               </div>
            </template>
         </el-table-column>
         <el-table-column label="星期四" align="center" prop="thursday">
            <template #default="scope">
               <el-button v-if="!scope.row.thursday && isEdit" link type="primary" icon="Edit" @click="handleUpdate(scope.row, 'd')" />
               <div v-for="(item, index) in getStrs(scope.row.thursday)" :key="index">
                  {{ item }} <el-button v-if="index === 0 && isEdit" link type="primary" icon="Edit" @click="handleUpdate(scope.row, 'd')" /><br>
               </div>
            </template>
         </el-table-column>
         <el-table-column label="星期五" align="center" prop="friday">
            <template #default="scope">
               <el-button v-if="!scope.row.friday && isEdit" link type="primary" icon="Edit" @click="handleUpdate(scope.row, 'e')" />
               <div v-for="(item, index) in getStrs(scope.row.friday)" :key="index">
                  {{ item }} <el-button v-if="index === 0 && isEdit" link type="primary" icon="Edit" @click="handleUpdate(scope.row, 'e')" /><br>
               </div>
            </template>
         </el-table-column>
         <el-table-column label="星期六" align="center" prop="saturday">
            <template #default="scope">
               <el-button v-if="!scope.row.saturday && isEdit" link type="primary" icon="Edit" @click="handleUpdate(scope.row, 'f')" />
               <div v-for="(item, index) in getStrs(scope.row.saturday)" :key="index">
                  {{ item }} <el-button v-if="index === 0 && isEdit" link type="primary" icon="Edit" @click="handleUpdate(scope.row, 'f')" /><br>
               </div>
            </template>
         </el-table-column>
         <el-table-column label="星期日" align="center" prop="sunday">
            <template #default="scope">
               <el-button v-if="!scope.row.sunday && isEdit" link type="primary" icon="Edit" @click="handleUpdate(scope.row, 'g')" />
               <div v-for="(item, index) in getStrs(scope.row.sunday)" :key="index">
                  {{ item }} <el-button v-if="index === 0 && isEdit" link type="primary" icon="Edit" @click="handleUpdate(scope.row, 'g')" /><br>
               </div>
            </template>
         </el-table-column>

         <!-- <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
               <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:post:edit']">修改</el-button>
               <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                  v-hasPermi="['system:post:remove']">删除</el-button>
            </template>
         </el-table-column> -->
      </el-table>

      <Edit ref="editRef" @onClose="getList" />
   </div>
</template>

<script setup name="Post">
import { listMeal, delMeal, getMealSelect } from "@/api/senbei/meal";
import { ref } from "vue";
import Edit from "./edit.vue";

const { proxy } = getCurrentInstance();

const mealId = ref()
const partTitle = ref("未知")
const options = ref([])
const dataList = ref([]);
const loading = ref(true);
const showSearch = ref(false);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);

const editRef = ref()

const queryParams = ref({
   pageNum: 1,
   pageSize: 1,
});

const isEdit = ref(false);
function onEdit() {
   isEdit.value = !isEdit.value
}

function getStrs(str, e) {
   if (e) {
      console.log("eeee=>", e);
   }

   let l = []
   if (str) {
      l = str.split(',')
   }
   return l
}

/** 查询分类列表 */
function getList() {
   // isEdit.value = false
   loading.value = true;
   getMealSelect().then(response => {
      options.value = response
   })
   if (queryParams.value.mealId) {
      queryParams.value.mealStatus = undefined
   } else {
      queryParams.value.mealStatus = "1"
   }
   listMeal(queryParams.value).then(response => {
      loading.value = false;
      const data = response.rows || []
     
      const ls = []
      ls.push({
         id: data[0]?.mealId,
         rowKey: 0,
         part: "早餐"
      })
      ls.push({
         id: data[0]?.mealId,
         rowKey: 1,
         part: "加餐"
      })
      ls.push({
         id: data[0]?.mealId,
         rowKey: 2,
         part: "午餐"
      })
      ls.push({
         id: data[0]?.mealId,
         rowKey: 3,
         part: "加餐"
      })
      ls.push({
         id: data[0]?.mealId,
         rowKey: 4,
         part: "晚餐"
      })
      ls.push({
         id: data[0]?.mealId,
         rowKey: 5,
         part: "加餐"
      })
      
      mealId.value = data[0]?.mealId
      partTitle.value = data[0]?.mealName
      if (data[0]?.mealContent) {
         handleData(ls, data[0].mealContent, data[0].mealId)
      }
      dataList.value = ls
   });
   // 拿到json
   // 解析json
   // const jsonStr = ""

   // const obj = JSON.parse(jsonStr)
   // obj.name


   loading.value = false;
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
   ids.value = selection.map(item => item.productCategoryId);
   single.value = selection.length != 1;
   multiple.value = !selection.length;
}
/** 新增按钮操作 */
function handleAdd() {
   editRef.value?.handleAdd()
}
/** 修改按钮操作 */
function handleUpdate(row, e) {
   editRef.value?.handleUpdate(row.id, e, row.rowKey)

}
/** 删除按钮操作 */
function handleDelete(row) {
   proxy.$modal.confirm('是否确认删除分类编号为"' + mealId.value + '"的数据项？').then(function () {
      return delMeal(mealId.value);
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

function handleData(ls, jsonStr) {
   const obj = JSON.parse(jsonStr)
   for (let item in obj) {
      const t = item.split("_")
      const idx = Number(t[1]);
      const o = ls[idx]

      switch (t[0]) {
         case "a":
            o.monday = obj[item]
            break
         case "b":
            o.tuesday = obj[item]
            break
         case "c":
            o.wednesday = obj[item]
            break
         case "d":
            o.thursday = obj[item]
            break
         case "e":
            o.friday = obj[item]
            break
         case "f":
            o.saturday = obj[item]
            break
         case "g":
            o.sunday = obj[item]
            break
      }
   }
}

getList();
</script>
<style lang="scss" scoped></style>