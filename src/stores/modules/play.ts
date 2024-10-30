import { defineStore } from "pinia";

import { setLocalStorage } from '@/utils/storage'
import type { MusicItemType } from '@/hooks/methods/songFormat.ts'


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
        playSongItem: faultTolerant('playSongItem') || {}, // 当前播放的歌曲
        playSongId: faultTolerant('playSongId') || 0, // 当前播放的歌曲id
        playSongList: faultTolerant('playSongList') || [], // 播放列表
        playLock: faultTolerant('playLock') || false, // 底部播放显示隐藏
        addPlayListTip: false,
        addPlayListTipText: '',
      };
    },
    
    // 该函数没有上下文数据，所以获取state中的变量需要使用this
    actions: {
      // 保存歌曲到本地
      setPlaySong(playSongItem: MusicItemType) {
        this.playSongItem = playSongItem;
        setLocalStorage('playSongItem', playSongItem)

        this.playSongId = playSongItem.id;
        setLocalStorage('playSongId', playSongItem.id)
      },
      // 保存歌曲到列表
      setPlaySongList(playSongList: MusicItemType[]) {
        this.playSongList = playSongList
        setLocalStorage('playSongList', playSongList)
      },
      // 底部播放显示隐藏
      setPlayLock(lockShow: boolean) {
        this.playLock = lockShow
        setLocalStorage('playLock', lockShow)
      },
      // 添加到播放列表提示
      setAddPlayListTip(addPlayListTip: boolean) {
        this.addPlayListTip = addPlayListTip
      },
      setAddPlayListTipText(text: string) {
        this.addPlayListTipText = text
      }
    },
    // 计算属性，和vuex是使用一样，getters里面不是方法，是计算返回的结果值
    getters: {
        getPlaySongId: state => state.playSongId,
        getPlaySongItem: state => state.playSongItem,
        getplaySongList: state => state.playSongList,
        getplayLock: state => state.playLock,
        getAddPlayListTip: state => state.addPlayListTip,
        getAddPlayListTipText: state => state.addPlayListTipText,
        
    }
  });
  
  // 对外暴露方法
  export default playStore;
  