<template>
    <div class="prohead">
        <div class="unfold text-hov" @click="unfoldBtn">
            {{tableIsOpen ? '收起' : '展开'}}
            <i class="table-icn" :class="tableIsOpen ? 'pack' :'unfold'"></i>
        </div>
        <div class="total">
            <strong>节目包含歌曲列表</strong>
            <span class="num">（{{djInfo?.trackCount}}首歌）</span>
        </div>
    </div>
    <div class="m-table" v-if="tableIsOpen">
        <table class="song-list">
            <tbody>
                <tr
                    class="music-list-c"
                    v-for="(item, index) in djInfo?.songs"
                    :key="item.id"
                    :class="{
                    'even' : index % 2 !== 0
                }"
                >
                    <td class="tr-index">
                        <div class="index-hd">
                            <span class="index">{{index+1}}</span>
                            <i class="play-icn" :class="{'play-z-slt' : playSongId === item.id}" title="播放" @click="playOrAdd(item, 'play')"></i>
                        </div>
                    </td>
                    <td class="song-name-td">
                        <div class="song-name">
                            <div class="song-name-box">
                                <span class="text-hov" @click="toSong(item.id)">{{item.name}}</span>
                                <span class="song-other" v-if="item?.alias?.length > 0"> - ({{item?.alias[0]}})</span>
                                <i v-if="item.mvid" class="mv-icn"></i>
                            </div>
                        </div>
                    </td>
                    <td class="song-time-box">
                        <span class="song-time">{{ timeStampToDuration(item.duration / 1000) || '00:00' }}</span>
                        <div class="btns">
                            <i class="add-icn" title="添加到播放列表" @click="playOrAdd(item, 'add')"></i>
                            <i class="icn collect-icn" title="收藏" @click="collectMusic(item)"></i>
                            <i class="icn share-icn" title="分享" @click="notFeatureTip"></i>
                            <i class="icn down-icn" title="下载" @click="notFeatureTip"></i>
                        </div>
                    </td>
                    <td>
                        <div class="text">
                            <template v-for="(key, i) in item?.artists" :key="i">
                                <span class="text-hov" :title="key.name" @click="toSinger(key.id)">{{key.name}}</span><i v-if="i !== item.artists.length-1">/</i>
                            </template>
                        </div>
                    </td>
                    <td>
                        <div class="text">
                            <span class="text-hov" @click="toAlbum(item?.album?.id)">{{item?.album?.name}}</span>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <!-- 播放权限弹框 -->
    <Dialog 
      :visible="playDialog"
      showCustomButton
      @cancel='playCancel'
    >
        <p class="content-text">{{ playDialogText }}</p>
    </Dialog>
</template>

<script setup lang="ts">
import {ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Dialog from '@/components/dialog/dialog.vue';
import usePlayStore from '@/stores/modules/play.ts';
import useDialogStore from '@/stores/modules/dialog.ts';
import useSongAddPlaylist from '@/hooks/useSongAddPlayList.ts';
import usePlaySong from '@/hooks/usePlaySong.ts';
import { timeStampToDuration } from '@/utils/utils.ts';
import { getDetail } from '@/api/song.ts';
import type { songType } from '@/hooks/methods/songFormat.ts';


const playStore = usePlayStore();
const dialogStore = useDialogStore();
const router = useRouter();
const emit = defineEmits(['notFeatureTip']);

// 当前播放歌曲ID
const playSongId = computed(() => playStore.getPlaySongId);

// 播放显示/隐藏
const lock = computed(() => playStore.getplayLock);


const props = defineProps({
    djInfo: {
        type: Object,
        default: () => {}
    }
})

const tableIsOpen = ref(true);
function unfoldBtn() {
    tableIsOpen.value = !tableIsOpen.value;
}

// 提示弹框
const playDialog = ref(false);
const playDialogText = ref('');
function playCancel(value: boolean) {
    playDialog.value = value;
}

// 播放 or 添加到列表
let timer = null;
async function playOrAdd(item: songType, type: string) {
    let index = await isCopyright(item.id)
    
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
    emit('notFeatureTip', {type: 0, text: '功能暂未开发'})
}

// 歌曲是否有版权
type privilegeItem = {
    dl?: number,
    fee?: number
}
async function isCopyright(id?: number): Promise<undefined | number> {
    let res = await getDetail({ids: id})
    const privilege: privilegeItem = res?.privileges?.find(
        (item: { id: number }) => item.id === id
    );
    if (privilege?.dl === 0) {
        if(privilege.fee === 0){
            // 无版权
            return 0;
        }else if(privilege.fee === 1){
            // 付费歌曲
            return 1;
        }
    }else{
        // 可播放歌曲
        return 2;
    }
}

function toSong(id: number|string) {
    router.push({
        path: '/song',
        query: {
            id
        }
    })
}

function toSinger(id: number) {
    router.push({
        path: '/singer',
        query: {
            id
        }
    })
}

function toAlbum(id: number) {
    router.push({
        path: '/album',
        query: {
            id
        }
    })
}
</script>

<style lang="scss" scoped>
.prohead{
    height: 32px;
    padding: 0 10px;
    margin-bottom: -1px;
    overflow: hidden;
    background: #f7f7f7;
    border: 1px solid #d9d9d9;
    line-height: 33px;
    .unfold{
        float: right;
        margin: 7px 6px 0 0;
        line-height: 17px;
        color: #666;
        cursor: pointer;
        .table-icn{
            width: 11px;
            height: 8px;
            display: inline-block;
            overflow: hidden;
            vertical-align: middle;
            background: url('@/assets/images/icon2.png') no-repeat;
        }
        .pack{
            background-position: -75px -29px;
        }
        .unfold{
            background-position: -75px -20px;
        }
    }
    .total{
        color: #666;
        strong{
            font-weight: bold;
        }
    }
}
.song-list{
    width: 100%;
    border: 1px solid #d9d9d9;
    border-collapse: collapse;
    border-spacing: 0;
    table-layout: fixed;
    td{
        padding: 6px 10px;
        line-height: 18px;
        text-align: left;
        // background: url('@/assets/images/my-music/table.png') no-repeat 0 9999px;
    }
    .music-list-c{
        color: #333;
        .tr-index{
            width: 54px;
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
        .song-name-td{
            width: 230px;
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
        background-color: #f7f7f7;
    }
    .list-disabled{
        color: #bbb !important;
        .tr-index{
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
    .no-mySong-disabled{
        &:hover{
            .song-time{
                display: block;
            }
            .btns{
                display: none;
            }
        }
    }
}
</style>