
import { computed } from "vue";
import usePlayStore from '@/stores/modules/play.ts'
import type { MusicItemType } from '@/hooks/methods/songFormat.ts'

const playStore = usePlayStore()

// 当前播放的歌曲详情
const playSongItem = computed(() => playStore.getPlaySongItem)
// 播放列表数据
const playSongList = computed(() => playStore.playSongList)

// 下一首
export function nextPlatSong(modeType: number) {
    if(!playSongItem.value || playSongList.value.length === 0){
      return ;
    }
    let songItem = {};
    let songIndex = playSongList.value.findIndex( (item: MusicItemType) => item.id === playSongItem.value.id)
    if(modeType === 1 || modeType === 2){
      if(songIndex == playSongList.value.length -1){
        songItem = playSongList.value[0]
      }else{
        songItem = playSongList.value[songIndex + 1]
      }
      playStore.setPlaySong(songItem)
    }else{
      // 随机
      let randomNum = Math.floor(Math.random() * playSongList.value.length);
      
      if(randomNum === songIndex){
        if(randomNum == playSongList.value.length -1){
          randomNum = 0
        }else{
          randomNum++
        }
      }
      songItem = playSongList.value[randomNum]
      playStore.setPlaySong(songItem)
    }
    
}


// 上一首
export function upPlaySong(modeType: number) {
    if(!playSongItem.value || playSongList.value.length === 0){
      return ;
    }
    let songItem = {};
    let songIndex = playSongList.value.findIndex( (item: MusicItemType) => item.id === playSongItem.value.id)
    if(modeType === 1 || modeType === 2) {
      if(songIndex == 0){
        songItem = playSongList.value[playSongList.value.length -1]
      }else{
        songItem = playSongList.value[songIndex -1]
      }
      playStore.setPlaySong(songItem)
    }else{
      // 随机
      let randomNum = Math.floor(Math.random() * playSongList.value.length);
      
      if(randomNum === songIndex){
        if(randomNum == playSongList.value.length -1){
          randomNum = 0
        }else{
          randomNum++
        }
      }
      songItem = playSongList.value[randomNum]
      playStore.setPlaySong(songItem)
    }
}