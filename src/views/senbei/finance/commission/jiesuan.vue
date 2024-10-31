<template>
    <!-- 添加或修改分类对话框 -->
    <el-dialog :title="title" v-model="open" width="90%" style="max-width: 800px;" append-to-body
        :destroy-on-close="true" :close-on-press-escape="false" :close-on-click-modal="false">
        <!-- 查询 -->
        <el-form ref="queryRef" :model="queryParams" :rules="rules1" label-width="80px">
            <el-form-item label="员工账号" prop="userId">
                <el-select v-model="queryParams.userId" filterable placeholder="请选择员工账号" style="width: 200px">
                    <el-option v-for="item in userOptions" :key="item.userId" :label="item.userName"
                        :value="item.userId" />
                </el-select>
            </el-form-item>

            <el-form-item label="时间范围" prop="rehabilitationSort">
                <div style="width: 360px">
                    <el-date-picker v-model="datepicker" type="daterange" unlink-panels range-separator="To"
                        start-placeholder="开始时间" end-placeholder="截至时间" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                        @change="onChange" />
                </div>
                <el-button type="primary" @click="onQuery">查询</el-button>
            </el-form-item>
        </el-form>

        <el-form ref="formRef" :model="form" :rules="rules2">
            <el-form-item label="结算总额" prop="commissionAmount">
                <el-text type="danger">{{ (form.commissionAmount / 100).toFixed(2) }}</el-text>
            </el-form-item>
        </el-form>

        <!-- 待结算列表 -->
        <el-table v-loading="loading" :data="dataList">
            <el-table-column type="index" width="80" />
            <!-- <el-table-column label="员工账号" align="center" prop="userId">
                <template #default="scope">
                    {{ getUserNameById(scope.row.userId) }}
                </template>
</el-table-column> -->
            <!-- <el-table-column label="关联订单ID" align="center" prop="shoppingId" /> -->
            <el-table-column label="登记时间" align="center" prop="rehabilitationTime" />
            <el-table-column label="产品名" align="center" prop="productName" />
            <el-table-column label="规格名" align="center" prop="specName" />
            <el-table-column label="登记单价" align="center" prop="rehabilitationNetPrice">
                <template #default="scope">
                    {{ (scope.row.rehabilitationNetPrice / 100).toFixed(2) }}
                </template>
            </el-table-column>
            <el-table-column label="登记次数" align="center" prop="rehabilitationNum" />
            <el-table-column label="提成" align="center" prop="rehabilitationCommissionProportion">
                <template #default="scope">
                    <el-input v-model="scope.row.rehabilitationCommissionProportion" style="width: 80px"
                        @change="onRowChange(scope.row)">
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column label="合计" align="center" prop="rehabilitationCommissionAmount">
                <template #default="scope">
                    <el-text type="danger">{{ (scope.row.rehabilitationCommissionAmount / 100).toFixed(2) }}</el-text>
                </template>
            </el-table-column>
        </el-table>
        <template #footer>
            <div class="dialog-footer">
                <el-button v-if="dataList && dataList.length > 0" type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup name="JieSuan">
import { ref } from 'vue';
import { listRehabilitation } from "@/api/senbei/rehabilitation";
import { addCommission } from "@/api/senbei/commission";
const { proxy } = getCurrentInstance();
const emits = defineEmits(["onClose"]);

const open = ref(false);
const title = ref("");
const form = ref({});
const rules1 = {
    userId: [{ required: true, message: "员工账号不能为空", trigger: "blur" }],
}
const rules2 = {
    commissionAmount: [{ required: true, message: "提成合计不能为空", trigger: "blur" }],
};
const queryParams = ref({
    pageNum: 1,
    pageSize: 1000,
    rehabilitationStatus: "0",
    userId: undefined,
    beginTime: undefined,
    endTime: undefined,
});

const loading = ref(false)
const dataList = ref([])
const userOptions = ref([])

const datepicker = ref()
function onChange(e) {
    queryParams.value.beginTime = e[0]
    queryParams.value.endTime = e[1]
}
function onRowChange(row) {
    if (row.rehabilitationCommissionProportion.endsWith("%")) {
        let bf = Number(row.rehabilitationCommissionProportion.slice(0, -1)) / 100;
        row.rehabilitationCommissionAmount = row.rehabilitationNetPrice * row.rehabilitationNum * bf
    } else {
        row.rehabilitationCommissionAmount = row.rehabilitationCommissionProportion * 100
    }
    if (isNaN(row.rehabilitationCommissionAmount)) {
        // row.rehabilitationCommissionProportion = "0"
        proxy.$modal.msgError("请输入数字或百分比");
        return
    }
    let hj = 0
    for (let item of dataList.value) {
        hj = hj + item.rehabilitationCommissionAmount
    }
    form.value.commissionAmount = hj
}
// 查询
function onQuery() {
    proxy.$refs["queryRef"].validate(valid => {
        if (valid) {
            loading.value = true
            form.value.userId = queryParams.value.userId
            listRehabilitation(queryParams.value).then(response => {
                dataList.value = response.rows || []
                form.value.ids = dataList.value.map(item => item.rehabilitationId);
                loading.value = false;
            });
        }
    })
}

/** 新增按钮操作 */
function handleAdd(uls) {
    reset();
    userOptions.value = uls
    open.value = true;
    title.value = "提成结算";
    loading.value = false
}
/** 提交按钮 */
function submitForm() {
    for (let item of dataList.value) {
        if (item.rehabilitationCommissionAmount === "" || isNaN(item.rehabilitationCommissionAmount)) {
            proxy.$modal.msgError("请输入正确的提成格式");
            return
        }
    }
    proxy.$refs["formRef"].validate(valid => {
        if (valid) {
            form.value.commissionStatus = "1"
            // console.log("form.value ==> ", form.value);
            // addCommission(form.value).then(response => {
            //     proxy.$modal.msgSuccess("新增成功");
            //     open.value = false;
            //     emits("onClose")
            // });
            // if (form.value.rehabilitationId != undefined) {
            //     updateRehabilitation(form.value).then(response => {
            //         proxy.$modal.msgSuccess("修改成功");
            //         open.value = false;
            //         emits("onClose")
            //     });
            // } else {

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
    dataList.value = []
    form.value = {
        userId: undefined,
        commissionAmount: 0,
        commissionStatus: "1",
        Ids: []
    };
    proxy.resetForm("postRef");
}

defineExpose({
    handleAdd,
})
</script>