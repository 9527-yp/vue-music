<template>
    <div class="user-info">
        <div class="user-cov">
            <img :src="userInfoData?.avatarUrl" alt="">
        </div>
        <div class="user-d">
            <div class="name">
                <h2 class="name-warp">
                    <span class="title thide">{{ userInfoData.nickname }}</span>
                    <span class="lev u-lev-icn">{{ level }}
                        <i class="right u-lev-icn"></i>
                    </span>
                </h2>
                <div class="edit">
                    <div class="edit-box edit-btn edit-bag">
                        <i class="edit-btn edit-bag">编辑个人资料</i>
                    </div>
                </div>
            </div>
            <ul class="info-ul">
                <li class="item item-fst">
                    <span class="item-cnt" @click="goUserSocial">
                        <strong class="num">{{ userInfoData.eventCount }}</strong>
                        <span class="text">动态</span>
                    </span>
                </li>
                <li class="item">
                    <span class="item-cnt">
                        <strong class="num">{{ userInfoData.follows }}</strong>
                        <span class="text">关注</span>
                    </span>
                </li>
                <li class="item">
                    <span class="item-cnt">
                        <strong class="num">{{ userInfoData.followeds }}</strong>
                        <span class="text">粉丝</span>
                    </span>
                </li>
            </ul>
            <div class="info">
                <span>所在地：{{provinceName}}-{{cityName}}</span>
                <span class="sep"> 年龄：{{getAgeFragment(userInfoData.birthday)}}</span>
            </div>
            <div class="info">
                <span class="tit">社交网络：</span>
                <ul class="contact-ul">
                    <li class="item">
                        <i class="u-slg u-slg-gary" title="新浪微博"></i>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getAgeFragment } from '@/utils/utils.ts';
import { useRouter, useRoute } from 'vue-router'

const router = useRouter();
const route = useRoute();
const props = defineProps({
    userInfoData: {
        type: Object,
        default: {}
    },
    level: {
        type: Number,
        default: 0
    },
    provinceName: {
        type: String,
        default: ''
    },
    cityName: {
        type: String,
        default: ''
    },
    isTwoTo: {
        type: Boolean,
        default: false
    }
})

function goUserSocial(): undefined {
    if(props.isTwoTo){
        return;
    }
    router.push({
        path: '/user/Social',
        query: {id: route.query.id}
    })
}
</script>

<style lang="scss" scoped>
.user-info{
    margin-bottom: 43px;
    .user-cov{
        float: left;
        width: 188px;
        margin-right: 40px;
        position: relative;
        zoom: 1;
        img{
            display: block;
            width: 180px;
            height: 180px;
            padding: 3px;
            background: #fff;
            border: 1px solid #d5d5d5;
        }
    }
    .user-d{
        float: left;
        width: 670px;
        .name{
            padding-bottom: 12px;
            margin-bottom: 10px;
            border-bottom: 1px solid #ddd;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .name-warp{
                padding-bottom: 3px;
                display: flex;
                .title{
                    margin-top: 3px;
                    font-size: 22px;
                    font-weight: normal;
                    line-height: 30px;
                    color: #000;
                }
                .u-lev-icn{
                    display: inline-block;
                    overflow: hidden;
                    vertical-align: middle;
                    background: url('@/assets/images/icon2.png') no-repeat;
                    background-position: -135px -190px;
                }
                .lev{
                    margin: 8px 0 0 10px;
                    height: 19px;
                    overflow: hidden;
                    padding-left: 29px;
                    line-height: 21px;
                    color: #e03a24;
                    font-size: 14px;
                    font-weight: bold;
                    font-style: italic;
                }
                .right{
                    float: right;
                    width: 9px;
                    height: 19px;
                    background-position: -191px -190px;
                }
                &:after{
                    clear: both;
                    content: '.';
                    display: block;
                    height: 0;
                    visibility: hidden;
                }
            }
            .edit{
                margin-top: 4px;
                .edit-btn{
                    color: #333;
                    display: inline-block;
                    height: 31px;
                    line-height: 31px;
                    overflow: hidden;
                    vertical-align: top;
                    text-align: center;
                    cursor: pointer;
                }
                .edit-box{
                    padding: 0 5px 0 0;
                    background: url('@/assets/images/login/button-bag.png') no-repeat;
                    background-position: right -100px;
                    &:hover{
                        background-position: right -182px;
                        i{
                            background-position: 0 -141px;
                        }
                    }
                }
                i{
                    padding: 0 15px 0 20px;
                    pointer-events: none;
                    background: url('@/assets/images/login/button-bag.png') no-repeat;
                    background-position: 0 -59px;
                }
            }
        }
        .info-ul{
            // height: 41px;
            margin-bottom: 15px;
            color: #666;
            .item{
                float: left;
                padding: 0 40px 0 20px;
                border-left: 1px solid #ddd;
                .item-cnt{
                    display: inline-block;
                    position: relative;
                    zoom: 1;
                    color: #666;
                    .num {
                        display: block;
                        margin-top: -4px;
                        font-size: 24px;
                        font-weight: normal;
                        cursor: pointer;
                    }
                    .text{
                        display: block;
                        text-indent: 2px;
                        cursor: pointer;
                    }
                    &:hover{
                        color: #0c73c2;
                    }
                }
            }
            .item-fst{
                padding-left: 0;
                border-left: none;
            }
            &:after{
                clear: both;
                content: '.';
                display: block;
                height: 0;
                visibility: hidden;
            }
        }
        .info{
            margin-bottom: 5px;
            line-height: 21px;
            color: #666;
            .sep{
                margin-left: 20px;
            }
            .tit{
                float: left;
            }
            .contact-ul{
                margin-left: -8px;
                .item{
                    margin-left: 8px;
                    height: 22px;
                    float: left;
                    .u-slg{
                        width: 20px;
                        height: 20px;
                        display: inline-block;
                        vertical-align: middle;
                        background: url('@/assets/images/icon-logo.png') no-repeat;
                    }
                    .u-slg-gary{
                        background-position: 0 -25px;
                    }
                }
            }
        }
    }
    &:after {
        clear: both;
        content: '.';
        display: block;
        height: 0;
        visibility: hidden;
    }
}
</style>