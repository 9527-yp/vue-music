<template>
    <div class="n-minelst">
        <h2>
            <div class="add-song-list" v-if="title === '创建的歌单'">
                <span class="text" @click="addSongList">新建</span>
            </div>
            <span class="rtitle">
                <span class="tri" :class="foundSongListShow ? 'tri1' : 'tri1-hide'" @click="foundSongListChange"></span>
                {{ title }}
                <span>({{count}})</span>
            </span>
        </h2>
        <ul class="list-ul" v-show="foundSongListShow">
            <li class="item" 
             :class="{'active-item' : item.id === songSheetId}"
             v-for="(item, index) in list"
             :key="item.id"
             @click="songChange(item)"
            >
                <div class="item-content">
                    <div class="item-img-box">
                        <img :src="item?.coverImgUrl" alt="">
                    </div>
                    <p class="item-name">{{item.name}}</p>
                    <p class="item-num">{{item.trackCount}}首</p>
                </div>
                <span class="oper" v-if="item.name !== '我喜欢的音乐'">
                    <i class="icn edit-icn" v-if="title === '创建的歌单'" @click.stop="editSongList"></i>
                    <i class="icn delete-icn" @click.stop="deleteSongListBtn(item)"></i>
                </span>
            </li>
        </ul>
    </div>
    <teleport to="body">
        <div class="warning-tip" v-if="warningInfo.visible">
            <i v-if="warningInfo.type" class="success-icn"></i>
            <i v-else class="warning-icn"></i>
            <span class="text">{{warningInfo.text}}</span>
        </div>
    </teleport>
    <!-- 删除歌单弹框 -->
    <teleport to="body">
        <Dialog 
        :visible="deleteSongListDialog"
        :confirmtext="'确定'"
        :canceltext="'取消'"
        showConfirmButton
        showCancelButton
        @confirm='deleteConfirm'
        @cancel='deleteCancel'
        >
            <p class="content-text">确定删除歌单？</p>
        </Dialog>
    </teleport>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { SongSheetList } from './types/type';
import type { ResponseType } from '@/types/index';
import useDialogStore from '@/stores/modules/dialog.ts';
import Dialog from '@/components/dialog/dialog.vue';
import { deleteSongList } from '@/api/my-music.ts';

const emit = defineEmits(['songListItem'])
defineProps({
    title: {
        type: String,
        default: ''
    },
    count: {
        type: Number,
        default: 0
    },
    list: {
        type: Array,
        default: []
    },
    visible: {
        type: Boolean,
        default: false
    },
    songSheetId: {
        type: Number,
        default: 0
    }
})

const dialogStore = useDialogStore();

// 创建的歌单
const foundSongListShow = ref<boolean>(true);
function foundSongListChange() {
    foundSongListShow.value = !foundSongListShow.value
}

function songChange(item: SongSheetList) {
    emit('songListItem',item.id)
}

function addSongList() {
    dialogStore.setAddSongListShow(true);
}

const warningInfo = reactive({
    text: '',
    visible: false,
    type:0, // 0:警告 ，1：成功
    time: null
})
function editSongList() {
    warningInfo.type = 0;
    warningInfo.text = '功能暂未开发';
    warningInfo.visible = true;
    warningInfo.time && clearTimeout( warningInfo.time);
    warningInfo.time = setTimeout(() => {
        warningInfo.visible = false;
    }, 1500);
}

const deleteSongListDialog = ref(false);
const songListId = ref(undefined);
function deleteSongListBtn(item: SongSheetList) {
    songListId.value = item.id
    deleteSongListDialog.value = true;
}

function deleteConfirm() {
    deleteSongList({id: songListId.value}).then((res: ResponseType) => {
        if(res.code === 200) {
            // 刷新歌单数据
            dialogStore.setIsRefreshSongList(true);
            deleteSongListDialog.value = false;
        }
    })
}

function deleteCancel() {
    deleteSongListDialog.value = false;
}
</script>

<style lang="scss" scoped>
.n-minelst{
    margin-top: 8px;
    font-size: 14px;
    h2{
        padding:0 10px 12px 15px;
        font-size: 14px;
        color: #000;
        font-family: simsun, \5b8b\4f53;
        .add-song-list{
            width: 52px;
            height: 22px;
            background: url('@/assets/images/my-music/button.png') no-repeat 0 9999px;
            background-position: 0 -96px;
            float: right;
            cursor: pointer;
            color: #333;
            &:hover{
                background-position: -94px -39px;
            }
            .text{
                display: inline-block;
                line-height: 22px;
                overflow: hidden;
                padding-left: 20px;
                color: #515151;
                font-size: 12px;
                font-weight: normal;
            }
        }
        .rtitle{
            position: relative;
            zoom: 1;
            display: inline-block;
            cursor: pointer;
            vertical-align: top;
            .tri {
                display: inline-block;
                vertical-align: middle;
                margin: 0 2px 0 5px;
                cursor: pointer;
                font-size: 0;
                height: 0;
                line-height: 0;
            }
            .tri1{
                border-color: #ccc transparent transparent;
                border-style: solid dashed dashed;
                border-width: 8px 7px 0;
            }
            .tri1-hide{
                border: 8px solid #ccc;
                border-color: transparent transparent transparent #ccc;
                border-style: dashed dashed dashed solid;
                margin-right: 0;
            }
        }
    }
    .list-ul{
        cursor: pointer;
        vertical-align: middle;
        &:after {
            clear: both;
            content: '.';
            display: block;
            height: 0;
            visibility: hidden;
        }
        .item{
            position: relative;
            zoom: 1;
            height: 42px;
            padding: 6px 0 6px 20px;
            font-size: 12px;
            .item-content{
                padding-left: 50px;
                .item-img-box{
                    float: left;
                    margin-left: -50px;
                    overflow: hidden;
                    width: 40px;
                    img{
                        width: 40px;
                        height: 40px;
                    }
                }
                .item-name{
                    width: 150px;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    word-wrap: normal;
                    overflow: hidden;
                    margin-top: 2px;
                    margin-bottom: 8px;
                }
                .item-num{
                    width: 130px;
                    color: #999;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    word-wrap: normal;
                }
            }
            .oper{
                display:none;
                position: absolute;
                bottom: 7px;
                right: 0;
                .icn{
                    float: left;
                    margin-right: 10px;
                    overflow: hidden;
                    background: url('@/assets/images/icon.png') no-repeat 0 9999px;
                }
                .edit-icn{
                    width: 13px;
                    height: 13px;
                    background-position: 0 -270px;
                    &:hover{
                        background-position: -20px -270px;
                    }
                }
                .delete-icn{
                    width: 13px;
                    height: 14px;
                    background-position: 0 -284px;
                    &:hover{
                        background-position: -20px -284px;
                    }
                }
            }
            &:hover{
                .oper{
                    display: block;
                }
            }
        }
        .active-item{
            background: #e6e6e6;
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