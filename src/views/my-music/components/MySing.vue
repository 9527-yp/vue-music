<template>
    <div class="my-singer-main">
        <div class="singer-content">
            <div class="singer-header">
                <h3>
                    <span class="singer-title">我的歌手（{{ mySingerInfo?.totalCount }}）</span>
                </h3>
            </div>
            <div class="singer-list">
                <div class="item" v-for="item in mySingerInfo?.singerList" :key="item.id">
                    <div class="singer-img" @click="toSinger(item?.id)">
                        <img :src="`${item?.img1v1Url}?param=80y80`" alt="">
                    </div>
                    <div class="item-right">
                        <h4 class="singer-name text-hov" @click="toSinger(item?.id)">{{ item.name }}</h4>
                        <p class="singer-mv">
                            <span v-if="item?.albumSize">{{ item?.albumSize }}个专辑</span>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <span v-if="item?.mvSize">{{ item?.mvSize }}个MV</span>
                        </p>
                    </div>
                </div>
            </div>
            <!-- 底部分页 -->
            <Page
              v-if="mySingerInfo.totalCount > mySingerInfo.limit"
              :total="mySingerInfo.totalCount"
              :pageSize="mySingerInfo.limit"
              :page="mySingerInfo.offset"
              @changePage="changePage"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import Page from '@/components/page/Page.vue';
import { useRouter } from 'vue-router';

const emit = defineEmits('changePage');
const props = defineProps({
    mySingerInfo: {
        type: Object,
        default: () => {}
    }
})

const router = useRouter();

function changePage(value: number) {
    emit('changePage', value)
}

function toSinger(id: number) {
    router.push({
        path: '/singer',
        query: {
            id
        }
    })
}
</script>

<style lang="scss" scoped>
.my-singer-main{
    height: 100%;
    float: right;
    width: 740px;
    padding-bottom: 50px;
    position: relative;
    zoom: 1;
    .singer-content{
        padding: 40px;
        .singer-header{
            height: 40px;
            border-bottom: 2px solid #c20c0c;
            h3{
                font-size: 24px;
                font-weight: normal;
            }
            .singer-title{
                font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
            }
        }
        .singer-list{
            margin-bottom: 50px;
            .item{
                padding: 10px 0;
                border-bottom: 1px solid #ddd;
                .singer-img{
                    float: left;
                    width: 80px;
                    height: 80px;
                    margin-right: -95px;
                    cursor: pointer;
                    img{
                        width: 80px;
                        height: 80px;
                    }
                }
                .item-right{
                    margin-left: 95px;
                    .singer-name{
                        height: 21px;
                        margin: 10px 0;
                        line-height: 21px;
                        font-size: 16px;
                    }
                    .singer-mv{
                        color: #666;
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
}
</style>