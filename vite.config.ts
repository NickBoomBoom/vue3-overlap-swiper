import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build:{
    lib: {
      entry: "./src/index.ts",
      name: "vue3-overlap-carousel",
    },
    rollupOptions: {
      // 把不想打包进你的包的包排除掉
      external: ["vue"],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: "Vue",
        },
        exports:"named"
      },
    },
  }
})
