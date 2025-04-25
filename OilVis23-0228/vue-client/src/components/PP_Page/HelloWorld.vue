<!-- 物性数据分析板块 -->
<!-- <template>
<div>
<el-dropdown>
  <span class="el-dropdown-link">
    下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
  </span>
  <el-dropdown-menu slot="dropdown" @click="handleClick">
    <el-dropdown-item>黄金糕</el-dropdown-item>
    <el-dropdown-item>狮子头</el-dropdown-item>
    <el-dropdown-item>螺蛳粉</el-dropdown-item>
    <el-dropdown-item >双皮奶</el-dropdown-item>
    <el-dropdown-item >蚵仔煎</el-dropdown-item>
  </el-dropdown-menu>
</el-dropdown>
  <div id="chart" style="height: 800px;width: 800px;">
  </div>
  </div>
</template>
<style>
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>  
<script>

import * as echarts from 'echarts';
export default {
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    var chartDom = document.getElementById('chart');
    this.chart = echarts.init(chartDom);
    this.draw_chart();
  },
  methods: {
    draw_chart() {
      var option = {
  xAxis: {},
  yAxis: {},
  series: [
    {
      symbolSize: 20,
      data: [
        [10.0, 8.04],
        [8.07, 6.95],
        [13.0, 7.58],
        [9.05, 8.81],
        [11.0, 8.33],
        [14.0, 7.66],
        [13.4, 6.81],
        [10.0, 6.33],
        [14.0, 8.96],
        [12.5, 6.82],
        [9.15, 7.2],
        [11.5, 7.2],
        [3.03, 4.23],
        [12.2, 7.83],
        [2.02, 4.47],
        [1.05, 3.33],
        [4.05, 4.96],
        [6.03, 7.24],
        [12.0, 6.26],
        [12.0, 8.84],
        [7.08, 5.82],
        [5.02, 5.68]
      ],
      type: 'scatter'
    }
  ]
};
      this.chart.setOption(option);
    },
    handleClick(){}
  },
}
</script> -->

<!-- 散点图矩阵评估物理性质与压力变化之间的关系，增设下拉框选取不同的物理性质，如油品粘度、密度等 -->
<!-- <template>

  <div style="height: 100%;width: 100%">
    <span class="wgrytj_bt" style="font-size:1.2rem;">物性数据统计
      <el-select v-model="selectedView" @change="handleViewChange" placeholder="选择视图" size="mini"
        style="width: 120px;float: right;">
        <el-option v-for="view in views" :key="view.value" :label="view.label" :value="view.value" />
      </el-select>
    </span>
    <div ref="chartContainer" style="width: 100%; height: 100%;"></div>
  </div>
</template>
<script src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js"></script>
<script>
import * as echarts from 'echarts';
import { Select, Option } from 'element-ui';

export default {
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
  },
  data() {
    return {
      selectedView: 'view1',
      views: [
        { label: '油品粘度', value: 'view1' },
        { label: '密度', value: 'view2' },
        { label: '温度', value: 'view3' },
        // 更多视图选项...
      ],
      chart: null,
    };
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chartContainer);
      this.updateChart();
    },
    updateChart() {
      const viewData = this.getViewData(this.selectedView);
      const option = {
        grid: {
          top: 40,
          bottom: 100,
          left: 30,
          right: 30
        },
        //用于定义图标的提示框
        tooltip: {
          // 表示提示框会在悬停或者点击时触发
          trigger: 'item',
          //用于定义坐标轴指示器（axis pointer），它会在用户悬停时显示。
          axisPointer: {
            //指示器的类型是交叉线。
            type: 'cross',
            crossStyle: {
              //交叉线的颜色。
              color: '#999',
            },
          },
        },
        xAxis: {
          //x轴的类型是类别轴，通常用于离散的标签。
          type: 'category',
          //x轴的数据，来自 viewData 对象中的 categories 属性。
          data: viewData.categories,
          name: viewData.xname,
          nameTextStyle: {
              color: '#fff',
              fontSize: 18,
          },
          nameGap: 30,
          nameLocation: 'center',
          splitLine: {
              show: false // 隐藏y轴的背景线
          },
          axisLabel: {
              color: 'white',
              fontSize: 16,
          },
        },
        yAxis: {
          //y轴的类型是值轴，通常用于连续的数据。
          type: 'value',
          name:viewData.yname,
          axisLine: {
            show: true // 隐藏 Y 轴的刻度线
          },
          splitLine: {
            show: false // 隐藏 Y 轴的分割线
          },
          axisTick: {
            alignWithLabel: true
          },
          nameTextStyle: {
              color: '#fff',
              fontSize: 18,
          },
          nameGap: 20,
          splitLine: {
              show: false // 隐藏y轴的背景线
          },
          axisLabel: {
              color: 'white',
              fontSize: 16
          },
        },
        series: [
        ],
      };
      if(this.selectedView === 'view1'){
        option.series.push({
            //来自 viewData 对象中的 data 属性。这里使用 map 方法将数据转换为 [x, y] 格式的数组，这是散点图需要的数据格式。
            data: viewData.data.map(item => [item[0], item[1]]),
            type: 'scatter', // 散点图,系列的类型是散点图。
            symbolSize: 12,
            itemStyle: {
              color: '#5dade2'
            }
          })
      }
      else{
        option.series.push({
            //来自 viewData 对象中的 data 属性。这里使用 map 方法将数据转换为 [x, y] 格式的数组，这是散点图需要的数据格式。
            data: viewData.data.map(item => [item[0], item[1]]),
            type: 'scatter', // 散点图,系列的类型是散点图。
            symbolSize: 12,
            itemStyle: {
              color: '#28b463'
            }
          })
      }
      this.chart.setOption(option, true);
    },
    handleViewChange() {
      this.updateChart();
    },
    getViewData(view) {
      function generateSimilarData() {
        let data = [];
        for (let i = 0; i < 50; i++) { // 生成5组数据
            let x = Math.floor(Math.random() * 51) + 10; // 生成10到60之间的随机数
            let y = Math.floor(Math.random() * 51) + 20; // 生成20到70之间的随机数
            data.push([x, y]);
        }
        return data;
      }
      var testdata1 = generateSimilarData();
      var testdata2 = generateSimilarData();
      // 根据视图返回不同的数据
      if (view === 'view1') {
        return {
          xname:'油品粘度',
          yname:'压力',
          nameLocation: 'left', // 坐标轴名称位置
            nameTextStyle: { // 坐标轴名称样式
            color: '#000',
            fontSize: 16,
            fontWeight: 'bold'
        },
          //categories: ['A', 'B', 'C', 'D', 'E'],
          data: testdata1
        };
      } else if (view === 'view2') {
        return {
          xname:'密度',
          yname:'压力',
          nameLocation: 'left', // 坐标轴名称位置
            nameTextStyle: { // 坐标轴名称样式
            color: '#000',
            fontSize: 16,
            fontWeight: 'bold'
        },
          //categories: ['W1', 'W2', 'W3', 'W4'],
          data: testdata2
        };
      }
      // 默认数据
      return {
        categories: ['A', 'B', 'C', 'D'],
        data: [
          [5, 5],
          [15, 15],
          [25, 25],
          [35, 35],
        ],
      };
    },
  },
  mounted() {
    //特别用于在组件被挂载到DOM后执行代码。这意味着所有的模板和DOM都已经渲染完毕，此时可以执行DOM操作或者执行依赖于DOM的操作。
    this.initChart();
  },
};
</script> -->



<template>
  <div id="chartContainer" style="width: 100%; height: 100%;"></div>
</template>

<script>
import * as echarts from 'echarts';
var category = [
  "10",
  "20",
  "30",
  "40",
  "50",
  "60",
  "70",
];

// 模拟粘度数据 (mPa·s)
var viscosityData = [
  45.2,  // 10℃
  32.8,  // 20℃
  24.5,  // 30℃
  18.6,  // 40℃
  14.2,  // 50℃
  11.0,  // 60℃
  8.7    // 70℃
];

// 模拟密度数据 (kg/m³)
var densityData = [
  850.2,  // 10℃
  845.6,  // 20℃
  841.0,  // 30℃
  836.4,  // 40℃
  831.8,  // 50℃
  827.2,  // 60℃
  822.6   // 70℃
];

export default {
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      const chart = echarts.init(document.getElementById('chartContainer'));
      const option = {
  title: {
    text: "",
    x: "center",
    y: 0,
    textStyle: {
      color: "#B4B4B4",
      fontSize: 16,
      fontWeight: "normal",
    },
  },
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(255,255,255,0.1)",
    axisPointer: {
      type: "shadow",
      label: {
        show: true,
        backgroundColor: "#7B7DDC",
      },
    },
  },
  legend: {
    data: ["密度", "粘度"],
    textStyle: {
      color: "#B4B4B4",
    },
    top: "7%",
  },
  grid: {
    x: "12%",
    width: "80%",
    y: "12%",
  },
  xAxis: {
    name: "温度",
    data: category,
    axisLine: {
      lineStyle: {
        color: "white",
      },
    },
    axisTick: {
      show: true,
    },
  },
  yAxis: [
    {
      type:"value",
      name: "密度",
      splitLine: { show: false },
      axisLine: {
        lineStyle: {
          color: "white",
        },
      },
      axisTick: {
      show: true,
    },
    axisLine: {
              show: true, // 显示Y轴竖线
              lineStyle: { color: "#B4B4B4" } // 竖线样式
            },
      axisLabel: {
        formatter: "{value} ",
      },
    },
    {
      type:"value",
      name: "粘度",
      splitLine: { show: false },
      axisLine: {
        lineStyle: {
          color: "white",
        },
      },
      axisLine: {
              show: true, // 显示Y轴竖线
              lineStyle: { color: "#B4B4B4" } // 竖线样式
            },
      axisLabel: {
        formatter: "{value} ",
      },
    },
  ],

  series: [
    {
      name: "粘度",
      type: "line",
      smooth: true,
      showAllSymbol: true,
      symbol: "emptyCircle",
      symbolSize: 8,
      yAxisIndex: 1,
      itemStyle: {
        normal: {
          color: "#F02FC2",
        },
      },
      data: viscosityData,
    },
    {
      name: "密度",
      type: "line",
      smooth: true,
      showAllSymbol: true,
      symbol: "emptyCircle",
      symbolSize: 8,
      itemStyle: {
        normal: {
          color: "#3EACE5",
        },
      },
      data: densityData,
    },
  ],
};

      chart.setOption(option);
    }
  }
};
</script>

<style>
/* 可选样式调整 */
#chartContainer {
  margin: 20px auto;
}
</style>