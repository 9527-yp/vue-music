<template>
    <div class="dj-detail">
        <div class="dj-content">
            <!-- header -->
            <DjInfo :djInfo="djInfo" />
            <!-- 电台节目列表 -->
            <div class="table-box">
                <DjTable :djInfo="djInfo"/>
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
        <div class="dj-side">
            <span class=""></span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import DjInfo from './dj-info/DjInfo.vue';
import DjTable from './dj-table/DjTable.vue';
import Comment from '@/components/comment/Comment.vue';
import Page from '@/components/page/Page.vue';
import { djDetail, getComment } from '@/api/djDetail.ts';
import { useRoute } from 'vue-router';
import type { ResponseType } from '@/types/index';
import { handleCommentList } from '@/components/comment/handleCommentList.ts';

const route = useRoute();

const djInfo = ref({});
function getDjDetail() {
    djDetail({id: route.query.id}).then((res: ResponseType) => {
        if(res.code === 200) {
            djInfo.value = res?.program ?? {}
        }
    })
}

getDjDetail();


// 评论数据
const commentInfo = reactive({
    id: null,
    type: 4,
    offset: 1,
    limit: 20,
    totalCount: 0,
    hotCommentList: [], // 热门评论
    newCommentList: [] // 最新评论
})
function getSongCommentList() {
    commentInfo.id = Number(route.query.id);
    const params = {
        id: commentInfo.id,
        offset: (commentInfo.offset - 1) * commentInfo.limit,
        limit: commentInfo.limit
    }
    getComment(params).then((res: ResponseType) => {
        commentInfo.totalCount = res.total;
        const result = handleCommentList(res)
        commentInfo.hotCommentList = result?.hotComments ?? []
        
        commentInfo.newCommentList = result?.comments ?? []
        
        commentInfo.totalCount = result?.total ?? 0
    })
}
getSongCommentList();

function publishComment() {
    getSongCommentList();
}

function changePage(val: number) {
    commentInfo.offset = val;
    getSongCommentList();
}
</script>


<style lang="scss" scoped>
.dj-detail{
    width: 980px;
    min-height: 700px;
    margin: 0 auto;
    background-color: #fff;
    border: 1px solid #d3d3d3;
    border-width: 0 1px;
    background: url('@/assets/images/play-list/wrap4.png');
    .dj-content{
        display: inline-block;
        width: calc(100% - 271px);
        padding: 47px 30px 40px 39px;
        vertical-align: top;
        box-sizing: border-box;
        .table-box{
            margin-top: 27px;
        }
    }
    .dj-side{
        display: inline-block;
        width: 270px;
        vertical-align: top;
    }
}
</style>