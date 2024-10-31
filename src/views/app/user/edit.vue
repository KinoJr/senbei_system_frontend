<template>
    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
        <el-form :model="form" :rules="rules" ref="userRef" label-width="80px" label-position="top">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="用户账户" prop="userName">
                        <el-input v-model="form.userName" :placeholder="$t('user.v.userName')" maxlength="30"
                            :disabled="handleType === 'edit'" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('user.t.nickName')" prop="nickName">
                        <el-input v-model="form.nickName" :placeholder="$t('user.v.nickName')" maxlength="30" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item :label="$t('user.t.phonenumber')" prop="phonenumber">
                        <el-input v-model="form.phonenumber" :placeholder="$t('user.v.phonenumber')" maxlength="11" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('user.t.email')" prop="email">
                        <el-input v-model="form.email" :placeholder="$t('user.v.email')" maxlength="50" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="身份证号" prop="idNumber">
                        <el-input v-model="form.idNumber" placeholder="请输入身份证号" maxlength="20" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('user.t.sex')">
                        <el-select v-model="form.sex" :placeholder="$t('user.v.sex')" style="width: 100;">
                            <el-option :key="'0'" :label="$t('user.d.sex.0')" :value="'0'"></el-option>
                            <el-option :key="'1'" :label="$t('user.d.sex.1')" :value="'1'"></el-option>
                            <el-option :key="'2'" :label="$t('user.d.sex.2')" :value="'2'"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item :label="$t('public.status')">
                        <el-radio-group v-model="form.status">
                            <el-radio value="1">{{ $t('dict.disable.0') }}</el-radio>
                            <el-radio value="0">{{ $t('dict.disable.1') }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item v-if="form.userId == undefined" :label="$t('user.t.password')" prop="password">
                        <el-input v-model="form.password" :placeholder="$t('user.v.password')" type="password"
                            maxlength="20" show-password />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="地址">
                        <el-input v-model="form.address" type="textarea" placeholder="请输入地址"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item :label="$t('public.remark')">
                        <el-input v-model="form.remark" type="textarea"
                            :placeholder="$t('public.v.content')"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="submitForm">{{ $t('public.confirm') }}</el-button>
                <el-button @click="cancel">{{ $t('public.cancel') }}</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup name="edit">
import { ref } from 'vue';
import { getUser, updateUser, addUser } from "@/api/app/user";
// import { useI18n } from 'vue-i18n'
// const { t } = useI18n();
const { proxy } = getCurrentInstance();
const emits = defineEmits(["onClose"])

const handleType = ref("")
const title = ref("");
let open = ref(false)
let form = ref({})
const rules = ref({
    userName: [{ required: true, message: "用户名称不能为空", trigger: "blur" }, { min: 2, max: 20, message: "用户名称长度必须介于 2 和 20 之间", trigger: "blur" }],
    nickName: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
    password: [{ required: true, message: "用户密码不能为空", trigger: "blur" }, { min: 5, max: 20, message: "用户密码长度必须介于 5 和 20 之间", trigger: "blur" }],
    email: [{ type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }],
    phonenumber: [{ required: true, pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur" }],
    idNumber: [{ required: true, pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: "请输入正确的身份证号", trigger: "blur" }]
})

/** 重置操作表单 */
function reset() {
    form.value = {
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        nickName: undefined,
        password: "123456",
        phonenumber: undefined,
        email: undefined,
        sex: "2",
        status: "1",
        remark: undefined,
    };
    proxy.resetForm("userRef");
};
/** 取消按钮 */
function cancel() {
    open.value = false;
    reset();
};
/** 新增按钮操作 */
function handleAdd() {
    reset();
    open.value = true;
    handleType.value = "add"
    title.value = "添加用户";
};
/** 修改按钮操作 */
function handleUpdate(row, ids) {
    reset();
    const userId = row.userId || ids;
    getUser(userId).then(response => {
        form.value = response;
        open.value = true;
        handleType.value = "edit"
        title.value = "修改用户";
        form.password = "";
    });
};
/** 提交按钮 */
function submitForm() {
    proxy.$refs["userRef"].validate(valid => {
        if (valid) {
            if (form.value.userId != undefined) {
                updateUser(form.value).then(response => {
                    proxy.$modal.msgSuccess("修改成功");
                    open.value = false;
                    emits("onClose")
                });
            } else {
                addUser(form.value).then(response => {
                    proxy.$modal.msgSuccess("新增成功");
                    open.value = false;
                    emits("onClose")
                });
            }
        }
    });
};

defineExpose({
    handleAdd,
    handleUpdate
})
</script>