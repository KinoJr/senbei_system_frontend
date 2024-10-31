<template>
  <div>
    <el-form ref="aFormRef" :model="aForm">
      <el-divider content-position="left">入住情况</el-divider>
      <el-row :gutter="20" type="flex">
        <el-col :span="12">
          <el-form-item label="房号" prop="momRoomId">
            <el-select v-model="aForm.momRoomId" filterable placeholder="请选择房号" style="width: 100%" :disabled="true">
              <el-option v-for="item in props.roomOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="姓名" prop="momName">
            <el-input v-model="aForm.momName" placeholder="请填写宝妈姓名" :disabled="true" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="年龄" prop="momAge">
            <el-input-number controls-position="right" v-model="aForm.momAge" :min="1" :max="500" placeholder="请填写宝妈年龄"
              :disabled="true" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="入住时间" prop="momCheckInTime">
            <el-date-picker v-model="aForm.momCheckInTime" type="date" placeholder="请选择入住时间" format="YYYY-MM-DD"
              value-format="YYYY-MM-DD" style="width: 100%" :disabled="true" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="联系方式" prop="momContact">
            <el-input v-model="aForm.momContact" placeholder="请填写联系方式" :disabled="true" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="体重(kg)" prop="momWeight">
            <el-input-number controls-position="right" v-model="aForm.momWeight" :min="1" :max="500" placeholder="请填写体重"
              :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider content-position="left">产妇分娩信息</el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="分娩日期" prop="momChildbirthDate">
            <el-date-picker v-model="aForm.momChildbirthDate" type="date" placeholder="请选择分娩日期" format="YYYY-MM-DD"
              value-format="YYYY-MM-DD" style="width: 100%" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分娩医院" prop="momChildbirthHospital">
            <el-input v-model="aForm.momChildbirthHospital" placeholder="请填写分娩医院" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分娩周期" prop="momChildbirthCycle">
            <el-input v-model="aForm.momChildbirthCycle" placeholder="请填写分娩周期" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="胎次" prop="momChildbirthNum">
            <el-input-number controls-position="right" v-model="aForm.momChildbirthNum" :min="1" :max="500"
              placeholder="请填写胎次" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分娩方式" prop="momChildbirthWay">
            <el-radio-group v-model="aForm.momChildbirthWay" :disabled="true">
              <el-radio value="a"> 顺 </el-radio>
              <el-radio value="b"> 剖 </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="新生儿性别" prop="momBabySex">
            <el-radio-group v-model="aForm.momBabySex" :disabled="true">
              <el-radio value="a"> 男 </el-radio>
              <el-radio value="b"> 女 </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="喂养方式" prop="momFeeding">
            <el-radio-group v-model="aForm.momFeeding" :disabled="true">
              <el-radio value="a"> 母乳喂养 </el-radio>
              <el-radio value="b"> 人工喂养 </el-radio>
              <el-radio value="c"> 混合喂养 </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-form ref="formRef" :model="form" :rules="rules">
      <el-row :gutter="20">
        <el-divider content-position="left">产妇评估信息</el-divider>
        <el-col :span="12">
          <el-form-item label="体温‌℃" prop="bodyTemperature">
            <el-input-number controls-position="right" v-model="form.bodyTemperature" :min="1" :max="999"
              placeholder="请填写体温‌" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="脉搏(次/分)" prop="pulse">
            <el-input-number controls-position="right" v-model="form.pulse" :min="1" :max="999"
              placeholder="请填写脉搏(次/分)" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="呼吸(次/分)" prop="breathe">
            <el-input-number controls-position="right" v-model="form.breathe" :min="1" :max="999"
              placeholder="请填写呼吸(次/分)" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="血压(mmHg)" prop="bloodPressure">
            <el-input-number controls-position="right" v-model="form.bloodPressure" :min="1" :max="999"
              placeholder="请填写血压(mmHg)" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="体重(kg)" prop="bodyWeight">
            <el-input-number controls-position="right" v-model="form.bodyWeight" :min="1" :max="999"
              placeholder="请填写体重(kg)" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="乳房" prop="breast">
            <el-input v-model="form.breast" placeholder="请填写乳房" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="泌乳" prop="lactation">
            <el-input v-model="form.lactation" placeholder="请填写泌乳" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="宫高" prop="gongGao">
            <el-input v-model="form.gongGao" placeholder="请填写宫高" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="恶露" prop="lochia">
            <el-input v-model="form.lochia" placeholder="请填写恶露" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="会阴伤口" prop="perinealWound">
            <el-input v-model="form.perinealWound" placeholder="请填写会阴伤口" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="剖腹伤口" prop="laparotomyWound">
            <el-input v-model="form.laparotomyWound" placeholder="请填写剖腹伤口" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="二便" prop="secondBowelMovement">
            <el-input v-model="form.secondBowelMovement" placeholder="请填写二便" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="肛门" prop="anus">
            <el-input v-model="form.anus" placeholder="请填写肛门" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="异常情况" prop="abnormalSituations">
            <el-input v-model="form.abnormalSituations" type="textarea" placeholder="请输入异常情况" />
          </el-form-item>
        </el-col>

      </el-row>





      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="客户签字" prop="customerSignature">
            <ImageUpload v-if="imgOk" :limit="1" :fileSize="5" :uploadUrl="`/senbei/archival/uploadSignImg`"
              :imgUrl="form.customerSignature && form.customerSignature != '#' ? baseImg + form.customerSignature : undefined"
              @update:modelValue="onUploadByCustomer" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="护士/月嫂签字" prop="nurseSignature">
            <ImageUpload v-if="imgOk" :limit="1" :fileSize="5" :uploadUrl="`/senbei/archival/uploadSignImg`"
              :imgUrl="form.nurseSignature && form.nurseSignature != '#' ? baseImg + form.nurseSignature : undefined"
              @update:modelValue="onUploadByNurse" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider content-position="left">评估时间</el-divider>
      <el-form-item label="检查时间" prop="evaluationDate">
        <el-date-picker v-model="form.evaluationDate" type="datetime" placeholder="请选择检查时间" format="YYYY-MM-DDTHH:mm:ss"
          value-format="YYYY-MM-DDTHH:mm:ss" style="width: 100%" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
      </el-form-item>
    </el-form>
    <div class="dialog-footer" style="margin-top: 10px;">
      <el-button v-if="aForm.momId" type="primary" @click="submitForm">提 交</el-button>
    </div>
  </div>
</template>
<script setup name="momfrom">
import { onMounted, ref, getCurrentInstance } from "vue";
import { getEvaluationMom, addEvaluationMom, updateEvaluationMom } from "@/api/senbei/evaluation";

const baseImg = import.meta.env.VITE_APP_FILE

const { proxy } = getCurrentInstance();
const emits = defineEmits(["onOk"]);
const props = defineProps(["datas", "info", "roomOptions", "disabled"]);


const aForm = ref({});
const form = ref({});
const rules = {
  evaluationDate: [{ required: true, message: "检查时间不能为空", trigger: "blur" }],
  remark: [{ required: true, message: "备注不能为空", trigger: "blur" }],
  name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
  age: [{ required: true, message: "年龄不能为空", trigger: "blur" }],
};

const imgOk = ref(false)
function onUploadByCustomer(fileName) {
  if (fileName) {
    form.value.customerSignature = fileName
    return
  }
  form.value.customerSignature = "#"
}

function onUploadByNurse(fileName) {
  if (fileName) {
    form.value.nurseSignature = fileName
    return
  }
  form.value.nurseSignature = "#"
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["formRef"].validate((valid) => {
    if (valid) {
      if (form.value.evaluationId != undefined) {
        updateEvaluationMom(form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          emits("onOk", form.value.momId);
        });
      } else {
        addEvaluationMom(form.value).then((response) => {
          proxy.$modal.msgSuccess("新增成功");
          emits("onOk", response);
        });
      }
    }
  });
}

function toList(str) {
  let l = [];
  if (str) {
    l = str.split(",");
  }
  return l;
}
function toStr(li) {
  let str = "";
  if (li) {
    for (let index = 0; index < li.length; index++) {
      if (str === "") {
        str = li[index];
      } else {
        str = str + "," + li[index];
      }
    }
  }
  return str;
}
onMounted(() => {

  if (props.datas) {
    aForm.value = props.datas;
    // form.value.archivalId = props.info?.archivalId
    // form.value.momRoomId = props.info?.archivalRoomId
    // form.value.momName = props.info?.archivalName
    // form.value.momContact = props.info?.archivalPhone
    // form.value.momCheckInTime = props.info?.archivalStartDate
    if (!aForm.value.momId) {
      proxy.$modal.msgWarning("未录入该宝妈首日检查！");
    }
    // 获取宝妈评估详情
    imgOk.value = false
    getEvaluationMom(aForm.value.momId).then((response) => {
      if (!response.evaluationId) {
        proxy.$modal.msgWarning("未录入该宝妈出馆评估");
        form.value.momId = aForm.value.momId
        imgOk.value = true
        return
      }
      form.value = response
      imgOk.value = true
    });
  }
});
</script>
