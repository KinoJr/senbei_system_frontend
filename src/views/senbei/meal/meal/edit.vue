<template>
    <!-- 添加或修改餐次对话框 -->
    <el-dialog :title="title" v-model="open" width="90%" style="max-width: 800px;" append-to-body
        :destroy-on-close="true">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <!-- <el-form-item label="餐次名称" prop="mealName">
                <el-input v-model="form.mealName" placeholder="请输入餐次名称" />
            </el-form-item>

            <el-form-item label="餐次顺序" prop="mealSort">
                <el-input-number v-model="form.mealSort" controls-position="right" :min="0" />
            </el-form-item>
            <el-form-item label="餐次状态" prop="mealStatus">
                <el-radio-group v-model="form.mealStatus">
                    <el-radio value="1">{{ $t('dict.disable.0') }}</el-radio>
                    <el-radio value="0">{{ $t('dict.disable.1') }}</el-radio>
                </el-radio-group>
            </el-form-item> -->

            <el-form-item label="餐次名称" prop="mealName">
                <el-input v-model="form.mealName" placeholder="请输入餐次名称" />
            </el-form-item>
            <el-form-item label="默认展示" prop="mealStatus">
                <el-radio-group v-model="form.mealStatus">
                    <el-radio value="1"> 是 </el-radio>
                    <el-radio value="0"> 否 </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="餐次顺序" prop="mealSort">
                <el-input-number v-model="form.mealSort" controls-position="right" :min="0" />
            </el-form-item>
            <el-form-item v-if="form.mealId" label="日次" prop="day">
                <el-select v-model="day" placeholder="请选择日次" style="width: 200px">
                    <el-option label="星期一" value="a" />
                    <el-option label="星期二" value="b" />
                    <el-option label="星期三" value="c" />
                    <el-option label="星期四" value="d" />
                    <el-option label="星期五" value="e" />
                    <el-option label="星期六" value="f" />
                    <el-option label="星期天" value="g" />
                </el-select>
            </el-form-item>
            <el-form-item v-if="form.mealId" label="餐次" prop="meals">
                <el-select v-model="meals" placeholder="请选择餐次" style="width: 200px">
                    <el-option label="早餐" value="0" />
                    <el-option label="加餐(早)" value="1" />
                    <el-option label="午餐" value="2" />
                    <el-option label="加餐(午)" value="3" />
                    <el-option label="晚餐" value="4" />
                    <el-option label="加餐(晚)" value="5" />
                </el-select>
            </el-form-item>
            <el-form-item v-if="form.mealId" label="内容" prop="content">
                <el-input v-model="content" type="textarea" placeholder="请输入内容" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
            </el-form-item>

        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="submitForm" :loading="loading">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup name="edit">
import { ref } from 'vue';
import { addMeal, getMeal, updateMeal } from "@/api/senbei/meal";

const { proxy } = getCurrentInstance();
const emits = defineEmits(["onClose"]);

const loading = ref(false)

const day = ref("a")
const meals = ref("0")
const content = ref("")

const open = ref(false);
const title = ref("");
const form = ref({});
const rules = {
    mealName: [{ required: true, message: "餐次名称不能为空", trigger: "blur" }],
    show: [{ required: true, message: "请选择是否默认展示", trigger: "blur" }],
    // day: [{ required: true, message: "日次不能为空", trigger: "blur" }],
    // meals: [{ required: true, message: "餐次不能为空", trigger: "blur" }],
    // content: [{ required: true, message: "内容不能为空", trigger: "blur" }],
};

/** 新增按钮操作 */
function handleAdd() {
    reset();
    open.value = true;
    title.value = "添加餐次";
}
/** 修改按钮操作 */
function handleUpdate(mealId, e1, e2) {
    reset();
    day.value = e1
    meals.value = e2 + ""
    getMeal(mealId).then(response => {
        form.value = response;
        open.value = true;
        title.value = "修改餐次";

        const key = day.value + "_" + meals.value
        try {
            const data = JSON.parse(form.value.mealContent);
            content.value = data[key]
        } catch (e) {
            content.value = undefined
        }
    });
}
/** 提交按钮 */
function submitForm() {
    proxy.$refs["formRef"].validate(valid => {
        if (valid) {
            loading.value = true

            const key = day.value + "_" + meals.value
            try {
                const data = JSON.parse(form.value.mealContent);
                data[key] = content.value.replaceAll("，", ",")
                form.value.mealContent = JSON.stringify(data)
            } catch (e) {
                const data = {}
                data[key] = content.value
                form.value.mealContent = JSON.stringify(data)
            }

            if (form.value.mealId != undefined) {
                updateMeal(form.value).then(response => {
                    loading.value = false
                    proxy.$modal.msgSuccess("修改成功");
                    open.value = false;
                    emits("onClose")
                });
            } else {
                addMeal(form.value).then(response => {
                    loading.value = false
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
    day.value = "a"
    meals.value = "0"
    form.value = {
        mealId: undefined,
        mealName: undefined,
        mealSort: 0,
        mealStatus: "0",
        mealContent: undefined,
        remark: undefined,
    };
    proxy.resetForm("postRef");
}

defineExpose({
    handleAdd,
    handleUpdate
})
</script>