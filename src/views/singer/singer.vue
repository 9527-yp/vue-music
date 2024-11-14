<template>
    <div class="singer-detail">
        <div class="singer-content">
            <div class="singer-header">
                <div class="header-tit">
                    <h2 class="text" title="房东的猫">{{singerInfo?.artist?.name}}</h2>
                    <img class="singer-bag" :src="`${singerInfo?.artist?.cover}?param=640y300`" alt="">
                    <div class="mask"></div>
                    <span class="artist-home">Ta的个人主页</span>
                    <span class="artist-sub">收藏</span>
                </div>
            </div>
            <div class="tags">
                <div class="item active-item">
                    <span class="slt">
                        <em>热门作品</em>
                    </span>
                </div>
                <div class="item">
                    <span class="slt">
                        <em>所有专辑</em>
                    </span>
                </div>
                <div class="item">
                    <span class="slt">
                        <em>相关MV</em>
                    </span>
                </div>
                <div class="item">
                    <span class="slt">
                        <em>艺人介绍</em>
                    </span>
                </div>
            </div>
            <div class="song-tabel-box">
                <div class="tabel-btns">
                    <span class="play-btn icn-bag btn">
                        <i class="play-i icn-bag btn">
                            <em class="play-icn icn-bag"></em>
                            播放
                        </i>
                    </span>
                    <span class="add-btn icn-bag"></span>
                    <span class="col-btn icn-bag">
                        <i class="icn-bag">收藏热门50</i>
                    </span>
                </div>
                <div class="hotsong-list">
                    <SongListTable :playList="playList" :loading="loading" />
                </div>
            </div>
        </div>
        <div class="singer-side">
            <div class="side-cnt">
                <h3 class="header">
                    <span>相似歌手</span>
                </h3>
                <ul class="simi-ul">
                    <li class="item" v-for="(item, index) in simiList.splice(0,6)" :key="index">
                        <div class="hd" :title="item?.name">
                            <img :src="item?.img1v1Url" alt="">
                        </div>
                        <p>
                            <span class="text text-hov thide" :title="item?.name">{{item?.name}}</span>
                        </p>
                    </li>
                </ul>
                <Side />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getSingerDetail, getplayList, getSimi } from '@/api/singer.ts';
import type { ResponseType } from '@/types/index';
import { useRoute } from 'vue-router';
import SongListTable from './song-list-table/SongListTable.vue';
import Side from '@/components/side-info/Side.vue';


const route = useRoute();


// 歌手基本信息
const singerInfo = ref({})
function getSingerInfo() {
    getSingerDetail({id: route.query.id}).then((res: ResponseType) => {
        if(res.code === 200) {
            singerInfo.value = res.data ?? {}
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
</style>