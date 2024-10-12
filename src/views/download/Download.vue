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
                    <div class="pc-img">
                        <img v-if="pcTitleIndex === 1" src="@/assets/images/download/new-pc.png" alt="">
                        <img v-else src="@/assets/images/download/old-pc.png" alt="">
                    </div>
                    <div class="pc-text">
                        {{pcTitleIndex ? '全新上线高清音质、个性皮肤、播放动效等' : '经典怀旧版，无法享受高清音质、黑胶皮肤、云盘管理等新版功能'}}
                        </div>
                    <div class="pc-button">
                        <span class="pc-btn-left">
                            <i class="pc-btn-icn"></i>
                            {{ pcTitleIndex ? '下载新版本客户端' : '下载旧版本客户端' }}
                        </span>
                        <span class="pc-btn-line"></span>
                        <span class="pc-btn-right" @click="pcToggle">
                            <i class="pc-icn-unfold" v-if="!pcTooltip"></i>
                            <i class="pc-icn-packup" v-if="pcTooltip"></i>
                        </span>
                        <div class="pc-download-select" v-if="pcTooltip">
                            <div class="select-item select-item-new" @click="selectItemBtn(1)">
                                新版本客户端
                                <i class="pc-select-newtag"></i>
                            </div>
                            <div class="select-item-line"></div>
                            <div class="select-item" @click="selectItemBtn(2)">旧版本客户端</div>
                        </div>
                    </div>
                </div>
                <div class="main-mobile">
                    <div class="title">在电脑上听</div>
                    <div class="mobile-img">
                        <img src="@/assets/images/download/mobile.png" alt="">
                    </div>
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

// 其他操作系统切换
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

// pc端
const pcTooltip = ref<boolean>(false);
const pcTitleIndex = ref<number>(1);
function pcToggle() {
    pcTooltip.value = !pcTooltip.value
};
function selectItemBtn(value: number) {
    if(value === 1) {
        pcTitleIndex.value = 1
    }else{
        pcTitleIndex.value = 0
    }
    pcTooltip.value = false
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
        padding-top: 80px;
        padding-bottom: 112px;
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
                vertical-align: top;
                .title{
                    width: 100%;
                    text-align: center;
                    font-size: 22px;
                    opacity: 0.8;
                    color: #FFFFFF;
                    margin-bottom: 23px;
                }
                .pc-img{
                    width: 464px;
                    height: 273px;
                    margin: 0 auto 3px;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
                .pc-text{
                    font-size: 14px;
                    color: rgb(255, 255, 255);
                    opacity: 0.7;
                }
                .pc-button{
                    width: 300px;
                    height: 65px;
                    margin: 32px auto 0 auto;
                    border-radius: 20px;
                    background-color: #fff;
                    color: #ff3a3a;
                    font-size: 22px;
                    line-height: 65px;
                    text-align: center;
                    cursor: pointer;
                    box-sizing: content-box;
                    position: relative;
                    .pc-btn-left{
                        padding-left: 20px;
                        .pc-btn-icn{
                            display: inline-block;
                            width: 20px;
                            height: 20px;
                            margin-right: 3px;
                            background: url('@/assets/images/download/pc-btn-icn.png') no-repeat center;
                            background-size: contain;
                            vertical-align: -3px;
                        }
                    }
                    .pc-btn-line{
                        margin: 0 0 0 20px;
                        display: inline-block;
                        background-color: #ff3a3a;
                        opacity: 0.1;
                        width: 1px;
                        height: 21px;
                        vertical-align: -3px;
                    }
                    .pc-btn-right{
                        padding-left: 20px;
                        .pc-icn-unfold{
                            display: inline-block;
                            width: 16px;
                            height: 16px;
                            background: url("@/assets/images/download/unfold.png") no-repeat;
                            background-size: contain;
                            opacity: 0.6;
                            vertical-align: 3px;
                            &:hover{
                                opacity: 1;
                            }
                        }
                        .pc-icn-packup{
                            display: inline-block;
                            width: 16px;
                            height: 16px;
                            background: url("@/assets/images/download/packup.png") no-repeat;
                            background-size: contain;
                            opacity: 0.6;
                            vertical-align: -3px;
                            &:hover{
                                opacity: 1;
                            }
                        }
                    }
                }
                .pc-download-select{
                    position: absolute;
                    right: 0px;
                    top: 80px;
                    box-sizing: border-box;
                    width: 306px;
                    height: 100px;
                    background-color: #fff;
                    border-radius: 20px;
                    padding: 10px;
                    font-weight: 400;
                    .select-item{
                        padding: 0px 15px;
                        border-radius: 10px;
                        width: 288px;
                        height: 38px;
                        line-height: 38px;
                        font-size: 16px;
                        color: #283248;
                        text-align: left;
                        cursor: pointer;
                        box-sizing: border-box;
                        .pc-select-newtag{
                            display: inline-block;
                            width: 30px;
                            height: 30px;
                            background: url("@/assets/images/download/pc-select-newtag.png") no-repeat center;
                            background-size: contain;
                            vertical-align: -10px;
                            position: relative;
                            left: 108px;
                        }
                        &:hover{
                            background-color: #f5f5f5;
                        }
                    }
                    .select-item-new{
                        color: rgb(255, 58, 58);
                    }
                    .select-item-line{
                        padding: 0px 15px;
                        background-color: #283248;
                        opacity: 0.06;
                        height: 1px;
                    }
                }
            }
            .main-mobile{
                position: relative;
                display: inline-block;
                margin-left: 220px;
                width: 306px;
                height: 100%;
                text-align: center;
                vertical-align: top;
                .title{
                    width: 100%;
                    text-align: center;
                    font-size: 22px;
                    opacity: 0.8;
                    color: #FFFFFF;
                    margin-bottom: 23px;
                }
                .mobile-img{
                    width: 246px;
                    height: 273px;
                    margin: 0 auto;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
    }
}
</style>