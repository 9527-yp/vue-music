<template>
    <div class="home-play-box">
        <div class="home-play">
            <div class="play-hd">
                <h3>
                    <span class="text">全部</span>
                    <span class="classify icn" @click="sltlyrShow = !sltlyrShow">
                        <i class="icn">
                            选择分类
                            <em></em>
                        </i>
                    </span>
                </h3>
                <div class="hot-btn">
                    <span class="text-hov">热门</span>
                </div>
            </div>
            <div class="n-sltlyr" v-show="sltlyrShow">
                <div class="hd">
                    <i class="icn"></i>
                </div>
                <div class="bd">
                    <h3>
                        <span class="all-btn text-hov">全部风格</span>
                    </h3>
                    <dl v-for="(item, index) in playCatList" :key="index">
                        <dt>
                            <i v-if="item.title === '语种'" class="label-icn species-icn"></i>
                            <i v-if="item.title === '风格'" class="label-icn style-icn"></i>
                            <i v-if="item.title === '场景'" class="label-icn map-icn"></i>
                            <i v-if="item.title === '情感'" class="label-icn emotion-icn"></i>
                            <i v-if="item.title === '主题'" class="label-icn theme-icn"></i>
                            {{item.title}}
                        </dt>
                        <dd :class="{'last-dd' : index === playCatList.length-1}">
                            <template v-for="(key, i) in item.list" :key="i">
                                <span class="text text-hov">{{key.name}}</span>
                                <span class="line">|</span>
                            </template>
                        </dd>
                    </dl>
                </div>
                <div class="ft"></div>
            </div>
            <ul class="playList-ul">
                <template v-for="(item, index) in songListInfo.list" :key="index">
                    <SongItem :item="item" :type="2" />
                </template>
            </ul>
            <!-- 底部分页 -->
            <Page
                v-if="songListInfo.totalCount > songListInfo.limit"
                :total="songListInfo.totalCount"
                :pageSize="songListInfo.limit"
                :page="songListInfo.offset"
                @changePage="changePage"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { catlist, songList } from '@/api/home-playList.ts';
import type { ResponseType } from '@/types/index';
import Page from '@/components/page/Page.vue';
import { getBigNumberTransform } from '@/utils/utils.ts';
import SongItem from '@/components/song-item/SongItem.vue';

type MenuItem = {
    title: string,
    list: {
        name: string,
        category: number
    }[]
}

const sltlyrShow = ref(false);
const playCatList = reactive<MenuItem[]>([
    {
        title: '',
        list: []
    },
    {
        title: '',
        list: []
    },
    {
        title: '',
        list: []
    },
    {
        title: '',
        list: []
    },
    {
        title: '',
        list: []
    },
])
function getCatlist() {
    catlist().then((res: ResponseType) => {
        if(res.code === 200) {
            for(let value in res?.categories){
                playCatList[value].title = res?.categories[value]
            }

            res?.sub.forEach((item: {category: number, name: string}) => {
                if(item.category === 0) {
                    playCatList[0].list.push(item);
                }
                if(item.category === 1) {
                    playCatList[1].list.push(item);
                }
                if(item.category === 2) {
                    playCatList[2].list.push(item);
                }
                if(item.category === 3) {
                    playCatList[3].list.push(item);
                }
                if(item.category === 4) {
                    playCatList[4].list.push(item);
                }
            })
        }
    })
}
getCatlist();


// 评论数据
const songListInfo = reactive({
    cat: '全部',
    offset: 1,
    limit: 35,
    totalCount: 0,
    list: []
})
function getsongList() {
    songList({
        cat: songListInfo.cat,
        offset: (songListInfo.offset - 1) * songListInfo.limit,
        limit: songListInfo.limit
    }).then((res: ResponseType) => {
        if(res.code === 200) {
            res?.playlists.forEach((item: {playCount: number, playCountStr: string}) => {
                item.playCountStr = getBigNumberTransform(item.playCount)
            })
            songListInfo.list = res?.playlists
            songListInfo.totalCount = res?.total
        }
    })
}
getsongList();

function changePage(value: number) {
    songListInfo.offset = value;
    getsongList();
}
</script>


<style lang="scss" scoped>
.home-play-box{
    width: 980px;
    min-height: 700px;
    margin: 0 auto;
    background-color: #fff;
    border: 1px solid #d3d3d3;
    border-width: 0 1px;
    .home-play{
        padding: 40px;
        position: relative;
        .play-hd{
            height: 40px;
            border-bottom: 2px solid #c20c0c;
            h3{
                float: left;
                font-size: 24px;
                font-weight: normal;
                .text{
                    font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
                }
                .icn{
                    display: inline-block;
                    height: 31px;
                    line-height: 31px;
                    overflow: hidden;
                    vertical-align: top;
                    text-align: center;
                    cursor: pointer;
                    background: url('@/assets/images/home/side/button2.png') no-repeat;
                }
                .classify{
                    font-size: 12px;
                    font-weight: normal;
                    margin: 2px 0 0 12px;
                    color: #333;
                    background-position: right -100px;
                    padding: 0 5px 0 0;
                    i{
                        color: #0c73c2 !important;
                        padding: 0 10px 0 15px;
                        background-position: 0 -59px;
                        em{
                            margin-left: 5px;
                            width: 8px;
                            height: 5px;
                            background: url('@/assets/images/icon.png') no-repeat;
                            background-position: -70px -543px;
                            display: inline-block;
                            vertical-align: middle;
                        }
                    }
                    &:hover{
                        background-position: right -182px;
                        i{
                            background-position: 0 -141px;
                        }
                    }
                }
            }
            .hot-btn{
                float: right;
                height: 29px;
                background: url('@/assets/images/my-music/button.png') no-repeat;
                background-position: 0 0;
                border-radius: 3px;
                span{
                    float: left;
                    width: 46px;
                    height: 29px;
                    line-height: 29px;
                    text-align: center;
                    color: #fff;
                    cursor: pointer;
                }
            }
        }
        .n-sltlyr{
            position: absolute;
            top: 75px;
            left: 0;
            z-index: 5;
            width: 720px;
            .hd{
                height: 32px;
                background: url('@/assets/images/play-list/sltlyr.png') no-repeat;
                .icn{
                    position: absolute;
                    top: 2px;
                    left: 132px;
                    display: inline-block;
                    width: 24px;
                    height: 11px;
                    background: url('@/assets/images/play/iconall.png') no-repeat;
                    background-position: -48px 0;
                    vertical-align: middle;
                }
            }
            .bd{
                width: 700px;
                padding: 0 10px;
                background: url('@/assets/images/play-list/sltlyr.png') no-repeat;
                background-position: -720px 0;
                background-repeat: repeat-y;
                h3{
                    height: 37px;
                    padding-left: 26px;
                    border-bottom: 1px solid #e6e6e6;
                    font-weight: normal;
                    font-size: 100%;
                    .all-btn{
                        display: inline-block;
                        width: 75px;
                        height: 26px;
                        background: url('@/assets/images/my-music/button.png') no-repeat;
                        background-position: 0 -64px;
                        text-align: center;
                        line-height: 26px;
                        color: #333;
                        cursor: pointer;
                        &:hover{
                            color: #000;
                        }
                    }
                }
                dl{
                    dt{
                        float: left;
                        width: 70px;
                        margin: 0 -100px 0 26px;
                        padding-top: 15px;
                        border-right: 1px solid #e6e6e6;
                        font-weight: bold;
                        .label-icn{
                            margin-right: 8px;
                            margin-bottom: 4px;
                            width: 24px;
                            height: 24px;
                            background: url('@/assets/images/icon.png') no-repeat;
                            display: inline-block;
                            vertical-align: middle;
                        }
                        .species-icn{
                            width: 23px;
                            height: 23px;
                            background-position: -20px -735px;
                        }
                        .style-icn{
                            background-position: 0 -60px;
                        }
                        .map-icn{
                            background-position: 0 -88px;
                        }
                        .emotion-icn{
                            background-position: 0 -117px;
                        }
                        .theme-icn{
                            background-position: 0 -141px;
                        }
                    }
                    dd{
                        margin-left: 96px;
                        padding: 16px 15px 0 15px;
                        border-left: 1px solid #e6e6e6;
                        line-height: 24px;
                        .text{
                            white-space: nowrap;
                            color: #333;
                            cursor: pointer;
                            &:hover{
                                color: #000;
                            }
                        }
                        .line{
                            margin: 0 8px 0 10px;
                            color: #d8d8d8;
                        }
                    }
                    .last-dd{
                        padding-bottom: 25px;
                    }
                    &:after{
                        clear: both;
                        content: '.';
                        display: block;
                        height: 0;
                        visibility: hidden;
                    }
                }
            }
            .ft{
                height: 20px;
                background: url('@/assets/images/play-list/sltlyr.png') no-repeat;
                background-position: -1440px -12px;
            }
        }
        .playList-ul{
            margin: 30px 0 0 -50px;
            &:after{
                clear: both;
                content: '.';
                display: block;
                height: 0;
                visibility: hidden;
            }
        }
    }
}
</style>