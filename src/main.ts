
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import './index.css'
import router from './router'

import Message from '@/components/message/index.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
// 全局注册
app.component('Message',Message);

app.mount('#app')
