<template>
    <div class="vip-card" v-if="!isLogin">
        <img src="@/assets/images/home/side/dis_vip_card.png" alt="">
    </div>
    <div class="user-login" v-if="!isLogin">
        <p class="note">登录网易云音乐，可以享受无限收藏的乐趣，并且无限同步到手机</p>
        <div class="login-btn">用户登录</div>
    </div>
    <!-- 已登录 -->
    <div v-if="isLogin" class="side-user">
        <div class="user-container">
            <div class="user-info">
                <div class="user-avatar">
                    <img class="user-avatar-img" :src="userStore.getUserInfo?.profile?.avatarUrl" alt="">
                </div>
                <div class="info">
                    <h4 class="name">
                        <span class="text text-hov">{{userStore.getUserInfo?.profile?.nickname}}</span>
                        <img class="vip-level" src="@/assets/images/home/side/vip-leavr.png" alt="">
                    </h4>
                    <p class="lv">
                        <i class="lv-icon-left">8</i>
                        <i class="lv-icon-right"></i>
                    </p>
                    <button class="btnwarp disable-btnwarp">
                        <i class="btnwarp-icon">已签到</i>
                    </button>
                </div>
            </div>
            <ul class="list">
                <li class="item first-item">
                    <strong class="num">{{userStore.getUserInfo?.profile?.eventCount}}</strong>
                    <span class="text">动态</span>
                </li>
                <li class="item">
                    <strong class="num">{{userStore.getUserInfo?.profile?.follows}}</strong>
                    <span class="text">关注</span>
                </li>
                <li class="item last-item">
                    <strong class="num">{{userStore.getUserInfo?.profile?.followeds}}</strong>
                    <span class="text">粉丝</span>
                </li>
            </ul>
        </div>
    </div>
    <!-- 入驻歌手 -->
    <Singer />
    <!-- 热门主播 -->
    <div class="n-dj">
        <div class="v-header">
            <div class="header-text">热门主播</div>
        </div>
        <ul class="dj-list">
            <li class="item" v-for="item in anchorList" :key="item?.userId">
                <div class="dj-img">
                    <img :src="item.src" alt="">
                </div>
                <div class="dj-info">
                    <p class="dj-name text-hov">{{item.name}}</p>
                    <p class="dj-description">{{item.desc}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import Singer from '../singer/Singer.vue'
import { ref, computed } from 'vue';
import useUserStore from '@/stores/modules/user.ts'

const userStore = useUserStore();

console.log(userStore.getUserInfo, 'userStore.getUserInfo')

// 是否登录
const isLogin = computed<boolean>(() => userStore.getIsLogin)

type MenuItem = {
    src: string,
    name: string,
    desc: string,
    userId: number,
}
// 热门主播(无接口)
const anchorList = ref<MenuItem[]>([
  {
    src: 'http://p1.music.126.net/H3QxWdf0eUiwmhJvA4vrMQ==/1407374893913311.jpg?param=40y40',
    name: '陈立',
    desc: '心理学家、美食家陈立教授',
    userId: 278438485
  },
  {
    src: 'http://p2.music.126.net/GgXkjCzeH4rqPCsrkBV1kg==/109951164843970584.jpg?param=40y40',
    name: '刘维-Julius',
    desc: '歌手、播客节目《维维道来》主理人',
    userId: 559210341
  },
  {
    src: 'http://p2.music.126.net/C8jFbOTjUOnTKEHX6uuzOg==/109951166239584597.jpg?param=40y40',
    name: '莫非定律MoreFeel',
    desc: '男女双人全创作独立乐团',
    userId: 259292486
  },
  {
    src: 'http://p2.music.126.net/NHjNoFpLDEZ-3OR9h35z1w==/109951165825466770.jpg?param=40y40',
    name: '碎嘴许美达',
    desc: '脱口秀网络红人',
    userId: 1450418799
  },
  {
    src: 'http://p2.music.126.net/CpUdHPNvBvN7kebvL21TTA==/109951163676573083.jpg?param=40y40',
    name: '银临Rachel',
    desc: '古风音乐人',
    userId: 2688170
  }
]);
</script>


<style lang="scss" scoped>
.vip-card{
    margin-top: 5px;
    img{
        width: 100%;
        height: 100%;
        cursor: pointer;
    }
}
.user-login{
    height: 126px;
    background: url('@/assets/images/home/index.png') no-repeat;
    background-position: 0 0;
    .note{
        width: 205px;
        margin: 0 auto;
        padding: 16px 0;
        line-height: 22px;
        color: #666;
    }
    .login-btn{
        width: 100px;
        height: 31px;
        line-height: 31px;
        margin: 0 auto;
        text-align: center;
        color: #fff;
        cursor: pointer;
        text-shadow: 0 1px 0 #8a060b;
        background: url('@/assets/images/home/index.png') no-repeat;
        background-position: 0 -195px;
    }
}
.side-user{
    .user-container{
        height: 165px;
        padding-top: 20px;
        background: url('@/assets/images/home/index.png') no-repeat 0 9999px;
        background-position: 0 -270px;
        .user-info{
            .user-avatar{
                display: inline-block;
                width: 80px;
                height: 80px;
                padding: 2px;
                margin-left: 10px;
                vertical-align: top;
                cursor: pointer;
                background-color: #fff;
                border: 1px solid #dadada;
                .user-avatar-img{
                    display: block;
                    width: 80px;
                    height: 80px;
                }
            }
            .info{
                display: inline-block;
                width: 115px;
                padding-top: 3px;
                margin-left: 18px;
                vertical-align: top;
                .name{
                    overflow: hidden;
                    text-align: left;
                    .text{
                        display: inline-block;
                        max-width: 50%;
                        overflow: hidden;
                        font-size: 14px;
                        color: #333;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        vertical-align: middle;
                        cursor: pointer;
                    }
                    .vip-level{
                        display: inline-block;
                        width: 43px;
                        height: 16px;
                        margin-left: 5px;
                        vertical-align: middle;
                    }
                }
                .lv{
                    margin-top: 5px;
                    text-align: left;
                    cursor: pointer;
                    .lv-icon-left{
                        display: inline-block;
                        height: 17px;
                        padding-left: 25px;
                        overflow: hidden;
                        font-style: italic;
                        font-weight: 700;
                        line-height: 18px;
                        color: #999;
                        background: url('@/assets/images/icon2.png') no-repeat;
                        background-position: -130px -64px;
                    }
                    .lv-icon-right{
                        display: inline-block;
                        width: 8px;
                        height: 17px;
                        background: url('@/assets/images/icon2.png') no-repeat;
                        background-position: -192px -64px;
                    }
                }
                .btnwarp{
                    display: inline-block;
                    height: 31px;
                    padding: 0 5px 0 0;
                    margin-top: 10px;
                    margin-right: 14px;
                    overflow: hidden;
                    line-height: 31px;
                    color: #fff;
                    vertical-align: top;
                    cursor: pointer;
                    border: none;
                    outline: none;
                    background: url('@/assets/images/home/side/button2.png') no-repeat;
                    background-position: right -428px;
                }
                .disable-btnwarp{
                    margin-right: 43px;
                    color: #bebebe;
                    background-position: right -346px;
                    cursor: default;
                }
                .btnwarp-icon{
                    display: inline-block;
                    width: 46px;
                    height: 31px;
                    padding: 0 10px 0 15px;
                    color: #bebebe;
                    background: url('@/assets/images/home/side/button2.png') no-repeat;
                    background-position: 0 -305px;
                    cursor: default;
                    overflow: hidden;
                    line-height: 31px;
                    text-align: center;
                    vertical-align: top;
                }
            }
        }
        .list{
            display: flex;
            justify-content: space-between;
            margin-top: 22px;
            text-align: left;
            .item{
                display: inline-block;
                height: 40px;
                padding: 0 18px;
                border-right: 1px solid #e4e4e4;
                .num{
                    display: block;
                    font-size: 20px;
                    font-weight: 400;
                    color: #666;
                    cursor: pointer;
                }
                .text{
                    margin-left: 2px;
                    color: #666;
                    cursor: pointer;
                }
            }
            .first-item{
                margin-left: 8px;
            }
            .last-item{
                border: none;
            }
        }
    }
}
.n-dj{
    margin-top: 30px;
    .v-header{
        position: relative;
        height: 23px;
        margin: 0 20px;
        border-bottom: 1px solid #ccc;
        color: #333;
        .header-text{
            float: left;
            font-weight: 700;
        }
    }
    .dj-list{
        margin: 20px 0 0 20px;
        .item{
            width: 210px;
            height: 50px;
            display: flex;
            .dj-img{
                width: 40px;
                margin-right: 10px;
                cursor: pointer;
                img{
                    width: 40px;
                    height: 40px;
                    box-shadow: 0 0 1px #333333 inset;
                }
            }
            .dj-info{
                width: 160px;
                line-height: 21px;
                .dj-name{
                    cursor: pointer;
                }
                .dj-description{
                    width: 100%;
                    color: #666;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    word-wrap: normal;
                }
            }
        }
    }
}
</style>