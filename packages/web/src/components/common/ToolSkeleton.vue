<template>
  <div class="skeleton-container">
    <div class="skeleton-header"></div>
    <div class="skeleton-content">
      <div class="skeleton-line" v-for="i in 4" :key="i"></div>
    </div>
    <div class="skeleton-footer">
      <div class="skeleton-line short"></div>
      <div class="skeleton-line short"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.skeleton-container {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 20px;
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-header {
  height: 32px;
  background: var(--bg-primary);
  border-radius: 4px;
  margin-bottom: 16px;
  width: 60%;
}

.skeleton-content {
  margin-bottom: 16px;
}

.skeleton-line {
  height: 16px;
  background: var(--bg-primary);
  border-radius: 4px;
  margin-bottom: 12px;
}

.skeleton-line.short {
  width: 40%;
}

.skeleton-footer {
  display: flex;
  gap: 12px;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
</style>
