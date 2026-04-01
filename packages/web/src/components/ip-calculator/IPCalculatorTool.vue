<template>
  <div class="ip-calculator-tool">
    <h2>🌐 IP 网络计算器</h2>
    
    <div class="input-section">
      <n-input-group>
        <n-input
          v-model:value="ipInput"
          placeholder="输入 IP 地址（支持 CIDR，如 192.168.1.0/24）"
          @keyup.enter="calculate"
        />
        <n-button type="primary" @click="calculate">计算</n-button>
      </n-input-group>
      
      <div class="quick-cidrs">
        <n-tag
          v-for="cidr in commonCIDRs"
          :key="cidr"
          size="small"
          checkable
          :checked="selectedCIDR === cidr"
          @update:checked="selectCIDR(cidr)"
        >
          /{{ cidr }}
        </n-tag>
      </div>
    </div>

    <div v-if="result" class="result-section">
      <!-- IP 地址基本信息 -->
      <n-card title="📍 IP 地址信息" size="small">
        <n-descriptions bordered :column="2">
          <n-descriptions-item label="十进制">{{ result.decimal }}</n-descriptions-item>
          <n-descriptions-item label="二进制">{{ result.binary }}</n-descriptions-item>
          <n-descriptions-item label="十六进制">{{ result.hexadecimal }}</n-descriptions-item>
          <n-descriptions-item label="整数">{{ result.integer.toLocaleString() }}</n-descriptions-item>
          <n-descriptions-item label="IP 类型">
            <n-tag :type="getClassTagType(result.ipClass)">{{ result.ipClass }}类</n-tag>
          </n-descriptions-item>
          <n-descriptions-item label="地址性质">
            <div class="tags">
              <n-tag v-if="result.isPrivate" type="success" size="small">私有地址</n-tag>
              <n-tag v-if="result.isLoopback" type="warning" size="small">回环地址</n-tag>
              <n-tag v-if="!result.isPrivate && !result.isLoopback" type="info" size="small">公网地址</n-tag>
            </div>
          </n-descriptions-item>
        </n-descriptions>
      </n-card>

      <!-- 子网信息 -->
      <n-card title="🔗 子网信息" size="small" style="margin-top: 16px">
        <n-descriptions bordered :column="2">
          <n-descriptions-item label="CIDR">/{{ result.cidr }}</n-descriptions-item>
          <n-descriptions-item label="子网掩码">{{ result.subnetMask }}</n-descriptions-item>
          <n-descriptions-item label="掩码二进制" :span="2">{{ result.subnetMaskBinary }}</n-descriptions-item>
        </n-descriptions>
      </n-card>

      <!-- 网络范围 -->
      <n-card title="📡 网络范围" size="small" style="margin-top: 16px">
        <n-descriptions bordered :column="2">
          <n-descriptions-item label="网络地址">
            <n-tag type="primary">{{ result.networkAddress }}</n-tag>
          </n-descriptions-item>
          <n-descriptions-item label="广播地址">
            <n-tag type="warning">{{ result.broadcastAddress }}</n-tag>
          </n-descriptions-item>
          <n-descriptions-item label="可用 IP 范围" :span="2">
            <n-tag type="success">{{ result.ipRange }}</n-tag>
          </n-descriptions-item>
          <n-descriptions-item label="第一个可用 IP">{{ result.firstHost }}</n-descriptions-item>
          <n-descriptions-item label="最后一个可用 IP">{{ result.lastHost }}</n-descriptions-item>
          <n-descriptions-item label="总主机数">{{ result.totalHosts.toLocaleString() }}</n-descriptions-item>
          <n-descriptions-item label="可用主机数">{{ result.usableHosts.toLocaleString() }}</n-descriptions-item>
        </n-descriptions>
      </n-card>
    </div>

    <div v-else class="placeholder">
      <n-empty description="输入 IP 地址开始计算" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NInput, NButton, NCard, NDescriptions, NDescriptionsItem, NTag, NEmpty, NInputGroup } from 'naive-ui'
import { calculateIP, isValidIP } from '@jtool/core'

interface IPCalculationResult {
  input: string
  decimal: string
  binary: string
  hexadecimal: string
  integer: number
  ipClass: string
  isPrivate: boolean
  isLoopback: boolean
  cidr: number
  subnetMask: string
  subnetMaskBinary: string
  networkAddress: string
  broadcastAddress: string
  firstHost: string
  lastHost: string
  totalHosts: number
  usableHosts: number
  ipRange: string
}

const ipInput = ref('192.168.1.0/24')
const result = ref<IPCalculationResult | null>(null)
const selectedCIDR = ref(24)

const commonCIDRs = [8, 16, 24, 25, 26, 27, 28, 29, 30, 32]

const selectCIDR = (cidr: number) => {
  selectedCIDR.value = cidr
  // 如果当前输入是有效 IP，更新 CIDR
  const parts = ipInput.value.split('/')
  if (parts.length === 1 && isValidIP(ipInput.value)) {
    ipInput.value = `${ipInput.value}/${cidr}`
    calculate()
  }
}

const getClassTagType = (ipClass: string): 'success' | 'warning' | 'error' | 'info' => {
  switch (ipClass) {
    case 'A': return 'success'
    case 'B': return 'info'
    case 'C': return 'warning'
    case 'D': return 'error'
    case 'E': return 'error'
    default: return 'info'
  }
}

const calculate = () => {
  try {
    const input = ipInput.value.trim()
    if (!input) {
      result.value = null
      return
    }
    
    // 如果输入没有 CIDR，添加默认 CIDR
    let finalInput = input
    if (!input.includes('/')) {
      finalInput = `${input}/${selectedCIDR.value}`
    }
    
    result.value = calculateIP(finalInput)
  } catch (error) {
    result.value = null
    console.error('IP 计算错误:', error)
  }
}

// 初始化计算
calculate()
</script>

<style scoped>
.ip-calculator-tool {
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  margin-bottom: 20px;
  font-size: 24px;
}

.input-section {
  margin-bottom: 24px;
}

.quick-cidrs {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.result-section {
  animation: fadeIn 0.3s ease;
}

.placeholder {
  padding: 60px 0;
  text-align: center;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
