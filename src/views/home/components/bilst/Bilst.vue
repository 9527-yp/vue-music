<template>
    <div class="n-bilst">
        <dl class="blk"
         v-for="(item,index) in songList"
         :key="index"
         :class="index === 2 ? 'last-blk' : ''">
            <dt class="top">
                <div class="top-img">
                    <img class="img" :src="item?.playlist?.coverImgUrl" alt="">
                    <i class="mask"></i>
                </div>
                <div class="top-title">
                    <div class="title-text text-hov" :title="item?.playlist?.name">{{item?.playlist?.name}}</div>
                    <div class="btn">
                        <i class="play-icn icn" title="播放" @click="playSongList(item)"></i>
                        <i class="collect-icn icn" title="收藏" v-if="!item?.playlist?.subscribed" @click="colSongList(item?.playlist?.id)"></i>
                        <i class="verify-collect-icn icn" title="已收藏" v-else ></i>
                    </div>
                </div>
            </dt>
            <dd>
                <ol class="bilst-list">
                    <li class="item" v-for="(i, j) in item?.playlist?.tracks.slice(0, 10)" :key="i.id">
                        <span
                         class="no"
                         :class="j == 0 || j === 1 || j === 2 ? 'no-top' : ''">
                            {{j+1}}
                        </span>
                        <span class="text text-hov">{{i?.name}}</span>
                        <div class="oper">
                            <i class="icn play-icn" title="播放" @click="playOrAddMusic(item, i, 'play')"></i>
                            <i class="icn add-icn" title="添加到播放列表" @click="playOrAddMusic(item, i, 'add')"></i>
                            <i class="icn collect-icn" title="收藏" @click="colMusic(i.id)"></i>
                        </div>
                    </li>
                </ol>
                <div class="more">
                    <span class="more-text text-hov" @click="toHomeToplist(item?.playlist?.id)">查看全部></span>
                </div>
            </dd>
        </dl>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { topList, playlistDetail } from '@/api/home.ts';
import type { ResponseType } from '@/types/index';
import { songType } from '@/hooks/methods/songFormat';
import usePlaySong from '@/hooks/usePlaySong.ts';
import useDialogStore from '@/stores/modules/dialog.ts';
import useSongAddPlayList from '@/hooks/useSongAddPlayList.ts';
import usePlayStore from '@/stores/modules/play.ts';
import useSongAddPlaylist from '@/hooks/useSongAddPlayList.ts';
import { collectPlayList } from '@/api/song-list.ts';

const playStore = usePlayStore();
const dialogStore = useDialogStore();

// 播放显示/隐藏
const lock = computed(() => playStore.getplayLock);

const playDialog = defineModel('playDialog', {
    type: Boolean,
    default: false
})
const playDialogText = defineModel('playDialogText', {
    type: String,
    default: ''
})

const emit = defineEmits(['toHomeToplist'])

function toHomeToplist(id: number) {
    emit('toHomeToplist', id)
}

type songListItem = {
    id?: number;
    playlist?: {
        id: number;
        name: string;
        coverImgUrl: string;
        subscribed: boolean;
        tracks: {
        id: number;
        name: string;
        noCopyrightRcmd: unknown;
        }[];
    };
    privileges?: {
        cp: number
    }[]
}

// 播放/添加 单首歌曲
function playOrAddMusic(item: songListItem, song: songType, type: string) {
    privileges = item.privileges;
    let index = isCopyright(song.id)

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
        usePlaySong(song);
    }
    useSongAddPlaylist(song);
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

// 收藏单首歌曲
function colMusic(id: number) {
    dialogStore.setSongId(id);
    dialogStore.setSongListShow(true);
}

const songList = ref<songListItem[]>([])
function getTopList() {
    topList().then((res: ResponseType) => {
        if(res.code === 200) {
            const topList = res?.list.slice(0,3) || []

            Promise.allSettled(
                topList.map((item: {id: number}) => getSongSheetDetail(item.id))
            ).then(res => {
                res.forEach(item => {
                    if(item.status === 'fulfilled'){
                        songList.value.push(item.value)
                    }else{
                        songList.value.push({})
                    }
                })
            })
        }
    })
}
getTopList()

// 获取歌单详情
function getSongSheetDetail(id: number): Promise<unknown> {
  return new Promise((resolve, reject) => {
    playlistDetail({ id })
      .then((res: ResponseType) => {
        if (res?.code === 200) {
          resolve(res);
        }

        reject();
      })
      .catch(() => reject());
  });
}

// 收藏歌单
function colSongList(id: number) {
    collectPlayList({
        t: 1,
        id
    }).then((res: ResponseType) => {
        if(res.code === 200) {
            dialogStore.setMessage({
                type: 1,
                text: '收藏成功',
                visible: true,
            })
            timer && clearTimeout(timer);
            timer = setTimeout(() => {
                dialogStore.setMessage({
                    type: 0,
                    text: '',
                    visible: false,
                })
            }, 1500);
        }
    })
}

// 播放歌单列表
let privileges = [];
let timer = null;
function playSongList(item: songListItem){
    privileges = item.privileges;

    // 过滤无版权
    const songList: songType[] = item?.playlist?.tracks.filter(
        (item: { id: number }) => isCopyright(item.id) === 2
    );

    // 将歌曲添加到播放列表 - 清空当前播放列表
    useSongAddPlaylist(songList, {clear: true})
    // 播放第一首歌
    usePlaySong(songList[0])

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

// 歌曲是否有版权
type privilegeItem = {
    dl?: number,
    fee?: number
}
function isCopyright(id: number): number | undefined {
    const privilege: privilegeItem = privileges.find(
        (item: { id: number }) => item.id === id
    );
    if (privilege?.dl === 0) {
        if(privilege.fee === 0){
            // 无版权
            return 0;
        }else if(privilege.fee === 1){
            // 付费歌曲
            return 1;
        }else{
            return 2;
        }
    }else{
        // 可播放歌曲
        return 2;
    }

}
</script>

<style lang="scss" scoped>
.n-bilst{
    height: 472px;
    margin-top: 20px;
    padding-left: 1px;
    background: url('@/assets/images/home/index_bill.png') no-repeat;
}
.blk{
    width: 230px;
    display: inline-block;
    vertical-align: top;
    .top{
        height: 100px;
        padding: 20px 0 0 19px;
        .top-img{
            display: inline-block;
            vertical-align: top;
            width: 80px;
            height: 80px;
            cursor: pointer;
            position: relative;
            .img{
                width: 100%;
                height: 100%;
            }
            .mask{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: url('@/assets/images/home/name-D5CGUEo8.png') no-repeat;
                background-position: -145px -57px;
            }
        }
        .top-title{
            display: inline-block;
            vertical-align: top;
            width: 116px;
            margin: 6px 0 0 10px;
            .title-text{
                width: 100%;
                font-size: 14px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                word-wrap: normal;
                font-weight: 700;
                cursor: pointer;
                color: #333;
            }
            .btn{
                margin-top: 10px;
                .icn{
                    display: inline-block;
                    width: 22px;
                    height: 22px;
                    margin-right: 10px;
                    background: url('@/assets/images/home/index.png') no-repeat;
                    cursor: pointer;
                }
                .play-icn{
                    background-position: -267px -205px;
                    &:hover{
                        background-position: -267px -235px;
                    }
                }
                .collect-icn{
                    background-position: -300px -205px;
                    &:hover{
                        background-position: -300px -235px;
                    }
                }
                .verify-collect-icn{
                    background-position: -330px -235px;
                }
            }
        }
    }
    .bilst-list{
        height: 319px;
        margin-left: 50px;
        line-height: 32px;
        .item{
            height: 32px;
            cursor: pointer;
            .no{
                display: inline-block;
                vertical-align: top;
                position: relative;
                width: 35px;
                height: 32px;
                margin-left: -35px;
                text-align: center;
                color: #666;
                font-size: 16px;
            }
            .no-top{
                color: #c10d0c;
            }
            .text{
                display: inline-block;
                vertical-align: top;
                width: 170px;
                height: 32px;
                color: #000;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                word-wrap: normal;
            }
            .oper{
                display: none;
                width: 82px;
                vertical-align: top;
                .icn{
                    display: inline-block;
                    vertical-align: middle;
                    width: 17px;
                    height: 17px;
                    margin-right: 10px;
                    cursor: pointer;
                    background: url('@/assets/images/home/index.png') no-repeat;
                }
                .play-icn{
                    background-position: -267px -268px;
                    &:hover{
                        background-position: -267px -288px;
                    }
                }
                .collect-icn{
                    background-position: -297px -268px;
                    &:hover{
                        background-position: -297px -288px;
                    }
                }
                .add-icn{
                    margin: 2px 6px 0 0;
                    background: url('@/assets/images/icon.png') no-repeat;
                    background-position: 0 -700px;
                    &:hover{
                        background-position: -22px -700px;
                    }
                }
            }
            &:hover{
                .text{
                    width: 96px;
                }
                .oper{
                    display: inline-block;
                }
            }
        }
    }
    .more{
        height: 32px;
        margin-right: 32px;
        text-align: right;
        line-height: 32px;
        .more-text{
            color: #000;
            cursor: pointer;
        }
    }
}
.last-blk{
    width: 228px;
}
</style>