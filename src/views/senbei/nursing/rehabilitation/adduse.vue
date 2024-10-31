<template>
    <!-- 添加或修改房间对话框 -->
    <el-dialog :title="title" v-model="open" width="90%" style="max-width: 800px;" append-to-body>
        <el-form ref="formRef" :model="form" :rules="rules">
            <el-form-item label="客户账号" prop="userId">
                <el-select v-model="form.appUserId" filterable placeholder="请选择客户账号" style="width: 200px"
                    @change="onUserChange" :loading="appUserLoading">
                    <el-option v-for="item in appUserOptions" :key="item.userId" :label="item.userName"
                        :value="item.userId" />
                </el-select>
            </el-form-item>
            <el-form-item label="订单编号" prop="userId">
                <el-select v-model="form.shoppingId" filterable placeholder="请选择客户账号" style="width: 200px"
                    @change="onShoppingChange" :loading="shoppingLoading">
                    <el-option v-for="(item, index) in shoppingOptions" :key="index" :label="item.shoppingNo"
                        :value="item.shoppingId" />
                </el-select>
            </el-form-item>
            <el-form-item label="服务项目" prop="userId">
                <el-select v-model="form.shoppingListId" filterable placeholder="请选择服务项目" style="width: 200px"
                    @change="onShoppingListChange()" :loading="shoppingListLoading">
                    <el-option v-for="(item, index) in shoppingListOptions" :key="index" :label="item.specName"
                        :value="item.shoppingListId" :disabled=" item.shoppingListUse >= item.shoppingListNum" />
                </el-select>
            </el-form-item>
            <el-form-item label="购买数" prop="buyNum">
                {{ buyNum }}
            </el-form-item>
            <!-- <el-form-item label="已使用" prop="useNum">
                {{ useNum }}
            </el-form-item> -->
            <el-form-item label="剩余数" prop="yUseNum">
                <el-text type="danger">{{ yUseNum }}</el-text>
            </el-form-item>
            <el-form-item label="员工账号" prop="userId">
                <el-select v-model="form.userId" filterable placeholder="请选择员工账号" style="width: 200px" :loading="sysUserLoading">
                    <el-option v-for="item in sysUserOptions" :key="item.userId" :label="item.userName"
                        :value="item.userId" />
                </el-select>
            </el-form-item>
            <el-form-item label="登记时间" prop="rehabilitationTime">
                <el-date-picker v-model="form.rehabilitationTime" type="datetime" format="YYYY-MM-DD HH:mm:ss"
                    value-format="YYYY-MM-DD HH:mm:ss" date-format="YYYY-MM-DD HH:mm:ss" time-format="HH:mm:ss"
                    placeholder="请选择登记时间(摘)" />
            </el-form-item>
            <el-form-item label="房号(摘)" prop="rehabilitationRoomNo">
                <el-input v-model="form.rehabilitationRoomNo" placeholder="请输入房号" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button v-if="yUseNum > 0" type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup name="AddUse">
import { ref } from "vue";
import { getStore } from "@/api/senbei/store";
import { addRehabilitation } from "@/api/senbei/rehabilitation";
import { listShopping } from "@/api/senbei/shopping";
import { listShoppingList } from "@/api/senbei/shoppingList";
import { listUser as sysListUser } from "@/api/system/user";
import { listUser as appListUser } from "@/api/app/user";


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
const buyNum = ref(0) // 购买次数
const useNum = ref(0) // 已使用次数
const yUseNum = ref(0) // 剩余次数
const sysUserOptions = ref([])
const sysUserLoading = ref(false)
const appUserOptions = ref([])
const appUserLoading = ref(false)
const shoppingOptions = ref([])
const shoppingLoading = ref(false)
const shoppingListOptions = ref([])
const shoppingListLoading = ref(false)

// 获取订单下拉
function onUserChange() {
    form.value.shoppingId = undefined
    form.value.shoppingListId = undefined
    buyNum.value = 0
    useNum.value = 0
    yUseNum.value = 0
    const query = {
        pageNum: 1,
        pageSize: 50,
        userId: form.value.appUserId
    };
    shoppingLoading.value = true
    listShopping(query).then(response => {
        shoppingLoading.value = false
        shoppingOptions.value = response.rows;
    });
}
// 获取服务项目下拉
function onShoppingChange() {
    form.value.shoppingListId = undefined
    buyNum.value = 0
    useNum.value = 0
    yUseNum.value = 0
    const query = {
        pageNum: 1,
        pageSize: 50,
        shoppingId: form.value.shoppingId,
        productType: "0",
    };
    shoppingListLoading.value = true
    listShoppingList(query).then(response => {
        shoppingListLoading.value = false
        shoppingListOptions.value = response.rows || [];

    });
}
function onShoppingListChange() {
    buyNum.value = 0
    useNum.value = 0
    yUseNum.value = 0
    for (let item of shoppingListOptions.value) {
        if (item.shoppingListId === form.value.shoppingListId) {
            buyNum.value = item.shoppingListNum
            useNum.value = item.shoppingListUse
            yUseNum.value = item.shoppingListNum - item.shoppingListUse

            form.value.rehabilitationPrice = item.shoppingListPrice
            form.value.rehabilitationNetPrice = item.shoppingListNetPrice
        }
    }
}

/** 新增按钮操作 */
function handleAdd() {
    reset();
    buyNum.value = 0
    useNum.value = 0
    yUseNum.value = 0
    // 获取客户列表
    appUserLoading.value = true
    appListUser({ pageNum: 1, pageSize: 1000 }).then((response) => {
        appUserLoading.value = false
        appUserOptions.value = response.rows
    })
    // 获取员工列表
    sysUserLoading.value = true
    sysListUser({ pageNum: 1, pageSize: 1000 }).then((response) => {
        sysUserLoading.value = false
        sysUserOptions.value = response.rows
    })
    open.value = true;
    title.value = "添加使用记录";
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
            let param = {
                userId: form.value.userId,
                shoppingListId: form.value.shoppingListId,
                rehabilitationTime: form.value.rehabilitationTime,
                rehabilitationPrice: form.value.rehabilitationPrice,
                rehabilitationNetPrice: form.value.rehabilitationNetPrice,
                rehabilitationNum: 1,
                rehabilitationStatus: "0",
                remark: form.value.remark,
                rehabilitationRoomNo: form.value.rehabilitationRoomNo,
            }
            addRehabilitation(param).then((response) => {
                proxy.$modal.msgSuccess("新增成功");
                open.value = false;
                emits("onClose");
            });
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
        rehabilitationNetPrice: undefined, // 登记时产品实际价格
        rehabilitationStatus: "0",
        remark: undefined,
        rehabilitationRoomNo: undefined,
    };
    proxy.resetForm("storeRef");
}
defineExpose({
    handleAdd,
    handleUpdate,
});
</script>