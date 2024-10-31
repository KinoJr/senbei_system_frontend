<template>
    <!-- 添加或修改医生查房记录对话框 -->
    <el-dialog :title="title" v-model="open" width="90%" style="max-width: 800px;" append-to-body>
        <el-form ref="formRef" :model="form" :rules="rules">
            <el-form-item label="方式" prop="way">
                <el-input v-model="form.way" placeholder="请输入方式" />
            </el-form-item>
            <el-form-item label="出生天数" prop="birthDays">
                <el-input-number v-model="form.birthDays" placeholder="请输入出生天数" controls-position="right" :min="0"
                    style="width: 50%;" />
            </el-form-item>
            <el-form-item label="黄疸(mg/dl)" prop="jaundice">
                <el-input-number v-model="form.jaundice" placeholder="请输入黄疸(mg/dl)" controls-position="right" :min="0"
                    style="width: 50%;" />
            </el-form-item>
            <!-- <el-form-item label="喂养方式" prop="feedingMethod">
                <el-input v-model="form.feedingMethod" placeholder="请输入喂养方式" />
            </el-form-item> -->
            <el-form-item label="喂养方式" prop="feedingMethod">
                <el-radio-group v-model="form.feedingMethod">
                    <el-radio value="a"> 母乳喂养 </el-radio>
                    <el-radio value="b"> 人工喂养 </el-radio>
                    <el-radio value="c"> 混合喂养 </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="每次奶量(ml)" prop="milkVolume">
                <el-input-number v-model="form.milkVolume" placeholder="请输入每次奶量(ml)" controls-position="right" :min="0"
                    style="width: 50%;" />
            </el-form-item>
            <el-form-item label="特殊情况" prop="special">
                <el-input v-model="form.special" type="textarea" placeholder="请输入特殊情况" />
            </el-form-item>
            <el-form-item label="情况/建议" prop="suggestion">
                <el-input v-model="form.suggestion" type="textarea" placeholder="请输入查房情况及建议" />
            </el-form-item>
            <el-form-item label="医生" prop="doctorId">
                <el-select v-model="form.doctorId" placeholder="请选择查房医生" style="width: 100%">
                    <el-option v-for="item in doctorOptions" :key="item.value" :label="item.label"
                        :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="医生签字" prop="signature">
                <ImageUpload :limit="1" :fileSize="5"
                    :uploadUrl="`/senbei/archival/uploadSignImg`"
                    :imgUrl="form.signature && form.signature != '#' ? baseImg + form.signature : undefined"
                    @update:modelValue="onUpload" />
            </el-form-item>
            <el-form-item label="检查时间" prop="doctorRoundsTime">
                <el-date-picker v-model="form.doctorRoundsTime" type="datetime" placeholder="请选择检查时间"
                    format="YYYY-MM-DDTHH:mm:ss" value-format="YYYY-MM-DDTHH:mm:ss" style="width: 100%" />
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
import { getDoctorRounds, addDoctorRounds, updateDoctorRounds, getDoctorList } from "@/api/senbei/doctorrounds";
// import { getArchival } from "@/api/senbei/archival";

const baseImg = import.meta.env.VITE_APP_FILE

const { proxy } = getCurrentInstance();
const emits = defineEmits(["onClose"]);

const open = ref(false);
const title = ref("");
const form = ref({});
const rules = {
    doctorId: [{ required: true, message: "查房医生名称不能为空", trigger: "blur" }],
    postCode: [{ required: true, message: "医生查房记录编码不能为空", trigger: "blur" }],
    postSort: [{ required: true, message: "医生查房记录顺序不能为空", trigger: "blur" }],
};

const feedingMethodList = ref([])

const doctorOptions = ref([])
function initFun() {
    getDoctorList().then(response => {
        doctorOptions.value = response || []
    });
}

function onUpload(fileName) {
  if (fileName) {
    form.value.signature = fileName
    return
  }
  form.value.signature = "#"
}

/** 新增按钮操作 */
function handleAdd(aid, t) {
    reset();
    initFun()
    form.value.archivalId = aid
    form.value.doctorRoundsTime = t
    open.value = true;
    title.value = "添加医生查房记录";
}
/** 修改按钮操作 */
function handleUpdate(rid) {
    reset();
    initFun()
    getDoctorRounds(rid).then(response => {
        form.value = response;
        open.value = true;
        title.value = "修改医生查房记录";
    });
}
/** 提交按钮 */
function submitForm() {
    proxy.$refs["formRef"].validate(valid => {
        if (valid) {
            if (form.value.doctorRoundsId != undefined) {
                updateDoctorRounds(form.value).then(response => {
                    proxy.$modal.msgSuccess("修改成功");
                    open.value = false;
                    emits("onClose")
                });
            } else {
                addDoctorRounds(form.value).then(response => {
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
        way: undefined,
        birthDays: undefined,
        jaundice: undefined,
        feedingMethod: undefined,
        milkVolume: undefined,
        special: undefined,
        suggestion: undefined,
        remark: undefined
    };
    proxy.resetForm("formRef");
}

defineExpose({
    handleAdd,
    handleUpdate
})
</script>