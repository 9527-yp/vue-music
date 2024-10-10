<template>
    <div class="download-box">
        <div class="qrcode">
            <img class="qrcode-img" src="https://p1.music.126.net/wCRnpjXHpGRiq1c1uCkIFQ==/109951164246717547.png" alt="">
            <p class="text">扫描二维码下载</p>
        </div>
        <div class="content">
            <div class="main">
                <div class="other-download" @click="handleOther">
                    <i class="other-icon"></i>
                    <p class="other-text">其他操作系统客户端</p>
                    <ul class="other-download-modal" v-if="otherShow">
                        <li class="item" v-for="(item, index) in otherList" :key="index">
                            <i :class="`icon ${item?.icon} ${item?.iconPad}`"></i>
                            <span class="text">{{item?.title}}</span>
                        </li>
                    </ul>
                </div>
                <div class="main-pc">
                    <div class="title">在电脑上听</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

type otherListItem = {
    icon: string,
    title: string,
    iconPad?: string
};
const otherShow = ref(false);
const otherList: otherListItem[] = [
    {
        icon: 'android',
        title: 'Android',
    },
    {
        icon: 'iPhone',
        title: 'iPhone',
    },
    {
        icon: 'iPhone',
        title: 'iPad',
    },
    {
        icon: 'android',
        iconPad:'android-Pad',
        title: 'Android Pad',
    },
    {
        icon: 'Mac',
        title: 'Mac',
    },
    {
        icon: 'PC',
        title: 'PC',
    },
    {
        icon: 'PC',
        title: 'UWP',
    },
    {
        icon: 'android',
        title: 'Android 5.x',
    },
    {
        icon: 'Chrome',
        title: 'Chrome',
    },
    {
        icon: 'TV',
        title: 'TV',
    },
];

function handleOther() {
    otherShow.value = !otherShow.value
};
</script>

<style lang="scss" scoped>
.download-box{
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    .qrcode{
        position: fixed;
        top: 334px;
        right: 25px;
        z-index: 10;
        padding: 16px 18px 9px;
        font-size: 12px;
        color: #333;
        text-align: center;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px #00000080;
        .qrcode-img{
            width: 100px;
            height: 100px;
            display: inline-block;
            .text{
                margin-top: 10px;
            }
        }
    }
    .content{
        position: relative;
        width: 100%;
        height: 700px;
        padding-top: 80px;
        background: url("@/assets/images/download/content-bag.png") no-repeat;
        background-color: #222;
        background-size: cover;
        font-family: PingFangSC-Regular;
        .main{
            position: relative;
            width: 1100px;
            margin: 0 auto;
            .other-download{
                position: absolute;
                top: -78px;
                right: -15px;
                height: 60px;
                font-size: 14px;
                line-height: 60px;
                color: #fff;
                cursor: pointer;
                .other-icon{
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    margin-right: 6px;
                    margin-bottom: 3px;
                    vertical-align: middle;
                    background: url("@/assets/images/download/other-icon.png") no-repeat;
                    background-size: contain;
                }
                .other-text{
                    display: inline-block;
                    padding-top: 4px;
                }
                .other-download-modal{
                    position: absolute;
                    right: -50px;
                    z-index: 10;
                    display: block;
                    width: 276px;
                    min-height: 45px;
                    padding: 20px 10px;
                    display:flex;
                    flex-wrap: wrap;
                    font-size: 12px;
                    line-height: 1.5;
                    text-align: left;
                    background-color: #0000000d;
                    background-color: #fff;
                    border-radius: 12px;
                    box-shadow: 0 0 10px #00000080;
                    box-sizing: border-box;
                    &::before{
                        position: absolute;
                        top: -18px;
                        left: 50%;
                        width: 0;
                        height: 0;
                        border: 10px solid;
                        content: "";
                        transform: translate(-50%);
                        border-color: transparent transparent #fff;
                    }
                    .item{
                        // display: inline-block;
                        width: 113px;
                        height: 45px;
                        margin-bottom: 10px;
                        margin-left: 10px;
                        // line-height: 45px;
                        display:flex;
                        align-items: center;
                        background: #00000014;
                        opacity: .9;
                        .icon{
                            display: inline-block;
                            width: 26px;
                            height: 26px;
                            margin: 0 9px;
                            vertical-align: middle;
                        }
                        .android-Pad{
                            margin: 0 3px 0 9px;
                        }
                        .android{
                            background: url("@/assets/images/download/android.png") no-repeat;
                            background-size: contain;
                        }
                        .iPhone{
                            background: url("@/assets/images/download/iPhone.png") no-repeat;
                            background-size: contain;
                        }
                        .Mac{
                            background: url("@/assets/images/download/Mac.png") no-repeat;
                            background-size: contain;
                        }
                        .PC{
                            background: url("@/assets/images/download/PC.png") no-repeat;
                            background-size: contain;
                        }
                        .Chrome{
                            background: url("@/assets/images/download/Chrome.png") no-repeat;
                            background-position: center;
                            background-size: 20px 20px;
                        }
                        .TV{
                            background: url("@/assets/images/download/TV.png") no-repeat;
                            background-position: center;
                            background-size: 20px 20px;
                        }
                        .text{
                            display: inline-block;
                            font-family: PingFangSC-Regular, sans-serif;
                            font-size: 12px;
                            color: #333;
                            vertical-align: middle;
                        }
                    }
                }
            }
            .main-pc{
                display: inline-block;
                width: 556px;
                height: 100%;
                text-align: center;
                .title{
                    width: 100%;
                    text-align: center;
                    font-size: 22px;
                    opacity: 0.8;
                    color: #FFFFFF;
                    margin-bottom: 23px;
                }
            }
        }
    }
}
</style>