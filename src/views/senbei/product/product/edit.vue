<template>
    <!-- 添加或修改产品对话框 -->
    <el-dialog :title="title" v-model="open" width="80%" style="max-width: 800px;" append-to-body :destroy-on-close="true">
        <el-form ref="formRef" :model="form" :rules="rules">
            <el-form-item label="产品分类" prop="productCategoryId">
                <el-select v-model="form.productCategoryId" filterable placeholder="请选择产品分类" style="width: 100%">
                    <el-option v-for="item in props.categorys" :key="item.productCategoryId" :label="item.productCategoryName"
                        :value="item.productCategoryId" />
                </el-select>
            </el-form-item>
            <el-form-item label="产品名称" prop="productName">
                <el-input v-model="form.productName" placeholder="请输入产品名称" />
            </el-form-item>
            <el-form-item label="产品编号" prop="productNo">
                <el-input v-model="form.productNo" placeholder="请输入产品编号" />
            </el-form-item>
            <!-- <el-form-item label="产品顺序" prop="productSort">
                <el-input-number v-model="form.productSort" controls-position="right" :min="0" />
            </el-form-item> -->
            <el-form-item label="产品类型" prop="productType">
                <el-radio-group v-model="form.productType">
                    <el-radio value="1">商品</el-radio>
                    <el-radio value="0">服务</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="产品状态" prop="productStatus">
                <el-radio-group v-model="form.productStatus">
                    <el-radio value="1">{{ $t('dict.disable.0') }}</el-radio>
                    <el-radio value="0">{{ $t('dict.disable.1') }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="产品描述" prop="productDescribe">
                <el-input v-model="form.productDescribe" type="textarea" placeholder="请输入产品描述" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
            </el-form-item>
            <el-form-item label="产品图片" prop="productImg">
                <ImageUpload :limit="1" :fileSize="5" :uploadUrl="`/comm/uploadToOss/productImg`"
                    :imgUrl="form.productImg && form.productImg != '#' ? baseImg + form.productImg : undefined"
                    @update:modelValue="onUpload" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="submitForm" :loading="loading">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup name="edit">
import { ref } from 'vue';
import { addProduct, getProduct, updateProduct } from "@/api/senbei/product";

import { nanoid } from 'nanoid'

const baseImg = import.meta.env.VITE_APP_FILE

const { proxy } = getCurrentInstance();
const emits = defineEmits(["onClose"]);

const props = defineProps(["categorys"]);

const loading = ref(false);

const open = ref(false);
const title = ref("");
const form = ref({});
const rules = {
    productCategoryId: [{ required: true, message: "产品分类不能为空", trigger: "blur" }],
    productType: [{ required: true, message: "产品类型不能为空", trigger: "blur" }],
    productNo: [{ required: true, message: "产品编号不能为空", trigger: "blur" }],
    productName: [{ required: true, message: "产品名称不能为空", trigger: "blur" }],
    productSort: [{ required: true, message: "产品顺序不能为空", trigger: "blur" }],
    productStatus: [{ required: true, message: "产品状态不能为空", trigger: "blur" }],
};

function onUpload(fileName) {
    form.value.productImg = undefined
    if (fileName) {
        form.value.productImg = fileName
        return
    }
    form.value.productImg = "#"
}

/** 新增按钮操作 */
function handleAdd() {
    reset();
    open.value = true;
    title.value = "添加产品";
    form.value.productNo = nanoid()
}
/** 修改按钮操作 */
function handleUpdate(productId) {
    reset();
    getProduct(productId).then(response => {
        form.value = response;
        open.value = true;
        title.value = "修改产品";
    });
}
/** 提交按钮 */
function submitForm() {
    proxy.$refs["formRef"].validate(valid => {
        if (valid) {
            loading.value = true
            if (form.value.productId != undefined) {
                updateProduct(form.value).then(response => {
                    loading.value = false
                    proxy.$modal.msgSuccess("修改成功");
                    open.value = false;
                    emits("onClose")
                });
            } else {
                addProduct(form.value).then(response => {
                    loading.value = false
                    proxy.$modal.msgSuccess("新增成功");
                    open.value = false;
                    emits("onClose")
                });
            }
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
    form.value = {
        productId: undefined,
        productName: undefined,
        productSort: 0,
        productStatus: "1",
        productType: "1",
    };
    proxy.resetForm("postRef");
}

defineExpose({
    handleAdd,
    handleUpdate
})
</script>