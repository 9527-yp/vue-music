<template>
    <div class="song">
        <div class="music-box">
            <div class="song-info">
                <SongInfo :songDetailData="songDetailData" :list="lyric.list" :id="id" />
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
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { getLyric, getDetail, getComment } from '@/api/song.ts';
import { useRoute, useRouter } from 'vue-router';
import type { ResponseType } from '@/types/index';
import SongInfo from './song-info/SongInfo.vue';
import Comment from '@/components/comment/Comment.vue';
import Page from '@/components/page/Page.vue';
import { handleCommentList } from '@/components/comment/handleCommentList.ts';

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
    id: route.query.id,
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
    getLyric({id:route.query.id}).then((res: ResponseType) => {
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