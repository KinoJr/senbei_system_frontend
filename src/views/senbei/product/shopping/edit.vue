<template>
    <!-- 添加或修改订单对话框 -->
    <el-dialog :title="title" v-model="open" width="90%" style="max-width: 800px;" append-to-body
        :destroy-on-close="true">
        <!-- <el-divider content-position="left">订单信息</el-divider> -->
        <el-form ref="formRef" :model="form" :rules="rules">
            <el-form-item label="客户账号" prop="userId">
                <el-select v-model="form.userId" filterable placeholder="请选择客户账号" style="width: 200px"
                    :disabled="form.shoppingId" @change="onChange">
                    <el-option v-for="item in userOptions" :key="item.userId" :label="(item.userName + ' - ' + item.nickName)"
                        :value="item.userId" />
                </el-select>
            </el-form-item>
            <el-form-item label="客户名称" prop="shoppingName">
                <el-input v-model="form.shoppingName" placeholder="请输入客户名称" clearable style="width: 200px" />
            </el-form-item>
            <el-form-item label="客户电话" prop="shoppingPhone">
                <el-input v-model="form.shoppingPhone" placeholder="请输入客户电话" clearable style="width: 200px" />
            </el-form-item>
            <el-form-item label="客户身份证" prop="shoppingIdCard">
                <el-input v-model="form.shoppingIdCard" placeholder="请输入客户身份证" clearable style="width: 200px" />
            </el-form-item>

            <el-form-item v-if="form.shoppingId" label="订单编号" prop="shoppingNo">
                {{ form.shoppingNo }}
            </el-form-item>
            <el-form-item label="订单总额(¥)" prop="shoppingSum">
                <el-text type="danger">{{ (form.shoppingSum / 100).toFixed(2) }}</el-text>
            </el-form-item>
            <el-form-item v-if="form.shoppingId" label="已支付总额" prop="paid">
                <el-text type="success">{{ (paid / 100).toFixed(2) }}</el-text>
            </el-form-item>
            <el-form-item v-if="form.shoppingId" label="未支付总额" prop="unPaid">
                <el-text type="danger">{{ (unPaid / 100).toFixed(2) }}</el-text>
            </el-form-item>
            <el-form-item label="套餐价格" prop="packagePrices">
                <el-input-number v-model="packagePrices" controls-position="right" :min="0" :max="99999"
                    @change="packagePricesChange" :step="0.01" step-strictly />
            </el-form-item>
            <el-form-item v-if="form.shoppingId" label="创建时间" prop="createdAt">
                {{ form.createdAt }}
            </el-form-item>
            <el-form-item label="订单时间(摘)" prop="purchaseExtractTime">
                <el-date-picker v-model="form.shoppingTime" type="datetime" format="YYYY-MM-DD HH:mm:ss"
                    value-format="YYYY-MM-DD HH:mm:ss" date-format="YYYY-MM-DD HH:mm:ss" time-format="HH:mm:ss"
                    placeholder="请选择订单时间(摘)" />
            </el-form-item>
            <el-form-item label="预产日期" prop="deliveryDate">
                <el-date-picker v-model="form.deliveryDate" type="date" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD HH:mm:ss" date-format="YYYY-MM-DD" placeholder="请选择预产日期" />
            </el-form-item>
            <el-form-item label="房间号" prop="roomNo">
                <el-input v-model="form.roomNo" placeholder="请输入房间号" clearable style="width: 200px" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
            <!-- （0创建 1进行中 2已完成 3已取消 4已锁定） -->
            <el-form-item label="订单状态" prop="shoppingStatus">
                <el-select v-model="form.shoppingStatus" placeholder="请选择订单状态" style="width: 200px"
                    :disabled="!form.shoppingId">
                    <el-option label="已创建" value="0" />
                    <el-option label="进行中" value="1" />
                    <el-option label="已完成" value="2" />
                    <el-option label="已取消" value="3" />
                    <el-option label="已锁定" value="4" />
                </el-select>
            </el-form-item>
            <el-form-item label="结算状态" prop="shoppingSettlement">
                <el-select v-model="form.shoppingSettlement" placeholder="请选择结算状态" style="width: 200px"
                    :disabled="!form.shoppingId">
                    <el-option label="未结算" value="0" />
                    <el-option label="已结算" value="1" />
                </el-select>
            </el-form-item>
        </el-form>

        <div class="custom-style">
            <el-segmented v-model="value" :options="options" />
        </div>

        <el-table v-show="value === '1'" v-loading="specLoading" :data="shoppingList">
            <template #empty>
                <el-empty description="No Data" />
            </template>
            <!-- <el-table-column label="IMG" width="105" align="center" prop="specImg">
                <template #default="scope">
                    <ImagePreview width="80px" height="80px"
                        :src="scope.row.specImg && scope.row.specImg !== '#' ? baseImg + scope.row.specImg : '#'" />
                </template>
            </el-table-column> -->
            <!-- <el-table-column label="规格ID" align="center" prop="specId" /> -->
            <el-table-column label="产品规格" align="center" prop="specName">
                <template #default="scope">
                    {{ scope.row.productName + "(" + scope.row.specName + ")" }}
                </template>
            </el-table-column>
            <el-table-column label="产品单价" align="center" prop="shoppingListPrice">
                <template #default="scope">
                    {{ (scope.row.shoppingListPrice / 100).toFixed(2) }}
                </template>
            </el-table-column>
            <el-table-column label="实际单价" align="center" prop="shoppingListNetPrice">
                <template #default="scope">
                    {{ (scope.row.shoppingListNetPrice / 100).toFixed(2) }}
                </template>
            </el-table-column>
            <el-table-column label="购买数量" align="center" prop="shoppingListNum" />
            <el-table-column label="已使用" align="center" prop="shoppingListUse">
                <template #default="scope">
                    {{ scope.row.shoppingListUse === 0 ? "-" : scope.row.shoppingListUse }}
                </template>
            </el-table-column>
            <el-table-column label="合计(¥)" align="center" prop="shoppingListSum">
                <template #default="scope">
                    {{ (scope.row.shoppingListSum / 100).toFixed(2) }}
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center" prop="shoppingListStatus">
                <template #default="scope">
                    <el-tag v-if="scope.row.shoppingListStatus === '0'" effect="light">
                        已创建
                    </el-tag>
                    <el-tag v-if="scope.row.shoppingListStatus === '1'" effect="light" type="warning">
                        进行中
                    </el-tag>
                    <el-tag v-if="scope.row.shoppingListStatus === '2'" effect="light" type="success">
                        已完成
                    </el-tag>
                    <el-tag v-if="scope.row.shoppingListStatus === '3'" effect="light" type="danger">
                        已取消
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column width="180" align="center" class-name="small-padding fixed-width">
                <template #header>
                    <el-button type="primary" round @click="showProducts">
                        添加<el-icon class="el-icon--right">
                            <Plus />
                        </el-icon>
                    </el-button>
                </template>
                <template #default="scope">
                    <el-button link type="primary" icon="Edit" @click="handleRowUpdate(scope.row)"
                        v-hasPermi="['system:post:edit']">修改</el-button>
                    <el-button v-if="scope.row.shoppingListStatus === '0'" link type="primary" icon="Delete"
                        @click="handleRowDelete(scope.row)" v-hasPermi="['system:post:remove']">删除</el-button>
                    <!-- <el-button v-if="scope.row.shoppingListStatus === '1'"  link type="primary" icon="Edit" @click="showAddUse(scope.row)"
                        v-hasPermi="['system:post:edit']">使用记录</el-button> -->
                </template>
            </el-table-column>
        </el-table>

        <div v-show="value === '2'">
            <div style="width: 100%; text-align: right;">
                <el-button v-if="form.shoppingId" type="primary" round @click="addPay()">
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
                            付款编号: <el-button type="success" link @click="editPay(item)"> {{ item.paymentNo }}
                            </el-button>
                            <p>付款金额: {{ item.paymentAmount / 100 }}</p>
                            <p>支付状态: {{ getPaymentStatusStr(item.paymentStatus) }}</p>
                            <p>备注: {{ item.remark }}</p>
                            <p>更新者: {{ item.updatedBy }}</p>
                            <p>支付时间: {{ item.createdAt }}</p>
                        </el-card>
                    </el-timeline-item>
                </el-scrollbar>
            </el-timeline>
        </div>

        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" :loading="subLoading" @click="submitForm">提 交</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </template>
    </el-dialog>

    <!-- 产品/服务对话框 -->
    <el-dialog :title="rowform.productName + '(' + rowform.specName + ')'" v-model="rowOpen" width="90%"
        style="max-width: 800px;" append-to-body :destroy-on-close="true" :close-on-press-escape="false">
        <el-form ref="rowFormRef" :model="rowform">
            <el-form-item label="产品单价(¥)" prop="shoppingListPrice">
                {{ (rowform.shoppingListPrice / 100).toFixed(2) }}
            </el-form-item>
            <el-form-item label="实际单价(¥)" prop="shoppingListNetPrice">
                <el-input-number v-model="shoppingListNetPrice" controls-position="right" :min="0"
                    @change="buyNumChange" :step="0.01" :max="99999" step-strictly />
            </el-form-item>
            <el-form-item label="数量" prop="shoppingListNum">
                <el-input-number v-model="rowform.shoppingListNum" controls-position="right" :min="1"
                    @change="buyNumChange" :step="1" :max="99999" step-strictly />
            </el-form-item>
            <el-form-item label="合计(¥)" prop="shoppingListSum">
                {{ (rowform.shoppingListSum / 100).toFixed(2) }}
                <!-- <el-input-number v-model="rowform.shoppingListSum" controls-position="right" :min="0" disabled /> -->
            </el-form-item>
            <el-form-item label="状态" prop="shoppingListStatus">
                <el-select v-model="rowform.shoppingListStatus" placeholder="状态" style="width: 200px"
                    :disabled="!rowform.shoppingListId">
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
                <el-input-number v-model="paymentAmount" controls-position="right" :min="0" :max="(unPaid / 100)"
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

    <AddUse ref="addUseRef" />
    <Products ref="productsRef" @onClose="onSpecClose" @onSubmit="onSpecSubmit" @onComboSubmit="onComboSubmit" />
</template>
<script setup name="edit">
import { ref, watch } from 'vue';
import { getShopping, createOrUpdate } from "@/api/senbei/shopping";
import { listShoppingList } from "@/api/senbei/shoppingList";
import { listPayment, addPayment, updatePayment } from "@/api/app/payment";
import Products from "./products.vue";
import AddUse from "./adduse.vue";

const baseImg = import.meta.env.VITE_APP_FILE

const props = defineProps(["userOptions"]);
const { proxy } = getCurrentInstance();
const emits = defineEmits(["onClose"]);

const open = ref(false);
const title = ref("");
const form = ref({});
const paid = ref(0); // 已支付总额
const unPaid = ref(0); // 未支付总额
const shoppingSum = ref(0) // 订单总额
const rules = {
    userId: [{ required: true, message: "客户账号不能为空", trigger: "blur" }],
    // shoppingName: [{ required: true, message: "订单名称不能为空", trigger: "blur" }],
    shoppingSort: [{ required: true, message: "订单顺序不能为空", trigger: "blur" }],
    shoppingStatus: [{ required: true, message: "订单状态不能为空", trigger: "blur" }],
    shoppingSettlement: [{ required: true, message: "结算状态不能为空", trigger: "blur" }],
};

const rowOpen = ref(false);
const rowform = ref({});
const shoppingListNetPrice = ref(0)

const value = ref('1')
const options = ref([{
    label: '购买列表',
    value: '1',
},
{
    label: '付款记录',
    value: '2',
}])

const shoppingList = ref([]);
const specLoading = ref(false);
watch(shoppingList, (newValue, OldValue) => {
    let heji = 0
    for (let item of shoppingList.value) {
        heji = heji + item.shoppingListSum
    }
    shoppingSum.value = heji
    form.value.shoppingSum = shoppingSum.value + packagePrices.value * 100
}, {
    deep: true // 监听数组时必须设置
})

const paymentList = ref([]);
const payOpen = ref(false);
const payFormRef = ref();
const payform = ref({});
const paymentAmount = ref(0);
const subLoading = ref(false);
const payloading = ref(false);

// 使用记录
const addUseRef = ref()
function showAddUse(row) {
    addUseRef.value?.handleAdd(row)
}

function onChange(e) {
    const item = props.userOptions.find(it => it.userId === e)
    form.value.shoppingName = item.nickName
    form.value.shoppingPhone = item.phonenumber
    form.value.shoppingIdCard = item.idNumber
}

// 获取付款记录
function getPaymentList() {
    listPayment({ pageNum: 1, pageSize: 100, paymentOrder: form.value.shoppingNo }).then(response => {
        paymentList.value = response.rows || [];
        paid.value = 0
        for (let item of paymentList.value) {
            paid.value = paid.value + item.paymentAmount
        }
        unPaid.value = form.value.shoppingSum - paid.value
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
                });
            } else {
                payform.value.paymentOrder = form.value.shoppingNo
                payform.value.userId = form.value.userId
                addPayment(payform.value).then(response => {
                    proxy.$modal.msgSuccess("添加成功");
                    getPaymentList()
                    payOpen.value = false
                    payloading.value = false
                });
            }

        }
    })
}
const packagePrices = ref(0)
function packagePricesChange(e) {
    form.value.packagePrices = e * 100
    form.value.shoppingSum = shoppingSum.value + form.value.packagePrices
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
function getShoppingSpec(shoppingId) {
    specLoading.value = true;
    listShoppingList({ pageNum: 1, pageSize: 100, shoppingId: shoppingId }).then(response => {
        shoppingList.value = response.rows || [];
        specLoading.value = false;
    });
}

const productsRef = ref();
function showProducts() {
    productsRef.value?.handleShow()
}

function buyNumChange(e) {
    rowform.value.shoppingListNetPrice = shoppingListNetPrice.value * 100
    rowform.value.shoppingListSum = rowform.value.shoppingListNetPrice * rowform.value.shoppingListNum
}

function onSpecClose() {

}
// 选定产品
function onSpecSubmit(e) {
    shoppingList.value.push({
        specImg: e.specImg,
        specId: e.specId,
        productName: e.productName,
        specName: e.specName,
        shoppingListPrice: e.specPrice,
        shoppingListNetPrice: e.specPrice,
        shoppingListNum: e.buyNum,
        shoppingListSum: e.buySum,
        shoppingListStatus: "0",
    })
}
// 选定套餐
function onComboSubmit(e) {
    if (e) {
        let ls = []
        for (let item of e) {
            ls.push({
                specImg: item.specImg,
                specId: item.specId,
                productName: item.productName,
                specName: item.specName,
                shoppingListPrice: item.specPrice, // 产品单价
                shoppingListNetPrice: item.comboListPrice, // 实际单价
                shoppingListNum: item.comboListNum,
                shoppingListSum: item.comboListSum,
                shoppingListStatus: "0",
            })
        }
        shoppingList.value = [...shoppingList.value, ...ls]
    }
}


// 行操作
function handleRowUpdate(row) {
    shoppingListNetPrice.value = row.shoppingListNetPrice / 100
    rowform.value = row
    rowOpen.value = true
}
function handleRowDelete(row) {
    const index = shoppingList.value.indexOf(row)
    if (index !== -1) {
        shoppingList.value.splice(index, 1)
    }
}
function submitRowForm() {
    rowOpen.value = false
}

/** 新增按钮操作 */
function handleAdd() {
    reset();
    open.value = true;
    title.value = "添加订单";
}
/** 修改按钮操作 */
function handleUpdate(shoppingId) {
    reset();
    getShopping(shoppingId).then(response => {
        form.value = response;
        packagePrices.value = (response.packagePrices || 0) / 100
        // 获取付款记录
        getPaymentList()

        open.value = true;
        title.value = "修改订单";
    });
    // 获取关联的产品清单
    getShoppingSpec(shoppingId)
}
/** 提交按钮 */
function submitForm() {
    proxy.$refs["formRef"].validate(valid => {
        if (valid) {
            if (shoppingList.value.length < 1) {
                proxy.$modal.msgError("请购买商品/服务");
                return
            }
            form.value.shoppingList = shoppingList.value
            subLoading.value = true
            createOrUpdate(form.value).then(response => {
                subLoading.value = false
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
    shoppingList.value = []
    rowform.value = {}
    proxy.resetForm("rowFormRef");
    payform.value = {}
    proxy.resetForm("payFormRef");
    paymentList.value = []
    packagePrices.value = 0
    form.value = {
        shoppingId: undefined,
        shoppingName: undefined,
        shoppingSum: 0,
        shoppingStatus: "1",
        shoppingSettlement: "0",
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