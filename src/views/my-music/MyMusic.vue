<template>
    <div class="my-music">
        <div class="music-isLogin" v-if="!isLogin">
            <div class="not-login">
                <div class="pic">
                    <h2>登录网易云音乐</h2>
                    <div class="btn" @click="login">立即登录</div>
                </div>
            </div>
        </div>
        <div v-else class="music-container">
            <div class="music-content">
                <div class="musicsd">
                    <div>
                        <h2 class="my-Singer">我的歌手({{options.mySinger.count}})</h2>
                        <SongList
                         title="创建的歌单"
                         :visible='options.createdSongSheet.visible'
                         :songSheetId="songSheetId"
                         :count="options.createdSongSheet.count"
                         :list="songSheetList.createdSongSheet"
                         @songListItem='songListItemChange'
                        />
                        <SongList
                         title="收藏的歌单"
                         :songSheetId="songSheetId"
                         :visible='options.subSongSheet.visible'
                         :count="options.subSongSheet.count"
                         :list="songSheetList.collectSongSheet"
                         @songListItem='songListItemChange'
                        />
                    </div>
                </div>
                <div class="my-music-main">
                    <div class="song-header">
                        <SongSheetInfo :playlist="songSheetDetail.playlist"/>
                    </div>
                    <div class="song-list-box">
                        <h3 class="title">歌曲列表</h3>
                        <span class="song-num">{{songSheetDetail?.playlist?.trackCount}}首歌</span>
                        <div class="more">
                            播放：<i class="num">{{songSheetDetail?.playlist?.playCount}}</i>次
                        </div>
                    </div>
                    <!-- 歌曲列表Table -->
                    <SongListTable :playlist="songSheetDetail.playlist" :songList="songSheetList.createdSongSheet" @delSong="delSong"/>
                    <!-- 评论 -->
                    <Comment
                      :playlist="songSheetDetail.playlist"
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
    </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive }from 'vue';
import useUserStore from '@/stores/modules/user.ts'
import SongList from './components/SongList.vue'
import SongSheetInfo from './components/SongSheeInfo.vue'
import SongListTable from './components/SongListTable.vue'
import Page from '@/components/page/Page.vue'
import Comment from '@/components/comment/Comment.vue'
import { getSongSubcount, getSongList, getSongSheetInfo } from '@/api/my-music.ts'
import { getSongComment } from '@/api/comment.ts'
import type { ResponseType } from '@/types/index';
import { handleCommentList } from '@/components/comment/handleCommentList.ts'
import type { SongSheetList, TypeSongSheet, SongSheetDetail} from './types/type.ts'

const userStore = useUserStore();
const isLogin = computed(() => userStore.getIsLogin)
const userInfo = computed(() => userStore.getUserInfo)

// 登录
function login():void {
  userStore.setLoginDialogShow(true)
}

const options = reactive({
    mySinger: {
        count: 0,
        visible: false,
    },
    myVideo: {
        count: 0,
        visible: false,
    },
    createdSongSheet: {
        visible: true,
        count: 0,
    },
    subSongSheet: {
        visible: false,
        count: 0,
    },
});
function getSongCount() {
    getSongSubcount().then((res: ResponseType) => {
        if(res.code === 200) {
            options.mySinger.count = res.artistCount ?? 0;
            options.myVideo.count = res.mvCount ?? 0;
            options.createdSongSheet.count = res.createdPlaylistCount ?? 0;
            options.subSongSheet.count = res.subPlaylistCount ?? 0;
        }
    })
}
getSongCount()

// 歌单ID
const songSheetId = ref(undefined)
const songSheetList = reactive<TypeSongSheet>({
    createdSongSheet: [],
    collectSongSheet: []
})
function getSongListData ()  {
    getSongList({uid: userInfo.value?.profile?.userId}).then((res: ResponseType) => {
        if(res.code === 200) {
            res.playlist?.forEach?.((item: SongSheetList) => {
                if (item.name?.includes?.('喜欢的音乐')) {
                    item.name = '我喜欢的音乐';
                    songSheetId.value = item.id
                }
            });
            
            // 创建/收藏的歌单
            songSheetList.createdSongSheet = res.playlist?.filter?.(
            (item: SongSheetList) => !item.subscribed
            );
            songSheetList.collectSongSheet = res.playlist?.filter?.(
            (item: SongSheetList) => item.subscribed
            );
            getSongInfo();
            getSongCommentList();
        }
    })
}
getSongListData()

// 切换歌单查看
function songListItemChange(value: number) {
    songSheetId.value = value;
    commentInfo.offset = 1; // 切换歌单重置分页
    getSongInfo();
    getSongCommentList();
}

const songSheetDetail = reactive<SongSheetDetail>({
    playlist: {},
    privileges: []
})
// 歌单详情
function getSongInfo() {
    getSongSheetInfo({id: songSheetId.value}).then((res: ResponseType) => {
        if(res.code === 200) {
            console.log(res, 'res')
            if(res?.playlist?.name.includes('喜欢的音乐')){
                res.playlist.name = '我喜欢的音乐';
            }

            songSheetDetail.playlist = res.playlist ?? {};
            songSheetDetail.privileges = res.privileges ?? [];
        }
    })
}

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
    commentInfo.id = songSheetId.value;
    const params = {
        id: songSheetId.value,
        offset: (commentInfo.offset - 1) * commentInfo.limit,
        limit: commentInfo.limit
    }
    getSongComment(params).then((res: ResponseType) => {
        const result = handleCommentList(res)
        console.log(result, 'resultresultresult')
        commentInfo.hotCommentList = result?.hotComments ?? []
        
        commentInfo.newCommentList = result?.comments ?? []
        
        commentInfo.totalCount = result?.total ?? 0
    })
}

// 分页点击获取当前页评论
function changePage(value: number) {
    commentInfo.offset = value;
    getSongCommentList();
}

// 评论操作
async function publishComment() {
    // 需先调详情接口，评论数据才获取最新的数据
    await getSongSheetInfo({id: songSheetId.value});
    getSongCommentList();
}

function delSong() {
    getSongInfo()
}
</script>

<style lang="scss" scoped>
.my-music{
    width: 100%;
    height: 100%;
    .music-isLogin{
        width: 980px;
        min-height: 700px;
        margin: 0 auto;
        background-color: #fff;
        border: 1px solid #d3d3d3;
        border-width: 0 1px;
    }
}
.not-login{
    width: 807px;
    height: 268px;
    margin: 0 auto 0;
    padding-top: 104px;
    background: url('@/assets/images/my-music/mymusic.png') no-repeat 0 9999px;
    background-position: 0 104px;
    .pic{
        h2{
            height: 100px;
            text-indent: -9999px;
        }
        .btn{
            width: 167px;
            height: 45px;
            margin: 102px 0 0 482px;
            background: url('@/assets/images/my-music/mymusic.png') no-repeat 0 9999px;
            background-position: 0 9999px;
            text-indent: -9999px;
            cursor: pointer;
        }
    }
}
.music-container{
    overflow-x: hidden;
    overflow-y: scroll;
    position: relative;
    zoom: 1;
    height: calc(100vh - 75px);
    .music-content{
        min-height: calc(100vh - 75px);
        width: 980px;
        margin: 0 auto;
        border: 1px solid #d3d3d3;
        border-width: 0 1px;
        background: url('@/assets/images/my-music/wrap3.png') repeat-y center 0;
        .musicsd{
            height: calc(100vh - 95px);
            float: left;
            position: fixed;
            box-sizing: border-box;
            overflow-y: auto;
            overflow-x: hidden;
            padding-bottom: 50px;
            padding-top: 40px;
            width: 240px;
            zoom: 1;
            .my-Singer{
                position: relative;
                height: 36px;
                line-height: 36px;
                padding: 0 5px 2px 35px;
                color: #000;
                font-size: 14px;
                cursor: pointer;
                font-family: simsun, \5b8b\4f53;
            }
        }
        .my-music-main{
            height: 100%;
            float: right;
            width: 740px;
            padding-bottom: 50px;
            position: relative;
            zoom: 1;
            .song-list-box{
                width: 100%;
                height: 35px;
                border-bottom: 2px solid #c20c0c;
                box-sizing: border-box;
                padding: 0 10px 0 32px;
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
        &:after{
            clear: both;
            content: '.';
            display: block;
            height: 0;
            visibility: hidden;
        }
    
    }
}
.musicsd::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 10px;
    -webkit-box-shadow: inset 1px 1px 0 rgba(0, 0, 0, .1);
}
.musicsd::-webkit-scrollbar-track {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
}
.musicsd::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}
</style>