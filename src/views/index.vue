<template>
  <div class="dashboard-editor-container">
    <el-date-picker v-model="dateTime" type="datetimerange" start-placeholder="开始时间" end-placeholder="截至时间"
      format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" date-format="YYYY-MM-DD HH:mm:ss"
      time-format="HH:mm:ss" @change="initStatistic" />
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
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
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
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
      <!-- <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
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
      </el-col> -->
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
    <!-- <el-row :gutter="16">
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card class="chart-wrapper" shadow="hover">
          <template #header>
            <span>订单产品</span>
          </template>
          <div id="column" style="height: 30vh;"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card class="chart-wrapper" shadow="hover">
          <template #header>
            <span>营业额</span>
          </template>
          <div id="dualAxes" style="height: 30vh;"></div>
        </el-card>
      </el-col>
    </el-row> -->
    <!-- <el-row :gutter="16">
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card class="chart-wrapper" shadow="hover">
          <template #header>
            <span>产品/服务</span>
          </template>
          <div id="column" style="height: 30vh;"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card class="chart-wrapper" shadow="hover">
          <template #header>
            <span>漏斗图</span>
          </template>
          <div id="funnel" style="height: 30vh;"></div>
        </el-card>
      </el-col>
    </el-row> -->

    <!-- 通知公告 -->
    <!-- <el-dialog v-model="dialogVisible" width="90%" style="max-width: 800px;">
      <template #header="{ close, titleId, titleClass }">
        <el-row>
          <el-col :span="20">
            <el-text size="large">{{ dialogDetails.dTitle }}</el-text>
          </el-col>
          <el-col :span="4" style="text-align: right;">
            <el-tag v-if="dialogDetails.dType === '1'" type="success">通知</el-tag>
            <el-tag v-if="dialogDetails.dType === '2'" type="primary">公告</el-tag>
            <el-tag v-if="dialogDetails.dType === '3'" type="warning">告警</el-tag>
            <el-tag v-if="dialogDetails.dType === '4'" type="danger">异常</el-tag>
          </el-col>
        </el-row>
      </template>
      <editor v-model="dialogDetails.dContent" :min-height="192" />
      <span>
        创建时间：{{ dialogDetails.dTime }} 创建者：{{ dialogDetails.dBy }}
      </span>
    </el-dialog> -->
  </div>
</template>

<script setup name="Index">
import { onMounted, ref } from 'vue';
import countTo from 'vue3-count-to';
import { Line } from '@antv/g2plot';
import { Pie } from '@antv/g2plot';
import { Column } from '@antv/g2plot';
import { Funnel } from '@antv/g2plot';
import { Rose } from '@antv/g2plot';
import { DualAxes } from '@antv/g2plot';
import { getStatistics } from "@/api/senbei/finance";
import { listNotice } from "@/api/system/notice";

const dateTime = ref()

const noticeList = ref([]) // 通知公告
const noticeTotal = ref(0) // 通知公告数
const noticeQueryParams = ref({
  pageNum: 1,
  pageSize: 10,
  status: "1",
  belong: "1"
})

const statistic = ref({
  expenses: 0,
  orderNum: 0,
  sales: 0,
  userNum: 0
})

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
  // 获取通知公告
  // listNotice(noticeQueryParams.value).then(response => {
  //   noticeList.value = response.rows || [];
  //   noticeTotal.value = response.total;
  // });
}

/** 折线图 */
const lineRef = ref()
function lineFun() {
  const data = [
    { year: '1991', value: 3 },
    { year: '1992', value: 4 },
    { year: '1993', value: 3.5 },
    { year: '1994', value: 5 },
    { year: '1995', value: 4.9 },
    { year: '1996', value: 6 },
    { year: '1997', value: 7 },
    { year: '1998', value: 9 },
    { year: '1999', value: 13 },
  ]
  lineRef.value = new Line('line', {
    data: data,
    xField: 'year',
    yField: 'value',
  });
  lineRef.value.render();
}
/** 多折线图 */
const dualAxes = ref()
function dualAxesFun() {
  const data = [
    { year: '1991', value: 3, count: 10, dname: "订单数", yname: "营业额" },
    { year: '1992', value: 4, count: 4, dname: "订单数", yname: "营业额" },
    { year: '1993', value: 3.5, count: 5, dname: "订单数", yname: "营业额" },
    { year: '1994', value: 5, count: 5, dname: "订单数", yname: "营业额" },
    { year: '1995', value: 4.9, count: 8, dname: "订单数", yname: "营业额" },
    { year: '1996', value: 6, count: 35, dname: "订单数", yname: "营业额" },
    { year: '1997', value: 7, count: 7, dname: "订单数", yname: "营业额" },
    { year: '1998', value: 9, count: 1, dname: "订单数", yname: "营业额" },
    { year: '1999', value: 13, count: 20, dname: "订单数", yname: "营业额" },
  ];

  dualAxes.value = new DualAxes('dualAxes', {
    data: [data, data],
    xField: 'year',
    yField: ['value', 'count'],
    seriesField: 'type',
    geometryOptions: [
      {
        seriesField: 'yname',
        geometry: 'line',
        color: '#5B8FF9',
      },
      {
        seriesField: 'dname',
        geometry: 'line',
        color: '#5AD8A6',
      },
    ],
  });

  dualAxes.value.render();
}

/** 饼图 */
const piePlot = ref()
function pieFun() {
  const data = [
    { type: '生活用品', value: 27 },
    { type: '电子产品', value: 25 },
    { type: '康复服务', value: 18 },
    { type: '其他', value: 5 },
  ];
  piePlot.value = new Pie('pie', {
    data: data,
    angleField: 'value',
    colorField: 'type',
  });
  piePlot.value.render();
}
/** 柱状图 */
const columnPlot = ref()
function columnFun() {
  const data = [
    {
      "type": "家具家电",
      "sales": 38
    },
    {
      "type": "粮油副食",
      "sales": 52
    },
    {
      "type": "生鲜水果",
      "sales": 61
    },
    {
      "type": "美容洗护",
      "sales": 145
    },
    {
      "type": "母婴用品",
      "sales": 48
    },
    {
      "type": "进口食品",
      "sales": 38
    },
    {
      "type": "食品饮料",
      "sales": 38
    },
    {
      "type": "家庭清洁",
      "sales": 38
    }
  ];
  columnPlot.value = new Column('column', {
    data: data,
    xField: 'type',
    yField: 'sales',
  });
  columnPlot.value.render();
}
/** 玫瑰图 */
const rosePlot = ref()
function rosePlotFun() {
  const data = [
    { type: '服务', value: 27 },
    { type: '电子产品', value: 25 },
    { type: '衣物', value: 18 },
    { type: '生活用品', value: 15 },
    { type: '其他', value: 5 },
  ];
  rosePlot.value = new Rose('rosePlot', {
    data,
    xField: 'type',
    yField: 'value',
    seriesField: 'type',
    radius: 0.8,
    legend: {
      position: 'right',
    },
  });
  rosePlot.value.render();
}
/** 漏斗图 */
// const plot = ref()
// function plotFun() {
//   const data = [
//     { stage: '简历筛选', number: 253 },
//     { stage: '初试人数', number: 151 },
//     { stage: '复试人数', number: 113 },
//     { stage: '录取人数', number: 87 },
//     { stage: '入职人数', number: 59 },
//   ];
//   plot.value = new Funnel('funnel', {
//     data: data,
//     xField: 'stage',
//     yField: 'number',
//     legend: false,
//   });
//   plot.value.render();
// }


onMounted(() => {
  initStatistic()
  // if(!dualAxes.value) {
  //   dualAxesFun()
  // }
  // if(!piePlot.value) {
  //   pieFun()
  // }
  // if(!columnPlot.value) {
  //   columnFun()
  // }
  // if(!rosePlot.value) {
  //   rosePlotFun()
  // }
  // lineFun()
  // plotFun()
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
