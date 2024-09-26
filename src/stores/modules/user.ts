import { defineStore } from "pinia";

import { setLocalStorage, clearAllCookie } from '@/utils/storage'


// 本地存储容错处理
function faultTolerant(name: string) {
    if (localStorage.getItem(name)) {
      return JSON.parse(localStorage.getItem(name) || '');
    }
}


// defineStore方法执行会返回一个函数，函数的作用就是让组件可以获取到仓库数据
const userStore = defineStore("user", {
    
    // 存储数据state
    state: (): any => {
      return {
        token: localStorage.getItem('cookie') || '',
        userInfo: faultTolerant('userInfo') || {},
        isLogin: faultTolerant('isLogin') || false,
      };
    },
    
    // 该函数没有上下文数据，所以获取state中的变量需要使用this
    actions: {
      // 保存token
      setToken(token: string) {
        this.token = token;
        setLocalStorage('token', token)
      },
      // 保存userInfo信息
      setUserInfo(payload:object) {
        this.userInfo = payload;
        setLocalStorage('userInfo', payload)

        this.isLogin = true;
        setLocalStorage('isLogin', true)
      },
      // 退出登录
      setLogout() {
        this.token = ''
        this.userInfo = {}
        this.isLogin = false
        localStorage.clear();
        clearAllCookie();
      }
    },
    // 计算属性，和vuex是使用一样，getters里面不是方法，是计算返回的结果值
    getters: {
        // 账号信息
        getUserInfo: state => state.userInfo,
        getIsLogin: state => state.isLogin,
    }
  });
  
  // 对外暴露方法
  export default userStore;
  