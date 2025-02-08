<template>
    <div class="table-hd">
        <h3 class="table-tit">节目列表</h3>
        <span class="table-sub">共{{list?.length}}期</span>
        <div class="u-sore">
            <i class="up-icn" :class="tableSore === 'down' ? 'up-active' : 'up-unActive'" @click="soreTable('down')" title="降序"></i>
            <i class="down-icn" :class="tableSore === 'up' ? 'down-active' : 'down-unActive'" @click="soreTable('up')" title="升序"></i>
        </div>
        <div class="out">
            <i class="out-icn"></i>
            <a
                class="text text-hov"
                :href="`https://music.163.com/#/outchain/1/${route.query.id}`"
            >
                生成外链播放器
            </a>
        </div>
    </div>
    <table class="table-box">
        <tbody>
            <tr class="item" :class="{'item-even' : index%2 !== 0}" v-for="(item, index) in list" :key="item.id">
                <td class="col1">
                    <div class="index">
                        <span class="play-icn" :class="{'play-z-slt' : playSongId === item?.mainSong?.id}" title="播放" @click="playOrAddMusic(item?.mainSong, 'play')"></span>
                        <span class="num">{{item?.serialNum}}</span>
                    </div>
                </td>
                <td class="col2">
                    <div class="radio-name thide">
                        <span class="text-hov" :title="item?.name">{{item?.name}}</span>
                    </div>
                    <div class="opt">
                        <span class="add-icn" title="添加到播放列表" @click="playOrAddMusic(item?.mainSong, 'add')"></span>
                        <span class="share-icn icn-btn" title="分享" @click="notFeatureTip"></span>
                        <span class="down-icn icn-btn" title="下载" @click="notFeatureTip"></span>
                    </div>
                </td>
                <td class="col3">
                    <span>播放{{item?.listenerCount}}</span>
                </td>
                <td class="col4">
                    <span>赞{{item?.likedCount}}</span>
                </td>
                <td class="col5">
                    <span>{{formatDateTime(item?.scheduledPublishTime / 1000, 'Y-M-D')}}</span>
                </td>
                <td class="col6">
                    <div class="play" v-if="playSongId === item?.mainSong?.id"></div>
                    <span>{{ timeStampToDuration(item.duration / 1000) || '00:00' }}</span>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { formatDateTime } from '@/utils/utils';
import { timeStampToDuration } from '@/utils/utils.ts';
import usePlayStore from '@/stores/modules/play.ts';
import type { songType } from '@/hooks/methods/songFormat.ts';
import useSongAddPlaylist from '@/hooks/useSongAddPlayList.ts';
import usePlaySong from '@/hooks/usePlaySong.ts';

const props = defineProps({
    list: {
        type: Array,
        default: []
    }
})
const emit = defineEmits(['tableSore', 'notFeatureTip']);
const playStore = usePlayStore();
const route = useRoute();

// 播放显示/隐藏
const lock = computed(() => playStore.getplayLock);

// 当前播放歌曲ID
const playSongId = computed(() => playStore.getPlaySongId);

const tableSore = ref('down');

function soreTable(type: string) {
    if(tableSore.value === type ){
        return;
    }
    tableSore.value = type;
    emit('tableSore', type === 'down' ? false : true)
}

// 播放、添加到播放列表
let timer = null;
function playOrAddMusic(item: songType, type: string) {
    if(type === 'play'){
        usePlaySong(item);
    }
    useSongAddPlaylist(item)
    playStore.setAddPlayListTip(true)
    playStore.setAddPlayListTipText(type === 'play' ? '已开始播放' : '已添加到播放列表')
    if(!lock.value){
        playStore.setPlayLock(true)
    }
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
        playStore.setPlayLock(false)
        playStore.setAddPlayListTip(false)
    }, 1500)
}


function notFeatureTip() {
    emit('notFeatureTip', {type: 0, text: '功能暂未开发'})
}
</script>


<style lang="scss" scoped>
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
.table-box{
    border-top: none;
    width: 100%;
    border: 1px solid #d9d9d9;
    border-collapse: collapse;
    border-spacing: 0;
    table-layout: fixed;
    .item{
        height: 55px;
        td{
            line-height: 18px;
            text-align: left;
            padding: 0 10px;
        }
        .col1{
            width: 62px;
            .index{
                height: 18px;
                .play-icn{
                    float: right;
                    width: 17px;
                    height: 17px;
                    cursor: pointer;
                    background: url('@/assets/images/my-music/table.png') no-repeat;
                    background-position: 0 -103px;
                    &:hover{
                        background-position: 0 -128px;
                    }
                }
                .play-z-slt{
                    background-position: -20px -128px;
                    &:hover{
                        background-position: -20px -128px;
                    }
                }
                .num{
                    margin-left: 10px;
                    color: #999;
                }
            }
        }
        .col2{
            width: 230px;
            padding-left: 0;
            .radio-name{
                float: left;
                width: 100%;
                margin-right: -100px;
                color: #333;
            }
            .opt{
                display: none;
                float: right;
                position: relative;
                margin-right: -10px;
                .add-icn{
                    float: left;
                    margin-top: 2px;
                    width: 13px;
                    height: 13px;
                    vertical-align: middle;
                    cursor: pointer;
                    background: url('@/assets/images/icon.png') no-repeat;
                    background-position: 0 -700px;
                    &:hover{
                        background-position: -22px -700px;
                    }
                }
                .icn-btn{
                    float: left;
                    width: 18px;
                    height: 16px;
                    margin: 2px 0 0 4px;
                    overflow: hidden;
                    text-indent: -999px;
                    cursor: pointer;
                    background: url('@/assets/images/my-music/table.png') no-repeat;
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
            }
        }
        .col3{
            width: 60px;
            color: #666;
        }
        .col4{
            width: 65px;
            color: #666;
        }
        .col5{
            width: 70px;
            color: #999;
        }
        .col6{
            color: #999;
            position: relative;
            .play{
                position: absolute;
                top: 0;
                left: 19px;
                width: 12px;
                height: 16px;
                background: url('@/assets/images/radio/cnt_radio.png') no-repeat;
                background-position: 0 -100px;
            }
        }
        &:hover{
            .col2{
                .radio-name{
                    width: 190px;
                }
                .opt{
                    display: block;
                }
            }
        }
    }
    .item-even{
        background-color: #f7f7f7;
    }
}
</style>