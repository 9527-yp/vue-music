<template>
    <ul class="allAlbum-ul" v-if="list.length > 0">
        <li class="item" v-for="(item, index) in list" :key="index">
            <div class="m-cover" :title="item.name">
                <img class="img" :src="`${item.picUrl}?param=120y120`" alt="">
                <span class="msk"></span>
                <i class="play-icn" @click="playAlbum(item.id)"></i>
            </div>
            <p class="dec">
                <span class="text-hov" :title="item.name">{{item.name}}</span>
            </p>
            <p class="time">
                <span>{{formatDateTime(item.publishTime / 1000, 'Y.M.D')}}</span>
            </p>
        </li>
    </ul>
    <div v-else class="not-mv">
        <h3>
            <i class="not-icn"></i>
            暂无专辑
        </h3>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatDateTime } from '@/utils/utils.ts';
import { getAlbumMusic } from '@/api/singer.ts';
import type { ResponseType } from '@/types/index';
import type { songType } from '@/hooks/methods/songFormat.ts';
import useSongAddPlaylist from '@/hooks/useSongAddPlayList.ts';
import usePlaySong from '@/hooks/usePlaySong.ts';
import usePlayStore from '@/stores/modules/play.ts';

const playStore = usePlayStore();

// 播放显示/隐藏
const lock = computed(() => playStore.getplayLock);

defineProps({
    list: {
        type: Array,
        default: []
    }
})

const playDialogText = defineModel('playDialogText', {
    type: String,
    default: ''
})

const playDialog = defineModel('playDialog', {
    type: Boolean,
    default: false
})

// 播放
let timer = null;
let playList = []
async function playAlbum(id: number) {
    let res = await getAlbumMusic({id})
    if(res.code !== 200){
        return;
    }
    playList = res?.songs;
    let list = playList.filter((item) => isCopyright(item.id) === 2 )
    if(playList.length === 0){
        playDialogText.value = '专辑还没有添加歌曲';
        playDialog.value = true;
    }else if(list.length === 0){
        playDialogText.value = '因合作方要求，该资源暂时无法收听，我们正在努力争取歌曲回归';
        playDialog.value = true;
    }

    usePlaySong(list[0]);
    useSongAddPlaylist(list, {clear: true});
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


// 歌曲是否有版权
type itemType = {
    privilege?: {
        cp: number,
        dl: number,
        fee: number
    }
}
function isCopyright(id?: number): number | undefined {
    const item: itemType = playList.find(
        (item: { id: number }) => item.id === id
    );
    if (item?.privilege?.dl === 0) {
        if(item?.privilege.fee === 0){
            // 无版权
            return 0;
        }else if(item?.privilege.fee === 1){
            // 付费歌曲
            return 1;
        }
    }else{
        // 可播放歌曲
        return 2;
    }
}
</script>

<style lang="scss" scoped>
.allAlbum-ul{
    margin: 20px 0 0 -18px;
    .item{
        width: 145px;
        height: 175px;
        float: left;
        overflow: hidden;
        padding: 0 0 30px 18px;
        line-height: 1.4;
        .m-cover{
            position: relative;
            display: block;
            width: 120px;
            height: 120px;
            cursor: pointer;
            .img{
                display: block;
                width: 100%;
                height: 100%;
            }
            .msk{
                position: absolute;
                top: 0;
                left: 0;
                width: 145px;
                height: 120px;
                background: url('@/assets/images/home/name-D5CGUEo8.png') no-repeat;
                background-position: -170px -850px;
            }
            .play-icn{
                display: none;
                width: 28px;
                height: 28px;
                position: absolute;
                left: 85px;
                bottom: 5px;
                cursor: pointer;
                background: url('@/assets/images/home/name-Db6Jvh02.png') no-repeat;
                background-position: 0 -140px;
            }
            &:hover{
                .play-icn{
                display: block;
                } 
            }
        }
        .dec{
            color: #000;
            line-height: 19px;
            max-height: 38px;
            margin: 8px 0 3px;
            font-size: 14px;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
        }
        .time{
            width: 100%;
            color: #666;
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
.not-mv{
    margin-top: 20px;
    padding: 105px 0 105px 0;
    text-align: center;
    h3{
        padding-bottom: 38px;
        font-size: 18px;
        font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
    }
    .not-icn{
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
</style>