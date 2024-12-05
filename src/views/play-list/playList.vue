<template>
<div class="playList-box">
    <div class="my-playList">
        <div class="my-song">
            <div class="m-song-info">
                <div class="song-box playList-table">
                    <!-- 歌单详情 -->
                    <SongSheetInfo
                      :playlist="songSheetDetail.playlist"
                      :privileges="songSheetDetail.privileges"
                      @jumpToComment="jumpToComment"
                      @notFeatureTip="notFeatureTip"
                      @collectPlayList="collect"
                    />
                    <div class="song-list-box">
                        <h3 class="title">歌曲列表</h3>
                        <span class="song-num">{{songSheetDetail?.playlist?.trackCount}}首歌</span>
                        <div class="more">
                            播放：<i class="num">{{songSheetDetail?.playlist?.playCount}}</i>次
                        </div>
                        <div class="out" @click="generatePlayer">
                            <i class="out-icn"></i>
                            <span class="out-text">生成外链播放器</span>
                        </div>
                    </div>
                    <!-- 歌曲列表Table -->
                    <SongListTable
                      v-if="songSheetDetail.privileges.length > 0"
                      :playlist="songSheetDetail.playlist"
                      :privileges="songSheetDetail.privileges"
                      @delSong="delSong"
                      @notFeatureTip="notFeatureTip"
                    />
                    <div v-else class="n-nmusic">
                        <div class="not-title">
                            <i class="icn"></i>
                            <h3 class="text">暂无音乐！</h3>
                        </div>
                    </div>
                    <!-- 评论 -->
                    <Comment
                      class="playList-comment"
                      :commentInfo="commentInfo" 
                      @publishComment="publishComment"
                    />
                    <!-- 底部分页 -->
                    <Page
                      v-if="commentInfo.totalCount > commentInfo.limit"
                      :total="commentInfo.totalCount"
                      :pageSize="commentInfo.limit"
                      :page="commentInfo.offset"
                      @changePage="changePage"
                    />
                </div>
            </div>
        </div>
        <div class="playList-container">
            <div class="container">
                <div v-if="songSheetDetail?.playlist?.subscribers && songSheetDetail?.playlist?.subscribers.length > 0">
                    <h3 class="header">
                        <span>喜欢这个歌单的人</span>
                    </h3>
                    <ul class="like-song-list">
                        <li class="like-item" v-for="item in songSheetDetail?.playlist?.subscribers" :key="item.userId">
                            <img :src="item.avatarUrl" :title="item.nickname" @click="toUserHome(item.userId)" alt="">
                        </li>
                    </ul>
                </div>
                <h3 class="header">
                    <span>相关推荐</span>
                </h3>
                <ul class="recommend-ul">
                    <li class="item" v-for="item in playSheet" :key="item.id">
                        <div class="song-img" :title="item.name" @click="toPlayList(item.id)">
                            <img :src="item.coverImgUrl" alt="">
                        </div>
                        <div class="info">
                            <p class="thide">
                                <span class="song-name text-hov" @click="toPlayList(item.id)">{{item.name}}</span>
                            </p>
                            <p>
                                <span class="by">by</span>
                                <span class="nm thide text-hov" :title="item.subscribers[0].nickname" @click="toUserHome(item.userId)">{{item.subscribers[0].nickname}}</span>
                            </p>
                        </div>
                    </li>
                </ul>
                <SideMulti />
            </div>
        </div>
        <!-- 删除歌曲弹框 -->
        <Dialog 
        :visible="playerDialog"
        showCustomButton
        @cancel='playerCancel'
        >
            <p class="content-text">由于版权保护，无法生成外链。</p>
        </Dialog>
    </div>
</div>
</template>

<script setup lang="ts">
import { reactive, ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useDialogStore from '@/stores/modules/dialog.ts';
import useUserStore from '@/stores/modules/user.ts';
import type { ResponseType } from '@/types/index';
import { getSongSheetInfo } from '@/api/my-music.ts';
import { getSongComment } from '@/api/comment.ts';
import { getPlayList, collectPlayList } from '@/api/song-list.ts';
import Dialog from '@/components/dialog/dialog.vue';
import Page from '@/components/page/Page.vue';
import SongSheetInfo from '@/views/my-music/components/SongSheeInfo.vue';
import SongListTable from '@/views/my-music/components/SongListTable.vue';
import SideMulti from '@/components/side-info/Side-Multi.vue';
import Comment from '@/components/comment/Comment.vue';
import { handleCommentList } from '@/components/comment/handleCommentList.ts';

const route = useRoute();
const router = useRouter();
const dialogStore = useDialogStore();
const userStore = useUserStore();

type TypeSongSheetDetail = {
    playlist: {
        coverImgUrl?: string,
        name?: string,
        id?: number,
        playCount?: number,
        trackCount?: number,
        subscribed?: boolean,
        subscribedCount?: number,
        tracks?: {
            id: number;
        }[];
    },
    privileges: {
        id: number;
    }[];
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

watch(() => route.query.id, () => {
    getSongInfo();
    getRecommend();
    getSongCommentList();
})

const songSheetDetail = reactive<TypeSongSheetDetail>({
    playlist: {},
    privileges: []
})
// 歌单详情
function getSongInfo() {
    getSongSheetInfo({id: route.query.id }).then((res: ResponseType) => {
        if(res.code === 200) {
            console.log(res, 'res')
            if(res?.playlist?.name.includes('喜欢的音乐')){
                res.playlist.name = '我喜欢的音乐';
            }

            songSheetDetail.playlist = res?.playlist ?? {};
            songSheetDetail.playlist.tracks = res?.playlist?.tracks.slice(0, 20);
            songSheetDetail.privileges = res.privileges ?? [];
        }
    })
}
getSongInfo();

const playListInfo = reactive({
    order: 'hot',
    cat: '全部',
    limit: 5,
    offset: 0
});
const playSheet = ref([]);
function getRecommend() {
    getPlayList(playListInfo).then((res: ResponseType) => {
        if(res.code === 200) {
            playSheet.value = res.playlists ?? []
        }
    })
}
getRecommend();

// 评论数据
const commentInfo = reactive({
    id: null,
    type: 2,
    offset: 1,
    limit: 20,
    totalCount: 0,
    hotCommentList: [], // 热门评论
    newCommentList: [] // 最新评论
})
function getSongCommentList() {
    commentInfo.id = Number(route.query.id);
    
    const params = {
        id: route.query.id,
        offset: (commentInfo.offset - 1) * commentInfo.limit,
        limit: commentInfo.limit
    }
    getSongComment(params).then((res: ResponseType) => {
        const result = handleCommentList(res)
        commentInfo.hotCommentList = result?.hotComments ?? []
        
        commentInfo.newCommentList = result?.comments ?? []
        
        commentInfo.totalCount = result?.total ?? 0
    })
}
getSongCommentList();

// 分页点击获取当前页评论
function changePage(value: number) {
    commentInfo.offset = value;
    jumpToComment();
    getSongCommentList();
}

// 评论操作
async function publishComment() {
    // 需先调详情接口，评论数据才获取最新的数据
    await getSongSheetInfo({id: route.query.id});
    getSongCommentList();
}

// 功能暂未开发提示
const warningInfo = reactive({
    time: null
})

// 生成外链播放器
const playerDialog = ref(false);
function generatePlayer() {
    playerDialog.value = true;
}

// 关闭弹框
function playerCancel() {
    playerDialog.value = false;
}


function notFeatureTip() {
    dialogStore.setMessage({
        type: 0,
        text: '功能暂未开发',
        visible: true,
    })
    warningInfo.time && clearTimeout( warningInfo.time);
    warningInfo.time = setTimeout(() => {
        dialogStore.setMessage({
            type: 0,
            text: '功能暂未开发',
            visible: false,
        })
    }, 1500);
}


// 滚动到评论位置
function jumpToComment() {
    const commentDom = document.querySelector(
        '.song-sheet-review'
    ) as HTMLDivElement;
    const myMusic = document.querySelector('.my-song') as HTMLDivElement;
    window.scrollTo(0, Number(commentDom.offsetTop) - 20);
}

// 收藏歌单
function collect() {
    collectPlayList({
        t: 1,
        id:songSheetDetail.playlist.id
    }).then((res: ResponseType) => {
        if(res.code === 200) {
            songSheetDetail.playlist.subscribed = true
            songSheetDetail.playlist.subscribedCount = songSheetDetail.playlist.subscribedCount + 1
            dialogStore.setMessage({
                type: 1,
                text: '收藏成功',
                visible: true,
            })
            warningInfo.time && clearTimeout( warningInfo.time);
            warningInfo.time = setTimeout(() => {
                dialogStore.setMessage({
                    type: 0,
                    text: '',
                    visible: false,
                })
            }, 1500);
        }
    })
}

function delSong() {
    getSongInfo()
}

onMounted(() => {
    userStore.setMenuIndex(0);
    userStore.setSubMenuIndex(-1);
});

</script>

<style lang="scss" scoped>
.playList-box{
    // overflow-x: hidden;
    // overflow-y: scroll;
    // position: relative;
    // height: calc(100vh - 75px);
}
.n-nmusic{
    padding: 105px 0 105px 0;
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
}
.my-playList{
    width: 980px;
    min-height: 700px;
    margin: 0 auto;
    background-color: #fff;
    border: 1px solid #d3d3d3;
    border-width: 0 1px;
    background: url('@/assets/images/play-list/wrap4.png');
    .my-song{
        float: left;
        width: 100%;
        margin-right: -270px;
        .m-song-info{
            margin-right: 271px;
            .song-box{
                padding: 47px 30px 40px 39px;
                .song-list-box{
                    width: 100%;
                    height: 35px;
                    border-bottom: 2px solid #c20c0c;
                    box-sizing: border-box;
                    padding: 0 10px 0 32px;
                    margin-top: 27px;
                    .title{
                        font-size: 20px;
                        line-height: 28px;
                        float: left;
                        font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
                        font-weight: normal;
                    }
                    .song-num{
                        margin: 9px 0 0 20px;
                        float: left;
                        color: #666;
                    }
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
                    .more{
                        margin-top: 5px;
                        float: right;
                        color: #666;
                        .num{
                            color: #c20c0c;
                        }
                    }
                }
            }
        }
    }
    .playList-container{
        position: relative;
        float: right;
        width: 270px;
        .container{
            padding: 20px 40px 40px 30px;
            .header{
                position: relative;
                height: 23px;
                margin-bottom: 20px;
                border-bottom: 1px solid #ccc;
                color: #333;
                font-size: 100%;
            }
            .like-song-list{
                margin-left: -13px;
                padding-bottom: 25px;
                .like-item{
                    display: inline;
                    padding: 0 0 13px 13px;
                    float: left;
                    width: 40px;
                    height: 40px;
                    cursor: pointer;
                    img{
                        width: 40px;
                        height: 40px;
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