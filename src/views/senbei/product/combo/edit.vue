<template>
    <!-- 添加或修改套餐对话框 -->
    <el-dialog :title="title" v-model="open" width="90%" style="max-width: 800px;" append-to-body
        :destroy-on-close="true">
        <!-- <el-divider content-position="left">套餐信息</el-divider> -->
        <el-form ref="formRef" :model="form" :rules="rules">
            <el-form-item v-if="form.comboId" label="创建时间" prop="createdAt">
                {{ form.createdAt }}
            </el-form-item>
            <el-form-item label="套餐名称" prop="comboName">
                <el-input v-model="form.comboName" placeholder="请输入套餐名称" />
            </el-form-item>
            <el-form-item label="套餐状态" prop="comboStatus">
                <el-select v-model="form.comboStatus" placeholder="请选择套餐状态" style="width: 200px">
                    <el-option label="禁用" value="0" />
                    <el-option label="正常" value="1" />
                </el-select>
            </el-form-item>
            <el-form-item label="套餐顺序" prop="comboSort">
                <el-input-number v-model="form.comboSort" controls-position="right" :min="0" :max="9999" :step="1"
                    step-strictly />
            </el-form-item>
            <el-form-item label="套餐描述" prop="comboDescribe">
                <el-input v-model="form.comboDescribe" type="textarea" placeholder="请输入套餐描述" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
            </el-form-item>
            <el-form-item label="套餐总额(¥)" prop="comboSum">
                <el-text type="danger">{{ (form.comboSum / 100).toFixed(2) }}</el-text>
            </el-form-item>
        </el-form>

        <div class="custom-style">
            <el-segmented v-model="value" :options="options" />
        </div>

        <el-table v-show="value === '1'" v-loading="specLoading" :data="comboList">
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
            <el-table-column label="产品单价" align="center" prop="specPrice">
                <template #default="scope">
                    {{ (scope.row.specPrice / 100).toFixed(2) }}
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
            <el-table-column width="180" align="center" class-name="small-padding fixed-width">
                <template #header>
                    <el-button type="primary" round @click="onOpenBatchForm">
                        批量
                    </el-button>
                    <el-button type="primary" round @click="showProducts">
                        添加<el-icon class="el-icon--right">
                            <Plus />
                        </el-icon>
                    </el-button>
                </template>
                <template #default="scope">
                    <el-button link type="primary" icon="Edit" @click="handleRowUpdate(scope.row)"
                        v-hasPermi="['system:post:edit']">修改</el-button>
                    <el-button link type="primary" icon="Delete" @click="handleRowDelete(scope.row)"
                        v-hasPermi="['system:post:remove']">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="submitForm">提 交</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </template>
    </el-dialog>

    <!-- 产品/服务对话框 -->
    <el-dialog :title="rowform.productName + '(' + rowform.specName + ')'" v-model="rowOpen" width="90%"
        style="max-width: 800px;" append-to-body :destroy-on-close="true" :close-on-press-escape="false">
        <el-form ref="rowFormRef" :model="rowform">
            <el-form-item label="产品单价(¥)" prop="specPrice">
                {{ (rowform.specPrice / 100).toFixed(2) }}
            </el-form-item>
            <el-form-item label="实际单价(¥)" prop="comboListPrice">
                <el-input-number v-model="comboListPrice" controls-position="right" :min="0" @change="buyNumChange"
                    :step="0.01" step-strictly />
            </el-form-item>
            <el-form-item label="数量" prop="comboListNum">
                <el-input-number v-model="rowform.comboListNum" controls-position="right" :min="1"
                    @change="buyNumChange" :step="1" step-strictly />
            </el-form-item>
            <el-form-item label="合计(¥)" prop="comboListSum">
                {{ (rowform.comboListSum / 100).toFixed(2) }}
                <!-- <el-input-number v-model="rowform.comboListSum" controls-position="right" :min="0" disabled /> -->
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="submitRowForm">确 定</el-button>
            </div>
        </template>
    </el-dialog>

    <!-- 批量修改对话框 -->
    <el-dialog title="批修改实际单价" v-model="batchOpen" width="90%"
        style="max-width: 800px;" append-to-body :destroy-on-close="true" :close-on-press-escape="false">
        <el-form ref="batchFormRef" :model="batchForm">
            <el-form-item label="变更单价(¥)" prop="price">
                <el-input-number v-model="batchForm.price" controls-position="right" :min="0"
                    :step="0.01" step-strictly />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="submitBatchForm">确 定</el-button>
            </div>
        </template>
    </el-dialog>

    <Products ref="productsRef" @onClose="onSpecClose" @onSubmit="onSpecSubmit" />
</template>
<script setup name="edit">
import { ref } from 'vue';
import { getCombo, createOrUpdate } from "@/api/senbei/combo";
import { listComboList, delComboList } from "@/api/senbei/comboList";
import Products from "./products.vue";

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

const rowOpen = ref(false);
const rowform = ref({});
const comboListPrice = ref(0);

const batchOpen = ref(false)
const batchFormRef = ref()
const batchForm = ref({
    price: 0
});


const value = ref('1')
const options = ref([{
    label: '套餐内容',
    value: '1',
},
    // {
    //     label: '请款记录',
    //     value: '2',
    // }
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

// 打开批量修改
function onOpenBatchForm() {
    batchForm.value.price = 0
    batchOpen.value = true
}
// 批量修改价格
function submitBatchForm() {
    for (let item of comboList.value) {
        item.comboListPrice = batchForm.value.price * 100
        item.comboListSum = item.comboListPrice * item.comboListNum
    }
    batchOpen.value = false
}

// 获取清单产品列表
function getComboSpec(comboId) {
    specLoading.value = true;
    listComboList({ pageNum: 1, pageSize: 100, comboId: comboId }).then(response => {
        comboList.value = response.rows || [];
        specLoading.value = false;
    });
}

const productsRef = ref();
function showProducts() {
    productsRef.value?.handleShow()
}

function buyNumChange(e) {
    rowform.value.comboListPrice = comboListPrice.value * 100
    rowform.value.comboListSum = rowform.value.comboListPrice * rowform.value.comboListNum
}

function onSpecClose() {

}
function onSpecSubmit(e) {
    comboList.value.push({
        specImg: e.specImg,
        specId: e.specId,
        productName: e.productName,
        specName: e.specName,
        comboListPrice: e.specPrice,
        comboListNetPrice: e.specPrice,
        comboListNum: e.buyNum,
        comboListSum: e.buySum,
        comboListStatus: "0",
    })
}

// 行操作
function handleRowUpdate(row) {
    comboListPrice.value = row.comboListPrice / 100
    rowform.value = row
    rowOpen.value = true
}
function handleRowDelete(row) {
    // 判断是否需要删除数据库
    if (row.comboListId && row.comboListId != 0) {
        delComboList(row.comboListId).then(response => {
            const index = comboList.value.indexOf(row)
            if (index !== -1) {
                comboList.value.splice(index, 1)
            }
        });
    } else {
        const index = comboList.value.indexOf(row)
        if (index !== -1) {
            comboList.value.splice(index, 1)
        }
    }
}
function submitRowForm() {
    rowOpen.value = false
}

/** 新增按钮操作 */
function handleAdd() {
    reset();
    open.value = true;
    title.value = "添加套餐";
}
/** 修改按钮操作 */
function handleUpdate(comboId) {
    reset();
    getCombo(comboId).then(response => {
        form.value = response;
        open.value = true;
        title.value = "修改套餐";
    });
    // 获取关联的产品清单
    getComboSpec(comboId)
}
/** 提交按钮 */
function submitForm() {
    proxy.$refs["formRef"].validate(valid => {
        if (valid) {
            if (comboList.value.length < 1) {
                proxy.$modal.msgError("请购买商品/服务");
                return
            }
            form.value.comboList = comboList.value
            createOrUpdate(form.value).then(response => {
                proxy.$modal.msgSuccess("操作成功");
                open.value = false;
                emits("onClose")
            });
        }
    });
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
    rowform.value = {}
    proxy.resetForm("rowFormRef");
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
    handleAdd,
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