<template>
    <!-- 添加或修改评估对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="评估名称" prop="evaluationName">
                <el-input v-model="form.evaluationName" placeholder="请输入评估名称" />
            </el-form-item>
            <el-form-item label="评估编码" prop="evaluationCode">
                <el-input v-model="form.evaluationCode" placeholder="请输入编码名称" />
            </el-form-item>
            <el-form-item label="评估顺序" prop="evaluationSort">
                <el-input-number v-model="form.evaluationSort" controls-position="right" :min="0" />
            </el-form-item>
            <el-form-item label="评估状态" prop="status">
                <el-radio-group v-model="form.status">
                    <el-radio :key="'1'" :label="'1'">{{ $t('dict.disable.0') }}</el-radio>
                    <el-radio :key="'0'" :label="'0'">{{ $t('dict.disable.1') }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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
import { addEvaluation, getEvaluation, updateEvaluation } from "@/api/senbei/evaluation";

const { proxy } = getCurrentInstance();
const emits = defineEmits(["onClose"]);

const open = ref(false);
const title = ref("");
const form = ref({});
const rules = {
    evaluationName: [{ required: true, message: "评估名称不能为空", trigger: "blur" }],
    evaluationCode: [{ required: true, message: "评估编码不能为空", trigger: "blur" }],
    evaluationSort: [{ required: true, message: "评估顺序不能为空", trigger: "blur" }],
};

/** 新增按钮操作 */
function handleAdd() {
    reset();
    open.value = true;
    title.value = "添加评估";
}
/** 修改按钮操作 */
function handleUpdate(evaluationId) {
    reset();
    getEvaluation(evaluationId).then(response => {
        form.value = response;
        open.value = true;
        title.value = "修改评估";
    });
}
/** 提交按钮 */
function submitForm() {
   proxy.$refs["formRef"].validate(valid => {
      if (valid) {
         if (form.value.evaluationId != undefined) {
            updateEvaluation(form.value).then(response => {
               proxy.$modal.msgSuccess("修改成功");
               open.value = false;
               emits("onClose")
            });
         } else {
            addEvaluation(form.value).then(response => {
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
        evaluationId: undefined,
        evaluationCode: undefined,
        evaluationName: undefined,
        evaluationSort: 0,
        status: "0",
        remark: undefined
    };
    proxy.resetForm("evaluationRef");
}

defineExpose({
    handleAdd,
    handleUpdate
})
</script>