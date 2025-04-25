<template>
  <div class="pipe-capacity-calculation">
    <div class="page-header">
      <h1>管道容量计算</h1>
      <div class="component-container">
        <PipeShutdownCapacity />
      </div>
    </div>
  </div>
</template>

<script>
import PipeShutdownCapacity from '@/components/PipeCalculation/PipeShutdownCapacity.vue'

export default {
  name: 'PipeCapacityCalculation',
  components: {
    PipeShutdownCapacity
  }
}
</script>

<style scoped>
.pipe-capacity-calculation {
  padding: 20px;
  width: 100%;
  height: 100%;
  background-color: #1a1e30;
  color: #fff;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h1 {
  font-size: 24px;
  color: #fff;
  margin-bottom: 20px;
  border-left: 4px solid #00ffff;
  padding-left: 15px;
}

.component-container {
  background-color: #2b2f45;
  border-radius: 5px;
  padding: 20px;
  min-height: 700px;
}
</style> 