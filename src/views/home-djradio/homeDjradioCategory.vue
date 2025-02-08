<template>
    <div class="djradio-category">
        <CateList :djList="djList" />
        <div class="new-radio">
            <div class="u-title">
                <h3>
                    <span class="text-hov">优秀新电台</span>
                </h3>
                <!-- <span class="more text-hov">更多 ></span> -->
            </div>
            <ul class="m-rdilist">
                <li class="item" :class="{'last-item': index === 4}" v-for="(item, index) in djradioList" :key="index">
                    <div class="u-cover" @click="toRadioDetail(item.id)">
                        <img :src="`${item.picUrl}?param=200y200`" alt="">
                    </div>
                    <h3>
                        <span class="text-hov" :title="item.name" @click="toRadioDetail(item.id)">{{ item.name }}</span>
                    </h3>
                    <p class="thide2">{{ item.rcmdtext }}</p>
                </li>
            </ul>
        </div>
        <div class="all-radio">
            <div class="u-title">
                <h3>
                    <span class="text-hov">电台排行榜</span>
                </h3>
                <span class="more tab">
                    <span class="text-hov" :class="{'active': rankingType === 'new'}" @click="tabBtn('new')">上升最快</span>
                    <span class="line">|</span>
                    <span class="text-hov" :class="{'active': rankingType === 'hot'}" @click="tabBtn('hot')">最热电台</span>
                </span>
            </div>
            <ul class="radio-list">
                <li class="item" :class="{'item-r': index % 2 !== 0}" v-for="(item, index) in radioDataList" :key="index">
                    <div class="u-cover" @click="toRadioDetail(item.id)">
                        <img :src="`${item.picUrl}?param=200y200`" alt="">
                    </div>
                    <div class="item-cnt">
                        <h3><span class="text-hov" :title="item?.name" @click="toRadioDetail(item.id)">{{ item?.name }}</span></h3>
                        <p class="note">
                            <i class="u-icn"></i>
                            <span class="u-name text-hov" :title="item?.dj?.nickname" @click="toUserHome(item?.dj?.userId)">{{ item?.dj?.nickname }}</span>
                            <img class="u-atc" :src="item?.dj?.avatarDetail?.identityIconUrl" alt="">
                        </p>
                        <p class="sub">共{{ item?.programCount }}期&nbsp;&nbsp;&nbsp;&nbsp;订阅{{ item?.subCount }}次</p>
                    </div>
                </li>
            </ul>
        </div>
        <!-- 底部分页 -->
        <Page
            v-if="radioInfo.totalCount > radioInfo.limit"
            :total="radioInfo.totalCount"
            :pageSize="radioInfo.limit"
            :page="radioInfo.offset"
            @changePage="changePage"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CateList from './cate-list/CateList.vue';
import Page from '@/components/page/Page.vue';
import { djCateList, recommendType, radiolist } from '@/api/home.ts';
import type { ResponseType } from '@/types/index';

const router = useRouter();
const route = useRoute();

const djList = ref([]);
function getDjList() {
    djCateList().then((res: ResponseType) => {
        if(res.code === 200) {
            djList.value = res?.categories ?? []
        }
    })
}
getDjList();

const djradioList = ref([]);
function recommendData() {
    recommendType({
        type: route.query.id
    }).then((res: ResponseType) => {
        if(res.code === 200) {
           djradioList.value = res.djRadios.slice(0,5)
        }
    })
}
recommendData();

function toRadioDetail(id: number) {
    router.push({
        path: '/radio-detail',
        query: {
            id
        }
    })
}

function toUserHome(id: number) {
    router.push({
        path: '/user/home',
        query: {
            id
        }
    })
}

const rankingType = ref('hot');
const radioInfo = reactive({
    totalCount: 0,
    limit: 20,
    offset: 1
})
const radioDataList = ref([]); 
function tabBtn(value: string) {
    if(rankingType.value === value){
        return;
    }
    rankingType.value = value;
}

function getRadiolist() {
    radiolist({
        cateId: route.query.id,
        limit: radioInfo.limit,
        offset: (radioInfo.offset - 1) * radioInfo.limit,
    }).then((res: ResponseType) => {
        if(res.code === 200) {
            radioDataList.value = res?.djRadios;
            radioInfo.totalCount = res.count;
        }
    })
}
getRadiolist();

function changePage(val: number) {
    radioInfo.offset = val;
    const commentDom = document.querySelector(
        '.all-radio'
    ) as HTMLDivElement;
    window?.scrollTo(0, Number(commentDom.offsetTop) - 50);
    getRadiolist();
}

</script>


<style lang="scss" scoped>
.djradio-category{
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
        .tab{
            margin: 12px 0 0 20px;
            .active{
                color: #c20c0c;
            }
            .line{
                margin: 0 10px;
                color: #c7c7c7;
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
    .new-radio{
        margin-top: 10px;
        .m-rdilist{
            margin-top: 16px;
            display: flex;
            .item{
                width: 150px;
                margin-right: 37px;
                .u-cover{
                    width: 150px;
                    height: 150px;
                    cursor: pointer;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
                h3{
                    margin: 13px 0 6px;
                    line-height: 16px;
                    font-size: 14px;
                    font-weight: normal;
                    color: #333;
                    &:hover{
                        color: #000;
                    }
                }
                p{
                    line-height: 18px;
                    color: #999;
                }
            }
            .last-item{
                margin-right: 0px;
            }
        }
    }
    .all-radio{
        margin-top: 35px;
        .radio-list{
            display: flex;
            flex-wrap: wrap;
            .item{
                width: 435px;
                height: 120px;
                margin-right: 28px;
                padding: 20px 0;
                border-bottom: 1px solid #e7e7e7;
                display: flex;
                .u-cover{
                    width: 120px;
                    height: 120px;
                    cursor: pointer;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
                .item-cnt{
                    margin-left: 20px;
                    h3{
                        height: 64px;
                        margin: 0;
                        line-height: 64px;
                        font-size: 18px;
                    }
                    .note{
                        margin-bottom: 6px;
                        line-height: 20px;
                        .u-icn{
                            width: 14px;
                            height: 15px;
                            background: url('@/assets/images/icon.png') no-repeat;
                            background-position: -50px -300px;
                            display: inline-block;
                            overflow: hidden;
                            vertical-align: middle;
                        }
                        .u-name{
                            margin-left: 8px;
                            vertical-align: middle;
                        }
                        .u-atc{
                            height: 13px;
                            width: 13px;
                            margin-left: 3px;
                            display: inline-block;
                            vertical-align: middle;
                        }
                    }
                    .sub{
                        color: #999;
                    }
                }
            }
            .item-r{
                margin-right: 0px;
            }
        }
    }
}
</style>