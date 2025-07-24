// 测试双图表对比逻辑
console.log('=== 测试双图表对比逻辑 ===');

// 模拟初始状态
let selectedValves = [];

// 模拟点击事件处理函数
function handleValveClick(data) {
  // 构造点击的站点数据
  const newValve = {
    valveId: `${data.stationType}_${data.valveIndex || 0}`,
    valveName: data.valveName,
    valveIndex: data.valveIndex || 0,
    stationType: data.stationType || 'valve',
    stationData: data.stationData || {},
    x: data.x,
    y: data.y
  };

  // 构造黄埔站数据作为基准对比站点
  const huangpuValve = {
    valveId: 'startStation_0',
    valveName: '黄埔',
    valveIndex: 0,
    stationType: 'startStation',
    stationData: {
      environmentTemp: 26,
      inletPressure: 2.6,
      inletTemp: 88,
      outletPressure: 2.4,
      outletTemp: 87
    },
    x: 0,
    y: 650
  };

  // 构造东莞站数据
  const dongguanValve = {
    valveId: 'endStation_0',
    valveName: '东莞',
    valveIndex: 0,
    stationType: 'endStation',
    stationData: {
      environmentTemp: 24,
      inletPressure: 0.8,
      inletTemp: 85,
      outletPressure: 0.6,
      outletTemp: 84
    },
    x: 500,
    y: 650
  };

  if (selectedValves.length === 0) {
    // 第一次点击站点
    if (data.valveName === '黄埔') {
      // 点击黄埔：黄埔 vs 东莞
      selectedValves = [huangpuValve, dongguanValve];
      console.log('✓ 正在对比 黄埔站 与 东莞站');
    } else {
      // 点击其他站点：黄埔 vs 选中站点
      selectedValves = [huangpuValve, newValve];
      console.log(`✓ 正在对比 黄埔站 与 ${data.valveName}`);
    }
  } else if (selectedValves.length === 1) {
    // 只有一个站点时，点击另一个站点开始对比
    const existingStation = selectedValves[0];
    
    // 检查是否点击了相同的站点
    if (existingStation.valveName === data.valveName) {
      console.log(`⚠️ ${data.valveName} 已经在对比中，不能重复选择同一站点`);
      return;
    }
    
    // 添加第二个站点开始对比
    selectedValves.push(newValve);
    console.log(`✓ 正在对比 ${existingStation.valveName} 与 ${data.valveName}`);
  } else if (selectedValves.length === 2) {
    // 检查是否点击了已经选中的站点
    const isAlreadySelected = selectedValves.some(valve => valve.valveName === data.valveName);
    
    if (isAlreadySelected) {
      // 如果点击的是已经选中的站点，显示警告信息
      console.log(`⚠️ ${data.valveName} 已经在对比中，不能重复选择同一站点`);
      return; // 直接返回，不进行任何操作
    }
    
    // 已有两个站点，点击第三个站点：保留第二个站点，替换为新选中站点
    const secondStation = selectedValves[1]; // 保留第二个站点
    selectedValves = [secondStation, newValve];
    console.log(`✓ 正在对比 ${secondStation.valveName} 与 ${data.valveName}`);
  }
  
  console.log('当前选中的站点:', selectedValves.map(v => v.valveName));
  console.log('---');
}

// 测试场景
console.log('\n场景1: 初始状态点击十字窖');
handleValveClick({ valveName: '十字窖', stationType: 'valve', valveIndex: 1, x: 200, y: 650 });

console.log('\n场景2: 继续点击站点2');
handleValveClick({ valveName: '站点2', stationType: 'valve', valveIndex: 2, x: 350, y: 650 });

console.log('\n场景3: 继续点击东莞');
handleValveClick({ valveName: '东莞', stationType: 'endStation', valveIndex: 0, x: 500, y: 650 });

console.log('\n场景4: 重新开始，点击黄埔');
selectedValves = [];
handleValveClick({ valveName: '黄埔', stationType: 'startStation', valveIndex: 0, x: 0, y: 650 });

console.log('\n场景5: 在黄埔vs东莞基础上点击十字窖');
handleValveClick({ valveName: '十字窖', stationType: 'valve', valveIndex: 1, x: 200, y: 650 });

console.log('\n=== 测试完成 ===');