<template>
    <div class="menu-box">
        <h2 class="tit">云音乐特色榜</h2>
        <ul class="menu-list">
            <li class="item" :class="{'active-item' : item.id === id}" v-for="(item, index) in hotList" :key="index" @click="toHomeToplist(item.id)">
                <div class="item-box">
                    <div class="item-left">
                        <img :src="`${item?.coverImgUrl}?param=40y40`" alt="">
                        <span class="mask"></span>
                    </div>
                    <p class="name">{{item?.name}}</p>
                    <p>{{item?.updateFrequency}}</p>
                </div>
            </li>
        </ul>
        <h2 class="tit two">全球媒体榜</h2>
        <ul class="menu-list">
            <li class="item" v-for="(item, index) in common" :key="index">
                <div class="item-box">
                    <div class="item-left">
                        <img :src="`${item?.coverImgUrl}?param=40y40`" alt="">
                        <span class="mask"></span>
                    </div>
                    <p class="name">{{item?.name}}</p>
                    <p>{{item?.updateFrequency}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">

const emit = defineEmits(['toHomeToplist'])
const props = defineProps({
    hotList: {
        type: Array,
        default: []
    },
    common: {
        type: Array,
        default: []
    },
    id: {
        type: Number,
        default: undefined
    }
})

function toHomeToplist(id: number) {
    emit('toHomeToplist', id)
}
</script>

<style lang="scss" scoped>
.menu-box{
    margin-top: 40px;
    .tit{
        padding: 0 10px 12px 15px;
        font-size: 14px;
        color: #000;
        font-family: simsun, \5b8b\4f53;
    }
    .two{
        margin-top: 20px;
    }
    .menu-list{
        .item{
            padding: 10px 0 10px 20px;
            position: relative;
            height: 42px;
            cursor: pointer;
            .item-box{
                padding-left: 50px;
                .item-left{
                    float: left;
                    margin-left: -50px;
                    overflow: hidden;
                    width: 40px;
                    height: 40px;
                    position: relative;
                    img{
                        width: 40px;
                        height: 40px;
                    }
                    .mask{
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                    }
                }
                p{
                    color: #999;
                }
                .name{
                    width: 150px;
                    overflow: hidden;
                    margin-top: 2px;
                    margin-bottom: 8px;
                    color: #000;
                }
            }
            &:hover{
                background-color: #f4f2f2;
            }
            &:after{
                clear: both;
                content: '.';
                display: block;
                height: 0;
                visibility: hidden;
            }
        }
        .active-item{
            background: #e6e6e6;
            &:hover{
                background: #e6e6e6;
            }
        }
    }
}
</style>