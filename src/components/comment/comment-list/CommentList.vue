<template>
    <ul class="comment-ul">
        <li class="hot-item">
            <div class="item-header">
                <img class="user-img" src="" alt="">
            </div>
            <div class="cntwrap">
                <div class="cntwrap-top cntwrap-brk">
                    <span class="user-name text-hov">情窦00初开</span>
                    <img class="brand-vip" src="@/assets/images/my-music/vip-6.png" alt="">
                    <span>：老人与海往上的歌可以移除了</span>
                </div>
                <div class="cntwrap-bottom">
                    <div class="time">2023年3月6日</div>
                    <span class="del">
                        <span class="review text-hov">删除</span>
                        <span class="line">|</span>
                    </span>
                    <span class="give text-hov">
                        <i class="icn no-like-icn"></i>
                        (145)
                    </span>
                    <span class="line">|</span>
                    <span class="review text-hov">回复</span>
                </div>
                <div class="comment-reply">
                    <div class="comment-content">
                        <Cmmtipt />
                        <div class="comment-corr">
                            <span class="arrline">◆</span>
                            <span class="arrclr">◆</span>
                        </div>
                    </div>
                </div>
            </div>
        </li>
        <li class="hot-item">
            <div class="item-header">
                <img class="user-img" src="" alt="">
            </div>
            <div class="cntwrap">
                <div class="cntwrap-top cntwrap-brk">
                    <span class="user-name text-hov">情窦00初开</span>
                    <img class="brand-vip" src="@/assets/images/my-music/vip-6.png" alt="">
                    <span>：老人与海往上的歌可以移除了</span>
                </div>
                <div class="cntwrap-bottom">
                    <div class="time">2023年3月6日</div>
                    <span class="del">
                        <span class="review text-hov">删除</span>
                        <span class="line">|</span>
                    </span>
                    <span class="give text-hov">
                        <i class="icn like-icn"></i>
                        (145)
                    </span>
                    <span class="line">|</span>
                    <span class="review text-hov">回复</span>
                </div>
            </div>
        </li>
        <li class="hot-item">
            <div class="item-header">
                <img class="user-img" src="" alt="">
            </div>
            <div class="cntwrap">
                <div class="cntwrap-top cntwrap-brk">
                    <span class="user-name text-hov">情窦00初开</span>
                    <img class="brand-vip" src="@/assets/images/my-music/vip-6.png" alt="">
                    <span>：老人与海往上的歌可以移除了</span>
                </div>
                <div class="cntwrap-center cntwrap-brk">
                    <span class="user-name text-hov">情窦00初开</span>
                    <img class="brand-vip" src="@/assets/images/my-music/vip-6.png" alt="">
                    <span>：老人与海往上的歌可以移除了</span>
                </div>
                <div class="cntwrap-bottom">
                    <div class="time">2023年3月6日</div>
                    <span class="del">
                        <span class="review text-hov">删除</span>
                        <span class="line">|</span>
                    </span>
                    <span class="give text-hov">
                        <i class="icn like-icn"></i>
                        (145)
                    </span>
                    <span class="line">|</span>
                    <span class="review text-hov">回复</span>
                </div>
            </div>
        </li>
    </ul>
</template>

<script setup lang="ts">
import Cmmtipt from '../cmmtipt/Cmmtipt.vue'
</script>
<style lang="scss" scoped>
.hot-item{
    padding: 15px 0;
    border-top: 1px dotted #ccc;
    .item-header{
        float: left;
        width: 50px;
        height: 50px;
        cursor: pointer;
        .user-img{
            width: 50px;
            height: 50px;
            vertical-align: middle;
        }
    }
    .cntwrap{
        margin-left: 60px;
        .cntwrap-brk{
            .user-name{
                margin-right: 5px;
                color: #0c73c2;
                cursor: pointer;
            }
            .brand-vip{
                height: 12px;
                margin-right: 5px;
                vertical-align: -1px;
            }
        }
        .cntwrap-top{
            width: 100%;
            overflow: hidden;
            line-height: 20px;
            color: #333;
        }
        .cntwrap-center{
            padding: 8px 19px;
            margin-top: 10px;
            line-height: 20px;
            background: #f4f4f4;
            border: 1px solid #dedede;
            color: #666;
        }
        .cntwrap-bottom{
            margin-top: 15px;
            text-align: right;
            .time{
                float: left;
                margin: 0 !important;
                color: #999;
            }
            .give{
                cursor: pointer;
                color: #333;
                .icn{
                    margin-right: 5px;
                    vertical-align: -2px;
                    margin-top: -4px;
                    width: 15px;
                    height: 14px;
                    display: inline-block;
                    overflow: hidden;
                    background: url('@/assets/images/icon2.png') no-repeat;
                }
                .like-icn{
                    background-position: -170px 0;
                }
                .no-like-icn{
                    background-position: -150px 0;
                }
            }
            .line{
                margin: 0 8px;
                color: #ccc;
            }
            .review{
                color: #666;
            }
        }
        .comment-reply{
            margin-bottom: 15px;
            margin-top: 10px;
            border: 1px solid #d9d9d9;
            border-radius: 2px;
            position: relative;
            .comment-content{
                padding: 15px;
                background: #f8f8f8;
                border: 1px solid #fcfcfc;
                border-radius: 2px;
                .comment-corr{
                    position: absolute;
                    top: -8px;
                    right: 5px;
                    width: 14px;
                    height: 14px;
                    overflow: hidden;
                    .arrline{
                        display: block;
                        font-family: "SimSun";
                        font-size: 15px;
                        font-style: normal;
                        font-weight: normal;
                        height: 10px;
                        line-height: normal;
                        color: #d9d9d9;
                    }
                    .arrclr{
                        display: block;
                        font-family: "SimSun";
                        font-size: 15px;
                        font-style: normal;
                        font-weight: normal;
                        height: 10px;
                        line-height: normal;
                        margin: -9px 0 0;
                        color: #f8f8f8;
                    }
                }
            }
        }
    }
}
</style>