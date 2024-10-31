<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
            <el-form-item label="规格名称" prop="specName">
                <el-input v-model="queryParams.specName" placeholder="请输入规格名称" clearable style="width: 200px"
                    @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="状态" prop="specStatus">
                <el-select v-model="queryParams.specStatus" placeholder="规格状态" clearable style="width: 200px">
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
            <el-col :span="1.5">
                <el-button type="warning" plain icon="Download" @click="handleExport"
                    v-hasPermi="['system:post:export']">导出</el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
            <template #empty>
                <el-empty description="No Data" />
            </template>
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="IMG" width="105" align="center" prop="specImg">
                <template #default="scope">
                    <ImagePreview width="80px" height="80px"
                        :src="scope.row.specImg && scope.row.specImg !== '#' ? baseImg + scope.row.specImg : '#'" />
                </template>
            </el-table-column>
            <el-table-column label="规格ID" align="center" prop="specId" />
            <el-table-column label="规格编号" align="center" prop="specNo" />
            <el-table-column label="规格名称" align="center" prop="specName" />
            <el-table-column label="规格单价" align="center" prop="specPrice" >
                <template #default="scope">
                    {{ (scope.row.specPrice / 100).toFixed(2) }}
                </template>
            </el-table-column>
            <el-table-column label="上架数量" align="center" prop="specNum" />
            <el-table-column label="规格排序" align="center" prop="specSort" />
            <el-table-column label="状态" align="center" prop="specStatus">
                <template #default="scope">
                    <el-tag v-if="scope.row.specStatus == '1'" effect="light">
                        {{ $t('dict.disable.0') }}
                    </el-tag>
                    <el-tag v-if="scope.row.specStatus == '0'" effect="light" type="danger">
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

        <Edit ref="editRef" @onClose="getList" />
    </div>
</template>

<script setup name="Spec">
import { listSpec, delSpec } from "@/api/senbei/spec";
import { onMounted, ref } from "vue";
import Edit from "./specedit.vue";
import { useRoute } from 'vue-router'

const route = useRoute()

const baseImg = import.meta.env.VITE_APP_FILE

const { proxy } = getCurrentInstance();

const dataList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const editRef = ref()

const queryParams = ref({
    pageNum: 1,
    pageSize: 10,
    productId: route.params.productId
});

/** 查询规格列表 */
function getList() {
    loading.value = true;
    listSpec(queryParams.value).then(response => {
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
    ids.value = selection.map(item => item.specId);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
}
/** 新增按钮操作 */
function handleAdd() {
    editRef.value?.handleAdd(Number(route.params.productId))
}
/** 修改按钮操作 */
function handleUpdate(row) {
    const tIds = row.specId || ids.value;
    editRef.value?.handleUpdate(tIds)

}
/** 删除按钮操作 */
function handleDelete(row) {
    const tIds = row.specId || ids.value;
    proxy.$modal.confirm('是否确认删除详情编号为"' + tIds + '"的数据项？').then(function () {
        return delSpec(tIds);
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

onMounted(()=>{
    // console.log("log => ", route.params.productId);
})
getList();
</script>