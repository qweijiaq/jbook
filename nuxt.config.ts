import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";

export default defineNuxtConfig({
  runtimeConfig: {
    // 私密
    SecretId: process.env.SECRET_ID,
    SecretKey: process.env.SECRET_KEY,
    public: {
      // 公开
      api: "",
    },
  },
  modules: ["@pinia/nuxt", "@pinia-plugin-persistedstate/nuxt"],
  vite: {
    plugins: [
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: "less", // 配置 style 类型为 less
          }),
          // 配置图标前缀
          IconsResolver({
            prefix: "i",
            enabledCollections: ["ep", "ant-design", "mdi-light"],
          }),
        ],
      }),
      // 自动
      Icons({
        autoInstall: true, //在 Vue.js的安装过程中自动安装该插件。
        compiler: "vue3", //表示该插件使用的是 Vue3.x 版本的编译器。
      }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            "primary-color": "#ea6f5a", // 主题色
          },
          javascriptEnabled: true,
        },
      },
    },
    ssr: {
      // SSR 渲染时，将 ant-design-vue 作为外部依赖，不进行打包
      noExternal: ["ant-design-vue"],
    },
  },
});
