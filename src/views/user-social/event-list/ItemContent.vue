<template>
    <!-- 分享单曲 -->
    <div class="item-content" v-if="item.type === 18">
        <div class="cover cover-play">
            <span>
                <img class="img" :src="`${item?.jsonData?.song?.album?.picUrl}?param=40y40&quality=100`" alt="">
            </span>
            <i class="play-icn"></i>
        </div>
        <div class="scnt">
            <h3 class="tit thide">
                <span class="text-hov tit-name">{{item.jsonData?.song?.name}}</span>
            </h3>
            <h4 class="singer thide">
                <span v-for="(key, i) in item?.jsonData?.song?.artists" :key="i">
                    <span class="text-hov">{{key.name}}</span><i v-show="i !== item?.jsonData?.song?.artists.length -1">\</i>
                </span>
            </h4>
        </div>
    </div>
    <!-- 分享电台节目 -->
    <div class="item-content" v-if="item.type === 17">
        <div class="cover cover-play">
            <span>
                <img class="img" :src="`${item?.jsonData?.program?.coverUrl}?param=40y40&quality=100`" alt="">
            </span>
            <i class="play-icn"></i>
        </div>
        <div class="scnt">
            <h3 class="tit thide">
                <span class="text-hov tit-name">{{item.jsonData?.program?.mainSong?.name}}</span>
            </h3>
            <h4 class="singer thide">
                <span class="progra-tag">情感 <i class="progra-icn"></i></span>
                <span class="text-hov">{{item.jsonData?.program?.radio?.name}}</span>
            </h4>
        </div>
    </div>
    <!-- 分享电台节目 -->
    <div class="item-content" v-if="item.type === 28">
        <div class="cover cover-play">
            <span>
                <img class="img" :src="`${item?.jsonData?.djRadio?.picUrl}?param=40y40&quality=100`" alt="">
            </span>
            <!-- <i class="play-icn"></i> -->
        </div>
        <div class="scnt">
            <h3 class="tit thide">
                <span class="progra-tag">二次元 <i class="progra-icn"></i></span>
                <span class="text-hov tit-name">{{item.jsonData?.djRadio?.name}}</span>
            </h3>
            <h4 class="singer thide">
                by
                <span class="text-hov">{{item.jsonData?.djRadio?.dj?.nickname}}</span>
            </h4>
        </div>
    </div>
    <!-- 分享专辑 -->
    <div class="item-content" v-if="item.type === 19">
        <div class="cover cover-play">
            <span>
                <img class="img" :src="`${item?.jsonData?.album?.picUrl}?param=40y40&quality=100`" alt="">
            </span>
            <i class="play-icn"></i>
        </div>
        <div class="scnt">
            <h3 class="tit thide">
                <span class="progra-tag">专辑 <i class="progra-icn"></i></span>
                <span class="text-hov tit-name">{{item.jsonData?.album?.name}}</span>
            </h3>
            <h4 class="singer thide">
                <span class="text-hov">{{item?.jsonData?.album?.artist?.name}}</span>
            </h4>
        </div>
    </div>
    <!-- 分享歌单 -->
    <div class="item-content" v-if="item.type === 13">
        <div class="cover cover-play">
            <span>
                <img class="img" :src="`${item?.jsonData?.playlist?.coverImgUrl}?param=40y40&quality=100`" alt="">
            </span>
            <!-- <i class="play-icn"></i> -->
        </div>
        <div class="scnt">
            <h3 class="tit thide">
                <span class="progra-tag">歌单 <i class="progra-icn"></i></span>
                <span class="text-hov tit-name">{{item.jsonData?.playlist?.name}}</span>
            </h3>
            <h4 class="singer thide">
                by
                <span class="text-hov">{{item?.jsonData?.playlist?.creator?.nickname}}</span>
            </h4>
        </div>
    </div>
    <!-- 分享网页 -->
    <div class="item-content" v-if="item.type === 56">
        <div class="cover cover-play">
            <span>
                <img class="img" :src="`${item?.jsonData?.resource?.coverImgUrl}`" alt="">
            </span>
        </div>
        <div class="scnt web">
            <h3 class="tit thide">
                <span class="text-hov tit-name">{{item.jsonData?.resource?.title}}</span>
            </h3>
        </div>
    </div>
    <!-- 转发 -->
    <div class="item-content" v-if="item.type === 22">
        <div class="retrans-tit">
            <span class="activity text-hov">{{item?.jsonData?.event?.user?.nickname}}</span>
                <span v-html="item?.jsonData?.event?.jsonData?.msg"></span>
                <br v-if="item?.jsonData?.event?.actName && item?.jsonData?.event?.jsonData?.msg" />
                <span v-if="item?.jsonData?.event?.actName" class="activity text-hov">#{{item?.jsonData?.event?.actName}}#</span>
        </div>
        <div class="retrans-content">
            <!-- 再次调用 -->
            <ItemContent :item="item?.jsonData?.event" />
            <!-- 图片 -->
            <div class="user-upload">
                <ul class="upload-ul" v-if="item?.jsonData?.event?.pics.length > 0">
                    <li class="item-pic" v-for="(img, j) in item?.jsonData?.event?.pics" :key="j">
                        <img class="pic" :src="img.originUrl" alt="">
                    </li>
                </ul>
            </div>
            <div class="doper">
                <span class="like text-hov">
                    <i class="icn" :class="{'like-icn': item?.jsonData?.event?.xInfo?.info?.liked}"></i>
                    <span v-if="item?.jsonData?.event?.xInfo?.info?.likedCount">({{item?.jsonData?.event?.xInfo?.info?.likedCount}})</span>
                </span>
                <span class="line">|</span>
                <span class="forward text-hov">
                    转发
                    <span v-if="item?.jsonData?.event?.xInfo?.insiteForwardCount">({{item?.jsonData?.event?.xInfo?.insiteForwardCount}})</span>
                </span>
                <span class="line">|</span>
                <span class="forward text-hov">
                    评论
                    <span v-if="item?.jsonData?.event?.xInfo?.info?.commentCount">({{item?.jsonData?.event?.xInfo?.info?.commentCount}})</span>
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "ItemContent"
})


defineProps({
    item: {
        type: Object,
        default: {}
    }
})
</script>


<style lang="scss" scoped>
.item-content{
    background: #f5f5f5;
    display: block;
    position: relative;
    padding: 10px;
    margin: 4px 0 5px;
    .cover{
        position: relative;
        zoom: 1;
        width: 40px;
        height: 40px;
        float: left;
        .img{
            width: 40px;
            height: 40px;
        }
        .play-icn{
            z-index: 200;
            position: absolute;
            top: 0;
            left: 0;
            width: 40px;
            height: 40px;
            margin: 0;
            opacity: 0.8;
            cursor: pointer;
            background: url('@/assets/images/social/sprite.png') no-repeat;
            background-position: -100px -70px;
        }
    }
    .scnt{
        display: block;
        position: absolute;
        top: 10px;
        left: 60px;
        right: 30px;
        height: 40px;
        line-height: 22px;
        .tit{
            font-weight: normal;
            margin-top: -2px;
            font-size: 14px;
            .tit-name{
                color: #333;
                &:hover{
                    color: #000;
                }
            }
            .progra-tag{
                margin-right: 6px;
                color: #e03f40;
                padding: 0 2px 0 3px;
                line-height: 16px;
                position: relative;
                display: inline-block;
                height: 16px;
                font-size: 12px;
                background: url('@/assets/images/social/sprite.png') no-repeat;
                background-position: -110px 0;
            }
            .progra-icn{
                position: absolute;
                top: 0;
                right: 0px;
                width: 3px;
                height: 16px;
                font-size: 12px;
                background: url('@/assets/images/social/sprite.png') no-repeat;
                background-position: right 0;
            }
        }
        .singer{
            font-weight: normal;
            color: #666;
            font-size: 100%;
            .progra-tag{
                margin-right: 6px;
                color: #e03f40;
                padding: 0 2px 0 3px;
                line-height: 16px;
                position: relative;
                display: inline-block;
                height: 16px;
                font-size: 12px;
                background: url('@/assets/images/social/sprite.png') no-repeat;
                background-position: -110px 0;
            }
            .progra-icn{
                position: absolute;
                top: 0;
                right: 0px;
                width: 3px;
                height: 16px;
                font-size: 12px;
                background: url('@/assets/images/social/sprite.png') no-repeat;
                background-position: right 0;
            }
        }
    }
    .web{
        line-height: 40px;
    }
    .retrans-tit{
        color: #666;
        font-size: 12px;
        line-height: 24px;
        word-wrap: break-word;
        word-break: break-word;
        white-space: normal;
        .activity{
            color: #0c73c2;
        }
    }
    .retrans-content{
        .doper{
            opacity: .5;
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
.retrans-content{
    .item-content{
        background: #fff;
    }
    .upload-ul{
        .item-pic{
            width: auto !important;
            height: auto !important;
            // clear: left;
            float: left;
            position: relative;
            zoom: 1;
            // width: 224px;
            // height: 224px;
            margin-left: 4px;
            margin-top: 4px;
            background-color: #e5e5e5;
            background-repeat: no-repeat;
            background-position: center center;
            .pic{
                min-width: 170px;
                max-height: 338px;
                height: auto;
                display: block;
                width: 100%;
                cursor: pointer;
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
    .doper{
        margin: 18px 0 -2px;
        text-align: right;
        line-height: normal;
        .like{
            color: #0c73c2;
            .icn{
                display: inline-block;
                vertical-align: top;
                margin: 0px 3px 0 0;
                width: 14px;
                height: 14px;
                background: url('@/assets/images/social/sprite.png') no-repeat;
                background-position: 0 -20px;
            }
            .like-icn{
                background-position: -20px -20px;
            }
        }
        .line{
            color: #c7c7c7;
            margin: 0 10px 0 12px;
        }
        .forward{
            color: #0c73c2;
        }
    }
}
</style>