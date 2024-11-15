<template>
    <div class="singer-detail">
        <div class="singer-content">
            <div class="singer-header">
                <div class="header-tit">
                    <h2 class="text" :title="singerInfo?.artist?.name">{{singerInfo?.artist?.name}}</h2>
                    <img class="singer-bag" :src="`${singerInfo?.artist?.cover}?param=640y300`" alt="">
                    <div class="mask"></div>
                    <span class="artist-home" v-if="singerInfo?.user" @click="toUserHome">Ta的个人主页</span>
                    <span class="artist-sub" v-if="!singerInfo?.user?.followed" @click="colSinger(1)">收藏</span>
                    <span class="artist-sub collected" v-if="singerInfo?.user?.followed" @click="colSinger(0)">已收藏</span>
                </div>
            </div>
            <div class="tags">
                <div class="item" :class="{'active-item': tagActive === 0 }" @click="tagBtn(0)">
                    <span class="slt">
                        <em>热门作品</em>
                    </span>
                </div>
                <div class="item" :class="{'active-item': tagActive === 1 }" @click="tagBtn(1)">
                    <span class="slt">
                        <em>所有专辑</em>
                    </span>
                </div>
                <div class="item" :class="{'active-item': tagActive === 2 }" @click="tagBtn(2)">
                    <span class="slt">
                        <em>相关MV</em>
                    </span>
                </div>
                <div class="item" :class="{'active-item': tagActive === 3 }" @click="tagBtn(3)">
                    <span class="slt">
                        <em>艺人介绍</em>
                    </span>
                </div>
            </div>
            <!-- 热门作品 -->
            <div class="song-tabel-box" v-if="tagActive === 0">
                <div class="tabel-btns">
                    <span class="play-btn icn-bag btn" title="播放" @click="playListBtn">
                        <i class="play-i icn-bag btn">
                            <em class="play-icn icn-bag"></em>
                            播放
                        </i>
                    </span>
                    <span class="add-btn icn-bag" title="添加到播放列表" @click="addPlayListBtn"></span>
                    <span class="col-btn icn-bag" @click="colPlayList">
                        <i class="icn-bag">收藏热门50</i>
                    </span>
                </div>
                <div class="hotsong-list">
                    <SongListTable
                        :playList="playList"
                        :loading="loading"
                        v-model:playDialog="playDialog"
                        v-model:playDialogText="playDialogText"
                    />
                </div>
            </div>
            <!-- 所有专辑 -->
            <div class="allAlbum-box" v-if="tagActive === 1">
                <SingerAlbum 
                    :list="albumInfo.list"
                    v-model:playDialog="playDialog"
                    v-model:playDialogText="playDialogText"
                />
                <!-- 底部分页 -->
                <Page
                    v-if="albumInfo.totalCount > albumInfo.limit"
                    :total="albumInfo.totalCount"
                    :pageSize="albumInfo.limit"
                    :page="albumInfo.offset"
                    @changePage="changeAlbumPage"
                />
            </div>
            <!-- 相关MV -->
            <div class="singer-mv" v-if="tagActive === 2">
                <SingerMV :list="mvInfo.list" />
                <!-- 底部分页 -->
                <Page
                    v-if="mvInfo.totalCount > mvInfo.limit"
                    :total="mvInfo.totalCount"
                    :pageSize="mvInfo.limit"
                    :page="mvInfo.offset"
                    @changePage="changeMvPage"
                />
            </div>
            <!-- 艺人介绍 -->
            <div class="introduce" v-if="tagActive === 3">
                <h2>
                    <i class="after">&nbsp;</i>
                    {{singerInfo?.artist?.name}}简介
                </h2>
                <p class="text">{{singerInfo?.artist?.briefDesc}}</p>
            </div>
        </div>
        <!-- 左侧 -->
        <div class="singer-side">
            <div class="side-cnt">
                <h3 class="header">
                    <span>相似歌手</span>
                </h3>
                <ul class="simi-ul">
                    <li class="item" v-for="(item, index) in simiList.splice(0,6)" :key="index">
                        <div class="hd" :title="item?.name" @click="toSinger(item.id)">
                            <img :src="item?.img1v1Url" alt="">
                        </div>
                        <p>
                            <span class="text text-hov thide" :title="item?.name" @click="toSinger(item.id)">{{item?.name}}</span>
                        </p>
                    </li>
                </ul>
                <Side />
            </div>
        </div>
        <!-- 播放权限弹框 -->
        <Dialog 
            :visible="playDialog"
            showCustomButton
            @cancel='playCancel'
        >
            <p class="content-text">{{ playDialogText }}</p>
        </Dialog>
        <!-- 提示 -->
        <div class="warning-tip" v-if="warningInfo.visible">
            <i v-if="warningInfo.type" class="success-icn"></i>
            <i v-else class="warning-icn"></i>
            <span class="text">{{warningInfo.text}}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { getSingerDetail, getplayList, getSimi, getSubSinger, getAlbum, getMV } from '@/api/singer.ts';
import type { ResponseType } from '@/types/index';
import type { songType } from '@/hooks/methods/songFormat.ts';
import { useRoute, useRouter } from 'vue-router';
import SongListTable from './song-list-table/SongListTable.vue';
import SingerAlbum from './singer-album/SingerAlbum.vue';
import SingerMV from './singerMV/SingerMV.vue';
import Dialog from '@/components/dialog/dialog.vue';
import Page from '@/components/page/Page.vue';
import Side from '@/components/side-info/Side.vue';
import useSongAddPlaylist from '@/hooks/useSongAddPlayList.ts';
import usePlaySong from '@/hooks/usePlaySong.ts';
import usePlayStore from '@/stores/modules/play.ts';
import useDialogStore from '@/stores/modules/dialog.ts';


const route = useRoute();
const playStore = usePlayStore();
const dialogStore = useDialogStore();
const router = useRouter();

// 播放显示/隐藏
const lock = computed(() => playStore.getplayLock);

const playDialog = ref<boolean>(false);
const playDialogText = ref('')
const tagActive = ref(0)

function playCancel(value: boolean) {
    playDialog.value = value;
}

watch(()=> route.query.id, ()=> {
    getSingerInfo();
    getplayListData();
    getSimiList();
})

function tagBtn(index: number) {
    tagActive.value = index;
    if(index === 0){
        getplayListData();
    }else if(index === 1) {
        albumInfo.offset = 1;
        getAllAlbum();
    }else if(index === 2){
        mvInfo.offset = 1;
        getMVList();
    }
}

// 歌手基本信息
const singerInfo = ref({})
function getSingerInfo() {
    getSingerDetail({id: route.query.id}).then((res: ResponseType) => {
        if(res.code === 200) {
            singerInfo.value = res.data ?? {};
            mvInfo.totalCount = res?.data?.artist?.mvSize || 0
        }
    })
}
getSingerInfo();

// 歌手歌曲
const playList = ref([]);
const loading = ref<boolean>(false)
function getplayListData() {
    loading.value = true;
    getplayList({id: route.query.id}).then((res: ResponseType) => {
        if(res.code === 200) {
            loading.value = false;
            playList.value = res.hotSongs ?? []
        }
    })
}
getplayListData();


// 相似歌手
const simiList = ref([]);
function getSimiList() {
    getSimi({id: route.query.id}).then((res: ResponseType) => {
        if(res.code === 200) {
            simiList.value = res.artists ?? []
        }
    })
}
getSimiList();

// 所有专辑
const albumInfo = reactive({
    limit: 12,
    offset: 1,
    list: [],
    totalCount: 0
})
function getAllAlbum() {
    getAlbum({
        id: route.query.id,
        limit: albumInfo.limit,
        offset: (albumInfo.offset-1) * albumInfo.limit
    }).then((res: ResponseType) => {
        if(res.code === 200) {
            albumInfo.list = res?.hotAlbums ?? [];
            albumInfo.totalCount = res?.artist?.albumSize
        }
    })
}

function changeAlbumPage(value: number) {
    albumInfo.offset = value;
    getAllAlbum();
}

// 所有MV
const mvInfo = reactive({
    limit: 12,
    offset: 1,
    list: [],
    totalCount: 0
})
function getMVList() {
    getMV({
        id: route.query.id,
        limit: mvInfo.limit,
        offset: (mvInfo.offset-1) * mvInfo.limit
    }).then((res: ResponseType) => {
        if(res.code === 200) {
            mvInfo.list = res?.mvs ?? [];
        }
    })
}

function changeMvPage(value: number) {
    mvInfo.offset = value;
    getMVList();
}

// 播放
let timer = null;
function playListBtn() {
    if (playList.value?.length === 0) {
        return;
    }

    // 过滤无版权
    const songList: songType[] = playList.value.filter(
        (item: { id: number }) => !isCopyright(item.id)
    );

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

// 添加到播放列表
function addPlayListBtn() {
    if (playList.value?.length === 0) {
        return;
    }

    // 过滤无版权
    const songList: songType[] = playList.value.filter(
        (item: { id: number }) => !isCopyright(item.id)
    );

    // 将歌曲添加到播放列表
    useSongAddPlaylist(songList)

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

// 收藏热门50首
function colPlayList() {
    const ids = playList.value.map((item: { id: number }) => item.id)
    dialogStore.setSongId(ids.join());
    dialogStore.setSongListShow(true);
}

// 收藏、取消收藏歌手
const warningInfo = reactive({
    text: '',
    visible: false,
    type:0, // 0:警告 ，1：成功
    time: null
})
function colSinger(index: number) {
    getSubSinger({
        id: singerInfo.value?.user?.userId,
        t: index
    }).then((res: ResponseType) => {
        if(res.code === 200) {
            getSingerInfo();
            warningInfo.type = 1;
            warningInfo.text = index ? '收藏成功' : '取消收藏成功';
        }else{
            warningInfo.type = 0;
            warningInfo.text = index ? '收藏失败' : '取消收藏失败';
        }
        warningInfo.visible = true;
        warningInfo.time && clearTimeout( warningInfo.time);
        warningInfo.time = setTimeout(() => {
            warningInfo.visible = false;
        }, 1500);
    })

}

type itemType = {
    privilege?: {
        cp: number
    }
}
// 歌曲是否有版权
function isCopyright(id: number): boolean | undefined {
  const item: itemType = playList.value?.find(
    (item: { id: number }) => item.id === id
  );

  if (item?.privilege?.cp === 0) {
    return true;
  }

  return false;
}

function toSinger(id: number) {
    router.push({
        path: '/singer',
        query: {
            id
        }
    })
}

function toUserHome() {
    router.push({
        path: '/user/home',
        query: {
            id: singerInfo.value?.user?.userId
        }
    })
}
</script>


<style lang="scss" scoped>
.singer-detail{
    width: 980px;
    min-height: 700px;
    margin: 0 auto;
    background-color: #fff;
    border: 1px solid #d3d3d3;
    border-width: 0 1px;
    background: url('@/assets/images/play-list/wrap4.png');
    .singer-content{
        display: inline-block;
        width: calc(100% - 271px);
        padding: 27px 30px 40px 39px;
        vertical-align: top;
        box-sizing: border-box;
        .singer-header{
            position: relative;
            height: 333px;
            .header-tit{
                .text{
                    max-width: 75%;
                    height: 34px;
                    line-height: 24px;
                    font-weight: normal;
                    font-size: 24px;
                    color: #333;
                }
            }
            .singer-bag{
                display: block;
                width: 640px;
                height: 300px;
            }
            .mask{
                position: absolute;
                top: 34px;
                left: 0;
                width: 640px;
                height: 300px;
                background: url('@/assets/images/singer/ban_mask.png') no-repeat;
            }
            .artist-home{
                position: absolute;
                bottom: 18px;
                right: 116px;
                width: 96px;
                height: 32px;
                text-indent: -9999px;
                background: url('@/assets/images/play/iconall.png') no-repeat;
                background-position: 0 -1156px;
                cursor: pointer;
            }
            .artist-sub{
                display: block;
                position: absolute;
                bottom: 18px;
                right: 20px;
                width: 76px;
                height: 32px;
                text-indent: -9999px;
                background: url('@/assets/images/play/iconall.png') no-repeat;
                background-position: 0 -500px;
                cursor: pointer;
            }
            .collected{
                background-position: 0 -735px;
                &:hover{
                    background-position: 0 -781px;
                }
            }
        }
        .tags{
            height: 39px;
            display: flex;
            border: 1px solid #ccc;
            border-width: 0 1px;
            background: url('@/assets/images/singer/tab.png') no-repeat;
            background-position: 0 0;
            background-repeat: repeat-x;
            .item{
                position: relative;
                left: -1px;
                height: 39px;
                font-size: 14px;
                .slt{
                    float: left;
                    height: 39px;
                    font-size: 14px;
                    padding-left: 2px;
                    background: url('@/assets/images/singer/tab.png') no-repeat;
                    cursor: pointer;
                    em{
                        float: left;
                        height: 37px;
                        width: 134px;
                        padding: 2px 2px 0 0;
                        line-height: 37px;
                        cursor: pointer;
                        text-align: center;
                        font-size: 14px;
                        background: url('@/assets/images/singer/tab.png') no-repeat;
                    }
                }
                &:hover{
                    .slt{
                        background-position: left -90px;
                        em{
                            background-position: right -90px;
                        }
                    }
                }
            }
            .active-item{
                .slt{
                    background-position: left -90px;
                    em{
                        background-position: right -90px;
                    }
                }
            }
        }
        .song-tabel-box{
            .tabel-btns{
                margin: 20px 0 10px;
                .icn-bag{
                    background: url('@/assets/images/login/button-bag.png') no-repeat;
                }
                .btn{
                    color: #fff;
                    height: 31px;
                    overflow: hidden;
                    vertical-align: top;
                    text-align: center;
                    cursor: pointer;
                }
                .play-btn{
                    float: left;
                    padding: 0 5px 0 0;
                    background-position: right -428px;
                    .play-i{
                        padding: 0 7px 0 8px;
                        display: inline-block;
                        line-height: 28px;
                        background-position: 0 -387px;
                        .play-icn{
                            float: left;
                            width: 20px;
                            height: 18px;
                            margin: 6px 2px 2px 0;
                            background-position: 0 -1622px;
                            overflow: hidden;
                        }
                    }
                    &:hover{
                        background-position: right -510px;
                        .play-i{
                            background-position: 0 -469px;
                        }
                        .play-icn{
                            background-position: -28px -1622px;
                        }
                        
                    }
                }
                .add-btn{
                    margin-right: 5px;
                    width: 31px;
                    margin-left: -3px;
                    float: left;
                    height: 31px;
                    cursor: pointer;
                    background-position: 0 -1588px;
                    font-family: simsun, \5b8b\4f53;
                    &:hover{
                        background-position: -40px -1588px;
                    }
                }
                .col-btn{
                    margin-right: 6px;
                    color: #333;
                    padding: 0 5px 0 0;
                    white-space: nowrap;
                    float: left;
                    cursor: pointer;
                    font-family: simsun, \5b8b\4f53;
                    background-position: right -1020px;
                    i{
                        padding-right: 2px;
                        padding-left: 28px;
                        float: left;
                        height: 31px;
                        line-height: 30px;
                        min-width: 23px;
                        cursor: pointer;
                        background-position: 0 -977px;
                    }
                    &:hover{
                        background-position: right -1106px;
                        i{
                            background-position: 0 -1063px;
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
        }
        .introduce{
            margin-top: 30px;
            h2{
                margin-bottom: 8px;
                color: #333;
                font-size: 14px;
            }
            .after{
                margin-right: 7px;
                background: #c10d0c;
            }
            .text{
                line-height: 25px;
                color: #666;
                text-indent: 2em;
            }
        }
    }
    .singer-side{
        display: inline-block;
        width: 270px;
        vertical-align: top;
        .side-cnt{
            padding: 20px 40px 40px 30px;
            .header{
                position: relative;
                height: 23px;
                margin-bottom: 20px;
                border-bottom: 1px solid #ccc;
                color: #333;
                font-size: 100%;
            }
            .simi-ul{
                margin-left: -25px;
                .item{
                    float: left;
                    width: 50px;
                    height: 92px;
                    padding-left: 25px;
                    .hd{
                        width: 50px;
                        height: 50px;
                        cursor: pointer;
                        img{
                            width: 50px;
                            height: 50px;
                        }
                    }
                    p{
                        margin-top: 7px;
                        text-align: center;
                        .text{
                            display: inline-block;
                            width: 50px;
                            vertical-align: middle;
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