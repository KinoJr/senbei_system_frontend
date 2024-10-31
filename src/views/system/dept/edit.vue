<template>
    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
         <el-form ref="deptRef" :model="form" :rules="rules" label-width="80px">
            <el-row>
               <el-col :span="24" v-if="form.parentId !== 0">
                  <el-form-item label="上级部门" prop="parentId">
                     <el-tree-select v-model="form.parentId" :data="deptOptions"
                        :props="{ value: 'deptId', label: 'deptName', children: 'children' }" value-key="deptId"
                        placeholder="选择上级部门" check-strictly />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="部门名称" prop="deptName">
                     <el-input v-model="form.deptName" placeholder="请输入部门名称" />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="显示排序" prop="orderNum">
                     <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="负责人" prop="leader">
                     <el-input v-model="form.leader" placeholder="请输入负责人" maxlength="20" />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="联系电话" prop="phone">
                     <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11" />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="邮箱" prop="email">
                     <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="部门状态">
                     <el-radio-group v-model="form.status">
                        <el-radio value="1">{{ $t('dict.disable.0') }}</el-radio>
                        <el-radio value="0">{{ $t('dict.disable.1') }}</el-radio>
                     </el-radio-group>
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
import { listDept, getDept, addDept, updateDept, listDeptExcludeChild } from "@/api/system/dept";

const { proxy } = getCurrentInstance();
const emits = defineEmits(["onClose"]);

const deptOptions = ref([]);
const open = ref(false);
const title = ref("");
const form = ref({});
const rules = {
    parentId: [{ required: true, message: "上级部门不能为空", trigger: "blur" }],
    deptName: [{ required: true, message: "部门名称不能为空", trigger: "blur" }],
    orderNum: [{ required: true, message: "显示排序不能为空", trigger: "blur" }],
    email: [{ type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }],
    phone: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur" }]
};

/** 新增按钮操作 */
function handleAdd(row) {
    reset();
    listDept().then(response => {
        deptOptions.value = proxy.handleTree(response, "deptId");
    });
    if (row != undefined) {
        form.value.parentId = row.deptId;
    }
    open.value = true;
    title.value = "添加部门";
}
/** 修改按钮操作 */
function handleUpdate(row) {
    reset();
    listDeptExcludeChild(row.deptId).then(response => {
        deptOptions.value = proxy.handleTree(response, "deptId");
    });
    getDept(row.deptId).then(response => {
        form.value = response;
        open.value = true;
        title.value = "修改部门";
    });
}
/** 提交按钮 */
function submitForm() {
    proxy.$refs["deptRef"].validate(valid => {
        if (valid) {
            if (form.value.deptId != undefined) {
                updateDept(form.value).then(response => {
                    proxy.$modal.msgSuccess("修改成功");
                    open.value = false;
                    emits("onClose")
                });
            } else {
                addDept(form.value).then(response => {
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
      deptId: undefined,
      parentId: undefined,
      deptName: undefined,
      orderNum: 0,
      leader: undefined,
      phone: undefined,
      email: undefined,
      status: "1"
   };
   proxy.resetForm("deptRef");
}
defineExpose({
    handleAdd,
    handleUpdate
})
</script>