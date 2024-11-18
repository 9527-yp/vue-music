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

let timer = null;
async function addMusicSongList(item: SongList) {
    let res = await songAddorDel({
        op: 'add',
        pid: item.id,
        tracks: songId.value
    })
    if(res.body.code === 502) {
        dialogStore.setMessage({
            type: 0,
            text: '歌曲已存在！',
            visible: true,
        })
    }else if(res.body.code === 200){
        dialogStore.setMessage({
            type: 1,
            text: '收藏成功',
            visible: true,
        })
        // 刷新歌单数据
        dialogStore.setIsRefreshSongList(true);
    }
    
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
        dialogStore.setMessage({
            type: 0,
            text: '',
            visible: false,
        })
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
</style>