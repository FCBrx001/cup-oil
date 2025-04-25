<template>
    <div>
        <el-button icon="el-icon-refresh" circle style="background-color: #013a7e" @click="getdata()"></el-button>
        <div :id="elid" :style="{ width: '100%', 'height': chartHeight + 'px' }"></div>
        <!-- <div :id="elid" :style="{width:'100%','height':chartHeight+'px'}"></div> -->
    </div>
</template>


<script>
import uuidv1 from 'uuid/v1'
import * as echarts from 'echarts'
import { eventBus } from '../../main';
import { MessageBox } from 'element-ui'

export default {
    name: "App",
    data() {
        return {

            chartWidth: 400,
            chartHeight: 200,

            data_kgf: [

                { value: 6, name: '开阀' },
                { value: 8, name: '关阀' },
            ],
            data_fmnl: [

                { value: 4, name: '阀门内漏' },
                { value: 10, name: '正常' },
            ],
            data_sb: [

                { value: 4, name: '甩泵' },
                { value: 10, name: '正常' },
            ],
            data_qg: [

                { value: 4, name: '清管' },
                { value: 10, name: '未清管' },
            ],
            chart_data: 'fmnl',
            elid: '',
        }
    },
    mounted() {
        this.getdata()
        eventBus.$on('jm_gk_statis', data => {
            this.chart_data = data,
                this.getdata()
        })

    },

    created() {
        this.elid = uuidv1() //获取随机id
    },
    methods: {
        //获取数据并画图
        getdata() {
            const token = sessionStorage.getItem('token');
            this.$axios({
                mrthid: 'get',
                url: '/Popup/warn_gkstatis_new',
                headers: {
                    Authorization: `Bearer ${token}`  // 在请求头中附加 JWT Token
                },
                params: {
                    stationname: '江门',
                },
            }).then(res => {
                this.data_fmnl[0].value = res.data[2]
                this.data_fmnl[1].value = res.data[3]

                this.data_kgf[0].value = res.data[0]
                this.data_kgf[1].value = res.data[1]

                this.data_sb[0].value = res.data[6]
                this.data_sb[1].value = res.data[7]

                this.data_qg[0].value = res.data[4]
                this.data_qg[1].value = res.data[5]
            })

            if (this.chart_data == 'fmnl') {
                this.drawchart_fmnl()
            } else if (this.chart_data == 'kgf') {
                this.drawchart_kgf()
            } else if (this.chart_data == 'sb') {
                this.drawchart_sb()
            } else if (this.chart_data == 'qg') {
                this.drawchart_qg()
            }
        },
        drawchart_fmnl() {
            this.charts = echarts.init(document.getElementById(this.elid));
            this.charts.clear();
            this.charts.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['40%', '70%'],
                        data: this.data_fmnl,
                        label: {
                            show: true,
                            textStyle: {
                                fontSize: 20,
                                color: "#f2f6fc",
                            },
                            itemStyle: {
                                normal: {
                                    shadowBlur: 200,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        },

                    }
                ]
            })
        },
        drawchart_kgf() {
            this.charts = echarts.init(document.getElementById(this.elid));
            this.charts.clear();
            this.charts.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['40%', '70%'],
                        data: this.data_kgf,
                        label: {
                            show: true,
                            textStyle: {
                                fontSize: 20,
                                color: "#f2f6fc",
                            },
                            itemStyle: {
                                normal: {
                                    shadowBlur: 200,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        },

                    }
                ]
            })
        },
        drawchart_qg() {
            this.charts = echarts.init(document.getElementById(this.elid));
            this.charts.clear();
            this.charts.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['40%', '70%'],
                        data: this.data_qg,
                        label: {
                            show: true,
                            textStyle: {
                                fontSize: 20,
                                color: "#f2f6fc",
                            },
                            itemStyle: {
                                normal: {
                                    shadowBlur: 200,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        },

                    }
                ]
            })
        },
        drawchart_sb() {
            this.charts = echarts.init(document.getElementById(this.elid));
            this.charts.clear();
            this.charts.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['40%', '70%'],
                        data: this.data_sb,
                        label: {
                            show: true,
                            textStyle: {
                                fontSize: 20,
                                color: "#f2f6fc",
                            },
                            itemStyle: {
                                normal: {
                                    shadowBlur: 200,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        },

                    }
                ]
            })
        }

    }
}
</script>
