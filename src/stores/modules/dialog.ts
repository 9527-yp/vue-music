import { defineStore } from "pinia";

type MessageInfo = {
  visible: boolean,
  text: string,
  type: number | string
}
// defineStore方法执行会返回一个函数，函数的作用就是让组件可以获取到仓库数据
const dialogStore = defineStore("dialog", {
    
    // 存储数据state
    state: (): any => {
      return {
        songId: undefined, // 歌曲ID
        songListShow: false, // 歌单弹框
        addSongListShow: false, // 新建歌单弹框
        isRefreshSongList: false, // 是否刷新歌单列表数据
        messageInfo: {
          visible: false, // 提示弹框
          type: 0, // 0:警告 ，1：成功
          text: '', // 提示内容
        }
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
      setIsRefreshSongList(value: boolean) {
        this.isRefreshSongList = value;
      },
      setMessage(info: MessageInfo) {
        this.messageInfo = info;
      },
    },
    // 计算属性，和vuex是使用一样，getters里面不是方法，是计算返回的结果值
    getters: {
        getSongListShow: state => state.songListShow,
        getAddSongListShow: state => state.addSongListShow,
        getSongId: state => state.songId,
        getIsRefreshSongList: state => state.isRefreshSongList,
        getMessage: state => state.messageInfo,
    }
  });
  
  // 对外暴露方法
  export default dialogStore;
  