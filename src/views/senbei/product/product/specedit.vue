<template>
    <!-- 添加或修改规格对话框 -->
    <el-dialog :title="title" v-model="open" width="80%" style="max-width: 800px;" append-to-body
        :destroy-on-close="true">
        <el-form ref="formRef" :model="form" :rules="rules">
            <el-form-item label="规格编号" prop="specNo">
                <el-input v-model="form.specNo" placeholder="请输入规格编号" />
            </el-form-item>
            <el-form-item label="规格名称" prop="specName">
                <el-input v-model="form.specName" placeholder="请输入规格名称" />
            </el-form-item>
            <el-form-item label="规格单价" prop="specPrice">
                <el-input-number v-model="specPrice" controls-position="right" :min="0" :max="99999" :step="0.01"
                    step-strictly @change="onSpecPriceChange" />
            </el-form-item>
            <el-form-item label="上架数量" prop="specNum">
                <el-input-number v-model="form.specNum" controls-position="right" :min="0" :max="99999" :step="1"
                    step-strictly />
            </el-form-item>
            <el-form-item label="规格顺序" prop="specSort">
                <el-input-number v-model="form.specSort" controls-position="right" :min="0" :max="99999" :step="1"
                    step-strictly />
            </el-form-item>
            <el-form-item label="规格状态" prop="specStatus">
                <el-radio-group v-model="form.specStatus">
                    <el-radio value="1">{{ $t('dict.disable.0') }}</el-radio>
                    <el-radio value="0">{{ $t('dict.disable.1') }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
            </el-form-item>
            <el-form-item label="规格图片" prop="specImg">
                <ImageUpload :limit="1" :fileSize="5" :uploadUrl="`/comm/uploadToOss/specImg`"
                    :imgUrl="form.specImg && form.specImg != '#' ? baseImg + form.specImg : undefined"
                    @update:modelValue="onUpload" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup name="edit">
import { ref } from 'vue';
import { addSpec, getSpec, updateSpec } from "@/api/senbei/spec";

import { nanoid } from 'nanoid'

const baseImg = import.meta.env.VITE_APP_FILE

const { proxy } = getCurrentInstance();
const emits = defineEmits(["onClose"]);

const open = ref(false);
const title = ref("");
const form = ref({});
const specPrice = ref({});
const rules = {
    specNo: [{ required: true, message: "规格编号不能为空", trigger: "blur" }],
    specName: [{ required: true, message: "规格名称不能为空", trigger: "blur" }],
    specPrice: [{ required: true, message: "规格单价不能为空", trigger: "blur" }],
    specNum: [{ required: true, message: "规格数量不能为空", trigger: "blur" }],
    specSort: [{ required: true, message: "规格顺序不能为空", trigger: "blur" }],
    specStatus: [{ required: true, message: "规格状态不能为空", trigger: "blur" }],
};

function onSpecPriceChange(e) {
    form.value.specPrice = e * 100
}

function onUpload(fileName) {
    form.value.specImg = undefined
    if (fileName) {
        form.value.specImg = fileName
        return
    }
    form.value.specImg = "#"
}

/** 新增按钮操作 */
function handleAdd(productId) {
    reset();
    open.value = true;
    title.value = "添加规格";
    form.value.productId = productId
    form.value.specNo = nanoid()
}
/** 修改按钮操作 */
function handleUpdate(specId) {
    reset();
    getSpec(specId).then(response => {
        form.value = response;
        specPrice.value = response.specPrice / 100
        open.value = true;
        title.value = "修改规格";
    });
}
/** 提交按钮 */
function submitForm() {
    proxy.$refs["formRef"].validate(valid => {
        if (valid) {
            if (form.value.specId != undefined) {
                updateSpec(form.value).then(response => {
                    proxy.$modal.msgSuccess("修改成功");
                    open.value = false;
                    emits("onClose")
                });
            } else {
                addSpec(form.value).then(response => {
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
    specPrice.value = 0
    form.value = {
        specId: undefined,
        productId: undefined,
        specImg: undefined,
        specName: undefined,
        specPrice: 0,
        specNum: 0,
        specSort: 0,
        specStatus: "1",
    };
    proxy.resetForm("postRef");
}

defineExpose({
    handleAdd,
    handleUpdate
})
</script>