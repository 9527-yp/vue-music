<template>
    <div class="home-toplist">
        <div class="toplist-menu">
            <ToplistMenu :id="Number(route.query.id)" :hotList="hotList" :common="common" @toHomeToplist="toHomeToplist" />
        </div>
        <div class="toplist-content">
            <div class="song-info">
                <ToplistInfo 
                    :playlist="songSheetDetail.playlist" 
                    :privileges="songSheetDetail.privileges"
                    @jumpToComment="jumpToComment"
                    @notFeatureTip="notFeatureTip"
                />
            </div>
            <div class="song-table">
                <div class="song-list-box">
                    <h3 class="title">歌曲列表</h3>
                    <span class="song-num">{{songSheetDetail?.playlist?.trackCount}}首歌</span>
                    <div class="more">
                        播放：<i class="num">{{songSheetDetail?.playlist?.playCount}}</i>次
                    </div>
                </div>
                <div class="table-box">
                    <Loading v-if="songSheetDetail.loading" />
                    <ToplistTable
                        v-else
                        :playlist="songSheetDetail.playlist"
                        :privileges="songSheetDetail.privileges"
                        @notFeatureTip="notFeatureTip"
                    />
                </div>
                <!-- 评论 -->
                <Comment
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
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { topList, playlistDetail } from '@/api/home.ts';
import { getSongComment } from '@/api/comment.ts';
import type { ResponseType } from '@/types/index';
import ToplistMenu from './toplist-menu/ToplistMenu.vue';
import ToplistInfo from './toplist-info/ToplistInfo.vue';
import ToplistTable from './toplist-table/ToplistTable.vue';
import Page from '@/components/page/Page.vue';
import Comment from '@/components/comment/Comment.vue';
import Loading from '@/components/loading/Loading.vue';
import useDialogStore from '@/stores/modules/dialog.ts';
import { handleCommentList } from '@/components/comment/handleCommentList.ts';

const dialogStore = useDialogStore();
const router = useRouter();
const route = useRoute();

const hotList = ref([]);
const common = ref([]);
function getToplist() {
    return topList().then((res: ResponseType) => {
        if(res.code === 200) {
            hotList.value = res?.list.slice(0, 4) ?? [];
            common.value = res?.list.slice(4) ?? [];
        }
    })
}

type TypeSongSheetDetail = {
    loading: boolean,
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
    loading: false,
    playlist: {},
    privileges: []
})
function getPlaylistDetail() {
    songSheetDetail.loading = true;
    playlistDetail({id: route.query.id}).then((res: ResponseType) => {
        if(res.code === 200) {
            songSheetDetail.loading = false;
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

// 评论操作
async function publishComment() {
    // 需先调详情接口，评论数据才获取最新的数据
    await playlistDetail({id: route.query.id});
    getSongCommentList();
}

// 分页点击获取当前页评论
function changePage(value: number) {
    commentInfo.offset = value;
    getSongCommentList();
}

let timer = null;
function notFeatureTip(value: {type: number, text: string}) {
    dialogStore.setMessage({
        type: value.type,
        text: value.text,
        visible: true,
    })
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
        dialogStore.setMessage({
            type: value.type,
            text: value.text,
            visible: false,
        })
    }, 1500);
}

// 评论滚动对应位置
function jumpToComment() {
    const commentDom = document.querySelector(
        '.song-sheet-review'
    ) as HTMLDivElement;
    window?.scrollTo(0, Number(commentDom.offsetTop) - 20);
}

function toHomeToplist(id: number) {
    router.push({
        path: '/home-toplist',
        query: {
            id
        }
    })

    getPlaylistDetail();
    getSongCommentList();
}

watch(() => route, async () => {
    if(route.path !== '/home-toplist'){
        return ;
    }

    await getToplist();
    if(!route.query.id){
        router.push({
            path: 'home-toplist',
            query: {
                id: hotList.value[0].id
            }
        })
        return ;
    }

    getPlaylistDetail();
    getSongCommentList();
},{
    immediate: true,
    deep: true
})
</script>


<style lang="scss" scoped>
.home-toplist{
    width: 980px;
    min-height: 700px;
    margin: 0 auto;
    background-color: #fff;
    border: 1px solid #d3d3d3;
    border-width: 0 1px;
    background: url('@/assets/images/my-music/wrap3.png') repeat-y center 0;
    .toplist-menu{
        position: relative;
        display: inline-block;
        width: 239px;
        vertical-align: top;
    }
    .toplist-content{
        position: relative;
        display: inline-block;
        width: 740px;
        vertical-align: top;
        .song-info{
            padding: 40px;
            &:after{
                clear: both;
                content: '.';
                display: block;
                height: 0;
                visibility: hidden;
            }
        }
        .song-table{
            padding: 0 30px 40px 40px;
            .song-list-box{
                width: 100%;
                height: 35px;
                border-bottom: 2px solid #c20c0c;
                box-sizing: border-box;
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
                        font-weight: 500;
                    }
                }
            }
        }
    }
}
</style>