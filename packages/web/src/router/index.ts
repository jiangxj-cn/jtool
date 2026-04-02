import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import ToolSkeleton from '../components/common/ToolSkeleton.vue'

// 懒加载工具组件，添加 meta.loading 信息
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      loadingComponent: ToolSkeleton,
    },
  },
  {
    path: '/json',
    name: 'JSON',
    component: () => import('../components/json/JsonTool.vue'),
    meta: {
      loadingComponent: ToolSkeleton,
    },
  },
  {
    path: '/base64',
    name: 'Base64',
    component: () => import('../components/base64/Base64Tool.vue'),
    meta: {
      loadingComponent: ToolSkeleton,
    },
  },
  {
    path: '/url',
    name: 'URL',
    component: () => import('../components/url/UrlTool.vue'),
    meta: {
      loadingComponent: ToolSkeleton,
    },
  },
  {
    path: '/hash',
    name: 'Hash',
    component: () => import('../components/hash/HashTool.vue'),
    meta: {
      loadingComponent: ToolSkeleton,
    },
  },
  {
    path: '/timestamp',
    name: 'Timestamp',
    component: () => import('../components/timestamp/TimestampTool.vue'),
    meta: {
      loadingComponent: ToolSkeleton,
    },
  },
  {
    path: '/qrcode',
    name: 'QRCode',
    component: () => import('../components/qrcode/QrcodeTool.vue'),
    meta: {
      loadingComponent: ToolSkeleton,
    },
  },
  {
    path: '/text',
    name: 'Text',
    component: () => import('../components/text/TextTool.vue'),
    meta: {
      loadingComponent: ToolSkeleton,
    },
  },
  {
    path: '/ipcalculator',
    name: 'IPCalculator',
    component: () => import('../components/ip-calculator/IPCalculatorTool.vue'),
    meta: {
      loadingComponent: ToolSkeleton,
    },
  },
  {
    path: '/ascii',
    name: 'ASCII',
    component: () => import('../components/ascii/AsciiTool.vue'),
    meta: {
      loadingComponent: ToolSkeleton,
    },
  },
  {
    path: '/uuid',
    name: 'UUID',
    component: () => import('../components/uuid/UUIDGeneratorTool.vue'),
    meta: {
      loadingComponent: ToolSkeleton,
    },
  },
  {
    path: '/random',
    name: 'Random',
    component: () => import('../components/random/RandomGeneratorTool.vue'),
    meta: {
      loadingComponent: ToolSkeleton,
    },
  },
  {
    path: '/unitconverter',
    name: 'UnitConverter',
    component: () => import('../components/unit-converter/UnitConverterTool.vue'),
    meta: {
      loadingComponent: ToolSkeleton,
    },
  },
  {
    path: '/regex',
    name: 'Regex',
    component: () => import('../components/regex/RegexTool.vue'),
    meta: {
      loadingComponent: ToolSkeleton,
    },
  },
  {
    path: '/jwt',
    name: 'JWT',
    component: () => import('../components/jwt/JWTTool.vue'),
    meta: {
      loadingComponent: ToolSkeleton,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
