<template>
    <div class="radio-header">
        <div class="cover">
            <img :src="`${radioInfo?.picUrl}?param=200y200`" alt="">
            <span class="smk"></span>
        </div>
        <div class="u-info">
            <div class="info-tit">
                <i class="radio-icn"></i>
                <h2 class="tit">{{radioInfo?.name}}</h2>
            </div>
            <div class="user">
                <img class="user-img" :src="`${radioInfo?.dj?.avatarUrl}?param=50y50`" alt="" @click="toUserHome(radioInfo?.dj?.userId)">
                <span class="user-name text-hov" :title="radioInfo?.dj?.nickname" @click="toUserHome(radioInfo?.dj?.userId)">{{radioInfo?.dj?.nickname}}</span>
            </div>
            <div class="hd-btns">
                <span class="sub-icn m-icn icn icn-bag" :class="radioInfo?.subed ? 'to-par-sub' : 'un-par-sub'" @click="handleSubDj(radioInfo?.id)">
                    <i class="icn icn-bag" :class="radioInfo?.subed ? 'to-sub' : 'un-sub'">{{radioInfo?.subed ? '已订阅' : '订阅'}}({{radioInfo?.subCount}})</i>
                </span>
                <span class="play-icn m-icn icn icn-bag" @click="playAll">
                    <i class="icn icn-bag">播放全部</i>
                </span>
                <span class="share-icn m-icn icn icn-bag" @click="notFeatureTip">
                    <i class="icn icn-bag">分享(0)</i>
                </span>
            </div>
            <div class="desc">
                <span class="tip-btn">{{radioInfo?.category}}</span>
                {{radioInfo?.desc}}
            </div>
        </div>
    </div>
    <!-- 订阅弹框 -->
    <Dialog 
      :visible="subDialog"
      :showCustomButton="showCustomButton"
      :showConfirmButton="showConfirmButton"
      :showCancelButton="showCancelButton"
      @cancel='subCancel'
      @confirm="subConfirm"
    >
        <p class="content-text">{{ subDialogText }}</p>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Dialog from '@/components/dialog/dialog.vue';
import { subDj } from '@/api/djDetail.ts';
import type { ResponseType } from '@/types/index';
import type { songType } from '@/hooks/methods/songFormat.ts';
import usePlayStore from '@/stores/modules/play.ts';
import useSongAddPlaylist from '@/hooks/useSongAddPlayList.ts';
import usePlaySong from '@/hooks/usePlaySong.ts';

const props = defineProps({
    radioInfo: {
        type: Object,
        default: {}
    },
    list: {
        type: Array,
        default: []
    }
})

const emit = defineEmits(['notFeatureTip']);

const playStore = usePlayStore();
const router = useRouter();

// 播放显示/隐藏
const lock = computed(() => playStore.getplayLock);

// 播放全部
let timer = null;
function playAll() {
    if (props?.list?.length === 0) {
        return;
    }

    // 过滤无版权
    const songList: songType[] = []
    props?.list.forEach((item) => {
        songList.push(item.mainSong)
    });

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

// 订阅电台-
const radioId = ref(undefined);
const subDialog = ref(false);
const subDialogText = ref('');
const showCustomButton = ref(false); // 知道了按钮
const showConfirmButton = ref(false); // 确认按钮
const showCancelButton = ref(false); // 取消按钮
function handleSubDj(id: number) {
    if(props?.djInfo?.radio?.subed){
        // 取消订阅
        showConfirmButton.value = true;
        showCancelButton.value = true;
        subDialogText.value = '确定取消订阅？'
        subDialog.value = true;
        radioId.value = id
    }else{
        subDj({rid: id, t: 1}).then((res: ResponseType) => {
            if(res.code === 200) {
                emit('notFeatureTip', {type: 1, text: '订阅成功'})
            }
        })
    }
}

// 关闭弹框
function subCancel() {
    subDialog.value =false;
    showConfirmButton.value = false;
    showCancelButton.value = false;
    showCustomButton.value = false;
}

// 确认取消订阅
function subConfirm() {
    subDj({rid: radioId.value, t: 0}).then((res: ResponseType) => {
        if(res.code === 200) {
            subCancel()
            emit('notFeatureTip', {type: 1, text: '取消订阅成功'})
        }
    })
}

function notFeatureTip() {
    emit('notFeatureTip', {type: 0, text: '功能暂未开发'})
}

function toUserHome(id: number) {
    router.push({
        path: '/user/home',
        query: {
            id
        }
    })
}
</script>
<style lang="scss" scoped>
.radio-header{
    .cover{
        position: relative;
        display: inline-block;
        vertical-align: top;
        width: 200px;
        height: 200px;
        .smk{
            width: 208px;
            height: 208px;
            position: absolute;
            top: -4px;
            left: -4px;
            background: url('@/assets/images/home/name-D5CGUEo8.png') no-repeat;
            background-position: 0 -1285px;
        }
        img{
            width: 100%;
            height: 100%;
        }
    }
    .u-info{
        max-width: 63%;
        display: inline-block;
        vertical-align: top;
        margin-left: 30px;
        .info-tit{
            position: relative;
            margin: 0 0 12px;
            line-height: 24px;
            .radio-icn{
                width: 55px;
                height: 24px;
                display: inline-block;
                vertical-align: middle;
                background: url('@/assets/images/icon.png') no-repeat;
                background-position: 0 -1014px;
            }
            .tit{
                color: #333;
                margin-left: 9px;
                display: inline-block;
                vertical-align: middle;
                line-height: 24px;
                font-size: 20px;
                font-weight: normal;
                font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
            }
        }
        .user{
            margin: 0 0 20px;
            line-height: 35px;
            .user-img{
                width: 35px;
                height: 35px;
                vertical-align: middle;
                margin-right: 10px;
                cursor: pointer;
            }
            .user-name{
                margin-right: 2px;
                vertical-align: middle;
                color: #0c73c2;
            }
        }
        .hd-btns{
            margin-bottom: 25px;
            margin-right: -10px;
            .icn-bag{
                background:url('@/assets/images/login/button-bag.png') no-repeat;
            }
            .icn{
                float: left;
                height: 31px;
                line-height: 30px;
                min-width: 23px;
                cursor: pointer;
            }
            .m-icn{
                margin-right: 6px;
                padding: 0 5px 0 0;
                font-family: simsun, \5b8b\4f53;
            }
            .to-par-sub{
                background-position: right -2325px;
                &:hover{
                    background-position: right -2640px;
                    i{
                        background-position: 0 -2599px;
                    }
                }
            }
            .un-par-sub{
                background-position: right -2163px;
                &:hover{
                    background-position: right -2558px;
                    i{
                        background-position: 0 -2516px;
                    }
                }
            }
            .sub-icn{
                color: #fff;
                i{
                    padding: 0 7px 0 30px;
                }
                .to-sub{
                    color: #333;
                    background-position: 0 -2207px;
                }
                .un-sub{
                    background-position: 0 -2125px;
                }
            }
            .play-icn{
                background-position: right -2325px;
                color: #333;
                i{
                    padding: 0 7px 0 30px;
                    background-position: 0 -2285px;
                }
                &:hover{
                    background-position: right -2720px;
                    i{
                        background-position: 0 -2680px;
                    }
                }
            }
            .share-icn{
                background-position: right -1020px;
                color: #333;
                i{
                    padding: 0 2px 0 28px;
                    background-position: 0 -1225px;
                }
                &:hover{
                    background-position: right -1106px;
                    i{
                        background-position: 0 -1268px;
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
        .desc{
            display: inline-block;
            margin-top: 4px;
            line-height: 18px;
            color: #666;
            word-wrap: break-word;
            word-break: break-word;
            white-space: normal;
            .tip-btn{
                margin-right: 7px;
                color: #cc0000;
                display: inline-block;
                position: relative;
                top: -1px;
                height: 16px;
                overflow: hidden;
                padding: 0 6px;
                border: 1px solid #cc0000;
                line-height: 16px;
                vertical-align: middle;
                font-size: 12px;
                cursor: pointer;
            }
        }
    }
}
</style>