<template>
    <SideMulti />
    <h3 class="header">
        <span>用户wiki</span>
    </h3>
    <a class="wiki-edit text-hov" href="">
        <img class="img" src="@/assets/images/my-music/icn.png" alt="">
        <span>补充或修改歌曲资料</span>
    </a>
    <a class="wiki-edit text-hov" href="">
        <img class="img" src="@/assets/images/my-music/icn.png" alt="">
        <span>用户wiki任务中心</span>
    </a>
</template>

<script setup lang="ts">
import SideMulti from './Side-Multi.vue';
</script>

<style lang="scss" scoped>
.header{
    position: relative;
    height: 23px;
    margin-bottom: 20px;
    border-bottom: 1px solid #ccc;
    color: #333;
    font-size: 100%;
}
.m-multi{
    margin: 20px 0;
    padding-bottom: 20px;
    .down-ul{
        height: 65px;
        margin-bottom: 10px;
        background: url('@/assets/images/sprite.png') no-repeat;
        background-position: 0 -392px;
        .item{
            float: left;
            .ios{
                display: block;
                width: 42px;
                height: 48px;
                cursor: pointer;
                &:hover{
                    background: url('@/assets/images/sprite.png') no-repeat;
                    background-position: 0 -472px;
                }
            }
            .pc{
                display: block;
                width: 60px;
                margin: 0 26px 0 30px;
                height: 48px;
                cursor: pointer;
                &:hover{
                    background: url('@/assets/images/sprite.png') no-repeat;
                    background-position: -72px -472px;
                }
            }
            .aos{
                display: block;
                width: 42px;
                height: 48px;
                cursor: pointer;
                &:hover{
                    background: url('@/assets/images/sprite.png') no-repeat;
                    background-position: -158px -472px;
                }
            }
        }
    }
    p{
        color: #999;
    }
}
.wiki-edit{
    margin-bottom: 5px;
    display: block;
    margin-left: -4px;
    line-height: 12px;
    color: #333;
    .img{
        vertical-align: middle;
    }
    span{
        vertical-align: middle;
    }
}
</style>