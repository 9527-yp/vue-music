<template>
    <div class="dj-header">
        <div class="m-cover">
            <img class="img" :src="`${djInfo?.coverUrl}?param=140v140`" alt="">
        </div>
        <div class="m-cnt">
            <div class="topblk2">
                <i class="u-icn"></i>
                <div class="dj-tit">
                    <h2>{{djInfo?.name}}</h2>
                </div>
            </div>
            <div class="rdiname">
                <i class="rdiname-icn"></i>
                <span class="txt text-hov">{{djInfo?.radio?.name}}</span>
                <span class="subscribe icn-bag m-btn">
                    <i class="icn-bag m-btn">
                        <em class="sub-icn"></em>
                        订阅({{djInfo?.radio?.subCount}})
                    </i>
                </span>
            </div>
        </div>
    </div>
    <div class="m-prointr">
        <div class="btns">
            <span class="play-icn btn icn-bag">
                <i class="icn-bag btn">播放 15分28秒</i>
            </span>
            <span class="like-icn icn-bag like-btn">
                <i class="icn-bag like-btn">
                    <em class="icn-em icn-bag"></em>
                    <span>{{djInfo?.likedCount ? '(' + djInfo?.likedCount + ')' : '点赞'}}</span>
                </i>
            </span>
            <span class="commit-icn btn icn-bag not-exploit-btn">
                <i class=" btn icn-bag">{{djInfo?.commentCount ? '(' + djInfo?.commentCount + ')' : '评论'}}</i>
            </span>
            <span class="share-icn btn icn-bag not-exploit-btn">
                <i class="btn icn-bag">{{djInfo?.shareCount ? '(' + djInfo?.shareCount + ')' : '分享'}}</i>
            </span>
            <span class="down-icn btn icn-bag not-exploit-btn">
                <i class="btn icn-bag">下载</i>
            </span>
            <span class="u-outlink">
                <i class="music-icn"></i>
                <a class="link text-hov" href="">生成外联播放器</a>
            </span>
        </div>
        <div class="sub">
            <span class="sub-tag">音乐播客</span>
            <strong>
                <span class="sub-from thide">{{djInfo?.radio?.name}}</span>第{{djInfo?.serialNum}}期
            </strong>
            <span class="sep">{{formatDateTime(djInfo?.createTime / 1000, 'Y-M-D')}} 创建</span>
            <span class="sep">
                播放：<em class="count">{{djInfo?.listenerCount}}</em>次
            </span>
        </div>
        <p class="description" v-for="(item, index) in programDesc" :key="index">{{item.content}}</p>
        <div class="spread" v-show="programDesc.length > 10">
            <span class="text text-hov" @click="unfoldDesc">
                {{descIsTotal ? '收起' : '展开'}}
                <i class="spread-icn" :class="descIsTotal ? 'unfold' : 'pack'"></i>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { formatDateTime } from '@/utils/utils';

const props = defineProps({
    djInfo: {
        type: Object,
        default: () => {}
    }
})

watch(() => props.djInfo, () => {
    programDesc.value = props?.djInfo?.programDesc.slice(0,10)
})

const descIsTotal = ref(false);
let programDesc =  ref([])
function unfoldDesc() {
    descIsTotal.value = !descIsTotal.value
    if(descIsTotal.value){
        programDesc = props.djInfo?.programDesc
    }else{
        programDesc = props.djInfo?.programDesc.slice(0,10)
    }
}
</script>

<style lang="scss" scoped>
.dj-header{
    .m-cover{
        padding: 3px;
        width: 140px;
        height: 140px;
        border: 1px solid #d5d5d5;
        display: inline-block;
        vertical-align: top;
        .img{
            display: block;
            width: 100%;
            height: 100%;
        }
    }
    .m-cnt{
        display: inline-block;
        vertical-align: top;
        margin-left: 24px;
        padding-top: 18px;
        max-width: 465px;
        .topblk2{
            line-height: 24px;
            margin-bottom: 29px;
            .u-icn{
                width: 73px;
                height: 24px;
                float: left;
                overflow: hidden;
                vertical-align: middle;
                background: url('@/assets/images/icon2.png') no-repeat;
                background-position: 0 -75px;
            }
            .dj-tit{
                margin-left: 80px;
                position: relative;
                h2{
                    line-height: 24px;
                    font-size: 20px;
                    font-weight: normal;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                    font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
                }
            }
        }
        .rdiname{
            line-height: 26px;
            .rdiname-icn{
                float: left;
                margin: 5px 7px 0 0;
                width: 16px;
                height: 17px;
                background: url('@/assets/images/icon2.png') no-repeat;
                background-position: -50px -20px;
            }
            .txt{
                color: #666;
                font-size: 16px;
                font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
                float: left;
            }
            .icn-bag{
                cursor: pointer;
                background: url('@/assets/images/login/button-bag.png') no-repeat;
            }
            .m-btn{
                min-width: 23px;
                height: 28px;
                overflow: hidden;
                float: left;
                line-height: 29px;
            }
            .subscribe{
                margin-left: 17px;
                color: #333;
                padding: 0 5px 0 0;
                background-position: right -2400px;
                i{
                    padding: 0 10px;
                    background-position: 0 -2370px;
                    .sub-icn{
                        float: left;
                        margin: 7px 4px 0 0;
                        width: 14px;
                        height: 14px;
                        font-style: normal;
                        background: url('@/assets/images/icon2.png') no-repeat;
                        background-position: -50px 0;
                    }
                }
                &:hover{
                    background-position: right -2470px;
                    i{
                        background-position: 0 -2440px;
                    }
                }
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
.m-prointr{
    margin-top: 20px;
    .btns{
        margin-bottom: 25px;
        .icn-bag{
            color: #fff;
            background: url('@/assets/images/login/button-bag.png') no-repeat;
        }
        .btn{
            float: left;
            height: 31px;
            line-height: 30px;
            min-width: 23px;
            cursor: pointer;
        }
        .play-icn{
            margin-right: 10px;
            padding: 0 5px 0 0;
            white-space: nowrap;
            background-position: right -676px;
            i{
                padding: 0 7px 0 36px;
                background-position: 0 -633px;
            }
            &:hover{
                background-position: right -762px;
                i{
                    background-position: 0 -719px;
                }
            }
        }
        .like-btn{
            color: #333;
            height: 31px;
            line-height: 31px;
            overflow: hidden;
            vertical-align: top;
            text-align: center;
            cursor: pointer;
        }
        .like-icn{
            float: left;
            margin-right: 10px;
            padding: 0 5px 0 0;
            background-position: right -100px;
            i{
                padding: 0 5px 0 10px;
                display: inline-block;
                background-position: 0 -59px;
                em{
                    float: left;
                    width: 17px;
                    height: 15px;
                    margin: 8px 6px 0 0;
                    background-position: 0 -95px;
                }
            }
            &:hover{
                background-position: right -182px;
                i{
                    background-position: 0 -141px;
                }
            }
        }
        .not-exploit-btn{
            margin-right: 10px;
            color: #333;
            padding: 0 5px 0 0;
            background-position: right -1020px;
            i{
                padding-right: 2px;
                padding-left: 28px;
                color: #333;
            }
        }
        .commit-icn{
            i{
                background-position: 0 -1465px;
            }
            &:hover{
                background-position: right -1106px;
                i{
                    background-position: 0 -1508px;
                }
            }
        }
        .share-icn{
            i{
                background-position: 0 -1225px;
            }
            &:hover{
                background-position: right -1106px;
                i{
                    background-position: 0 -1268px;
                }
            }
        }
        .down-icn{
            i{
                background-position: 0 -2761px;
            }
            &:hover{
                background-position: right -1106px;
                i{
                    background-position: 0 -2805px;
                }
            }
        }
        .u-outlink{
            float: left;
            margin-left: 16px;
            margin-top: 7px;
            .music-icn{
                width: 16px;
                height: 16px;
                display: inline-block;
                overflow: hidden;
                vertical-align: middle;
                background: url('@/assets/images/icon.png') no-repeat;
                background-position: -34px -863px;
            }
            .link{
                color: #0c73c2;
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
    .sub{
        height: 35px;
        line-height: 35px;
        .sub-tag{
            display: inline-block;
            margin: -3px 9px 0 0;
            position: relative;
            top: -1px;
            height: 16px;
            overflow: hidden;
            padding: 0 6px;
            border: 1px solid #999;
            line-height: 16px;
            vertical-align: middle;
            font-size: 12px;
            cursor: pointer;
            color: #cc0000;
            border-color: #cc0000;
        }
        strong{
            font-size: 14px;
        }
        .sub-from{
            display: inline-block;
            padding-bottom: 2px;
            max-width: 42%;
            margin-right: 5px;
            vertical-align: middle;
        }
        .sep{
            margin-left: 18px;
            color: #999;
            .count{
                color: #c20c0c;
                font-weight: bold;
                font-style: normal;
            }
        }
    }
    .description{
        line-height: 23px;
        min-height: 23px;
        color: #666;
    }
    .spread{
        .text{
            color: #0c73c2;
            float: right;
            cursor: pointer;
        }
        .spread-icn{
            width: 11px;
            height: 8px;
            display: inline-block;
            overflow: hidden;
            vertical-align: middle;
            background: url('@/assets/images/icon.png') no-repeat;
            background-position: -65px -520px;
        }
        .unfold{
            background-position: -45px -520px;
        }
        .pack{
            background-position: -65px -520px;
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
</style>