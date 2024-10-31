<template>
  <div>
    <el-form ref="formRef" :model="form" :rules="rules">
      <el-divider content-position="left">婴儿一般信息</el-divider>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="昵称" prop="babyName">
            <el-input v-model="form.babyName" placeholder="请填写昵称" :disabled="props.disabled"/>
          </el-form-item>

        </el-col>
        <el-col :span="12">
          <el-form-item label="出生日期" prop="babyBirthDate">
            <el-date-picker v-model="form.babyBirthDate" type="date" placeholder="请选择出生日期" format="YYYY-MM-DD"
              value-format="YYYY-MM-DD" style="width: 100%" :disabled="props.disabled"/>
          </el-form-item>

        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="分娩周期" prop="babyChildbirthCycle">
            <el-input v-model="form.babyChildbirthCycle" placeholder="请填写分娩周期" :disabled="props.disabled"/>
          </el-form-item>

        </el-col>
        <el-col :span="12">
          <el-form-item label="Apgar Score" prop="babyApgarScore">
            <el-input v-model="form.babyApgarScore" placeholder="请填写Apgar Score" :disabled="props.disabled"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="生产方式" prop="babyChildbirthWay">
            <el-radio-group v-model="form.babyChildbirthWay" :disabled="props.disabled">
              <el-radio value="a"> 顺 </el-radio>
              <el-radio value="b"> 剖 </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生产异常情况" prop="babyAbnormalProduction">
            <el-checkbox-group v-model="babyAbnormalProductionList" :disabled="props.disabled">
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
            <el-radio-group v-model="form.babyBcg" :disabled="props.disabled">
              <el-radio value="1"> 有 </el-radio>
              <el-radio value="0"> 无 </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="乙肝疫苗" prop="babyHepatitisBVaccine">
            <el-radio-group v-model="form.babyHepatitisBVaccine" :disabled="props.disabled">
              <el-radio value="1"> 有 </el-radio>
              <el-radio value="0"> 无 </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="出生体重(g)" prop="babyBirthWeight">
            <el-input-number controls-position="right" v-model="form.babyBirthWeight" :min="1" :max="90000"
              placeholder="请填写出生体重" :disabled="props.disabled" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入住身长(cm)" prop="babyCheckInHeight">
            <el-input-number controls-position="right" v-model="form.babyCheckInHeight" :min="1" :max="500"
              placeholder="请填写入住身长" :disabled="props.disabled" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="头围(cm)" prop="babyHeadCircumference">
            <el-input-number controls-position="right" v-model="form.babyHeadCircumference" :min="1" :max="500"
              placeholder="请填写头围" :disabled="props.disabled" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="胸围(cm)" prop="babyChestCircumference">
            <el-input-number controls-position="right" v-model="form.babyChestCircumference" :min="1" :max="500"
              placeholder="请填写胸围" :disabled="props.disabled" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="哺喂方式" prop="babyFeedingMethod">
        <el-radio-group v-model="form.babyFeedingMethod" :disabled="props.disabled">
          <el-radio value="a"> 纯母乳 </el-radio>
          <el-radio value="b"> 混合 </el-radio>
          <el-radio value="c"> 配方奶 </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-divider content-position="left">婴儿重点评估项目</el-divider>
      <el-form-item label="皮肤" prop="babySkin">
        <el-checkbox-group v-model="babySkinList">
          <el-checkbox label="正常" value="y" />
          <el-checkbox label="黄疸" value="a" />
          <el-checkbox label="微血管增生" value="b" />
          <el-checkbox label="脂溢性皮炎" value="c" />
          <el-checkbox label="新生儿毒性红斑" value="d" />
          <el-checkbox label="新生儿粉刺" value="e" />
          <el-checkbox label="新生儿痤疮" value="f" />
          <el-checkbox label="蒙古斑" value="g" />
          <el-checkbox label="其他" value="z" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="头部" prop="babyHead">
        <el-checkbox-group v-model="babyHeadList">
          <el-checkbox label="正常" value="y" />
          <el-checkbox label="产瘤" value="a" />
          <el-checkbox label="血肿" value="b" />
          <el-checkbox label="伤口|破皮" value="c" />
          <el-checkbox label="其他" value="z" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="前囟门" prop="babyAnteriorFontanelle">
        <el-checkbox-group v-model="babyAnteriorFontanelleList">
          <el-checkbox label="正常" value="a" />
          <el-checkbox label="膨出" value="b" />
          <el-checkbox label="凹陷" value="c" />
          <el-checkbox label="闭合" value="d" />
          <el-checkbox label="其他" value="e" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="后囟门" prop="babyPosteriorFontanelle">
        <el-checkbox-group v-model="babyPosteriorFontanelleList">
          <el-checkbox label="正常" value="y" />
          <el-checkbox label="膨出" value="a" />
          <el-checkbox label="凹陷" value="b" />
          <el-checkbox label="闭合" value="c" />
          <el-checkbox label="其他" value="z" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="眼部" prop="babyEyes">
        <el-checkbox-group v-model="babyEyesList">
          <el-checkbox label="正常" value="y" />
          <el-checkbox label="有分泌物(L)" value="a" />
          <el-checkbox label="有分泌物(R)" value="b" />
          <el-checkbox label="巩膜异常(L)" value="c" />
          <el-checkbox label="巩膜异常(R)" value="d" />
          <el-checkbox label="结膜红(L)" value="e" />
          <el-checkbox label="结膜红(R)" value="f" />
          <el-checkbox label="鼻血管阻塞(L)" value="g" />
          <el-checkbox label="鼻血管阻塞(R)" value="h" />
          <el-checkbox label="其他" value="z" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="鼻部" prop="babyNose">
        <el-checkbox-group v-model="babyNoseList">
          <el-checkbox label="正常" value="y" />
          <el-checkbox label="有分泌物(L)" value="a" />
          <el-checkbox label="有分泌物(R)" value="b" />
          <el-checkbox label="其他" value="z" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="耳部" prop="babyEar">
        <el-checkbox-group v-model="babyEarList">
          <el-checkbox label="正常" value="y" />
          <el-checkbox label="有分泌物(L)" value="a" />
          <el-checkbox label="有分泌物(R)" value="b" />
          <el-checkbox label="耳前瘘管(L)" value="c" />
          <el-checkbox label="耳前瘘管(R)" value="d" />
          <el-checkbox label="耳前息肉(L)" value="e" />
          <el-checkbox label="耳前息肉(R)" value="f" />
          <el-checkbox label="低位耳" value="g" />
          <el-checkbox label="其他" value="z" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="口腔" prop="babyOral">
        <el-checkbox-group v-model="babyOralList">
          <el-checkbox label="正常" value="y" />
          <el-checkbox label="鹅口疮" value="a" />
          <el-checkbox label="唇裂" value="b" />
          <el-checkbox label="腭裂" value="c" />
          <el-checkbox label="舌系带过短" value="d" />
          <el-checkbox label="艾泼斯坦氏结节" value="e" />
          <el-checkbox label="咽峡部小水泡" value="f" />
          <el-checkbox label="其他" value="z" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="颈部" prop="babyNeck">
        <el-checkbox-group v-model="babyNeckList">
          <el-checkbox label="正常" value="y" />
          <el-checkbox label="其他" value="z" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="腹部" prop="babyAbdomen">
        <el-checkbox-group v-model="babyAbdomenList">
          <el-checkbox label="正常" value="y" />
          <el-checkbox label="胀气" value="a" />
          <el-checkbox label="其他" value="z" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="背部" prop="babyBack">
        <el-checkbox-group v-model="babyBackList">
          <el-checkbox label="正常" value="y" />
          <el-checkbox label="脊椎弯曲" value="a" />
          <el-checkbox label="其他" value="z" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="肛门" prop="babyAnus">
        <el-checkbox-group v-model="babyAnusList">
          <el-checkbox label="正常" value="y" />
          <el-checkbox label="肛裂" value="a" />
          <el-checkbox label="其他" value="z" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="胎便" prop="babyMeconium">
        <el-radio-group v-model="form.babyMeconium">
          <el-radio value="1"> 已解 </el-radio>
          <el-radio value="0"> 未解 </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="生殖器(男)-睾丸" prop="babyTestis">
        <el-checkbox-group v-model="babyTestisList">
          <el-checkbox label="已降(L)" value="a" />
          <el-checkbox label="已降(R)" value="b" />
          <el-checkbox label="未降(L)" value="c" />
          <el-checkbox label="未降(R)" value="d" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="生殖器(男)-阴囊" prop="babyScrotum">
        <el-checkbox-group v-model="babyScrotumList">
          <el-checkbox label="正常" value="y" />
          <el-checkbox label="其他" value="z" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="生殖器(女)" prop="babyFemaleGenitalia">
        <el-checkbox-group v-model="babyFemaleGenitaliaList">
          <el-checkbox label="假月经" value="a" />
          <el-checkbox label="白色分泌物" value="b" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="哭声" prop="babyCrying">
        <el-radio-group v-model="form.babyCrying">
          <el-radio value="a"> 洪亮 </el-radio>
          <el-radio value="b"> 微弱 </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="上肢" prop="babyUpperLimbs">
        <el-checkbox-group v-model="babyUpperLimbsList">
          <el-checkbox label="正常" value="y" />
          <el-checkbox label="异常" value="z" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="下肢" prop="babyLowerLimbs">
        <el-checkbox-group v-model="babyLowerLimbsList">
          <el-checkbox label="正常" value="y" />
          <el-checkbox label="异常" value="z" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="肌张力" prop="babyMuscleTone">
        <el-checkbox-group v-model="babyMuscleToneList">
          <el-checkbox label="正常" value="y" />
          <el-checkbox label="异常" value="z" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="寻乳反射" prop="babyBreastFeedingReflex">
        <el-radio-group v-model="form.babyBreastFeedingReflex">
          <el-radio value="1"> 有 </el-radio>
          <el-radio value="0"> 无 </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="抓握反射" prop="babyGraspReflex">
        <el-radio-group v-model="form.babyGraspReflex">
          <el-radio value="1"> 有 </el-radio>
          <el-radio value="0"> 无 </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-divider content-position="left">宝宝身体评估-重要信息统计</el-divider>
      <el-card style="max-width: 480px">
        <template #header>
          <div class="card-header">
            <span>黄疸记录</span>
            <el-radio-group v-model="form.babyJaundiceRecord">
              <el-radio value="1"> 记录数据 </el-radio>
              <el-radio value="0"> 无此需求 </el-radio>
            </el-radio-group>
          </div>
        </template>
        <el-form-item label="黄疸(mg/dl)" prop="babyJaundice">
          <el-input v-model="form.babyJaundice" placeholder="请填写黄疸" />
        </el-form-item>
        <el-form-item label="体重(g)" prop="babyJaundiceWeight">
          <el-input-number controls-position="right" v-model="form.babyJaundiceWeight" :min="1" :max="500"
            placeholder="请填写体重" />
        </el-form-item>
        <el-form-item label="生理体重下降" prop="babyPhysiologicalWeightLoss">
          -
        </el-form-item>
        <el-form-item label="体重增长" prop="babyWeightGain"> - </el-form-item>
      </el-card>
      <el-divider content-position="left">记录时间</el-divider>
      <el-form-item label="检查时间" prop="babyTime">
        <el-date-picker v-model="form.babyTime" type="datetime" placeholder="请选择检查时间" format="YYYY-MM-DDTHH:mm:ss"
          value-format="YYYY-MM-DDTHH:mm:ss" style="width: 100%" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
      </el-form-item>
    </el-form>
    <div class="dialog-footer" style="margin-top: 10px">
      <el-button type="primary" @click="submitForm">提 交</el-button>
      <el-button type="danger" @click="delFun">删 除</el-button>
    </div>
  </div>
</template>
<script setup name="babyform">
import { onMounted, ref } from "vue";
import { addBaby, updateBaby, delBaby } from "@/api/senbei/baby";

const { proxy } = getCurrentInstance();
const emits = defineEmits(["onOk", "onDel"]);
const props = defineProps(["datas", "info", "roomOptions", "disabled"]);

const form = ref({});
const rules = {
  babyName: [{ required: true, message: "昵称不能为空", trigger: "blur" }],
  babyTime: [{ required: true, message: "检查时间不能为空", trigger: "blur" }],
  remark: [{ required: true, message: "备注不能为空", trigger: "blur" }],
};

const babyAbnormalProductionList = ref([]); // 生产异常情况
const babySkinList = ref([]); // 皮肤
const babyHeadList = ref([]); // 头部
const babyAnteriorFontanelleList = ref([]); // 前囟门
const babyPosteriorFontanelleList = ref([]); // 后囟门
const babyEyesList = ref([]); // 眼部
const babyNoseList = ref([]); // 鼻部
const babyEarList = ref([]); // 耳部
const babyOralList = ref([]); // 口腔
const babyNeckList = ref([]); // 颈部
const babyAbdomenList = ref([]); // 腹部
const babyBackList = ref([]); // 背部
const babyAnusList = ref([]); // 肛门
const babyTestisList = ref([]); // 睾丸
const babyScrotumList = ref([]); // 阴囊
const babyFemaleGenitaliaList = ref([]); // 女性生殖器
const babyUpperLimbsList = ref([]); // 上肢
const babyLowerLimbsList = ref([]); // 下肢
const babyMuscleToneList = ref([]); // 肌张力

const title = ref("");
function delFun() {
  if (form.value.babyId) {
    proxy.$modal
      .confirm('是否确认删除婴儿ID为"' + form.value.babyId + '"的数据项？')
      .then(function () {
        return delBaby(form.value.babyId).then((response) => {
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
      form.value.babyAbnormalProduction = toStr(
        babyAbnormalProductionList.value
      );
      form.value.babySkin = toStr(babySkinList.value);
      form.value.babyHead = toStr(babyHeadList.value);
      form.value.babyAnteriorFontanelle = toStr(
        babyAnteriorFontanelleList.value
      );
      form.value.babyPosteriorFontanelle = toStr(
        babyPosteriorFontanelleList.value
      );
      form.value.babyEyes = toStr(babyEyesList.value);
      form.value.babyNose = toStr(babyNoseList.value);
      form.value.babyEar = toStr(babyEarList.value);
      form.value.babyOral = toStr(babyOralList.value);
      form.value.babyNeck = toStr(babyNeckList.value);
      form.value.babyAbdomen = toStr(babyAbdomenList.value);
      form.value.babyBack = toStr(babyBackList.value);
      form.value.babyAnus = toStr(babyAnusList.value);
      form.value.babyTestis = toStr(babyTestisList.value);
      form.value.babyScrotum = toStr(babyScrotumList.value);
      form.value.babyFemaleGenitalia = toStr(babyFemaleGenitaliaList.value);
      form.value.babyUpperLimbs = toStr(babyUpperLimbsList.value);
      form.value.babyMuscleTone = toStr(babyMuscleToneList.value);

      if (form.value.babyId != undefined) {
        updateBaby(form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          emits("onOk", form.value.babyId);
        });
      } else {
        addBaby(form.value).then((response) => {
          proxy.$modal.msgSuccess("新增成功");
          form.value.babyId = response
          emits("onOk", form.value.babyId);
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
    form.value = props.datas;

    form.value.archivalId = props.info?.archivalId

    babyAbnormalProductionList.value = toList(
      form.value.babyAbnormalProduction
    );
    babySkinList.value = toList(form.value.babySkin);
    babyHeadList.value = toList(form.value.babyHead);
    babyAnteriorFontanelleList.value = toList(
      form.value.babyAnteriorFontanelle
    );
    babyPosteriorFontanelleList.value = toList(
      form.value.babyPosteriorFontanelle
    );
    babyEyesList.value = toList(form.value.babyEyes);
    babyNoseList.value = toList(form.value.babyNose);
    babyEarList.value = toList(form.value.babyEar);
    babyOralList.value = toList(form.value.babyOral);
    babyNeckList.value = toList(form.value.babyNeck);
    babyAbdomenList.value = toList(form.value.babyAbdomen);
    babyBackList.value = toList(form.value.babyBack);
    babyAnusList.value = toList(form.value.babyAnus);
    babyTestisList.value = toList(form.value.babyTestis);
    babyScrotumList.value = toList(form.value.babyScrotum);
    babyFemaleGenitaliaList.value = toList(form.value.babyFemaleGenitalia);
    babyUpperLimbsList.value = toList(form.value.babyUpperLimbs);
    babyMuscleToneList.value = toList(form.value.babyMuscleTone);
  }
});
</script>
