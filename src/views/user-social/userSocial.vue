<template>
    <div class="user-home">
        <div class="user-box">
            <UserInfo
              :userInfoData="userInfoData"
              :level="level"
              :provinceName="provinceName"
              :cityName="cityName"
              :isTwoTo="true"
            />
            <div class="ranking-title">
                <h3 class="title">我的动态（{{dynamicList.length}}）</h3>
            </div>
            <div class="social">
                <div class="social-left">
                    <EventList :dynamicList="dynamicList" :userInfos="userInfos" />
                </div>
                <div class="social-right">
                    <div class="soide">
                        <h4 class="my-follow">我的关注</h4>
                        <ul class="follow-ul">
                            <li class="item" v-for="item in followList" :key="item.userId">
                                <span :title="item.nickname" @click="toUserHome(item?.userId)">
                                    <img class="user-img" :src="item.avatarUrl" alt="">
                                </span>
                                <p>
                                    <span class="name thide text-hov" @click="toUserHome(item?.userId)">{{item.nickname}}</span>
                                    <img class="name-icn" v-if="item?.avatarDetail" :src="item?.avatarDetail?.identityIconUrl" alt="">
                                </p>
                            </li>
                        </ul>
                        <h4 class="my-follow">我的粉丝</h4>
                        <ul class="follow-ul">
                            <li class="item" v-for="item in vermicelliList" :key="item.userId">
                                <span :title="item.nickname" @click="toUserHome(item?.userId)">
                                    <img class="user-img" :src="item.avatarUrl" alt="">
                                </span>
                                <p>
                                    <span class="name thide text-hov" @click="toUserHome(item?.userId)">{{item.nickname}}</span>
                                    <img class="name-icn" v-if="item?.avatarDetail" :src="item?.avatarDetail?.identityIconUrl" alt="">
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import UserInfo from '@/views/user-home/user-info/UserInfo.vue';
import { userInfo } from '@/api/login.ts';
import { getDynamic, getFolloweds, getFollows } from '@/api/user-social.ts';
import findCityZipCode from '@/views/user-home/city.ts';
import { useRoute, useRouter } from 'vue-router';
import type { ResponseType } from '@/types/index';
import useUserStore from '@/stores/modules/user.ts';
import EventList from './event-list/EventList.vue';
import { replaceEmojiWithImage } from '@/utils/replaceEmojiWithImage.ts';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

// 登录信息
const userInfos = computed(() => userStore.getUserInfo)


const ControlsShow = ref<boolean>(false);
const userInfoData = ref({});
const level = ref<number>(0); // 等级
const provinceName = ref<string>(''); // 省
const cityName = ref<string>(''); // 市
function getUserInfo() {
    userInfo({uid: route?.query?.id}).then((res:ResponseType) => {
        if(res.code === 200) {
            userInfoData.value = res?.profile;
            level.value = res?.level
            if(res?.profile?.province){
                provinceName.value = findCityZipCode(res?.profile?.province);
                cityName.value = findCityZipCode(res?.profile?.city);
            }
        }
    })
}
getUserInfo();

type DynamicItem = {
    type: string | number,
    typeStr: string,
    json: string,
    jsonData: {
        event?: DynamicItem,
        msg: string
    },
    status: boolean,
    controls: boolean,
}

// 动态
const dynamicList = ref<DynamicItem[]>([]);
function Dynamic() {
    getDynamic({
        // uid: 1684269650,
        // uid: 356767794,
        uid: route?.query?.id,
        limit: 30,
        lasttime: -1
    }).then((res: ResponseType) => {
        if(res.code === 200) {
            let Arr = []
            Arr = res?.events ?? []
            Arr.forEach(item => {
                item.typeStr = statusJudgment(item?.type)
                item.itemStatus = itemEffective(item?.type)
                item.jsonData = JSON.parse(item.json)
                item.controls = false
                item.jsonData.msg = replaceEmojiWithImage(item.jsonData.msg)
            })
            // 过滤一些未确认的类型，后期发现再添加，避免页面渲染错误
            dynamicList.value = Arr.filter(item => item.itemStatus)
            dynamicList.value.forEach(item => {
                if(item.type === 22) {
                    item.jsonData.event.jsonData = JSON.parse(item.jsonData.event.json)
                    item.jsonData.event.jsonData.msg = replaceEmojiWithImage(item.jsonData.event.jsonData.msg)
                }
            })
            console.log(dynamicList.value, 'dynamicList.value')
        }
    })
}
Dynamic();


// 关注
const followList = ref([]);
function follows() {
    getFollows({
        uid: route?.query?.id,
        limit: 30,
        lasttime: 0
    }).then((res: ResponseType) => {
        if(res.code === 200) {
            followList.value = res.follow ?? []
        }
    })
}
follows();

// 粉丝
const vermicelliList = ref([]);
function vermicelli() {
    getFolloweds({
        uid: route?.query?.id,
        limit: 30,
        lasttime: 0
    }).then((res: ResponseType) => {
        if(res.code === 200) {
           vermicelliList.value = res.followeds ?? []
        }
    })
}
vermicelli();

function statusJudgment(type: number | string): string {
    let text = '';

    if(type === 18){
        text = '分享单曲';
    }else if(type === 19){
        text = '分享专辑';
    }else if(type === 17 || type === 28){
        text = '分享电台节目';
    }else if(type === 22){
        text = '转发';
    }else if(type === 39){
        text = '发布视频';
    }else if(type === 13){
        text = '分享歌单';
    }else if(type === 24){
        text = '分享专栏文章';
    }else if(type === 21 || type === 41){
        text = '分享视频';
    }else if(type === 56){
        text = '分享网页';
    }

    return text
}

function itemEffective(type: number): boolean {
    let arr: number[] = [17,18,19,28,22,39,13,24,21,41,35,56]
    let index = arr.includes(type)
    return index
}

// 跳转关注、粉丝主页
function toUserHome(id: string | number) {
    if(id) {
        router.push({
            path: '/user/home',
            query: {id}
        })
    }
}

</script>


<style lang="scss" scoped>
.user-home{
    width: 980px;
    min-height: 700px;
    margin: 0 auto;
    background-color: #fff;
    border: 1px solid #d3d3d3;
    border-width: 0 1px;
    .user-box{
        padding: 40px;
        .ranking-title{
            position: relative;
            z-index: 2;
            zoom: 1;
            height: 33px;
            border-bottom: 2px solid #c20c0c;
            .title{
                font-size: 20px;
                line-height: 28px;
                font-weight: normal;
                color: #666;
                font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
                float: left;
            }
            .song-list{
                color: #333;
            }
        }
    }
}
.social{
    width: 100%;
    border: none;
    min-height: 700px;
    margin: 0 auto;
    background: url('@/assets/images/social/wrap1.png') repeat-y 100% 100%;
    .social-left{
        padding: 10px 25px 0 0;
        display: inline-block;
        vertical-align: middle;
    }
    .social-right{
        width: 250px;
        display: inline-block;
        vertical-align: top;
        .soide{
            padding: 10px 0 0 25px;
            .my-follow{
                height: 23px;
                border-bottom: 1px solid #ccc;
                color: #333;
            }
            .follow-ul{
                margin: 15px 0 0 -16px;
                .item{
                    float: left;
                    width: 64px;
                    height: 105px;
                    padding-left: 16px;
                    .user-img{
                        width: 64px;
                        height: 64px;
                        cursor: pointer;
                    }
                    p{
                        margin-top: 5px;
                        .name{
                            max-width: 70%;
                            display: inline-block;
                            vertical-align: middle;
                            color: #333;
                        }
                        .name-icn{
                            height: 13px;
                            width: 13px;
                            display: inline-block;
                            vertical-align: middle;
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
}
</style>