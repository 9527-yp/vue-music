<template>
    <table class="song-table">
        <thead>
            <tr>
                <th class="first"></th>
                <th>
                    <div class="wp">标题</div>
                </th>
                <th class="time-th">
                    <div class="wp">时长</div>
                </th>
                <th class="singer-th">
                    <div class="wp">歌手</div>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr 
                class="item"
                v-for="(item, index) in playlist?.tracks"
                :key="item.id"
                :class="{
                'even' : index % 2 === 0,
                'list-disabled' : isCopyright(item.id) === 0,
                }"
            >
                <td>
                    <div class="hd">
                        <span class="num">1</span>
                        <div class="rk">
                            <i class="new-icn"></i>
                        </div>
                    </div>
                </td>
                <td class="rank">
                    <div class="tit-cnt">
                        <img src="http://p2.music.126.net/lmyFhYelH4PuVGOA7ZXTdQ==/109951170200859005.jpg?param=50y50&quality=100" alt="">
                        <span class="play-icn" :class="{'play-z-slt' : playSongId === item.id}" title="播放" @click="playMusic(item)"></span>
                        <div class="ttc">
                            <span class="txt">
                                <span class="name text-hov" title="滥俗的歌 - (电影《好东西》插曲)">滥俗的歌</span>
                                <span> - (电影《好东西》插曲)</span>
                                <span class="mv-icn" title="播放mv"></span>
                            </span>
                        </div>
                    </div>
                </td>
                <td class="time-td">
                    <span class="song-time">04:36</span>
                    <div class="btns">
                        <i class="add-icn" title="添加到播放列表" @click="addMusic(item)"></i>
                        <i class="icn collect-icn" title="收藏" @click="collectMusic(item)"></i>
                        <i class="icn share-icn" title="分享" @click="notFeatureTip"></i>
                        <i class="icn down-icn" title="下载" @click="notFeatureTip"></i>
                    </div>
                </td>
                <td>
                    <div class="singer">
                        <span class="text-hov">钟楚曦</span>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
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

const emit = defineEmits(['notFeatureTip'])

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
.song-table{
    width: 100%;
    border: 1px solid #d9d9d9;
    border-collapse: collapse;
    border-spacing: 0;
    table-layout: fixed;
    th{
        height: 38px;
        background-color: #f7f7f7;
        vertical-align: top;
        text-align: left;
        font-weight: normal;
        color: #666;
        background: url('@/assets/images/my-music/table.png') no-repeat;
        background-position: 0 0;
        background-repeat: repeat-x;
    }
    td{
        padding: 6px 10px;
        line-height: 18px;
        text-align: left;
    }
    .first{
        width: 77px;
    }
    .time-th{
        width: 91px;
    }
    .singer-th{
        width: 26%;
    }
    .wp{
        height: 18px;
        line-height: 18px;
        padding: 8px 10px;
        background: url('@/assets/images/my-music/table.png') no-repeat;
        background-position: 0 -56px;
    }
    .item{
        .hd{
            height: 18px;
            .num{
                float: left;
                width: 25px;
                margin-left: 0;
                text-align: center;
                color: #999;
            }
            .rk{
                float: right;
                width: 32px;
                margin-right: -5px;
                text-align: center;
                .new-icn{
                    display: block;
                    float: none;
                    margin: 0 auto;
                    padding-left: 0;
                    width: 16px;
                    height: 17px;
                    background: url('@/assets/images/icon.png') no-repeat;
                    background-position: -67px -283px;
                }
            }
        }
        .rank{
            padding-top: 10px;
            padding-bottom: 10px;
            .tit-cnt{
                float: left;
                width: 100%;
                img{
                    float: left;
                    width: 50px;
                    height: 50px;
                    margin-right: 14px;
                    cursor: pointer;
                }
                .play-icn{
                    margin-top: 17px;
                    margin-right: 8px;
                    float: left;
                    width: 17px;
                    height: 17px;
                    cursor: pointer;
                    background: url('@/assets/images/my-music/table.png') no-repeat;
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
                .ttc{
                    margin-top: 16px;
                    height: 18px;
                    margin-right: 20px;
                    .txt{
                        max-width: 67%;
                        position: relative;
                        display: inline-block;
                        padding-right: 25px;
                        margin-right: -25px;
                        height: 20px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        color: #aeaeae;
                        .name{
                            color: #333;
                        }
                        .mv-icn{
                            position: absolute;
                            top: 0;
                            right: 0;
                            width: 23px;
                            height: 17px;
                            margin: 1px 0 0 0;
                            cursor: pointer;
                            background: url('@/assets/images/my-music/table.png') no-repeat;
                            background-position: 0 -151px;
                            &:hover{
                                background-position: -30px -151px;
                            }
                        }
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
        .time-td{
            color: #666;
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
        .singer{
            color: #333;
            width: 100%;
            position: relative;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        &:hover{
            .time-td{
                padding-right: 0px;
                .song-time{
                    display: none;
                }
                .btns{
                    display: block;
                }
            }
        }
    }
}
</style>