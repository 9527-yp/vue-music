<template>
    <div class="play-list-box" v-if="playListShow">
        <div class="play-list-hd">
            <div class="list-hd-c">
                <div class="hd-title">播放列表({{playSongList.length}})</div>
                <div class="hd-collectTotal text-hov">
                    <i class="icn icn-add"></i>
                    收藏全部
                </div>
                <span class="line"></span>
                <div class="hd-clear text-hov">
                    <i class="icn icn-del"></i>
                    清除
                </div>
                <div class="hd-song-name">{{ playSongItem.name }}</div>
                <div class="hd-close" @click="closePlayList"></div>
            </div>
        </div>
        <div class="play-list-bd">
            <div class="msk"></div>
            <div class="list-c">
                <ul class="list-ul">
                    <li class="item" :class="item.id === playSongItem.id ? 'item-active' : ''" v-for="(item, index) in playSongList" :key="item.id">
                        <div class="active">
                            <i class="icn" v-show="item.id === playSongItem.id"></i>
                        </div>
                        <div class="col item-name">{{ item.name }}</div>
                        <div class="col item-icn-box">
                            <div class="item-icn">
                                <i class="icn icn-add" title="收藏"></i>
                                <i class="icn icn-share" title="分享"></i>
                                <i class="icn icn-dl" title="下载"></i>
                                <i class="icn icn-del" title="删除"></i>
                            </div>
                        </div>
                        <div class="col item-Singer text-hov">
                            <span v-for="(item, index) in item.artists" :key="item.id" :title="item.name">{{item.name}}<i v-show="index !== playSongItem.artists.length-1">/</i></span>
                        </div>
                        <div class="col item-duration">{{ timeStampToDuration(item.duration / 1000) || '00:00' }}</div>
                        <div class="col item-Share">
                            <i class="icn-Share"></i>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import usePlayStore from '@/stores/modules/play.ts';
import { timeStampToDuration } from '@/utils/utils.ts'

const playStore = usePlayStore();

const playListShow = defineModel('playListShow', {
    type: Boolean,
    default: false
})

// 当前播放的歌曲详情
const playSongItem = computed(() => playStore.getPlaySongItem)
// 播放列表数据
const playSongList = computed(() => playStore.playSongList)

function closePlayList() {
    playListShow.value = false
}
</script>

<style lang="scss" scoped>
.play-list-box{
  width: 986px;
  height: 301px;
  position: absolute;
  left: 50%;
  bottom: 47px;
  transform: translateX(-50%);
  .play-list-hd{
    height: 41px;
    padding: 0 5px;
    background-position: 0 0;
    background: url('@/assets/images/play/playlist_bg.png') no-repeat;
    .list-hd-c{
        position: relative;
        height: 40px;
        .hd-title{
            position: absolute;
            left: 25px;
            top: 0;
            height: 39px;
            line-height: 39px;
            font-size: 14px;
            color: #e2e2e2;
        }
        .hd-collectTotal{
            position: absolute;
            left: 398px;
            top: 12px;
            height: 15px;
            line-height: 15px;
            color: #ccc;
            cursor: pointer;
            .icn-add{
                width: 16px;
                background-position: -24px 0;
            }
            &:hover{
                color: #e2e2e2;
                .icn-add{
                    background-position: -24px -20px;
                }
            }
        }
        .line{
            position: absolute;
            top: 13px;
            left: 477px;
            height: 15px;
            border-left: 1px solid #000;
            border-right: 1px solid #2c2c2c;
        }
        .hd-clear{
            position: absolute;
            left: 490px;
            top: 12px;
            height: 15px;
            line-height: 15px;
            color: #ccc;
            cursor: pointer;
            .icn-del{
                width: 13px;
                background-position: -51px 0;
            }
            &:hover{
                color: #e2e2e2;
                .icn-del{
                    background-position: -51px -20px;
                }
            }
        }
        .hd-song-name{
            position: absolute;
            left: 595px;
            top: 0;
            width: 346px;
            text-align: center;
            height: 39px;
            line-height: 39px;
            color: #fff;
            font-size: 14px;
            font-family: Arial, Helvetica, sans-serif;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            word-wrap: normal;
        }
        .hd-close{
            position: absolute;
            top: 6px;
            right: 8px;
            width: 30px;
            height: 30px;
            overflow: hidden;
            text-indent: -999px;
            cursor: pointer;
            background: url('@/assets/images/play/playlist.png') no-repeat 0 9999px;
            background-position: -195px 9px;
        }
        .icn{
            height: 16px;
            float: left;
            margin: 1px 6px 0 0;
            background: url('@/assets/images/play/playlist.png') no-repeat 0 9999px;
        }

    }
  }
  .play-list-bd{
    position: absolute;
    left: 0;
    top: 41px;
    width: 976px;
    height: 260px;
    padding: 0 5px;
    overflow: hidden;
    background: url('@/assets/images/play/playlist_bg.png') no-repeat;
    background-position: -1014px 0;
    background-repeat: repeat-y;
    .msk{
        position: absolute;
        left: 2px;
        top: 0;
        z-index: 2;
        width: 558px;
        height: 260px;
        background: #121212;
        opacity: .5;
    }
    .list-c{
        position: absolute;
        left: 2px;
        top: 0;
        z-index: 4;
        height: 260px;
        width: 553px;
        overflow: hidden;
        .list-ul{
            overflow: hidden;
            .item{
                height: 28px;
                width: 100%;
                display: flex;
                align-items: center;
                .active{
                    width: 10px;
                    padding-left: 10px;
                    height: 28px;
                    line-height: 28px;
                    overflow: hidden;
                    cursor: pointer;
                    .icn{
                        display: inline-block;
                        width: 10px;
                        height: 13px;
                        background: url('@/assets/images/play/playlist.png') no-repeat 0 9999px;
                        background-position: -182px 0;
                    }
                }
                .item-name{
                    color: #ccc;
                    margin-left: 10px;
                    width: 256px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    cursor: pointer;
                }
                .item-icn-box{
                    margin-left: 10px;
                    width: 100px;
                    height: 28px;
                    overflow: hidden;
                    cursor: pointer;
                    .item-icn{
                        display: none;
                        width: 100%;
                        height: 23px;
                    }
                    .icn{
                        color: #fff;
                        display:inline-block;
                        height: 16px;
                        overflow: hidden;
                        margin: 7px 0 0 10px;
                        background: url('@/assets/images/play/playlist.png') no-repeat 0 9999px;
                    }
                    .icn-add{
                        width: 16px;
                        background-position: -24px 0;
                        &:hover{
                            background-position: -24px -20px;
                        }
                    }
                    .icn-share{
                        width: 14px;
                        background-position: 0 0;
                        &:hover{
                            background-position: 0 -20px;
                        }
                    }
                    .icn-dl{
                        width: 14px;
                        background-position: -57px -50px;
                        &:hover{
                            background-position: -80px -50px;
                        }
                    }
                    .icn-del{
                        width: 13px;
                        background-position: -51px 0;
                        &:hover{
                            background-position: -51px -20px;
                        }
                    }
                }
                .item-Singer{
                    margin-left: 10px;
                    color: #9b9b9b;;
                    width: 70px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    cursor: pointer;
                }
                .item-duration{
                    width: 35px;
                    color: #666;
                    margin-left: 10px;
                }
                .item-Share{
                    width: 37px;
                    height: 28px;
                    margin-left: 10px;
                    .icn-Share{
                        display: inline-block;
                        width: 14px;
                        height: 16px;
                        overflow: hidden;
                        margin: 7px 0 0 0;
                        background: url('@/assets/images/play/playlist.png') no-repeat 0 9999px;
                        background-position: -80px 0px;
                        cursor: pointer;
                    }
                }
                &:hover{
                    .item-icn{
                        display: block;
                    }
                    .col{
                        color: #fff !important;
                    }
                }
            }
            .item-active{
                .col{
                    color: #fff !important;
                }
            }
        }
    }
  }
}
</style>