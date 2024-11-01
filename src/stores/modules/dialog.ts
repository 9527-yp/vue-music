import { defineStore } from "pinia";

// defineStore方法执行会返回一个函数，函数的作用就是让组件可以获取到仓库数据
const dialogStore = defineStore("dialog", {
    
    // 存储数据state
    state: (): any => {
      return {
        songId: undefined, // 歌曲ID
        songListShow: false, // 歌单弹框
        isCollect: false, // 是否收藏歌曲成功
        addSongListShow: false, // 新建歌单弹框
        isAddSongList: false // 是否创建歌单成功
      };
    },
    
    // 该函数没有上下文数据，所以获取state中的变量需要使用this
    actions: {
      // 歌单弹框显示隐藏
      setSongListShow(value: boolean) {
        this.songListShow = value;
      },
      // 
      setAddSongListShow(value: boolean) {
        this.addSongListShow = value;
      },
      setSongId(id: number | string) {
        this.songId = id;
      },
    },
    // 计算属性，和vuex是使用一样，getters里面不是方法，是计算返回的结果值
    getters: {
        getSongListShow: state => state.songListShow,
        getAddSongListShow: state => state.addSongListShow,
        getSongId: state => state.songId
    }
  });
  
  // 对外暴露方法
  export default dialogStore;
  