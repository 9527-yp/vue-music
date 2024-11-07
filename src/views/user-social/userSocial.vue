<template>
    <div class="user-home">
        <div class="user-box">
            <UserInfo
              :userInfoData="userInfoData"
              :level="level"
              :provinceName="provinceName"
              :cityName="cityName"
              :isTwoTo="true"
            />
            <div class="ranking-title">
                <h3 class="title song-list">我的动态（{{dynamicList.length}}）</h3>
            </div>
            <div class="social">
                <div class="social-left">
                    <div class="m-timeline">
                        <ul class="timeline-ul">
                            <li class="item" v-for="(item, index) in dynamicList" :key="index">
                                <div class="u-cover">
                                    <img class="u-img" :src="item?.user?.avatarUrl" alt="">
                                </div>
                                <div class="item-r">
                                    <div class="item-header">
                                        <span class="u-name text-hov">{{item?.user?.nickname}}</span>
                                        <span class="title">分享单曲</span>
                                    </div>
                                    <div class="time">
                                        <span class="text-hov">昨天 18:01</span>
                                    </div>
                                    <div class="text"></div>
                                    <div class="item-content">
                                        <div class="cover cover-play">
                                            <span>
                                                <img class="img" src="" alt="">
                                            </span>
                                            <i class="play-icn"></i>
                                        </div>
                                        <div class="scnt">
                                            <h3 class="tit thide">
                                                <span class="text-hov">卜卦·2024</span>
                                            </h3>
                                            <h4 class="singer thide">
                                                <span class="text-hov">刘亦玫</span>
                                            </h4>
                                        </div>
                                    </div>
                                    <div class="doper">
                                        <span class="like text-hov">
                                            <i class="icn like-icn"></i>
                                            <span>(1)</span>
                                        </span>
                                        <span class="line"></span>
                                        <span class="forward text-hov">
                                            转发
                                            <span class="">(1)</span>
                                        </span>
                                        <span class="line"></span>
                                        <span class="forward text-hov">
                                            评论
                                            <span class="">(1)</span>
                                        </span>
                                    </div>
                                    <div class="arrow">
                                        <ul class="mng-ul">
                                            <li class="mng-item">
                                                <i class="del-icn"></i>
                                                删除
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="social-right">
                    <div class="soide">
                        <h4 class="my-follow">我的关注</h4>
                        <ul class="follow-ul">
                            <li class="item">
                                <span title="音乐人赵磊">
                                    <img class="user-img" src="" alt="">
                                </span>
                                <p>
                                    <span class="name thide text-hov">音乐人赵磊</span>
                                    <img class="name-icn" src="@/assets/images/social/name-icn.png" alt="">
                                </p>
                            </li>
                            <li class="item">
                                <span title="音乐人赵磊">
                                    <img class="user-img" src="" alt="">
                                </span>
                                <p>
                                    <span class="name thide text-hov">音乐人赵磊</span>
                                    <img class="name-icn" src="@/assets/images/social/name-icn.png" alt="">
                                </p>
                            </li>
                        </ul>
                        <h4 class="my-follow">我的粉丝</h4>
                        <ul class="follow-ul">
                            <li class="item">
                                <span title="音乐人赵磊">
                                    <img class="user-img" src="" alt="">
                                </span>
                                <p>
                                    <span class="name thide text-hov">音乐人赵磊</span>
                                    <img class="name-icn" src="@/assets/images/social/name-icn.png" alt="">
                                </p>
                            </li>
                            <li class="item">
                                <span title="音乐人赵磊">
                                    <img class="user-img" src="" alt="">
                                </span>
                                <p>
                                    <span class="name thide text-hov">音乐人赵磊</span>
                                    <img class="name-icn" src="@/assets/images/social/name-icn.png" alt="">
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import UserInfo from '@/views/user-home/user-info/UserInfo.vue';
import { userInfo } from '@/api/login.ts';
import { getDynamic } from '@/api/user-social.ts';
import findCityZipCode from '@/views/user-home/city.ts';
import { useRoute } from 'vue-router';
import type { ResponseType } from '@/types/index';

const route = useRoute();


const userInfoData = ref({});
const level = ref(0); // 等级
const provinceName = ref(''); // 省
const cityName = ref(''); // 市
function getUserInfo() {
    userInfo({uid: route?.query?.id}).then((res:ResponseType) => {
        if(res.code === 200) {
            userInfoData.value = res?.profile;
            level.value = res?.level
            if(res?.profile?.province){
                provinceName.value = findCityZipCode(res?.profile?.province);
                cityName.value = findCityZipCode(res?.profile?.city);
            }
        }
    })
}
getUserInfo();

type DynamicItem = {
    type: string | number,
}
const dynamicList = ref<DynamicItem[]>([]);
function Dynamic() {
    getDynamic({
        uid: route?.query?.id,
        limit: 30,
        lasttime: -1
    }).then((res: ResponseType) => {
        if(res.code === 200) {
            dynamicList.value = res?.events ?? []
            dynamicList.value.forEach(item => {
                item.type = statusJudgment(item?.type)
            })
        }
    })
}
Dynamic();

function statusJudgment(type: number | string) {
    let text = '';
    if(type === 18){
        text = '分享单曲'
    }

    return text
}

</script>


<style lang="scss" scoped>
.user-home{
    width: 980px;
    // min-height: 700px;
    margin: 0 auto;
    background-color: #fff;
    border: 1px solid #d3d3d3;
    border-width: 0 1px;
    .user-box{
        padding: 40px;
        .ranking-title{
            position: relative;
            z-index: 2;
            zoom: 1;
            height: 33px;
            border-bottom: 2px solid #c20c0c;
            .title{
                font-size: 20px;
                line-height: 28px;
                font-weight: normal;
                color: #666;
                font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
                float: left;
            }
            .song-list{
                color: #333;
            }
        }
    }
}
.social{
    width: 100%;
    border: none;
    min-height: 700px;
    margin: 0 auto;
    background: url('@/assets/images/social/wrap1.png') repeat-y 100% 100%;
    .social-left{
        padding: 10px 25px 0 0;
        display: inline-block;
        vertical-align: middle;
        .m-timeline{
            position: relative;
            zoom: 1;
            text-shadow: none;
            .item{
                width: 624px;
                position: relative;
                padding: 20px 0;
                border-bottom: 1px solid;
                .u-cover{
                    position: absolute;
                    top: 20px;
                    left: 0;
                    width: 54px;
                    .u-img{
                        width: 45px;
                        height: 45px;
                    }
                }
                .item-r{
                    position: relative;
                    zoom: 1;
                    margin-left: 55px;
                    padding-top: 4px;
                    .item-header{
                        font-size: 14px;
                        position: relative;
                        .u-name{
                            color: #0c73c2;
                        }
                        .title{
                            margin-left: 5px;
                            color: #666;
                        }
                    }
                    .time{
                        margin-top: 7px;
                        color: #999;
                    }
                    .text{
                        margin-top: 10px;
                        line-height: 24px;
                        font-size: 14px;
                        word-wrap: break-word;
                        word-break: break-word;
                        white-space: normal;
                    }
                    .item-content{
                        background: #f5f5f5;
                        display: block;
                        position: relative;
                        padding: 10px;
                        margin: 4px 0 5px;
                        .cover{
                            position: relative;
                            zoom: 1;
                            width: 40px;
                            height: 40px;
                            float: left;
                            .img{
                                width: 40px;
                                height: 40px;
                            }
                            .play-icn{
                                z-index: 200;
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 40px;
                                height: 40px;
                                margin: 0;
                                opacity: 0.8;
                                cursor: pointer;
                                background: url('@/assets/images/social/sprite.png') no-repeat;
                                background-position: -100px -70px;
                            }
                        }
                        .scnt{
                            display: block;
                            position: absolute;
                            top: 10px;
                            left: 60px;
                            right: 30px;
                            height: 40px;
                            line-height: 22px;
                            .tit{
                                font-weight: normal;
                                margin-top: -2px;
                                font-size: 14px;
                            }
                            .singer{
                                font-weight: normal;
                                color: #666;
                                font-size: 100%;
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
                    .doper{
                        margin: 18px 0 -2px;
                        text-align: right;
                        line-height: normal;
                        .like{
                            color: #0c73c2;
                            .icn{
                                display: inline-block;
                                vertical-align: top;
                                margin: 0px 3px 0 0;
                                width: 14px;
                                height: 14px;
                                background: url('@/assets/images/social/sprite.png') no-repeat;
                                background-position: 0 -20px;
                            }
                            .like-icn{
                                background-position: -20px -20px;
                            }
                        }
                        .line{
                            color: #c7c7c7;
                            margin: 0 10px 0 12px;
                        }
                        .forward{
                            color: #0c73c2;
                        }
                    }
                    .arrow{
                        position: absolute;
                        top: -3px;
                        right: -3px;
                        width: 19px;
                        height: 19px;
                        background: url('@/assets/images/social/sprite.png') no-repeat;
                        background-position: -15px 0;
                        cursor: pointer;
                        .mng-ul{
                            width: 105px;
                            position: absolute;
                            top: 23px;
                            right: 3px;
                            background: #fff;
                            border: 1px solid #cccfd9;
                            box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
                            .mng-item{
                                float: left;
                                width: 105px;
                                height: 30px;
                                overflow: hidden;
                                line-height: 31px;
                                color: #666;
                                cursor: pointer;
                                .del-icn{
                                    width: 16px;
                                    height: 16px;
                                    margin: 7px 8px 0 9px;
                                    display: inline-block;
                                    vertical-align: top;
                                    background: url('@/assets/images/social/sprite.png') no-repeat;
                                    background-position: -40px -360px;
                                }
                                &:hover{
                                    background: #f3f3f3;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    .social-right{
        width: 250px;
        display: inline-block;
        vertical-align: top;
        .soide{
            padding: 10px 0 0 25px;
            .my-follow{
                height: 23px;
                border-bottom: 1px solid #ccc;
                color: #333;
            }
            .follow-ul{
                margin: 15px 0 0 -16px;
                .item{
                    float: left;
                    width: 64px;
                    height: 105px;
                    padding-left: 16px;
                    .user-img{
                        width: 64px;
                        height: 64px;
                        cursor: pointer;
                    }
                    p{
                        margin-top: 5px;
                        .name{
                            max-width: 70%;
                            display: inline-block;
                            vertical-align: middle;
                            color: #333;
                        }
                        .name-icn{
                            height: 13px;
                            width: 13px;
                            display: inline-block;
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