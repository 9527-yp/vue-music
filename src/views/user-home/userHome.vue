<template>
    <div class="user-home">
        <div class="user-box">
            <div class="user-info">
                <div class="user-cov">
                    <img src="" alt="">
                </div>
                <div class="user-d">
                    <div class="name">
                        <h2 class="name-warp">
                            <span class="title thide">T信念y</span>
                            <span class="lev u-lev-icn">8
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
                            <span class="item-cnt">
                                <strong class="num">0</strong>
                                <span class="text">动态</span>
                            </span>
                        </li>
                        <li class="item">
                            <span class="item-cnt">
                                <strong class="num">0</strong>
                                <span class="text">关注</span>
                            </span>
                        </li>
                        <li class="item">
                            <span class="item-cnt">
                                <strong class="num">0</strong>
                                <span class="text">粉丝</span>
                            </span>
                        </li>
                    </ul>
                    <div class="info">
                        <span>所在地：江西省-赣州市</span>
                        <span class="sep"> 年龄：95后</span>
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
            <div class="ranking-title">
                <h3 class="title">听歌排行</h3>
                <h4 class="listen-music-total">累积听歌3320首</h4>
                <span class="n-iconpoint">
                    <i class="tip-icn"></i>
                    <div class="tip">
                        <p>实际播放时间过短的歌曲将不纳入计算。</p>
                        <i class="t"></i>
                        <i class="b"></i>
                    </div>
                </span>
                <div class="nav">
                    <span class="time">最近一周</span>
                    <i class="line"></i>
                    <span class="time z-sel">所有时间</span>
                </div>
            </div>
            <div class="ranking-table-box">
                <ul class="table-ul">
                    <li class="item">
                        <div class="hd">
                            <i class="play-icn"></i>
                            <span class="index">1.</span>
                        </div>
                        <div class="song">
                            <div class="song-info">

                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import useUserStore from '@/stores/modules/user.ts';

const userStore = useUserStore();

onMounted(() => {
    userStore.setMenuIndex(-1);
    userStore.setSubMenuIndex(-1);
});
</script>

<style lang="scss" scoped>
.user-home{
    width: 980px;
    min-height: 700px;
    margin: 0 auto;
    background-color: #fff;
    border: 1px solid #d3d3d3;
    border-width: 0 1px;
    .user-box{
        padding: 40px;
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
                            // white-space: nowrap;
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
            .listen-music-total{
                float: left;
                display: inline;
                margin-top: 5px;
                margin-left: 10px;
                line-height: 26px;
                font-weight: 400;
                color: #666;
            }
            .n-iconpoint{
                position: relative;
                margin-left: 10px;
                left: -1px;
                top: 8px;
                line-height: 18px;
                z-index: 2;
                cursor: pointer;
                .tip-icn{
                    width: 18px;
                    height: 18px;
                    display: inline-block;
                    overflow: hidden;
                    vertical-align: middle;
                    background: url('@/assets/images/icon2.png') no-repeat;
                    background-position: 0 -50px;
                    cursor: pointer;
                    &:hover{
                        background-position: -20px -50px;
                    }
                }
                .tip{
                    position: absolute;
                    left: -33px;
                    top: 30px;
                    display: none;
                    width: 295px;
                    font-size: 12px;
                    line-height: 20px;
                    padding: 8px 19px 7px 19px;
                    z-index: 2;
                    color: #666;
                    background: url("@/assets/images/my-music/top_m.png") 0 0 repeat-y;
                    .t{
                        position: absolute;
                        width: 327px;
                        height: 16px;
                        left: 0;
                        top: -16px;
                        background: url("@/assets/images/my-music/top_t.png") 0 0 no-repeat;
                    }
                    .b{
                        position: absolute;
                        width: 327px;
                        height: 12px;
                        left: 0;
                        bottom: -12px;
                        background: url("@/assets/images/my-music/top_b.png") 0 0 no-repeat;
                    }
                }
                &:hover{
                    .tip{
                        display: block;
                    }
                }
            }
            .nav{
                position: absolute;
                z-index: 1;
                right: 0;
                bottom: 5px;
                .time{
                    line-height: 26px;
                    color: #666;
                    cursor: pointer;
                    float: left;
                    margin-left: 8px;
                }
                .line{
                    width: 1px;
                    height: 12px;
                    margin-top: 7px;
                    background-color: #999;
                    float: left;
                    margin-left: 8px;
                }
                .z-sel{
                    color: #333;
                    font-weight: 700;
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
        .ranking-table-box{
            margin-bottom: 36px;
            .table-ul{
                border: 1px solid #e2e2e2;
                border-top: none;
                .item{
                    height: 38px;
                    line-height: 38px;
                    overflow: hidden;
                    .hd{
                        float: left;
                        width: 72px;
                        height: 38px;
                        overflow: hidden;
                        .play-icn{
                            float: right;
                            display: inline;
                            margin-top: 10px;
                            width: 17px;
                            height: 17px;
                            cursor: pointer;
                            background: url('@/assets/images/my-music/table.png') no-repeat 0 9999px;
                            background-position: 0 -103px;
                        }
                        .index{
                            float: left;
                            display: inline;
                            padding-left: 5px;
                            padding-right: 8px;
                            width: 37px;
                            text-align: right;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            font-size: 16px;
                            color: #666;
                        }
                    }
                    .song{
                        float: left;
                        position: relative;
                        z-index: 1;
                        zoom: 1;
                        padding-left: 10px;
                        width: 480px;
                        height: 38px;
                        overflow: hidden;
                        .song-info{
                            float: left;
                            width: 100%;
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
            }
        }
    }
}
</style>