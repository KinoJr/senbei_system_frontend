<template>
  <el-drawer v-model="drawerShow" direction="rtl" size="95%" style="max-width: 800px;" :destroy-on-close="true" @close="onclose">
    <template #header>
      <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect" :ellipsis="false">
        <el-menu-item index="1" :disabled="archivalType === 'c'">
          宝妈每日检查
        </el-menu-item>
        <el-menu-item index="2" :disabled="archivalType === 'b'"> 婴儿每日检查
        </el-menu-item>
      </el-menu>
      <el-text style="float: left;" type="success">检查编号:{{ groupNo }}</el-text>
    </template>
    <template #default>
      <ul class="infinite-list" style="overflow: auto">
        <el-card style="width: 100%">
          <template #header v-if="activeIndex === '2'">
            <el-steps :active="active" finish-status="success" align-center style="width: 100%;" :simple="true">
              <el-step :title="item.title" v-for="item in stepList" :key="item.title" />
            </el-steps>
          </template>

          <div>
            <Momform v-if="activeIndex === '1' && momDatas" :datas="momDatas" :info="archivalInfo"
              :roomOptions="props.roomOptions" @onOk="onSpmOk()" :disabled="true" />

            <Babyform v-if="activeIndex === '2' && stepList[active]" :key="active" :disabled="true"
              :datas="stepList[active].args" :info="archivalInfo" @onOk="(id) => { onSpmOk() }" />
          </div>
        </el-card>
      </ul>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">取消</el-button>
        <el-button v-if="stepList.length > 1 && active > 0" type="primary" @click="previousPage">上一页</el-button>
        <el-button v-if="stepList.length > 1 && (stepList.length - 1) > active && activeIndex === '2'" type="primary"
          @click="nextPage">下一页</el-button>
        <el-button type="primary" @click="onOk">完成</el-button>
      </div>
    </template>
  </el-drawer>
</template>
<script setup name="ExamineEveryday">
import { ref } from "vue";
import { getMomAndBabyList } from "@/api/senbei/mom";
import { getDailyCheckInfo } from "@/api/senbei/archival";
import Momform from "./momform.vue";
import Babyform from "./babyform.vue";
import { v4 as uuidv4 } from 'uuid';

const { proxy } = getCurrentInstance();
const emits = defineEmits(["onClose"]);
const props = defineProps(["roomOptions"]);

const activeIndex = ref("1");
const momDatas = ref({});

const groupNo = ref(""); // 检查组编号
const dateTime = ref(""); // 检查组编号

// 入馆档案ID
const archivalId = ref();
const archivalType = ref();
const archivalInfo = ref({});

const drawerShow = ref(false);
const isEdit = ref(false);

const stepList = ref([]);

const active = ref(0);
function previousPage() {
  active.value = active.value - 1;
}
function nextPage() {
  active.value++;
}

function handleSelect(e) {
  activeIndex.value = e
  getList();
}

function onSpmOk() {
  isEdit.value = true
  getList()
}

/** 新增按钮操作 */
function handleAdd(row, timp) {
  archivalId.value = row.archivalId;
  archivalType.value = row.archivalType;
  archivalInfo.value = row;
  activeIndex.value = row.archivalType === "c" ? "2" : "1";
  dateTime.value = timp

  groupNo.value = uuidv4();
  isEdit.value = false

  active.value = 0;
  drawerShow.value = true;
  getList();
}

/** 修改按钮操作 */
function handleUpdate(row, gNo) {
  archivalId.value = row.archivalId;
  archivalType.value = row.archivalType;
  archivalInfo.value = row;
  activeIndex.value = row.archivalType === "c" ? "2" : "1";

  groupNo.value = gNo
  isEdit.value = true

  active.value = 0;
  drawerShow.value = true;
  getList();
}

/** 取消按钮 */
function cancel() {
  drawerShow.value = false;
}
/** 完成按钮 */
function onOk() {
  const array = stepList.value;
  for (let index = 0; index < array.length; index++) {
    if (array[index].id === undefined && array[index].title != "宝妈档案") {
      proxy.$modal.msgError("存在未提交婴儿档案,请提交所有档案后继续");
      return;
    }
  }
  drawerShow.value = false;
}

// 获取首日检查记录
function getList() {
  momDatas.value = undefined
  stepList.value = [];

  // 获取首日检查记录
  getMomAndBabyList(archivalId.value, archivalType.value).then((response) => {
    let array = []
    if (!(response.mom && response.mom.momId) && archivalType.value !== 'c') {
      proxy.$modal.msgWarning("未找到宝妈首日检查记录");
      drawerShow.value = false;
    }

    if (response.babyList) {
      array = response.babyList;
    } else {
      if (archivalType.value === 'c') {
        proxy.$modal.msgWarning("未找到宝宝首日检查记录");
        // 若非首日按钮进入，则关闭弹窗
        drawerShow.value = false;
      }
    }

    if (isEdit.value) {
      getDailyCheckInfo(groupNo.value).then(res => {
        const mom = res.mom
        const babyList = res.babyList || []

        // 基础信息从首日信息获取
        if (response.mom) {
          momDatas.value = setMomInfo(mom, response.mom)
          dateTime.value = momDatas.value.momTime
        }

        // 构建婴儿信息
        for (let index = 0; index < array.length; index++) {
          let baby = {}

          let has = false
          for (let i = 0; i < babyList.length; i++) {
            const info = babyList[i]
            if (info.babyName == array[index].babyName) {
              // 基础信息从首日信息获取
              baby = setBabyInfo(info, array[index])
              has = true
            }
          }
          if (!has) {
            baby = setBabyInfo({}, array[index])
          }
          stepList.value.push({
            title: "婴儿档案" + (index + 1),
            id: baby.babyId,
            args: baby,
          });
        }
      })
    } else {
      if (archivalType.value !== 'c') {
        // 构建宝妈信息
        momDatas.value = setMomInfo({}, response.mom)
      }
      if (archivalType.value !== 'b') {
        // 构建婴儿信息
        for (let index = 0; index < array.length; index++) {
          const baby = setBabyInfo({}, array[index])
          stepList.value.push({
            title: "婴儿档案" + (index + 1),
            id: baby.babyId,
            args: baby
          });
        }
      }
    }
  });
}

// 设置宝妈基础信息
function setMomInfo(mom, base) {
  mom.groupNo = groupNo.value
  mom.momTime = mom.momTime || dateTime.value
  mom.momStatus = mom.momStatus || "0"

  mom.momRoomId = base.momRoomId
  mom.momName = base.momName
  mom.momAge = base.momAge
  mom.momCheckInTime = base.momCheckInTime
  mom.momContact = base.momContact
  mom.momWeight = base.momWeight
  mom.momChildbirthDate = base.momChildbirthDate
  mom.momChildbirthHospital = base.momChildbirthHospital
  mom.momChildbirthCycle = base.momChildbirthCycle
  mom.momChildbirthNum = base.momChildbirthNum
  mom.momChildbirthWay = base.momChildbirthWay
  mom.momBabySex = base.momBabySex
  mom.momFeeding = base.momFeeding
  mom.momMedical = base.momMedical
  mom.momCold = base.momCold
  mom.momComplicationsOfChildbirth = base.momComplicationsOfChildbirth
  mom.momFoodAllergies = base.momFoodAllergies
  mom.momAllergyToMedication = base.momAllergyToMedication

  return mom
}

// 设置婴儿基础信息
function setBabyInfo(baby, base) {
  baby.groupNo = groupNo.value
  baby.babyTime = baby.babyTime || dateTime.value
  baby.babyStatus = baby.babyStatus || "0"

  baby.babyName = base.babyName
  baby.babyBirthDate = base.babyBirthDate
  baby.babyChildbirthCycle = base.babyChildbirthCycle
  baby.babyApgarScore = base.babyApgarScore
  baby.babyChildbirthWay = base.babyChildbirthWay
  baby.babyAbnormalProduction = base.babyAbnormalProduction
  baby.babyBcg = base.babyBcg
  baby.babyHepatitisBVaccine = base.babyHepatitisBVaccine
  baby.babyBirthWeight = base.babyBirthWeight
  baby.babyCheckInHeight = base.babyCheckInHeight
  baby.babyHeadCircumference = base.babyHeadCircumference
  baby.babyChestCircumference = base.babyChestCircumference
  baby.babyFeedingMethod = base.babyFeedingMethod
  return baby
}

// 关闭时回调
function onclose() {
  emits("onClose");
}

defineExpose({
  handleAdd,
  handleUpdate,
});
</script>
