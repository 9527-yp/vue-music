<template>
    <ul class="mv-ul" v-if="list.length > 0">
        <li class="item" v-for="(item, index) in list" :key="index">
            <div class="u-cover">
                <img class="img" :src="`${item.imgurl}?param=137y103`" alt="">
                <div class="msk"></div>
                <i class="play-icn"></i>
            </div>
            <p class="dec">
                <span class="text-hov thide">{{item.name}}</span>
            </p>
        </li>
    </ul>
    <div v-else class="not-mv">
        <h3>
            <i class="not-icn"></i>
            暂无MV
        </h3>
    </div>
</template>

<script setup lang="ts">
    defineProps({
        list: {
            type: Array,
            default: []
        }
    })
</script>

<style lang="scss" scoped>
.mv-ul{
    margin: 20px 0 0 -29px;
    .item{
        width: 137px;
        height: 140px;
        padding-left: 29px;
        float: left;
        overflow: hidden;
        padding: 0 0 30px 50px;
        line-height: 1.4;
        .u-cover{
            position: relative;
            width: 137px;
            height: 103px;
            .img{
                width: 100%;
                height: 100%;
            }
            .msk{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                cursor: pointer;
                background: url('@/assets/images/home/name-D5CGUEo8.png') no-repeat;
                background-position: 0 -1170px;
            }
            .play-icn{
                width: 44px;
                height: 44px;
                position: absolute;
                top: 50%;
                left: 50%;
                margin: -22px 0 0 -22px;
                cursor: pointer;
                background: url('@/assets/images/home/name-Db6Jvh02.png') no-repeat;
                background-position: -30px -135px;
                &:hover{
                    background-position: -30px -85px;
                }
            }
        }
        .dec{
            margin: 8px 0 3px;
            font-size: 14px;
            width: 100%;
            span{
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
        visibility: hidden
    }
}
.not-mv{
    margin-top: 20px;
    padding: 105px 0 105px 0;
    text-align: center;
    h3{
        padding-bottom: 38px;
        font-size: 18px;
        font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
    }
    .not-icn{
        margin-right: 17px;
        width: 64px;
        height: 50px;
        display: inline-block;
        overflow: hidden;
        vertical-align: middle;
        background: url('@/assets/images/icon.png') no-repeat;
        background-position: 0 -347px;
    }
}
</style>