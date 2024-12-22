<template>
  <div class="dashboard-editor-container">
    <el-date-picker v-model="dateTime" type="datetimerange" start-placeholder="开始时间" end-placeholder="截至时间"
      format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" date-format="YYYY-MM-DD HH:mm:ss"
      time-format="HH:mm:ss" @change="initStatistic" />
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col" @click="onClickUser(statistic.userNum)">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              客户
            </div>
            <div class="card-panel-text">
              {{ statistic.userNum }}
            </div>
            <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col" @click="onClickOrder(statistic.orderNum)">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="shopping" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              订单
            </div>
            <div class="card-panel-text">
              {{ statistic.orderNum }}
            </div>
            <count-to :start-val="0" :end-val="13600" :duration="3600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="money" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              营业额
            </div>
            <div class="card-panel-text">
              {{ (statistic.sales / 100).toFixed(2) }}
            </div>
            <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="money" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              总支出
            </div>
            <div class="card-panel-text">
              {{ (statistic.expenses / 100).toFixed(2) }}
            </div>
            <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <!-- <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="message" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              消息
            </div>
            <div class="card-panel-text">
              999
            </div>
            <count-to :start-val="0" :end-val="81212" :duration="3000" class="card-panel-num" />
          </div>
        </div>
      </el-col> -->
    </el-row>

    <!-- 仪表盘1 -->
    <!-- <el-row :gutter="16">
      <el-col :xs="24" :sm="24" :lg="9">
        <el-card class="chart-wrapper" shadow="hover">
          <template #header>
            <span>产品</span>
          </template>
<div id="rosePlot" style="height: 20vh;"></div>
</el-card>
</el-col>
<el-col :xs="24" :sm="24" :lg="9">
  <el-card class="chart-wrapper" shadow="hover">
    <template #header>
            <span>库存</span>
          </template>
    <div id="pie" style="height: 20vh;"></div>
  </el-card>
</el-col>
<el-col :xs="24" :sm="24" :lg="6">
  <el-card class="chart-wrapper" shadow="hover">
    <template #header>
            <span>动态</span>
          </template>
    <div style="height: 20vh;">
      <el-scrollbar>
        <el-timeline style="margin-right: 10px;">
          <el-empty v-if="noticeList.length == 0" description="暂无消息" :image-size="100" />
          <el-timeline-item v-else :timestamp="item.createdAt" placement="top" v-for="(item, index) in noticeList"
            :key="index">
            <el-row @click="clickCard(item, index)">
              <el-col :span="20">
                <el-text size="large" truncated>{{ item.title }}</el-text>
              </el-col>
              <el-col :span="4" style="text-align: right;">
                <el-tag v-if="item.type === '1'" type="warning">通知</el-tag>
                <el-tag v-if="item.type === '2'" type="success">公告</el-tag>
                <el-tag v-if="item.type === '3'" type="warning">告警</el-tag>
                <el-tag v-if="item.type === '4'" type="danger">异常</el-tag>
              </el-col>
            </el-row>
          </el-timeline-item>
        </el-timeline>
      </el-scrollbar>
    </div>
  </el-card>
</el-col>
</el-row> -->

    <!-- 仪表盘2 -->
    <el-row :gutter="16">
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card class="chart-wrapper" shadow="hover">
          <template #header>
            <div style="overflow: hidden;">
              <span style="float: left;">营业额/(年份) </span>
              <el-date-picker v-model="year" type="year" placeholder="请选择年份" :default-value="new Date()"
                @change="changeYear" format="YYYY" value-format="YYYY" date-format="YYYY" style="float: right;" />
            </div>
          </template>
          <div id="container" style="height: 30vh;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="Index">
import { onMounted, ref } from 'vue';
import countTo from 'vue3-count-to';
import { Bar } from '@antv/g2plot';
import { getStatistics } from "@/api/senbei/finance";
import { statisticsByYear } from "@/api/senbei/shopping";

const router = useRouter();

const { proxy } = getCurrentInstance();

const dateTime = ref()

const statistic = ref({
  expenses: 0,
  orderNum: 0,
  sales: 0,
  userNum: 0
})

const year = ref("" + new Date().getFullYear())
function changeYear(e) {
  columnFun()
}

function onClickUser(num) {
  if (Number(num) == 0) {
    proxy.$modal.msgWarning("无用户记录");
    return
  }
  let query = {}
  if (dateTime.value) {
    query = {
      beginTime: dateTime.value[0],
      endTime: dateTime.value[1],
    }
    router.push({
      path: "/app/appuser",
      query: query
    });
    return
  }
  // 跳转用户页
  router.push({
    path: "/app/appuser",
  });
}
function onClickOrder(num) {
  if (Number(num) == 0) {
    proxy.$modal.msgWarning("无订单记录");
    return
  }
  let query = {}
  if (dateTime.value) {
    query = {
      beginTime: dateTime.value[0],
      endTime: dateTime.value[1],
      shoppingSettlement: "1"
    }
    // 跳转订单页
    router.push({
      path: "/data/product/shopping",
      query: query
    });
    return
  }
  // 跳转订单页
  router.push({
    path: "/data/product/shopping",
  });
}

// 点击卡片
const dialogVisible = ref(false)
const dialogDetails = ref({})
function clickCard(msg, index) {
  // console.log("点击卡片", msg);
  dialogDetails.value = {
    dIndex: index,
    dId: msg.noticeId,
    dTitle: msg.title,
    dType: msg.type,
    dContent: msg.content,
    dTime: msg.createdAt,
    dBy: msg.createdBy
  }
  dialogVisible.value = true
}

// 获取统计数据
function initStatistic(e) {
  let query = {}
  if (dateTime.value) {
    query = {
      beginTime: dateTime.value[0],
      endTime: dateTime.value[1],
    }
  }
  getStatistics(query).then(response => {
    statistic.value = {
      expenses: response.expenses,
      orderNum: response.orderNum,
      sales: response.sales,
      userNum: response.userNum,
    }
  });
}

/** 条形图 */
const bar = ref()
function columnFun() {
  statisticsByYear(year.value).then(response => {
    const array = response
    let data = []
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      data.push({
        "type": element.month + "月",
        "sales": (element.sales / 100)
      })
    }
    if (!bar.value) {
      bar.value = new Bar('container', {
        data: data,
        xField: 'sales',
        yField: 'type',
        seriesField: 'type',
        legend: {
          position: 'right',
        },
        label: {
          // 可手动配置 label 数据标签位置
          position: 'right', // 'left', 'middle', 'right'
          offset: 4,
        },
        barStyle: { radius: [2, 2, 0, 0] },
      });
      bar.value.render();
    } else {
      bar.value.changeData(data)
    }
    
  });
}

onMounted(() => {
  initStatistic()
  columnFun()
})

</script>

<style lang="scss" scoped>
// 头
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

// 仪表盘
.dashboard-editor-container {
  padding: 15px 32px 32px 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    // padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}


@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }

  .chart-wrapper {
    padding: 8px;
  }
}
</style>
