<template>
  <!-- 添加或修改房间对话框 -->
  <el-dialog :title="title" v-model="open"width="90%" style="max-width: 800px;" append-to-body>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="楼层" prop="roomFloor">
        <el-input v-model="form.roomFloor" placeholder="请输入楼层" />
      </el-form-item>
      <el-form-item label="房间编号" prop="roomNo">
        <el-input v-model="form.roomNo" placeholder="请输入编号名称" />
      </el-form-item>
      <el-form-item label="房间名称" prop="roomName">
        <el-input v-model="form.roomName" placeholder="请输入房间名称" />
      </el-form-item>
      <el-form-item label="保洁阿姨">
        <el-select
          v-model="form.roomClears"
          multiple
          placeholder="请选择保洁阿姨"
          style="width: 100%"
        >
          <el-option
            v-for="item in clearOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="房间顺序" prop="roomSort">
        <el-input-number
          v-model="form.roomSort"
          controls-position="right"
          :min="0"
        />
      </el-form-item>
      <el-form-item label="房间状态" prop="status">
        <el-select
          v-model="form.status"
          placeholder="请选择房间状态"
          clearable
          style="width: 200px"
        >
          <el-option label="停用" value="0" />
          <el-option label="可用" value="1" />
          <el-option label="维修中" value="2" />
          <!-- <el-option label="维修中" value="3" /> -->
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          placeholder="请输入内容"
        />
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
import { addRoom, getRoom, updateRoom, getClearList } from "@/api/senbei/room";

const { proxy } = getCurrentInstance();
const emits = defineEmits(["onClose"]);

const open = ref(false);
const clearOptions = ref([]);
const title = ref("");
const form = ref({});
const rules = {
  roomFloor: [{ required: true, message: "楼层不能为空", trigger: "blur" }],
  roomNo: [{ required: true, message: "房间编号不能为空", trigger: "blur" }],
  // roomName: [{ required: true, message: "房间名称不能为空", trigger: "blur" }],
  status: [{ required: true, message: "房间状态不能为空", trigger: "blur" }],
  // roomSort: [{ required: true, message: "房间顺序不能为空", trigger: "blur" }],
};

/** 新增按钮操作 */
function handleAdd() {
  reset();
  getclearlist();
  open.value = true;
  title.value = "添加房间";
}
/** 修改按钮操作 */
function handleUpdate(roomId) {
  reset();
  getclearlist();
  getRoom(roomId).then((response) => {

    form.value = response.room;
    form.value.roomClears = response.clears || [];
    open.value = true;
    title.value = "修改房间";
  });
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["formRef"].validate((valid) => {
    if (valid) {
      if (form.value.roomId != undefined) {
        updateRoom(form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          emits("onClose");
        });
      } else {
        addRoom(form.value).then((response) => {
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
    roomId: undefined,
    roomFloor: undefined,
    roomNo: undefined,
    roomName: undefined,
    roomSort: 0,
    status: "1",
    remark: undefined,
    roomClears: []
  };
  proxy.resetForm("roomRef");
}
// 获取保洁员列表
function getclearlist() {
  getClearList().then((response) => {
    clearOptions.value = response
  });
}

defineExpose({
  handleAdd,
  handleUpdate,
});
</script>
