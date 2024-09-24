
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import './index.css'
import router from './router'

import MessageSuccess from '@/components/message/Success.vue'
import MessageWarning from '@/components/message/Warning.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
// 全局注册
app.component('MessageSuccess',MessageSuccess);
app.component('MessageWarning',MessageWarning);

app.mount('#app')
