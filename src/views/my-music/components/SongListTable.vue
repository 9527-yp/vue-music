<template>
    <div class="music-table">
        <table class="song-list-table">
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
                  'list-disabled' : item?.noCopyrightRcmd,
                  'no-mySong-disabled' : item?.noCopyrightRcmd && playlist?.userId !== userInfo?.userPoint?.userId
                   }"
                >
                    <td class="tr-index">
                        <div class="index-hd">
                            <span class="index">{{index+1}}</span>
                            <i class="play-icn" :class="{'play-z-slt' : playSongId === item.id}" @click="playMusic(item)"></i>
                        </div>
                    </td>
                    <td>
                        <div class="song-name">
                            <div class="song-name-box">
                                <span class="text-hov">{{item.name}}</span>
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
                            <i class="icn share-icn" title="分享"></i>
                            <i class="icn down-icn" title="下载"></i>
                            <i class="icn del-icn" v-if="playlist?.userId === userInfo?.userPoint?.userId" title="删除" @click="delSong(item)"></i>
                        </div>
                        <div class="btns" v-else>
                            <i class="icn del-icn" v-if="playlist?.userId === userInfo?.userPoint?.userId" title="删除" @click="delSong(item)"></i>
                        </div>
                    </td>
                    <td>
                        <div class="text">
                            <template v-for="(key, i) in item.ar" :key="i">
                                <span class="text-hov" :title="key.name">{{key.name}}</span><i v-if="i !== item.ar.length-1">/</i>
                            </template>
                        </div>
                    </td>
                    <td>
                        <div class="text">
                            <span class="text-hov">{{item?.al?.name}}</span>
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
        <p class="content-text">因合作方要求，该资源暂时无法收听，我们正在努力争取歌曲回归</p>
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
    <!-- 歌单弹框 -->
    <Dialog 
      :visible="songDialog"
      title="添加到歌单"
      @cancel='songCancel'
      class="song-dialog"
    >
        <template #content>
            <div class="song-box">
                <div class="song-add" @click="addSongList">
                    <i class="add-song-icn"></i>
                    新歌单
                </div>
                <div class="song-item" v-for="item in songList" :key="item.id" @click="addMusicSongList(item)">
                    <div class="song-img">
                        <img :src="item?.coverImgUrl" alt="">
                    </div>
                    <div class="song-right">
                        <p class="song-name thide">{{item.name}}</p>
                        <p class="song-num">{{item.trackCount}}首</p>
                    </div>
                </div>
            </div>
        </template>
    </Dialog>
    <!-- 新建歌单 -->
    <Dialog 
      :visible="addSongDialog"
      title="新建歌单"
      :confirmtext="'新建'"
      :canceltext="'取消'"
      showConfirmButton
      showCancelButton
      @confirm='addSongConfirm'
      @cancel='addSongCancel'
    >
        <template #content>
            <p>歌单名： <input v-model="songName" class="add-song-input" type="text"></p>
            <div class="input-warning">
                <div v-show="regexShow">
                    <i class="warning-icn"></i>
                    {{ regexText }}
                </div>
            </div>
            <div class="song-tip">可通过“收藏”将音乐添加到新歌单中</div>
        </template>
    </Dialog>
    <teleport to="body">
        <div class="warning-tip" v-if="warningInfo.visible">
            <i v-if="warningInfo.type" class="success-icn"></i>
            <i v-else class="warning-icn"></i>
            <span class="text">{{warningInfo.text}}</span>
        </div>
    </teleport>
</template>

<script setup lang="ts">
import Dialog from '@/components/dialog/dialog.vue';
import { timeStampToDuration } from '@/utils/utils.ts';
import useUserStore from '@/stores/modules/user.ts';
import usePlayStore from '@/stores/modules/play.ts';
import useSongAddPlaylist from '@/hooks/useSongAddPlayList.ts';
import usePlaySong from '@/hooks/usePlaySong.ts';
import type { songType } from '@/hooks/methods/songFormat.ts';
import type { ResponseType } from '@/types/index';
import { songAddorDel, addSong } from '@/api/my-music.ts'
import { computed, ref, reactive, watch } from 'vue';

const props = defineProps({
    playlist: {
        type: Object,
        default: {}
    },
    songList: {
        type: Array,
        default: []
    }
})

const emit = defineEmits(['delSong'])

const userStore = useUserStore();
const playStore = usePlayStore();

const userInfo = computed(() => userStore.getUserInfo);

// 播放显示/隐藏
const lock = computed(() => playStore.getplayLock);
// 当前播放歌曲ID
const playSongId = computed(() => playStore.getPlaySongId);

// 添加到播放列表
let timer = null;
function addMusic(item: songType) {
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

// 播放
// 提示弹框
const playDialog = ref(false);
function playCancel(value: boolean) {
    playDialog.value = value;
}
function playMusic(item: songType) {
    if(item?.noCopyrightRcmd){
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
const songDialog = ref(false);
function collectMusic(item: songType) {
    songId.value = item.id;
    songDialog.value = true;
}
function songCancel() {
    songDialog.value = false;
}
type SongList = {
    name: string,
    id: number | string,
    coverImgUrl: string,
    trackCount: number | string,
}
const warningInfo = reactive({
    text: '',
    visible: false,
    type:0, // 0:警告 ，1：成功
    time: null
})
async function addMusicSongList(item: SongList) {
    let res = await songAddorDel({
        op: 'add',
        pid: item.id,
        tracks: songId.value
    })
    songDialog.value = false;
    if(res.body.code === 502) {
        warningInfo.type = 0;
        warningInfo.text = '歌曲已存在！';
    }else if(res.body.code === 200){
        warningInfo.type = 1;
        warningInfo.text = '收藏成功';
    }
    warningInfo.visible = true;
    warningInfo.time && clearTimeout( warningInfo.time);
    warningInfo.time = setTimeout(() => {
        warningInfo.visible = false;
    }, 1500);

}

// 打开新建歌单弹框
function addSongList() {
    songDialog.value = false;
    addSongDialog.value = true;
}

// 新建歌单
const addSongDialog = ref(false);
const songName = ref('');
const regexText = ref('');
const regexShow = ref(false);
function addSongConfirm() {
    if(regexShow.value || songName.value === ''){
        return;
    }
    addSong({name: songName.value}).then((res: ResponseType) => {
        if(res.code === 200) {
            warningInfo.type = 1;
            warningInfo.text = '歌单创建成功';
            warningInfo.visible = true;
            warningInfo.time && clearTimeout( warningInfo.time);
            warningInfo.time = setTimeout(() => {
                warningInfo.visible = false;
            }, 1500);
        }
    })
}

function addSongCancel() {
    addSongDialog.value = false;
}
watch(() => songName.value, (newValue) => {
    const invalidCharsRegex = /[@#]/;
    let regex =  invalidCharsRegex.test(newValue)
    if(regex){
        regexText.value = '歌单名不能包含字符“@”和“#”！'
        regexShow.value = true;
    }else if(songName.value.length > 20){
        regexText.value = '歌单名不能超过20个字符'
        regexShow.value = true;
    }
    else{
        regexShow.value = false;
    }
})
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
            background: url('@/assets/images/my-music/table.png') no-repeat 0 9999px;
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
                    }
                    .play-z-slt{
                        background-position: -20px -128px;
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
                        cursor: default;
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
.song-dialog{
    .song-box{
        overflow-y: auto;
        height: 374px;
        padding-bottom: 15px;
        .song-add{
            padding: 10px 0 10px 35px;
            background: #e6e6e6;
            text-align: left;
            cursor: pointer;
            .add-song-icn{
                width: 35px;
                height: 36px;
                margin-right: 10px;
                display: inline-block;
                overflow: hidden;
                vertical-align: middle;
                background: url('@/assets/images/icon.png') no-repeat 0 9999px;
                background-position: 0 -495px;
            }
        }
        .song-item{
            display: flex;
            padding: 6px 0 6px 35px;
            border-top: 1px solid #e0e0e0;
            cursor: pointer;
            .song-img{
                width: 40px;
                height: 40px;
                min-width: 40px;
                min-height: 40px;
                margin-right: 10px;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .song-right{
                width: 100%;
                .song-name{
                    width: 100%;
                    color: #000;
                    margin-top: 2px;
                    margin-bottom: 8px;
                    text-align: left;
                    word-wrap: break-word;
                }
                .song-num{
                    text-align: left;
                    word-wrap: break-word;
                    color: #666;
                }
            }
            &:hover{
                background: #f2f2f2;
            }
        }
    }
}
.warning-tip{
    width: 280px;
    background: #fff;
    color: #333;
    line-height: 52px;
    text-align: center;
    border: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    position: absolute;
    top:50%;
    left: 50%;
    z-index: 20002;
    margin-top: -40px;
    margin-left: -140px;
    vertical-align: middle;
    .warning-icn{
        width: 20px;
        height: 20px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 3px;
        background: url('@/assets/images/icon.png') no-repeat;
        background-position: -24px -406px;
    }
    .success-icn{
        width: 20px;
        height: 20px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 3px;
        background: url('@/assets/images/icon.png') no-repeat;
        background-position: -24px -430px;
    }
    .text{
        display: inline-block;
        vertical-align: middle;
    }
}
.add-song-input{
    vertical-align: middle;
    width: 330px;
    height: 19px;
    margin: 0;
    padding: 5px 6px 6px;
    border: 1px solid #cdcdcd;
    border-radius: 2px;
    line-height: 19px;
    box-sizing: content-box;
    font-size: 12px;
    color: #333;
    &:focus{
        outline: none;
    }
}
.input-warning{
    text-align: left;
    margin-left: 90px;
    height: 17px;
    margin-top: 5px;
    line-height: 17px;
    color: #e33232;
    .warning-icn{
        margin-right: 8px;
        width: 14px;
        height: 14px;
        display: inline-block;
        overflow: hidden;
        vertical-align: middle;
        background: url('@/assets/images/icon.png') no-repeat 0 9999px;
        background-position: -50px -270px;
    }
}
.song-tip{
    text-align: left;
    margin: 8px 0 20px 90px;
    color: #999;
}
</style>