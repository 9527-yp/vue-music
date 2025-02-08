<template>
    <div class="djradio">
        <CateList :djList="djList" />
        <div class="rditop">
            <!-- 推荐节目 -->
            <RecommendList />
            <!-- 节目排行榜 -->
            <RankingList />
        </div>
        <div class="rdimore" v-for="itemType in djradioType" :key="itemType.type">
            <div class="u-title">
                <h3>
                    <span class="text-hov">{{ itemType.title }}</span>
                    <span class="radiu">·</span>
                    电台
                </h3>
                <span class="more text-hov" @click="toHomeDjradioCategory(itemType.type)">更多 ></span>
            </div>
            <ul class="rdilist">
                <li class="item" :class="{'borbot': index > 1}" v-for="(item, index) in itemType?.list">
                    <div class="u-cover" @click="toRadioDetail(item.id)">
                        <img :src="`${item?.intervenePicUrl}?param=200y200`" alt="">
                    </div>
                    <div class="cnt">
                        <h3>
                            <span class="text text-hov" :title="item?.name" @click="toRadioDetail(item.id)">{{ item?.name }}</span>
                        </h3>
                        <p class="note">{{ item?.rcmdtext }}</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { djCateList, recommendType } from '@/api/home.ts';
import type { ResponseType } from '@/types/index';
import CateList from './cate-list/CateList.vue';
import RecommendList from './recommend-list/RecommendList.vue';
import RankingList from './ranking-list/RankingList.vue';

const router = useRouter();
const djList = ref([]);
function getDjList() {
    djCateList().then((res: ResponseType) => {
        if(res.code === 200) {
            djList.value = res?.categories ?? []
        }
    })
}

getDjList();

type djradioTypeItem = {
    type: number,
    title: string,
    list: {
        id?: number,
        intervenePicUrl?: string,
        rcmdtext?: string,
        name?: string,
    }[],
}
const djradioType = ref<djradioTypeItem[]>([
    {
        type: 2,
        title: '音乐播客',
        list: [],
    },
    {
        type: 6,
        title: '生活',
        list: [],
    },
    {
        type: 3,
        title: '情感',
        list: [],
    },
    {
        type: 2001,
        title: '创作翻唱',
        list: [],
    },
    {
        type: 11,
        title: '知识',
        list: [],
    },
])
function getType() {
    Promise.allSettled(
        djradioType.value.map(item => recommendType({type: item.type}))
    ).then((res: ResponseType) => {
        console.log(res, 'res')
        res.forEach(item => {
            djradioType.value.forEach(itemType => {
                if(item.value.djRadios[1].categoryId === itemType.type) {
                    itemType.list = item.value.djRadios.slice(0,4)
                }
            })
        })
    })
}
getType();

function toRadioDetail(id: number) {
    router.push({
        path: '/radio-detail',
        query: {
            id
        }
    })
}

function toHomeDjradioCategory(id: number) {
    router.push({
        path: '/home-djradio-category',
        query: {
            id
        }
    })
}

</script>

<style lang="scss" scoped>
.djradio{
    width: 980px;
    min-height: 700px;
    margin: 0 auto;
    background-color: #fff;
    border: 1px solid #d3d3d3;
    border-width: 0 1px;
    padding: 40px;
    box-sizing: border-box;
    
    .u-title{
        height: 40px;
        border-bottom: 2px solid #c20c0c;
        h3{
            float: left;
            font-size: 24px;
            font-weight: normal;
            font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
            color: #333;
            .radiu{
                font-family: simsun, \5b8b\4f53;
            }
        }
        .more{
            float: right;
            color: #666;
            margin-top: 14px;
        }
        &:after{
            clear: both;
            content: '.';
            display: block;
            height: 0;
            visibility: hidden;
        }
    }
    .rditop{
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
    }
    .rdimore{
        margin-top: 35px;
        .rdilist{
            margin-left: -30px;
            .item{
                float: left;
                width: 434px;
                height: 120px;
                margin-left: 30px;
                padding: 20px 0;
                border-bottom: 1px solid #e7e7e7;
                .u-cover{
                    float: left;
                    margin-right: -200px;
                    width: 120px;
                    height: 120px;
                    position: relative;
                    cursor: pointer;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
                .cnt{
                    margin-left: 140px;
                    h3{
                        margin: 16px 0 20px;
                        font-size: 18px;
                        color: #333;
                        .text:hover{
                            color: #000;
                        }
                    }
                    .note{
                        margin-bottom: 6px;
                        line-height: 20px;
                        color: #999;
                    }
                }
            }
            .borbot{
                border-bottom-color: #fff;
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
</style>