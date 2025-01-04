<template>
    <!-- 添加或修改套餐对话框 -->
    <el-dialog :title="title" v-model="open" width="90%" style="max-width: 800px;" append-to-body
        :destroy-on-close="true">
        <!-- <el-divider content-position="left">套餐信息</el-divider> -->
        <el-form ref="formRef" :model="form" :rules="rules">
            <!-- <el-form-item v-if="form.comboId" label="创建时间" prop="createdAt">
                {{ form.createdAt }}
            </el-form-item> -->
            <el-form-item label="套餐名称" prop="comboName">
                <el-input v-model="form.comboName" placeholder="请输入套餐名称" disabled/>
            </el-form-item>
            <!-- <el-form-item label="套餐状态" prop="comboStatus">
                <el-select v-model="form.comboStatus" placeholder="请选择套餐状态" style="width: 200px">
                    <el-option label="禁用" value="0" />
                    <el-option label="正常" value="1" />
                </el-select>
            </el-form-item> -->
            <!-- <el-form-item label="套餐顺序" prop="comboSort">
                <el-input-number v-model="form.comboSort" controls-position="right" :min="0" :max="9999" :step="1"
                    step-strictly />
            </el-form-item> -->
            <el-form-item label="套餐描述" prop="comboDescribe">
                <el-input v-model="form.comboDescribe" type="textarea" placeholder="请输入套餐描述" disabled/>
            </el-form-item>
            <!-- <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
            </el-form-item> -->
            <el-form-item label="套餐总额(¥)" prop="comboSum">
                <el-text type="danger">{{ (form.comboSum / 100).toFixed(2) }}</el-text>
            </el-form-item>
        </el-form>

        <div class="custom-style">
            <el-segmented v-model="value" :options="options" />
        </div>

        <el-table v-show="value === '1'" v-loading="specLoading" :data="comboList" border>
            <template #empty>
                <el-empty description="No Data" />
            </template>
            <el-table-column label="IMG" width="105" align="center" prop="specImg">
                <template #default="scope">
                    <ImagePreview width="80px" height="80px"
                        :src="scope.row.specImg && scope.row.specImg !== '#' ? baseImg + scope.row.specImg : '#'" />
                </template>
            </el-table-column>
            <!-- <el-table-column label="规格ID" align="center" prop="specId" /> -->
            <el-table-column label="产品规格" align="center" prop="specName">
                <template #default="scope">
                    {{ scope.row.productName + "(" + scope.row.specName + ")" }}
                </template>
            </el-table-column>
            <el-table-column label="产品单价" align="center" prop="comboListPrice">
                <template #default="scope">
                    {{ (scope.row.comboListPrice / 100).toFixed(2) }}
                </template>
            </el-table-column>
            <el-table-column label="实际单价" align="center" prop="comboListPrice">
                <template #default="scope">
                    {{ (scope.row.comboListPrice / 100).toFixed(2) }}
                </template>
            </el-table-column>
            <el-table-column label="购买数量" align="center" prop="comboListNum" />
            <el-table-column label="合计(¥)" align="center" prop="comboListSum">
                <template #default="scope">
                    {{ (scope.row.comboListSum / 100).toFixed(2) }}
                </template>
            </el-table-column>
        </el-table>

        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 认</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup name="ComboDialog">
import { ref } from 'vue';
import { getCombo } from "@/api/senbei/combo";
import { listComboList } from "@/api/senbei/comboList";

const baseImg = import.meta.env.VITE_APP_FILE

// const props = defineProps(["userOptions"]);
const { proxy } = getCurrentInstance();
const emits = defineEmits(["onClose"]);

const open = ref(false);
const title = ref("");
const form = ref({});
const rules = {
    comboName: [{ required: true, message: "套餐名称不能为空", trigger: "blur" }],
    comboSort: [{ required: true, message: "套餐顺序不能为空", trigger: "blur" }],
    comboStatus: [{ required: true, message: "套餐状态不能为空", trigger: "blur" }],
};

const value = ref('1')
const options = ref([{
    label: '套餐内容',
    value: '1',
},
])

const comboList = ref([]);
const specLoading = ref(false);
watch(comboList, (newValue, OldValue) => {
    let heji = 0
    for (let item of comboList.value) {
        heji = heji + item.comboListSum
    }
    form.value.comboSum = heji
}, {
    deep: true // 监听数组时必须设置
})

// 获取清单产品列表
function getComboSpec(comboId) {
    specLoading.value = true;
    listComboList({ pageNum: 1, pageSize: 100, comboId: comboId }).then(response => {
        comboList.value = response.rows || [];
        specLoading.value = false;
    });
}

/** 修改按钮操作 */
function handleUpdate(comboId) {
    reset();
    getCombo(comboId).then(response => {
        form.value = response;
        open.value = true;
        title.value = "选择套餐";
    });
    // 获取关联的产品清单
    getComboSpec(comboId)
}
/** 提交按钮 */
function submitForm() {
    open.value = false;
    emits("onSubmit", comboList.value)
}
/** 取消按钮 */
function cancel() {
    open.value = false;
    reset();
}
/** 表单重置 */
function reset() {
    value.value = "1"
    comboList.value = []
    form.value = {
        comboId: undefined,
        comboName: undefined,
        comboSum: 0,
        comboSort: 0,
        comboStatus: "1",
    };
    proxy.resetForm("postRef");
}

defineExpose({
    handleUpdate
})
</script>

<style scoped>
.custom-style .el-segmented {
    --el-segmented-item-selected-color: var(--el-text-color-primary);
    --el-segmented-item-selected-bg-color: #ffd100;
    --el-border-radius-base: 16px;
    margin-bottom: 10px;
}
</style>