<template>
    <el-row style="margin: 5px 5px;">
        <el-col :span="12">
            <el-select v-model="floosValues" multiple filterable @change="onSelectChange" placeholder="筛选楼层"
                style="min-width: 200px; width: 20%" clearable>
                <el-option v-for="item in floors" :key="item.label" :label="item.label" :value="item.value" />
            </el-select>
            <el-divider direction="vertical" />
            <el-date-picker v-model="datepicker" type="daterange" unlink-panels range-separator="To"
                start-placeholder="开始时间" end-placeholder="截至时间" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                @change="onChange" />
        </el-col>
        <el-col :span="6">

        </el-col>
        <el-col :span="6">
            <div>
                <el-color-picker v-model="colorObj.a" /> 使用中
                <el-color-picker v-model="colorObj.b" /> 维修
                <el-color-picker v-model="colorObj.c" /> 预定
                <el-color-picker v-model="colorObj.d" /> 空闲
                <el-color-picker v-model="colorObj.e" /> 停用
            </div>
        </el-col>
    </el-row>

    <el-row :gutter="20" style="margin: 12px 5px;">
        <el-col :xs="12" :sm="12" :lg="6" style="margin-bottom: 10px;" v-for="item in rows" :key="item.id">
            <el-card class="centered-title" :style="{ backgroundColor: getColor(item.status) }" shadow="hover"
                @click="onCardChange(item)">
                <template #header>{{ item.title }}</template>
                <div class="cardbody">
                    宝妈：{{ item.momName }}
                    <p />
                    宝宝：{{ item.babyName }}
                    <p />
                    起止日：{{ item.start }} ~ {{ item.end }}
                    <p />
                    状态：{{ statusToStr(item.status) }}
                </div>

            </el-card>
        </el-col>
    </el-row>
    <Edit ref="editRef" @onClose="getList" :appOptions="appOptions" :roomOptions="roomOptions" />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getRooms, getRoomFloors } from "@/api/senbei/room";
import Edit from "../../nursing/archival/edit.vue";
import { getAppList, getRoomList } from "@/api/senbei/archival";
import { ElLoading } from 'element-plus'

const { proxy } = getCurrentInstance();

const rows = ref([])
const floors = ref([])
const floosValues = ref([])
const floorStrs = ref("")

const colorObj = ref({
    a: "#70ad47",
    b: "#ffc000",
    c: "#5b9bd5",
    d: "#fff",
    e: "#f92658",
})

const datepicker = ref()

const editRef = ref()
const appOptions = ref([])
const roomOptions = ref([])
function onCardChange(item) {
    proxy.$modal.loading("loading")
    if (item.archivalId && item.archivalId > 0) {
        editRef.value?.handleUpdate(item.archivalId);
        proxy.$modal.closeLoading()
    } else {
        editRef.value?.handleAdd(item.id);
        proxy.$modal.closeLoading()
    }
}

function onChange(e) {
    getList()
}

function getList() {
    proxy.$modal.loading("loading")
    
    let query = {
        roomFloors: floorStrs.value
    }
    if (datepicker.value && datepicker.value.length > 1) {
        query.beginTime = datepicker.value[0]
        query.endTime = datepicker.value[1]
    }
    getRoomList().then((response) => {
        roomOptions.value = response;
    });
    getAppList().then((response) => {
        appOptions.value = response;
    });
    getRooms(query).then(response => {
        rows.value = response
        proxy.$modal.closeLoading()
    });

}
function onSelectChange(e) {
    let fs = ""
    for (let index = 0; index < e.length; index++) {
        const element = e[index];
        if (fs == "") {
            fs = element
        } else {
            fs = fs + "," + element
        }
    }
    floorStrs.value = fs
    getList()
}

//（0停用 1使用中 2未使用 3维修中）
function statusToStr(status) {
    if (status === '0') {
        return "停用"
    }
    if (status === '1') {
        return "使用中"
    }
    if (status === '2') {
        return "维修中"
    }
    if (status === '3') {
        return "空闲中"
    }
    if (status === '4') {
        return "预定中"
    }
}

//（0停用 1使用中 2未使用 3维修中）
function getColor(status) {
    if (status === '0') {
        return colorObj.value.e // 停用
    }
    if (status === '1') {
        return colorObj.value.a // 使用中 "#70ad47"
    }
    if (status === '2') {
        return colorObj.value.b // 维修 "#ffc000"
    }
    if (status === '3') {
        return colorObj.value.d // 空闲 "#ffc000"
    }
    if (status === '4') {
        return colorObj.value.c // 预定 "#5b9bd5"
    }
}

onMounted(() => {
    getRoomFloors().then(response => {
        floors.value = response
    });
    getList()
})
</script>

<style scoped>
.centered-title {
    /* background-color: #ffc000; */
    border-radius: 50px;
    text-align: center;
}

.cardbody {
    text-align: left;
}
</style>