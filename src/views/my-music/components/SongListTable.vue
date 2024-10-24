<template>
    <div class="music-table">
        <table class="song-list-table">
            <thead>
                <tr>
                    <th class="first th-1">
                        <div class="text"></div>
                    </th>
                    <th>
                        <div class="text">歌曲标题</div>
                    </th>
                    <th class="th-2">
                        <div class="text">时长</div>
                    </th>
                    <th class="th-3">
                        <div class="text">歌手</div>
                    </th>
                    <th class="th-4">
                        <div class="text">专辑</div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr class="music-list-c"
                 :class="{'even' : index % 2 === 0, 'list-disabled' : item?.noCopyrightRcmd }"
                 v-for="(item, index) in playlist?.tracks"
                 :key="item.id"
                >
                    <td class="tr-index">
                        <div class="index-hd">
                            <span class="index">{{index+1}}</span>
                            <i class="play-icn"></i>
                        </div>
                    </td>
                    <td>
                        <div class="song-name">
                            <div class="song-name-box">
                                <span class="text-hov">{{item.name}}</span>
                            <span class="song-other" v-if="item?.alia.length > 0"> - ({{item?.alia[0]}})</span>
                                <i v-if="item.mv" class="mv-icn"></i>
                            </div>
                        </div>
                    </td>
                    <td class="song-time-box">
                        <span class="song-time">{{ timeStampToDuration(item.dt / 1000) || '00:00' }}</span>
                        <div class="btns" v-if="!item?.noCopyrightRcmd">
                            <i class="add-icn" title="添加到播放列表"></i>
                            <i class="icn collect-icn" title="收藏"></i>
                            <i class="icn share-icn" title="分享"></i>
                            <i class="icn down-icn" title="下载"></i>
                            <i class="icn del-icn" title="删除"></i>
                        </div>
                        <div class="btns" v-else>
                            <i class="icn del-icn" title="删除"></i>
                        </div>
                    </td>
                    <td>
                        <div class="text">
                            <template v-for="(key, i) in item.ar" :key="i">
                                <span class="text-hov" :title="key.name">{{key.name}}</span><i v-if="i !== item.ar.length-1">/</i>
                            </template>
                        </div>
                    </td>
                    <td>
                        <div class="text">
                            <span class="text-hov">{{item?.al?.name}}</span>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { timeStampToDuration } from '@/utils/utils.ts'
defineProps({
    playlist: {
        type: Object,
        default: {}
    }
})
</script>


<style lang="scss" scoped>
.music-table{
    width: 100%;
    // height: 600px;
    .song-list-table{
        width: 100%;
        border: 1px solid #d9d9d9;
        border-collapse: collapse;
        border-spacing: 0;
        table-layout: fixed;
        th{
            height: 38px;
            background-color: #f7f7f7;
            background: url('@/assets/images/my-music/table.png');
            background-position: 0 0;
            background-repeat: repeat-x;
            vertical-align: top;
            text-align: left;
            font-weight: normal;
            color: #666;
            .text{
                height: 18px;
                line-height: 18px;
                padding: 8px 10px;
                background: url('@/assets/images/my-music/table.png') no-repeat;
                background-position: 0 -56px;
            }
        }
        td{
            padding: 6px 10px;
            line-height: 18px;
            text-align: left;
            background: url('@/assets/images/my-music/table.png') no-repeat 0 9999px;
        }
        .first{
            width: 74px;
            .text{
                background: none;
            }
        }
        .th-2{
            width: 111px;
        }
        .th-3{
            width: 14%;
        }
        .th-4{
            width: 20%;
        }
        .music-list-c{
            color: #333;
            .tr-index{
                .index-hd{
                    height: 18px;
                    .index{
                        margin-left: 5px;
                        color: #999;
                    }
                    .play-icn{
                        float: right;
                        width: 17px;
                        height: 17px;
                        cursor: pointer;
                        background: url('@/assets/images/my-music/table.png') no-repeat 0 9999px;
                        background-position: 0 -103px;
                    }
                }
            }
            .song-name{
                height: 18px;
                margin-right: 20px;
                .song-name-box{
                    position: relative;
                    display: inline-block;
                    padding-right: 25px;
                    margin-right: -25px;
                    max-width: 99%;
                    height: 20px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    .song-other{
                        color: #aeaeae;
                    }
                    .mv-icn{
                        position: absolute;
                        top: 0;
                        right: 0;
                        width: 23px;
                        height: 17px;
                        margin: 1px 0 0 0;
                        background: url('@/assets/images/my-music/table.png') no-repeat 0 9999px;
                        background-position: 0 -151px;
                        cursor: pointer;
                        &:hover{
                            background-position: -30px -151px;
                        }
                    }
                }
            }
            .song-time-box{
                .song-time{
                    color: #666;
                }
                .btns{
                    float: left;
                    display: none;
                    .add-icn{
                        margin-top: 2px;
                        float: left;
                        overflow: hidden;
                        vertical-align: middle;
                        width: 13px;
                        height: 13px;
                        background: url('@/assets/images/icon.png') no-repeat;
                        background-position: 0 -700px;
                        cursor: pointer;
                        &:hover{
                            background-position: -22px -700px;
                        }
                    }
                    .icn{
                        float: left;
                        width: 18px;
                        height: 16px;
                        margin: 2px 0 0 4px;
                        overflow: hidden;
                        text-indent: -999px;
                        background: url('@/assets/images/my-music/table.png') no-repeat;
                        cursor: pointer;
                    }
                    .collect-icn{
                        background-position: 0 -174px;
                        &:hover{
                            background-position: -20px -174px;
                        }
                    }
                    .share-icn{
                        background-position: 0 -195px;
                        &:hover{
                            background-position: -20px -195px;
                        }
                    }
                    .down-icn{
                        background-position: -81px -174px;
                        &:hover{
                            background-position: -104px -174px;
                        }
                    }
                    .del-icn{
                        background-position: 0 -217px;
                        &:hover{
                            background-position: -20px -217px;
                        }
                    }
                }
            }
            .text{
                width: 100%;
                position: relative;
                zoom: 1;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            &:hover{
                .song-time-box{
                    padding-right: 0px;
                }
                .song-time{
                    display: none;
                }
                .btns{
                    display: block;
                }
            }
        }
        .even{
            background-color: #f7f7f7;
        }
        .list-disabled{
            color: #bbb !important;
            .tr-index{
                .index-hd{
                    .play-icn{
                        cursor: default;
                    }
                }
            }
        }
    }
}
</style>