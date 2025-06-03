<template>
    <div style="float:l=eft;width:100%">
        <!-- <img src="./assets/logo.png"> -->
        <!-- 内容正文 -->
        <div class="zhenwen" style="display: flex;">
            <!-- 左侧图表展示 -->
            <div style="width: 23%;">
                <!-- 恩平站信息 -->
                <div class="data-box1 left_tb box1-backlu fl " style="height: 550px;">
                    <i class="topL"></i>
                    <i class="topR"></i>
                    <i class="bottomL"></i>
                    <i class="bottomR"></i>
                    <div class="data-title" style="width:13rem;">
                        <b class="data-title-left fl">[</b>
                        <span style="font-size:1.5rem;width:12rem;">管段状态信息</span>
                        <b class="data-title-right fr">]</b>
                    </div>
                    <!-- 添加管段切换选择器 -->
                    <div class="pipeline-selector">
                        <div class="custom-select-wrapper" style="width: 95%; display: flex; justify-content: center;">
                            <div class="custom-select-inner" style="background: rgba(2, 32, 71, 0.9); border: 1px solid #66dffb; border-radius: 4px; width: 100%; position: relative; height: 35px; box-shadow: 0 0 10px rgba(102, 223, 251, 0.3);">
                                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; color: white; font-size: 15px; letter-spacing: 1px; pointer-events: none;">
                                    {{ currentPipelineLabel || '请选择管段' }}
                                </div>
                                <el-select 
                                    v-model="selectedPipeline" 
                                    placeholder="请选择管段" 
                                    @change="changePipeline" 
                                    class="pipeline-select invisible-select"
                                    style="width: 100%; height: 100%;"
                                    popper-class="pipeline-dropdown">
                                    <el-option
                                        v-for="item in pipelineOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <div style="position: absolute; right: 5px; top: 10px; color: #66dffb; pointer-events: none;">
                                    <i class="el-icon-arrow-down"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 项目概览-->
                    <div class="xmglan">
                        <div class="default-data">
                            <!-- <ul class="xm_cszs">
                                <li style="font-size:1.5rem;">黄埔<span style="font-size:1.5rem;">至 </span>东莞</li>
                                <li style="font-size:1.5rem;">输运状态：<span style="font-size:1.5rem;">停输</span></li>
                                <li style="font-size:1.5rem;">阀位点数：<span style="font-size:1.5rem;">11</span>个</li>
                                <li style="font-size:1.5rem;">停输时长：<span style="font-size:1.5rem;">16</span>h</li>
                                <li style="font-size:1.5rem;">输运油品：<span style="font-size:1.5rem;">92#</span></li>
                                <li style="font-size:1.5rem;">油品密度值：<span style="font-size:1.5rem;">745</span>kg/m3</li>
                                <li style="font-size:1.5rem;">生产状态：<span style="font-size:1.5rem;">正常</span></li>
                                <!-- <li style="font-size:1.5rem;">管道长度：<span style="font-size:1.5rem;">11</span>km</li> 
                            
                            </ul> -->
                            <div class="leakage-monitor" id="state-info">
                                <div class="monitor-grid">
                                    <div class="monitor-item">
                                        <span class="label">管段名称</span>
                                        <span class="value">{{ currentPipelineData.name }}</span>
                                    </div>
                                    <div class="monitor-item">
                                        <span class="label">输运状态</span>
                                        <span class="value" :class="currentPipelineData.status === '运行中' ? 'normal' : 'warning'">{{ currentPipelineData.status }}</span>
                                    </div>
                                    <div class="monitor-item">
                                        <span class="label">阀位点数</span>
                                        <span class="value normal">{{ currentPipelineData.valvePoints }}</span>
                                    </div>
                                    <div class="monitor-item">
                                        <span class="label">停输时长</span>
                                        <span class="value normal">{{ currentPipelineData.stopDuration }}</span>
                                    </div>
                                    <div class="monitor-item">
                                        <span class="label">输运油品</span>
                                        <span class="value normal">{{ currentPipelineData.oilType }}</span>
                                    </div>
                                    <div class="monitor-item">
                                        <span class="label">油品密度</span>
                                        <span class="value normal">{{ currentPipelineData.oilDensity }}</span>
                                    </div>
                                    <div class="monitor-item">
                                        <span class="label">站间高差</span>
                                        <span class="value normal">{{ currentPipelineData.heightDiff }}</span>
                                    </div>
                                    <div class="monitor-item">
                                        <span class="label">输送方向</span>
                                        <span class="value normal">{{ currentPipelineData.direction }}</span>
                                    </div>
                                    <div class="monitor-item">
                                        <span class="label">所属管线</span>
                                        <span class="value normal">{{ currentPipelineData.line }}</span>
                                    </div>
                                </div>
                                <div class="pressure-grids">
                                    <div class="pressure-grid">
                                        <div class="grid-title">{{ currentPipelineData.startStation.name }}</div>
                                        <div class="monitor-item">
                                            <span class="label">最高进站压力</span>
                                            <span class="value">{{ currentPipelineData.startStation.maxPressure }}</span>
                                        </div>
                                        <div class="monitor-item">
                                            <span class="label">最低进站压力</span>
                                            <span class="value">{{ currentPipelineData.startStation.minPressure }}</span>
                                        </div>
                                    </div>
                                    <div class="pressure-grid">
                                        <div class="grid-title">{{ currentPipelineData.endStation.name }}</div>
                                        <div class="monitor-item">
                                            <span class="label">最高进站压力</span>
                                            <span class="value">{{ currentPipelineData.endStation.maxPressure }}</span>
                                        </div>
                                        <div class="monitor-item">
                                            <span class="label">最低进站压力</span>
                                            <span class="value">{{ currentPipelineData.endStation.minPressure }}</span>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                            <div class="button-container">
                                    <el-button type="text" class="more-btn" style="border: none;background-color: transparent;"
                                        @click="dialogVisible = true">
                                        查看更多信息>>
                                    </el-button>
                                </div>
                        </div>
                    </div>

                    <!-- 详细信息弹窗 -->
                    <el-dialog title="管段详细信息" :modal-append-to-body="false" :append-to-body="true"
                        :visible.sync="dialogVisible" width="40%" custom-class="info-dialog">
                        <div class="dialog-content">
                            <div class="info-section">
                                <h3>基本信息</h3>
                                <div class="info-grid">
                                    <div class="info-item">
                                        <span class="label">管道长度：</span>
                                        <span class="value">{{ currentPipelineData.details.length }}</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="label">最大年输量：</span>
                                        <span class="value">{{ currentPipelineData.details.maxYearThroughput }}</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="label">最小年输量：</span>
                                        <span class="value">{{ currentPipelineData.details.minYearThroughput }}</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="label">站场编号：</span>
                                        <span class="value">{{ currentPipelineData.details.stationCode }}</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="label">管道直径：</span>
                                        <span class="value">{{ currentPipelineData.details.diameter }}</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="label">壁厚：</span>
                                        <span class="value">{{ currentPipelineData.details.thickness }}</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="label">设计压力：</span>
                                        <span class="value">{{ currentPipelineData.details.designPressure }}</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="label">管道材质：</span>
                                        <span class="value">{{ currentPipelineData.details.material }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="info-section">
                                <h3>运行参数</h3>
                                <div class="info-grid">
                                    <div class="info-item">
                                        <span class="label">运行方式：</span>
                                        <span class="value">{{ currentPipelineData.details.operationMode }}</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="label">最高进站压力：</span>
                                        <span class="value">{{ currentPipelineData.details.maxInPressure }}</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="label">最低进站压力：</span>
                                        <span class="value">{{ currentPipelineData.details.minInPressure }}</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="label">最高出站压力：</span>
                                        <span class="value">{{ currentPipelineData.details.maxOutPressure }}</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="label">环境温度：</span>
                                        <span class="value">{{ currentPipelineData.details.envTemp }}</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="label">介质温度：</span>
                                        <span class="value">{{ currentPipelineData.details.mediumTemp }}</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="label">流量：</span>
                                        <span class="value">{{ currentPipelineData.details.flow }}</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="label">运行状态：</span>
                                        <span class="value" :class="currentPipelineData.status === '运行中' ? 'status-normal' : 'status-warning'">{{ currentPipelineData.status }}</span>
                                    </div>
                                </div>
                            </div>
                            <!-- <div class="info-section">
                                <h3>管道保护</h3>
                                <div class="info-grid">
                                    <div class="info-item">
                                        <span class="label">防腐等级：</span>
                                        <span class="value">三层PE</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="label">阴极保护：</span>
                                        <span class="value">强制电流</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="label">保护电位：</span>
                                        <span class="value">-0.85V</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="label">检测周期：</span>
                                        <span class="value">6个月</span>
                                    </div>
                                </div>
                            </div> -->
                        </div>
                    </el-dialog>
                </div>
                <div class="data-box1 left_tb fl " style="height: 450px;margin-top: 25px;">
                    <i class="topL"></i>
                    <i class="topR"></i>
                    <i class="bottomL"></i>
                    <i class="bottomR"></i>
                    <div class="data-title" style="width:13rem;">
                        <b class="data-title-left fl">[</b>
                        <span style="font-size:1.5rem;width:12rem;">物性计算</span>
                        <b class="data-title-right fr">]</b>
                    </div>
                    <div style="width: 100%;height: 100%;">
                        <Scatterplot></Scatterplot>
                    </div>

                    <!-- <div style="width: 100%;height: 50%;">
                        <b class="data-title-left fl">[</b>
                        <span class="wgrytj_bt" style="font-size:1.2rem;">物性数据分析</span>
                        <b class="data-title-right fr">]</b>
                        <div style="width: 100%;height: 50%;">
                            <Prechart></Prechart>
                        </div>
                    </div> -->
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
                            <div class="data-title" style="width:13rem;">
                                <!-- <b class="data-title-left fl">[</b>
                        <span style="font-size:1.5rem;width:12rem;">参数监测</span>
                        <b class="data-title-right fr">]</b> -->
                            </div>
                            <TestChart22></TestChart22>
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
                        <span style="font-size:1.5rem;width:12rem;">停输压降预警</span>
                        <b class="data-title-right fr">]</b>
                    </div>
                    <div class="box1-backlu" style="height: 32%;width: 100%;">
                        <!-- <span class="wgrytj_bt" style="font-size:1.2rem;">压力波动情形统计<el-tag
                                style="float: right;font-size: 1.2rem;border-radius: 25px;background-color: #283747;color: white">当前选择：启停波动</el-tag></span> -->
                        <!-- <div id="proportion_chart" style="width: 100%;height: 45%;"></div> -->
                        <div class="leakage-monitor">
                            <div class="monitor-grid">
                                <div class="monitor-item">
                                    <span class="label">监测点</span>
                                    <span class="value">阀室#1</span>
                                </div>
                                <div class="monitor-item">
                                    <span class="label">状态</span>
                                    <span class="value normal">正常</span>
                                </div>
                                <div class="monitor-item">
                                    <span class="label">压力变化</span>
                                    <span class="value">-0.02 MPa</span>
                                </div>
                                <div class="monitor-item">
                                    <span class="label">温度变化</span>
                                    <span class="value">+0.5 ℃</span>
                                </div>
                                <div class="monitor-item">
                                    <span class="label">流量变化</span>
                                    <span class="value">-0.1 m³/h</span>
                                </div>
                                <div class="monitor-item">
                                    <span class="label">检测时间</span>
                                    <span class="value">2024-02-28 14:30</span>
                                </div>
                            </div>
                            <div class="monitor-status">
                                <div class="status-indicator">
                                    <span class="dot normal"></span>
                                    <span class="text">系统运行正常</span>
                                </div>
                                <div class="status-time">
                                    上次检测：2分钟前
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="height: 32%;width: 100%;">
                        <span class="wgrytj_bt" style="font-size:1.2rem;padding: 0;">高点汽化风险监测</span>
                        <div class="pipeline-monitoring">
                            <!-- 阀室状态卡片 -->
                            <div class="valve-cards">
                                <div class="valve-card danger" @click="showValveDetails('阀室#1')">
                                    <div class="valve-icon">
                                        <i class="el-icon-warning"></i>
                            </div>
                                    <div class="valve-info">
                                        <div class="valve-name">阀室#1</div>
                                        <div class="valve-position">K125+600</div>
                                        <div class="valve-elevation">高程: 13.7m</div>
                        </div>
                                    <div class="valve-status">
                                        <div class="status-label">高风险</div>
                                        <div class="countdown">{{ formattedCountdowns['阀室#1'] }}</div>
                                        <div class="countdown-label">预计汽化</div>
                                    </div>
                                </div>
                                
                                <div class="valve-card warning" @click="showValveDetails('阀室#2')">
                                    <div class="valve-icon">
                                        <i class="el-icon-warning-outline"></i>
                                    </div>
                                    <div class="valve-info">
                                        <div class="valve-name">阀室#2</div>
                                        <div class="valve-position">K118+350</div>
                                        <div class="valve-elevation">高程: 10.2m</div>
                                    </div>
                                    <div class="valve-status">
                                        <div class="status-label">中风险</div>
                                        <div class="countdown">{{ formattedCountdowns['阀室#2'] }}</div>
                                        <div class="countdown-label">预计临界</div>
                                    </div>
                                </div>
                                
                                <div class="valve-card normal" @click="showValveDetails('阀室#3')">
                                    <div class="valve-icon">
                                        <i class="el-icon-success"></i>
                                    </div>
                                    <div class="valve-info">
                                        <div class="valve-name">阀室#3</div>
                                        <div class="valve-position">K112+800</div>
                                        <div class="valve-elevation">高程: 9.5m</div>
                                    </div>
                                    <div class="valve-status">
                                        <div class="status-label">正常</div>
                                    </div>
                                </div>
                                
                                <div class="valve-card normal" @click="showValveDetails('阀室#4')">
                                    <div class="valve-icon">
                                        <i class="el-icon-success"></i>
                                    </div>
                                    <div class="valve-info">
                                        <div class="valve-name">阀室#4</div>
                                        <div class="valve-position">K108+450</div>
                                        <div class="valve-elevation">高程: 8.3m</div>
                                    </div>
                                    <div class="valve-status">
                                        <div class="status-label">正常</div>
                                    </div>
                                </div>
                                
                                <div class="valve-card normal" @click="showValveDetails('阀室#5')">
                                    <div class="valve-icon">
                                        <i class="el-icon-success"></i>
                                    </div>
                                    <div class="valve-info">
                                        <div class="valve-name">阀室#5</div>
                                        <div class="valve-position">K102+150</div>
                                        <div class="valve-elevation">高程: 7.8m</div>
                                    </div>
                                    <div class="valve-status">
                                        <div class="status-label">正常</div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 控制面板 -->
                            <div class="control-panel">
                                <div class="panel-title">操作控制台</div>
                                <div class="panel-content">
                                    <div class="panel-buttons">
                                        <button class="control-btn primary" @click="showConfigDialog">
                                            <i class="el-icon-setting"></i>
                                            <span>配置处置</span>
                                        </button>
                                        <button class="control-btn warning" @click="showAlarmDialog">
                                            <i class="el-icon-bell"></i>
                                            <span>启动警报</span>
                                        </button>
                                        <button class="control-btn info">
                                            <i class="el-icon-refresh"></i>
                                            <span>刷新数据</span>
                                        </button>
                                    </div>
                                    <div class="panel-stats">
                                        <div class="stat-group">
                                            <div class="stat-item">
                                                <div class="stat-label">汽化风险点</div>
                                                <div class="stat-value danger">2</div>
                                            </div>
                                            <div class="stat-item">
                                                <div class="stat-label">最高压力</div>
                                                <div class="stat-value">2.7 MPa</div>
                                            </div>
                                            <div class="stat-item">
                                                <div class="stat-label">最高温度</div>
                                                <div class="stat-value">38 ℃</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 阀室详情弹窗 -->
                        <el-dialog
                            title="阀室详情"
                            :visible.sync="valveDetailVisible"
                            width="50%"
                            custom-class="valve-detail-dialog"
                            :modal-append-to-body="false"
                            :append-to-body="true"
                            :close-on-click-modal="false"
                            :modal="false"
                            :lock-scroll="false"
                        >
                            <div class="valve-detail-content" v-if="selectedValve">
                                <div class="valve-detail-header">
                                    <div class="valve-detail-title">{{ selectedValve }} 运行状态详情</div>
                                    <div class="valve-detail-status" :class="selectedValve === '阀室#1' ? 'danger' : selectedValve === '阀室#2' ? 'warning' : 'normal'">
                                        {{ selectedValve === '阀室#1' ? '高风险' : selectedValve === '阀室#2' ? '中风险' : '正常' }}
                                    </div>
                                </div>
                                <div class="valve-detail-body">
                                    <div class="valve-detail-info">
                                        <div class="info-section">
                                            <h3>位置信息</h3>
                                            <div class="info-grid">
                                                <div class="info-item">
                                                    <span class="label">公里标：</span>
                                                    <span class="value">{{ selectedValve === '阀室#1' ? 'K125+600' : selectedValve === '阀室#2' ? 'K118+350' : 'K112+800' }}</span>
                                                </div>
                                                <div class="info-item">
                                                    <span class="label">高程：</span>
                                                    <span class="value">{{ selectedValve === '阀室#1' ? '13.7m' : selectedValve === '阀室#2' ? '10.2m' : '9.5m' }}</span>
                                                </div>
                                                <div class="info-item">
                                                    <span class="label">地理位置：</span>
                                                    <span class="value">{{ selectedValve === '阀室#1' ? '东经119°12′45″, 北纬39°08′22″' : selectedValve === '阀室#2' ? '东经119°10′38″, 北纬39°07′15″' : '东经119°08′12″, 北纬39°06′53″' }}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="info-section">
                                            <h3>运行参数</h3>
                                            <div class="info-grid">
                                                <div class="info-item">
                                                    <span class="label">当前压力：</span>
                                                    <span class="value">{{ selectedValve === '阀室#1' ? '1.85 MPa' : selectedValve === '阀室#2' ? '2.05 MPa' : '2.35 MPa' }}</span>
                                                </div>
                                                <div class="info-item">
                                                    <span class="label">临界压力：</span>
                                                    <span class="value">1.75 MPa</span>
                                                </div>
                                                <div class="info-item">
                                                    <span class="label">当前温度：</span>
                                                    <span class="value">{{ selectedValve === '阀室#1' ? '26 ℃' : selectedValve === '阀室#2' ? '25 ℃' : '24 ℃' }}</span>
                                                </div>
                                                <div class="info-item">
                                                    <span class="label">压力变化：</span>
                                                    <span class="value" :class="selectedValve === '阀室#1' ? 'danger' : selectedValve === '阀室#2' ? 'warning' : 'normal'">
                                                        {{ selectedValve === '阀室#1' ? '-0.05 MPa/h' : selectedValve === '阀室#2' ? '-0.02 MPa/h' : '-0.01 MPa/h' }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="info-section" v-if="selectedValve === '阀室#1' || selectedValve === '阀室#2'">
                                            <h3>预警信息</h3>
                                            <div class="warning-info">
                                                <div class="warning-icon">
                                                    <i :class="selectedValve === '阀室#1' ? 'el-icon-error' : 'el-icon-warning'"></i>
                                                </div>
                                                <div class="warning-content">
                                                    <div class="warning-title">{{ selectedValve === '阀室#1' ? '高点汽化高风险预警' : '高点汽化中风险预警' }}</div>
                                                    <div class="warning-desc">
                                                        {{ selectedValve === '阀室#1' ? 
                                                        `当前压力接近临界压力，预计${formattedCountdowns['阀室#1']}后达到汽化条件，请立即采取措施！` : 
                                                        `压力下降速率较快，预计${formattedCountdowns['阀室#2']}后达到预警阈值，请密切关注！` }}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <!-- 添加醒目的倒计时显示 -->
                                            <div class="countdown-container">
                                                <div class="countdown-title">{{ selectedValve === '阀室#1' ? '距离汽化还剩' : '距离临界还剩' }}</div>
                                                <div class="countdown-box" :class="selectedValve === '阀室#1' ? 'danger' : 'warning'">
                                                    <div class="countdown-display">
                                                        <span class="countdown">{{ selectedValve === '阀室#1' ? formattedCountdowns['阀室#1'] : formattedCountdowns['阀室#2'] }}</span>
                                                        <!-- <span class="countdown-label">分:秒</span> -->
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="action-buttons">
                                        <el-button type="primary" icon="el-icon-view">查看历史</el-button>
                                        <el-button type="warning" icon="el-icon-bell">设置警报</el-button>
                                        <el-button v-if="selectedValve === '阀室#1'" type="danger" icon="el-icon-warning-outline">应急处置</el-button>
                                    </div>
                                </div>
                            </div>
                        </el-dialog>
                        
                        <!-- 警报启动弹窗 -->
                        <el-dialog
                            title="启动警报"
                            :visible.sync="alarmDialogVisible"
                            width="45%"
                            custom-class="valve-detail-dialog alarm-detail-dialog"
                            :modal-append-to-body="false"
                            :append-to-body="true"
                            :close-on-click-modal="false"
                            :modal="false"
                            :lock-scroll="false"
                        >
                            <div class="valve-detail-content">
                                <div class="valve-detail-header">
                                    <div class="valve-detail-title">管段高点汽化风险警报</div>
                                    <div class="valve-detail-status danger">高风险</div>
                                </div>
                                <div class="valve-detail-body">
                                    <div class="valve-detail-info">
                                        <div class="info-section">
                                            <h3>警报详情</h3>
                                            <div class="info-grid">
                                                <div class="info-item">
                                                    <span class="label">风险级别：</span>
                                                    <span class="value danger">高风险</span>
                                                </div>
                                                <div class="info-item">
                                                    <span class="label">风险点：</span>
                                                    <span class="value">阀室#1 (K125+600)</span>
                                                </div>
                                                <div class="info-item">
                                                    <span class="label">预警时间：</span>
                                                    <span class="value">{{ new Date().toLocaleString() }}</span>
                                                </div>
                                                <div class="info-item">
                                                    <span class="label">预计汽化时间：</span>
                                                    <span class="value danger">{{ formattedCountdowns['阀室#1'] }}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="info-section">
                                            <h3>警报等级设置</h3>
                                            <div class="alarm-level-grid">
                                                <div class="level-option" :class="{ active: selectedAlarmLevel === 'low' }" @click="selectedAlarmLevel = 'low'">
                                                    <div class="level-icon">
                                                        <div class="level-dot low"></div>
                                                    </div>
                                                    <div class="level-content">
                                                        <div class="level-title">低级警报</div>
                                                        <div class="level-desc">仅通知操作人员</div>
                                                    </div>
                                                </div>
                                                <div class="level-option" :class="{ active: selectedAlarmLevel === 'medium' }" @click="selectedAlarmLevel = 'medium'">
                                                    <div class="level-icon">
                                                        <div class="level-dot medium"></div>
                                                    </div>
                                                    <div class="level-content">
                                                        <div class="level-title">中级警报</div>
                                                        <div class="level-desc">通知操作人员和站长</div>
                                                    </div>
                                                </div>
                                                <div class="level-option" :class="{ active: selectedAlarmLevel === 'high' }" @click="selectedAlarmLevel = 'high'">
                                                    <div class="level-icon">
                                                        <div class="level-dot high"></div>
                                                    </div>
                                                    <div class="level-content">
                                                        <div class="level-title">高级警报</div>
                                                        <div class="level-desc">通知全站人员和应急小组</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- <div class="info-section">
                                            <h3>通知方式</h3>
                                            <div class="notification-grid">
                                                <div class="notification-item">
                                                    <el-checkbox v-model="notificationMethods.sms">短信通知</el-checkbox>
                                                </div>
                                                <div class="notification-item">
                                                    <el-checkbox v-model="notificationMethods.email">邮件通知</el-checkbox>
                                                </div>
                                                <div class="notification-item">
                                                    <el-checkbox v-model="notificationMethods.app">APP推送</el-checkbox>
                                                </div>
                                                <div class="notification-item">
                                                    <el-checkbox v-model="notificationMethods.phone">电话通知</el-checkbox>
                                                </div>
                                            </div>
                                        </div> -->
                                    </div>
                                    <div class="action-buttons">
                                        <el-button @click="alarmDialogVisible = false" icon="el-icon-close">取消</el-button>
                                        <el-button type="danger" @click="triggerAlarm" icon="el-icon-warning-outline">确认启动警报</el-button>
                                    </div>
                                </div>
                            </div>
                        </el-dialog>
                        
                        <!-- 配置处置弹窗 -->
                        <el-dialog
                            title="配置处置方案"
                            :visible.sync="configDialogVisible"
                            width="55%"
                            custom-class="valve-detail-dialog config-detail-dialog"
                            :modal-append-to-body="false"
                            :append-to-body="true"
                            :close-on-click-modal="false"
                            :modal="false"
                            :lock-scroll="false"
                        >
                            <div class="valve-detail-content">
                                <div class="valve-detail-header">
                                    <div class="valve-detail-title">停输保压处置方案配置</div>
                                    <div class="valve-detail-status" :class="currentPipelineData.status === '运行中' ? 'normal' : 'warning'">
                                        {{ currentPipelineData.status }}
                                    </div>
                                </div>
                                <div class="valve-detail-body">
                                    <div class="valve-detail-info">
                                        <div class="info-section">
                                            <h3>停输保压状态</h3>
                                            <div class="info-grid">
                                                <div class="info-item">
                                                    <span class="label">停输时长：</span>
                                                    <span class="value">{{ currentPipelineData.stopDuration }}</span>
                                                </div>
                                                <div class="info-item">
                                                    <span class="label">汽化风险点：</span>
                                                    <span class="value danger">2个</span>
                                                </div>
                                                <div class="info-item">
                                                    <span class="label">平均压降率：</span>
                                                    <span class="value">0.03 MPa/h</span>
                                                </div>
                                                <div class="info-item">
                                                    <span class="label">当前管段：</span>
                                                    <span class="value">{{ currentPipelineData.name }}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="info-section">
                                            <h3>处置方案选择</h3>
                                            <div class="plan-selector">
                                                <el-radio-group v-model="selectedPlan" size="medium">
                                                    <el-radio-button label="plan1">恒压保持法</el-radio-button>
                                                    <el-radio-button label="plan2">缓降调整法</el-radio-button>
                                                    <el-radio-button label="plan3">区间控制法</el-radio-button>
                                                </el-radio-group>
                                            </div>

                                            <div class="plan-details" v-if="selectedPlan === 'plan1'">
                                                <div class="plan-description">
                                                    适用于停输时间12-24小时，环境温度稳定的情况。特点：压力保持恒定，监控频率高，安全性最佳。
                                                </div>
                                                <div class="param-config">
                                                    <div class="param-item">
                                                        <div class="param-label">初始压力 (MPa)：{{ planParams.initialPressure }} MPa</div>
                                                        <el-slider v-model="planParams.initialPressure" :min="1.5" :max="2.5" :step="0.1"></el-slider>
                                                    </div>
                                                    <div class="param-item">
                                                        <div class="param-label">监测频率 (小时)：{{ planParams.monitorInterval }} h</div>
                                                        <el-slider v-model="planParams.monitorInterval" :min="0.5" :max="4" :step="0.5"></el-slider>
                                                    </div>
                                                    <div class="param-item">
                                                        <div class="param-label">报警阈值 (MPa)：{{ planParams.alarmThreshold }} MPa</div>
                                                        <el-slider v-model="planParams.alarmThreshold" :min="0.01" :max="0.2" :step="0.01"></el-slider>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div class="plan-details" v-if="selectedPlan === 'plan2'">
                                                <div class="plan-description">
                                                    适用于停输时间24-48小时，温度波动较大的情况。特点：允许压力缓慢下降，减少干预次数，节约能源。
                                                </div>
                                                <div class="param-config">
                                                    <div class="param-item">
                                                        <div class="param-label">初始压力 (MPa)：{{ planParams.initialPressure }} MPa</div>
                                                        <el-slider v-model="planParams.initialPressure" :min="1.8" :max="2.8" :step="0.1"></el-slider>
                                                    </div>
                                                    <div class="param-item">
                                                        <div class="param-label">监测频率 (小时)：{{ planParams.monitorInterval }} h</div>
                                                        <el-slider v-model="planParams.monitorInterval" :min="1" :max="6" :step="0.5"></el-slider>
                                                    </div>
                                                    <div class="param-item">
                                                        <div class="param-label">压降速率 (MPa/h)：{{ planParams.pressureDropRate }} MPa/h</div>
                                                        <el-slider v-model="planParams.pressureDropRate" :min="0.01" :max="0.1" :step="0.01"></el-slider>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div class="plan-details" v-if="selectedPlan === 'plan3'">
                                                <div class="plan-description">
                                                    适用于长时间停输(>48小时)的情况。特点：设置压力上下限范围，监测频率低，减少设备磨损，操作简便。
                                                </div>
                                                <div class="param-config">
                                                    <div class="param-item">
                                                        <div class="param-label">上限压力 (MPa)：{{ planParams.maxPressure }} MPa</div>
                                                        <el-slider v-model="planParams.maxPressure" :min="1.8" :max="2.5" :step="0.1"></el-slider>
                                                    </div>
                                                    <div class="param-item">
                                                        <div class="param-label">下限压力 (MPa)：{{ planParams.minPressure }} MPa</div>
                                                        <el-slider v-model="planParams.minPressure" :min="1.5" :max="2.0" :step="0.1"></el-slider>
                                                    </div>
                                                    <div class="param-item">
                                                        <div class="param-label">监测频率 (小时)：{{ planParams.monitorInterval }} h</div>
                                                        <el-slider v-model="planParams.monitorInterval" :min="2" :max="8" :step="1"></el-slider>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="info-section">
                                            <h3>执行设置</h3>
                                            <div class="info-grid execution-grid">
                                                <div class="execution-item">
                                                    <span class="label">自动执行：</span>
                                                    <el-switch v-model="executionSettings.autoExecute"></el-switch>
                                                </div>
                                                <div class="execution-item">
                                                    <span class="label">通知相关人员：</span>
                                                    <el-switch v-model="executionSettings.notifyPersonnel"></el-switch>
                                                </div>
                                                <div class="execution-item">
                                                    <span class="label">记录操作日志：</span>
                                                    <el-switch v-model="executionSettings.logOperations" disabled></el-switch>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="action-buttons">
                                        <el-button @click="configDialogVisible = false" icon="el-icon-close">取消</el-button>
                                        <el-button type="primary" @click="applyConfig" icon="el-icon-check">应用配置</el-button>
                                    </div>
                                </div>
                            </div>
                        </el-dialog>
                    </div>
                    <div style="height: 35%;width: 100%;">
                        <span class="wgrytj_bt" style="font-size:1.2rem;">停输保压方案的制定<el-tag
                                style="float: right;font-size: 1.2rem;border-radius: 25px;background-color: #283747;color: white">保压参数表</el-tag></span>
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
import PreChart from '../PP_Page/Pre_chart.vue';
import TestChart22 from '../../views/test_chart.vue';
import { test } from 'shelljs';

export default {
    name: 'mmyj_Page',
    components: {
        'epgk': ep_gk,
        'Scatterplot': Scatter_plot,
        'TestChart': TestChart,
        'PreChart': PreChart,
        'TestChart': TestChart,
        'TestChart22': TestChart22,

    },
    data() {
        return {
            selectedPipeline: 'pipeline1',
            pipelineOptions: [
                { value: 'pipeline1', label: '黄埔-东莞管段' },
                { value: 'pipeline2', label: '阳江-恩平管段' },
                { value: 'pipeline3', label: '恩平-鹤山管段' }
            ],
            pipelineData: {
                pipeline1: {
                    name: '黄埔 至 东莞',
                    status: '停输',
                    valvePoints: '11个',
                    stopDuration: '16h',
                    oilType: '92#',
                    oilDensity: '745 kg/m³',
                    heightDiff: '46 m',
                    direction: '黄埔 -> 东莞',
                    line: '珠三角管线',
                    startStation: {
                        name: '黄埔站',
                        maxPressure: '4.0 MPa',
                        minPressure: '1.6 MPa'
                    },
                    endStation: {
                        name: '东莞站',
                        maxPressure: '3.8 MPa',
                        minPressure: '1.5 MPa'
                    },
                    details: {
                        length: '11 km',
                        maxYearThroughput: '11 万吨',
                        minYearThroughput: '1 万吨',
                        stationCode: '11',
                        diameter: '508 mm',
                        thickness: '7.9 mm',
                        designPressure: '6.4 MPa',
                        material: 'L360',
                        operationMode: '并联',
                        maxInPressure: '4 MPa',
                        minInPressure: '1.6 MPa',
                        maxOutPressure: '4 MPa',
                        envTemp: '26 ℃',
                        mediumTemp: '35 ℃',
                        flow: '800 m³/h'
                    }
                },
                pipeline2: {
                    name: '阳江 至 恩平',
                    status: '运行中',
                    valvePoints: '8个',
                    stopDuration: '0h',
                    oilType: '95#',
                    oilDensity: '760 kg/m³',
                    heightDiff: '32 m',
                    direction: '阳江 -> 恩平',
                    line: '西部管线',
                    startStation: {
                        name: '茂名站',
                        maxPressure: '4.5 MPa',
                        minPressure: '1.8 MPa'
                    },
                    endStation: {
                        name: '湛江站',
                        maxPressure: '4.2 MPa',
                        minPressure: '1.7 MPa'
                    },
                    details: {
                        length: '16 km',
                        maxYearThroughput: '15 万吨',
                        minYearThroughput: '2 万吨',
                        stationCode: '08',
                        diameter: '610 mm',
                        thickness: '8.1 mm',
                        designPressure: '7.0 MPa',
                        material: 'L415',
                        operationMode: '串联',
                        maxInPressure: '4.5 MPa',
                        minInPressure: '1.8 MPa',
                        maxOutPressure: '4.2 MPa',
                        envTemp: '28 ℃',
                        mediumTemp: '38 ℃',
                        flow: '950 m³/h'
                    }
                },
                pipeline3: {
                    name: '恩平 至 鹤山',
                    status: '停输',
                    valvePoints: '6个',
                    stopDuration: '8h',
                    oilType: '0#柴油',
                    oilDensity: '820 kg/m³',
                    heightDiff: '25 m',
                    direction: '恩平 -> 鹤山',
                    line: '东部管线',
                    startStation: {
                        name: '恩平站',
                        maxPressure: '3.6 MPa',
                        minPressure: '1.4 MPa'
                    },
                    endStation: {
                        name: '深圳站',
                        maxPressure: '3.2 MPa',
                        minPressure: '1.2 MPa'
                    },
                    details: {
                        length: '9 km',
                        maxYearThroughput: '9 万吨',
                        minYearThroughput: '1.5 万吨',
                        stationCode: '06',
                        diameter: '457 mm',
                        thickness: '7.6 mm',
                        designPressure: '6.0 MPa',
                        material: 'L360',
                        operationMode: '并联',
                        maxInPressure: '3.6 MPa',
                        minInPressure: '1.4 MPa',
                        maxOutPressure: '3.2 MPa',
                        envTemp: '27 ℃',
                        mediumTemp: '34 ℃',
                        flow: '720 m³/h'
                    }
                }
            },
            pipe_section: null,
            prediction_chart: null,
            proportion_chart: null,
            risk_chart: null,
            dialogVisible: false,
            valveDetailVisible: false,
            selectedValve: null,
            countdowns: {
                '阀室#1': {
                    minutes: 12,
                    seconds: 30
                },
                '阀室#2': {
                    minutes: 35,
                    seconds: 45
                }
            },
            countdownTimer: null,
            alarmDialogVisible: false,
            selectedAlarmLevel: 'low',
            notificationMethods: {
                sms: false,
                email: false,
                app: false,
                phone: false
            },
            executionSettings: {
                autoExecute: false,
                notifyPersonnel: false,
                logOperations: false
            },
            selectedPlan: 'plan1',
            planParams: {
                initialPressure: 2.0,
                monitorInterval: 1,
                alarmThreshold: 0.05,
                pressureDropRate: 0.01,
                maxPressure: 2.5,
                minPressure: 1.5
            },
            configDialogVisible: false
        }
    },
    computed: {
        formattedCountdowns() {
            return {
                '阀室#1': `${this.countdowns['阀室#1'].minutes.toString().padStart(2, '0')}:${this.countdowns['阀室#1'].seconds.toString().padStart(2, '0')}`,
                '阀室#2': `${this.countdowns['阀室#2'].minutes.toString().padStart(2, '0')}:${this.countdowns['阀室#2'].seconds.toString().padStart(2, '0')}`
            }
        },
        currentPipelineData() {
            return this.pipelineData[this.selectedPipeline];
        },
        currentPipelineLabel() {
            const option = this.pipelineOptions.find(item => item.value === this.selectedPipeline);
            return option ? option.label : '';
        }
    },
    mounted() {
        const chartDom1 = document.getElementById('pipe_section');
        this.pipe_section = echarts.init(chartDom1);
        // const chartDom2 = document.getElementById('proportion_chart');
        // this.proportion_chart = echarts.init(chartDom2);
        const chartDom3 = document.getElementById('risk_chart');
        this.risk_chart = echarts.init(chartDom3, null, {
            renderer: "svg", // 设置渲染方式为 SVG
        });
        this.draw_pipe_section();
        this.draw_prediction_chart();
        // this.draw_proportion();
        this.draw_risk_chart();
        this.startCountdown();
    },
    beforeDestroy() {
        clearInterval(this.countdownTimer);
    },
    methods: {
        changePipeline(value) {
            this.selectedPipeline = value;
            // 更新图表和其他相关数据
            this.$nextTick(() => {
                this.draw_pipe_section();
                this.draw_prediction_chart();
                this.draw_risk_chart();
            });
        },
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
                name: "东莞",
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
                name: "黄埔",
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
                            reval += '<br/>' + params[i].marker + params[i].seriesName + ':  ' + Number(params[i].value).toFixed(3)
                        }
                        return reval;
                    },
                    position: function (pt) {
                        return [pt[0], '10%'];
                    },
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#283b56'
                        }
                    }
                },
                legend: {
                    show: 'true',
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
                    emphasis: {
                        focus: 'none'
                    },
                    lineStyle: {
                        color: '#4ecdc4',

                        width: 2,
                        shadowColor: 'rgba(78,205,196,0.3)',

                        shadowBlur: 10,
                        shadowOffsetY: 5
                    },
                    data: data
                },
                {
                    name: '实时高程',
                    type: 'line',
                    yAxisIndex: 1,
                    showSymbol: false,
                    hoverAnimation: false,
                    emphasis: {
                        focus: 'none'
                    },
                    lineStyle: {
                        color: '#ffffff',
                        width: 2,
                        shadowColor: 'rgba(78,205,196,0.3)',
                        shadowBlur: 10,
                        shadowOffsetY: 5
                    },
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
        // draw_proportion() {
        //     // 生成模拟数据
        //     const hours = Array.from({ length: 24 }, (_, i) => i);
        //     const capacityData = hours.map(hour => {
        //         // 模拟停输后的管容量变化趋势
        //         const baseCapacity = 1000; // 基础容量
        //         const decayRate = 0.05;    // 衰减率
        //         return baseCapacity * Math.exp(-decayRate * hour);
        //     });

        //     const option = {
        //         backgroundColor: 'transparent',
        //         tooltip: {
        //             trigger: 'axis',
        //             formatter: function (params) {
        //                 return `停输${params[0].name}小时后<br/>管容量: ${params[0].value.toFixed(2)} m³`;
        //             }
        //         },
        //         grid: {
        //             top: '10%',
        //             left: '3%',
        //             right: '4%',
        //             bottom: '3%',
        //             containLabel: true
        //         },
        //         xAxis: {
        //             type: 'category',
        //             data: hours,
        //             name: '停输时间(小时)',
        //             nameTextStyle: {
        //                 color: '#fff',
        //                 fontSize: 14
        //             },
        //             axisLine: {
        //                 lineStyle: {
        //                     color: '#fff'
        //                 }
        //             },
        //             axisLabel: {
        //                 color: '#fff',
        //                 interval: 3,  // 每4个显示一个刻度
        //                 showMinLabel: true,  // 显示第一个刻度
        //                 showMaxLabel: true   // 显示最后一个刻度
        //             }
        //         },
        //         yAxis: {
        //             type: 'value',
        //             name: '管容量(m³)',
        //             nameTextStyle: {
        //                 color: '#fff',
        //                 fontSize: 14
        //             },
        //             axisLine: {
        //                 lineStyle: {
        //                     color: '#fff'
        //                 }
        //             },
        //             axisLabel: {
        //                 color: '#fff',
        //                 formatter: '{value}'
        //             },
        //             splitLine: {
        //                 lineStyle: {
        //                     color: 'rgba(255, 255, 255, 0.1)'
        //                 }
        //             }
        //         },
        //         series: [{
        //             data: capacityData,
        //             type: 'line',
        //             smooth: true,
        //             symbol: 'circle',
        //             symbolSize: 8,
        //             lineStyle: {
        //                 width: 3,
        //                 color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
        //                     offset: 0,
        //                     color: '#00ff00'
        //                 }, {
        //                     offset: 1,
        //                     color: '#00ffff'
        //                 }])
        //             },
        //             itemStyle: {
        //                 color: '#00ff00',
        //                 borderColor: '#fff',
        //                 borderWidth: 2
        //             },
        //             areaStyle: {
        //                 color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
        //                     offset: 0,
        //                     color: 'rgba(0, 255, 0, 0.3)'
        //                 }, {
        //                     offset: 1,
        //                     color: 'rgba(0, 255, 255, 0.1)'
        //                 }])
        //             }
        //         }]
        //     };
        //     this.proportion_chart.setOption(option);
        // },
        draw_watch_info() {
            const chartDom = document.getElementById('watch_info_chart');
            const watchInfoChart = echarts.init(chartDom);

            const option = {
                backgroundColor: 'transparent',
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        return `${params.name}: ${params.value}`;
                    }
                },
                grid: {
                    top: '10%',
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: ['监测点', '状态', '压力变化', '温度变化', '流量变化', '检测时间'],
                    axisLine: {
                        lineStyle: {
                            color: '#fff'
                        }
                    },
                    axisLabel: {
                        color: '#fff',
                        interval: 0,
                        rotate: 45
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: '#fff'
                        }
                    },
                    axisLabel: {
                        color: '#fff'
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                series: [{
                    type: 'bar',
                    data: [
                        { value: '阀室#1', itemStyle: { color: '#1890ff' } },
                        { value: '正常', itemStyle: { color: '#52c41a' } },
                        { value: '-0.02 MPa', itemStyle: { color: '#1890ff' } },
                        { value: '+0.5 ℃', itemStyle: { color: '#1890ff' } },
                        { value: '-0.1 m³/h', itemStyle: { color: '#1890ff' } },
                        { value: '2024-02-28 14:30', itemStyle: { color: '#1890ff' } }
                    ],
                    barWidth: '40%',
                    label: {
                        show: true,
                        position: 'top',
                        color: '#fff',
                        fontSize: 12
                    }
                }]
            };
            watchInfoChart.setOption(option);
        },
        draw_risk_chart() {
            // 创建清晰的保压方案展示，确保所有标签可见
            const option = {
                backgroundColor: 'transparent',
                tooltip: {
                    trigger: 'item',
                    backgroundColor: 'rgba(0,0,0,0.75)',
                    borderWidth: 0,
                    textStyle: {
                        color: '#fff',
                        fontSize: 14
                    },
                    formatter: function(params) {
                        if (params.data && params.data.desc) {
                            return `<div style="padding: 8px">
                                <div style="font-weight: bold; color: #fff; margin-bottom: 5px;">${params.name}</div>
                                <div style="color: #ddd; line-height: 1.5">${params.data.desc}</div>
                            </div>`;
                        }
                        return params.name;
                    }
                },
                legend: {
                    show: true,
                    orient: 'vertical',
                    right: '5%',
                    top: '5%',
                    itemWidth: 15,
                    itemHeight: 15,
                    textStyle: {
                        color: '#fff',
                        fontSize: 14
                    }
                },
                series: [
                    {
                        name: '保压方案',
                        type: 'pie',
                        radius: ['50%', '65%'],
                        center: ['50%', '40%'],
                        avoidLabelOverlap: true,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: 'rgba(0, 0, 0, 0.1)',
                            borderWidth: 2,
                            shadowBlur: 20,
                            shadowColor: 'rgba(0, 0, 0, 0.3)'
                        },
                        label: {
                        show: true,
                            position: 'outside',
                            formatter: '{b}\n{c}%',
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: '#fff',
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            padding: [4, 8],
                            borderRadius: 4,
                            distanceToLabelLine: 5
                        },
                        labelLine: {
                            show: true,
                            length: 20,
                            length2: 30,
                            smooth: true
                        },
                        labelLayout: {
                            hideOverlap: true
                        },
                        emphasis: {
                            label: {
                        fontSize: 16,
                                fontWeight: 'bold',
                                color: '#fff'
                            },
                            itemStyle: {
                                shadowBlur: 30,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        data: [
                    {
                                value: 45, 
                                name: '恒压保持法',
                                itemStyle: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        {offset: 0, color: '#1cb076'},
                                        {offset: 1, color: '#36d39a'}
                                    ])
                                },
                                desc: '适用于停输时间12-24小时，环境温度稳定的情况。特点：压力保持恒定，监控频率高，安全性最佳。',
                                steps: [
                                    { name: '1. 关闭阀门', desc: '关闭所有进出站阀门，确保管段完全隔离' },
                                    { name: '2. 设定初始压力', desc: '设置初始压力为2.0MPa，确保管道正常保压' },
                                    { name: '3. 设置报警阈值', desc: '当压降达到0.05MPa时，系统自动报警提醒' },
                                    { name: '4. 定时记录数据', desc: '每小时记录一次管道压力、温度等关键参数' },
                                    { name: '5. 及时补压', desc: '压力下降到阈值时，立即补压至2.0MPa' }
                                ],
                                labelLine: {
                                    length: 15,
                                    length2: 15,
                                    lineStyle: {
                                        color: '#36d39a'
                                    }
                                }
                            },
                            { 
                                value: 35, 
                                name: '缓降调整法',
                                itemStyle: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        {offset: 0, color: '#f2994a'},
                                        {offset: 1, color: '#f2c94c'}
                                    ])
                                },
                                desc: '适用于停输时间24-48小时，温度波动较大的情况。特点：允许压力缓慢下降，减少干预次数，节约能源。',
                                steps: [
                                    { name: '1. 关闭阀门', desc: '关闭所有进出站阀门，确保管段完全隔离' },
                                    { name: '2. 设定初始压力', desc: '设置较高初始压力2.2MPa，为后续缓降预留空间' },
                                    { name: '3. 制定阶梯降压计划', desc: '规划各时间段的目标压力值，允许有计划地缓慢降压' },
                                    { name: '4. 低频监测', desc: '每2小时记录一次数据，降低人工干预频率' },
                                    { name: '5. 降压补压策略', desc: '仅在压降超过0.1MPa时进行补压，减少操作次数' }
                                ],
                                labelLine: {
                                    length: 15,
                                    length2: 15,
                                    lineStyle: {
                                        color: '#f2c94c'
                                    }
                                }
                            },
                            { 
                                value: 20, 
                                name: '区间控制法',
                                itemStyle: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        {offset: 0, color: '#df5184'},
                                        {offset: 1, color: '#ff7eb3'}
                                    ])
                                },
                                desc: '适用于长时间停输(>48小时)的情况。特点：设置压力上下限范围，监测频率低，减少设备磨损，操作简便。',
                                steps: [
                                    { name: '1. 关闭阀门', desc: '关闭所有进出站阀门，确保管段完全隔离' },
                                    { name: '2. 设定压力区间', desc: '设定压力在1.8-2.1MPa区间内波动，无需精确控制' },
                                    { name: '3. 低频检查计划', desc: '每4小时检查一次压力状态，大幅降低工作负担' },
                                    { name: '4. 下限补压策略', desc: '仅在压力低于下限1.8MPa时补压至2.0MPa' },
                                    { name: '5. 定期评估', desc: '每24小时评估区间控制效果，必要时调整参数' }
                                ],
                                labelLine: {
                                    length: 15,
                                    length2: 30,
                                    lineStyle: {
                                        color: '#ff7eb3'
                                    }
                                }
                            }
                        ]
                    }
                ]
            };
            
            // 设置图表选项
            this.risk_chart.setOption(option);
            
            // 添加点击事件处理
            this.risk_chart.off('click');
            this.risk_chart.on('click', (params) => {
                if (params.seriesName === '保压方案') {
                    const planData = params.data;
                    // 使用ElementUI的Dialog组件显示弹窗，采用与管段详细信息相同的风格
                    this.$alert(`
                        <div class="dialog-content wider-content">
                            <div class="info-section">
                                <h3>${planData.name}</h3>
                                <p class="plan-description">${planData.desc}</p>
                            </div>
                            
                            <div class="info-flex-container">
                                <div class="info-section flex-section">
                                    <h3>实施步骤</h3>
                                    <div class="steps-container">
                                        ${planData.steps.map((step, index) => `
                                            <div class="step-item">
                                                <span class="step-number">${index + 1}</span>
                                                <div class="step-content">
                                                    <div class="step-title">${step.name.split('. ')[1]}</div>
                                                    <div class="step-desc">${step.desc}</div>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                                
                                <div class="info-section flex-section">
                                    <h3>参数配置</h3>
                                    <div class="params-container">
                                        <div class="param-item">
                                            <span class="param-label">初始压力：</span>
                                            <span class="param-value">${planData.name === '恒压保持法' ? '2.0 MPa' : planData.name === '缓降调整法' ? '2.2 MPa' : '1.8-2.1 MPa'}</span>
                                        </div>
                                        <div class="param-item">
                                            <span class="param-label">监测频率：</span>
                                            <span class="param-value">${planData.name === '恒压保持法' ? '1小时/次' : planData.name === '缓降调整法' ? '2小时/次' : '4小时/次'}</span>
                                        </div>
                                        <div class="param-item">
                                            <span class="param-label">压降阈值：</span>
                                            <span class="param-value">${planData.name === '恒压保持法' ? '0.05 MPa' : planData.name === '缓降调整法' ? '0.1 MPa' : '0.3 MPa'}</span>
                                        </div>
                                        <div class="param-item">
                                            <span class="param-label">适用时长：</span>
                                            <span class="param-value">${planData.name === '恒压保持法' ? '12-24小时' : planData.name === '缓降调整法' ? '24-48小时' : '>48小时'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `, '保压方案详情', {
                        dangerouslyUseHTMLString: true,
                        customClass: 'info-dialog pressure-plan-dialog wide-dialog',
                        showConfirmButton: false,
                        closeOnClickModal: true,
                        closeOnPressEscape: true,
                        callback: action => { }
                    });
                }
            });
        },
        handleClose(done) {
            done();
        },
        // 显示阀室详情
        showValveDetails(valveName) {
            this.selectedValve = valveName;
            this.$nextTick(() => {
                this.valveDetailVisible = true;
            });
        },
        startCountdown() {
            this.countdownTimer = setInterval(() => {
                // 更新阀室#1倒计时
                if (this.countdowns['阀室#1'].seconds > 0) {
                    this.countdowns['阀室#1'].seconds--;
                } else if (this.countdowns['阀室#1'].minutes > 0) {
                    this.countdowns['阀室#1'].minutes--;
                    this.countdowns['阀室#1'].seconds = 59;
                }
                
                // 更新阀室#2倒计时
                if (this.countdowns['阀室#2'].seconds > 0) {
                    this.countdowns['阀室#2'].seconds--;
                } else if (this.countdowns['阀室#2'].minutes > 0) {
                    this.countdowns['阀室#2'].minutes--;
                    this.countdowns['阀室#2'].seconds = 59;
                }
            }, 1000);
        },
        showConfigDialog() {
            this.configDialogVisible = true;
        },
        showAlarmDialog() {
            this.alarmDialogVisible = true;
        },
        triggerAlarm() {
            // 这里应该添加启动警报的逻辑
            console.log('启动警报');
            this.alarmDialogVisible = false;
        },
        applyConfig() {
            // 这里应该添加应用配置的逻辑
            console.log('应用配置');
            this.configDialogVisible = false;
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

/* 测试style */
.xm_cszs {
    font-size: 19px;
    padding: 10px 0px 0px 0px;
    text-align: center;
}

.xm_cszs li {
    width: 300px;
    line-height: 50px;
    overflow: auto;
    margin: 5px;
}

.xm_cszs li span {
    color: #00ff00;
    padding: 0 5px 0 10px
}

.xm_cszs li p {
    float: left;
    width: 50%
}

.xm_cszs li p span {
    color: #00ffff;
    padding: 0
}

.xm_cszs li p cite {
    color: #00ffff;
}

/* 默认数据样式 */
.default-data {
    padding: 10px;
    position: relative;
}

/* 查看更多按钮样式 */
.more-info-btn {
    position: absolute;
    right: 20px;
    bottom: 10px;
    background-color: #093e79;
    border-color: #66dffb;
    color: #66dffb;
    font-size: 1rem;
    padding: 8px 20px;
}

.more-info-btn:hover {
    background-color: #0d4b8f;
    border-color: #00ff00;
    color: #00ff00;
}

/* 弹窗样式 */
.info-dialog {
    background: linear-gradient(to bottom, #093e79, #032d60);
    border: 1px solid #66dffb;
    border-radius: 8px;
}

.info-dialog .el-dialog__header {
    background: linear-gradient(to right, #093e79, #032d60);
    padding: 20px;
    border-bottom: 1px solid #66dffb;
}

.info-dialog .el-dialog__title {
    color: #66dffb;
    font-size: 1.5rem;
}

.info-dialog .el-dialog__body {
    padding: 30px 20px;
    color: #fff;
}

.info-dialog .el-dialog__footer {
    background: linear-gradient(to right, #093e79, #032d60);
    padding: 15px;
    border-top: 1px solid #66dffb;
}

/* 弹窗内容样式 */
.dialog-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.info-section {
    background: rgba(9, 62, 121, 0.5);
    border-radius: 8px;
    padding: 15px;
    border: 1px solid #66dffb;
}

.info-section h3 {
    color: #66dffb;
    margin-bottom: 15px;
    font-size: 1.2rem;
    border-bottom: 1px solid #66dffb;
    padding-bottom: 8px;
}

/* 修改按钮样式 */
.el-button {
    background-color: #093e79;
    border-color: #66dffb;
    color: #66dffb;
}

.el-button:hover {
    background-color: #0d4b8f;
    border-color: #00ff00;
    color: #00ff00;
}

.el-button--primary {
    background-color: #093e79;
    border-color: #66dffb;
}

.el-button--primary:hover {
    background-color: #0d4b8f;
    border-color: #00ff00;
}



.more-info {
    text-align: right;
    margin-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 15px;
}

.more-btn {
    color: #1a9bfc !important;
    font-size: 14px;
    display: inline-flex;
    align-items: center;
    transition: all 0.3s ease;
}

.more-btn:hover {
    color: #36a6fc !important;
    transform: translateX(5px);
}

.more-btn i {
    margin-left: 5px;
}

.info-dialog {
    background: linear-gradient(to bottom, #001529, #002140);
    border: 1px solid #1890ff;
}

.info-dialog .el-dialog__header {
    background: #001529;
    padding: 20px;
    border-bottom: 1px solid rgba(24, 144, 255, 0.3);
}

.info-dialog .el-dialog__title {
    color: #1890ff;
    font-size: 1.8rem;
    font-weight: 500;
}

.info-dialog .el-dialog__body {
    padding: 30px;
    background: linear-gradient(to bottom, #001529, #002140);
}

.dialog-content {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.info-section {
    background: rgba(0, 21, 41, 0.6);
    border-radius: 8px;
    padding: 20px;
    border: 1px solid rgba(24, 144, 255, 0.2);
}

.info-section h3 {
    color: #1890ff;
    margin-bottom: 20px;
    font-size: 1.4rem;
    font-weight: 500;
    border-bottom: 1px solid rgba(24, 144, 255, 0.2);
    padding-bottom: 10px;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
}

.info-item {
    display: flex;
    align-items: center;
    gap: 10px;
}

.info-item .label {
    color: rgba(255, 255, 255, 0.85);
    font-size: 1.1rem;
    min-width: 100px;
}

.info-item .value {
    color: #1890ff;
    font-size: 1.1rem;
    font-weight: 500;
}

.info-item .status-warning {
    color: #faad14;
}

.info-item .status-normal {
    color: #52c41a;
}

.info-dialog .el-dialog__footer {
    background: #001529;
    padding: 20px;
    border-top: 1px solid rgba(24, 144, 255, 0.3);
}

.info-dialog .el-button {
    font-size: 1.1rem;
    padding: 10px 24px;
    border-radius: 4px;
}

.info-dialog .el-button--primary {
    background: #1890ff;
    border-color: #1890ff;
}

.info-dialog .el-button--primary:hover {
    background: #40a9ff;
    border-color: #40a9ff;
}

.info-dialog .el-button--default {
    border-color: #1890ff;
    color: #1890ff;
}

.info-dialog .el-button--default:hover {
    background: rgba(24, 144, 255, 0.1);
    border-color: #40a9ff;
    color: #40a9ff;
}

/* 透漏油监测信息样式 */
.leakage-monitor {
    background: rgba(0, 21, 41, 0.6);
    border-radius: 4px;
    padding: 15px;
    margin: 10px;
    height: calc(100% - 40px);
}

.monitor-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
}

.monitor-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    background: rgba(24, 144, 255, 0.1);
    border-radius: 4px;
}

.monitor-item .label {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    margin-bottom: 5px;
}

.monitor-item .value {
    color: #1890ff;
    font-size: 16px;
    font-weight: 500;
}

.monitor-item .value.normal {
    color: #52c41a;
}

.monitor-status {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid rgba(24, 144, 255, 0.2);
}

.status-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
}

.status-indicator .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.status-indicator .dot.normal {
    background-color: #52c41a;
    box-shadow: 0 0 8px #52c41a;
}

.status-indicator .text {
    color: rgba(255, 255, 255, 0.85);
    font-size: 14px;
}

.status-time {
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
}

/* 添加新的样式 */
.pressure-grids {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    gap: 15px;
}

.pressure-grid {
    flex: 1;
    background: rgba(24, 144, 255, 0.1);
    border-radius: 4px;
    padding: 10px;
}

.grid-title {
    color: #1890ff;
    font-size: 16px;
    font-weight: 500;
    text-align: center;

    border-bottom: 1px solid rgba(24, 144, 255, 0.2);
}

/* 添加新的样式 */
.button-container {
    display: flex;
    justify-content: center;
    border-top: 1px solid rgba(24, 144, 255, 0.2);
}

/* 弹窗样式 */
.pressure-plan-dialog .el-dialog__body {
    padding: 20px;
    background: #001529;
    color: #fff;
}
.pressure-plan-dialog .el-dialog__header {
    background: #001529;
    border-bottom: 1px solid rgba(24, 144, 255, 0.2);
    padding: 15px 20px;
}
.pressure-plan-dialog .el-dialog__title {
    color: #ffffff;
    font-size: 28px;
    font-weight: bold;
}
.pressure-plan-dialog .el-dialog__headerbtn .el-dialog__close {
    color: #66dffb;
}
.pressure-plan-dialog .el-button--primary {
    background-color: #1890ff;
    border-color: #1890ff;
}
.pressure-plan-dialog .el-button--primary:hover {
    background-color: #40a9ff;
    border-color: #40a9ff;
}

/* 添加新的弹窗样式，与管段详细信息保持一致 */
.pressure-plan-dialog .plan-description {
    color: #ddd;
    line-height: 1.8;
    margin: 10px 0;
    padding: 12px;
    background: rgba(0, 21, 41, 0.4);
    border-radius: 4px;
    font-size: 18px;
}

.pressure-plan-dialog .steps-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    height: 100%;
    overflow-y: auto;
    max-height: 400px;
}

.pressure-plan-dialog .step-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    background: rgba(0, 21, 41, 0.4);
    border-radius: 4px;
    padding: 15px;
}

.pressure-plan-dialog .step-number {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 36px;
    height: 36px;
    background: #1890ff;
    color: white;
    border-radius: 50%;
    font-weight: bold;
    font-size: 20px;
}

.pressure-plan-dialog .step-content {
    flex: 1;
}

.pressure-plan-dialog .step-title {
    color: #1890ff;
    font-weight: 500;
    margin-bottom: 8px;
    font-size: 20px;
}

.pressure-plan-dialog .step-desc {
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.6;
    font-size: 18px;
}

.pressure-plan-dialog .params-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.pressure-plan-dialog .param-item {
    background: rgba(0, 21, 41, 0.4);
    border-radius: 4px;
    padding: 15px;
    display: flex;
    align-items: center;
}

.pressure-plan-dialog .param-label {
    color: rgba(255, 255, 255, 0.85);
    min-width: 120px;
    font-size: 20px;
}

.pressure-plan-dialog .param-value {
    color: #1890ff;
    font-weight: 500;
    font-size: 20px;
}

/* 删除不再需要的图表样式 */
.pressure-plan-dialog .param-chart,
.pressure-plan-dialog .chart-title,
.pressure-plan-dialog .trend-chart {
    display: none;
}

.pressure-plan-dialog .info-section h3 {
    color: #1890ff;
    margin-bottom: 20px;
    font-size: 22px;
    font-weight: 500;
    border-bottom: 1px solid rgba(24, 144, 255, 0.2);
    padding-bottom: 10px;
}

.pressure-plan-dialog .plan-description {
    color: #ddd;
    line-height: 1.8;
    margin: 10px 0;
    padding: 12px;
    background: rgba(0, 21, 41, 0.4);
    border-radius: 4px;
    font-size: 18px;
}

.pressure-plan-dialog .steps-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    height: 100%;
    overflow-y: auto;
    max-height: 400px;
}

.pressure-plan-dialog .step-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    background: rgba(0, 21, 41, 0.4);
    border-radius: 4px;
    padding: 15px;
}

.pressure-plan-dialog .step-number {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 36px;
    height: 36px;
    background: #1890ff;
    color: white;
    border-radius: 50%;
    font-weight: bold;
    font-size: 20px;
}

.pressure-plan-dialog .step-content {
    flex: 1;
}

.pressure-plan-dialog .step-title {
    color: #1890ff;
    font-weight: 500;
    margin-bottom: 8px;
    font-size: 20px;
}

.pressure-plan-dialog .step-desc {
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.6;
    font-size: 18px;
}

.pressure-plan-dialog .params-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.pressure-plan-dialog .param-item {
    background: rgba(0, 21, 41, 0.4);
    border-radius: 4px;
    padding: 15px;
    display: flex;
    align-items: center;
}

.pressure-plan-dialog .param-label {
    color: rgba(255, 255, 255, 0.85);
    min-width: 120px;
    font-size: 20px;
}

.pressure-plan-dialog .param-value {
    color: #1890ff;
    font-weight: 500;
    font-size: 20px;
}

/* 删除不再需要的图表样式 */
.pressure-plan-dialog .param-chart,
.pressure-plan-dialog .chart-title,
.pressure-plan-dialog .trend-chart {
    display: none;
}

.wider-content {
    overflow: hidden;
}

.info-flex-container {
    display: flex;
    gap: 20px;
    margin-top: 15px;
}

.flex-section {
    flex: 1;
    min-width: 0;
}

.pressure-plan-dialog .plan-description {
    color: #ddd;
    line-height: 1.6;
    margin: 10px 0;
    padding: 10px;
    background: rgba(0, 21, 41, 0.4);
    border-radius: 4px;
}

.pressure-plan-dialog .steps-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100%;
    overflow-y: auto;
    max-height: 400px;
}

.pressure-plan-dialog .step-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    background: rgba(0, 21, 41, 0.4);
    border-radius: 4px;
    padding: 12px;
}

.pressure-plan-dialog .step-number {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 28px;
    height: 28px;
    background: #1890ff;
    color: white;
    border-radius: 50%;
    font-weight: bold;
}

.pressure-plan-dialog .step-content {
    flex: 1;
}

.pressure-plan-dialog .step-title {
    color: #1890ff;
    font-weight: 500;
    margin-bottom: 5px;
    font-size: 16px;
}

.pressure-plan-dialog .step-desc {
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.5;
}

.pressure-plan-dialog .params-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.pressure-plan-dialog .param-item {
    background: rgba(0, 21, 41, 0.4);
    border-radius: 4px;
    padding: 12px;
    display: flex;
    align-items: center;
}

.pressure-plan-dialog .param-label {
    color: rgba(255, 255, 255, 0.85);
    min-width: 90px;
}

.pressure-plan-dialog .param-value {
    color: #1890ff;
    font-weight: 500;
}

.pressure-plan-dialog .param-chart {
    background: rgba(0, 21, 41, 0.4);
    border-radius: 4px;
    padding: 12px;
    margin-top: 10px;
}

.pressure-plan-dialog .chart-title {
    color: rgba(255, 255, 255, 0.85);
    margin-bottom: 10px;
    text-align: center;
}

.pressure-plan-dialog .trend-chart {
    width: 100%;
    border-radius: 4px;
    overflow: hidden;
}

/* 添加新的弹窗样式，与管段详细信息保持一致 */
.wide-dialog {
    width: 70% !important;
    max-width: 1200px;
}

.wider-content {
    overflow: hidden;
}

.info-flex-container {
    display: flex;
    gap: 20px;
    margin-top: 15px;
}

.flex-section {
    flex: 1;
    min-width: 0;
}

.pressure-plan-dialog .el-dialog__title {
    color: #66dffb;
    font-size: 24px;
    font-weight: bold;
}

.pressure-plan-dialog .info-section h3 {
    color: #1890ff;
    margin-bottom: 20px;
    font-size: 22px;
    font-weight: 500;
    border-bottom: 1px solid rgba(24, 144, 255, 0.2);
    padding-bottom: 10px;
}

.pressure-plan-dialog .plan-description {
    color: #ddd;
    line-height: 1.8;
    margin: 10px 0;
    padding: 12px;
    background: rgba(0, 21, 41, 0.4);
    border-radius: 4px;
    font-size: 18px;
}

.pressure-plan-dialog .steps-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    height: 100%;
    overflow-y: auto;
    max-height: 400px;
}

.pressure-plan-dialog .step-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    background: rgba(0, 21, 41, 0.4);
    border-radius: 4px;
    padding: 15px;
}

.pressure-plan-dialog .step-number {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 36px;
    height: 36px;
    background: #1890ff;
    color: white;
    border-radius: 50%;
    font-weight: bold;
    font-size: 20px;
}

.pressure-plan-dialog .step-content {
    flex: 1;
}

.pressure-plan-dialog .step-title {
    color: #1890ff;
    font-weight: 500;
    margin-bottom: 8px;
    font-size: 20px;
}

.pressure-plan-dialog .step-desc {
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.6;
    font-size: 18px;
}

.pressure-plan-dialog .params-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.pressure-plan-dialog .param-item {
    background: rgba(0, 21, 41, 0.4);
    border-radius: 4px;
    padding: 15px;
    display: flex;
    align-items: center;
}

.pressure-plan-dialog .param-label {
    color: rgba(255, 255, 255, 0.85);
    min-width: 120px;
    font-size: 20px;
}

.pressure-plan-dialog .param-value {
    color: #1890ff;
    font-weight: 500;
    font-size: 20px;
}

/* 删除不再需要的图表样式 */
.pressure-plan-dialog .param-chart,
.pressure-plan-dialog .chart-title,
.pressure-plan-dialog .trend-chart {
    display: none;
}

/* 修改弹窗头部标题样式 */
.pressure-plan-dialog {
    border: 1px solid #1890ff !important;
}

.pressure-plan-dialog .el-dialog__header {
    background: #001529 !important;
    padding: 15px 20px !important;
}

.pressure-plan-dialog .el-dialog__title {
    color: #ffffff !important;
    font-size: 28px !important;
    font-weight: bold !important;
    text-align: center !important;
    display: block !important;
}

/* 修改弹窗头部标题样式 */
.pressure-plan-dialog {
    border: 1px solid #1890ff !important;
}

.pressure-plan-dialog .el-message-box__header {
    background: #001529 !important;
    padding: 15px 20px !important;
}

.pressure-plan-dialog .el-message-box__title {
    color: #1890ff !important;
    font-size: 30px !important;
    font-weight: bold !important;
    display: block !important;
    margin-left: 15px !important;
}

/* 确保标题在左上角 */
.pressure-plan-dialog .el-message-box__header {
    text-align: left !important;
}

/* 增加标题提示图标 */
.pressure-plan-dialog .el-message-box__status {
    display: none !important;
}

/* 高点汽化风险样式 */
.risk-cell {
    display: flex !important;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4px !important;
    position: relative;
}

.risk-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 5px;
    display: inline-block;
}

.risk-cell.normal .risk-dot {
    background-color: #52c41a;
    box-shadow: 0 0 5px #52c41a;
}

.risk-cell.warning .risk-dot {
    background-color: #faad14;
    box-shadow: 0 0 5px #faad14;
}

.risk-cell.danger .risk-dot {
    background-color: #ff4d4f;
    box-shadow: 0 0 8px #ff4d4f;
    animation: pulse 1.5s infinite;
}

.risk-text {
    margin-left: 5px;
    font-weight: 500;
}

.risk-cell.normal .risk-text {
    color: #52c41a;
}

.risk-cell.warning .risk-text {
    color: #faad14;
}

.risk-cell.danger .risk-text {
    color: #ff4d4f;
}

.countdown {
    margin-top: 4px;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 12px;
    padding: 2px 8px;
    font-size: 12px;
}

.risk-cell.warning .countdown {
    color: #faad14;
}

.risk-cell.danger .countdown {
    color: #ff4d4f;
    animation: blink 1s infinite;
}

.danger-row {
    background-color: rgba(255, 77, 79, 0.15) !important;
}

.warning-row {
    background-color: rgba(250, 173, 20, 0.1) !important;
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 5px #ff4d4f;
    }
    50% {
        box-shadow: 0 0 15px #ff4d4f;
    }
    100% {
        box-shadow: 0 0 5px #ff4d4f;
    }
}

@keyframes blink {
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0.6;
    }
    100% {
        opacity: 1;
    }
}

/* 高点汽化监测面板样式 */
.vaporization-monitor {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 5px;
    height: 100%;
    overflow-y: auto;
}

.monitor-point {
    flex: 1;
    min-width: 200px;
    border-radius: 6px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
}

.monitor-point.danger {
    background: rgba(255, 77, 79, 0.15);
    border: 1px solid #ff4d4f;
    animation: danger-pulse 2s infinite;
}

.monitor-point.warning {
    background: rgba(250, 173, 20, 0.1);
    border: 1px solid #faad14;
}

.monitor-point.normal {
    background: rgba(82, 196, 26, 0.08);
    border: 1px solid #52c41a;
}

.point-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 8px;
    border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
}

.point-name {
    font-size: 16px;
    font-weight: bold;
    color: #fff;
}

.point-risk {
    font-size: 14px;
    padding: 2px 8px;
    border-radius: 12px;
}

.danger .point-risk {
    background: #ff4d4f;
    color: white;
}

.warning .point-risk {
    background: #faad14;
    color: white;
}

.normal .point-risk {
    background: #52c41a;
    color: white;
}

.point-body {
    display: flex;
    padding: 10px 0;
    flex: 1;
}

.point-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.info-item {
    display: flex;
    justify-content: space-between;
}

.info-item .label {
    color: rgba(255, 255, 255, 0.7);
}

.info-item .value {
    color: #1890ff;
    font-weight: 500;
}

.danger .info-item .value {
    color: #ff7875;
}

.warning .info-item .value {
    color: #ffc53d;
}

.normal .info-item .value {
    color: #73d13d;
}

.point-countdown {
    width: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.countdown-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 5px;
}

.countdown-timer {
    background: rgba(0, 0, 0, 0.5);
    padding: 5px 10px;
    border-radius: 16px;
    font-size: 18px;
    font-weight: bold;
    font-family: monospace;
}

.danger .countdown-timer {
    color: #ff4d4f;
    animation: blink 1s infinite;
}

.warning .countdown-timer {
    color: #faad14;
}

.point-status {
    width: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.status-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(82, 196, 26, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
}

.status-icon i {
    color: #52c41a;
    font-size: 24px;
}

.status-text {
    color: #52c41a;
    font-size: 14px;
}

.point-footer {
    display: flex;
    justify-content: space-around;
    padding-top: 8px;
    border-top: 1px dashed rgba(255, 255, 255, 0.2);
}

.other-points {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border-radius: 6px;
    background: rgba(0, 0, 0, 0.2);
    margin-top: 10px;
}

.other-point {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.other-point::after {
    content: attr(data-name);
    position: absolute;
    top: -20px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    white-space: nowrap;
}

.other-point .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
}

.other-point.normal {
    background: rgba(82, 196, 26, 0.1);
    border: 1px solid rgba(82, 196, 26, 0.5);
}

.other-point.normal .dot {
    background: #52c41a;
    box-shadow: 0 0 5px #52c41a;
}

@keyframes danger-pulse {
    0% {
        box-shadow: 0 0 5px rgba(255, 77, 79, 0.5);
    }
    50% {
        box-shadow: 0 0 15px rgba(255, 77, 79, 0.8);
    }
    100% {
        box-shadow: 0 0 5px rgba(255, 77, 79, 0.5);
    }
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 5px #ff4d4f;
    }
    50% {
        box-shadow: 0 0 15px #ff4d4f;
    }
    100% {
        box-shadow: 0 0 5px #ff4d4f;
    }
}

@keyframes blink {
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0.6;
    }
    100% {
        opacity: 1;
    }
}

/* 管道可视化样式 */
.pipeline-monitoring {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 5px;
    position: relative;
    background: rgba(0, 21, 41, 0.3);
    border-radius: 4px;
}

/* 阀室卡片布局 */
.valve-cards {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    margin-bottom: 0;
}

.valve-card {
    flex: 1;
    height: 130px;
    background: rgba(0, 21, 41, 0.7);
    margin: 0 5px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    position: relative;
    transition: all 0.3s;
    cursor: pointer;
    overflow: hidden;
}

.valve-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.valve-card:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
}

.valve-card.danger:before {
    background: #ff4d4f;
    box-shadow: 0 0 10px rgba(255, 77, 79, 0.5);
}

.valve-card.warning:before {
    background: #faad14;
    box-shadow: 0 0 10px rgba(250, 173, 20, 0.5);
}

.valve-card.normal:before {
    background: #52c41a;
    box-shadow: 0 0 10px rgba(82, 196, 26, 0.5);
}

.valve-card.danger {
    box-shadow: 0 0 10px rgba(255, 77, 79, 0.3);
}

.valve-card.warning {
    box-shadow: 0 0 10px rgba(250, 173, 20, 0.3);
}

.valve-card.normal {
    box-shadow: 0 0 10px rgba(82, 196, 26, 0.3);
}

.valve-icon {
    margin-top: 5px;
    margin-bottom: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
}

.valve-icon i {
    font-size: 24px;
}

.danger .valve-icon i {
    color: #ff4d4f;
}

.warning .valve-icon i {
    color: #faad14;
}

.normal .valve-icon i {
    color: #52c41a;
}

.valve-info {
    width: 100%;
    text-align: center;
    margin-bottom: 8px;
}

.valve-name {
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    margin-bottom: 2px;
}

.valve-position {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 2px;
}

.valve-elevation {
    font-size: 12px;
    color: #1890ff;
    margin-bottom: 0;
}

.valve-status {
    width: 100%;
    text-align: center;
    margin-top: auto;
}

.status-label {
    font-size: 12px;
    font-weight: bold;
    padding: 2px 8px;
    border-radius: 10px;
    display: inline-block;
    margin-bottom: 5px;
}

.danger .status-label {
    background: rgba(255, 77, 79, 0.2);
    color: #ff4d4f;
}

.warning .status-label {
    background: rgba(250, 173, 20, 0.2);
    color: #faad14;
}

.normal .status-label {
    background: rgba(82, 196, 26, 0.2);
    color: #52c41a;
}

.countdown {
    font-size: 18px;
    font-weight: bold;
    font-family: monospace;
    margin-bottom: 2px;
}

.danger .countdown {
    color: #ff4d4f;
    animation: blink 1s infinite;
}

.warning .countdown {
    color: #faad14;
}

.countdown-label {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.7);
}

/* 控制面板样式 */
.control-panel {
    display: flex;
    flex-direction: column;
    background: rgba(0, 21, 41, 0.5);
    border-radius: 4px;
    margin-top: 8px;
    overflow: hidden;
    border: 1px solid rgba(24, 144, 255, 0.2);
}

.panel-title {
    background: linear-gradient(to right, #001529, #002140);
    color: #1890ff;
    font-size: 14px;
    font-weight: bold;
    padding: 8px 15px;
    border-bottom: 1px solid rgba(24, 144, 255, 0.3);
}

.panel-content {
    display: flex;
    justify-content: space-between;
    padding: 10px;
}

.panel-buttons {
    display: flex;
    gap: 10px;
}

.control-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    color: white;
    font-size: 12px;
    transition: all 0.3s;
}

.control-btn.primary {
    background: #1890ff;
}

.control-btn.primary:hover {
    background: #40a9ff;
}

.control-btn.warning {
    background: #faad14;
}

.control-btn.warning:hover {
    background: #ffc53d;
}

.control-btn.info {
    background: #096dd9;
}

.control-btn.info:hover {
    background: #1890ff;
}

.control-btn i {
    font-size: 14px;
}

.panel-stats {
    display: flex;
    align-items: flex-end;
}

.stat-group {
    display: flex;
    gap: 15px;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.stat-label {
    color: rgba(255, 255, 255, 0.7);
    font-size: 12px;
    margin-bottom: 4px;
}

.stat-value {
    color: #1890ff;
    font-size: 18px;
    font-weight: bold;
}

.stat-value.danger {
    color: #ff4d4f;
    animation: blink 1s infinite;
}

/* 阀室详情弹窗样式 */
.valve-detail-dialog {
    background: linear-gradient(to bottom, #001529, #002140);
    border: 1px solid #1890ff;
}

.valve-detail-dialog .el-dialog__header {
    background: #001529;
    padding: 20px;
    border-bottom: 1px solid rgba(24, 144, 255, 0.3);
}

.valve-detail-dialog .el-dialog__title {
    color: #1890ff;
    font-size: 1.8rem;
    font-weight: 500;
}

.valve-detail-dialog .el-dialog__body {
    padding: 0;
    background: linear-gradient(to bottom, #001529, #002140);
}

.valve-detail-content {
    padding: 20px;
}

.valve-detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.valve-detail-title {
    font-size: 1.4rem;
    color: #fff;
    font-weight: 500;
}

.valve-detail-status {
    padding: 5px 15px;
    border-radius: 20px;
    font-weight: bold;
}

.valve-detail-status.danger {
    background: rgba(255, 77, 79, 0.2);
    color: #ff4d4f;
    border: 1px solid #ff4d4f;
}

.valve-detail-status.warning {
    background: rgba(250, 173, 20, 0.2);
    color: #faad14;
    border: 1px solid #faad14;
}

.valve-detail-status.normal {
    background: rgba(82, 196, 26, 0.2);
    color: #52c41a;
    border: 1px solid #52c41a;
}

.valve-detail-body {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.valve-detail-info {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.warning-info {
    display: flex;
    background: rgba(255, 77, 79, 0.1);
    border: 1px solid rgba(255, 77, 79, 0.3);
    border-radius: 6px;
    padding: 15px;
    gap: 15px;
}

.warning-icon {
    font-size: 24px;
}

.warning-icon .el-icon-error {
    color: #ff4d4f;
}

.warning-icon .el-icon-warning {
    color: #faad14;
}

.warning-content {
    flex: 1;
}

.warning-title {
    font-size: 16px;
    font-weight: bold;
    color: #ff4d4f;
    margin-bottom: 8px;
}

.warning-desc {
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.6;
}

.action-buttons {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 20px;
}

@keyframes danger-pulse {
    0% {
        box-shadow: 0 0 5px rgba(255, 77, 79, 0.5);
    }
    50% {
        box-shadow: 0 0 20px rgba(255, 77, 79, 0.8);
    }
    100% {
        box-shadow: 0 0 5px rgba(255, 77, 79, 0.5);
    }
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 5px #ff4d4f;
    }
    50% {
        box-shadow: 0 0 15px #ff4d4f;
    }
    100% {
        box-shadow: 0 0 5px #ff4d4f;
    }
}

@keyframes blink {
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0.6;
    }
    100% {
        opacity: 1;
    }
}

/* 透漏油监测信息样式 */
</style>

/* 覆盖Element UI Dialog样式 */
.el-dialog__wrapper {
  background-color: rgba(0, 0, 0, 0.2) !important; /* 降低蒙层黑度 */
}

.el-dialog {
  background-color: rgba(0, 21, 41, 0.9) !important;
  border: 1px solid rgba(24, 144, 255, 0.3);
  border-radius: 4px;
  box-shadow: 0 0 20px rgba(0, 150, 255, 0.3);
}

.el-dialog__header {
  background: linear-gradient(to right, #001529, #002140);
  padding: 15px 20px;
  border-bottom: 1px solid rgba(24, 144, 255, 0.3);
}

.el-dialog__title {
  color: #1890ff;
  font-size: 16px;
  font-weight: bold;
}

.el-dialog__headerbtn .el-dialog__close {
  color: #1890ff;
}

.el-dialog__body {
  color: #fff;
  padding: 20px;
}

.el-dialog__footer {
  border-top: 1px solid rgba(24, 144, 255, 0.3);
  padding: 10px 20px;
}

/* 去除黑闪效果 */
.v-modal {
  opacity: 0.2 !important;
  background-color: #000 !important;
}

/* 修改动画效果 */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.2s, transform 0.2s !important;
}

.dialog-fade-enter,
.dialog-fade-leave-to {
  opacity: 0 !important;
  transform: translateY(-20px) !important;
}

/* 闪烁动画 */
@keyframes blink {
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0.3;
    }
    100% {
        opacity: 1;
    }
}

.countdown {
    font-size: 18px;
    font-weight: bold;
    font-family: monospace;
    margin-bottom: 2px;
}

.danger .countdown {
    color: #ff4d4f;
    animation: blink 1s infinite;
}

.warning .countdown {
    color: #faad14;
}

.countdown-label {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.7);
}

.countdown-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  margin-bottom: 20px;
}

.countdown-box {
  background: rgba(32, 32, 32, 0.8);
  border-radius: 6px;
  padding: 12px 20px;
  min-width: 200px;
  text-align: center;
  border: 1px solid #444;
  
  &.warning {
    border-color: #ffd700;
    background: rgba(255, 215, 0, 0.1);
  }
  
  &.danger {
    border-color: #ff4d4f;
    background: rgba(255, 77, 79, 0.1);
  }
}

.countdown-title {
  font-size: 16px;
  color: #fff;
  margin-bottom: 8px;
}

.countdown-display {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.countdown {
  font-size: 28px;
  font-weight: bold;
  font-family: 'Digital-7', monospace;
  color: #fff;
  
  .warning & {
    color: #ffd700;
  }
  
  .danger & {
    color: #ff4d4f;
  }
}

.countdown-label {
  font-size: 14px;
  opacity: 0.7;
  margin-top: 5px;
}

/* 弹窗中的倒计时样式 */
.countdown-container {
    margin-top: 20px;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.1);
    padding: 15px;
    border-radius: 8px;
}

.countdown-box {
    display: inline-block;
    padding: 15px 30px;
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.2);
    margin: 10px auto;
    border: 2px solid;
}

.countdown-box.danger {
    border-color: #ff5252;
    box-shadow: 0 0 15px rgba(255, 82, 82, 0.4);
}

.countdown-box.warning {
    border-color: #ffa726;
    box-shadow: 0 0 15px rgba(255, 167, 38, 0.4);
}

.countdown-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
}

.countdown-display {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.countdown-display .countdown {
    font-size: 36px;
    font-weight: bold;
    font-family: 'Digital', monospace;
    letter-spacing: 2px;
}

.danger .countdown-display .countdown {
    color: #ff5252;
}

.warning .countdown-display .countdown {
    color: #ffa726;
}

.countdown-display .countdown-label {
    font-size: 14px;
    opacity: 0.7;
}

/* 管段切换选择器样式 */
.pipeline-selector {
    padding: 15px;
    display: flex;
    justify-content: center;
    margin-bottom: 5px;
}

.pipeline-select {
    width: 90%;
}

.pipeline-select .el-input__inner {
    background: rgba(2, 32, 71, 0.9);
    border: 1px solid #66dffb;
    border-radius: 4px;
    color: #ffffff;
    font-size: 1.1rem;
    height: 42px;
    text-align: center !important;
    box-shadow: 0 0 10px rgba(102, 223, 251, 0.3);
    transition: all 0.3s ease;
    padding-left: 20px !important;
    padding-right: 20px !important;
}

.pipeline-select .el-input__inner::placeholder {
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
}

.pipeline-select .el-input__suffix {
    right: 10px;
}

.pipeline-select .el-select__caret {
    color: #66dffb;
    font-size: 18px;
    transform: rotateZ(180deg);
    transition: transform 0.3s;
}

.pipeline-select .el-select__caret.is-reverse {
    transform: rotateZ(0);
}

.pipeline-icon {
    color: #66dffb;
    margin-right: 5px;
}

/* 自定义下拉菜单样式 */
.pipeline-dropdown {
    background: rgba(2, 32, 71, 0.95) !important;
    border: 1px solid #66dffb !important;
    border-radius: 4px !important;
    box-shadow: 0 0 15px rgba(102, 223, 251, 0.4) !important;
}

.pipeline-dropdown .el-select-dropdown__item {
    color: #ffffff !important;
    font-size: 1.1rem !important;
    height: 42px !important;
    line-height: 42px !important;
    padding: 0 20px !important;
    border-bottom: 1px solid rgba(102, 223, 251, 0.1) !important;
}

.pipeline-dropdown .el-select-dropdown__item:last-child {
    border-bottom: none !important;
}

.pipeline-dropdown .el-select-dropdown__item.hover,
.pipeline-dropdown .el-select-dropdown__item:hover {
    background-color: rgba(26, 106, 170, 0.5) !important;
    color: #66dffb !important;
}

.pipeline-dropdown .el-select-dropdown__item.selected {
    background-color: #1a6aaa !important;
    color: #66dffb !important;
    font-weight: bold !important;
}

.pipeline-dropdown .popper__arrow {
    border-bottom-color: #66dffb !important;
}

.pipeline-dropdown .popper__arrow::after {
    border-bottom-color: rgba(2, 32, 71, 0.95) !important;
}


<style scoped>
/* Ensuring the outer style tag closure remains */
</style>

<style>
/* Global dropdown styles */
.pipeline-dropdown {
    background: rgba(2, 32, 71, 0.95) !important;
    border: 1px solid #66dffb !important;
    border-radius: 4px !important;
    box-shadow: 0 0 15px rgba(102, 223, 251, 0.4) !important;
}

.pipeline-dropdown .el-select-dropdown__item {
    color: #ffffff !important;
    font-size: 1.1rem !important;
    height: 42px !important;
    line-height: 42px !important;
    padding: 0 20px !important;
    border-bottom: 1px solid rgba(102, 223, 251, 0.1) !important;
}

.pipeline-dropdown .el-select-dropdown__item:last-child {
    border-bottom: none !important;
}

.pipeline-dropdown .el-select-dropdown__item.hover,
.pipeline-dropdown .el-select-dropdown__item:hover {
    background-color: rgba(26, 106, 170, 0.5) !important;
    color: #66dffb !important;
}

.pipeline-dropdown .el-select-dropdown__item.selected {
    background-color: #1a6aaa !important;
    color: #66dffb !important;
    font-weight: bold !important;
}

.pipeline-dropdown .popper__arrow {
    border-bottom-color: #66dffb !important;
}

.pipeline-dropdown .popper__arrow::after {
    border-bottom-color: rgba(2, 32, 71, 0.95) !important;
}
</style>

<style>
/* Global dropdown styles */
.pipeline-dropdown {
    background: rgba(2, 32, 71, 0.95) !important;
    border: 1px solid #66dffb !important;
    border-radius: 4px !important;
    box-shadow: 0 0 15px rgba(102, 223, 251, 0.4) !important;
}

.pipeline-dropdown .el-select-dropdown__item {
    color: #ffffff !important;
    font-size: 1.1rem !important;
    height: 42px !important;
    line-height: 42px !important;
    padding: 0 20px !important;
    border-bottom: 1px solid rgba(102, 223, 251, 0.1) !important;
}

.pipeline-dropdown .el-select-dropdown__item:last-child {
    border-bottom: none !important;
}

.pipeline-dropdown .el-select-dropdown__item.hover,
.pipeline-dropdown .el-select-dropdown__item:hover {
    background-color: rgba(26, 106, 170, 0.5) !important;
    color: #66dffb !important;
}

.pipeline-dropdown .el-select-dropdown__item.selected {
    background-color: #1a6aaa !important;
    color: #66dffb !important;
    font-weight: bold !important;
}

.pipeline-dropdown .popper__arrow {
    border-bottom-color: #66dffb !important;
}

.pipeline-dropdown .popper__arrow::after {
    border-bottom-color: rgba(2, 32, 71, 0.95) !important;
}

.pipeline-select .el-input__inner::placeholder {
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
}

.pipeline-select .el-input__inner:hover,
.pipeline-select .el-input__inner:focus {
    border-color: #00ffff;
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
}
</style>

<style>
/* 自定义下拉框样式 */
.custom-select .el-input__inner {
    text-align: center !important;
    font-size: 15px !important;
    background-color: rgba(2, 32, 71, 0.9) !important;
    color: white !important;
    border: 1px solid #66dffb !important;
    border-radius: 4px !important;
    height: 35px !important;
    box-shadow: 0 0 10px rgba(102, 223, 251, 0.3) !important;
    padding: 0 25px !important;
    letter-spacing: 1px !important;
}

.custom-select .el-input {
    display: flex !important;
    justify-content: center !important;
    text-align: center !important;
}

.custom-select .el-input__suffix {
    right: 5px !important;
}

.invisible-select .el-input__inner {
    opacity: 0;
}
</style>

<style>
/* 倒计时动画 */
@keyframes blink {
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0.6;
    }
    100% {
        opacity: 1;
    }
}

/* 透漏油监测信息样式 */
</style>

<style>
/* 警报弹窗样式 */
.alarm-dialog .el-dialog__header {
    background: linear-gradient(to right, #8B0000, #A52A2A) !important;
    border-bottom: 1px solid #ff4d4f !important;
}

.alarm-dialog .el-dialog__title {
    color: #fff !important;
    font-weight: bold !important;
}

.alarm-dialog-content {
    background: #001529;
    padding: 0;
}

.alarm-header {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 20px;
    background: rgba(255, 77, 79, 0.1);
    border-radius: 4px;
    margin-bottom: 20px;
}

.alarm-icon {
    font-size: 40px;
    color: #ff4d4f;
    animation: blink 1s infinite;
}

.alarm-title {
    color: #ff4d4f;
    font-size: 24px;
    font-weight: bold;
}

.alarm-section {
    margin-bottom: 20px;
}

.alarm-section h3 {
    color: #1890ff;
    font-size: 18px;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(24, 144, 255, 0.2);
}

.alarm-details {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
}

.alarm-detail-item {
    background: rgba(0, 0, 0, 0.2);
    padding: 12px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.detail-label {
    color: rgba(255, 255, 255, 0.7);
    font-size: 16px;
}

.detail-value {
    color: #1890ff;
    font-size: 16px;
    font-weight: 500;
}

.detail-value.danger {
    color: #ff4d4f;
}

.alarm-level-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
}

.level-option {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    padding: 15px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s;
}

.level-option:hover {
    background: rgba(0, 0, 0, 0.3);
}

.level-option.active {
    box-shadow: 0 0 10px rgba(24, 144, 255, 0.5);
    border: 1px solid #1890ff;
    background: rgba(24, 144, 255, 0.1);
}

.level-icon {
    margin-right: 10px;
}

.level-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
}

.level-dot.low {
    background-color: #52c41a;
    box-shadow: 0 0 8px #52c41a;
}

.level-dot.medium {
    background-color: #faad14;
    box-shadow: 0 0 8px #faad14;
}

.level-dot.high {
    background-color: #ff4d4f;
    box-shadow: 0 0 8px #ff4d4f;
    animation: blink 1s infinite;
}

.level-content {
    flex: 1;
}

.level-title {
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    margin-bottom: 5px;
}

.level-desc {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
}

.notification-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
}

.notification-item {
    background: rgba(0, 0, 0, 0.2);
    padding: 12px;
    border-radius: 4px;
}

.notification-item .el-checkbox__label {
    color: #fff;
    font-size: 16px;
}

/* 配置处置弹窗样式 */
.config-detail-dialog .el-dialog__header {
    background: linear-gradient(to right, #003366, #006699) !important;
    border-bottom: 1px solid #1890ff !important;
}

.config-detail-dialog .el-dialog__title {
    color: #fff !important;
    font-weight: bold !important;
}

.plan-selector {
    margin-top: 15px;
    margin-bottom: 20px;
}

.plan-selector .el-radio-group {
    display: flex;
    width: 100%;
}

.plan-selector .el-radio-button {
    flex: 1;
}

.plan-selector .el-radio-button__inner {
    width: 100%;
    text-align: center;
    background: rgba(24, 144, 255, 0.1);
    border-color: #1890ff;
    color: #1890ff;
}

.plan-selector .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: #1890ff;
    color: #fff;
    border-color: #1890ff;
    box-shadow: -1px 0 0 0 #1890ff;
}

.plan-description {
    background: rgba(0, 0, 0, 0.2);
    padding: 15px;
    border-radius: 4px;
    color: rgba(255, 255, 255, 0.85);
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 20px;
}

.param-config {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.param-item {
    background: rgba(0, 0, 0, 0.2);
    padding: 15px;
    border-radius: 4px;
}

.param-label {
    color: rgba(255, 255, 255, 0.85);
    font-size: 16px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
}

.param-item .el-slider__runway {
    margin: 20px 0;
}

.param-item .el-slider__bar {
    background-color: #1890ff;
}

.param-item .el-slider__button {
    border-color: #1890ff;
}

.execution-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
}

.execution-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(0, 0, 0, 0.2);
    padding: 15px;
    border-radius: 4px;
}

/* 弹窗统一样式 */
.alarm-detail-dialog .el-dialog__body,
.config-detail-dialog .el-dialog__body {
    padding: 0;
}

.alarm-detail-dialog .valve-detail-status.danger {
    background: rgba(255, 77, 79, 0.2);
    color: #ff4d4f;
    border: 1px solid #ff4d4f;
}

/* 覆盖Element UI组件样式 */
.el-checkbox__input.is-checked + .el-checkbox__label {
    color: #1890ff;
}

.el-checkbox__input.is-checked .el-checkbox__inner, 
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #1890ff;
    border-color: #1890ff;
}

.el-switch.is-checked .el-switch__core {
    border-color: #1890ff;
    background-color: #1890ff;
}

/* 自定义下拉框样式 */
</style>