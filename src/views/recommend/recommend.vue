<template>
    <div class="recommend-detail">
        <div class="recommend-content">
            <div class="recommend-hd">
                <div class="cal">
                    <div class="week">{{ getCurrentWeekday() }}</div>
                    <div class="time">{{ getDate() }}</div>
                    <div class="mask"></div>
                </div>
            </div>
            <div class="btns">
                <span class="btns-bag play" title="播放" @click="PlayOrAdd('play')">
                    <i class="i-box btns-bag">
                        <i class="play-icn btns-bag"></i>
                        播放全部
                    </i>
                </span>
                <span class="add btns-bag" title="添加到播放列表" @click="PlayOrAdd('add')"></span>
                <span class="btns-bag btn-jointly collect" @click="colSongList">
                    <i class="collect-icn icn btns-bag">收藏全部</i>
                </span>
            </div>
            <div class="song-list-box">
                <h3 class="title">歌曲列表</h3>
                <span class="song-num">30首歌</span>
            </div>
            <!-- 歌曲列表 -->
            <SongTable :playlist="songList" @delsong="delsong" />
        </div>
        <div class="recommend-side">

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { getCurrentWeekday, getDate } from '@/utils/utils.ts';
import SongTable from './song-table/SongTable.vue';
import { recommendSong, delSongList } from '@/api/recommend.ts';
import type { ResponseType } from '@/types/index';
import type { songType } from '@/hooks/methods/songFormat.ts';
import useSongAddPlaylist from '@/hooks/useSongAddPlayList.ts';
import usePlaySong from '@/hooks/usePlaySong.ts';
import usePlayStore from '@/stores/modules/play.ts';
import useDialogStore from '@/stores/modules/dialog.ts';


const playStore = usePlayStore();
const dialogStore = useDialogStore();

// 播放显示/隐藏
const lock = computed(() => playStore.getplayLock);

const songList = ref([]);
function getSongList () {
    recommendSong().then((res: ResponseType) => {
        if(res.code === 200) {
            songList.value = res?.data?.dailySongs ?? []
        }
    })
}

getSongList();


// 播放列表歌曲
let timer = null;
function PlayOrAdd(type: string) {

    // 过滤无版权
    const newSongList: songType[] = songList.value.filter(
        (item: { privilege: object }) => !isCopyright(item?.privilege)
    );

    if(type === 'play') {
        // 将歌曲添加到播放列表 - 清空当前播放列表
        useSongAddPlaylist(newSongList, {clear: true})
        // 播放第一首歌
        usePlaySong(newSongList[0])
    }else{
        useSongAddPlaylist(newSongList)
    }

    playStore.setAddPlayListTip(true)
    playStore.setAddPlayListTipText(type === 'play' ? '已开始播放' : '已添加到播放列表')
    if(!lock.value){
        playStore.setPlayLock(true)
    }
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
        playStore.setPlayLock(false)
        playStore.setAddPlayListTip(false)
    }, 1500)
}

// 收藏全部
function colSongList() {
    const ids = songList.value.map(item => item.id)
    dialogStore.setSongId(ids.join());
    dialogStore.setSongListShow(true);
}

// 歌曲是否有版权
type privilegeItem = {
    cp?: number,
}

function delsong(id: number, index: number) {
    console.log(id, index ,'index')
    delSongList({id}).then((res: ResponseType) => {
        if(res.code === 200) {
            // 删除指定索引的项
            songList.value.splice(index, 1);
            
            // 在原来删除项的位置添加新项
            songList.value.splice(index, 0, res?.data);

            console.log(songList.value, 'songList.value')
        }
    }).catch(error => {
        console.log(error, 'error')
        // 删除指定索引的项
        songList.value.splice(index, 1);
        dialogStore.setMessage({
            type: 1,
            text: error?.data?.message,
            visible: true,
        })
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            dialogStore.setMessage({
                type: 1,
                text: error?.data?.message,
                visible: false,
            })
        }, 1500);
    })
}

function isCopyright(privilege: privilegeItem): boolean | undefined {
  if (privilege?.cp === 0) {
    return true;
  }

  return false;
}
</script>


<style lang="scss" scoped>
.recommend-detail{
    width: 980px;
    min-height: 700px;
    margin: 0 auto;
    background-color: #fff;
    border: 1px solid #d3d3d3;
    border-width: 0 1px;
    background: url('@/assets/images/play-list/wrap4.png');
    .recommend-content{
        display: inline-block;
        width: calc(100% - 271px);
        padding: 47px 30px 40px 39px;
        vertical-align: top;
        box-sizing: border-box;
        .recommend-hd{
            width: 640px;
            height: 179px;
            padding-top: 1px;
            background: url('@/assets/images/recmd_daily.jpg') no-repeat;
            .cal{
                float: left;
                margin: 34px 0 0 54px;
                position: relative;
                width: 114px;
                height: 114px;
                background: url('@/assets/images/home/individuation-bag.png') no-repeat 0 9999px;
                background-position: 0 -270px;
                .week{
                    height: 26px;
                    line-height: 26px;
                    font-size: 12px;
                    color: #fed9d9;
                    text-shadow: 0 -1px #962626;
                    text-align: center;
                }
                .time{
                    font-size: 74px;
                    line-height: 80px;
                    text-align: center;
                    font-family: Arial, Helvetica, sans-serif;
                    font-weight: bold;
                    color: #202020;
                }
                .mask{
                    position: absolute;
                    top: 26px;
                    left: 0;
                    width: 142px;
                    height: 107px;
                    background: url('@/assets/images/home/individuation-bag.png') no-repeat 0 9999px;
                    background-position: 0 -400px;
                }
            }
        }
        .btns{
            margin-top: 30px;
            margin-bottom: 15px;
            .btns-bag{
                background: url('@/assets/images/login/button-bag.png') no-repeat;
            }
            .play{
                padding: 0 5px 0 0;
                line-height: 29px;
                white-space: nowrap;
                overflow: hidden;
                text-align: center;
                cursor: pointer;
                color: #fff;
                float: left;
                background-position: right -428px;
                .i-box{
                    display: inline-block;
                    height: 31px;
                    line-height: 29px;
                    padding: 0 7px 0 8px;
                    background-position: 0 -387px;
                    .play-icn{
                        display: inline-block;
                        vertical-align: top;
                        width: 20px;
                        height: 18px;
                        margin: 6px 2px 2px 0;
                        background-position: 0 -1622px;
                        overflow: hidden;
                    }
                }
                &:hover{
                    color: #fff;
                    background-position: right -510px;
                    .i-box{
                        background-position: 0 -469px;
                    }
                    .play-icn{
                        background-position: -28px -1622px;
                    }
                }
            }
            .add{
                margin-right: 5px;
                font-family: simsun, \5b8b\4f53;
                width: 31px;
                margin-left: -3px;
                height: 31px;
                line-height: 30px;
                min-width: 23px;
                float: left;
                margin-right: 8px;
                cursor: pointer;
                background-position: 0 -1588px;
                &:hover{
                    background-position: -40px -1588px;
                }
            }
            .btn-jointly{
                float: left;
                font-family: simsun, \5b8b\4f53;
                color: #333;
                padding: 0 5px 0 0;
                white-space: nowrap;
                cursor: pointer;
                .icn{
                    display: inline-block;
                    height: 31px;
                    line-height: 30px;
                    min-width: 23px;
                    padding-right: 2px;
                    padding-left: 28px;
                }
            }
            .collect{
                background-position: right -1020px;
                .collect-icn{
                    background-position: 0 -977px;
                }
                &:hover{
                    background-position: right -1106px;
                    .collect-icn{
                        background-position: 0 -1063px;
                    }
                }
            }
            &:after{
                clear: both;
                content: '.';
                display: block;
                height: 0;
                visibility: hidden;
            }
        }
        .song-list-box{
                width: 100%;
                height: 35px;
                border-bottom: 2px solid #c20c0c;
                box-sizing: border-box;
                padding: 0 10px 0 0px;
                .title{
                    font-size: 20px;
                    line-height: 28px;
                    float: left;
                    font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
                    font-weight: normal;
                }
                .song-num{
                    margin: 9px 0 0 20px;
                    float: left;
                    color: #666;
                }
            }
    }
    .recommend-side{
        display: inline-block;
        width: 270px;
        vertical-align: top;
        padding: 20px 40px 40px 30px;
        box-sizing: border-box;
    }
}
</style>