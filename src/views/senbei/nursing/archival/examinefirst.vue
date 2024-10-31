<template>
  <el-drawer v-model="drawerShow" direction="rtl" size="95%" style="max-width: 800px;" :destroy-on-close="true"
    @close="onclose">
    <template #header>
      <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect" :ellipsis="false">
        <el-menu-item index="1" :disabled="archivalType === 'c'">
          宝妈首日检查
        </el-menu-item>
        <el-menu-item index="2" :disabled="archivalType === 'b'"> 婴儿首日检查 </el-menu-item>
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
              :roomOptions="props.roomOptions" @onOk="getList()" />

            <Babyform v-if="activeIndex === '2' && stepList[active]" :key="active" :datas="stepList[active].args"
              :info="archivalInfo" @onOk="(id) => {
    stepList[active].id = id;
    getList;
  }" @onDel="delBaby" />
          </div>
        </el-card>
      </ul>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">取消</el-button>
        <el-button v-if="stepList.length > 1 && active > 0 && activeIndex === '2'" type="primary"
          @click="previousPage">上一页</el-button>
        <el-button v-if="stepList.length > 1 && activeIndex === '2'" type="primary" @click="nextPage">下一页</el-button>
        <el-button v-if="archivalType !== 'c' && activeIndex === '2'" type="primary"
          @click="addBabyInfo">录入婴儿档案</el-button>
        <el-button type="primary" @click="onOk">完成</el-button>
      </div>
    </template>
  </el-drawer>
</template>
<script setup name="ExamineFirst">
import { ref } from "vue";
import { getMomAndBabyList } from "@/api/senbei/mom";
import Momform from "./momform.vue";
import Babyform from "./babyform.vue";
import { v4 as uuidv4 } from 'uuid';

const { proxy } = getCurrentInstance();
const emits = defineEmits(["onClose"]);
const props = defineProps(["roomOptions"]);

const activeIndex = ref("1");
const momDatas = ref({});

const groupNo = ref(""); // 检查组编号

// 入馆档案ID
const archivalId = ref();
const archivalType = ref();
const archivalInfo = ref({});

const drawerShow = ref(false);

const stepList = ref([]);

const active = ref(0);
function previousPage() {
  active.value = active.value - 1;
}
function nextPage() {
  active.value++;
}

function addBabyInfo() {
  const array = stepList.value;
  for (let index = 0; index < array.length; index++) {
    if (array[index].id === undefined) {
      proxy.$modal.msgError("存在未提交档案,请提交所有档案后继续");
      return;
    }
  }

  stepList.value.push({
    title: "婴儿档案" + stepList.value.length,
    args: {
      groupNo: groupNo.value,
      babyStatus: "1"
    }
  });
  active.value = stepList.value.length - 1;
}
function handleSelect(e) {
  activeIndex.value = e
  getList();
}

/** 修改按钮操作 */
function handleUpdate(row) {
  archivalId.value = row.archivalId;
  archivalType.value = row.archivalType;
  archivalInfo.value = row;
  activeIndex.value = row.archivalType === "c" ? "2" : "1";

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
  if (archivalType.value === 'c') {
    const array = stepList.value;
    for (let index = 0; index < array.length; index++) {
      if (array[index].id === undefined && array[index].title != "宝妈档案") {
        proxy.$modal.msgError("存在未提交婴儿档案,请提交所有档案后继续");
        return;
      }
    }
  }

  drawerShow.value = false;
}
/** 删除婴儿 */
function delBaby() {
  active.value--;
  getList();
}

// 获取检查记录
function getList() {
  momDatas.value = undefined
  stepList.value = [];
  groupNo.value = undefined

  getMomAndBabyList(archivalId.value, archivalType.value).then((response) => {
    // 判断是否需要生成uuid
    let a = response.mom ? response.mom.groupNo : undefined
    let b = response.babyList ? response.babyList[0].groupNo : undefined
    let c = a || b
    groupNo.value = c || uuidv4()

    if (response.mom && response.mom.momId) {
      momDatas.value = response.mom
      groupNo.value = response.mom.groupNo
    } else {
      if (archivalType.value !== 'c' && activeIndex.value === "1") {
        proxy.$modal.msgWarning("未找到宝妈首日检查记录");
        momDatas.value = {
          groupNo: groupNo.value,
          momStatus: "1"
        }
      }
    }
    if (response.babyList) {
      const array = response.babyList;
      for (let index = 0; index < array.length; index++) {
        stepList.value.push({
          title: "婴儿档案" + (index + 1),
          id: array[index].babyId,
          args: array[index],
        });
      }
    } else {
      if (archivalType.value !== 'b' && activeIndex.value === "2") {
        proxy.$modal.msgWarning("未找到宝宝首日检查记录");
      }
      stepList.value.push({
        title: "婴儿档案1",
        args: {
          groupNo: groupNo.value,
          babyStatus: "1"
        }
      });
    }
  });
}

// 关闭时回调
function onclose() {
  emits("onClose");
}

defineExpose({
  handleUpdate,
});
</script>
