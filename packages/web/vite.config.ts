import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  server: {
    port: 3000,
  },

  build: {
    // 构建目标优化
    target: 'esnext',
    cssTarget: 'chrome80',
    
    // 输出配置
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    
    // 压缩优化 - 使用 esbuild 更快更省内存
    minify: 'esbuild',
    esbuildOptions: {
      keepNames: false,
      legalComments: 'none',
    },
    
    // 代码分割
    cssCodeSplit: true,
    
    // 资源内联限制
    assetsInlineLimit: 4096,
    
    // 报告配置
    reportCompressedSize: true,
    chunkSizeWarningLimit: 500,
    
    // Rollup 优化配置
    rollupOptions: {
      output: {
        // 手动 chunk 分割 - 更细粒度的拆分
        manualChunks: {
          // Vue 核心库
          'vendor-vue': ['vue', 'vue-router'],
          // UI 库
          'vendor-ui': ['naive-ui'],
          // 工具库分离
          'vendor-crypto': ['crypto-js'],
          'vendor-json': ['json5'],
          'vendor-qrcode': ['qrcode'],
        },
        
        // 文件名哈希优化
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/chunk-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },

  // CSS 优化
  css: {
    devSourcemap: false,
  },

  // 优化依赖预构建
  optimizeDeps: {
    include: ['vue', 'vue-router', 'naive-ui'],
    exclude: ['@jtool/core'],
  },
})
