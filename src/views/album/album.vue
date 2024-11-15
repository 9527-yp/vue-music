<template>
    <div class="album-detail">
        <div class="album-content">
            <!-- 专辑基本信息 -->
            <AlbumInfo :albumInfo="albumInfo" />
            <!-- 歌曲列表 -->
            <AlbumTable :id="route.query.id" :list="songList" />
            <!-- 评论 -->
            <Comment
                class="playList-comment"
                :commentInfo="albumCommentInfo" 
                @publishComment="publishComment"
            />
            <!-- 底部分页 -->
            <Page
                v-if="albumCommentInfo.totalCount > albumCommentInfo.limit"
                :total="albumCommentInfo.totalCount"
                :pageSize="albumCommentInfo.limit"
                :page="albumCommentInfo.offset"
                @changePage="changePage"
            />
        </div>
        <div class="album-side">

        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import AlbumInfo from './album-info/AlbumInfo.vue';
import AlbumTable from './album-table/albumTable.vue';
import Comment from '@/components/comment/Comment.vue';
import Page from '@/components/page/Page.vue';
import { getAlbumDetail, getComment } from '@/api/album-detail.ts';
import { handleCommentList } from '@/components/comment/handleCommentList.ts';
import type { ResponseType } from '@/types/index';
import { useRoute } from 'vue-router';


const route = useRoute();

const albumInfo = ref({});
const songList = ref([]);
function albumDetail() {
    getAlbumDetail({id: route.query.id}).then((res: ResponseType) => {
        if(res.code === 200) {
            albumInfo.value = res?.album ?? {};
            songList.value = res?.songs ?? []
        }
    })
}
albumDetail();

// 获取评论
const albumCommentInfo = reactive({
    id: Number(route.query.id),
    type: 3,
    offset: 1,
    limit: 20,
    totalCount: 0,
    hotCommentList: [], // 热门评论
    newCommentList: [] // 最新评论
})
function getCommentList() {
    getComment({
        id: albumCommentInfo.id,
        offset: (albumCommentInfo.offset - 1) * albumCommentInfo.limit,
        limit: albumCommentInfo.limit
    }).then((res: ResponseType) => {
        if(res.code === 200) {
            const result = handleCommentList(res)
            albumCommentInfo.hotCommentList = result?.hotComments ?? []
            
            albumCommentInfo.newCommentList = result?.comments ?? []
            
            albumCommentInfo.totalCount = result?.total ?? 0
        }
    })
}
getCommentList();

// 评论操作
function publishComment() {
    getCommentList();
}

// 评论分页切换
function changePage(value: number) {
    albumCommentInfo.offset = value;
    getCommentList();
}
</script>

<style lang="scss" scoped>
.album-detail{
    width: 980px;
    min-height: 700px;
    margin: 0 auto;
    background-color: #fff;
    border: 1px solid #d3d3d3;
    border-width: 0 1px;
    background: url('@/assets/images/play-list/wrap4.png');
    .album-content{
        display: inline-block;
        width: calc(100% - 271px);
        padding: 47px 30px 40px 39px;
        vertical-align: top;
        box-sizing: border-box;
    }
    .album-side{
        display: inline-block;
        width: 270px;
        vertical-align: top;
    }
}
</style>