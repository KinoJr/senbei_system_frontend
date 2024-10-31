<template>
    <!-- 添加或修改公告对话框 -->
    <el-dialog :title="title" v-model="open" width="780px" append-to-body>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="公告标题" prop="title">
                        <el-input v-model="form.title" placeholder="请输入公告标题" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="公告类型" prop="type">
                        <el-select v-model="form.type" placeholder="请选择">
                            <el-option :key="'1'" :label="$t('notice.d.type.1')" :value="'1'"></el-option>
                            <el-option :key="'2'" :label="$t('notice.d.type.2')" :value="'2'"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="状态">
                        <el-radio-group v-model="form.status">
                            <el-radio value="1">{{ $t('dict.disable.0') }}</el-radio>
                            <el-radio value="0">{{ $t('dict.disable.1') }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="内容">
                        <editor v-model="form.content" :min-height="192" />
                    </el-form-item>
                </el-col>
            </el-row>
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
import { getNotice, addNotice, updateNotice } from "@/api/system/notice";

const { proxy } = getCurrentInstance();
const emits = defineEmits(["onClose"]);

const open = ref(false);
const title = ref("");
const form = ref({});
const rules = {
    noticeTitle: [{ required: true, message: "公告标题不能为空", trigger: "blur" }],
    noticeType: [{ required: true, message: "公告类型不能为空", trigger: "change" }]
};

/** 新增按钮操作 */
function handleAdd() {
    reset();
    open.value = true;
    title.value = "添加公告";
}
/** 修改按钮操作 */
function handleUpdate(noticeId) {
    reset();
    getNotice(noticeId).then(response => {
        form.value = response;
        open.value = true;
        title.value = "修改公告";
    });
}
/** 提交按钮 */
function submitForm() {
   proxy.$refs["formRef"].validate(valid => {
      if (valid) {
         if (form.value.noticeId != undefined) {
            updateNotice(form.value).then(response => {
               proxy.$modal.msgSuccess("修改成功");
               open.value = false;
               emits("onClose")
            });
         } else {
            addNotice(form.value).then(response => {
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
        noticeId: undefined,
        noticeTitle: undefined,
        noticeType: undefined,
        noticeContent: undefined,
        status: "0"
    };
    proxy.resetForm("noticeRef");
}

defineExpose({
    handleAdd,
    handleUpdate
})
</script>