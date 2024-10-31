<template>
    <!-- 添加或修改账户对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="账户名称" prop="balanceName">
                <el-input v-model="form.balanceName" placeholder="请输入账户名称" />
            </el-form-item>
            <el-form-item label="账户编码" prop="balanceCode">
                <el-input v-model="form.balanceCode" placeholder="请输入编码名称" />
            </el-form-item>
            <el-form-item label="账户顺序" prop="balanceSort">
                <el-input-number v-model="form.balanceSort" controls-position="right" :min="0" />
            </el-form-item>
            <el-form-item label="账户状态" prop="status">
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
import { addBalance, getBalance, updateBalance } from "@/api/app/balance";

const { proxy } = getCurrentInstance();
const emits = defineEmits(["onClose"]);

const open = ref(false);
const title = ref("");
const form = ref({});
const rules = {
    balanceName: [{ required: true, message: "账户名称不能为空", trigger: "blur" }],
    balanceCode: [{ required: true, message: "账户编码不能为空", trigger: "blur" }],
    balanceSort: [{ required: true, message: "账户顺序不能为空", trigger: "blur" }],
};

/** 新增按钮操作 */
function handleAdd() {
    reset();
    open.value = true;
    title.value = "添加账户";
}
/** 修改按钮操作 */
function handleUpdate(balanceId) {
    reset();
    getBalance(balanceId).then(response => {
        form.value = response;
        open.value = true;
        title.value = "修改账户";
    });
}
/** 提交按钮 */
function submitForm() {
   proxy.$refs["formRef"].validate(valid => {
      if (valid) {
         if (form.value.balanceId != undefined) {
            updateBalance(form.value).then(response => {
               proxy.$modal.msgSuccess("修改成功");
               open.value = false;
               emits("onClose")
            });
         } else {
            addBalance(form.value).then(response => {
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
        balanceId: undefined,
        balanceCode: undefined,
        balanceName: undefined,
        balanceSort: 0,
        status: "0",
        remark: undefined
    };
    proxy.resetForm("balanceRef");
}

defineExpose({
    handleAdd,
    handleUpdate
})
</script>