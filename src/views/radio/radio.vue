<template>
    <div class="radio-detail">
        <div class="radio-content">
            <div class="radio-header">
                <div class="cover">
                    <img src="http://p2.music.126.net/f8--VsgDyKYFOWsJaskKAw==/109951169597599405.jpg?param=200y200" alt="">
                    <span class="smk"></span>
                </div>
                <div class="u-info">
                    <div class="info-tit">
                        <i class="radio-icn"></i>
                        <h2 class="tit">社交千斤顶</h2>
                    </div>
                    <div class="user">
                        <img class="user-img" src="http://p1.music.126.net/jc20TIYH-_bPxKLWgujbSQ==/109951169586541582.jpg?param=50y50" alt="">
                        <span class="user-name text-hov" title="社交千斤顶">社交千斤顶</span>
                    </div>
                    <div class="hd-btns">
                        <span class="sub-icn m-icn icn icn-bag">
                            <i class="icn icn-bag">订阅(14)</i>
                        </span>
                        <span class="play-icn m-icn icn icn-bag">
                            <i class="icn icn-bag">播放全部</i>
                        </span>
                        <span class="share-icn m-icn icn icn-bag">
                            <i class="icn icn-bag">分享(0)</i>
                        </span>
                    </div>
                    <div class="desc">
                        <span class="tip-btn">知识</span>
                        「社交千斤顶」是一档营销播客，主要关注品牌如何利用社交媒体和中国数字化基建进行社交洞察，放大营销杠杆，打造以用户为中心、围绕用户进行品牌共建的「用户型企业」。
                    </div>
                </div>
            </div>
            <div class="radio-table-box">
                <div class="table-hd">
                    <h3 class="table-tit">节目列表</h3>
                    <span class="table-sub">共5期</span>
                    <div class="u-sore">
                        <i class="up-icn" :class="tableSore === 'down' ? 'up-active' : 'up-unActive'" @click="soreTable('down')" title="降序"></i>
                        <i class="down-icn" :class="tableSore === 'up' ? 'down-active' : 'down-unActive'" @click="soreTable('up')" title="升序"></i>
                    </div>
                    <div class="out">
                        <i class="out-icn"></i>
                        <a
                            class="text text-hov"
                            :href="`https://music.163.com/#/outchain/1/${id}`"
                        >
                            生成外链播放器
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <div class="radio-side">

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const id = route.query.id;
const tableSore = ref('down');

function soreTable(type: string) {
    if(tableSore.value === type ){
        return;
    }
    tableSore.value = type;
}
</script>


<style lang="scss" scoped>
.radio-detail{
    width: 980px;
    min-height: 700px;
    margin: 0 auto;
    background-color: #fff;
    border: 1px solid #d3d3d3;
    border-width: 0 1px;
    background: url('@/assets/images/play-list/wrap4.png');
    .radio-content{
        display: inline-block;
        width: calc(100% - 271px);
        padding: 47px 30px 40px 39px;
        vertical-align: top;
        box-sizing: border-box;
        .radio-header{
            .cover{
                position: relative;
                display: inline-block;
                vertical-align: top;
                width: 200px;
                height: 200px;
                .smk{
                    width: 208px;
                    height: 208px;
                    position: absolute;
                    top: -4px;
                    left: -4px;
                    background: url('@/assets/images/home/name-D5CGUEo8.png') no-repeat;
                    background-position: 0 -1285px;
                }
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .u-info{
                max-width: 63%;
                display: inline-block;
                vertical-align: top;
                margin-left: 30px;
                .info-tit{
                    position: relative;
                    margin: 0 0 12px;
                    line-height: 24px;
                    .radio-icn{
                        width: 55px;
                        height: 24px;
                        display: inline-block;
                        vertical-align: middle;
                        background: url('@/assets/images/icon.png') no-repeat;
                        background-position: 0 -1014px;
                    }
                    .tit{
                        color: #333;
                        margin-left: 9px;
                        display: inline-block;
                        vertical-align: middle;
                        line-height: 24px;
                        font-size: 20px;
                        font-weight: normal;
                        font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
                    }
                }
                .user{
                    margin: 0 0 20px;
                    line-height: 35px;
                    .user-img{
                        width: 35px;
                        height: 35px;
                        vertical-align: middle;
                        margin-right: 10px;
                    }
                    .user-name{
                        margin-right: 2px;
                        vertical-align: middle;
                        color: #0c73c2;
                    }
                }
                .hd-btns{
                    margin-bottom: 25px;
                    margin-right: -10px;
                    .icn-bag{
                        background:url('@/assets/images/login/button-bag.png') no-repeat;
                    }
                    .icn{
                        float: left;
                        height: 31px;
                        line-height: 30px;
                        min-width: 23px;
                        cursor: pointer;
                    }
                    .m-icn{
                        margin-right: 6px;
                        padding: 0 5px 0 0;
                        font-family: simsun, \5b8b\4f53;
                    }
                    .sub-icn{
                        background-position: right -2163px;
                        color: #fff;
                        i{
                            padding: 0 7px 0 30px;
                            background-position: 0 -2125px;
                        }
                        &:hover{
                            background-position: right -2558px;
                            i{
                                background-position: 0 -2516px;
                            }
                        }
                    }
                    .play-icn{
                        background-position: right -2325px;
                        color: #333;
                        i{
                            padding: 0 7px 0 30px;
                            background-position: 0 -2285px;
                        }
                        &:hover{
                            background-position: right -2720px;
                            i{
                                background-position: 0 -2680px;
                            }
                        }
                    }
                    .share-icn{
                        background-position: right -1020px;
                        color: #333;
                        i{
                            padding: 0 2px 0 28px;
                            background-position: 0 -1225px;
                        }
                        &:hover{
                            background-position: right -1106px;
                            i{
                                background-position: 0 -1268px;
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
                .desc{
                    display: inline-block;
                    margin-top: 4px;
                    line-height: 18px;
                    color: #666;
                    word-wrap: break-word;
                    word-break: break-word;
                    white-space: normal;
                    .tip-btn{
                        margin-right: 7px;
                        color: #cc0000;
                        display: inline-block;
                        position: relative;
                        top: -1px;
                        height: 16px;
                        overflow: hidden;
                        padding: 0 6px;
                        border: 1px solid #cc0000;
                        line-height: 16px;
                        vertical-align: middle;
                        font-size: 12px;
                        cursor: pointer;
                    }
                }
            }
        }
        .radio-table-box{
            margin-top: 27px;
            .table-hd{
                height: 33px;
                border-bottom: 2px solid #c20c0c;
                .table-tit{
                    font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
                    font-size: 20px;
                    line-height: 28px;
                    float: left;
                    font-weight: normal;
                }
                .table-sub{
                    margin: 9px 0 0 20px;
                    float: left;
                    color: #999;
                }
                .u-sore{
                    float: right;
                    .up-icn{
                        float: left;
                        height: 25px;
                        width: 29px;
                        background: url('@/assets/images/radio/cnt_radio.png') no-repeat;
                    }
                    .up-active{
                        background-position: 0 -30px;
                        cursor: default;
                    }
                    .up-unActive{
                        background-position: 0 0px;
                        cursor: pointer;
                        &:hover{
                            background-position: 0 -60px;
                        }
                    }
                    .down-icn{
                        float: left;
                        height: 25px;
                        width: 28px;
                        background: url('@/assets/images/radio/cnt_radio.png') no-repeat;
                    }
                    .down-active{
                        background-position: -40px -30px;
                        cursor: default;
                    }
                    .down-unActive{
                        background-position: -40px 0;
                        cursor: pointer;
                        &:hover{
                            background-position: -40px -60px;
                        }
                    }
                }
                .out{
                    margin-top: 5px;
                    margin-right: 20px;
                    float: right;
                    .out-icn{
                        width: 16px;
                        height: 16px;
                        background: url('@/assets/images/icon.png') no-repeat;
                        background-position: -34px -863px;
                        display: inline-block;
                        overflow: hidden;
                        vertical-align: middle;
                    }
                    .text{
                        cursor: pointer;
                        color: #4996d1;
                    }
                }
            }
        }
    }
    .radio-side{
        display: inline-block;
        width: 270px;
        vertical-align: top;
    }
}
</style>