<template>
    <Dialog 
      :visible="songListShow"
      title="添加到歌单"
      @cancel='songCancel'
      class="song-dialog"
    >
        <template #content>
            <div class="song-box">
                <div class="song-add" @click="addSongList">
                    <i class="add-song-icn"></i>
                    新歌单
                </div>
                <div class="song-item" v-for="item in songSheetList.createdSongSheet" :key="item.id" @click="addMusicSongList(item)">
                    <div class="song-img">
                        <img :src="item?.coverImgUrl" alt="">
                    </div>
                    <div class="song-right">
                        <p class="song-name thide">{{item.name}}</p>
                        <p class="song-num">{{item.trackCount}}首</p>
                    </div>
                </div>
            </div>
        </template>
    </Dialog>
    <div class="warning-tip" v-if="warningInfo.visible">
        <i v-if="warningInfo.type" class="success-icn"></i>
        <i v-else class="warning-icn"></i>
        <span class="text">{{warningInfo.text}}</span>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive }from 'vue';
import Dialog from '@/components/dialog/dialog.vue';
import type { SongSheetList, TypeSongSheet } from './types/type.ts';
import type { ResponseType } from '@/types/index';
import { getSongList } from '@/api/my-music.ts';
import { songAddorDel } from '@/api/my-music.ts';
import useUserStore from '@/stores/modules/user.ts';
import useDialogStore from '@/stores/modules/dialog.ts';

const userStore = useUserStore();
const dialogStore = useDialogStore();

const userInfo = computed(() => userStore.getUserInfo);
const songListShow = computed(() => dialogStore.getSongListShow);
const songId = computed(() => dialogStore.getSongId);

const songSheetList = reactive<TypeSongSheet>({
    createdSongSheet: []
})
function getSongListData ()  {
    getSongList({uid: userInfo.value?.profile?.userId}).then((res: ResponseType) => {
        if(res.code === 200) {
            res.playlist?.forEach?.((item: SongSheetList) => {
                if (item.name?.includes?.('喜欢的音乐')) {
                    item.name = '我喜欢的音乐';
                }
            });
            
            // 创建/收藏的歌单
            songSheetList.createdSongSheet = res.playlist?.filter?.(
                (item: SongSheetList) => !item.subscribed
            );
        }
    })
}
getSongListData()

type SongList = {
    name: string,
    id: number | string,
    coverImgUrl: string,
    trackCount: number | string,
}
const warningInfo = reactive({
    text: '',
    visible: false,
    type:0, // 0:警告 ，1：成功
    time: null
})
async function addMusicSongList(item: SongList) {
    let res = await songAddorDel({
        op: 'add',
        pid: item.id,
        tracks: songId.value
    })
    if(res.body.code === 502) {
        warningInfo.type = 0;
        warningInfo.text = '歌曲已存在！';
    }else if(res.body.code === 200){
        warningInfo.type = 1;
        warningInfo.text = '收藏成功';
        // 刷新歌单数据
        dialogStore.setIsRefreshSongList(true);
    }
    warningInfo.visible = true;
    warningInfo.time && clearTimeout( warningInfo.time);
    warningInfo.time = setTimeout(() => {
        warningInfo.visible = false;
    }, 1500);
    dialogStore.setSongListShow(false);
}
function addSongList() {
    dialogStore.setSongListShow(false);
    dialogStore.setAddSongListShow(true);
}

// 关闭弹框
function songCancel() {
    dialogStore.setSongListShow(false);
}
</script>

<style lang="scss" scoped>
.song-dialog{
    .song-box{
        overflow-y: auto;
        height: 374px;
        padding-bottom: 15px;
        .song-add{
            padding: 10px 0 10px 35px;
            background: #e6e6e6;
            text-align: left;
            cursor: pointer;
            .add-song-icn{
                width: 35px;
                height: 36px;
                margin-right: 10px;
                display: inline-block;
                overflow: hidden;
                vertical-align: middle;
                background: url('@/assets/images/icon.png') no-repeat 0 9999px;
                background-position: 0 -495px;
            }
        }
        .song-item{
            display: flex;
            padding: 6px 0 6px 35px;
            border-top: 1px solid #e0e0e0;
            cursor: pointer;
            .song-img{
                width: 40px;
                height: 40px;
                min-width: 40px;
                min-height: 40px;
                margin-right: 10px;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .song-right{
                width: 100%;
                .song-name{
                    width: 100%;
                    color: #000;
                    margin-top: 2px;
                    margin-bottom: 8px;
                    text-align: left;
                    word-wrap: break-word;
                }
                .song-num{
                    text-align: left;
                    word-wrap: break-word;
                    color: #666;
                }
            }
            &:hover{
                background: #f2f2f2;
            }
        }
    }
}
.warning-tip{
    width: 280px;
    background: #fff;
    color: #333;
    line-height: 52px;
    text-align: center;
    border: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    position: absolute;
    top:50%;
    left: 50%;
    z-index: 20002;
    margin-top: -40px;
    margin-left: -140px;
    vertical-align: middle;
    .warning-icn{
        width: 20px;
        height: 20px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 3px;
        background: url('@/assets/images/icon.png') no-repeat;
        background-position: -24px -406px;
    }
    .success-icn{
        width: 20px;
        height: 20px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 3px;
        background: url('@/assets/images/icon.png') no-repeat;
        background-position: -24px -430px;
    }
    .text{
        display: inline-block;
        vertical-align: middle;
    }
}
</style>