<template>
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
</template>

<script>
export default {
  name: 'PipelineSelector',
  props: {
    value: {
      type: String,
      default: 'pipeline1'
    },
    options: {
      type: Array,
      default: () => [
        { value: 'pipeline1', label: '黄埔 至 东莞' },
        { value: 'pipeline2', label: '阳江 至 恩平' },
        { value: 'pipeline3', label: '恩平 至 鹤山' }
      ]
    }
  },
  computed: {
    selectedPipeline: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    },
    pipelineOptions() {
      return this.options;
    },
    currentPipelineLabel() {
      const option = this.pipelineOptions.find(item => item.value === this.selectedPipeline);
      return option ? option.label : '';
    }
  },
  methods: {
    changePipeline(value) {
      this.$emit('change', value);
    }
  }
}
</script>

<style scoped>
.pipeline-select {
  opacity: 0;
}

.invisible-select ::v-deep .el-input__inner {
  opacity: 0;
}
</style> 