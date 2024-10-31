<template>
    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="岗位名称" prop="postName">
                <el-input v-model="form.postName" placeholder="请输入岗位名称" />
            </el-form-item>
            <el-form-item label="岗位编码" prop="postCode">
                <el-input v-model="form.postCode" placeholder="请输入编码名称" />
            </el-form-item>
            <el-form-item label="岗位顺序" prop="postSort">
                <el-input-number v-model="form.postSort" controls-position="right" :min="0" />
            </el-form-item>
            <el-form-item label="岗位状态" prop="status">
                <el-radio-group v-model="form.status">
                    <el-radio value="1">{{ $t('dict.disable.0') }}</el-radio>
                    <el-radio value="0">{{ $t('dict.disable.1') }}</el-radio>
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
import { addPost, getPost, updatePost } from "@/api/system/post";

const { proxy } = getCurrentInstance();
const emits = defineEmits(["onClose"]);

const open = ref(false);
const title = ref("");
const form = ref({});
const rules = {
    postName: [{ required: true, message: "岗位名称不能为空", trigger: "blur" }],
    postCode: [{ required: true, message: "岗位编码不能为空", trigger: "blur" }],
    postSort: [{ required: true, message: "岗位顺序不能为空", trigger: "blur" }],
};

/** 新增按钮操作 */
function handleAdd() {
    reset();
    open.value = true;
    title.value = "添加岗位";
}
/** 修改按钮操作 */
function handleUpdate(postId) {
    reset();
    getPost(postId).then(response => {
        form.value = response;
        open.value = true;
        title.value = "修改岗位";
    });
}
/** 提交按钮 */
function submitForm() {
   proxy.$refs["formRef"].validate(valid => {
      if (valid) {
         if (form.value.postId != undefined) {
            updatePost(form.value).then(response => {
               proxy.$modal.msgSuccess("修改成功");
               open.value = false;
               emits("onClose")
            });
         } else {
            addPost(form.value).then(response => {
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
        postId: undefined,
        postCode: undefined,
        postName: undefined,
        postSort: 0,
        status: "1",
        remark: undefined
    };
    proxy.resetForm("postRef");
}

defineExpose({
    handleAdd,
    handleUpdate
})
</script>