<template>
  <!-- 添加或修改档案对话框 -->
  <el-dialog :title="title" v-model="open" width="90%" style="max-width: 800px;" append-to-body>
    <el-form ref="formRef" :model="form" :rules="rules">
      <el-form-item label="入馆房间" prop="archivalRoomId">
        <el-select v-model="form.archivalRoomId" filterable placeholder="请选择房号" style="width: 100%">
          <el-option v-for="item in props.roomOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="客户账号" prop="archivalAppId">
        <el-select v-model="form.archivalAppId" filterable placeholder="请绑定客户账号" style="width: 100%" @change="onChange">
          <el-option v-for="item in props.appOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="入馆姓名" prop="archivalName">
        <el-input v-model="form.archivalName" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="联系电话" prop="archivalPhone">
        <el-input v-model="form.archivalPhone" placeholder="请输入联系电话" />
      </el-form-item>
      <el-form-item label="入馆时间" prop="archivalStartDate">
        <el-date-picker v-model="form.archivalStartDate" type="date" placeholder="请选择入住时间" format="YYYY-MM-DD"
          value-format="YYYY-MM-DD" style="width: 100%" />
      </el-form-item>

      <el-form-item label="入住天数" prop="nights">
        <el-input-number controls-position="right" v-model="form.nights" :min="1" :max="9999" style="width: 50%"
          placeholder="请填写入住天数" @change="nightsChange" :disabled="!form.archivalStartDate" />
      </el-form-item>

      <el-form-item label="出馆时间" prop="archivalEndDate">
        <el-date-picker @change="endDateChange" v-model="form.archivalEndDate" type="date" placeholder="请选择出馆时间"
          format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 100%" :disabled="true" />
      </el-form-item>
      <el-form-item label="档案类型" prop="archivalType">
        <el-radio-group v-model="form.archivalType">
          <el-radio value="a">母婴</el-radio>
          <el-radio value="b">宝妈</el-radio>
          <el-radio value="c">宝宝</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item label="档案顺序" prop="archivalSort">
                <el-input-number v-model="form.archivalSort" controls-position="right" :min="0" />
            </el-form-item> -->
      <el-form-item label="档案状态" prop="archivalStatus">
        <el-select v-model="form.archivalStatus" placeholder="档案状态" clearable style="width: 200px">
          <el-option label="预定中" value="0" />
          <el-option label="进行中" value="1" />
          <el-option label="结束" value="2" />
          <el-option label="归档" value="3" />
        </el-select>
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
import { ref } from "vue";
import {
  addArchival,
  getArchival,
  updateArchival,
} from "@/api/senbei/archival";

const { proxy } = getCurrentInstance();
const emits = defineEmits(["onClose"]);
const props = defineProps(["appOptions", "roomOptions"]);

const open = ref(false);
const title = ref("");
const form = ref({});
const yType = ref();

const rules = {
  archivalRoomId: [{ required: true, message: "房间编号不能为空", trigger: "blur" }],
  archivalAppId: [{ required: true, message: "客户不能为空", trigger: "blur" }],
  archivalName: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
  archivalPhone: [{ required: true, message: "联系电话不能为空", trigger: "blur" }],
  archivalStartDate: [{ required: true, message: "入馆时间不能为空", trigger: "blur" }],
  nights: [{ required: true, message: "入住天数不能为空", trigger: "blur" }],
  archivalEndDate: [{ required: true, message: "出馆时间不能为空", trigger: "blur" }],
  archivalType: [{ required: true, message: "档案类型不能为空", trigger: "blur" }],
  archivalStatus: [{ required: true, message: "档案状态不能为空", trigger: "blur" }],
};

function onChange(e) {
  const item = props.appOptions.find(it => it.value === e)
  form.value.archivalName = item.name
  form.value.archivalPhone = item.phone
}

function nightsChange(e) {
  console.log("nightsChange => ", e);
  form.value.archivalEndDate = addDays(form.value.archivalStartDate, e);
}
function endDateChange(e) {
  console.log("endDateChange => ", e);
}

function addDays(dateStr, days) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

/** 新增按钮操作 */
function handleAdd(roomId) {
  reset();
  open.value = true;
  title.value = "添加入馆档案";

  form.value.archivalRoomId = roomId;
}
/** 修改按钮操作 */
function handleUpdate(archivalId) {
  reset();
  getArchival(archivalId).then((response) => {
    form.value = response;
    yType.value = form.value.archivalType
    open.value = true;
    title.value = "修改入馆档案";
  });
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["formRef"].validate((valid) => {
    if (valid) {
      if (form.value.archivalId != undefined) {
        updateArchival(form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          emits("onClose");
        });
      } else {
        addArchival(form.value).then((response) => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          emits("onClose");
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
    archivalId: undefined,
    archivalNo: undefined,
    archivalName: undefined,
    archivalSort: 0,
    archivalType: "a",
    archivalStatus: "1",
    archivalStartDate: undefined,
    archivalEndDate: undefined,
    remark: undefined,
  };
  proxy.resetForm("archivalRef");
}

defineExpose({
  handleAdd,
  handleUpdate,
});
</script>
