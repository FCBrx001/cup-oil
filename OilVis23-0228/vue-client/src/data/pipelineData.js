export const pipelineData = {
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
} 