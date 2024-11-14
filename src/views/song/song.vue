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
                    @jumpToComment="jumpToComment"
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
                    class="playList-comment"
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
        <SongSide @playSimiMusic="playSimiMusic" @addSimiMusic="addSimiMusic" />
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
import { ref, reactive, computed, watch } from 'vue';
import { getLyric, getDetail, getComment } from '@/api/song.ts';
import { useRoute, useRouter } from 'vue-router';
import type { ResponseType } from '@/types/index';
import type { songType } from '@/hooks/methods/songFormat.ts';
import Dialog from '@/components/dialog/dialog.vue';
import SongInfo from './song-info/SongInfo.vue';
import Comment from '@/components/comment/Comment.vue';
import SongSide from './song-side/SongSide.vue'
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

// 监听歌曲id变化
watch(() => route.query.id, () => {
    musicCommentInfo.id = Number(route.query.id)
    getDetailInfo();
    getCommentList();
    getLyricData();
})
// 播放显示/隐藏
const lock = computed(() => playStore.getplayLock);

const id = route.query.id

// 获取歌曲详情
type songDetailItem = {
    songs?: {
        id: number
    }[],
    privilege?: {
        dl: number,
        fee: number
    }[]
}
const songDetailData = ref<songDetailItem>({})
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
    let index = isCopyright(songDetailData.value?.privilege?.[0])

    commonalityFun(index, songDetailData.value?.songs[0], 'play' )
}

// 播放相似歌曲
async function playSimiMusic(id: number): Promise<undefined> {
    let res = await getDetail({ids: id})
    if(res.code !== 200){
        return;
    }

    let index = isCopyright(res?.privilege?.[0])

    commonalityFun(index, res?.songs[0], 'play' )
}

// 添加到播放列表
function addMusic() {
    let index = isCopyright(songDetailData.value?.privilege?.[0])
    commonalityFun(index, songDetailData.value?.songs[0], 'add' )
}

// 添加相似歌曲到播放列表
async function addSimiMusic(id: number) {
    let res = await getDetail({ids: id})
    if(res.code !== 200){
        return;
    }

    let index = isCopyright(res?.privilege?.[0])

    commonalityFun(index, res?.songs[0], 'add' )
}

// 公共方法
/**
 * index 歌曲权限
 * songItem 歌曲详情数据
 * type 播放或添加到播放列表
 */
function commonalityFun(index: number, songItem: {id: number}, type: string) {
    if(index === 0) {
        playDialogText.value = '因合作方要求，该资源暂时无法收听，我们正在努力争取歌曲回归';
        playDialog.value = true;
        return;
    }else if(index === 1){
        playDialogText.value = '该歌曲为付费歌曲，请购买后聆听';
        playDialog.value = true;
        return;
    }
    
    if(type === 'play'){
        usePlaySong(songItem);
    }
    useSongAddPlaylist(songItem);
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

// 收藏
function collectMusic() {
    let index = isCopyright(songDetailData.value?.privilege?.[0])

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

// 滚动到评论位置
function jumpToComment() {
    const commentDom = document.querySelector(
        '.song-sheet-review'
    ) as HTMLDivElement;
    window.scrollTo(0, Number(commentDom.offsetTop) - 50);
}

function playCancel(value: boolean) {
    playDialog.value = value;
}

// 歌曲是否有版权
type privilegeItem = {
    dl?: number,
    fee?: number
}
function isCopyright(privilege: privilegeItem): number | undefined {
    
    if (privilege?.[0]?.dl === 0) {
        if(privilege?.[0]?.fee === 0){
            // 无版权
            return 0;
        }else if(privilege?.[0]?.fee === 1){
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
    
    &:after{
        clear: both;
        content: '.';
        display: block;
        height: 0;
        visibility: hidden;
    }
}
</style>