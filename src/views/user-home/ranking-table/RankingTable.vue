<template>
    <div class="ranking-title">
        <h3 class="title">听歌排行</h3>
        <h4 class="listen-music-total">累积听歌{{recordInfo.listenSongs}}首</h4>
        <span class="n-iconpoint">
            <i class="tip-icn"></i>
            <div class="tip">
                <p>实际播放时间过短的歌曲将不纳入计算。</p>
                <i class="t"></i>
                <i class="b"></i>
            </div>
        </span>
        <div class="nav">
            <span class="time" :class="{'z-sel':recordInfo.type === 1}" @click="tagschange(1)">最近一周</span>
            <i class="line"></i>
            <span class="time" :class="{'z-sel':recordInfo.type === 0}" @click="tagschange(0)">所有时间</span>
        </div>
    </div>
    <div class="ranking-table-box">
        <template v-if="!recordInfo.loading">
            <ul class="table-ul" v-if="recordInfo.list.length > 0">
                <li class="item" :class="index % 2 === 0 ? 'even' : ''" v-for="(item, index) in recordInfo.list" :key="index">
                    <div class="hd">
                        <i class="play-icn" :class="{'play-z-slt' : playSongId === item?.song?.id}" @click="playMusic(item?.song)"></i>
                        <span class="index">{{index + 1}}.</span>
                    </div>
                    <div class="song">
                        <div class="song-info">
                            <span class="text">
                                <span class="song-name text-hov" :title="item.song.name">{{item.song.name}}</span>
                                <em>-</em>
                                <span class="singer" v-for="(key, i) in item?.song?.ar">
                                    <span class="text-hov" :title="key.name">{{key.name}}</span>
                                    <i v-show="i !== item?.song?.ar.length-1">/</i>
                                    </span>
                            </span>
                            <div class="play-btns">
                                <i class="add-icn" title="添加到播放列表" @click="addMusic(item?.song)"></i>
                                <i class="icn collect-icn" title="收藏" @click="collectMusic(item?.song)"></i>
                                <i class="icn share-icn" title="分享" @click="notFeatureTip"></i>
                                <i class="icn down-icn" title="下载" @click="notFeatureTip"></i>
                            </div>
                        </div>
                    </div>
                    <div class="tops">
                        <span class="bag" :style="{'width': item.score + '%'}"></span>
                        <span class="play-num">{{item.playCount}}次</span>
                    </div>
                </li>
            </ul>
            <div class="no-music" v-else>
                <h3 class="text">
                    <i class="no-music-icn"></i>
                    暂无听歌记录
                </h3>
            </div>
            <div class="more" v-if="recordInfo.list.length > 0 && recordInfo.type === 0 && isMore">
                <span class="text-hov" @click="moreBtn">查看更多></span>
            </div>
        </template>
        <template v-else>
            <div class="ranking-load">
                <i class="load-icn"></i>
                 加载中...
            </div>
        </template>
    </div>
    <!-- 播放权限弹框 -->
    <Dialog 
      :visible="playDialog"
      showCustomButton
      @cancel='playCancel'
    >
        <p class="content-text">{{ playDialogText }}</p>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { songType } from '@/hooks/methods/songFormat.ts';
import useSongAddPlaylist from '@/hooks/useSongAddPlayList.ts';
import usePlaySong from '@/hooks/usePlaySong.ts';
import usePlayStore from '@/stores/modules/play.ts';
import useDialogStore from '@/stores/modules/dialog.ts'
import { getSongDetail } from '@/api/user-home.ts'
import Dialog from '@/components/dialog/dialog.vue';

    const playStore = usePlayStore();
    const dialogStore = useDialogStore();
    const router = useRouter();
    const route = useRoute();

    defineProps({
        recordInfo: {
            type: Object,
            default: {}
        },
        isMore: {
            type: Boolean,
            default: true
        }
    })

    const emit = defineEmits(['tagschange'])

    // 查看更多
    function moreBtn() {
        router.push({
            path:'/song/rank',
            query: {id: route?.query?.id}
        })
    }

    // 播放显示/隐藏
    const lock = computed(() => playStore.getplayLock);
    // 当前播放歌曲ID
    const playSongId = computed(() => playStore.getPlaySongId);

    function tagschange(value: number) {
        emit('tagschange',value)
    }

    // 添加到播放列表
    let timer = null;
    const playDialog = ref(false);
    const playDialogText = ref('');
    async function addMusic(item: songType) {
        let res = await getSongDetail({ids: item.id})
        let index = isCopyright(res?.privileges[0])

        if(index === 0) {
            playDialogText.value = '因合作方要求，该资源暂时无法收听，我们正在努力争取歌曲回归';
            playDialog.value = true;
            return;
        }else if(index === 1){
            playDialogText.value = '该歌曲为付费歌曲，请购买后聆听';
            playDialog.value = true;
            return;
        }

        useSongAddPlaylist(item)
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

    // 歌曲是否有版权
    type privilegeItem = {
        dl?: number,
        fee?: number
    }
    function isCopyright(privilege?: privilegeItem): number | undefined {
        if (privilege?.dl === 0) {
            if(privilege.fee === 0){
                // 无版权
                return 0;
            }else if(privilege.fee === 1){
                // 付费歌曲
                return 1;
            }
        }else{
            // 可播放歌曲
            return 2;
        }
    }

    // 收藏
    async function collectMusic(item: songType) {
        let res = await getSongDetail({ids: item.id})
        let index = isCopyright(res?.privileges[0])

        if(index === 0) {
            playDialogText.value = '因合作方要求，该资源暂时无法收听，我们正在努力争取歌曲回归';
            playDialog.value = true;
            return;
        }else if(index === 1){
            playDialogText.value = '该歌曲为付费歌曲，请购买后聆听';
            playDialog.value = true;
            return;
        }
        
        dialogStore.setSongId(item.id);
        dialogStore.setSongListShow(true);
    }


    // 播放歌曲
    function playMusic(item: songType) {
        let index = isCopyright(item.id)

        if(index === 0) {
            playDialogText.value = '因合作方要求，该资源暂时无法收听，我们正在努力争取歌曲回归';
            playDialog.value = true;
            return;
        }else if(index === 1){
            playDialogText.value = '该歌曲为付费歌曲，请购买后聆听';
            playDialog.value = true;
            return;
        }
        
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

    function playCancel(value: boolean) {
        playDialog.value = value;
    }

    // 功能暂无开发
    const warningInfo = reactive({
        time: null
    })
    function notFeatureTip() {
        dialogStore.setMessage({
            type: 0,
            text: '功能暂未开发',
            visible: true,
        })
        warningInfo.time && clearTimeout( warningInfo.time);
        warningInfo.time = setTimeout(() => {
            dialogStore.setMessage({
                type: 0,
                text: '功能暂未开发',
                visible: false,
            })
        }, 1500);
    }

</script>
<style lang="scss" scoped>
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
    .song-list{
        color: #333;
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
            cursor: pointer;
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
                .play-z-slt{
                    background-position: -20px -128px;
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
                    .text{
                        position: relative;
                        display: inline-block;
                        max-width: 99%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        .song-name{
                            color: #333;
                            font-weight: 700;
                        }
                        em{
                            margin: 0 5px;
                            font-style: normal;
                            text-align: left;
                            font-size: inherit;
                        }
                        .singer{
                            color: #aeaeae;
                        }
                    }
                    .play-btns{
                        position: absolute;
                        z-index: 1;
                        right: 0;
                        top: 11px;
                        display: none;
                        width: 92px;
                        height: 20px;
                        overflow: hidden;
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
                    }
                }
            }
            .tops{
                float: right;
                position: relative;
                z-index: 1;
                zoom: 1;
                width: 319px;
                height: 38px;
                line-height: 38px;
                .bag{
                    position: absolute;
                    z-index: 1;
                    width: 100%;
                    height: 38px;
                    background-color: #4eb4f5;
                    opacity: 0.1;
                }
                .play-num{
                    position: absolute;
                    left: 10px;
                    z-index: 1;
                    height: 38px;
                    line-height: 38px;
                    color: #666;
                    font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
                }
            }
            &:hover{
                background: #eeeeee;
                .song{
                    .song-info{
                        .play-btns{
                            display:block;
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
        .even{
            background-color: #f7f7f7;
        }
    }
    .no-music{
        padding: 105px 0 105px 0;
        text-align: center;
        .text{
            padding-bottom: 38px;
            font-size: 18px;
            font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
            .no-music-icn{
                margin-right: 17px;
                width: 64px;
                height: 50px;
                display: inline-block;
                overflow: hidden;
                vertical-align: middle;
                background: url('@/assets/images/icon.png') no-repeat;
                background-position: 0 -347px;
            }
        }
    }
    .more{
        color: #666;
        height: 32px;
        line-height: 32px;
        text-align: right;
    }
    .ranking-load{
        height: 26px;
        padding: 20px 0;
        text-align: center;
        color: #999;
        .load-icn{
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-right: 2px;
            vertical-align: middle;
            background: url('@/assets/images/play/loading.gif') no-repeat;
        }
    }
}
</style>