<template>
    <div class="ranking-title">
        <h3 class="title song-list">{{title}}（{{list.length}}）</h3>
    </div>
    <ul class="m-ovrlst">
        <li class="item" v-for="(item, index) in list" :key="index">
            <div class="cover">
                <img :src="item.coverImgUrl" alt="">
                <span class="msk" :title="item.name"></span>
                <div class="bottom">
                    <i class="icn play-icn"></i>
                    <i class="icon-headset"></i>
                    <span class="num">{{getBigNumberTransform(item.playCount)}}</span>
                </div>
            </div>
            <p class="title">
                <span class="title-text text-hov thide" :title="item.name">{{item.name}}</span>
            </p>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { getBigNumberTransform } from '@/utils/utils.ts'

defineProps({
    title: {
        type: String,
        default: ''
    },
    list: {
        type: Array,
        default: []
    }
})
</script>


<style lang="scss" scoped>
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
.m-ovrlst{
    margin: 20px 0 0 -50px;
    .item{
        float: left;
        width: 140px;
        padding: 0 0 30px 50px;
        line-height: 1.4;
        height: 165px;
        overflow: hidden;
        .cover{
            width: 140px;
            height: 140px;
            position: relative;
            img{
                width: 140px;
                height: 140px;
                display: block;
            }
            .msk{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                cursor: pointer;
                background: url('@/assets/images/home/name-D5CGUEo8.png') no-repeat 0 9999px;
                background-position: 0 0;
            }
            .bottom{
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 27px;
                background: url('@/assets/images/home/name-D5CGUEo8.png') no-repeat 0 9999px;
                background-position: 0 -537px;
                color: #ccc;
                .play-icn{
                    position: absolute;
                    right: 10px;
                    bottom: 5px;
                    width: 16px;
                    height: 17px;
                    background: url('@/assets/images/home/name-Db6Jvh02.png') no-repeat 0 9999px;
                    background-position: 0 0;
                }
                .icon-headset{
                    float: left;
                    width: 14px;
                    height: 11px;
                    background: url('@/assets/images/home/name-Db6Jvh02.png') no-repeat 0 9999px;
                    background-position: 0 -24px;
                    margin: 9px 5px 9px 10px;
                }
                .num{
                    float: left;
                    margin: 7px 0 0 0;
                }
            }
        }
        .title{
            margin: 8px 0 3px;
            font-size: 14px;
            width: 100%;
            .title-text{
                display: inline-block;
                max-width: 100%;
                vertical-align: middle;
                color: #000;
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
</style>