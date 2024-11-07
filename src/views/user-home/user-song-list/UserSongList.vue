<template>
    <div v-if="list.length > 0">
        <div class="ranking-title">
            <h3 class="title song-list">{{title}}（{{list.length}}）</h3>
        </div>
        <ul class="m-ovrlst">
            <li class="item" v-for="(item, index) in list" :key="index">
                <div class="cover">
                    <img :src="item.coverImgUrl" alt="">
                    <span class="msk" :title="item.name"></span>
                    <div class="bottom">
                        <i class="icn play-icn" @click="PlayListBtn(item)"></i>
                        <i class="icon-headset"></i>
                        <span class="num">{{getBigNumberTransform(item.playCount)}}</span>
                    </div>
                </div>
                <p class="title">
                    <span class="title-text text-hov thide" :title="item.name">{{item.name}}</span>
                </p>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from 'vue';
import { getBigNumberTransform } from '@/utils/utils.ts';
import type { ResponseType } from '@/types/index';
import type { songType } from '@/hooks/methods/songFormat.ts';
import useSongAddPlaylist from '@/hooks/useSongAddPlayList.ts';
import usePlaySong from '@/hooks/usePlaySong.ts';
import usePlayStore from '@/stores/modules/play.ts';
import { getSongSheetInfo } from '@/api/my-music.ts';


defineProps({
    title: {
        type: String,
        default: ''
    },
    list: {
        type: Array,
        default: []
    }
})

const playStore = usePlayStore();

// 播放显示/隐藏
const lock = computed(() => playStore.getplayLock);

// 歌曲是否有版权
function isCopyright(id: number): boolean | undefined {
  const privilege: { id: number, cp?: number } = songSheetDetail.privileges?.find(
    (item: { id: number }) => item.id === id
  );

  if (privilege?.cp === 0) {
    return true;
  }

  return false;
}

type TypeSongSheetList = {
    name: string,
    subscribed: boolean,
    id: number,
    coverImgUrl: string,
    trackCount: number,
    creator: {
        nickname: string,
        userId: number,
        avatarUrl: string
    }
}

type TypeSongSheetDetail = {
    playlist: {
        coverImgUrl?: string,
        name?: string,
        id?: number,
        playCount?: number,
        trackCount?: number,
        subscribed?: boolean,
        tracks?: {
            id: number;
        }[];
    },
    privileges: {
        id: number;
    }[];
}

const songSheetDetail = reactive<TypeSongSheetDetail>({
    playlist: {},
    privileges: []
})

// 播放歌单
const songSheetId = ref(undefined);
let timer = null;
async function PlayListBtn(item: TypeSongSheetList) {
    console.log(item, 'item')
    songSheetId.value = item.id

    let res = await getSongSheetInfo({id: songSheetId.value})

    if(res.code !== 200) {
        return ;
    }
    songSheetDetail.playlist = res?.playlist ?? {};
    songSheetDetail.privileges = res?.privileges ?? [];

    if (songSheetDetail.playlist?.tracks?.length === 0) {
        return;
    }

    // 过滤无版权
    const songList: SongType[] = songSheetDetail.playlist?.tracks.filter(
        (item: { id: number }) => !isCopyright(item.id)
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


// 歌单详情
// function getSongInfo() {
//     getSongSheetInfo({id: songSheetId.value}).then((res: ResponseType) => {
//         if(res.code === 200) {
//             songSheetDetail.playlist = res?.playlist ?? {};
//             songSheetDetail.privileges = res?.privileges ?? [];
//         }
//     })
// }
</script>


<style lang="scss" scoped>
.ranking-title{
    position: relative;
    z-index: 2;
    zoom: 1;
    height: 33px;
    border-bottom: 2px solid #c20c0c;
    .title{
        font-size: 20px;
        line-height: 28px;
        font-weight: normal;
        color: #666;
        font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
        float: left;
    }
    .song-list{
        color: #333;
    }
}
.m-ovrlst{
    margin: 20px 0 0 -50px;
    .item{
        float: left;
        width: 140px;
        padding: 0 0 30px 50px;
        line-height: 1.4;
        height: 165px;
        overflow: hidden;
        .cover{
            width: 140px;
            height: 140px;
            position: relative;
            img{
                width: 140px;
                height: 140px;
                display: block;
            }
            .msk{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                cursor: pointer;
                background: url('@/assets/images/home/name-D5CGUEo8.png') no-repeat 0 9999px;
                background-position: 0 0;
            }
            .bottom{
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 27px;
                background: url('@/assets/images/home/name-D5CGUEo8.png') no-repeat 0 9999px;
                background-position: 0 -537px;
                color: #ccc;
                .play-icn{
                    position: absolute;
                    right: 10px;
                    bottom: 5px;
                    width: 16px;
                    height: 17px;
                    background: url('@/assets/images/home/name-Db6Jvh02.png') no-repeat 0 9999px;
                    background-position: 0 0;
                    cursor: pointer;
                    &:hover{
                        background-position: 0 -60px;
                    }
                }
                .icon-headset{
                    float: left;
                    width: 14px;
                    height: 11px;
                    background: url('@/assets/images/home/name-Db6Jvh02.png') no-repeat 0 9999px;
                    background-position: 0 -24px;
                    margin: 9px 5px 9px 10px;
                }
                .num{
                    float: left;
                    margin: 7px 0 0 0;
                }
            }
        }
        .title{
            margin: 8px 0 3px;
            font-size: 14px;
            width: 100%;
            .title-text{
                display: inline-block;
                max-width: 100%;
                vertical-align: middle;
                color: #000;
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
</style>