<template>
    <div class="info">
        <div class="info-box">
            <div class="music-cvrwrap">
                <div class="m-cover">
                    <img class="u-cover" :src="`${songDetailData.songs?.[0]?.al?.picUrl}?param=130y130`" alt="">
                    <span class="m-cover-msk"></span>
                </div>
                <div class="player">
                    <i class="player-icn"></i>
                    <a
                        class="text"
                        :href="`https://music.163.com/#/outchain/1/${id}`"
                    >
                        生成外链播放器
                    </a>
                </div>
                <div class="open-client">打开客户端</div>
            </div>
            <div class="music-cnt">
                <div class="hed">
                    <i class="til-icn"></i>
                    <span class="til">{{songDetailData.songs?.[0]?.name}}</span>
                </div>
                <p class="des">
                    歌手：
                    <template v-for="(item, index) in songDetailData.songs?.[0]?.ar" :key="item.id">
                        <span class="text">{{item.name}}</span>
                        <i v-show="index !== songDetailData.songs[0].ar.length-1">/</i>
                    </template>
                    
                </p>
                <p class="des">
                    所属专辑：
                    <span class="text">{{songDetailData.songs?.[0]?.al?.name}}</span>
                </p>
                <div class="m-btns">
                    <span class="btns-bag play" title="播放">
                        <i class="i-box btns-bag">
                            <i class="play-icn btns-bag"></i>
                            播放
                        </i>
                    </span>
                    <span class="add btns-bag" title="添加到播放列表"></span>
                    <span class="btns-bag btn-jointly collect">
                        <i class="collect-icn icn btns-bag">收藏</i>
                    </span>
                    <span class="btns-bag btn-jointly share">
                        <i class="share-icn icn btns-bag">分享</i>
                    </span>
                    <span class="btns-bag btn-jointly down">
                        <i class="down-icn icn btns-bag">下载</i>
                    </span>
                    <span class="btns-bag btn-jointly review">
                        <i class="review-icn icn btns-bag">评论</i>
                    </span>
                </div>
                <div class="lyric-cnt">
                    <ul 
                        class="lyric-list"
                        :class="[
                            { 'lyric-list-auto': list?.length < 13 || toggleShow }
                        ]"
                    >
                        <li class="lyric-list-item" v-for="(item, index) in list" :key="index">{{item.lyric}}</li>
                    </ul>
                    <div class="crl" @click="toggleShow = !toggleShow">
                        <span class="text-hov">{{toggleShow ? '收起' : '展开'}}<i class="crl-icn" :class="toggleShow ? 'hide' : ''"></i></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
    const props = defineProps({
        songDetailData: {
            type: Object,
            default: {}
        },
        list: {
            type: Array,
            default: []
        },
        id: {
            type: String,
            default: 0
        }
    })

    const toggleShow = ref(false);
</script>

<style lang="scss" scoped>
.info{
    margin-top: -10px;
    .music-cvrwrap{
        float: left;
        width: 206px;
        margin-right: -226px;
        .m-cover{
            float: left;
            width: 198px;
            height: 198px;
            position: relative;
            .u-cover{
                width: 130px;
                height: 130px;
                margin: 34px;
                display: block;
            }
            .m-cover-msk{
                position: absolute;
                width: 206px;
                height: 205px;
                top: -4px;
                left: -4px;
                background: url('@/assets/images/home/name-D5CGUEo8.png') no-repeat;
                background-position: -140px -580px;
            }
        }
        .player{
            float: left;
            margin: 20px 0 0 46px;
            color: #666;
            .player-icn{
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
                text-decoration: underline;
            }
        }
        .open-client{
            float: left;
            margin: 10px 0 0 12px;
            width: 176px;
            height: 34px;
            color: rgb(40, 50, 72);
            text-align: center;
            line-height: 34px;
            border-radius: 6px;
            background: rgba(40, 50, 72, 0.03);
            cursor: pointer;
            border: 1px solid rgba(40, 50, 72, 0.25);
        }
        &:after{
            clear: both;
            content: '.';
            display: block;
            height: 0;
            visibility: hidden;
        }
    }
    .music-cnt{
        float: right;
        width: 414px;
        .hed{
            .til-icn{
                display: inline-block;
                width: 54px;
                height: 24px;
                background: url('@/assets/images/icon.png') no-repeat;
                background-position: 0 -463px;
                overflow: hidden;
                vertical-align: middle;
            }
            .til{
                display: inline-block;
                margin-left: 10px;
                font-size: 24px;
                vertical-align: middle;
                font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
            }
        }
        .des{
            margin: 10px 0;
            color: #999;
            .text{
                cursor: pointer;
                color: #0c73c2;
            }
        }
        .m-btns{
            margin-bottom: 25px;
            width: 100%;
            height: 31px;
            display: flex;
            align-items: center;
            .btns-bag{
                background: url('@/assets/images/login/button-bag.png') no-repeat;
            }
            .play{
                padding: 0 5px 0 0;
                line-height: 29px;
                white-space: nowrap;
                overflow: hidden;
                text-align: center;
                cursor: pointer;
                color: #fff;
                background-position: right -428px;
                .i-box{
                    display: inline-block;
                    height: 31px;
                    line-height: 29px;
                    padding: 0 7px 0 8px;
                    background-position: 0 -387px;
                    .play-icn{
                        display: inline-block;
                        vertical-align: top;
                        width: 20px;
                        height: 18px;
                        margin: 6px 2px 2px 0;
                        background-position: 0 -1622px;
                        overflow: hidden;
                    }
                }
                &:hover{
                    color: #fff;
                    background-position: right -510px;
                    .i-box{
                        background-position: 0 -469px;
                    }
                    .play-icn{
                        background-position: -28px -1622px;
                    }
                }
            }
            .add{
                margin-right: 5px;
                font-family: simsun, \5b8b\4f53;
                width: 31px;
                margin-left: -3px;
                height: 31px;
                line-height: 30px;
                min-width: 23px;
                cursor: pointer;
                background-position: 0 -1588px;
                &:hover{
                    background-position: -40px -1588px;
                }
            }
            .btn-jointly{
                margin-right: 6px;
                font-family: simsun, \5b8b\4f53;
                color: #333;
                padding: 0 5px 0 0;
                white-space: nowrap;
                cursor: pointer;
                .icn{
                    display: inline-block;
                    height: 31px;
                    line-height: 30px;
                    min-width: 23px;
                    padding-right: 2px;
                    padding-left: 28px;
                }
            }
            .collect{
                background-position: right -1020px;
                .collect-icn{
                    background-position: 0 -977px;
                }
            }
            .share{
                background-position: right -1020px;
                .share-icn{
                    background-position: 0 -1225px;
                }
                &:hover{
                    background-position: right -1106px;
                    .share-icn{
                        background-position: 0 -1268px;
                    }
                }
            }
            .down{
                background-position: right -1020px;
                .down-icn{
                    background-position: 0 -2761px;
                }
                &:hover{
                    background-position: right -1106px;
                    .down-icn{
                        background-position: 0 -2805px;
                    }
                }
            }
            .review{
                background-position: right -1020px;
                .review-icn{
                    background-position: 0 -1465px;
                }
                &:hover{
                    background-position: right -1106px;
                    .review-icn{
                        background-position: 0 -1508px;
                    }
                }
            }
        }
        .lyric-cnt{
            // height: auto;
            margin-top: 13px;
            line-height: 23px;
            word-wrap: break-word;
            word-break: break-word;
            white-space: normal;
            display: inline-block;
            .crl{
                margin-top: 5px;
                color: #0c73c2;
                .crl-icn{
                    width: 11px;
                    height: 8px;
                    display: inline-block;
                    overflow: hidden;
                    vertical-align: middle;
                    background: url('@/assets/images/icon.png') no-repeat;
                    background-position: -65px -520px;
                }
                .hide{
                    background-position: -45px -520px;
                }
            }
            .lyric-list{
                height: 306px;
                overflow: hidden;
                line-height: 23px;
                color: #333;
                .lyric-list-item{
                    min-height: 21px;
                    margin-bottom: 1px;
                }
            }
            .lyric-list-auto{
                height: auto;
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
    &:after{
        clear: both;
        content: '.';
        display: block;
        height: 0;
        visibility: hidden;
    }
}
</style>