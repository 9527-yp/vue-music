<template>
    <div class="m-timeline">
        <ul class="timeline-ul" v-if="dynamicList.length > 0">
            <li class="item" v-for="(item, index) in dynamicList" :key="index">
                <div class="u-cover">
                    <img class="u-img" :src="item?.user?.avatarUrl" alt="">
                </div>
                <div class="item-r">
                    <div class="item-header">
                        <span class="u-name text-hov">{{item?.user?.nickname}}</span>
                        <span class="title">{{item.typeStr}}</span>
                    </div>
                    <div class="time">
                        <span class="text-hov">{{formatDate(item.showTime)}}</span>
                    </div>
                    <div class="text">
                        <span v-html="item?.jsonData?.msg"></span>
                        <template v-if="item.type !== 22">
                            <br v-if="item?.actName && item?.jsonData?.msg" />
                            <span v-if="item?.actName" class="activity text-hov">#{{item?.actName}}#</span>
                        </template>
                    </div>
                    <!-- 内容 -->
                    <ItemContent :item="item" />
                    <!-- 图片 -->
                    <div class="user-upload">
                        <ul class="upload-ul" v-if="item.pics.length > 0">
                            <li class="item-pic" v-for="(img, j) in item.pics" :key="j">
                                <img class="pic" :src="img.originUrl" alt="">
                            </li>
                        </ul>
                    </div>
                    <div class="doper">
                        <span class="like text-hov">
                            <i class="icn" :class="{'like-icn': item.xInfo?.info?.liked}"></i>
                            <span v-if="item.xInfo?.info?.likedCount">({{item.xInfo?.info?.likedCount}})</span>
                        </span>
                        <span class="line">|</span>
                        <span class="forward text-hov">
                            转发
                            <span v-if="item.xInfo?.insiteForwardCount">({{item.xInfo?.insiteForwardCount}})</span>
                        </span>
                        <span class="line">|</span>
                        <span class="forward text-hov">
                            评论
                            <span v-if="item.xInfo?.info?.commentCount">({{item.xInfo?.info?.commentCount}})</span>
                        </span>
                    </div>
                    <div class="arrow" v-if="userInfos?.profile?.userId === item?.user?.userId" @click="item.controls = !item.controls">
                        <ul class="mng-ul" v-show="item.controls">
                            <li class="mng-item">
                                <i class="del-icn"></i>
                                删除
                            </li>
                        </ul>
                    </div>
                </div>
            </li>
        </ul>
        <div class="n-nmusic" v-else>
            <h3>
                <i class="n-music-icn"></i>
                暂时还没有动态
            </h3>
        </div>
    </div>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/utils.ts';
import ItemContent from './ItemContent.vue'

defineProps({
    dynamicList: {
        type: Array,
        default: []
    },
    userInfos: {
        type: Object,
        default: {}
    }
})

</script>

<style lang="scss" scoped>
.m-timeline{
    width: 624px;
    position: relative;
    zoom: 1;
    text-shadow: none;
    .item{
        width: 624px;
        position: relative;
        padding: 20px 0;
        border-bottom: 1px solid;
        border-color: #e8e8e9;
        .u-cover{
            position: absolute;
            top: 20px;
            left: 0;
            width: 54px;
            .u-img{
                width: 45px;
                height: 45px;
            }
        }
        .item-r{
            position: relative;
            zoom: 1;
            margin-left: 55px;
            padding-top: 4px;
            .item-header{
                font-size: 14px;
                position: relative;
                .u-name{
                    color: #0c73c2;
                }
                .title{
                    margin-left: 5px;
                    color: #666;
                }
            }
            .time{
                margin-top: 7px;
                color: #999;
            }
            .text{
                margin-top: 10px;
                line-height: 24px;
                font-size: 14px;
                word-wrap: break-word;
                word-break: break-word;
                white-space: normal;
                .activity{
                    color: #0c73c2;
                }
            }
            .upload-ul{
                .item-pic{
                    width: auto !important;
                    height: auto !important;
                    // clear: left;
                    float: left;
                    position: relative;
                    zoom: 1;
                    // width: 224px;
                    // height: 224px;
                    margin-left: 4px;
                    margin-top: 4px;
                    background-color: #e5e5e5;
                    background-repeat: no-repeat;
                    background-position: center center;
                    .pic{
                        min-width: 170px;
                        max-height: 338px;
                        height: auto;
                        display: block;
                        width: 100%;
                        cursor: pointer;
                    }
                    &:after{
                        clear: both;
                        content: '.';
                        display: block;
                        height: 0;
                        visibility: hidden;
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
            .doper{
                margin: 18px 0 -2px;
                text-align: right;
                line-height: normal;
                .like{
                    color: #0c73c2;
                    .icn{
                        display: inline-block;
                        vertical-align: top;
                        margin: 0px 3px 0 0;
                        width: 14px;
                        height: 14px;
                        background: url('@/assets/images/social/sprite.png') no-repeat;
                        background-position: 0 -20px;
                    }
                    .like-icn{
                        background-position: -20px -20px;
                    }
                }
                .line{
                    color: #c7c7c7;
                    margin: 0 10px 0 12px;
                }
                .forward{
                    color: #0c73c2;
                }
            }
            .arrow{
                position: absolute;
                top: -3px;
                right: -3px;
                width: 19px;
                height: 19px;
                background: url('@/assets/images/social/sprite.png') no-repeat;
                background-position: -15px 0;
                cursor: pointer;
                .mng-ul{
                    width: 105px;
                    position: absolute;
                    top: 23px;
                    right: 3px;
                    background: #fff;
                    border: 1px solid #cccfd9;
                    box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
                    .mng-item{
                        float: left;
                        width: 105px;
                        height: 30px;
                        overflow: hidden;
                        line-height: 31px;
                        color: #666;
                        cursor: pointer;
                        .del-icn{
                            width: 16px;
                            height: 16px;
                            margin: 7px 8px 0 9px;
                            display: inline-block;
                            vertical-align: top;
                            background: url('@/assets/images/social/sprite.png') no-repeat;
                            background-position: -40px -360px;
                        }
                        &:hover{
                            background: #f3f3f3;
                        }
                    }
                }
            }
        }
    }
    .n-nmusic{
        padding: 105px 0 105px 0;
        text-align: center;
        h3{
            font-weight: normal;
            margin-top: -2px;
            padding-bottom: 38px;
            font-size: 18px;
            font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
        }
        .n-music-icn{
            margin-right: 17px;
            width: 64px;
            height: 50px;
            background: url('@/assets/images/icon.png') no-repeat;
            background-position: 0 -347px;
            display: inline-block;
            overflow: hidden;
            vertical-align: middle;
        }
    }
}
</style>