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
                <h3 class="title">关注（{{followList.length}}）</h3>
            </div>
            <div class="follows-box">
                <ul class="follows-ul">
                    <li class="item" :class="{'old': index % 2 !== 0}" v-for="(item, index) in followList" :key="index">
                        <div class="user-cover" :title="item.nickname">
                            <img class="img" :src="item.avatarUrl" alt="">
                        </div>
                        <div class="info">
                            <p>
                                <span class="name thide" :title="item.nickname">{{item.nickname}}</span>
                                <i class="gender-icn" :class="item?.gender === 1 ? 'boy' : 'girl'"></i>
                            </p>
                            <p>
                                <span class="text text-hov">
                                    动态
                                    <i class="num">{{item.eventCount}}</i>
                                </span>
                                <span class="line">|</span>
                                <span class="text text-hov">
                                    关注
                                    <i class="num">{{item.follows}}</i>
                                </span>
                                <span class="line">|</span>
                                <span class="text text-hov">
                                    粉丝
                                    <i class="num">{{item.followeds}}</i>
                                </span>
                            </p>
                            <p class="thide dec">{{item.signature}}</p>
                        </div>
                        <div class="oper">
                            <div class="send-btn" v-show="item.followed">
                                <i>发私信</i>
                            </div>
                            <p v-show="item.followed && !item.mutual">
                                <i class="icn follow-icn"></i>
                                已关注
                            </p>
                            <p v-show="item.mutual">
                                <i class="icn another-icn"></i>
                                相互关注
                            </p>
                            <div class="add-follow" v-show="!item.followed">关注</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { userInfo } from '@/api/login.ts';
import type { ResponseType } from '@/types/index';
import findCityZipCode from '@/views/user-home/city.ts';
import { useRoute } from 'vue-router';
import UserInfo from '@/views/user-home/user-info/UserInfo.vue';
import { getFollows } from '@/api/user-social.ts';

const route = useRoute();

const userInfoData = ref({});
const level = ref<number>(0); // 等级
const provinceName = ref<string>(''); // 省
const cityName = ref<string>(''); // 市
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

// 关注
const followList = ref([]);
function follows() {
    getFollows({
        uid: route?.query?.id,
        limit: 30,
        lasttime: 0
    }).then((res: ResponseType) => {
        if(res.code === 200) {
            followList.value = res.follow ?? []
        }
    })
}
follows();

</script>
<style lang="scss" scoped>
.user-home{
    width: 980px;
    min-height: 700px;
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
.follows-box{
    .follows-ul{
        border-left: 1px solid #d5d5d5;
        .item{
            border-bottom: 1px solid #d5d5d5;
            float: left;
            width: 409px;
            height: 80px;
            padding: 20px 20px 0 20px;
            border-right: 1px solid #d5d5d5;
            .user-cover{
                float: left;
                width: 60px;
                height: 60px;
                cursor: pointer;
                .img{
                    width: 60px;
                    height: 60px;
                }
            }
            .info{
                float: left;
                width: 255px;
                margin-left: 10px;
                p{
                    margin-bottom: 6px;
                }
                .name{
                    display: inline-block;
                    max-width: 235px;
                    vertical-align: middle;
                    color: #0c73c2;
                    font-size: 14px;
                    cursor: pointer;
                }
                .gender-icn{
                    display: inline-block;
                    vertical-align: middle;
                    margin: 1px 0 0 2px;
                    margin-top: -2px;
                    width: 14px;
                    height: 15px;
                    overflow: hidden;
                    background: url('@/assets/images/icon.png') no-repeat;
                }
                .boy{
                    background-position: -70px -20px;
                }
                .girl{
                    background-position: -70px 0;
                }
                .text{
                    color: #333;
                    .num{
                        color: #0c73c2;
                    }
                }
                .line{
                    margin: 0 8px;
                    color: #999;
                }
                .dec{
                    color: #666;
                }
            }
            .oper{
                float: right;
                width: 75px;
                padding-top: 5px;
                .send-btn{
                    width: 75px;
                    height: 31px;
                    cursor: pointer;
                    color: #333;
                    background: url('@/assets/images/my-music/button.png') no-repeat;
                    background-position: 0 -810px;
                    i{
                        display: inline-block;
                        height: 29px;
                        line-height: 29px;
                        padding-left: 30px;
                    }
                    &:hover{
                        background-position: 0 -845px;
                    }
                }
                p{
                    margin-top: 5px;
                    text-align: center;
                    color: #999;
                    .icn{
                        display: inline-block;
                        overflow: hidden;
                        vertical-align: middle;
                        background: url('@/assets/images/icon.png') no-repeat;
                    }
                    .follow-icn{
                        width: 13px;
                        height: 10px;
                        background-position: -60px -470px;
                    }
                    .another-icn{
                        width: 14px;
                        height: 11px;
                        background-position: -60px -455px;
                    }
                }
                .add-follow{
                    width: 40px;
                    height: 31px;
                    padding-left: 30px;
                    background: url('@/assets/images/my-music/button.png') no-repeat;
                    background-position: 0 -720px;
                    cursor: pointer;
                    color: #fff;
                    line-height: 30px;
                    &:hover{
                        background-position: -80px -720px;
                    }
                }
            }
        }
        .old{
            width: 408px;
        }
    }
}
</style>