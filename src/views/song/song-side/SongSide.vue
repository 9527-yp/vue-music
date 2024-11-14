<template>
    <div class="music-side">
        <h3 class="header">
            <span>包含这首歌的歌单</span>
        </h3>
        <ul class="recommend-ul">
            <li class="item" v-for="item in playListData" :key="item.id">
                <div class="song-img" :title="item.name" @click="toPlayList(item.id)">
                    <img :src="item.coverImgUrl" alt="">
                </div>
                <div class="info">
                    <p class="thide">
                        <span class="song-name text-hov" @click="toPlayList(item.id)">{{item.name}}</span>
                    </p>
                    <p>
                        <span class="by">by</span>
                        <span class="nm thide text-hov" :title="item.creator.nickname" @click="toUserHome(item.userId)">{{item.creator.nickname}}</span>
                    </p>
                </div>
            </li>
        </ul>
        <h3 class="header">
            <span>相似的歌曲</span>
        </h3>
        <ul class="m-sglist">
            <li class="sglist-item" v-for="item in songList" :key="item.id">
                <div class="item-left">
                    <div class="thide">
                        <span class="text-tit text-hov" :title="item.name" @click="toSong(item.id)">{{item.name}}</span>
                    </div>
                    <div class="thide">
                        <template v-for="(key, i) in item?.artists" :key="i">
                            <span class="text-hov" :title="key.name">{{key.name}}</span><i v-show="i !== item?.artists.length-1">/</i>
                        </template>
                        
                    </div>
                </div>
                <div class="item-right">
                    <i class="play-icn icn" @click="playMusic(item.id)"></i>
                    <i class="add-icn icn" @click="addMusic(item.id)"></i>
                </div>
            </li>
        </ul>
        <div class="m-multi">
            <h3 class="header">
                <span>网易云音乐多端下载</span>
            </h3>
            <ul class="down-ul">
                <li class="item">
                    <span class="ios"></span>
                </li>
                <li class="item">
                    <span class="pc"></span>
                </li>
                <li class="item">
                    <span class="aos"></span>
                </li>
            </ul>
            <p>同步歌单，随时畅听好音乐</p>
        </div>
        <h3 class="header">
            <span>用户wiki</span>
        </h3>
        <a class="wiki-edit text-hov" href="">
            <img class="img" src="@/assets/images/my-music/icn.png" alt="">
            <span>补充或修改歌曲资料</span>
        </a>
        <a class="wiki-edit text-hov" href="">
            <img class="img" src="@/assets/images/my-music/icn.png" alt="">
            <span>用户wiki任务中心</span>
        </a>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getSimiPlayList, getSimiSong } from '@/api/song.ts';
import type { ResponseType } from '@/types/index';

const router = useRouter();
const route = useRoute();

// 监听歌曲id变化
watch(() => route.query.id, () => {
    getSimiPlayListData();
    getSimiSongData();
})

const emit = defineEmits(['playSimiMusic', 'addSimiMusic'])
// 获取相似歌单及相似音乐
const playListData = ref([]);
function getSimiPlayListData() {
    getSimiPlayList({id: route.query.id}).then((res: ResponseType) => {
        if(res.code === 200) {
            playListData.value = res.playlists;
        }
    })
}

const songList = ref([])
function getSimiSongData() {
    getSimiSong({id: route.query.id}).then((res: ResponseType) => {
        if(res.code === 200) {
            songList.value = res.songs;
        }
    })
}

function playMusic(id: number) {
    emit('playSimiMusic', id)
}

function addMusic(id: number) {
    emit('addSimiMusic', id)
}

function toUserHome(id: number) {
    router.push({
        path: '/user/home',
        query: {
            id
        }
    })
}

function toPlayList(id: number) {
    router.push({
        path: '/playList',
        query: {
            id
        }
    })
}

function toSong(id: number) {
    router.push({
        path: '/song',
        query: {
            id
        }
    })
}


onMounted(() => {
    getSimiPlayListData();
    getSimiSongData();
})

</script>

<style lang="scss" scoped>
.music-side{
    position: relative;
    float: right;
    width: 270px;
    padding: 20px 40px 40px 30px;
    box-sizing: border-box;
    .header{
        position: relative;
        height: 23px;
        margin-bottom: 20px;
        border-bottom: 1px solid #ccc;
        color: #333;
        font-size: 100%;
    }
    .recommend-ul{
        margin-bottom: 25px;
        .item{
            float: left;
            width: 200px;
            height: 50px;
            margin-bottom: 15px;
            line-height: 24px;
            .song-img{
                margin-right: -60px;
                float: left;
                width: 50px;
                height: 50px;
                cursor: pointer;
                img{
                    width: 50px;
                    height: 50px;
                }
            }
            .info{
                margin-left: 60px;
                line-height: 24px;
                p{
                    width: 140px;
                }
                .song-name{
                    color: #000;
                    font-size: 14px;
                    cursor: pointer;
                }
                .by{
                    float: left;
                    color: #999;
                }
                .nm{
                    float: left;
                    max-width: 106px;
                    margin: 0 2px 0 4px;
                    color: #666;
                    cursor: pointer;
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
    .m-sglist{
        margin-bottom: 25px;
        .sglist-item{
            margin-top: 10px;
            .item-left{
                float: left;
                width: 156px;
                line-height: 16px;
                color: #999;
                .text-tit{
                    color: #333;
                }
            }
            .item-right{
                float: right;
                position: relative;
                top: 10px;
                line-height: 32px;
                .icn{
                    float: left;
                    width: 10px;
                    height: 11px;
                    opacity: 0.9;
                    cursor: pointer;
                    background: url('@/assets/images/icon2.png') no-repeat;
                }
                .play-icn{
                    margin-right: 16px;
                    background-position: -69px -455px;
                    &:hover{
                        opacity: 1;
                    }
                }
                .add-icn{
                    background-position: -87px -454px;
                    &:hover{
                        opacity: 1;
                    }
                }
                &:after {
                    clear: both;
                    content: '.';
                    display: block;
                    height: 0;
                    visibility: hidden;
                }
            }
            &:after {
                clear: both;
                content: '.';
                display: block;
                height: 0;
                visibility: hidden;
            }
        }
    }
    .m-multi{
        margin: 20px 0;
        padding-bottom: 20px;
        .down-ul{
            height: 65px;
            margin-bottom: 10px;
            background: url('@/assets/images/sprite.png') no-repeat;
            background-position: 0 -392px;
            .item{
                float: left;
                .ios{
                    display: block;
                    width: 42px;
                    height: 48px;
                    cursor: pointer;
                    &:hover{
                        background: url('@/assets/images/sprite.png') no-repeat;
                        background-position: 0 -472px;
                    }
                }
                .pc{
                    display: block;
                    width: 60px;
                    margin: 0 26px 0 30px;
                    height: 48px;
                    cursor: pointer;
                    &:hover{
                        background: url('@/assets/images/sprite.png') no-repeat;
                        background-position: -72px -472px;
                    }
                }
                .aos{
                    display: block;
                    width: 42px;
                    height: 48px;
                    cursor: pointer;
                    &:hover{
                        background: url('@/assets/images/sprite.png') no-repeat;
                        background-position: -158px -472px;
                    }
                }
            }
        }
        p{
            color: #999;
        }
    }
    .wiki-edit{
        margin-bottom: 5px;
        display: block;
        margin-left: -4px;
        line-height: 12px;
        color: #333;
        .img{
            vertical-align: middle;
        }
        span{
            vertical-align: middle;
        }
    }
}
</style>