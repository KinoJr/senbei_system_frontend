<template>
    <!-- 添加或修改收支对话框 -->
    <el-dialog :title="title" v-model="open" width="90%" style="max-width: 800px;" append-to-body :destroy-on-close="true">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="名称" prop="incomeName">
                <el-input v-model="form.incomeName" placeholder="请输入收支名称" />
            </el-form-item>
            <el-form-item label="数量" prop="incomeNum">
                <el-input-number v-model="form.incomeNum" controls-position="right" :min="1" :max="99999" @change="numChange" :step="1" step-strictly />
            </el-form-item>
            <el-form-item label="单价" prop="incomePrice">
                <el-input-number v-model="incomePrice" controls-position="right" :min="0.01" :max="99999" @change="priceChange" :step="0.01" step-strictly />
            </el-form-item>
            <el-form-item label="总金额" prop="incomeSum">
                {{ (incomeSum / 100).toFixed(2) }}
            </el-form-item>
            <el-form-item label="收支类型" prop="incomeType">
                <el-radio-group v-model="form.incomeType">
                    <el-radio value="1"> 收入 </el-radio>
                    <el-radio value="2"> 支出 </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="收支时间" prop="incomeTime">
                <el-date-picker
                    v-model="form.incomeTime"
                    type="datetime"
                    format="YYYY-MM-DD HH:mm:ss" 
                    value-format="YYYY-MM-DD HH:mm:ss" 
                    date-format="YYYY-MM-DD HH:mm:ss"
                    time-format="HH:mm:ss"
                    placeholder="请选择摘记时间"
                />
            </el-form-item>
            <!-- <el-form-item label="收支状态" prop="incomeStatus">
                <el-radio-group v-model="form.incomeStatus">
                    <el-radio value="1">{{ $t('dict.disable.0') }}</el-radio>
                    <el-radio value="0">{{ $t('dict.disable.1') }}</el-radio>
                </el-radio-group>
            </el-form-item> -->
            <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
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
import { addIncome, getIncome, updateIncome } from "@/api/senbei/income";

const { proxy } = getCurrentInstance();
const emits = defineEmits(["onClose"]);

const open = ref(false);
const title = ref("");
const form = ref({});
const rules = {
    incomeName: [{ required: true, message: "名称不能为空", trigger: "blur" }],
    incomeNum: [{ required: true, message: "数量不能为空", trigger: "blur" }],
    incomePrice: [{ required: true, message: "单价不能为空", trigger: "blur" }],
    incomeStatus: [{ required: true, message: "收支状态不能为空", trigger: "blur" }],
    incomeTime: [{ required: true, message: "收支时间不能为空", trigger: "blur" }],
    remark: [{ required: true, message: "备注状态不能为空", trigger: "blur" }],
};

// 总金额
const incomeSum = ref(1);
function numChange(e) {
    // form.value.incomeNum = e
    incomeSum.value = form.value.incomeNum * form.value.incomePrice
}
// 更新总金额
const incomePrice = ref(0);
function priceChange(e) {
    form.value.incomePrice = e * 100
    incomeSum.value = form.value.incomeNum * form.value.incomePrice
}

/** 新增按钮操作 */
function handleAdd() {
    reset();
    open.value = true;
    title.value = "添加收支";
}
/** 修改按钮操作 */
function handleUpdate(incomeId) {
    reset();
    getIncome(incomeId).then(response => {
        form.value = response;
        incomePrice.value = form.value.incomePrice / 100
        incomeSum.value = form.value.incomeSum
        open.value = true;
        title.value = "修改收支";
    });
}
/** 提交按钮 */
function submitForm() {
   proxy.$refs["formRef"].validate(valid => {
      if (valid) {
         if (form.value.incomeId != undefined) {
            updateIncome(form.value).then(response => {
               proxy.$modal.msgSuccess("修改成功");
               open.value = false;
               emits("onClose")
            });
         } else {
            addIncome(form.value).then(response => {
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
        incomeId: undefined,
        incomeName: undefined,
        incomeNum: 1,
        incomePrice: 1,
        incomeSum: 1,
        incomeType: "1",
        incomeStatus: "1",
    };
    proxy.resetForm("postRef");
}

defineExpose({
    handleAdd,
    handleUpdate
})
</script>