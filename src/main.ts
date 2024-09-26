
import { createApp } from 'vue'
import pinia from '@/stores'

import App from './App.vue'
import './index.css'
import router from './router'

// 创建大仓库
import { createPinia } from "pinia";

// pinia持久化
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import MessageSuccess from '@/components/message/Success.vue'
import MessageWarning from '@/components/message/Warning.vue'

const app = createApp(App)

app.use(createPinia().use(piniaPluginPersistedstate))
app.use(router)
// 全局注册
app.component('MessageSuccess',MessageSuccess);
app.component('MessageWarning',MessageWarning);

app.mount('#app')
