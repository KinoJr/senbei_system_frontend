<template>
  <div>
    <el-form ref="aFormRef" :model="aForm">
      <el-divider content-position="left">婴儿一般信息</el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="昵称" prop="babyName">
            <el-input v-model="aForm.babyName" placeholder="请填写昵称" :disabled="true" />
          </el-form-item>

        </el-col>
        <el-col :span="12">
          <el-form-item label="出生日期" prop="babyBirthDate">
            <el-date-picker v-model="aForm.babyBirthDate" type="date" placeholder="请选择出生日期" format="YYYY-MM-DD"
              value-format="YYYY-MM-DD" style="width: 100%" :disabled="true" />
          </el-form-item>

        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="分娩周期" prop="babyChildbirthCycle">
            <el-input v-model="aForm.babyChildbirthCycle" placeholder="请填写分娩周期" :disabled="true" />
          </el-form-item>

        </el-col>
        <el-col :span="12">
          <el-form-item label="Apgar Score" prop="babyApgarScore">
            <el-input v-model="aForm.babyApgarScore" placeholder="请填写Apgar Score" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="生产方式" prop="babyChildbirthWay">
            <el-radio-group v-model="aForm.babyChildbirthWay" :disabled="true">
              <el-radio value="a"> 顺 </el-radio>
              <el-radio value="b"> 剖 </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生产异常情况" prop="babyAbnormalProduction">
            <el-checkbox-group v-model="babyAbnormalProductionList" :disabled="true">
              <el-checkbox label="无" value="x" />
              <el-checkbox label="脐绕颈" value="a" />
              <el-checkbox label="窒息" value="b" />
              <el-checkbox label="其他" value="c" />
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="卡介苗" prop="babyBcg">
            <el-radio-group v-model="aForm.babyBcg" :disabled="true">
              <el-radio value="1"> 有 </el-radio>
              <el-radio value="0"> 无 </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="乙肝疫苗" prop="babyHepatitisBVaccine">
            <el-radio-group v-model="aForm.babyHepatitisBVaccine" :disabled="true">
              <el-radio value="1"> 有 </el-radio>
              <el-radio value="0"> 无 </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="出生体重(g)" prop="babyBirthWeight">
            <el-input-number controls-position="right" v-model="aForm.babyBirthWeight" :min="1" :max="90000"
              placeholder="请填写出生体重" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入住身长(cm)" prop="babyCheckInHeight">
            <el-input-number controls-position="right" v-model="aForm.babyCheckInHeight" :min="1" :max="500"
              placeholder="请填写入住身长" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="头围(cm)" prop="babyHeadCircumference">
            <el-input-number controls-position="right" v-model="aForm.babyHeadCircumference" :min="1" :max="500"
              placeholder="请填写头围" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="胸围(cm)" prop="babyChestCircumference">
            <el-input-number controls-position="right" v-model="aForm.babyChestCircumference" :min="1" :max="500"
              placeholder="请填写胸围" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="哺喂方式" prop="babyFeedingMethod">
        <el-radio-group v-model="aForm.babyFeedingMethod" :disabled="true">
          <el-radio value="a"> 纯母乳 </el-radio>
          <el-radio value="b"> 混合 </el-radio>
          <el-radio value="c"> 配方奶 </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

      <el-form ref="formRef" :model="form" :rules="rules">
      <el-divider content-position="left">婴儿评估信息</el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="体温‌℃" prop="bodyTemperature">
            <el-input-number controls-position="right" v-model="form.bodyTemperature" :min="1" :max="999"
              placeholder="请填写体温‌" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="心率(次/分)" prop="heartRate">
            <el-input-number controls-position="right" v-model="form.heartRate" :min="1" :max="999"
              placeholder="请填写心率(次/分)" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="呼吸(次/分)" prop="breathe">
            <el-input-number controls-position="right" v-model="form.breathe" :min="1" :max="999"
              placeholder="请填写呼吸(次/分)" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="体重(kg)" prop="bodyWeight">
            <el-input-number controls-position="right" v-model="form.bodyWeight" :min="1" :max="999"
              placeholder="请填写体重(kg)" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="身长(cm)" prop="bodyHeight">
            <el-input-number controls-position="right" v-model="form.bodyHeight" :min="1" :max="999"
              placeholder="请填写身长(cm)" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="头围(cm)" prop="headCircumference">
            <el-input-number controls-position="right" v-model="form.headCircumference" :min="1" :max="999"
              placeholder="请填写头围(cm)" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="胸围(cm)" prop="chestCircumference">
            <el-input-number controls-position="right" v-model="form.chestCircumference" :min="1" :max="999"
              placeholder="请填写胸围(cm)" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="精神反应" prop="psychologicalReactions">
            <el-radio-group v-model="form.psychologicalReactions">
              <el-radio value="a"> 好 </el-radio>
              <el-radio value="b"> 一般 </el-radio>
              <el-radio value="c"> 差 </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="皮肤破损" prop="skinDamage">
            <el-radio-group v-model="form.skinDamage">
              <el-radio value="1"> 有 </el-radio>
              <el-radio value="0"> 无 </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="皮肤颜色" prop="skinColor">
            <el-radio-group v-model="form.skinColor">
              <el-radio value="a"> 红润 </el-radio>
              <el-radio value="b"> 黄染 </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="黄疸(mg/dl)" prop="jaundice">
            <el-input-number controls-position="right" v-model="form.jaundice" :min="1" :max="999"
              placeholder="请填写黄疸(mg/dl)" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="哭声" prop="crying">
            <el-radio-group v-model="form.crying">
              <el-radio value="a"> 洪亮 </el-radio>
              <el-radio value="b"> 微弱 </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="喂养方式" prop="feedingMethod">
            <el-radio-group v-model="form.feedingMethod">
              <el-radio value="a"> 纯母乳 </el-radio>
              <el-radio value="b"> 混合 </el-radio>
              <el-radio value="c"> 配方奶 </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="目前奶量(ml)" prop="currentMilkSupply">
            <el-input-number controls-position="right" v-model="form.currentMilkSupply" :min="1" :max="9999"
              placeholder="请填写目前奶量(ml)" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="鹅口疮" prop="thrush">
            <el-radio-group v-model="form.thrush">
              <el-radio value="1"> 有 </el-radio>
              <el-radio value="0"> 无 </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="吐奶/溢奶" prop="spittingUp">
            <el-radio-group v-model="form.spittingUp">
              <el-radio value="1"> 有 </el-radio>
              <el-radio value="0"> 无 </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="腹胀" prop="abdominalBloating">
            <el-radio-group v-model="form.abdominalBloating">
              <el-radio value="1"> 有 </el-radio>
              <el-radio value="0"> 无 </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="脐带脱落" prop="umbilicalCordDetachment">
            <el-radio-group v-model="form.umbilicalCordDetachment">
              <el-radio value="1"> 有 </el-radio>
              <el-radio value="0"> 无 </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-form-item label="臀红" prop="buttocksRed">
        <el-radio-group v-model="form.buttocksRed">
          <el-radio value="1"> 有 </el-radio>
          <el-radio value="0"> 无 </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="异常情况" prop="abnormalSituations">
        <el-input v-model="form.abnormalSituations" type="textarea" placeholder="请输入异常情况" />
      </el-form-item>

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
      <el-form-item label="评估时间" prop="evaluationDate">
        <el-date-picker v-model="form.evaluationDate" type="datetime" placeholder="请选择检查时间" format="YYYY-MM-DDTHH:mm:ss"
          value-format="YYYY-MM-DDTHH:mm:ss" style="width: 100%" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
      </el-form-item>
    </el-form>
    <div class="dialog-footer" style="margin-top: 10px">
      <el-button v-if="aForm.babyId" type="primary" @click="submitForm">提 交</el-button>
      <!-- <el-button type="danger" @click="delFun">删 除</el-button> -->
    </div>
  </div>
</template>
<script setup name="babyform">
import { onMounted, ref } from "vue";
import { getEvaluationBaby, delEvaluationBaby, addEvaluationBaby, updateEvaluationBaby } from "@/api/senbei/evaluation";

const baseImg = import.meta.env.VITE_APP_FILE

const { proxy } = getCurrentInstance();
const emits = defineEmits(["onOk", "onDel"]);
const props = defineProps(["datas", "info", "roomOptions", "disabled"]);

const aForm = ref({});
const form = ref({});
const rules = {
  babyName: [{ required: true, message: "昵称不能为空", trigger: "blur" }],
  evaluationDate: [{ required: true, message: "检查时间不能为空", trigger: "blur" }],
  remark: [{ required: true, message: "备注不能为空", trigger: "blur" }],
};

const babyAbnormalProductionList = ref([]); // 生产异常情况

const title = ref("");

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

function delFun() {
  if (form.value.babyId) {
    proxy.$modal
      .confirm('是否确认删除婴儿评估ID为"' + form.value.babyId + '"的数据项？')
      .then(function () {
        return delEvaluationBaby(form.value.babyId).then((response) => {
          proxy.$modal.msgSuccess("删除成功");
          emits("onDel", title.value);
        });
      })
      .then(() => {
        getList();
        proxy.$modal.msgSuccess("删除成功");
      })
      .catch(() => { });
  } else {
    emits("onDel", title.value);
  }
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["formRef"].validate((valid) => {
    if (valid) {
      if (form.value.evaluationId != undefined) {
        updateEvaluationBaby(form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          emits("onOk", form.value.babyId);
        });
      } else {
        addEvaluationBaby(form.value).then((response) => {
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
    aForm.value.archivalId = props.info?.archivalId
    babyAbnormalProductionList.value = toList(
      aForm.value.babyAbnormalProduction
    );
    if (!aForm.value.babyId) {
      return
    }
    // 获取婴儿评估档案
    imgOk.value = false
    getEvaluationBaby(aForm.value.babyId).then((response) => {
      if (!response.evaluationId) {
        proxy.$modal.msgWarning("未录入该婴儿出馆评估");
        form.value.babyId = aForm.value.babyId
        imgOk.value = true
        return
      }
      form.value = response
      imgOk.value = true
    });
  }
});
</script>
