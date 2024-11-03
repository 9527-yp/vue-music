<template>
    <div class="song-shere-info">
        <div class="user-cover">
            <img :src="playlist?.coverImgUrl" alt="">
            <span class="cover-msk"></span>
        </div>
        <div class="user-info-right">
            <div class="song-name">
                <i class="song-icn"></i>
                <h2>{{playlist?.name}}</h2>
            </div>
            <div class="user-info">
                <img class="user-img" :src="playlist?.creator?.avatarUrl" alt="">
                <span class="user-name thide text-hov">{{playlist?.creator?.nickname}}</span>
                <span class="create-time">{{formatDateTime(playlist?.createTime / 1000, 'Y-M-D')}} 创建</span>
            </div>
            <div class="btns">
                <span class="btns-bag" :class="playlist?.trackCount ? 'play' : 'disable-play'" title="播放"  @click="PlayListBtn">
                    <i class="i-box btns-bag">
                        <i class="play-icn btns-bag"></i>
                        播放
                    </i>
                </span>
                <span v-show="playlist?.trackCount" class="add btns-bag" title="添加到播放列表" @click="addPlayListBtn"></span>
                <span class="collect btns-bag btn-jointly">
                    <i class="collect-icn icn btns-bag">{{playlist?.subscribedCount ? '(' + playlist?.subscribedCount + ')' : '收藏'}}</i>
                </span>
                <span class="btns-bag btn-jointly" :class="playlist?.trackCount ? 'share' : 'disable-share'" @click="notFeatureTip">
                    <i class="share-icn icn btns-bag">{{playlist?.shareCount ? '(' + playlist?.shareCount + ')' : '分享'}}</i>
                </span>
                <span class="btns-bag btn-jointly" :class="playlist?.trackCount ? 'down' : 'disable-down'" @click="notFeatureTip">
                    <i class="down-icn icn btns-bag">下载</i>
                </span>
                <span class="btns-bag btn-jointly" :class="playlist?.trackCount ? 'review' : 'disable-review'" @click="jumpToComment">
                    <i class="review-icn icn btns-bag">{{playlist?.commentCount ? '(' + playlist?.commentCount + ')' : '评论'}}</i>
                </span>
            </div>
            <div class="tag-box" v-if="playlist?.tags && playlist?.tags.length > 0">
                <span class="tag-label">标签：</span>
                <div class="tag-item" v-for="item in playlist?.tags">
                    <i class="text">{{item}}</i>
                </div>
            </div>
            <div class="introduce" v-if="playlist.description">
                <span class="label">介绍：{{playlist.description}}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatDateTime } from '@/utils/utils.ts';
import type { songType } from '@/hooks/methods/songFormat.ts';
import useSongAddPlaylist from '@/hooks/useSongAddPlayList.ts';
import usePlaySong from '@/hooks/usePlaySong.ts';
import usePlayStore from '@/stores/modules/play.ts';

const props = defineProps({
    playlist: {
        type: Object,
        default: {}
    },
    privileges: {
        type: Array,
        default: []
    }
})
const playStore = usePlayStore();
// 播放显示/隐藏
const lock = computed(() => playStore.getplayLock);

const emit = defineEmits(['jumpToComment', 'notFeatureTip']);

function jumpToComment() {
    emit('jumpToComment')
}

function notFeatureTip() {
    emit('notFeatureTip')
}

// 歌曲是否有版权
function isCopyright(id: number): boolean | undefined {
  const privilege = props.privileges?.find(
    (item: { id: number }) => item.id === id
  );

  if (privilege?.cp === 0) {
    return true;
  }

  return false;
}

// 添加到播放列表
let timer = null;
function addPlayListBtn(): boolean | undefined {
    if (props.playlist?.tracks?.length === 0) {
        return;
    }

    // 过滤无版权
    const songList: SongType[] = props.playlist?.tracks.filter(
        (item: { id: number }) => !isCopyright(item.id)
    );

    // 将歌曲添加到播放列表
    useSongAddPlaylist(songList)

    playStore.setAddPlayListTip(true)
    playStore.setAddPlayListTipText('已添加到播放列表')
    if(!lock.value){
        playStore.setPlayLock(true)
    }
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
        playStore.setPlayLock(false)
        playStore.setAddPlayListTip(false)
    }, 1500)
}

// 播放列表歌曲
function PlayListBtn(): boolean | undefined {
    if (props.playlist?.tracks?.length === 0) {
        return;
    }

    // 过滤无版权
    const songList: SongType[] = props.playlist?.tracks.filter(
        (item: { id: number }) => !isCopyright(item.id)
    );

    // 将歌曲添加到播放列表 - 清空当前播放列表
    useSongAddPlaylist(songList, {clear: true})
    // 播放第一首歌
    usePlaySong(songList[0])

    playStore.setAddPlayListTip(true)
    playStore.setAddPlayListTipText('已开始播放')
    if(!lock.value){
        playStore.setPlayLock(true)
    }
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
        playStore.setPlayLock(false)
        playStore.setAddPlayListTip(false)
    }, 1500)
}
</script>

<style lang="scss" scoped>
.song-shere-info{
    padding: 40px;
    display: flex;
    .user-cover{
        position: relative;
        width: 200px;
        height: 200px;
        min-width: 200px;
        img{
            width: 100%;
            height: 100%;
        }
        .cover-msk{
            position: absolute;
            top: -4px;
            left: -4px;
            width: 208px;
            height: 208px;
            background: url('@/assets/images/home/name-D5CGUEo8.png') no-repeat;
            background-position: 0 -1285px;
        }
    }
    .user-info-right{
        width: 100%;
        margin-left: 30px;
        .song-name{
            margin: 0 0 12px;
            vertical-align: top;
            .song-icn{
                display: inline-block;
                vertical-align: top;
                width: 54px;
                height: 24px;
                margin-right: 6px;
                background: url('@/assets/images/icon.png') no-repeat;
                background-position: 0 -243px;
            }
            h2{
                width: 370px;
                display: inline-block;
                vertical-align: top;
                font-size: 20px;
                font-weight: normal;
                line-height: 24px;
                font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                word-wrap: normal;
            }
        }
        .user-info{
            width: 100%;
            height: 35px;
            margin: 0 0 20px;
            display: flex;
            align-items: center;
            .user-img{
                width: 35px;
                height: 35px;
                margin-right: 10px;
                cursor: pointer;
            }
            .user-name{
                max-width: 210px;
                margin-right: 15px;
                cursor: pointer;
                color: #0c73c2;
            }
            .create-time{
                color: #999;
            }
        }
        .btns{
            width: 100%;
            height: 31px;
            margin-bottom: 25px;
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
            .disable-play{
                width: 67px;
                margin-right: 8px;
                color: #bebebe;
                cursor: default;
                background-position: right -934px;
                .i-box{
                    display: inline-block;
                    height: 31px;
                    line-height: 29px;
                    padding: 0 7px 0 8px;
                    color: #bebebe;
                    background-position: 0 -891px;
                    cursor: default;
                    .play-icn{
                        display: inline-block;
                        vertical-align: top;
                        width: 20px;
                        height: 18px;
                        margin: 6px 2px 2px 0;
                        background-position: 0 9999px;
                        overflow: hidden;
                    }
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
                background-position: right -1192px;
                .collect-icn{
                    color: #bebebe;
                    background-position: 0 -1149px;
                    cursor: default;
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
            .disable-share{
                color: #bebebe;
                background-position: right -1192px;
                cursor: default;
                .share-icn{
                    color: #bebebe;
                    background-position: 0 -1311px;
                }
            }
            .disable-down{
                color: #bebebe;
                background-position: right -1192px;
                cursor: default;
                .down-icn{
                    color: #bebebe;
                    background-position: 0 -3024px;
                }
            }
            .disable-review{
                color: #bebebe;
                background-position: right -1192px;
                cursor: default;
                .review-icn{
                    color: #bebebe;
                    background-position: 0 -1551px;
                }
            }
        }
        .tag-box{
            margin-bottom: 5px;
            display: flex;
            align-items: center;
            .tag-label{
                color: #666;
            }
            .tag-item{
                padding: 0 10px 0 0;
                height: 22px;
                line-height: 22px;
                text-shadow: 0 1px #fdfdfd;
                background: url('@/assets/images/login/button-bag.png') no-repeat;
                background-position: right -27px;
                color: #777;
                text-decoration: none;
                margin-right: 5px;
                cursor: pointer;
                .text{
                    display: inline-block;
                    padding: 0 3px 0 13px;
                    background: url('@/assets/images/login/button-bag.png') no-repeat;
                    background-position: 0 0;
                    height: 22px;
                    line-height: 22px;
                }
                &:hover{
                    background-position: right -1430px;
                    .text{
                        background-position: 0 -1400px;
                    }
                }
            }
        }
        .introduce{
            margin-top: 4px;
            line-height: 18px;
            color: #666;
        }
    }
}
</style>