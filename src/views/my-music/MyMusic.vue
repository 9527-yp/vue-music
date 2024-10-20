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
                                <div>

                                </div>
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
console.log(userStore.getToken, 'music')


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