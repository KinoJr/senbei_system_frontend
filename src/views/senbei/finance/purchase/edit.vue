<template>
    <!-- 添加或修改采购对话框 -->
    <el-dialog :title="title" v-model="open" width="90%" style="max-width: 800px;" append-to-body
        :destroy-on-close="true">
        <!-- <el-divider content-position="left">采购信息</el-divider> -->
        <el-form ref="formRef" :model="form" :rules="rules">
            <el-form-item v-if="form.purchaseId" label="采购编号" prop="purchaseNo">
                <el-input v-model="form.purchaseNo" placeholder="请输入采购编号" disabled />
            </el-form-item>
            <el-form-item v-if="form.purchaseId" label="创建时间" prop="createdAt">
                {{ form.createdAt }}
            </el-form-item>
            <el-form-item label="采购编号(摘)" prop="purchaseExtractNo">
                <el-input v-model="form.purchaseExtractNo" placeholder="请输入采购编号(摘)" />
            </el-form-item>
            <el-form-item label="采购时间(摘)" prop="purchaseExtractTime">
                <el-date-picker v-model="form.purchaseExtractTime" type="datetime" format="YYYY-MM-DD HH:mm:ss"
                    value-format="YYYY-MM-DD HH:mm:ss" date-format="YYYY-MM-DD HH:mm:ss" time-format="HH:mm:ss"
                    placeholder="请选择采购时间(摘)" />
            </el-form-item>
            <el-form-item label="采购总额(¥)" prop="purchaseSum">
                <el-text type="danger">{{ (form.purchaseSum / 100).toFixed(2) }}</el-text>
            </el-form-item>

            <!-- （0创建 1进行中 2已完成 3已取消 4已锁定） -->
            <el-form-item label="采购状态" prop="purchaseStatus">
                <el-select v-model="form.purchaseStatus" placeholder="请选择采购状态" style="width: 200px"
                    :disabled="!form.purchaseId || form.purchaseSettlement === '1'">
                    <el-option label="已创建" value="0" />
                    <el-option label="进行中" value="1" />
                    <el-option label="已完成" value="2" />
                    <el-option label="已取消" value="3" />
                    <el-option label="已锁定" value="4" />
                </el-select>
            </el-form-item>
            <el-form-item label="归档入库" prop="purchaseSettlement">
                <el-select v-model="form.purchaseSettlement" placeholder="请选择是否归档状态"
                    style="width: 200px;margin-right: 5px;" disabled>
                    <el-option label="否" value="0" />
                    <el-option label="是" value="1" />
                </el-select>

            </el-form-item>
        </el-form>

        <div class="custom-style">
            <el-segmented v-model="value" :options="options" />
        </div>

        <el-table v-show="value === '1'" v-loading="specLoading" :data="purchaseList">
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
            <el-table-column label="产品单价" align="center" prop="purchaseListPrice">
                <template #default="scope">
                    {{ (scope.row.purchaseListPrice / 100).toFixed(2) }}
                </template>
            </el-table-column>
            <el-table-column label="实际单价" align="center" prop="purchaseListNetPrice">
                <template #default="scope">
                    {{ (scope.row.purchaseListNetPrice / 100).toFixed(2) }}
                </template>
            </el-table-column>
            <el-table-column label="购买数量" align="center" prop="purchaseListNum" />
            <el-table-column label="合计(¥)" align="center" prop="purchaseListSum">
                <template #default="scope">
                    {{ (scope.row.purchaseListSum / 100).toFixed(2) }}
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center" prop="purchaseListStatus">
                <template #default="scope">
                    <el-tag v-if="scope.row.purchaseListStatus === '0'" effect="light">
                        已创建
                    </el-tag>
                    <el-tag v-if="scope.row.purchaseListStatus === '1'" effect="light" type="warning">
                        进行中
                    </el-tag>
                    <el-tag v-if="scope.row.purchaseListStatus === '2'" effect="light" type="success">
                        已完成
                    </el-tag>
                    <el-tag v-if="scope.row.purchaseListStatus === '3'" effect="light" type="danger">
                        已取消
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column width="180" align="center" class-name="small-padding fixed-width">
                <template #header>
                    <el-button type="primary" round @click="showProducts" :disabled="form.purchaseSettlement === '1'">
                        添加<el-icon class="el-icon--right">
                            <Plus />
                        </el-icon>
                    </el-button>
                </template>
                <template #default="scope">
                    <el-button link type="primary" icon="Edit" @click="handleRowUpdate(scope.row)"
                        v-hasPermi="['system:post:edit']">修改</el-button>
                    <el-button v-if="scope.row.purchaseListStatus === '0'" link type="primary" icon="Delete"
                        @click="handleRowDelete(scope.row)" v-hasPermi="['system:post:remove']">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="value === '2'">
            <div style="width: 100%; text-align: right;">
                <el-button v-if="form.purchaseId" type="primary" round @click="addPay()">
                    添加
                    <el-icon class="el-icon--right">
                        <Plus />
                    </el-icon>
                </el-button>
            </div>

            <el-timeline>
                <el-scrollbar height="400px">
                    <el-timeline-item :timestamp="item.createdAt" placement="top" v-for="(item, index) in paymentList"
                        :key="index">
                        <el-card>
                            请款编号: <el-button type="success" link @click="editPay(item)"> {{ item.paymentNo }}
                            </el-button>
                            <p>请款金额: {{ item.paymentAmount / 100 }}</p>
                            <p>支付状态: {{ getPaymentStatusStr(item.paymentStatus) }}</p>
                            <p>备注: {{ item.remark }}</p>
                            <p>创建者: {{ item.updatedBy }}</p>
                            <p>请款时间: {{ item.createdAt }}</p>
                        </el-card>
                    </el-timeline-item>
                </el-scrollbar>
            </el-timeline>
        </div>

        <template #footer>
            <div class="dialog-footer">
                <el-button v-if="form.purchaseStatus === '2' && form.purchaseSettlement === '0'" type="primary"
                    @click="addStore()" :disabled="hasUnfinished">
                    一键入库
                </el-button>
                <el-button v-if="form.purchaseSettlement === '0'" type="primary" @click="submitForm">提 交</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </template>
    </el-dialog>

    <!-- 产品/服务对话框 -->
    <el-dialog :title="rowform.productName + '(' + rowform.specName + ')'" v-model="rowOpen" width="90%"
        style="max-width: 800px;" append-to-body :destroy-on-close="true" :close-on-press-escape="false">
        <el-form ref="rowFormRef" :model="rowform">
            <el-form-item label="产品单价(¥)" prop="purchaseListPrice">
                {{ (rowform.purchaseListPrice / 100).toFixed(2) }}
            </el-form-item>
            <el-form-item label="实际单价(¥)" prop="purchaseListNetPrice">
                <el-input-number v-model="purchaseListNetPrice" controls-position="right" :min="0"
                    @change="buyNumChange" :step="0.01" step-strictly />
            </el-form-item>
            <el-form-item label="数量" prop="purchaseListNum">
                <el-input-number v-model="rowform.purchaseListNum" controls-position="right" :min="1"
                    @change="buyNumChange" :step="1" step-strictly />
            </el-form-item>
            <el-form-item label="合计(¥)" prop="purchaseListSum">
                {{ (rowform.purchaseListSum / 100).toFixed(2) }}
                <!-- <el-input-number v-model="rowform.purchaseListSum" controls-position="right" :min="0" disabled /> -->
            </el-form-item>
            <el-form-item label="状态" prop="purchaseListStatus">
                <el-select v-model="rowform.purchaseListStatus" placeholder="状态" style="width: 200px"
                    :disabled="!rowform.purchaseListId">
                    <el-option label="已创建" value="0" disabled />
                    <el-option label="进行中" value="1" />
                    <el-option label="已完成" value="2" />
                    <el-option label="已取消" value="3" />
                </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input v-model="rowform.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="submitRowForm">确 定</el-button>
            </div>
        </template>
    </el-dialog>

    <!-- 付款对话框 -->
    <el-dialog :title="payform.paymentNo ? '付款编辑:' + payform.paymentNo : '付款编辑'" v-model="payOpen" width="90%"
        style="max-width: 800px;" append-to-body :destroy-on-close="true" :close-on-press-escape="false"
        @close="onPayClose">
        <el-form ref="payFormRef" :model="payform">
            <el-form-item label="支付金额(¥)" prop="paymentAmount">
                <el-input-number v-model="paymentAmount" controls-position="right" :min="0" :max="99999"
                    @change="bayNumChange" :step="0.01" step-strictly />
            </el-form-item>
            <el-form-item v-if="payform.paymentId" label="支付状态" prop="paymentStatus">
                <el-select v-model="payform.paymentStatus" placeholder="状态" style="width: 200px"
                    :disabled="!payform.paymentId">
                    <el-option label="待支付" value="0" disabled />
                    <el-option label="已支付" value="1" />
                    <el-option label="已取消" value="2" />
                    <el-option label="已撤销" value="3" />
                    <el-option label="已锁定" value="4" />
                </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="remark" :rules="[{
        required: true,
        message: '备注不能为空',
        trigger: 'blur',
    }]">
                <el-input v-model="payform.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" :loading="payloading" @click="submitPayForm">提 交</el-button>
            </div>
        </template>
    </el-dialog>

    <Products ref="productsRef" @onClose="onSpecClose" @onSubmit="onSpecSubmit" />
</template>
<script setup name="edit">
import { ref } from 'vue';
import { getPurchase, createOrUpdate, saveToStore } from "@/api/senbei/purchase";
import { listPurchaseList } from "@/api/senbei/purchaseList";
import { listPayment, addPayment, updatePayment } from "@/api/app/payment";
import Products from "./products.vue";

const baseImg = import.meta.env.VITE_APP_FILE

// const props = defineProps(["userOptions"]);
const { proxy } = getCurrentInstance();
const emits = defineEmits(["onClose"]);

const open = ref(false);
const title = ref("");
const form = ref({});
const rules = {
    userId: [{ required: true, message: "客户账号不能为空", trigger: "blur" }],
    purchaseName: [{ required: true, message: "采购名称不能为空", trigger: "blur" }],
    purchaseSort: [{ required: true, message: "采购顺序不能为空", trigger: "blur" }],
    purchaseStatus: [{ required: true, message: "采购状态不能为空", trigger: "blur" }],
    purchaseSettlement: [{ required: true, message: "结算状态不能为空", trigger: "blur" }],
};

const rowOpen = ref(false);
const rowform = ref({});
const purchaseListNetPrice = ref(0)

const hasUnfinished = ref(false) // 是否存在未完成子项

const value = ref('1')
const options = ref([{
    label: '采购列表',
    value: '1',
},
    // {
    //     label: '请款记录',
    //     value: '2',
    // }
])

const purchaseList = ref([]);
const specLoading = ref(false);
watch(purchaseList, (newValue, OldValue) => {
    hasUnfinished.value = false
    let heji = 0
    for (let item of purchaseList.value) {
        heji = heji + item.purchaseListSum
        if (item.purchaseListStatus === '0' || item.purchaseListStatus === '1') {
            hasUnfinished.value = true
        }
    }
    form.value.purchaseSum = heji
}, {
    deep: true // 监听数组时必须设置
})

const paymentList = ref([]);
const payOpen = ref(false);
const payFormRef = ref();
const payform = ref({});
const paymentAmount = ref(0);
const payloading = ref(false);

// 一键入库
function addStore() {
    for (let item of purchaseList.value) {
        if (item.purchaseListStatus === '0' || item.purchaseListStatus === '1') {
            proxy.$modal.msgSuccess("存在未完成项");
            return
        }
    }
    proxy.$refs["formRef"].validate(valid => {
        if (valid) {
            proxy.$modal.confirm('是否确认要一键入库？入库后将不可再变更！').then(function () {
                form.value.purchaseList = purchaseList.value
                return saveToStore(form.value)
            }).then(() => {
                proxy.$modal.msgSuccess("操作成功");
                payOpen.value = false
                payloading.value = false
                emits("onClose")
            }).catch(() => { });
        }
    })
}

// 获取付款记录
function getPaymentList() {
    listPayment({ pageNum: 1, pageSize: 100, paymentOrder: form.value.purchaseNo }).then(response => {
        paymentList.value = response.rows || [];
    });
}
// 付款金额
function bayNumChange(e) {
    payform.value.paymentAmount = e * 100
}
// 添加付款记录
function addPay() {
    payOpen.value = true
    paymentAmount.value = 1
    payform.value = {
        paymentChannel: "0",
        paymentAmount: 100
    }
}
// 编辑付款记录
function editPay(item) {
    payOpen.value = true
    paymentAmount.value = item.paymentAmount / 100
    payform.value = item
}
// 提交付款记录
function submitPayForm() {
    proxy.$refs["payFormRef"].validate(valid => {
        if (valid) {
            payloading.value = true
            if (payform.value.paymentId) {
                updatePayment(payform.value).then(response => {
                    proxy.$modal.msgSuccess("更新成功");
                    getPaymentList()
                    payOpen.value = false
                    payloading.value = false
                    emits("onClose")
                });
            } else {
                payform.value.paymentOrder = form.value.purchaseNo
                addPayment(payform.value).then(response => {
                    proxy.$modal.msgSuccess("添加成功");
                    getPaymentList()
                    payOpen.value = false
                    payloading.value = false
                    emits("onClose")
                });
            }

        }
    })
}
function onPayClose() {
    payloading.value = false
}
function getPaymentStatusStr(status) {
    switch (status) {
        case "0":
            return "待支付"
        case "1":
            return "已支付"
        case "2":
            return "已取消"
        case "3":
            return "已撤销"
        case "4":
            return "已锁定"
        default:
            break;
    }
}

// 获取清单产品列表
function getPurchaseSpec(purchaseId) {
    specLoading.value = true;
    listPurchaseList({ pageNum: 1, pageSize: 100, purchaseId: purchaseId }).then(response => {
        purchaseList.value = response.rows || [];
        specLoading.value = false;
    });
}

const productsRef = ref();
function showProducts() {
    productsRef.value?.handleShow()
}

function buyNumChange(e) {
    rowform.value.purchaseListNetPrice = purchaseListNetPrice.value * 100
    rowform.value.purchaseListSum = rowform.value.purchaseListNetPrice * rowform.value.purchaseListNum
}

function onSpecClose() {

}
function onSpecSubmit(e) {
    purchaseList.value.push({
        specImg: e.specImg,
        specId: e.specId,
        productName: e.productName,
        specName: e.specName,
        purchaseListPrice: e.specPrice,
        purchaseListNetPrice: e.specPrice,
        purchaseListNum: e.buyNum,
        purchaseListSum: e.buySum,
        purchaseListStatus: "0",
    })
}

// 行操作
function handleRowUpdate(row) {
    purchaseListNetPrice.value = row.purchaseListNetPrice / 100
    rowform.value = row
    rowOpen.value = true
}
function handleRowDelete(row) {
    const index = purchaseList.value.indexOf(row)
    if (index !== -1) {
        purchaseList.value.splice(index, 1)
    }
}
function submitRowForm() {
    rowOpen.value = false
}

/** 新增按钮操作 */
function handleAdd() {
    reset();
    open.value = true;
    title.value = "添加采购";
}
/** 修改按钮操作 */
function handleUpdate(purchaseId) {
    reset();
    getPurchase(purchaseId).then(response => {
        form.value = response;
        // 获取付款记录
        getPaymentList()

        open.value = true;
        title.value = "修改采购";
    });
    // 获取关联的产品清单
    getPurchaseSpec(purchaseId)
}
/** 提交按钮 */
function submitForm() {
    proxy.$refs["formRef"].validate(valid => {
        if (valid) {
            if (purchaseList.value.length < 1) {
                proxy.$modal.msgError("请购买商品/服务");
                return
            }
            form.value.purchaseList = purchaseList.value
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
    purchaseList.value = []
    rowform.value = {}
    proxy.resetForm("rowFormRef");
    payform.value = {}
    proxy.resetForm("payFormRef");
    form.value = {
        purchaseId: undefined,
        purchaseName: undefined,
        purchaseSum: 0,
        purchaseStatus: "1",
        purchaseSettlement: "0",
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