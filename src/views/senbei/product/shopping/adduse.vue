<template>
    <!-- 添加或修改房间对话框 -->
    <el-dialog :title="title" v-model="open" width="90%" style="max-width: 800px;" append-to-body>
        <el-form ref="formRef" :model="form" :rules="rules">
            <el-form-item label="产品名称" prop="productName">
                {{ dataInfo.productName }}
            </el-form-item>
            <el-form-item label="规格名称" prop="specName">
                {{ dataInfo.specName }}
            </el-form-item>
            <el-form-item label="购买数" prop="shoppingListNum">
                {{ dataInfo.shoppingListNum }}
            </el-form-item>
            <el-form-item label="已使用" prop="useNum">
                {{ useNum }}
            </el-form-item>
            <el-form-item label="剩余" prop="yUseNum">
                <el-text type="danger">{{ yUseNum }}</el-text>
            </el-form-item>
            <!-- <el-form-item label="使用量(数/次)" prop="rehabilitationNum">
                <el-input-number v-model="form.rehabilitationNum" controls-position="right" :min="1" :step="1"
                    :max="yUseNum" step-strictly />
            </el-form-item> -->
            <el-form-item label="员工账号" prop="userId">
                <el-select v-model="form.userId" filterable placeholder="请选择员工账号" style="width: 200px">
                    <el-option v-for="item in userOptions" :key="item.userId" :label="item.userName"
                        :value="item.userId" />
                </el-select>
            </el-form-item>
            <el-form-item label="登记时间" prop="rehabilitationTime">
                <el-date-picker v-model="form.rehabilitationTime" type="datetime" format="YYYY-MM-DD HH:mm:ss"
                    value-format="YYYY-MM-DD HH:mm:ss" date-format="YYYY-MM-DD HH:mm:ss" time-format="HH:mm:ss"
                    placeholder="请选择登记时间(摘)" />
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
<script setup name="AddUse">
import { ref } from "vue";
import { getStore, updateStore } from "@/api/senbei/store";
import { getContByShoppingId, addRehabilitation } from "@/api/senbei/rehabilitation";
import { listUser } from "@/api/system/user";

const { proxy } = getCurrentInstance();
const emits = defineEmits(["onClose"]);

const open = ref(false);
const title = ref("");
const form = ref({});
const rules = {
    rehabilitationNum: [{ required: true, message: "使用数量不能为空", trigger: "blur" }],
    userId: [{ required: true, message: "请绑定员工账号", trigger: "blur" }],
    rehabilitationTime: [{ required: true, message: "登记时间不能为空", trigger: "blur" }],
    // remark: [{ required: true, message: "备注不能为空", trigger: "blur" }],
};
const dataInfo = ref({})
const useNum = ref(0) // 已使用次数
const yUseNum = ref(0) // 剩余次数
const userOptions = ref([])

/** 新增按钮操作 */
function handleAdd(row) {
    reset();
    // 检测已使用次数, 若已使用完则禁止添加记录并提示
    getContByShoppingId(row.shoppingListId).then((response) => {
        if (response < row.shoppingListNum) {
            useNum.value = response
            yUseNum.value = row.shoppingListNum - useNum.value
            form.value.shoppingListId = row.shoppingListId
            form.value.rehabilitationPrice = row.shoppingListPrice
            form.value.RehabilitationNetPrice = row.shoppingListNetPrice
            // 获取员工列表
            listUser({ pageNum: 1, pageSize: 1000 }).then((response) => {
                userOptions.value = response.rows
            })
            dataInfo.value = row
            
            open.value = true;
            title.value = "添加使用记录";
        } else {
            proxy.$modal.msgWarning("已使用完次数, 无需再增加");
        }
    });
}
/** 修改按钮操作 */
function handleUpdate(storeId) {
    reset();
    getStore(storeId).then((response) => {
        form.value = response;
        open.value = true;
        title.value = "编辑库存备注";
    });
}
/** 提交按钮 */
function submitForm() {
    proxy.$refs["formRef"].validate((valid) => {
        if (valid) {
            // console.log("form.value ==> ", form.value);
            addRehabilitation(form.value).then((response) => {
                proxy.$modal.msgSuccess("新增成功");
                open.value = false;
                emits("onClose");
            });
            // if (form.value.storeId != undefined) {
            //     updateStore(form.value).then((response) => {
            //         proxy.$modal.msgSuccess("修改成功");
            //         open.value = false;
            //         emits("onClose");
            //     });
            // } else {
            //     addStore(form.value).then((response) => {
            //         proxy.$modal.msgSuccess("新增成功");
            //         open.value = false;
            //         emits("onClose");
            //     });
            // }
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
        shoppingListId: undefined,
        rehabilitationNum: 1,
        rehabilitationPrice: undefined, // 登记时产品价格
        RehabilitationNetPrice: undefined, // 登记时产品实际价格
        RehabilitationStatus: "0",
        remark: undefined,
    };
    proxy.resetForm("storeRef");
}
defineExpose({
    handleAdd,
    handleUpdate,
});
</script>