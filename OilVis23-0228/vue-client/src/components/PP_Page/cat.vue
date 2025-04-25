<template>
    <div style="float:l=eft;width:100%">
        <!-- <img src="./assets/logo.png"> -->
        <!-- 内容正文 -->
        <div class="zhenwen" style="display: flex;">
            <!-- 左侧图表展示 -->
            <div style="width: 23%;">
                <!-- 恩平站信息 -->
                <div class="data-box1 left_tb box1-backlu fl " style="height: 250px;">
                    <i class="topL"></i>
                    <i class="topR"></i>
                    <i class="bottomL"></i>
                    <i class="bottomR"></i>
                    <div class="data-title" style="width:13rem;">
                        <b class="data-title-left fl">[</b>
                        <span style="font-size:1.5rem;width:12rem;">管段状态信息</span>
                        <b class="data-title-right fr">]</b>
                    </div>
                    <!-- 项目概览-->
                    <div class="xmglan">
                        <ul class="xmgl_heard">
                        </ul>
                        <div id="xmgl_cen">
                            <div class="xmgl_tb">
                                <ul class="xm_cszs">
                                    <li style="font-size:1.5rem;">茂名<span style="font-size:1.5rem;">至 </span>阳江管段</li>
                                    <li style="font-size:1.5rem;">输运状态：<span style="font-size:1.5rem;">停输</span></li>
                                    <li style="font-size:1.5rem;">阀位点数：<span style="font-size:1.5rem;">11</span>个</li>
                                    <li style="font-size:1.5rem;">停输时长：<span style="font-size:1.5rem;">16</span>h</li>
                                    <li style="font-size:1.5rem;">输运油品：<span style="font-size:1.5rem;">92#</span></li>
                                    <li style="font-size:1.5rem;">生产状态：<span style="font-size:1.5rem;">正常</span></li>
                                    <li style="font-size:1.5rem;">生产状态：<span style="font-size:1.5rem;">正常</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="data-box1 left_tb fl " style="height: 745px;margin-top: 25px;">
                    <i class="topL"></i>
                    <i class="topR"></i>
                    <i class="bottomL"></i>
                    <i class="bottomR"></i>
                    <div class="data-title" style="width:13rem;">
                        <b class="data-title-left fl">[</b>
                        <span style="font-size:1.5rem;width:12rem;">参数趋势统计</span>
                        <b class="data-title-right fr">]</b>
                    </div>
                    <div style="width: 100%;height: 50%;">
                        <Scatterplot></Scatterplot>
                    </div>
                    <div style="width: 100%;height: 50%;">
                        <b class="data-title-left fl">[</b>
                        <span class="wgrytj_bt" style="font-size:1.2rem;">物性数据分析</span>
                        <b class="data-title-right fr">]</b>
                        <div style="width: 100%;height: 50%;">
                        <Prechart></Prechart>
                    </div>
                    </div>
                </div>
            </div>
            <div style="width: 50%;margin-left: 10px;">
                <div class="data-box1 left_tb box1-backlu fl" style="height: 250px;">
                    <i class="topL"></i>
                    <i class="topR"></i>
                    <i class="bottomL"></i>
                    <i class="bottomR"></i>
                    <div class="data-title" style="width:13rem;">
                        <b class="data-title-left fl">[</b>
                        <span style="font-size:1.5rem;width:12rem;">管段沿线监测</span>
                        <b class="data-title-right fr">]</b>
                    </div>
                    <div id="pipe_section" style="height: 70%;width: 100%;"></div>
                    <div class="leidanav" style="height: 30%; width: 100%;">
                        <ul class="clearfix" style="padding: 0;margin: 0;">
                            <li><span>土壤温度</span>
                                <p>16℃</p>
                            </li>
                            <li><span>环境温度</span>
                                <p>25℃</p>
                            </li>
                            <li><span>油品压力</span>
                                <p>2.6MPa</p>
                            </li>
                            <li><span>油品温度</span>
                                <p>88℃</p>
                            </li>
                            <li><span>传热系数</span>
                                <p>0.8</p>
                            </li>
                            <li><span>摩阻系数</span>
                                <p>0.6</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="data-box1 left_tb box1-backlu fl" style="height: 745px;margin-top: 25px;">
                    <i class="topL"></i>
                    <i class="topR"></i>
                    <i class="bottomL"></i>
                    <i class="bottomR"></i>
                    <div class="data-title" style="width:13rem;">
                        <b class="data-title-left fl">[</b>
                        <span style="font-size:1.5rem;width:12rem;">参数对比分析</span>
                        <b class="data-title-right fr">]</b>
                    </div>
                    <div style="height: 100%">
                        <div id="prediction_chart" style="width: 100%;height: 50%;"></div>
                        <span class="wgrytj_bt" style="font-size:1.2rem;"></span>
                        <div style="height: 100%;">
                            <TestChart></TestChart>
                        </div>
                    </div>
                </div>
            </div>
            <div style="width: 27%;">
                <div class="data-box1 left_tb fl" style="height: 1020px;">
                    <i class="topL"></i>
                    <i class="topR"></i>
                    <i class="bottomL"></i>
                    <i class="bottomR"></i>
                    <div class="data-title" style="width:13rem;">
                        <b class="data-title-left fl">[</b>
                        <span style="font-size:1.5rem;width:12rem;">状态监测预警</span>
                        <b class="data-title-right fr">]</b>
                    </div>
                    <div class="box1-backlu" style="height: 32%;width: 100%;">
                        <span class="wgrytj_bt" style="font-size:1.2rem;">压力波动情形统计<el-tag
                                style="float: right;font-size: 1.2rem;border-radius: 25px;background-color: #283747;color: white">当前选择：启停波动</el-tag></span>
                        <div id="proportion_chart" style="width: 100%;height: 100%;"></div>
                    </div>
                    <div style="height: 32%;width: 100%;">
                        <span class="wgrytj_bt" style="font-size:1.2rem;padding: 0;"></span>
                        <div class="statusList">
                            <ul class="seTable">
                                <li>时间</li>
                                <li>阀室</li>
                                <li>地温</li>
                                <li>高程</li>
                                <li>停输时长</li>
                                <li>操作</li>
                            </ul>
                            <div id="orderItems" class="outlineBorder" style="height: 258px;overflow-y: auto;">
                                <ul class="rolling rolStyle">
                                    <li>2018/12/11</li>
                                    <li>阀室#1</li>
                                    <li>26℃</li>
                                    <li>13.7m</li>
                                    <li>13h</li>
                                    <li><el-button type="primary" class="risk-button" round size="mini">查看</el-button></li>
                                </ul>
                                <ul class="rolling rolStyle">
                                    <li>2018/12/11</li>
                                    <li>阀室#1</li>
                                    <li>26℃</li>
                                    <li>13.7m</li>
                                    <li>13h</li>
                                    <li><el-button type="primary" class="risk-button" round size="mini">查看</el-button></li>
                                </ul>
                                <ul class="rolling rolStyle">
                                    <li>2018/12/11</li>
                                    <li>阀室#1</li>
                                    <li>26℃</li>
                                    <li>13.7m</li>
                                    <li>13h</li>
                                    <li><el-button class="risk-button" type="primary" round size="mini">查看</el-button></li>
                                </ul>
                                <ul class="rolling rolStyle">
                                    <li>2018/12/11</li>
                                    <li>阀室#1</li>
                                    <li>26℃</li>
                                    <li>13.7m</li>
                                    <li>13h</li>
                                    <li><el-button class="risk-button" type="primary" round size="mini">查看</el-button></li>
                                </ul>
                                <ul class="rolling rolStyle">
                                    <li>2018/12/11</li>
                                    <li>阀室#1</li>
                                    <li>26℃</li>
                                    <li>13.7m</li>
                                    <li>13h</li>
                                    <li><el-button class="risk-button" type="primary" round size="mini">查看</el-button></li>
                                </ul>
                                <ul class="rolling rolStyle">
                                    <li>2018/12/11</li>
                                    <li>阀室#1</li>
                                    <li>26℃</li>
                                    <li>13.7m</li>
                                    <li>13h</li>
                                    <li><el-button class="risk-button" type="primary" round size="mini">查看</el-button></li>
                                </ul>
                                <ul class="rolling rolStyle">
                                    <li>2018/12/11</li>
                                    <li>阀室#1</li>
                                    <li>26℃</li>
                                    <li>13.7m</li>
                                    <li>13h</li>
                                    <li><el-button class="risk-button" type="primary" round size="mini">查看</el-button></li>
                                </ul>
                                <ul class="rolling rolStyle">
                                    <li>2018/12/11</li>
                                    <li>阀室#1</li>
                                    <li>26℃</li>
                                    <li>13.7m</li>
                                    <li>13h</li>
                                    <li><el-button class="risk-button" type="primary" round size="mini">查看</el-button></li>
                                </ul>
                                <ul class="rolling rolStyle">
                                    <li>2018/12/11</li>
                                    <li>阀室#1</li>
                                    <li>26℃</li>
                                    <li>13.7m</li>
                                    <li>13h</li>
                                    <li><el-button class="risk-button" type="primary" round size="mini">查看</el-button></li>
                                </ul>
                                <ul class="rolling rolStyle">
                                    <li>2018/12/11</li>
                                    <li>阀室#1</li>
                                    <li>26℃</li>
                                    <li>13.7m</li>
                                    <li>13h</li>
                                    <li><el-button class="risk-button" type="primary" round size="mini">查看</el-button></li>
                                </ul>
                                <ul class="rolling rolStyle">
                                    <li>2018/12/11</li>
                                    <li>阀室#1</li>
                                    <li>26℃</li>
                                    <li>13.7m</li>
                                    <li>13h</li>
                                    <li><el-button class="risk-button" type="primary" round size="mini">查看</el-button></li>
                                </ul>
                                <ul class="rolling rolStyle">
                                    <li>2018/12/11</li>
                                    <li>阀室#1</li>
                                    <li>26℃</li>
                                    <li>13.7m</li>
                                    <li>13h</li>
                                    <li><el-button class="risk-button" type="primary" round size="mini">查看</el-button></li>
                                </ul>
                                <ul class="rolling rolStyle">
                                    <li>2018/12/11</li>
                                    <li>阀室#1</li>
                                    <li>26℃</li>
                                    <li>13.7m</li>
                                    <li>13h</li>
                                    <li><el-button class="risk-button" type="primary" round size="mini">查看</el-button></li>
                                </ul>
                                <ul class="rolling rolStyle">
                                    <li>2018/12/11</li>
                                    <li>阀室#1</li>
                                    <li>26℃</li>
                                    <li>13.7m</li>
                                    <li>13h</li>
                                    <li><el-button class="risk-button" type="primary" round size="mini">查看</el-button></li>
                                </ul>
                                <ul class="rolling rolStyle">
                                    <li>2018/12/11</li>
                                    <li>阀室#1</li>
                                    <li>26℃</li>
                                    <li>13.7m</li>
                                    <li>13h</li>
                                    <li><el-button class="risk-button" type="primary" round size="mini">查看</el-button></li>
                                </ul>
                                <ul class="rolling rolStyle">
                                    <li>2018/12/11</li>
                                    <li>阀室#1</li>
                                    <li>26℃</li>
                                    <li>13.7m</li>
                                    <li>13h</li>
                                    <li><el-button class="risk-button" type="primary" round size="mini">查看</el-button></li>
                                </ul>
                                <ul class="rolling rolStyle">
                                    <li>2018/12/11</li>
                                    <li>阀室#1</li>
                                    <li>26℃</li>
                                    <li>13.7m</li>
                                    <li>13h</li>
                                    <li><el-button class="risk-button" type="primary" round size="mini">查看</el-button></li>
                                </ul>
                                <ul class="rolling rolStyle">
                                    <li>2018/12/11</li>
                                    <li>阀室#1</li>
                                    <li>26℃</li>
                                    <li>13.7m</li>
                                    <li>13h</li>
                                    <li><el-button class="risk-button" type="primary" round size="mini">查看</el-button></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div style="height: 35%;width: 100%;">
                        <span class="wgrytj_bt" style="font-size:1.2rem;">泄露风险评价<el-tag
                                style="float: right;font-size: 1.2rem;border-radius: 25px;background-color: #283747;color: white">风险矩阵表</el-tag></span>
                        <div id="risk_chart" style="height: 100%;width:100%"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import * as echarts from 'echarts';
import ep_gk from '../maoming/ep_gk.vue'
import Scatter_plot from '../PP_Page/HelloWorld.vue'
import TestChart from '../PP_Page/test.vue'; // 引入组件，使用驼峰命名法
import Pre_chart from '../PP_Page/Pre_chart.vue';
import { test } from 'shelljs';
export default {
    components: {
        'epgk': ep_gk,
        'Scatterplot': Scatter_plot,
        'TestChart': TestChart,
        'Prechart': Pre_chart
    },
    data() {
        return {
            pipe_section: null,
            prediction_chart: null,
            proportion_chart: null,
            risk_chart: null
        }
    },
    mounted() {
        const chartDom1 = document.getElementById('pipe_section');
        this.pipe_section = echarts.init(chartDom1);
        const chartDom2 = document.getElementById('proportion_chart');
        this.proportion_chart = echarts.init(chartDom2);
        const chartDom3 = document.getElementById('risk_chart');
        this.risk_chart = echarts.init(chartDom3, null, {
            renderer: "svg", // 设置渲染方式为 SVG
        });
        this.draw_pipe_section();
        this.draw_prediction_chart();
        this.draw_proportion();
        this.draw_risk_chart();
    },
    methods: {
        draw_pipe_section() {
            const targetCoord = [500, 650]
            const curveness = 0
            const linesData = []
            const categories = [{
                name: '流入中',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0,
                            color: '#01acca'
                        }, {
                            offset: 1,
                            color: '#5adbe7'
                        }]),
                    }
                },
                label: {
                    normal: {
                        fontSize: '14'
                    }
                },
            }]

            const item = {
                name: "阳江",
                value: targetCoord,
                symbol: 'image://https://s2.loli.net/2024/09/14/53QbwinMOSI8Vxt.png',
                symbolSize: [100, 100],
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0,
                            color: '#157eff'
                        }, {
                            offset: 1,
                            color: '#35c2ff'
                        }]),
                    }
                },
                label: {
                    normal: {
                        fontSize: '20',
                        color: "white",
                        offset: [0, 10]
                    }
                },
            }

            const items = [{
                name: "茂名",
                category: 0,
                active: true,
                symbol: 'image://https://s2.loli.net/2024/09/14/53QbwinMOSI8Vxt.png',
                speed: '',
                symbolSize: [100, 100],
                value: [0, 650],
                label: {
                    normal: {
                        fontSize: '20',
                        color: "white",
                        offset: [0, 10]
                    }
                },
            }, {
                name: "阀点#1",
                category: 0,
                active: false,
                symbolSize: 10,
                itemStyle: {
                    color: '#d4ac0d',
                },
                value: [40, 650],
                label: {
                    normal: {
                        fontSize: '16',
                        color: "white",
                        offset: [0, 10]
                    }
                },
            },
            {
                name: "阀点#2",
                category: 0,
                active: false,
                symbolSize: 10,
                itemStyle: {
                    color: '#d4ac0d',
                },
                value: [80, 650],
                label: {
                    normal: {
                        fontSize: '16',
                        color: "white",
                        offset: [0, 10]
                    }
                },
            }, {
                name: "阀点#3",
                category: 0,
                active: false,
                symbolSize: 10,
                itemStyle: {
                    color: '#d4ac0d',
                },
                value: [120, 650],
                label: {
                    normal: {
                        fontSize: '16',
                        color: "white",
                        offset: [0, 10]
                    }
                },
            }, {
                name: "阀点#4",
                category: 0,
                active: false,
                symbolSize: 10,
                itemStyle: {
                    color: '#d4ac0d',
                },
                value: [160, 650],
                label: {
                    normal: {
                        fontSize: '16',
                        color: "white",
                        offset: [0, 10]
                    }
                },
            }, {
                name: "阀点#5",
                category: 0,
                active: false,
                symbolSize: 10,
                itemStyle: {
                    color: '#d4ac0d',
                },
                value: [200, 650],
                label: {
                    normal: {
                        fontSize: '16',
                        color: "white",
                        offset: [0, 10]
                    }
                },
            }, {
                name: "阀点#6",
                category: 0,
                active: false,
                symbolSize: 10,
                itemStyle: {
                    color: '#d4ac0d',
                },
                value: [240, 650],
                label: {
                    normal: {
                        fontSize: '16',
                        color: "white",
                        offset: [0, 10]
                    }
                },
            }, {
                name: "阀点#7",
                category: 0,
                active: false,
                symbolSize: 10,
                itemStyle: {
                    color: '#d4ac0d',
                },
                value: [280, 650],
                label: {
                    normal: {
                        fontSize: '16',
                        color: "white",
                        offset: [0, 10]
                    }
                },
            }, {
                name: "阀点#8",
                category: 0,
                active: false,
                symbolSize: 10,
                itemStyle: {
                    color: '#d4ac0d',
                },
                value: [320, 650],
                label: {
                    normal: {
                        fontSize: '16',
                        color: "white",
                        offset: [0, 10]
                    }
                },
            }, {
                name: "阀点#9",
                category: 0,
                active: false,
                symbolSize: 10,
                itemStyle: {
                    color: '#d4ac0d',
                },
                value: [360, 650],
                label: {
                    normal: {
                        fontSize: '16',
                        color: "white",
                        offset: [0, 10]
                    }
                },
            }, {
                name: "阀点#10",
                category: 0,
                active: false,
                symbolSize: 10,
                itemStyle: {
                    color: '#d4ac0d',
                },
                value: [400, 650],
                label: {
                    normal: {
                        fontSize: '16',
                        color: "white",
                        offset: [0, 10]
                    }
                },
            }, {
                name: "阀点#11",
                category: 0,
                active: false,
                symbolSize: 10,
                itemStyle: {
                    color: '#d4ac0d',
                },
                value: [440, 650],
                label: {
                    normal: {
                        fontSize: '16',
                        color: "white",
                        offset: [0, 10]
                    }
                },
            },]

            const data = items.concat([item])

            items.forEach(function (el) {
                if (el.active) {
                    linesData.push([{
                        coord: el.value
                    }, {
                        coord: targetCoord
                    }])
                }
            })

            const links = items.map((el) => {
                return {
                    source: el.name,
                    target: item.name,
                    speed: el.speed,
                    lineStyle: {
                        normal: {
                            color: '#12b5d0',
                            curveness: curveness,
                            width: 10
                        }
                    },
                }
            })

            var option = {
                grid: {
                    top: 30,
                    left: 80,
                    right: 80
                },
                legend: [{
                    show: false,
                    formatter: function (name) {
                        return echarts.format.truncateText(name, 100, '14px Microsoft Yahei', '…');
                    },
                    tooltip: {
                        show: true
                    },
                    textStyle: {
                        color: '#999'
                    },
                    selectedMode: false,
                    right: 0,
                    data: categories.map(function (el) {
                        return el.name
                    })
                }],
                xAxis: {
                    show: false,
                    type: 'value'
                },
                yAxis: {
                    show: false,
                    type: 'value'
                },
                series: [{
                    type: 'graph',
                    layout: 'none',
                    coordinateSystem: 'cartesian2d',
                    symbolSize: 60,
                    z: 3,
                    edgeLabel: {
                        normal: {
                            show: false,
                            textStyle: {
                                fontSize: 14
                            },

                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'bottom',
                            color: '#fff'
                        }
                    },
                    itemStyle: {
                        normal: {
                            shadowColor: 'none'
                        },
                        emphasis: {

                        }
                    },
                    lineStyle: {
                        normal: {
                            width: 10,
                            shadowColor: 'none'
                        },
                    },
                    edgeSymbol: ['none', 'none'],
                    edgeSymbolSize: 8,
                    data: data,
                    links: links,
                    categories: categories
                }, {
                    name: 'A',
                    type: 'lines',
                    coordinateSystem: 'cartesian2d',
                    z: 1,
                    effect: {
                        show: true,
                        smooth: false,
                        trailLength: 0,
                        symbol: "arrow",
                        color: '#3498db',
                        symbolSize: 21
                    },
                    lineStyle: {
                        normal: {
                            curveness: curveness,
                            width: 18
                        }
                    },
                    data: linesData
                }, {
                    name: 'Scatter',
                    type: 'scatter',
                    symbol: 'image://https://s2.loli.net/2024/09/14/TJ3RGyusxcqm6lb.png',
                    data: [
                        [360, 1100],  // 与 Node 1 重合
                        [280, 1100],  // 与 Node 2 重合
                        [200, 1100],  // 与 Node 1 重合
                        [120, 1100]  // 与 Node 2 重合
                    ],
                    label: {
                        normal: {
                            show: true,
                            textStyle: {
                                color: '#fff',
                                fontSize: 20,
                            },
                            formatter: function (params) {
                                return '' //✔
                            },
                        }
                    },
                    symbolSize: function (data) {
                        return 30
                    },
                    itemStyle: {
                        color: 'red'
                    }
                },]
            };
            this.pipe_section.setOption(option);
        },
        draw_prediction_chart() {

            const chartDom = document.getElementById('prediction_chart');
            this.prediction_chart = echarts.init(chartDom);
            function randomData() {
                now = new Date(+now + oneDay);
                value = value + Math.random() * 21 - 10;
                return {
                    name: now.toString(),
                    value: [
                        [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-'),
                        Math.round(value)
                    ]
                }
            }
            function generateRandomDecimal(min, max) {
                // 生成 min 到 max 之间的随机小数
                return (Math.random() * (max - min)) + min;
            }
            var data = [];
            var data1 = [];
            var now = +new Date(1997, 9, 3);
            var oneDay = 24 * 3600 * 1000;
            var value = Math.random() * 1000;
            for (var i = 0; i < 1000; i++) {
                var orgin_data = randomData()
                orgin_data['value'][1] = generateRandomDecimal(100, 360);
                data.push(orgin_data);
                var copy_data = JSON.parse(JSON.stringify(orgin_data));
                copy_data['value'][1] = generateRandomDecimal(5, 5.2);
                data1.push(copy_data)
            }
            this.prediction_chart.setOption({
                tooltip: {
                    trigger: 'axis',
                    formatter(params) {

                        var reval = params[0].name;
                        for (var i = 0; i < params.length; i++) {
                            // console.log('tooltip数据值',params[i])
                            reval += '<br/>' + params[i].marker + params[i].seriesName + ':  ' + Number(params[i].value).toFixed(3)
                        }
                        return reval;
                    },
                    position: function (pt) {
                        return [pt[0], '10%'];
                    }
                },
                legend: {
                    show: 'false',
                    textStyle: {
                        fontSize: 18,//字体大小
                        color: '#ffffff'//字体颜色
                    },
                    data: this.legenddata
                    // data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
                },
                toolbox: {
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'time',
                    boundaryGap: false,
                    data: this.xdata,
                    splitLine: {  //决定是否显示坐标中网格
                        show: false
                    },
                    axisLine: { show: true },
                    axisTick: {
                        show: true
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#ffffff'
                        }
                    }

                },
                yAxis: [
                    {
                        type: 'value',
                        name: '压力（MPa）',
                        nameTextStyle: {
                            color: '#ffffff',
                            fontSize: 18
                        },
                        // boundaryGap: [0, '100%'],
                        splitLine: {  //决定是否显示坐标中网格
                            show: false
                        },
                        axisLine: { show: true },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#ffffff',
                                fontSize: 18
                            }
                        }
                    },
                    {
                        type: 'value',
                        name: '高程',
                        nameTextStyle: {
                            color: '#ffffff',
                            fontSize: 18
                        },
                        max: 10,
                        min: 0,
                        // boundaryGap: [0, '100%'],
                        splitLine: {  //决定是否显示坐标中网格
                            show: false
                        },
                        axisLine: { show: true },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#ffffff',
                                fontSize: 18
                            }
                        }
                    }

                ],
                dataZoom: [
                    {
                        type: 'inside',
                        start: 0,
                        end: 30,
                    },
                    {
                        start: 0,
                        end: 10,
                        top: "85%"
                    }
                ],
                series: [{
                    name: '压力预测',
                    type: 'line',
                    yAxisIndex: 0,
                    showSymbol: false,
                    hoverAnimation: false,
                    data: data
                },
                {
                    name: '实时高程',
                    type: 'line',
                    yAxisIndex: 1,
                    showSymbol: false,
                    hoverAnimation: false,
                    data: data1
                }]
            });
            // setTimeout(() => {
            //     for (var i = 0; i < 5; i++) {
            //         data.shift();
            //         data.push(randomData());
            //     }
            //     this.prediction_chart.setOption({
            //         series: [{
            //             data: data
            //         }]
            //     });
            // }, 1000);
        },
        draw_proportion() {
            var datas = [
                [
                    { name: '正常波动', value: 7.6 },
                    { name: '启停波动', value: 1.8 },
                    { name: '异常波动', value: 2.4 },
                    { name: '长期衰减', value: 0.7 },
                ],
            ];
            var option = {
                title: {
                    left: 'center',
                    textStyle: {
                        color: '#999',
                        fontWeight: 'normal',
                        fontSize: 14
                    },
                    show: false
                },
                series: datas.map(function (data) {
                    return {
                        type: 'pie',
                        top: -20,
                        radius: [80, 120],
                        height: '100%',
                        label: {
                            show: true,
                            textStyle: {
                                fontSize: 19,
                                color: "#f2f6fc",
                            },
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 0,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 1.5)'
                            }
                        },

                        data: data
                    };
                })
            };
            this.proportion_chart.setOption(option)
        },
        draw_risk_chart() {
            var degree = ['极低', '低', '中等', '较高', '高'];
            var data1 = [];
            var temp_data = [[5, 6, 8, 5, 8,], [5, 8, 7, 6, 18], [5, 8, 18, 22, 35], [8, 9, 22, 31, 39], [7, 19, 31, 38, 45]]
            // 生成数据
            for (var z = 0; z < 5; z++) {
                for (var i = 0; i < 5; i++) {
                    data1.push([i, z, temp_data[z][i]]);
                }
            }

            // 配置项
            var option = {
                tooltip: {
                    position: 'top',
                    formatter: function (params) {
                        return (
                            '后果：' +
                            degree[params.value[1]] +
                            '<br/>' +
                            '概率：' +
                            degree[params.value[0]]
                        );
                    }
                },
                grid: {
                    left: '3%',
                    right: '8%',
                    bottom: '17%',
                    top: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: degree,  // 直接使用 degree 数组
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#000',
                        }
                    },
                    axisLabel: {
                        interval: 0,
                        color: 'white',
                        fontSize: 16
                    },
                    splitArea: {
                        areaStyle: {
                            color: '#000c3b'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    nameTextStyle: {
                        fontSize: 16,
                        color: "white"
                    },
                    nameGap: 0,
                    name: '概率'
                },
                yAxis: {
                    type: 'category',
                    data: degree,  // 直接使用 degree 数组
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#000'
                        }
                    },
                    axisLabel: {
                        interval: 0,
                        color: 'white',
                        fontSize: 16
                    },
                    splitArea: {
                        show: true,
                        areaStyle: {
                            color: '#000c3b'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    nameTextStyle: {
                        fontSize: 16,
                        color: "white",
                    },
                    nameGap: -5,
                    name: '后果'
                },
                visualMap: {
                    min: 1,
                    max: 50,
                    calculable: true,
                    orient: 'horizontal',
                    left: 'center',
                    bottom: '1%',
                    text: ['50', '1'],// 文本，默认为数值文本
                    calculable: false,
                    inRange: {
                        color: [
                            "#8DB3E2",
                            "#0070C0",
                            "#ba4a00",
                        ],
                    },
                    //图例分段
                    pieces: [
                        { min: 0, max: 10, color: "#8DB3E2" },
                        { min: 11, max: 30, color: "#0070C0" },
                        { min: 31, max: 50, color: "#ba4a00" },
                    ],
                },
                series: [
                    {
                        type: "custom",
                        renderItem: function (params, api) {
                            var dataIndex = params.dataIndex;
                            var categoryIndexX = api.value(0);
                            var categoryIndexY = api.value(1);
                            var pointX = api.coord([categoryIndexX, categoryIndexY])[0];
                            var pointY = api.coord([categoryIndexX, categoryIndexY])[1];
                            var datavalue = data1[dataIndex];
                            var boxWidth = 87; // 调整小块的大小
                            var boxHeight = 35; // 调整小块的大小
                            var circleSize = Math.min(boxWidth, boxHeight) / 4;
                            var reStyle = {
                                type: "group",
                                children: [
                                    {
                                        type: "rect",
                                        shape: {
                                            x: pointX - boxWidth / 2,
                                            y: pointY - boxHeight / 2,
                                            width: boxWidth,
                                            height: boxHeight,
                                            r: 0, // 设置边框圆角
                                        },
                                        style: api.style(),
                                        styleEmphasis: {
                                            shadowBlur: 5,
                                            shadowColor: "rgba(0, 0, 0, 0.5)",
                                        },
                                    },
                                ],
                            };
                            if (dataIndex === 12) {
                                reStyle['children'].push({
                                    type: "image",
                                    style: {
                                        image: 'https://s2.loli.net/2024/09/24/GOoLQhPkIcKmMae.png',
                                        x: pointX - boxWidth / 4,
                                        y: pointY - boxHeight / 1.6,
                                        width: circleSize * 5, // 图片宽度
                                        height: circleSize * 5, // 图片高度
                                    },
                                })
                            }
                            return reStyle;
                        },
                        data: data1,
                    },
                ],
            };
            this.risk_chart.setOption(option);
        }
    }
}
</script>

<style>
.leidanav {
    margin-top: -5px;
}

.leidanav ul {
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
    display: flex;
}

.leidanav li {
    width: 20%;
    text-align: center;
    border-left: 1px solid rgba(255, 255, 255, .1);
    display: inline-block;
    text-align: center;
    height: 50px;
    position: relative;
    line-height: 15px;
    margin-top: 10px;
    box-sizing: border-box;
    border-radius: 0;
}

.leidanav li:first-child {
    border-left: none;
}

.leidanav span {
    font-size: 20px;
    opacity: .6;
    color: white;
}

.leidanav p {
    font-size: 20px;
    margin-top: 15px;
    color: #00ff00;
}

.statusList {
    width: 98%;
    margin: 0 auto;
    /* border:1px #032d60 solid; */
}

.statusList .seTable {
    width: 100%;
    padding-bottom: 0px;
    overflow: hidden;
    display: flex;
}

.statusList .seTable li {
    float: left;
    width: 20%;
    font-size: 18px;
    color: #66dffb;
    background: #093e79;
    padding: 0 0;
    margin: 3px;
    text-align: center;
    border-radius: 0;
}

.statusList .seTable .outlineBorder {
    overflow-y: auto;
    font-size: 16px;
}

.statusList .outlineBorder ul {
    height: 40px;
    border: 1px #032d60 solid;
    overflow-y: auto;
    padding: 0;
}

.statusList .outlineBorder ul:nth-child(odd) {
    color: #3e90f7;
}

.statusList .outlineBorder ul:nth-child(even) {
    color: #8ec0ff;
}

.statusList .outlineBorder ul li {
    float: left;
    width: 16.6%;
    height: 30px;
    line-height: 25px;
    padding: 0 0;
    text-align: center;
}

.statusList .outlineBorder ul li:first-child {
    font-size: 14px !important;
}

::-webkit-scrollbar {
    width: 5px;
    border-radius: 5px;
}

::-webkit-scrollbar-thumb {
    background-color: #cccccc;
    border-radius: 5px;
}
.risk-button {
    font-size: 16px;
    border-radius: 5px !important;
    margin-top: -5px;
    height: 30px;
    display: flex;
    align-items: center;
    margin-left: 20px;
}
</style>