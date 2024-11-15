<template>
    <table class="m-table">
        <div class="loading" v-if="loading">
            <div class="ranking-load">
                <i class="load-icn"></i>
                加载中...
            </div>
        </div>
        <tbody v-else>
            <tr class="item" :class="{'even' : index % 2 === 0}" v-for="(item, index) in playList" :key="index">
                <td class="index">
                    <div class="hd">
                        <i class="play-icn" :class="{'play-z-slt' : playSongId === item.id}" @click="playMusic(item)"></i>
                        <span class="num">{{index+1}}</span>
                    </div>
                </td>
                <td class="">
                    <div class="song-name">
                        <div class="ttc">
                            <span class="txt">
                                <span class="tit text-hov" :title="item?.name" @click="toSong(item.id)">{{item?.name}}</span>
                                <span v-if="item?.alia.length > 0" :title="item?.alia.join()"> - {{item?.alia.join()}}</span>
                                <span v-if="item.mv" class="mv-icn" title="播放mv">播放mv</span>
                            </span>
                        </div>
                    </div>
                </td>
                <td class="music-time">
                    <span class="time">{{ timeStampToDuration(item.dt / 1000) || '00:00' }}</span>
                    <div class="opt-btns">
                        <i class="add-icn" title="添加到播放列表" @click="addMusic(item)"></i>
                        <i class="icn collect-icn" title="收藏" @click="collectMusic(item)"></i>
                        <i class="icn share-icn" title="分享" @click="notFeatureTip"></i>
                        <i class="icn down-icn" title="下载" @click="notFeatureTip"></i>
                    </div>
                </td>
                <td class="album thide">
                    <span class="text text-hov" :title="item?.al?.name">{{item?.al?.name}}</span>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { timeStampToDuration } from '@/utils/utils.ts';
import type { songType } from '@/hooks/methods/songFormat.ts';
import useSongAddPlaylist from '@/hooks/useSongAddPlayList.ts';
import usePlaySong from '@/hooks/usePlaySong.ts';
import usePlayStore from '@/stores/modules/play.ts';
import useDialogStore from '@/stores/modules/dialog.ts';

const playStore = usePlayStore();
const dialogStore = useDialogStore();
const router = useRouter();

const props = defineProps({
    playList: {
        type: Array,
        default: []
    },
    loading: {
        type: Boolean,
        default: false
    }
})

const playDialogText = defineModel('playDialogText', {
    type: String,
    default: ''
})

const playDialog = defineModel('playDialog', {
    type: Boolean,
    default: false
})

// 播放显示/隐藏
const lock = computed(() => playStore.getplayLock);

// 当前播放歌曲ID
const playSongId = computed(() => playStore.getPlaySongId);

// 播放
let timer = null;
function playMusic(item: songType) {
    let index = isCopyright(item.id)

    if(index === 0) {
        playDialogText.value = '因合作方要求，该资源暂时无法收听，我们正在努力争取歌曲回归';
        playDialog.value = true;
        return;
    }else if(index === 1){
        playDialogText.value = '该歌曲为付费歌曲，请购买后聆听';
        playDialog.value = true;
        return;
    }
    
    usePlaySong(item);
    useSongAddPlaylist(item);
    playStore.setAddPlayListTip(true)
    playStore.setAddPlayListTipText('已开始播放')
    if(!lock.value){
        playStore.setPlayLock(true)
    }
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
        playStore.setPlayLock(false)
        playStore.setAddPlayListTip(false)
    }, 1500)
}

// 添加到播放列表
function addMusic(item: songType) {
    let index = isCopyright(item.id)

    if(index === 0) {
        playDialogText.value = '因合作方要求，该资源暂时无法收听，我们正在努力争取歌曲回归';
        playDialog.value = true;
        return;
    }else if(index === 1){
        playDialogText.value = '该歌曲为付费歌曲，请购买后聆听';
        playDialog.value = true;
        return;
    }

    useSongAddPlaylist(item)
    playStore.setAddPlayListTip(true)
    playStore.setAddPlayListTipText('已添加到播放列表')
    if(!lock.value){
        playStore.setPlayLock(true)
    }
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
        playStore.setPlayLock(false)
        playStore.setAddPlayListTip(false)
    }, 1500)
}

// 收藏
function collectMusic(item: songType) {
    // let index = isCopyright(item.id)

    // if(index === 0) {
    //     playDialogText.value = '因合作方要求，该资源暂时无法收听，我们正在努力争取歌曲回归';
    //     playDialog.value = true;
    //     return;
    // }else if(index === 1){
    //     playDialogText.value = '该歌曲为付费歌曲，请购买后聆听';
    //     playDialog.value = true;
    //     return;
    // }
    
    dialogStore.setSongId(item.id);
    dialogStore.setSongListShow(true);
}

function notFeatureTip() {
    dialogStore.setMessage({
        type: 0,
        text: '功能暂未开发',
        visible: true,
    })
    timer && clearTimeout( timer);
    timer = setTimeout(() => {
        dialogStore.setMessage({
            type: 0,
            text: '功能暂未开发',
            visible: false,
        })
    }, 1500);
}

// 歌曲是否有版权
type itemType = {
    privilege?: {
        cp: number,
        dl: number,
        fee: number
    }
}
function isCopyright(id?: number): number | undefined {
    const item: itemType = props.playList.find(
        (item: { id: number }) => item.id === id
    );
    if (item?.privilege?.dl === 0) {
        if(item?.privilege.fee === 0){
            // 无版权
            return 0;
        }else if(item?.privilege.fee === 1){
            // 付费歌曲
            return 1;
        }
    }else{
        // 可播放歌曲
        return 2;
    }
}

function toSong(id: number) {
    router.push({
        path: '/song',
        query: {
            id
        }
    })
}
</script>

<style lang="scss" scoped>
.m-table{
    border: none;
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    table-layout: fixed;
    .item{
        &:hover{
            
            .time{
                display: none !important;
            }
            .opt-btns{
                position: relative;
                margin-right: -10px;
                display: block !important;
            }
        }
    }
    td{
        padding: 6px 10px;
        line-height: 18px;
        text-align: left;
        // background: url('@/assets/images/my-music/table.png') no-repeat 0 9999px;
    }
    .index{
        width: 74px;
        .hd{
            height: 18px;
            .play-icn{
                float: right;
                width: 17px;
                height: 17px;
                cursor: pointer;
                background: url('@/assets/images/my-music/table.png') no-repeat 0 9999px;
                background-position: 0 -103px;
                &:hover{
                    background-position: 0 -128px;
                }
            }
            .play-z-slt{
                background-position: -20px -128px;
                &:hover{
                    background-position: -20px -128px;
                }
            }
            .num{
                margin-left: 5px;
                color: #999;
            }
        }
    }
    .song-name{
        float: left;
        width: 100%;
        .ttc{
            height: 18px;
            margin-right: 20px;
            .txt{
                position: relative;
                display: inline-block;
                padding-right: 25px;
                margin-right: -25px;
                max-width: 99%;
                height: 20px;
                color: #999;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                .tit{
                    color: #333;
                }
                .mv-icn{
                    width: 23px;
                    height: 17px;
                    margin: 1px 0 0 0;
                    position: absolute;
                    top: 0;
                    right: 0;
                    overflow: hidden;
                    text-indent: -999px;
                    cursor: pointer;
                    background: url('@/assets/images/my-music/table.png') no-repeat 0 9999px;
                    background-position: 0 -151px;
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
    .music-time{
        width: 69px;
        color: #666;
        .opt-btns{
            float: left;
            display: none;
            .add-icn{
                margin-top: 2px;
                float: left;
                overflow: hidden;
                vertical-align: middle;
                width: 13px;
                height: 13px;
                background: url('@/assets/images/icon.png') no-repeat;
                background-position: 0 -700px;
                cursor: pointer;
                &:hover{
                    background-position: -22px -700px;
                }
            }
            .icn{
                float: left;
                width: 18px;
                height: 16px;
                margin: 2px 0 0 4px;
                overflow: hidden;
                text-indent: -999px;
                background: url('@/assets/images/my-music/table.png') no-repeat;
                cursor: pointer;
            }
            .collect-icn{
                background-position: 0 -174px;
                &:hover{
                    background-position: -20px -174px;
                }
            }
            .share-icn{
                background-position: 0 -195px;
                &:hover{
                    background-position: -20px -195px;
                }
            }
            .down-icn{
                background-position: -81px -174px;
                &:hover{
                    background-position: -104px -174px;
                }
            }
        }
    }
    .album{
        width: 20%;
        .text{
            color: #333;
            width: 100%;
            position: relative;
            zoom: 1;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
    .even{
        td{
            background-color: #f7f7f7;
        }
    }
}
.ranking-load{
    height: 26px;
    padding: 20px 0;
    text-align: center;
    color: #999;
    .load-icn{
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: 2px;
        vertical-align: middle;
        background: url('@/assets/images/play/loading.gif') no-repeat;
    }
}
</style>