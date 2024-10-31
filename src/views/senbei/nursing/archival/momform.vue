<template>
  <div>
    <el-form ref="formRef" :model="form" :rules="rules">
      <el-divider content-position="left">入住情况</el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="房号" prop="momRoomId">
            <el-select v-model="form.momRoomId" filterable placeholder="请选择房号" style="width: 100%" :disabled="true">
              <el-option v-for="item in props.roomOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名" prop="momName">
            <el-input v-model="form.momName" placeholder="请填写宝妈姓名" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年龄" prop="momAge">
            <el-input-number controls-position="right" v-model="form.momAge" :min="1" :max="500" placeholder="请填写宝妈年龄"
              :disabled="props.disabled" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="入住时间" prop="momCheckInTime">
            <el-date-picker v-model="form.momCheckInTime" type="date" placeholder="请选择入住时间" format="YYYY-MM-DD"
              value-format="YYYY-MM-DD" style="width: 100%" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系方式" prop="momContact">
            <el-input v-model="form.momContact" placeholder="请填写联系方式" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="体重(kg)" prop="momWeight">
            <el-input-number controls-position="right" v-model="form.momWeight" :min="1" :max="500" placeholder="请填写体重"
              :disabled="props.disabled" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider content-position="left">产妇分娩信息</el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="分娩日期" prop="momChildbirthDate">
            <el-date-picker v-model="form.momChildbirthDate" type="date" placeholder="请选择分娩日期" format="YYYY-MM-DD"
              value-format="YYYY-MM-DD" style="width: 100%" :disabled="props.disabled" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分娩医院" prop="momChildbirthHospital">
            <el-input v-model="form.momChildbirthHospital" placeholder="请填写分娩医院" :disabled="props.disabled" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分娩周期" prop="momChildbirthCycle">
            <el-input v-model="form.momChildbirthCycle" placeholder="请填写分娩周期" :disabled="props.disabled" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="胎次" prop="momChildbirthNum">
            <el-input-number controls-position="right" v-model="form.momChildbirthNum" :min="1" :max="500"
              placeholder="请填写胎次" :disabled="props.disabled" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分娩方式" prop="momChildbirthWay">
            <el-radio-group v-model="form.momChildbirthWay" :disabled="props.disabled">
              <el-radio value="a"> 顺 </el-radio>
              <el-radio value="b"> 剖 </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="新生儿性别" prop="momBabySex">
            <el-radio-group v-model="form.momBabySex" :disabled="props.disabled">
              <el-radio value="a"> 男 </el-radio>
              <el-radio value="b"> 女 </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="喂养方式" prop="momFeeding">
        <el-radio-group v-model="form.momFeeding" :disabled="props.disabled">
          <el-radio value="a"> 母乳喂养 </el-radio>
          <el-radio value="b"> 人工喂养 </el-radio>
          <el-radio value="c"> 混合喂养 </el-radio>
        </el-radio-group>
        <!-- <el-checkbox-group v-model="momFeedingList" :disabled="props.disabled">
          <el-checkbox label="母乳喂养" value="a" />
          <el-checkbox label="人工喂养" value="b" />
          <el-checkbox label="混合喂养" value="c" />
        </el-checkbox-group> -->
      </el-form-item>
      <el-divider content-position="left">产妇重要信息</el-divider>
      <el-form-item label="疾病史" prop="momMedical">
        <el-checkbox-group v-model="momMedicalList" :disabled="props.disabled">
          <el-checkbox label="无" value="a" />
          <el-checkbox label="妊娠糖尿病" value="b" />
          <el-checkbox label="子痫症" value="c" />
          <el-checkbox label="大三阳" value="d" />
          <el-checkbox label="小三阳" value="e" />
          <el-checkbox label="其他" value="z" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="产妇一周内家人有疑似感冒的症状" prop="momCold">
        <el-radio-group v-model="form.momCold" :disabled="props.disabled">
          <el-radio value="1"> 是 </el-radio>
          <el-radio value="0"> 否 </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="分娩合并症" prop="momComplicationsOfChildbirth" label-width="90px">
        <el-checkbox-group v-model="momComplicationsOfChildbirthList" :disabled="props.disabled">
          <el-checkbox label="无" value="x" />
          <el-checkbox label="妊娠糖尿病" value="a" />
          <el-checkbox label="子痫症" value="b" />
          <el-checkbox label="大三阳" value="c" />
          <el-checkbox label="小三阳" value="d" />
          <el-checkbox label="其他" value="z" />
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="食物过敏" prop="momFoodAllergies">
        <el-radio-group v-model="form.momFoodAllergies" :disabled="props.disabled">
          <el-radio value="1"> 有 </el-radio>
          <el-radio value="0"> 无 </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="用药过敏" prop="momAllergyToMedication">
        <el-radio-group v-model="form.momAllergyToMedication" :disabled="props.disabled">
          <el-radio value="1"> 有 </el-radio>
          <el-radio value="0"> 无 </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-divider content-position="left">产妇身体评估结果</el-divider>
      <el-form-item label="体重(g)" prop="momAdmissionWeight">
        <el-input-number controls-position="right" v-model="form.momAdmissionWeight" :min="1" :max="99999"
          placeholder="请填写体重" />
      </el-form-item>
      <el-form-item label="精神" prop="momSpirit">
        <el-radio-group v-model="form.momSpirit">
          <el-radio value="a"> 愉悦 </el-radio>
          <el-radio value="b"> 疲惫 </el-radio>
          <el-radio value="c"> 郁闷 </el-radio>
          <el-radio value="d"> 平稳 </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="食欲" prop="momAppetite">
        <el-radio-group v-model="form.momAppetite">
          <el-radio value="a"> 好 </el-radio>
          <el-radio value="b"> 可 </el-radio>
          <el-radio value="c"> 差 </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="乳房状态" prop="momBreastStatus">
        <el-checkbox-group v-model="momBreastStatusList">
          <el-checkbox label="充盈" value="a" />
          <el-checkbox label="软" value="b" />
          <el-checkbox label="亲哺移除乳汁后有硬块" value="c" />
          <el-checkbox label="散在性硬结" value="d" />
          <el-checkbox label="肿胀" value="e" />
          <el-checkbox label="乳腺炎" value="f" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="乳汁" prop="momMilkVolume">
        <el-radio-group v-model="form.momMilkVolume">
          <el-radio value="a"> 无 </el-radio>
          <el-radio value="b"> 微 </el-radio>
          <el-radio value="c"> 少 </el-radio>
          <el-radio value="d"> 中 </el-radio>
          <el-radio value="e"> 多 </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="乳头" prop="momNipple">
        <el-checkbox-group v-model="momNippleList">
          <el-checkbox label="正常" value="y" />
          <el-checkbox label="乳头平(短L)" value="a" />
          <el-checkbox label="乳头平(短R)" value="b" />
          <el-checkbox label="破皮(L)" value="c" />
          <el-checkbox label="破皮(R)" value="d" />
          <el-checkbox label="凹陷(L)" value="e" />
          <el-checkbox label="凹陷(R)" value="f" />
          <el-checkbox label="其他" value="z" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="是否挤奶" prop="momMilkingOrNot">
        <el-radio-group v-model="form.momMilkingOrNot">
          <el-radio value="0"> 否 </el-radio>
          <el-radio value="1"> 是 </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="宫体" prop="momPalace">
        <el-radio-group v-model="form.momPalace">
          <el-radio value="a"> 入盆 </el-radio>
          <el-radio value="b"> 按摩软转硬 </el-radio>
          <el-radio value="c"> 硬 </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="宫底" prop="momFundus">
        <el-radio-group v-model="form.momFundus">
          <el-radio value="a"> 入盆 </el-radio>
          <el-radio value="b"> 未入盆 </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="恶露" prop="momLochia">
        <el-radio-group v-model="form.momLochia">
          <el-radio value="x"> 无 </el-radio>
          <el-radio value="a"> 微量 </el-radio>
          <el-radio value="b"> 少量 </el-radio>
          <el-radio value="c"> 中量 </el-radio>
          <el-radio value="d"> 大量 </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="恶露颜色" prop="momLochiaColor">
        <el-radio-group v-model="form.momLochiaColor">
          <el-radio value="x"> 无 </el-radio>
          <el-radio value="a"> 黄白 </el-radio>
          <el-radio value="b"> 淡红 </el-radio>
          <el-radio value="c"> 鲜红 </el-radio>
          <el-radio value="d"> 暗红 </el-radio>
          <el-radio value="e"> 褐色 </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="伤口(顺/剖)" prop="momWound">
        <el-checkbox-group v-model="momWoundList">
          <el-checkbox label="愈合" value="a" />
          <el-checkbox label="未愈合" value="b" />
          <el-checkbox label="红" value="c" />
          <el-checkbox label="肿" value="d" />
          <el-checkbox label="痛" value="e" />
          <el-checkbox label="渗液" value="f" />
          <el-checkbox label="敷料覆盖待评估" value="g" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="双下肢水肿" prop="momLowerLimbEdema">
        <el-checkbox-group v-model="momLowerLimbEdemaList">
          <el-checkbox label="左" value="a" />
          <el-checkbox label="右" value="b" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="痔疮" prop="momHemorrhoid">
        <el-radio-group v-model="form.momHemorrhoid">
          <el-radio value="1"> 有 </el-radio>
          <el-radio value="0"> 无 </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="有无腹带" prop="momCummerbund">
        <el-radio-group v-model="form.momCummerbund">
          <el-radio value="0"> 否 </el-radio>
          <el-radio value="1"> 是 </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="客户签字" prop="momCustomerSignature">
        <ImageUpload v-if="form.groupNo" :limit="1" :fileSize="5" :uploadUrl="`/senbei/archival/uploadSignImg`"
          :imgUrl="form.momCustomerSignature && form.momCustomerSignature != '#' ? baseImg + form.momCustomerSignature : undefined"
          @update:modelValue="onUpload" />
      </el-form-item>

      <el-divider content-position="left">记录时间</el-divider>
      <el-form-item label="检查时间" prop="momTime">
        <el-date-picker v-model="form.momTime" type="datetime" placeholder="请选择检查时间" format="YYYY-MM-DDTHH:mm:ss"
          value-format="YYYY-MM-DDTHH:mm:ss" style="width: 100%" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
      </el-form-item>
    </el-form>
    <div class="dialog-footer" style="margin-top: 10px;">
      <el-button type="primary" @click="submitForm">提 交</el-button>
    </div>
  </div>
</template>
<script setup name="momfrom">
import { onMounted, ref, getCurrentInstance } from "vue";
import { addMom, updateMom } from "@/api/senbei/mom";

const baseImg = import.meta.env.VITE_APP_FILE

const { proxy } = getCurrentInstance();
const emits = defineEmits(["onOk"]);
const props = defineProps(["datas", "info", "roomOptions", "disabled"]);


const form = ref({});
const rules = {
  momTime: [{ required: true, message: "检查时间不能为空", trigger: "blur" }],
  remark: [{ required: true, message: "备注不能为空", trigger: "blur" }],
  name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
  age: [{ required: true, message: "年龄不能为空", trigger: "blur" }],
};

const momWoundList = ref([]); // 伤口
const momLowerLimbEdemaList = ref([]); // 双下肢水肿
const momMedicalList = ref([]); // 疾病史
const momComplicationsOfChildbirthList = ref([]); // 分娩合并
const momNippleList = ref([]); // 乳头
const momBreastStatusList = ref([]); // 乳房状态

function onUpload(fileName) {
  if (fileName) {
    form.value.momCustomerSignature = fileName
    return
  }
  form.value.momCustomerSignature = "#"
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["formRef"].validate((valid) => {
    if (valid) {
      form.value.momWound = toStr(momWoundList.value);
      form.value.momLowerLimbEdema = toStr(momLowerLimbEdemaList.value);
      form.value.momMedical = toStr(momMedicalList.value);
      form.value.momComplicationsOfChildbirth = toStr(
        momComplicationsOfChildbirthList.value
      );
      form.value.momNipple = toStr(momNippleList.value);
      form.value.momBreastStatus = toStr(momBreastStatusList.value);
      form.value.momStatus = "1"
      if (form.value.momId != undefined) {
        updateMom(form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          emits("onOk", form.value.momId);
        });
      } else {
        addMom(form.value).then((response) => {
          proxy.$modal.msgSuccess("新增成功");
          form.value.momId = response
          emits("onOk", form.value.momId);
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
    form.value.momRoomId = props.info?.archivalRoomId
    form.value.momName = props.info?.archivalName
    form.value.momContact = props.info?.archivalPhone
    form.value.momCheckInTime = props.info?.archivalStartDate

    momWoundList.value = toList(form.value.momWound);
    momLowerLimbEdemaList.value = toList(form.value.momLowerLimbEdema);
    momMedicalList.value = toList(form.value.momMedical);
    momComplicationsOfChildbirthList.value = toList(
      form.value.momComplicationsOfChildbirth
    );
    momNippleList.value = toList(form.value.momNipple);
    momBreastStatusList.value = toList(form.value.momBreastStatus);
  }
});
</script>
