<template>
    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" v-model="open" width="700px" append-to-body>
        <el-form :model="form" :rules="rules" ref="userRef" label-width="80px" label-position="top">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="姓名" prop="nickName">
                        <el-input v-model="form.nickName" :placeholder="$t('user.v.nickName')" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('user.t.belongingDepartment')" prop="deptId">
                        <el-tree-select v-model="form.deptId" :data="deptOptions"
                            :props="{ value: 'id', label: 'label', children: 'children' }" value-key="id"
                            :placeholder="$t('user.v.belongingDepartment')" check-strictly />
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
                    <el-form-item v-if="form.userId == undefined" label="用户账户" prop="userName">
                        <el-input v-model="form.userName" placeholder="请输入用户账户" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item v-if="form.userId == undefined" :label="$t('user.t.password')" prop="password">
                        <el-input v-model="form.password" :placeholder="$t('user.v.password')" type="password"
                            maxlength="20" show-password />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item :label="$t('user.t.sex')" prop="sex">
                        <el-select v-model="form.sex" :placeholder="$t('user.v.sex')" style="width: 100;">
                            <el-option :key="'0'" :label="$t('user.d.sex.0')" :value="'0'"></el-option>
                            <el-option :key="'1'" :label="$t('user.d.sex.1')" :value="'1'"></el-option>
                            <el-option :key="'2'" :label="$t('user.d.sex.2')" :value="'2'"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('public.status')" prop="status">
                        <el-radio-group v-model="form.status">
                            <el-radio value="1">{{ $t('dict.disable.0') }}</el-radio>
                            <el-radio value="0">{{ $t('dict.disable.1') }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item :label="$t('user.t.post')" prop="postIds">
                        <el-select v-model="form.postIds" multiple :placeholder="$t('user.v.post')"
                            style="width: 100%;">
                            <el-option v-for="item in postOptions" :key="item.postId" :label="item.postName"
                                :value="item.postId" :disabled="item.status === '0'"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('user.t.role')" prop="roleIds">
                        <el-select v-model="form.roleIds" multiple :placeholder="$t('user.v.role')"
                            style="width: 100%;">
                            <el-option v-for="item in roleOptions" :key="item.roleId" :label="item.roleName"
                                :value="item.roleId" :disabled="item.status === '0'"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="单独登陆">
                        <el-radio-group v-model="form.alone">
                            <el-radio value="1">是</el-radio>
                            <el-radio value="2">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="底薪(RMB)">
                        <el-input-number style="width: 100%;" v-model="form.basicSalary" controls-position="right"
                            :min="0" :max="99999" :step="0.01" step-strictly :precision="2">
                            <template #suffix>
                                <span>RMB</span>
                            </template>
                        </el-input-number>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="身份证号">
                        <el-input v-model="form.idCard" placeholder="请输入身份证号" maxlength="18" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="紧急联系电话">
                        <el-input v-model="form.emergencyPhone" placeholder="请输入紧急联系电话" maxlength="15" />
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="紧急联系人">
                        <el-input v-model="form.emergencyContacts" placeholder="请输入紧急联系人" maxlength="18" />
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="24">
                    <el-form-item label="通讯地址">
                        <el-input v-model="form.address" type="textarea"
                            :placeholder="$t('public.v.content')"></el-input>
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
import { getUser, updateUser, addUser } from "@/api/system/user";

const { proxy } = getCurrentInstance();
const emits = defineEmits(["onClose"])

const deptOptions = ref([]);
const postOptions = ref([]);
const roleOptions = ref([]);

const title = ref("");
let open = ref(false)
let form = ref({})
const rules = {
    userName: [{ required: true, message: "用户账户不能为空", trigger: "blur" }, { min: 2, max: 20, message: "用户名称长度必须介于 2 和 20 之间", trigger: "blur" }],
    nickName: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
    password: [{ required: true, message: "用户密码不能为空", trigger: "blur" }, { min: 5, max: 20, message: "用户密码长度必须介于 5 和 20 之间", trigger: "blur" }],
    email: [{required: true, type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }],
    phonenumber: [{required: true, pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur" }],
    deptId: [{ required: true, message: "部门不能为空", trigger: "blur" }],
    postIds: [{ required: true, message: "岗位不能为空", trigger: "blur" }],
    roleIds: [{ required: true, message: "角色不能为空", trigger: "blur" }],
}

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
        postIds: [],
        roleIds: [],
        alone: "1",
    };
    proxy.resetForm("userRef");
};
/** 取消按钮 */
function cancel() {
    open.value = false;
    reset();
};
/** 新增按钮操作 */
function handleAdd(dept) {
    reset();
    deptOptions.value = dept
    getUser("0").then(response => {
        postOptions.value = response.posts;
        roleOptions.value = response.roles;
        open.value = true;
        title.value = "添加用户";
    });
};
/** 修改按钮操作 */
function handleUpdate(row, ids, dept) {
    reset();
    deptOptions.value = dept
    const userId = row.userId || ids.value;
    getUser(userId).then(response => {
        form.value = response.data;
        postOptions.value = response.posts;
        roleOptions.value = response.roles;
        form.value.postIds = response.postIds;
        form.value.roleIds = response.roleIds;
        open.value = true;
        title.value = "修改用户";
        form.password = "";
    });
};
/** 提交按钮 */
function submitForm() {
    proxy.$refs["userRef"].validate(valid => {
        if (valid) {
            const regex = /[a-zA-Z0-9]+$/;
            if (!regex.test(form.value.userName)) {
                proxy.$modal.msgError("账号包含非法字符");
                return
            }

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