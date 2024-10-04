<template>
    <div class="item-content-box">
        <div class="item-c-h">
            <div class="h-title">新碟上架</div>
            <div class="more">
                <span class="tab-text text-hov">更多</span>
                <i class="move-icn"></i>
            </div>
        </div>
        <div class="n-disk">
            <div class="n-inner">
                <div class="disc-content">
                    <ul class="list" :style="listStyle">
                        <li class="item" v-for="(item, index) in album" :key="index">
                            <div class="item-cover">
                                <img class="item-img" :src="`${item?.picUrl}?param=100y100`" alt="">
                                <div class="mask"></div>
                                <i class="play-icn"></i>
                            </div>
                            <p class="f-thide text-hov" :title="item.name">{{item.name}}</p>
                            <template v-for="(i, ind) in item?.artists" :key="ind">
                                <p class="f-thide tit text-hov" :title="i.name">{{i.name}}</p>
                            </template>
                            
                        </li>
                    </ul>
                </div>
                <button class="btn left-btn" @click="albumPerv"></button>
                <button class="btn right-btn" @click="albumNext"></button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { albumNewest } from '@/api/home.ts'
import { throttle } from 'lodash';
import type { ResponseType } from '@/types/index';

type albumItem = {
    id: number;
    name: string;
    picUrl: string;
    artists: {
        id: number;
        name: string;
    }[];
}

// 列表偏移、样式
const listOffest = reactive({
  index: 0,
  transform: 0,
  duration: 0
});

const listStyle = computed(() => {
    return {
    transform: `translate3d(-${listOffest.transform}px, 0, 0)`,
    transition: `${listOffest.duration}s`
  };
})

// 新碟上架
const album = ref<albumItem[]>([])
function getAlbumNewest() {
    albumNewest().then((res: ResponseType) => {
        if(res.code === 200) {
            const first = res?.albums.slice(0,5)
            const last = res?.albums.slice(5,10)
            // 调换前五条和后五条数据
            album.value = [...last, ...first]
            // 复制二倍数据
            album.value.unshift(...album.value)
        }
    }).catch(error => {

    })
}
getAlbumNewest()

// 上一页
const albumPerv = throttle(
    function () {
        if(listOffest.index == 0) {
            listOffest.index = 2
            listOffest.duration = 0
            setTimeout(() => {
                listOffest.index--
                listOffest.duration = 1.2
                listOffest.transform = 126 * listOffest.index * 5;
            })
        }else{
            listOffest.index--
            listOffest.duration = 1.2
        }
        listOffest.transform = 126 * listOffest.index * 5;
    },
    1200,
    {
        leading: true, // 点击第一下是否执行
        trailing: false // 节流结束后, 是否执行一次
    }
)

// 下一页
const albumNext = throttle(
    function () {
        if(listOffest.index == 2) {
            listOffest.index = 0
            listOffest.duration = 0
            setTimeout(() => {
                listOffest.index++
                listOffest.duration = 1.2
                listOffest.transform = 126 * listOffest.index * 5;
            })
        }else{
            listOffest.index++
            listOffest.duration = 1.2
        }
        listOffest.transform = 126 * listOffest.index * 5;
    },
    1200,
    {
        leading: true, // 点击第一下是否执行
        trailing: false // 节流结束后, 是否执行一次
    }
)
</script>

<style lang="scss" scoped>
.item-content-box{
    .item-c-h{
        height: 33px;
        padding: 0 10px 0 34px;
        background: url('@/assets/images/home/index.png') no-repeat 0 9999px;
        background-position: -225px -156px;
        border-bottom: 2px solid #C10D0C;
        .h-title{
            float: left;
            font-size: 20px;
            font-weight: normal;
            line-height: 28px;
            cursor: pointer;
        }
        .h-tab{
            float: left;
            margin: 7px 0 0 20px;
            .line{
                margin: 0 10px;
                color: #ccc;
            }
        }
        .tab-text{
            color: #666;
            cursor: pointer;
        }
        .more{
            float: right;
            margin-top: 9px;
            .move-icn{
                display: inline-block;
                width: 12px;
                height: 12px;
                margin-left: 4px;
                vertical-align: middle;
                background: url('@/assets/images/home/index.png') no-repeat 0 9999px;
                background-position: 0 -240px;
            }
        }
    }
}
.n-disk{
    zoom: 1;
    height: 186px;
    margin: 20px 0 37px;
    border: 1px solid #d3d3d3;
    .n-inner{
        position: relative;
        width: 654px;
        height: 184px;
        padding-right: 16px;
        padding-left: 16px;
        overflow: hidden;
        background-color: #f5f5f5;
        border: 1px solid #fff;
        .disc-content{
            width: 625px;
            margin-left: 20px;
            overflow: hidden;
            .list{
                width: 1000%;
                // height: 180px;
                margin-top: 28px;
                overflow: hidden;
                text-align: left;
                .item{
                    position: relative;
                    display: inline-block;
                    width: 118px;
                    height: 150px;
                    padding-right: 8px;
                    vertical-align: middle;
                    cursor: pointer;
                    .item-cover{
                        position: relative;
                        width: 100px;
                        height: 100px;
                        margin-bottom: 7px;
                        .item-img{
                            display: block;
                            width: 100%;
                            height: 100%;
                        }
                        .mask{
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 118px;
                            height: 100px;
                            background: url('@/assets/images/home/name-D5CGUEo8.png') no-repeat;
                            background-position: 0 -570px;
                        }
                        .play-icn{
                            display: none;
                            position: absolute;
                            right: 10px;
                            bottom: 5px;
                            left: 72px;
                            width: 22px;
                            height: 22px;
                            background: url('@/assets/images/play/iconall.png') no-repeat;
                            background-position: 0 -85px;
                        }
                    }
                    .f-thide{
                        width: 90%;
                        line-height: 18px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        word-wrap: normal;
                    }
                    &:hover{
                        .play-icn{
                            display: block;
                        }
                    }
                }
            }
        }
        .btn{
            position: absolute;
            top: 71px;
            width: 17px;
            height: 17px;
            cursor: pointer;
            background: url('@/assets/images/home/index.png') no-repeat;
            border: none;
            outline: none;
        }
        .left-btn{
            left: 4px;
            background-position: -260px -75px;
            &:hover{
                background-position: -280px -75px;
            }
        }
        .right-btn{
            right: 4px;
            background-position: -300px -75px;
            &:hover{
                background-position: -320px -75px;
            }
        }
    }
}
</style>