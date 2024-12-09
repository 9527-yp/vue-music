<template>
    <li class="item">
        <div class="cover">
            <img v-if="type === 1" :src="item?.picUrl + '?param=140y140'" alt="">
            <img v-if="type === 2" :src="item?.coverImgUrl + '?param=140y140'" alt="">
            <i class="high-quality" v-if="item?.highQuality && type === 2"></i>
            <span class="msk" :title="item?.name" @click="toPlayList(item.id)"></span>
            <div class="item-bottom">
                <i class="play-icn" title="播放" @click="playMusic(item?.id)"></i>
                <i class="headset-icn"></i>
                <span class="num">{{item?.playCountStr}}</span>
            </div>
        </div>
        <p class="tit tit-txt text-hov" :title="item?.name" @click="toPlayList(item.id)">
            <i v-if="type === 3" class="radio-station"></i>
            {{item?.name}}
        </p>
        <slot></slot>
        <p v-if="type === 2">
            <span class="by">by</span>
            <span class="name text-hov thide" :title="item?.creator?.nickname" @click="toUserHome(item?.creator?.userId)">{{item?.creator?.nickname}}</span>
            <img class="icon" v-if="item?.creator?.avatarDetail" :src="item?.creator?.avatarDetail?.identityIconUrl" alt="">
        </p>
    </li>
</template>

<script setup lang="ts">
import { getSongSheetInfo } from '@/api/my-music.ts';
import { useRouter } from 'vue-router';
import type { SongType } from '@/types/home.ts';
import useSongAddPlaylist from '@/hooks/useSongAddPlayList.ts';
import usePlaySong from '@/hooks/usePlaySong.ts';
import usePlayStore from '@/stores/modules/play.ts';
import { computed } from 'vue';

const router = useRouter();
const playStore = usePlayStore();

const props = defineProps({
    item: {
        type: Object,
        default: () => {}
    },
    type: {
        type: Number,
        default: 0
    }
})

// 播放显示/隐藏
const lock = computed(() => playStore.getplayLock);

// 播放歌单音乐
let privileges = [];
let songs = [];
let timer = null;
async function playMusic(id: number) {
    let res = await getSongSheetInfo({id})
    if(res.code !== 200) return;

    privileges = res?.privileges ?? [];
    songs = res?.playlist?.tracks ?? []

    // 过滤无版权
    const songList: songType[] = songs.filter(
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

// 歌曲是否有版权
function isCopyright(id: number): boolean | undefined {
    const privilege: {cp?: number} = privileges?.find(
        (item: { id: number }) => item.id === id
    );

    if (privilege?.cp === 0) {
        return true;
    }

    return false;
}

function toPlayList(id: number) {
    router.push({
        path: '/playList',
        query: {
            id
        }
    })
}

function toUserHome(id: number) {
    router.push({
        path: '/user/home',
        query: {
            id
        }
    })
}
</script>

<style lang="scss" scoped>
.item{
    width: 140px;
    // overflow: hidden;
    .cover{
        width: 140px;
        height: 140px;
        position: relative;
        img{
            width: 100%;
            height: 100%;
        }
        .high-quality{
            position: absolute;
            top: 0;
            left: 0;
            width: 40px;
            height: 40px;
            background: url('@/assets/images/icon2.png') no-repeat;
            background-position: -135px -220px;
        }
        .msk{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url('@/assets/images/home/name-D5CGUEo8.png') no-repeat;
            background-position: 0 0;
            cursor: pointer;
        }
        .item-bottom{
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 27px;
            background: url('@/assets/images/home/name-D5CGUEo8.png') no-repeat;
            background-position: 0 -537px;
            color: #ccc;
            .play-icn{
                position: absolute;
                right: 10px;
                bottom: 5px;
                width: 16px;
                height: 17px;
                background: url('@/assets/images/home/name-Db6Jvh02.png') no-repeat;
                background-position: 0 0;
                cursor: pointer;
                &:hover{
                    background-position: 0 -60px;
                }
            }
            .headset-icn{
                float: left;
                width: 14px;
                height: 11px;
                background: url('@/assets/images/home/name-Db6Jvh02.png') no-repeat;
                background-position: 0 -24px;
                margin: 9px 5px 9px 10px;
            }
            .num{
                float: left;
                margin: 7px 0 0 0;
            }
        }
    }
    p{
        width: 100%;
    }
    .tit{
        margin: 8px 0 3px;
        font-size: 14px;
    }
    .tit-txt{
        display: inline-block;
        max-width: 100%;
        vertical-align: middle;
        color: #000;
    }
    .by{
        color: #999;
    }
    .name{
        max-width: 76%;
        color: #666;
        margin-left: 3px;
        display: inline-block;
        vertical-align: middle;
    }
    .icon{
        height: 13px;
        width: 13px;
        margin-left: 3px;
        display: inline-block;
        vertical-align: middle;
    }
}
.playList-ul{
    .item{
        float: left;
        height: 188px;
        padding: 0 0 30px 50px;
        line-height: 1.4;
        .tit-txt{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            word-wrap: normal;
        }
    }
}
.list-content{
    .item{
        display: inline-block;
        height: 204px;
        margin-right: 42px;
        margin-bottom: 30px;
        vertical-align: middle;
        .tit{
            .radio-station{
                float: left;
                width: 35px;
                height: 18px;
                margin-top: -3px;
                margin-right: 8px;
                background: url('@/assets/images/icon.png') no-repeat 0 9999px;
                background-position: -31px -655px;
            }
        }
        .tit-txt{
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
        }
        .idv{
            width: 100%;
            color: #999;
            margin-top: 3px;
            position: relative;
            z-index: 2;
            cursor: pointer;
            em{
                min-height: 30px;
                display: inline-block;
            }
            .not-interest{
                display: none;
                color: #666;
                width: 63px;
                height: 26px;
                margin-top: 0px;
                text-align: center;
                line-height: 26px;
                background: url('@/assets/images/home/index.png') no-repeat;
                background-position: 0 -130px;
            }
            &:hover{
                .not-interest{
                    display: block;
                }
                em{
                    display: none;
                }
            }
        }
    }
}
</style>