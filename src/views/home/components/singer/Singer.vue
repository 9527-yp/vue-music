<template>
    <div class="n-singer">
        <div class="v-header">
            <div class="header-text">入驻歌手</div>
            <div class="more text-hov">查看更多></div>
        </div>
        <ul class="singer-list">
            <li class="item" v-for="item in singerList" :key="item.userId">
                <div class="head">
                    <img :src="item.src" alt="">
                </div>
                <div class="ifo">
                    <h4>
                        <span class="singer-name">{{item.name}}</span>
                    </h4>
                    <p class="singer-description">{{item.desc}}</p>
                </div>
            </li>
        </ul>
        <div class="apply-Musician">
            <span>申请成为网易音乐人</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

type MenuItem = {
    src: string,
    name: string,
    desc: string,
    userId: number,
}
// 入驻歌手(无接口)
const singerList = ref<MenuItem[]>([
    {
        src: 'http://p1.music.126.net/rCsLFXha6SLis0tV7yZ5fA==/109951165588539704.jpg?param=62y62',
        name: '张惠妹aMEI',
        desc: '台湾歌手张惠妹',
        userId: 29879272
    },
    {
        src: 'http://p1.music.126.net/wDxCsT3YEYdNg-UZU_ZKeg==/109951166047225823.jpg?param=62y62',
        name: 'Fine乐团',
        desc: '独立音乐人',
        userId: 100167517
    },
    {
        src: 'http://p1.music.126.net/w_UWOls2uCkFN_U62788Xg==/18806046882229308.jpg?param=62y62',
        name: '萬曉利',
        desc: '民谣歌手、中国现代民谣的代表人物之一',
        userId: 58426904
    },
    {
        src: 'http://p1.music.126.net/v_zYgE9kmAwVGWV2c8hFxA==/7943971513291094.jpg?param=62y62',
        name: '音乐人赵雷',
        desc: '民谣歌手',
        userId: 93504818
    },
    {
        src: 'http://p1.music.126.net/NDsX060FnCtiDMZN-c_9Gw==/3438172872737957.jpg?param=62y62',
        name: '王三溥',
        desc: '音乐人',
        userId: 46998208
    }
]);
</script>

<style lang="scss" scoped>
.n-singer{
    margin-top: 15px;
    .v-header{
        position: relative;
        height: 23px;
        margin: 0 20px;
        border-bottom: 1px solid #ccc;
        color: #333;
        .header-text{
            float: left;
            font-weight: 700;
        }
        .more{
            float: right;
            cursor: pointer;
        }
    }
    .singer-list{
        margin: 6px 0 14px 20px;
        .item{
            margin-top: 14px;
            width: 210px;
            height: 62px;
            cursor: pointer;
            background: #fafafa;
            .head{
                display: inline-block;
                vertical-align: top;
                width: 62px;
                height: 62px;
                cursor: pointer;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .ifo{
                width: 133px;
                height: 60px;
                padding-left: 14px;
                border: 1px solid #e9e9e9;
                border-left: none;
                display: inline-block;
                vertical-align: top;
                h4{
                    margin-top: 8px;
                }
                .singer-name{
                    font-size: 14px;
                    font-weight: 700;
                    width: 90%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    word-wrap: normal;
                }
                .singer-description{
                    width: 90%;
                    margin-top: 8px;
                    color: #666;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    word-wrap: normal;
                }
            }
            &:hover{
                background: #f4f4f4;
            }
        }
    }
    .apply-Musician{
        margin-left: 20px;
        border-radius: 4px;
        color: #333;
        padding: 0 5px 0 0;
        white-space: nowrap;
        display: inline-block;
        height: 31px;
        line-height: 31px;
        overflow: hidden;
        vertical-align: top;
        text-align: center;
        cursor: pointer;
        background: url('@/assets/images/home/side/button2.png') no-repeat 0 9999px;
        background-position: right -100px;
        span{
            width: 170px;
            font-weight: bold;
            background: url('@/assets/images/home/side/button2.png') no-repeat 0 9999px;
            background-position: 0 -59px;
            padding: 0 15px 0 20px;
            pointer-events: none;
            display: inline-block;
            height: 31px;
            line-height: 31px;
            overflow: hidden;
            vertical-align: top;
            text-align: center;
            cursor: pointer;
        }

    }
}
</style>