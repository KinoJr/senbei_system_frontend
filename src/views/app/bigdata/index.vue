<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              访客
            </div>
            <div class="card-panel-text">
              999
            </div>
            <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
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
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="money" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              金额
            </div>
            <div class="card-panel-text">
              999
            </div>
            <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num" />
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
              999
            </div>
            <count-to :start-val="0" :end-val="13600" :duration="3600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 仪表盘1 -->
    <el-row :gutter="16">
      <el-col :xs="24" :sm="24" :lg="9">
        <el-card class="chart-wrapper" shadow="hover">
          <template #header>
            <span>折线图</span>
          </template>
          <div id="line" style="height: 20vh;"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="9">
        <el-card class="chart-wrapper" shadow="hover">
          <template #header>
            <span>饼图</span>
          </template>
          <div id="pie" style="height: 20vh;"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="6">
        <el-card class="chart-wrapper" shadow="hover">
          <template #header>
            <span>系统公告</span>
          </template>
          <div style="height: 20vh;">
            <el-empty description="暂无消息" :image-size="100" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 仪表盘2 -->
    <el-row :gutter="16">
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card class="chart-wrapper" shadow="hover">
          <template #header>
            <span>柱状图</span>
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
    </el-row>
  </div>
</template>

<script setup name="Index">
import { onMounted, ref } from 'vue';
import countTo from 'vue3-count-to';
import { Line } from '@antv/g2plot';
import { Pie } from '@antv/g2plot';
import { Column } from '@antv/g2plot';
import { Funnel } from '@antv/g2plot';

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
/** 饼图 */
const piePlot = ref()
function pieFun() {
  const data = [
    { type: '分类一', value: 27 },
    { type: '分类二', value: 25 },
    { type: '分类三', value: 18 },
    { type: '分类四', value: 15 },
    { type: '分类五', value: 10 },
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
/** 漏斗图 */
const plot = ref()
function plotFun() {
  const data = [
    { stage: '简历筛选', number: 253 },
    { stage: '初试人数', number: 151 },
    { stage: '复试人数', number: 113 },
    { stage: '录取人数', number: 87 },
    { stage: '入职人数', number: 59 },
  ];
  plot.value = new Funnel('funnel', {
    data: data,
    xField: 'stage',
    yField: 'number',
    legend: false,
  });
  plot.value.render();
}
onMounted(() => {
  lineFun()
  pieFun()
  columnFun()
  plotFun()
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
  padding: 32px;
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
