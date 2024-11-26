<template>
    <div class="dj-detail">
        <div class="dj-content">
            <!-- header -->
            <DjInfo :djInfo="djInfo" />
            <!-- 电台节目列表 -->
            <div class="table-box" v-if="djInfo?.songs?.length > 0">
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
        <!-- 电台节目右侧 -->
        <DjSide :programList="programList" @toDjDetail="toDjDetail" />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import DjInfo from './dj-info/DjInfo.vue';
import DjTable from './dj-table/DjTable.vue';
import DjSide from './dj-side/DjSide.vue';
import Comment from '@/components/comment/Comment.vue';
import Page from '@/components/page/Page.vue';
import { djDetail, getComment, program } from '@/api/djDetail.ts';
import { useRoute, useRouter } from 'vue-router';
import type { ResponseType } from '@/types/index';
import { handleCommentList } from '@/components/comment/handleCommentList.ts';

const route = useRoute();
const router = useRouter();

type DjInfoType = {
    radio?: {
        id: number
    },
    id: number
}
const djInfo = ref<DjInfoType>({});
function getDjDetail() {
    djDetail({id: route.query.id}).then((res: ResponseType) => {
        if(res.code === 200) {
            djInfo.value = res?.program ?? {};
            getProgram();
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

// 获取更多节目
type ItemType = {
    name: string,
    id: number,
    coverUrl: string,
    radio?: {
        id: number
    }
}
const programList = ref([]);
function getProgram() {
    const id = djInfo.value?.id
    program({rid: djInfo.value?.radio?.id}).then((res: ResponseType) => {
        if(res.code === 200) {
            if(res?.programs.length > 0) {
                programList.value = res?.programs.filter((item: ItemType) => {
                    return item?.id !== id
                })
            }
        }
    })
}

function toDjDetail(id: number) {
    router.push({
        path: '/dj-detail',
        query: {
            id
        }
    })
}

watch(() => route.query.id, () => {
    getDjDetail();
    getSongCommentList();
})
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
}
</style>