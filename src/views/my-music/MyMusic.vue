<template>
    <div class="my-music">
        <div class="music-isLogin" v-if="!isLogin">
            <div class="not-login">
                <div class="pic">
                    <h2>登录网易云音乐</h2>
                    <div class="btn" @click="login">立即登录</div>
                </div>
            </div>
        </div>
        <div class="music-container">
            <div class="music-content">
                <div class="musicsd">
                    <div>
                        <h2 class="my-Singer">我的歌手(1)</h2>
                        <div class="n-minelst">
                            <h2>
                                <div class="add-song-list">
                                    <span class="text">新建</span>
                                </div>
                                <span class="rtitle">
                                    <span class="tri" :class="foundSongListShow ? 'tri1' : 'tri1-hide'" @click="foundSongListChange"></span>
                                    创建的歌单
                                    <span>(11)</span>
                                </span>
                            </h2>
                            <ul class="list-ul" v-show="foundSongListShow">
                                <li class="item">
                                    <div class="item-content">
                                        <div class="item-img-box">
                                            <img src="" alt="">
                                        </div>
                                        <p class="item-name">我喜欢的音乐</p>
                                        <p class="item-num">28首</p>
                                    </div>
                                </li>
                                <li class="item">
                                    <div class="item-content">
                                        <div class="item-img-box">
                                            <img src="" alt="">
                                        </div>
                                        <p class="item-name">2023</p>
                                        <p class="item-num">28首</p>
                                    </div>
                                </li>
                                <li class="item">
                                    <div class="item-content">
                                        <div class="item-img-box">
                                            <img src="" alt="">
                                        </div>
                                        <p class="item-name">2022</p>
                                        <p class="item-num">28首</p>
                                    </div>
                                </li>
                                <li class="item">
                                    <div class="item-content">
                                        <div class="item-img-box">
                                            <img src="" alt="">
                                        </div>
                                        <p class="item-name">T信念y的2019年度歌单</p>
                                        <p class="item-num">28首</p>
                                    </div>
                                    <span class="oper">
                                        <i class="icn edit-icn"></i>
                                        <i class="icn delete-icn"></i>
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div class="n-minelst">
                            <h2>
                                <span class="rtitle">
                                    <span class="tri" :class="collectSongListShow ? 'tri1' : 'tri1-hide'" @click="collectSongListChange"></span>
                                    收藏的歌单
                                    <span>(11)</span>
                                </span>
                            </h2>
                            <ul class="list-ul" v-show="collectSongListShow">
                                <li class="item">
                                    <div class="item-content">
                                        <div class="item-img-box">
                                            <img src="" alt="">
                                        </div>
                                        <p class="item-name">我喜欢的音乐</p>
                                        <p class="item-num">28首</p>
                                    </div>
                                </li>
                                <li class="item">
                                    <div class="item-content">
                                        <div class="item-img-box">
                                            <img src="" alt="">
                                        </div>
                                        <p class="item-name">2023</p>
                                        <p class="item-num">28首</p>
                                    </div>
                                </li>
                                <li class="item">
                                    <div class="item-content">
                                        <div class="item-img-box">
                                            <img src="" alt="">
                                        </div>
                                        <p class="item-name">2022</p>
                                        <p class="item-num">28首</p>
                                    </div>
                                </li>
                                <li class="item">
                                    <div class="item-content">
                                        <div class="item-img-box">
                                            <img src="" alt="">
                                        </div>
                                        <p class="item-name">T信念y的2019年度歌单</p>
                                        <p class="item-num">28首</p>
                                    </div>
                                    <span class="oper">
                                        <i class="icn delete-icn"></i>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="my-music-main">
                    <div class="song-header">
                        <div class="song-shere-info">
                            <div class="user-cover">
                                <img src="" alt="">
                                <span class="cover-msk"></span>
                            </div>
                            <div class="user-info-right">
                                <div class="song-name">
                                    <i class="song-icn"></i>
                                    <h2>我喜欢的音乐</h2>
                                </div>
                                <div class="user-info">
                                    <img class="user-img" src="" alt="">
                                    <span class="user-name thide text-hov">T信念y</span>
                                    <span class="create-time">2018-01-06 创建</span>
                                </div>
                                <div class="btns">
                                    <span class="play btns-bag" title="播放">
                                        <i class="i-box btns-bag">
                                            <i class="play-icn btns-bag"></i>
                                            播放
                                        </i>
                                    </span>
                                    <span class="add btns-bag" title="添加到播放列表"></span>
                                    <span class="collect btns-bag btn-jointly">
                                        <i class="collect-icn icn btns-bag">收藏</i>
                                    </span>
                                    <span class="share btns-bag btn-jointly">
                                        <i class="share-icn icn btns-bag">分享</i>
                                    </span>
                                    <span class="down btns-bag btn-jointly">
                                        <i class="down-icn icn btns-bag">下载</i>
                                    </span>
                                    <span class="review btns-bag btn-jointly">
                                        <i class="review-icn icn btns-bag">评论</i>
                                    </span>
                                </div>
                                <div class="tag-box">
                                    <span class="tag-label">标签：</span>
                                    <div class="tag-item">
                                        <i class="text">华语</i>
                                    </div>
                                </div>
                                <div class="introduce">
                                    <span class="label">介绍：上课的话</span>
                                </div>
                            </div>
                        </div>
                        <div class="song-list-box">
                            <h3 class="title">歌曲列表</h3>
                            <span class="song-num">134首歌</span>
                            <div class="more">
                                播放：<i class="num">4353535</i>次
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed }from 'vue';
import useUserStore from '@/stores/modules/user.ts'

const userStore = useUserStore();
const isLogin = computed(() => userStore.getIsLogin)


// 创建的歌单
const foundSongListShow = ref<boolean>(true);
function foundSongListChange() {
    foundSongListShow.value = !foundSongListShow.value
}

// 收藏的歌单
const collectSongListShow = ref<boolean>(true);
function collectSongListChange() {
    collectSongListShow.value = !collectSongListShow.value
}
// 登录
function login():void {
  userStore.setLoginDialogShow(true)
}
</script>

<style lang="scss" scoped>
.my-music{
    width: 100%;
    height: 100%;
    .music-isLogin{
        width: 980px;
        min-height: 700px;
        margin: 0 auto;
        background-color: #fff;
        border: 1px solid #d3d3d3;
        border-width: 0 1px;
    }
}
.not-login{
    width: 807px;
    height: 268px;
    margin: 0 auto 0;
    padding-top: 104px;
    background: url('@/assets/images/my-music/mymusic.png') no-repeat 0 9999px;
    background-position: 0 104px;
    .pic{
        h2{
            height: 100px;
            text-indent: -9999px;
        }
        .btn{
            width: 167px;
            height: 45px;
            margin: 102px 0 0 482px;
            background: url('@/assets/images/my-music/mymusic.png') no-repeat 0 9999px;
            background-position: 0 9999px;
            text-indent: -9999px;
            cursor: pointer;
        }
    }
}
.music-container{
    overflow-x: hidden;
    overflow-y: scroll;
    position: relative;
    zoom: 1;
    height: calc(100vh - 95px);
    .music-content{
        min-height: calc(100vh - 95px);
        width: 980px;
        margin: 0 auto;
        border: 1px solid #d3d3d3;
        border-width: 0 1px;
        background: url('@/assets/images/my-music/wrap3.png') repeat-y center 0;
        .musicsd{
            height: calc(100vh - 95px);
            float: left;
            position: fixed;
            box-sizing: border-box;
            overflow-y: auto;
            overflow-x: hidden;
            padding-bottom: 50px;
            padding-top: 40px;
            width: 240px;
            zoom: 1;
            .my-Singer{
                position: relative;
                height: 36px;
                line-height: 36px;
                padding: 0 5px 2px 35px;
                color: #000;
                font-size: 14px;
                cursor: pointer;
                font-family: simsun, \5b8b\4f53;
            }
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
                }
            }
        }
        .my-music-main{
            height: 100%;
            float: right;
            width: 740px;
            padding-bottom: 50px;
            position: relative;
            zoom: 1;
            .song-header{
                .song-shere-info{
                    padding: 40px;
                    display: flex;
                    .user-cover{
                        position: relative;
                        width: 200px;
                        height: 200px;
                        min-width: 200px;
                        img{
                            width: 100%;
                            height: 100%;
                        }
                        .cover-msk{
                            position: absolute;
                            top: -4px;
                            left: -4px;
                            width: 208px;
                            height: 208px;
                            background: url('@/assets/images/home/name-D5CGUEo8.png') no-repeat;
                            background-position: 0 -1285px;
                        }
                    }
                    .user-info-right{
                        width: 100%;
                        height: 147px;
                        margin-left: 30px;
                        .song-name{
                            margin: 0 0 12px;
                            vertical-align: top;
                            .song-icn{
                                display: inline-block;
                                vertical-align: top;
                                width: 54px;
                                height: 24px;
                                margin-right: 6px;
                                background: url('@/assets/images/icon.png') no-repeat;
                                background-position: 0 -243px;
                            }
                            h2{
                                display: inline-block;
                                vertical-align: top;
                                font-size: 20px;
                                font-weight: normal;
                                line-height: 24px;
                                font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                word-wrap: normal;
                            }
                        }
                        .user-info{
                            width: 100%;
                            height: 35px;
                            margin: 0 0 20px;
                            display: flex;
                            align-items: center;
                            .user-img{
                                width: 35px;
                                height: 35px;
                                margin-right: 10px;
                                cursor: pointer;
                            }
                            .user-name{
                                max-width: 210px;
                                margin-right: 15px;
                                cursor: pointer;
                                color: #0c73c2;
                            }
                            .create-time{
                                color: #999;
                            }
                        }
                        .btns{
                            width: 100%;
                            height: 31px;
                            margin-bottom: 25px;
                            display: flex;
                            align-items: center;
                            .btns-bag{
                                background: url('@/assets/images/login/button-bag.png') no-repeat;
                            }
                            .play{
                                padding: 0 5px 0 0;
                                line-height: 29px;
                                white-space: nowrap;
                                overflow: hidden;
                                text-align: center;
                                cursor: pointer;
                                color: #fff;
                                background-position: right -428px;
                                .i-box{
                                    display: inline-block;
                                    height: 31px;
                                    line-height: 29px;
                                    padding: 0 7px 0 8px;
                                    background-position: 0 -387px;
                                    .play-icn{
                                        display: inline-block;
                                        vertical-align: top;
                                        width: 20px;
                                        height: 18px;
                                        margin: 6px 2px 2px 0;
                                        background-position: 0 -1622px;
                                        overflow: hidden;
                                    }
                                }
                                &:hover{
                                    color: #fff;
                                    background-position: right -510px;
                                    .i-box{
                                        background-position: 0 -469px;
                                    }
                                    .play-icn{
                                        background-position: -28px -1622px;
                                    }
                                }
                            }
                            .add{
                                margin-right: 5px;
                                font-family: simsun, \5b8b\4f53;
                                width: 31px;
                                margin-left: -3px;
                                height: 31px;
                                line-height: 30px;
                                min-width: 23px;
                                cursor: pointer;
                                background-position: 0 -1588px;
                                &:hover{
                                    background-position: -40px -1588px;
                                }
                            }
                            .btn-jointly{
                                margin-right: 6px;
                                font-family: simsun, \5b8b\4f53;
                                color: #333;
                                padding: 0 5px 0 0;
                                white-space: nowrap;
                                cursor: pointer;
                                .icn{
                                    display: inline-block;
                                    height: 31px;
                                    line-height: 30px;
                                    min-width: 23px;
                                    padding-right: 2px;
                                    padding-left: 28px;
                                }
                            }
                            .collect{
                                background-position: right -1192px;
                                .collect-icn{
                                    color: #bebebe;
                                    background-position: 0 -1149px;
                                    cursor: default;
                                }
                            }
                            .share{
                                background-position: right -1020px;
                                .share-icn{
                                    background-position: 0 -1225px;
                                }
                                &:hover{
                                    background-position: right -1106px;
                                    .share-icn{
                                        background-position: 0 -1268px;
                                    }
                                }
                            }
                            .down{
                                background-position: right -1020px;
                                .down-icn{
                                    background-position: 0 -2761px;
                                }
                                &:hover{
                                    background-position: right -1106px;
                                    .down-icn{
                                        background-position: 0 -2805px;
                                    }
                                }
                            }
                            .review{
                                background-position: right -1020px;
                                .review-icn{
                                    background-position: 0 -1465px;
                                }
                                &:hover{
                                    background-position: right -1106px;
                                    .review-icn{
                                        background-position: 0 -1508px;
                                    }
                                }
                            }
                        }
                        .tag-box{
                            margin-bottom: 5px;
                            display: flex;
                            align-items: center;
                            .tag-label{
                                color: #666;
                            }
                            .tag-item{
                                padding: 0 10px 0 0;
                                height: 22px;
                                line-height: 22px;
                                text-shadow: 0 1px #fdfdfd;
                                background: url('@/assets/images/login/button-bag.png') no-repeat;
                                background-position: right -27px;
                                color: #777;
                                text-decoration: none;
                                cursor: pointer;
                                .text{
                                    display: inline-block;
                                    padding: 0 3px 0 13px;
                                    background: url('@/assets/images/login/button-bag.png') no-repeat;
                                    background-position: 0 0;
                                    height: 22px;
                                    line-height: 22px;
                                }
                                &:hover{
                                    background-position: right -1430px;
                                    .text{
                                        background-position: 0 -1400px;
                                    }
                                }
                            }
                        }
                        .introduce{
                            margin-top: 4px;
                            line-height: 18px;
                            color: #666;
                        }
                    }
                }
                .song-list-box{
                    width: 100%;
                    height: 35px;
                    border-bottom: 2px solid #c20c0c;
                    box-sizing: border-box;
                    padding: 0 10px 0 32px;
                    .title{
                        font-size: 20px;
                        line-height: 28px;
                        float: left;
                        font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
                        font-weight: normal;
                    }
                    .song-num{
                        margin: 9px 0 0 20px;
                        float: left;
                        color: #666;
                    }
                    .more{
                        margin-top: 5px;
                        float: right;
                        color: #666;
                        .num{
                            color: #c20c0c;
                        }
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
}
.musicsd::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 10px;
    -webkit-box-shadow: inset 1px 1px 0 rgba(0, 0, 0, .1);
}
.musicsd::-webkit-scrollbar-track {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
}
.musicsd::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}
</style>