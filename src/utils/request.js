
import axios from 'axios';
import useUserStore from '@/stores/modules/user.ts'

// token的消息头
const TOKEN_HEADER = 'Authorization'
const userStore = useUserStore()
// 创建axios对象
const icemAxios = axios.create({
    baseURL: import.meta.env.VITE_AXIOS_BASE_URL,
    // 请求超时时间
    timeout: 15000
})

// ================================= 请求拦截器 =================================

icemAxios.interceptors.request.use(
    (config) => {
      config.headers['Content-Type'] = 'application/json;charset=UTF-8'

      if (userStore.getIsLogin && config.method === 'get') {
        config.params = Object.assign(config.params || {}, {
          cookie: encodeURIComponent(userStore.getToken)
        });
      }

      if (userStore.getIsLogin && config.method === 'post') {
        config.params = Object.assign(config.data || {}, {
          cookie: userStore.getToken
        });
      }
      return config
    },
    (error) => {
      // 对请求错误做些什么
      return Promise.reject(error)
    }
)

// 添加响应拦截器
icemAxios.interceptors.response.use(
    (response) => {
        const res = response.headers['content-type'].includes('application/json')
            ? response.data
            : response;
        if (res?.code == 432) {
            // setMessage({ type: 'error', title: res?.message });
        }

        return Promise.resolve(res);
    },
    (error) => {
      return Promise.reject(error.response)
    }
)

export default icemAxios