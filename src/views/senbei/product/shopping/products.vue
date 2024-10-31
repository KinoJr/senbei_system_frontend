<template>
    <el-drawer v-model="drawerShow" title="产品/服务" direction="rtl" size="95%" style="max-width: 800px;"
        :destroy-on-close="true" :close-on-press-escape="false">
        <div class="custom-style">
            <el-segmented v-model="sValue" :options="options" @change="change" />
        </div>
        <el-row :gutter="40" class="panel-group">
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col" v-for="(item, index) in productList" :key="index">
                <el-card style="max-width: 480px" @click.stop="handleAdd(item)" shadow="hover">
                    <template #header>
                        <div class="card-header">
                            <span>{{ item.productName }}</span>
                        </div>
                    </template>
                    <el-row>
                        <el-col :span="24">
                            <ImagePreview width="120px" height="120px"
                                :src="item.productImg && item.productImg !== '#' ? baseImg + item.productImg : '#'" />
                        </el-col>
                        <el-col :span="24">
                            <el-text truncated>{{ item.productDescribe }}</el-text>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>

        <template #footer>
            <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
                v-model:limit="queryParams.pageSize" @pagination="getList" />
        </template>
    </el-drawer>

    <!-- 对话框 -->
    <el-dialog :title="productName" v-model="open" width="90%" style="max-width: 800px;" append-to-body
        :destroy-on-close="true" :close-on-press-escape="false">
        <el-text truncated>{{ productDescribe }}</el-text>
        <el-divider content-position="left">产品规格</el-divider>
        <el-row :gutter="40" class="panel-group">
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col" v-for="(item, index) in specList" :key="index">
                <el-card style="max-width: 480px" @click.stop="onClickSpec(item)" shadow="hover">
                    <template #header>
                        <div class="card-header">
                            <span>{{ item.specName }}</span>
                        </div>
                    </template>
                    <el-row>
                        <el-col :span="24">
                            <ImagePreview width="120px" height="120px"
                                :src="item.specImg && item.specImg !== '#' ? baseImg + item.specImg : '#'" />
                        </el-col>
                        <el-col :span="24">
                            <el-text truncated>库存:{{ item.specNum }}</el-text>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
        <div v-show="form.specId">
            <el-divider content-position="left">下单详情</el-divider>
            <el-row :gutter="40" class="panel-group">
                <el-col :span="24">
                    <el-form ref="formRef" :model="form">
                        <el-form-item label="产品名称" prop="nikeName">
                            <el-input v-model="form.nikeName" placeholder="请输入产品名称" disabled />
                        </el-form-item>
                        <el-form-item label="产品单价(¥)" prop="specPrice">
                            {{ (form.specPrice / 100).toFixed(2) }}
                            <!-- <el-input-number v-model="form.specPrice" controls-position="right" :min="0" disabled/> -->
                        </el-form-item>
                        <el-form-item label="购买数量" prop="buyNum">
                            <el-input-number v-model="form.buyNum" controls-position="right" :min="1" :max="99999"
                                :step="1" step-strictly @change="buyNumChange" />
                        </el-form-item>
                        <el-form-item label="总额(¥)" prop="buySum">
                            {{ (form.buySum / 100).toFixed(2) }}
                            <!-- <el-input-number v-model="form.buySum" controls-position="right" :min="0" disabled /> -->
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button v-if="form.specId" type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </template>
    </el-dialog>

    <ComboDialog ref="comboRef" @onSubmit="onComboSubmit" />
</template>
<script setup name="Products">
import { ref } from 'vue';
import { listProductCategory } from "@/api/senbei/productCategory";
import { listProduct } from "@/api/senbei/product";
import { listSpec } from "@/api/senbei/spec";
import { listCombo } from "@/api/senbei/combo";
import ComboDialog from "./combo.vue";

const baseImg = import.meta.env.VITE_APP_FILE

const { proxy } = getCurrentInstance();
const emits = defineEmits(["onClose", "onSubmit"]);

const comboRef = ref()

// 产品抽屉相关
const drawerShow = ref(false);
const sValue = ref(1)
const options = ref([{
    label: "套餐",
    value: 0,
}])
const productList = ref([])
const total = ref(0)

// 弹窗相关
const open = ref(false);
const formRef = ref();
const form = ref({});
const specList = ref([]);
const productName = ref("");
const productDescribe = ref("");
const productNum = ref(0);
const productImg = ref("");

const queryParams = ref({
    pageNum: 1,
    pageSize: 50,
});


// 获取分类
getCategory()
function getCategory() {
    const query = ref({
        pageNum: 1,
        pageSize: 500,
        productCategoryStatus: "1",
    });
    listProductCategory(query).then(response => {
        if (response.rows) {
            sValue.value = response.rows[0].productCategoryId
            response.rows.map(item => {
                options.value.push({
                    label: item.productCategoryName,
                    value: item.productCategoryId
                })
            })
            getList()
        }
    });
}
function change(e) {
    if (e === 0) {
        listCombo({ pageNum: 1, pageSize: 100, comboStatus: "1" }).then(response => {
            productList.value = [];
            if (response.rows) {
                let ls = []
                for (let item of response.rows) {
                    ls.push({
                        productId: item.comboId,
                        productCategoryId: 0,
                        productName: item.comboName,
                        productDescribe: item.comboDescribe,
                        productStatus: "1",
                    })
                }
                productList.value = ls;
            }
        });
        return
    }
    getList()
}
// 查询产品列表
function getList() {
    queryParams.value.productCategoryId = sValue.value
    listProduct(queryParams.value).then(response => {
        productList.value = response.rows;
        total.value = response.total;
    });
}
// 获取产品规格
function getSpecList(productId) {
    listSpec({ pageNum: 1, pageSize: 100, productId: productId }).then(response => {
        specList.value = response.rows;
    });
}
// 点击规格
function onClickSpec(spec) {
    reset();
    form.value.specId = spec.specId
    form.value.specImg = spec.specImg
    form.value.nikeName = productName.value + "(" + spec.specName + ")"
    form.value.productName = productName.value
    form.value.specName = spec.specName
    form.value.specPrice = spec.specPrice
    form.value.buyNum = 1
    form.value.buySum = form.value.specPrice * form.value.buyNum
}
// 购买量变更
function buyNumChange() {
    form.value.buySum = form.value.specPrice * form.value.buyNum
}
// 选定套餐
function onComboSubmit(e) {
    emits("onComboSubmit", e)
    open.value = false;
    drawerShow.value = false
}

function handleShow() {
    reset();
    drawerShow.value = true
}

/** 新增按钮操作 */
function handleAdd(product) {
    if (product.productCategoryId === 0) {
        // 展开套餐对话框
        comboRef.value?.handleUpdate(product.productId) // 这里的产品ID其实是套餐ID
    } else {
        // 展开商品对话框
        open.value = true;
        productName.value = product.productName
        productDescribe.value = product.productDescribe
        productNum.value = product.productNum
        productImg.value = product.productImg
        getSpecList(product.productId)
    }
}
/** 提交按钮 */
function submitForm() {
    emits("onSubmit", form.value)
    open.value = false;
    drawerShow.value = false
}
/** 取消按钮 */
function cancel() {
    open.value = false;
    reset();
}
/** 表单重置 */
function reset() {
    form.value = {
        specId: undefined,
        specImg: undefined,
        specName: undefined,
        specPrice: 0,
        buyNum: 1,
        buySum: 0,
    };
    proxy.resetForm("formRef");
}

function onclose() {
    emits("onClose")
}

defineExpose({
    handleShow,
})
</script>

<style scoped>
.custom-style .el-segmented {
    --el-segmented-item-selected-color: var(--el-text-color-primary);
    --el-segmented-item-selected-bg-color: #ffd100;
    --el-border-radius-base: 16px;
    margin-bottom: 10px;
}

.card-panel-col {
    margin-bottom: 5px;
}

.card-panel-col:hover {
    border: 3px solid #ffd100;
    /* 鼠标移入时显示高亮边框 */
}
</style>