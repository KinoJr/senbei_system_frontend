<template>
    <!-- 添加或修改档案对话框 -->
    <el-dialog :title="title" v-model="open" width="90%" style="max-width: 800px;" append-to-body :destroy-on-close="true">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="姓名" prop="completedName">
                <el-input v-model="form.completedName" placeholder="请输入姓名" />
            </el-form-item>
            <el-form-item label="电话" prop="completedPhone">
                <el-input v-model="form.completedPhone" placeholder="请输入电话" />
            </el-form-item>
            <el-form-item label="房号" prop="completedRoomNo">
                <el-input v-model="form.completedRoomNo" placeholder="请输入房号" />
            </el-form-item>
            <el-form-item label="地址" prop="completedAddress">
                <el-input v-model="form.completedAddress" placeholder="请输入地址" />
            </el-form-item>
            <el-form-item label="入馆时间" prop="completedEnterTime">
                <el-date-picker
                    v-model="form.completedEnterTime"
                    type="datetime"
                    format="YYYY-MM-DD HH:mm:ss" 
                    value-format="YYYY-MM-DD HH:mm:ss" 
                    date-format="YYYY-MM-DD HH:mm:ss"
                    time-format="HH:mm:ss"
                    placeholder="请选择入馆时间"
                />
            </el-form-item>
            <el-form-item label="出馆时间" prop="completedOutTime">
                <el-date-picker
                    v-model="form.completedOutTime"
                    type="datetime"
                    format="YYYY-MM-DD HH:mm:ss" 
                    value-format="YYYY-MM-DD HH:mm:ss" 
                    date-format="YYYY-MM-DD HH:mm:ss"
                    time-format="HH:mm:ss"
                    placeholder="请选择出馆时间"
                />
            </el-form-item>
            <!-- <el-form-item label="档案状态" prop="completedStatus">
                <el-radio-group v-model="form.completedStatus">
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
import { addCompleted, getCompleted, updateCompleted } from "@/api/senbei/completed";

const { proxy } = getCurrentInstance();
const emits = defineEmits(["onClose"]);

const open = ref(false);
const title = ref("");
const form = ref({});
const rules = {
    completedName: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
    completedPhone: [{ required: true, message: "电话不能为空", trigger: "blur" }],
    completedRoomNo: [{ required: true, message: "房号不能为空", trigger: "blur" }],
    completedAddress: [{ required: true, message: "地址不能为空", trigger: "blur" }],
    completedEnterTime: [{ required: true, message: "入馆时间不能为空", trigger: "blur" }],
    completedOutTime: [{ required: true, message: "出馆时间不能为空", trigger: "blur" }],
};

/** 新增按钮操作 */
function handleAdd() {
    reset();
    open.value = true;
    title.value = "添加档案";
}
/** 修改按钮操作 */
function handleUpdate(completedId) {
    reset();
    getCompleted(completedId).then(response => {
        form.value = response;
        open.value = true;
        title.value = "修改档案";
    });
}
/** 提交按钮 */
function submitForm() {
   proxy.$refs["formRef"].validate(valid => {
      if (valid) {
         if (form.value.completedId != undefined) {
            updateCompleted(form.value).then(response => {
               proxy.$modal.msgSuccess("修改成功");
               open.value = false;
               emits("onClose")
            });
         } else {
            addCompleted(form.value).then(response => {
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
        completedId: undefined,
        completedName: undefined,
        completedSort: 0,
        completedStatus: "1",
    };
    proxy.resetForm("postRef");
}

defineExpose({
    handleAdd,
    handleUpdate
})
</script>