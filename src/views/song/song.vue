<template>
    <div class="song">
        <div class="music-box">
            <div class="song-info">
                <SongInfo 
                    :songDetailData="songDetailData" 
                    :list="lyric.list" 
                    :id="id" 
                    @playMusic="playMusic"
                    @addMusic="addMusic"
                    @collectMusic="collectMusic"
                    @notFeatureTip="notFeatureTip"
                />
                <!--
                    歌曲被翻译有transUser, 没有lyricUser
                    歌曲没被翻译有lyricUser, 没有transUser
                -->
                <div class="user-operation">
                    <p>
                        <a
                            class="error-btn"
                            :href="`https://music.163.com/#/lyric/report?id=${route.query.id}`"
                            target="_blank"
                        >
                        报错
                        </a>
                    </p>
                    <p v-if="lyric.lyricUser?.nickname">
                        贡献滚动歌词：
                        <span class="contribution">{{lyric.lyricUser.nickname}}</span>
                    </p>
                </div>
                <!-- 评论 -->
                <Comment
                    :commentInfo="musicCommentInfo" 
                    @publishComment="publishComment"
                />
                <!-- 底部分页 -->
                <Page
                    v-if="musicCommentInfo.totalCount > musicCommentInfo.limit"
                    :total="musicCommentInfo.totalCount"
                    :pageSize="musicCommentInfo.limit"
                    :page="musicCommentInfo.offset"
                    @changePage="changePage"
                />
            </div>
        </div>
        <div class="music-side">
            <h3 class="header">
                <span>包含这首歌的歌单</span>
            </h3>
            <ul class="recommend-ul">
                <li class="item" v-for="item in playListData" :key="item.id">
                    <div class="song-img" :title="item.name" @click="toPlayList(item.id)">
                        <img :src="item.coverImgUrl" alt="">
                    </div>
                    <div class="info">
                        <p class="thide">
                            <span class="song-name text-hov" @click="toPlayList(item.id)">{{item.name}}</span>
                        </p>
                        <p>
                            <span class="by">by</span>
                            <span class="nm thide text-hov" :title="item.creator.nickname" @click="toUserHome(item.userId)">{{item.creator.nickname}}</span>
                        </p>
                    </div>
                </li>
            </ul>
            <h3 class="header">
                <span>相似的歌曲</span>
            </h3>
            <ul class="m-sglist">
                <li class="sglist-item" v-for="item in songList" :key="item.id">
                    <div class="item-left">
                        <div class="thide">
                            <span class="text-tit text-hov" :title="item.name">{{item.name}}</span>
                        </div>
                        <div class="thide">
                            <template v-for="(key, i) in item?.artists" :key="i">
                                <span class="text-hov" :title="key.name">{{key.name}}</span><i v-show="i !== item?.artists.length-1">/</i>
                            </template>
                            
                        </div>
                    </div>
                    <div class="item-right">
                        <i class="play-icn icn"></i>
                        <i class="add-icn icn"></i>
                    </div>
                </li>
            </ul>
            <div class="m-multi">
                <h3 class="header">
                    <span>网易云音乐多端下载</span>
                </h3>
                <ul class="down-ul">
                    <li class="item">
                        <span class="ios"></span>
                    </li>
                    <li class="item">
                        <span class="pc"></span>
                    </li>
                    <li class="item">
                        <span class="aos"></span>
                    </li>
                </ul>
                <p>同步歌单，随时畅听好音乐</p>
            </div>
            <h3 class="header">
                <span>用户wiki</span>
            </h3>
            <a class="wiki-edit text-hov" href="">
                <img class="img" src="@/assets/images/my-music/icn.png" alt="">
                <span>补充或修改歌曲资料</span>
            </a>
            <a class="wiki-edit text-hov" href="">
                <img class="img" src="@/assets/images/my-music/icn.png" alt="">
                <span>用户wiki任务中心</span>
            </a>
        </div>
        <!-- 播放权限弹框 -->
        <Dialog 
            :visible="playDialog"
            showCustomButton
            @cancel='playCancel'
        >
            <p class="content-text">{{ playDialogText }}</p>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { getLyric, getDetail, getComment, getSimiPlayList, getSimiSong } from '@/api/song.ts';
import { useRoute, useRouter } from 'vue-router';
import type { ResponseType } from '@/types/index';
import type { songType } from '@/hooks/methods/songFormat.ts';
import Dialog from '@/components/dialog/dialog.vue';
import SongInfo from './song-info/SongInfo.vue';
import Comment from '@/components/comment/Comment.vue';
import Page from '@/components/page/Page.vue';
import { handleCommentList } from '@/components/comment/handleCommentList.ts';
import useSongAddPlaylist from '@/hooks/useSongAddPlayList.ts';
import usePlaySong from '@/hooks/usePlaySong.ts';
import usePlayStore from '@/stores/modules/play.ts';
import useDialogStore from '@/stores/modules/dialog.ts';

type Lyric = {
  lyricUser: {
    userid?: number;
    nickname?: string;
  };
  transUser: {
    userid?: number;
    nickname?: string;
  };
  list: {
    lyric: string;
    time: number;
  }[];
};

const route = useRoute();
const router = useRouter();
const playStore = usePlayStore();
const dialogStore = useDialogStore();

// 播放显示/隐藏
const lock = computed(() => playStore.getplayLock);

const id = route.query.id

// 获取歌曲详情
const songDetailData = ref({})
function getDetailInfo() {
    getDetail({ids: route.query.id}).then((res: ResponseType) => {
        if(res.code === 200) {
            songDetailData.value = res ?? {};
        }
    })
}
getDetailInfo();


// 获取评论
const musicCommentInfo = reactive({
    id: Number(route.query.id),
    type: 0,
    offset: 1,
    limit: 20,
    totalCount: 0,
    hotCommentList: [], // 热门评论
    newCommentList: [] // 最新评论
})
function getCommentList() {
    getComment({
        id: musicCommentInfo.id,
        offset: (musicCommentInfo.offset - 1) * musicCommentInfo.limit,
        limit: musicCommentInfo.limit
    }).then((res: ResponseType) => {
        if(res.code === 200) {
            const result = handleCommentList(res)
            musicCommentInfo.hotCommentList = result?.hotComments ?? []
            
            musicCommentInfo.newCommentList = result?.comments ?? []
            
            musicCommentInfo.totalCount = result?.total ?? 0
        }
    })
}
getCommentList();


// 评论操作
function publishComment() {
    getCommentList();
}

// 评论分页切换
function changePage(value: number) {
    musicCommentInfo.offset = value;
    getCommentList();
}

// 获取相似歌单及相似音乐
const playListData = ref([]);
function getSimiPlayListData() {
    getSimiPlayList({id: route.query.id}).then((res: ResponseType) => {
        if(res.code === 200) {
            playListData.value = res.playlists;
        }
    })
}
getSimiPlayListData()

const songList = ref([])
function getSimiSongData() {
    getSimiSong({id: route.query.id}).then((res: ResponseType) => {
        if(res.code === 200) {
            songList.value = res.songs;
        }
    })
}
getSimiSongData();

// 获取歌词
const lyric = reactive<Lyric>({
  lyricUser: {},
  transUser: {},
  list: []
});
function getLyricData() {
    getLyric({id: route.query.id}).then((res: ResponseType) => {
        if(res.code === 200) {
            lyric.lyricUser = res.lyricUser;
            lyric.transUser = res.transUser;
            handlerLyric(res.lrc?.lyric);
        }
    })
}
getLyricData();

// 处理歌词数据
function handlerLyric(lyricStr: string): void {
  lyric.list = [];

  const regNewLine = /\n/;
  // 每行歌词的数组
  const lineArr = lyricStr.split(regNewLine);
  const regTime = /\[\d{2}:\d{2}.\d{2,3}\]/;
  lineArr.forEach?.((item: string) => {
    if (item === '') return;
    const obj = {
      lyric: '',
      time: -1
    };
    const time = item.match(regTime);
    if (item.includes?.('[')) {
      obj.lyric =
        item.split(']')[1].trim() === '' ? '' : item.split(']')[1].trim();
      obj.time = time
        ? formatLyricTime(time[0].slice(1, time[0].length - 1))
        : 0;
    } else {
      obj.lyric = item;
    }
    lyric.list.push(obj);
  });
}

// 格式化歌词的时间(转换成 s.ms)
function formatLyricTime(time: string): number {
  const regMin = /.*:/;
  const regSec = /:.*\./;
  const regMs = /\./;

  // 分
  let min = '';
  const rMin = time.match(regMin);
  if (rMin instanceof Array) {
    min = rMin[0].slice?.(0, 2);
  }
  // 秒
  let second = '';
  const rSec = time.match(regSec);
  if (rSec instanceof Array) {
    second = rSec[0].slice?.(1, 3);
  }
  // 毫秒
  let ms = '';
  const rMs = time.match(regMs);
  if (rMs?.index) {
    ms = time.slice?.(rMs.index + 1, rMs.index + 3);
  }
  // 分 + 秒
  if (min && parseInt(min) !== 0) {
    second = (parseInt(min) * 60 + parseInt(second)).toString();
  }

  return Number(second + '.' + ms);
}

// 播放列表歌曲
let timer = null;
const playDialog = ref(false);
const playDialogText = ref('');
function playMusic(item: songType) {
    let index = isCopyright()

    if(index === 0) {
        playDialogText.value = '因合作方要求，该资源暂时无法收听，我们正在努力争取歌曲回归';
        playDialog.value = true;
        return;
    }else if(index === 1){
        playDialogText.value = '该歌曲为付费歌曲，请购买后聆听';
        playDialog.value = true;
        return;
    }
    
    usePlaySong(songDetailData.value?.songs[0]);
    useSongAddPlaylist(songDetailData.value?.songs[0]);
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
function addMusic() {
    let index = isCopyright()

    if(index === 0) {
        playDialogText.value = '因合作方要求，该资源暂时无法收听，我们正在努力争取歌曲回归';
        playDialog.value = true;
        return;
    }else if(index === 1){
        playDialogText.value = '该歌曲为付费歌曲，请购买后聆听';
        playDialog.value = true;
        return;
    }

    useSongAddPlaylist(songDetailData.value?.songs[0])
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

// 收藏
function collectMusic() {
    let index = isCopyright()

    if(index === 0) {
        playDialogText.value = '因合作方要求，该资源暂时无法收听，我们正在努力争取歌曲回归';
        playDialog.value = true;
        return;
    }else if(index === 1){
        playDialogText.value = '该歌曲为付费歌曲，请购买后聆听';
        playDialog.value = true;
        return;
    }
    
    dialogStore.setSongId(songDetailData.value?.songs[0]?.id);
    dialogStore.setSongListShow(true);
}

// 功能暂未开发提示
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

function playCancel(value: boolean) {
    playDialog.value = value;
}

function isCopyright(): number | undefined {
    
    if (songDetailData?.privilege?.[0]?.dl === 0) {
        if(songDetailData?.privilege?.[0]?.fee === 0){
            // 无版权
            return 0;
        }else if(songDetailData?.privilege?.[0]?.fee === 1){
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
.song{
    width: 980px;
    min-height: 700px;
    margin: 0 auto;
    background-color: #fff;
    border: 1px solid #d3d3d3;
    border-width: 0 1px;
    background: url('@/assets/images/play-list/wrap4.png');
    .music-box{
        float: left;
        width: 100%;
        margin-right: -270px;
        .song-info{
            margin-right: 271px;
            padding: 47px 30px 40px 39px;
            .user-operation{
                text-align: right;
                margin-top: 48px;
                line-height: 30px;
                p{
                    color: #666;
                }
                .error-btn{
                    color: #999;
                    text-decoration: underline;
                }
                .contribution{
                    color: #0c73c2;
                    text-decoration: underline;
                    cursor: pointer;
                }
            }
        }
    }
    .music-side{
        position: relative;
        float: right;
        width: 270px;
        padding: 20px 40px 40px 30px;
        box-sizing: border-box;
        .header{
            position: relative;
            height: 23px;
            margin-bottom: 20px;
            border-bottom: 1px solid #ccc;
            color: #333;
            font-size: 100%;
        }
        .recommend-ul{
            margin-bottom: 25px;
            .item{
                float: left;
                width: 200px;
                height: 50px;
                margin-bottom: 15px;
                line-height: 24px;
                .song-img{
                    margin-right: -60px;
                    float: left;
                    width: 50px;
                    height: 50px;
                    cursor: pointer;
                    img{
                        width: 50px;
                        height: 50px;
                    }
                }
                .info{
                    margin-left: 60px;
                    line-height: 24px;
                    p{
                        width: 140px;
                    }
                    .song-name{
                        color: #000;
                        font-size: 14px;
                        cursor: pointer;
                    }
                    .by{
                        float: left;
                        color: #999;
                    }
                    .nm{
                        float: left;
                        max-width: 106px;
                        margin: 0 2px 0 4px;
                        color: #666;
                        cursor: pointer;
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
        .m-sglist{
            margin-bottom: 25px;
            .sglist-item{
                margin-top: 10px;
                .item-left{
                    float: left;
                    width: 156px;
                    line-height: 16px;
                    color: #999;
                    .text-tit{
                        color: #333;
                    }
                }
                .item-right{
                    float: right;
                    position: relative;
                    top: 10px;
                    line-height: 32px;
                    .icn{
                        float: left;
                        width: 10px;
                        height: 11px;
                        opacity: 0.9;
                        cursor: pointer;
                        background: url('@/assets/images/icon2.png') no-repeat;
                    }
                    .play-icn{
                        margin-right: 16px;
                        background-position: -69px -455px;
                        &:hover{
                            opacity: 1;
                        }
                    }
                    .add-icn{
                        background-position: -87px -454px;
                        &:hover{
                            opacity: 1;
                        }
                    }
                    &:after {
                        clear: both;
                        content: '.';
                        display: block;
                        height: 0;
                        visibility: hidden;
                    }
                }
                &:after {
                    clear: both;
                    content: '.';
                    display: block;
                    height: 0;
                    visibility: hidden;
                }
            }
        }
        .m-multi{
            margin: 20px 0;
            padding-bottom: 20px;
            .down-ul{
                height: 65px;
                margin-bottom: 10px;
                background: url('@/assets/images/sprite.png') no-repeat;
                background-position: 0 -392px;
                .item{
                    float: left;
                    .ios{
                        display: block;
                        width: 42px;
                        height: 48px;
                        cursor: pointer;
                        &:hover{
                            background: url('@/assets/images/sprite.png') no-repeat;
                            background-position: 0 -472px;
                        }
                    }
                    .pc{
                        display: block;
                        width: 60px;
                        margin: 0 26px 0 30px;
                        height: 48px;
                        cursor: pointer;
                        &:hover{
                            background: url('@/assets/images/sprite.png') no-repeat;
                            background-position: -72px -472px;
                        }
                    }
                    .aos{
                        display: block;
                        width: 42px;
                        height: 48px;
                        cursor: pointer;
                        &:hover{
                            background: url('@/assets/images/sprite.png') no-repeat;
                            background-position: -158px -472px;
                        }
                    }
                }
            }
            p{
                color: #999;
            }
        }
        .wiki-edit{
            margin-bottom: 5px;
            display: block;
            margin-left: -4px;
            line-height: 12px;
            color: #333;
            .img{
                vertical-align: middle;
            }
            span{
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
</style>