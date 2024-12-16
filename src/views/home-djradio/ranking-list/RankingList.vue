<template>
    <div class="recommend">
        <div class="u-title">
            <h3>
                <span class="text-hov">节目排行榜</span>
            </h3>
            <span class="more text-hov">更多 ></span>
        </div>
        <ul class="toplist">
            <li class="item ranking" :class="{'even' : index % 2 !== 0}" v-for="(item, index) in rankingList" :key="index">
                <div class="rank">
                    <em :class="{'red': index < 3}">{{index < 9 ? '0' + (index + 1) : index + 1}}</em>
                    <span class="u-rnk">
                        <i class="u-icn u-icn-up" v-if="item?.programFeeType === 0"></i>
                        <i class="num">{{Math.abs(item?.rank - item?.lastRank) + 1}}</i>
                    </span>
                </div>
                <div class="u-cover" title="播放">
                    <img class="cover" :src="`${item?.program?.coverUrl}?param=40x40`" alt="">
                    <i class="play-icn" @click="playRadio(item?.program?.mainSong)"></i>
                </div>
                <div class="cnt">
                    <h3 class="thide">
                        <span class="text-hov" :title="item?.program?.name" @click="toDjDetail(item?.program?.id)">{{item?.program?.name}}</span>
                    </h3>
                    <p class="thide">
                        <span class="text-hov" :title="item?.program?.radio?.name">{{item?.program?.radio?.name}}</span>
                    </p>
                </div>
                <div class="hot">
                    <span class="hot-bag">
                        <i></i>
                    </span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import usePlayStore from '@/stores/modules/play.ts';
import { ranking } from '@/api/home.ts';
import type { ResponseType } from '@/types/index';
import type { SongType } from '@/types/home.ts';
import useSongAddPlaylist from '@/hooks/useSongAddPlayList.ts';
import usePlaySong from '@/hooks/usePlaySong.ts';

const router = useRouter();
const playStore = usePlayStore();

// 播放显示/隐藏
const lock = computed(() => playStore.getplayLock);

const rankingList = ref([]);

function getRanking() {
    ranking({
        limit: 10,
        offset: 0,
    }).then((res: ResponseType) => {
        if(res.code === 200) {
            rankingList.value = res?.toplist
        }
    })
}
getRanking();

// 播放电台节目
let timer = null;
function playRadio(item: songType) {
    usePlaySong(item);
    useSongAddPlaylist(item);
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


function toDjDetail(id: number) {
    router.push({
        path: '/dj-detail',
        query: {
            id
        }
    })
}

function radioDetail(id: number) {
    router.push({
        path: '/radio-detail',
        query: {
            id
        }
    })
}

</script>

<style lang="scss" scoped>
.u-title{
    height: 40px;
    border-bottom: 2px solid #c20c0c;
    h3{
        float: left;
        font-size: 24px;
        font-weight: normal;
        font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
        color: #333;
        .radiu{
            font-family: simsun, \5b8b\4f53;
        }
    }
    .more{
        float: right;
        color: #666;
        margin-top: 14px;
    }
    &:after{
        clear: both;
        content: '.';
        display: block;
        height: 0;
        visibility: hidden;
    }
}
.recommend{
    width: 426px;
    .toplist{
        height: 600px;
        border: 1px solid #e2e2e2;
        border-top: none;
        .item{
            width: 424px;
            height: 40px;
            padding: 10px 0;
            line-height: 40px;
            background: #fff;
            .rank{
                float: left;
                width: 47px;
                margin: 6px 0 0 0;
                text-align: center;
                line-height: normal;
                color: #999;
                em{
                    display: block;
                    width: 100%;
                    text-align: center;
                    font-size: 14px;
                    font-style: normal;
                }
                .red{
                    color: #da4545;
                }
                .u-rnk{
                    color: #ba2226;
                    line-height: normal;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 10px;
                    text-align: center;
                    .u-icn{
                        margin: -1px 2px 0 0;
                        display: inline-block;
                        overflow: hidden;
                        vertical-align: middle;
                        width: 6px;
                        height: 6px;
                        background: url('@/assets/images/icon.png') no-repeat;
                    }
                    .u-icn-up{
                        background-position: -74px -304px;
                    }
                    .num{
                        vertical-align: middle;
                    }
                }
            }
            .u-cover{
                margin-left: 20px;
                width: 40px;
                height: 40px;
                position: relative;
                float: left;
                cursor: pointer;
                color: #333;
                .cover{
                    width: 40px;
                    height: 40px;
                }
                .play-icn{
                    display: none;
                    position: absolute;
                    width: 22px;
                    height: 22px;
                    top: 50%;
                    left: 50%;
                    overflow: hidden;
                    margin: -11px 0 0 -11px;
                    background: url('@/assets/images/home/name-Db6Jvh02.png') no-repeat;
                    background-position: 0 -85px;
                }
            }
            .cnt{
                float: left;
                width: 254px;
                margin: 1px 0 0 10px;
                line-height: 20px;
                h3{
                    font-size: 100%;
                    font-weight: normal;
                    color: #333;
                }
                p{
                    color: #999;
                }
            }
            .tag{
                margin: 1px 0 0 10px;
                display: inline-block;
                position: relative;
                top: -1px;
                height: 16px;
                overflow: hidden;
                padding: 0 6px;
                border: 1px solid #999;
                line-height: 16px;
                color: #999;
                vertical-align: middle;
                font-size: 12px;
                cursor: pointer;
                &:hover{
                    border-color: #666;
                    color: #666;
                    text-decoration: none;
                }
            }
            .hot{
                float: left;
                margin-top: 16px;
                height: 8px;
                position: relative;
                width: 100px;
                background: url('@/assets/images/my-music/table.png') no-repeat;
                background-position: 0 -240px;
                line-height: normal;
                .hot-bag{
                    width: 42%;
                    display: block;
                    height: 8px;
                    overflow: hidden;
                    padding: 0 4px;
                    background: url('@/assets/images/my-music/table.png') no-repeat;
                    background-position: right -318px;
                    i{
                        margin-left: -4px;
                        padding: 0 0 0 4px;
                        background: url('@/assets/images/my-music/table.png') no-repeat;
                        background-position: 0 -304px;
                        display: block;
                        overflow: hidden;
                        height: 8px;
                    }
                }
            }
            &:hover{
                background: #eee;
                .play-icn{
                    display: block;
                }
            }
        }
        .even{
            background: #f7f7f7;
        }
    }
}
.ranking{
    .u-cover{
        margin-left: 0px !important;
    }
    .cnt{
        width: 208px !important;
    }
}
</style>