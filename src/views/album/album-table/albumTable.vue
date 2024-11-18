<template>
    <div class="n-songtb">
        <div class="table-tit">
            <div class="out">
                <i class="out-icn"></i>
                <a
                    class="out-text"
                    :href="`https://music.163.com/#/outchain/1/${id}`"
                >
                    生成外链播放器
                </a>
            </div>
            <h3>
                <span class="album-title">安和桥</span>
            </h3>
            <span class="total-num">1首歌</span>
        </div>
        <div class="song-list-table">
            <table class="song-list">
                <thead>
                    <tr>
                        <th class="first">
                            <div class="text"></div>
                        </th>
                        <th class="">
                            <div class="text">歌曲标题</div>
                        </th>
                        <th class="th-2">
                            <div class="text">时长</div>
                        </th>
                        <th class="th-3">
                            <div class="text">歌手</div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="music-list-c" :class="
                        {
                            'even' : index % 2 === 0,
                            'list-disabled' : isCopyright(item.id) === 0,
                        }"
                        v-for="(item, index) in list" 
                        :key="index"
                    >
                        <td class="left">
                            <div class="index-hd">
                                <span class="index">{{index+1}}</span>
                                <i class="play-icn" :class="{'play-z-slt' : playSongId === item.id}" @click="playOrAddMusic(item, 'play')"></i>
                            </div>
                        </td>
                        <td>
                            <div class="song-name">
                                <div class="song-name-box">
                                    <span class="text-hov" @click="skip('song', item.id)">{{item.name}}</span>
                                    <span class="song-other" v-if="item?.alia.length > 0"> - ({{item?.alia[0]}})</span>
                                    <i v-if="item.mv" class="mv-icn"></i>
                                </div>
                            </div>
                        </td>
                        <td class="song-time-box">
                            <span class="song-time">{{ timeStampToDuration(item.dt / 1000) || '00:00' }}</span>
                            <div class="btns">
                                <i class="add-icn" title="添加到播放列表" @click="playOrAddMusic(item, 'add')"></i>
                                <i class="icn collect-icn" title="收藏" @click="collectMusic(item)"></i>
                                <i class="icn share-icn" title="分享" @click="notFeatureTip"></i>
                                <i class="icn down-icn" title="下载" @click="notFeatureTip"></i>
                            </div>
                        </td>
                        <td>
                            <div class="text">
                                <template v-for="(key, i) in item.ar" :key="i">
                                    <span class="text-hov" :title="key.name" @click="skip('singer', key.id)">{{key.name}}</span><i v-if="i !== item.ar.length-1">/</i>
                                </template>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { timeStampToDuration } from '@/utils/utils.ts';
import usePlayStore from '@/stores/modules/play.ts';
import type { songType } from '@/hooks/methods/songFormat.ts';
import useSongAddPlaylist from '@/hooks/useSongAddPlayList.ts';
import usePlaySong from '@/hooks/usePlaySong.ts';
import useDialogStore from '@/stores/modules/dialog.ts';

const playStore = usePlayStore();
const dialogStore = useDialogStore();
const router = useRouter();

// 播放显示/隐藏
const lock = computed(() => playStore.getplayLock);

// 当前播放歌曲ID
const playSongId = computed(() => playStore.getPlaySongId);

const props = defineProps({
    list: {
        type: Array,
        default: []
    },
    id: {
        type: String,
        default: ''
    }
})

const playDialog = defineModel('playDialog', {
  type: Boolean,
  default: false
})

const playDialogText = defineModel('playDialogText', {
  type: String,
  default: ''
})

const emit = defineEmits(['skip']);

function skip(path: string, id: number) {
    emit('skip',{path, id})
}

// 播放 or 添加到播放列表
let timer = null;
function playOrAddMusic(item: songType, type: string) {
    let index = isCopyright(item.id)
    console.log(index, 'index')

    if(index === 0) {
        playDialogText.value = '因合作方要求，该资源暂时无法收听，我们正在努力争取歌曲回归';
        playDialog.value = true;
        return;
    }else if(index === 1){
        playDialogText.value = '该歌曲为付费歌曲，请购买后聆听';
        playDialog.value = true;
        return;
    }
    if(type === 'play'){
        usePlaySong(item);
    }
    useSongAddPlaylist(item);
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
type privilegeItem = {
    privilege?: {
        dl?: number,
        fee?: number
    }
    
}
function isCopyright(id?: number): number | undefined {
    const item: privilegeItem = props.list.find(
        (item: { id: number }) => item.id === id
    );
    console.log(item, 'item')
    if (item?.privilege?.dl === 0) {
        if(item?.privilege.fee === 0){
            // 无版权
            return 0;
        }else if(item?.privilege.fee === 1){
            // 付费歌曲
            return 1;
        }else{
            // 可播放歌曲
            return 2;
        }
    }else{
        // 可播放歌曲
        return 2;
    }
}
</script>

<style lang="scss" scoped>
.n-songtb{
    margin-top: 27px;
    .table-tit{
        height: 33px;
        border-bottom: 2px solid #c20c0c;
        .out{
            margin-right: 20px;
            margin-top: 5px;
            float: right;
            .out-icn{
                width: 16px;
                height: 16px;
                background: url('@/assets/images/icon.png') no-repeat;
                background-position: -34px -863px;
                display: inline-block;
                overflow: hidden;
                vertical-align: middle;
            }
            .out-text{
                cursor: pointer;
                color: #4996d1;
                text-decoration: underline;
            }
        }
        h3{
            float: left;
            font-size: 20px;
            line-height: 28px;
            font-weight: normal;
            font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
        }
        .total-num{
            margin: 9px 0 0 20px;
            float: left;
            color: #333;
        }
        &:after{
            clear: both;
            content: '.';
            display: block;
            height: 0;
            visibility: hidden;
        }
    }
    .song-list-table{
        .song-list{
            width: 100%;
            border: 1px solid #d9d9d9;
            border-collapse: collapse;
            border-spacing: 0;
            table-layout: fixed;
            th{
                height: 38px;
                background-color: #f7f7f7;
                background: url('@/assets/images/my-music/table.png');
                background-position: 0 0;
                background-repeat: repeat-x;
                vertical-align: top;
                text-align: left;
                font-weight: normal;
                color: #666;
                .text{
                    height: 18px;
                    line-height: 18px;
                    padding: 8px 10px;
                    background: url('@/assets/images/my-music/table.png') no-repeat;
                    background-position: 0 -56px;
                }
            }
            .first{
                width: 74px;
                .text{
                    height: 18px;
                    line-height: 18px;
                    padding: 8px 10px;
                    background: none;
                }
            }
            .th-2{
                width: 91px;
            }
            .th-3{
                width: 20%;
            }
            .music-list-c{
                td{
                    padding: 6px 10px;
                    line-height: 18px;
                    text-align: left;
                    // background: url('@/assets/images/my-music/table.png') no-repeat;
                }
                .left{
                    .index-hd{
                        height: 18px;
                        .index{
                            margin-left: 5px;
                            color: #999;
                        }
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
                    }
                }
                .song-name{
                    height: 18px;
                    margin-right: 20px;
                    .song-name-box{
                        position: relative;
                        display: inline-block;
                        padding-right: 25px;
                        margin-right: -25px;
                        max-width: 99%;
                        height: 20px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        .song-other{
                            color: #aeaeae;
                        }
                        .mv-icn{
                            position: absolute;
                            top: 0;
                            right: 0;
                            width: 23px;
                            height: 17px;
                            margin: 1px 0 0 0;
                            background: url('@/assets/images/my-music/table.png') no-repeat 0 9999px;
                            background-position: 0 -151px;
                            cursor: pointer;
                            &:hover{
                                background-position: -30px -151px;
                            }
                        }
                    }
                }
                .song-time-box{
                    .song-time{
                        color: #666;
                    }
                    .btns{
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
                        .del-icn{
                            background-position: 0 -217px;
                            &:hover{
                                background-position: -20px -217px;
                            }
                        }
                    }
                }
                .text{
                    width: 100%;
                    position: relative;
                    zoom: 1;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                &:hover{
                    .song-time-box{
                        padding-right: 0px;
                    }
                    .song-time{
                        display: none;
                    }
                    .btns{
                        display: block;
                    }
                }
            }
            .even{
                td{
                    background-color: #f7f7f7;
                }
            }
            .list-disabled{
                color: #bbb !important;
                .left{
                    .index-hd{
                        .play-icn{
                            opacity: 0.5;
                            cursor: default;
                            &:hover{
                                background-position: 0 -103px;
                            }
                        }
                    }
                }
                .song-time{
                    color: #bbb !important;
                    display: block !important;
                }
                .btns{
                    display: none !important;
                }
                .song-name{
                    .song-name-box{
                        .mv-icn{
                            background-position: -60px -151px;
                            cursor: default;
                            &:hover{
                                background-position: -60px -151px;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>