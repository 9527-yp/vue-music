
import axios from 'axios';

// token的消息头
const TOKEN_HEADER = 'Authorization'

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
        if (res?.code === 250) {
            // setMessage({ type: 'error', title: res?.message });
        }

        return Promise.resolve(res);
    },
    (error) => {
      return Promise.reject(error)
    }
)

export default icemAxios