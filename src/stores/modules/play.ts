import { defineStore } from "pinia";

import { setLocalStorage, clearAllCookie } from '@/utils/storage'


// 本地存储容错处理
function faultTolerant(name: string) {
    if (localStorage.getItem(name)) {
      return JSON.parse(localStorage.getItem(name) || '');
    }
}


// defineStore方法执行会返回一个函数，函数的作用就是让组件可以获取到仓库数据
const playStore = defineStore("play", {
    
    // 存储数据state
    state: (): any => {
      return {
        playSongItem: faultTolerant('playSongItem') || {},
      };
    },
    
    // 该函数没有上下文数据，所以获取state中的变量需要使用this
    actions: {
      // 保存token
      setToken(playSongItem: object) {
        this.playSongItem = playSongItem;
        setLocalStorage('playSongItem', playSongItem)
      },
    },
    // 计算属性，和vuex是使用一样，getters里面不是方法，是计算返回的结果值
    getters: {
        // 账号信息
        getUserInfo: state => state.playSongItem,
        
    }
  });
  
  // 对外暴露方法
  export default playStore;
  