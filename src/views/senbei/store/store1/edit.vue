<template>
    <!-- 添加或修改房间对话框 -->
    <el-dialog :title="title" v-model="open" width="90%" style="max-width: 800px;" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" >
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入产品名称" disabled/>
        </el-form-item>
        <el-form-item label="产品编号" prop="productNo">
          <el-input v-model="form.productNo" placeholder="请输入产品编号" disabled/>
        </el-form-item>
        <el-form-item label="规格名称" prop="specName">
          <el-input v-model="form.specName" placeholder="请输入房间名称" disabled/>
        </el-form-item>
        <el-form-item label="规格编号" prop="specNo">
          <el-input v-model="form.specNo" placeholder="请输入规格编号" disabled/>
        </el-form-item>
        <!-- <el-form-item label="库存类型" prop="storeType">
          <el-select
            v-model="form.storeType"
            placeholder="请选择库存记录类型"
            style="width: 200px"
            disabled
          >
            <el-option label="入库" value="0" />
            <el-option label="出库" value="1" />
            <el-option label="损坏" value="2" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="变动数量" prop="storeNum">
          <el-input-number
            v-model="form.storeNum"
            controls-position="right"
            :min="0" :step="1" :max="99999" step-strictly
            disabled
          />
        </el-form-item>
        <el-form-item label="变动前库存" prop="storeBeforeNum">
          <el-input-number
            v-model="form.storeBeforeNum"
            controls-position="right"
            :min="0" :step="1" :max="99999" step-strictly
            disabled
          />
        </el-form-item>
        <el-form-item label="变动后库存" prop="storeAfterNum">
          <el-input-number
            v-model="form.storeAfterNum"
            controls-position="right"
            :min="0" :step="1" :max="99999" step-strictly
            disabled
          />
        </el-form-item>
        <el-form-item label="创建时间" prop="createdAt">
          <el-input v-model="form.createdAt" placeholder="请输入创建时间" disabled/>
        </el-form-item>
        <el-form-item label="创建者" prop="specNo">
          <el-input v-model="form.createdBy" placeholder="请输入创建者" disabled/>
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
  import { getStore, updateStore } from "@/api/senbei/store";
  
  const { proxy } = getCurrentInstance();
  const emits = defineEmits(["onClose"]);
  
  const open = ref(false);
  const title = ref("");
  const form = ref({});
  const rules = {
    storeNum: [{ required: true, message: "变动数量不能为空", trigger: "blur" }],
    remark: [{ required: true, message: "备注不能为空", trigger: "blur" }],
  };
  
  /** 新增按钮操作 */
  function handleAdd() {
    reset();
    open.value = true;
    title.value = "添加出库记录";
  }
  /** 修改按钮操作 */
  function handleUpdate(storeId) {
    reset();
    getStore(storeId).then((response) => {
      form.value = response;
      open.value = true;
      title.value = "编辑出库备注";
    });
  }
  /** 提交按钮 */
  function submitForm() {
    proxy.$refs["formRef"].validate((valid) => {
      if (valid) {
        form.value.storeType = "1"
        if (form.value.storeId != undefined) {
          updateStore(form.value).then((response) => {
            proxy.$modal.msgSuccess("修改成功");
            open.value = false;
            emits("onClose");
          });
        } else {
          addStore(form.value).then((response) => {
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
      storeId: undefined,
      storeNo: undefined,
      storeName: undefined,
      storeSort: 0,
      status: "1",
      remark: undefined,
      storeClears: []
    };
    proxy.resetForm("storeRef");
  }
  defineExpose({
    handleAdd,
    handleUpdate,
  });
  </script>
  