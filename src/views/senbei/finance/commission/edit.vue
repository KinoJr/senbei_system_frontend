<template>
    <!-- 添加或修改分类对话框 -->
    <el-dialog :title="title" v-model="open" width="90%" style="max-width: 800px;" append-to-body :destroy-on-close="true">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="分类名称" prop="commissionName">
                <el-input v-model="form.commissionName" placeholder="请输入分类名称" />
            </el-form-item>
            <el-form-item label="分类顺序" prop="commissionSort">
                <el-input-number v-model="form.commissionSort" controls-position="right" :min="0" />
            </el-form-item>
            <el-form-item label="分类状态" prop="commissionStatus">
                <el-radio-group v-model="form.commissionStatus">
                    <el-radio value="1">{{ $t('dict.disable.0') }}</el-radio>
                    <el-radio value="0">{{ $t('dict.disable.1') }}</el-radio>
                </el-radio-group>
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
import { addCommission, getCommission, updateCommission } from "@/api/senbei/commission";

const { proxy } = getCurrentInstance();
const emits = defineEmits(["onClose"]);

const open = ref(false);
const title = ref("");
const form = ref({});
const rules = {
    commissionName: [{ required: true, message: "分类名称不能为空", trigger: "blur" }],
    commissionSort: [{ required: true, message: "分类顺序不能为空", trigger: "blur" }],
    commissionStatus: [{ required: true, message: "分类状态不能为空", trigger: "blur" }],
};

/** 新增按钮操作 */
function handleAdd() {
    reset();
    open.value = true;
    title.value = "添加分类";
}
/** 修改按钮操作 */
function handleUpdate(commissionId) {
    reset();
    getCommission(commissionId).then(response => {
        form.value = response;
        open.value = true;
        title.value = "修改分类";
    });
}
/** 提交按钮 */
function submitForm() {
   proxy.$refs["formRef"].validate(valid => {
      if (valid) {
         if (form.value.commissionId != undefined) {
            updateCommission(form.value).then(response => {
               proxy.$modal.msgSuccess("修改成功");
               open.value = false;
               emits("onClose")
            });
         } else {
            addCommission(form.value).then(response => {
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
        commissionId: undefined,
        commissionName: undefined,
        commissionSort: 0,
        commissionStatus: "1",
    };
    proxy.resetForm("postRef");
}

defineExpose({
    handleAdd,
    handleUpdate
})
</script>