<template>
    <div class="music-table">
        <table v-if="privileges.length > 0" class="song-list-table">
            <thead>
                <tr>
                    <th class="first th-1">
                        <div class="text"></div>
                    </th>
                    <th>
                        <div class="text">歌曲标题</div>
                    </th>
                    <th class="th-2">
                        <div class="text">时长</div>
                    </th>
                    <th class="th-3">
                        <div class="text">歌手</div>
                    </th>
                    <th class="th-4">
                        <div class="text">专辑</div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                  class="music-list-c"
                  v-for="(item, index) in playlist?.tracks"
                  :key="item.id"
                  :class="{
                  'even' : index % 2 === 0,
                  'list-disabled' : isCopyright(item.id) === 0,
                  'no-mySong-disabled' : item?.noCopyrightRcmd && playlist?.userId !== userInfo?.userPoint?.userId
                   }"
                >
                    <td class="tr-index">
                        <div class="index-hd">
                            <span class="index">{{index+1}}</span>
                            <i class="play-icn" :class="{'play-z-slt' : playSongId === item.id}" title="播放" @click="playMusic(item)"></i>
                        </div>
                    </td>
                    <td>
                        <div class="song-name">
                            <div class="song-name-box">
                                <span class="text-hov" @click="toSong(item.id)">{{item.name}}</span>
                                <span class="song-other" v-if="item?.alia.length > 0"> - ({{item?.alia[0]}})</span>
                                <i v-if="item.mv" class="mv-icn"></i>
                            </div>
                        </div>
                    </td>
                    <td class="song-time-box">
                        <span class="song-time">{{ timeStampToDuration(item.dt / 1000) || '00:00' }}</span>
                        <div class="btns" v-if="!item?.noCopyrightRcmd">
                            <i class="add-icn" title="添加到播放列表" @click="addMusic(item)"></i>
                            <i class="icn collect-icn" title="收藏" @click="collectMusic(item)"></i>
                            <i class="icn share-icn" title="分享" @click="notFeatureTip"></i>
                            <i class="icn down-icn" title="下载" @click="notFeatureTip"></i>
                            <i class="icn del-icn" v-if="playlist?.userId === userInfo?.userPoint?.userId" title="删除" @click="delSong(item)"></i>
                        </div>
                        <div class="btns" v-else>
                            <i class="icn del-icn" v-if="playlist?.userId === userInfo?.userPoint?.userId" title="删除" @click="delSong(item)"></i>
                        </div>
                    </td>
                    <td>
                        <div class="text">
                            <template v-for="(key, i) in item.ar" :key="i">
                                <span class="text-hov" :title="key.name" @click="toSinger(key.id)">{{key.name}}</span><i v-if="i !== item.ar.length-1">/</i>
                            </template>
                        </div>
                    </td>
                    <td>
                        <div class="text">
                            <span class="text-hov" @click="toAlbum(item?.al?.id)">{{item?.al?.name}}</span>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- 歌单没有歌曲展示的table内容 -->
        <div v-else class="not-song-list-box">
            <div class="not-title">
                <i class="icn"></i>
                <h3 class="text">暂无音乐！</h3>
            </div>
            <div class="desc">
                <span class="text">点击</span>
                <i class="icon"></i>
                <span class="text">即可将你喜欢的音乐收藏到“我的音乐”</span>
                <span class="text go">马上去</span>
                <router-link to="/" class="text">发现音乐</router-link>
            </div>
        </div>
        <div class="playlist-see-more">
            <div class="text">查看更多内容，请下载客户端</div>
            <div class="button" @click="notFeatureTip">立即下载</div>
        </div>
    </div>
    <!-- 播放权限弹框 -->
    <Dialog 
      :visible="playDialog"
      showCustomButton
      @cancel='playCancel'
    >
        <p class="content-text">{{ playDialogText }}</p>
    </Dialog>
    <!-- 删除歌曲弹框 -->
    <Dialog 
      :visible="deleteSongDialog"
      :confirmtext="'确定'"
      :canceltext="'取消'"
      showConfirmButton
      showCancelButton
      @confirm='deleteConfirm'
      @cancel='deleteCancel'
    >
        <p class="content-text">确定删除歌曲？</p>
    </Dialog>
</template>

<script setup lang="ts">
import Dialog from '@/components/dialog/dialog.vue';
import { timeStampToDuration } from '@/utils/utils.ts';
import useUserStore from '@/stores/modules/user.ts';
import usePlayStore from '@/stores/modules/play.ts';
import useDialogStore from '@/stores/modules/dialog.ts';
import useSongAddPlaylist from '@/hooks/useSongAddPlayList.ts';
import usePlaySong from '@/hooks/usePlaySong.ts';
import type { songType } from '@/hooks/methods/songFormat.ts';
import type { ResponseType } from '@/types/index';
import { songAddorDel } from '@/api/my-music.ts'
import { computed, ref, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    playlist: {
        type: Object,
        default: {}
    },
    privileges: {
        type: Array,
        default: []
    }
})

const emit = defineEmits(['delSong', 'notFeatureTip'])

const userStore = useUserStore();
const playStore = usePlayStore();
const dialogStore = useDialogStore();
const router = useRouter();

const userInfo = computed(() => userStore.getUserInfo);

// 播放显示/隐藏
const lock = computed(() => playStore.getplayLock);
// 当前播放歌曲ID
const playSongId = computed(() => playStore.getPlaySongId);

// 添加到播放列表
let timer = null;
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

// 歌曲是否有版权
type privilegeItem = {
    dl?: number,
    fee?: number
}
function isCopyright(id?: number): number | undefined {
    const privilege: privilegeItem = props.privileges.find(
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

// 播放
// 提示弹框
const playDialog = ref(false);
const playDialogText = ref('');
function playCancel(value: boolean) {
    playDialog.value = value;
}
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

// 删除歌曲
const deleteSongDialog = ref(false);
const songId = ref(undefined);
function delSong(item: songType) {
    songId.value = item.id;
    deleteSongDialog.value = true;
}

function deleteConfirm() {
    songAddorDel({
        op: 'del',
        pid: props.playlist.id,
        tracks: songId.value
    }).then((res: ResponseType) => {
        if(res.status === 200) {
            emit('delSong')
            deleteSongDialog.value = false
        }
    })
}
function deleteCancel() {
    deleteSongDialog.value = false
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
    emit('notFeatureTip')
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
.music-table{
    width: 100%;
    // height: 600px;
    .song-list-table{
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
        td{
            padding: 6px 10px;
            line-height: 18px;
            text-align: left;
            // background: url('@/assets/images/my-music/table.png') no-repeat 0 9999px;
        }
        .first{
            width: 74px;
            .text{
                background: none;
            }
        }
        .th-2{
            width: 111px;
        }
        .th-3{
            width: 14%;
        }
        .th-4{
            width: 20%;
        }
        .music-list-c{
            color: #333;
            .tr-index{
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
}
.content-text{
    padding: 0 20px;
    line-height: 22px;
    font-size: 14px;
}
.playlist-see-more{
    width: 100%;
    height: 66px;
    display: none;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    margin-top: 30px;
    margin-bottom: -10px;
    .text{
        font-size: 13px;
        color: #333333;
    }
    .button{
        width: 120px;
        height: 30px;
        background-image: linear-gradient(90deg, #ff5a4c 0%, #ff1d12 100%);
        border-radius: 18px;
        line-height: 30px;
        font-size: 12px;
        color: #ffffff;
        text-align: center;
        cursor: pointer;
    }
}
.playList-table{
    .playlist-see-more{
        display: flex !important;
    }
}
.not-song-list-box{
    padding: 95px 0;
    text-align: center;
    .not-title{
        width: 100%;
        padding-bottom: 16px;
        margin: 0 auto;
        font-size: 18px;
        color: #333;
        text-align: center;
        .icn{
            display: inline-block;
            width: 64px;
            height: 50px;
            margin-right: 17px;
            vertical-align: middle;
            background: url('@/assets/images/icon.png') no-repeat 0 9999px;
            background-position: 0 -347px;
        }
        .text{
            display: inline-block;
            vertical-align: middle;
        }
    }
    .desc{
        margin-top: 20px;
        color: #aaa;
        .text{
            display: inline-block;
            vertical-align: middle;
        }
        .icon{
            display: inline-block;
            width: 16px;
            height: 14px;
            margin: 0 9px 0 7px;
            vertical-align: middle;
            background: url('@/assets/images/icon.png') no-repeat 0 9999px;
            background-position: 0 -400px;
        }
        .go{
            margin-right: 5px;
            margin-left: 10px;
        }
    }
}
</style>