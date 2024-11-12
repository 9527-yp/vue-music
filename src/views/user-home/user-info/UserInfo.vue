<template>
    <div class="user-info">
        <div class="user-cov">
            <img :src="userInfoData?.avatarUrl" alt="">
        </div>
        <div class="user-d">
            <div class="name">
                <div class="user-header">
                    <div class="user-header-left">
                        <h2 class="name-warp">
                            <span class="title thide">{{ userInfoData.nickname }}</span>
                            <span class="lev u-lev-icn">{{ level }}
                                <i class="right u-lev-icn"></i>
                            </span>
                            <i class="gender-icn" :class="userInfoData?.gender === 1 ? 'boy' : 'girl'"></i>
                        </h2>
                        <div class="contact-head" v-show="userInfoData?.userId !== userInfo?.profile?.userId">
                            <div class="btn send-letter" @click="notFeatureTip">
                                <i class="icn">发私信</i>
                            </div>
                            <div class="btn Followed" v-show="userInfoData.followed && userInfoData.mutual === false" @click="notFeatureTip">
                                <i class="icn has">已关注</i>
                                <i class="icn clear">取消关注</i>
                            </div>
                            <div class="btn another-Followed" v-show="userInfoData.followed && userInfoData.mutual" @click="notFeatureTip">
                                <i class="icn has">相互关注</i>
                                <i class="icn clear">取消关注</i>
                            </div>
                            <div class="btn follow" v-show="!userInfoData.followed" @click="follow(userInfoData?.userId)">关注</div>
                        </div>
                    </div>
                    <div class="edit" v-show="userInfoData?.userId === userInfo?.profile?.userId">
                        <div class="edit-box edit-btn edit-bag" @click="notFeatureTip">
                            <i class="edit-btn edit-bag">编辑个人资料</i>
                        </div>
                    </div>
                </div>
                <div v-if="userInfoData?.allAuthTypes">
                    <div class="authentication" v-for="(item, index) in userInfoData?.allAuthTypes" :key="index">
                        <i v-if="item.type === 10" class="auth-icn icn"></i>
                        <i v-if="item.type === 4" class="auth4-icn icn"></i>
                        <i v-if="item.type === 200 && item.desc.length > 0" class="auth200-icn icn"></i>
                        <span v-if="item.type === 200">{{item.desc.join('、')}}</span>
                        <span v-else>
                            {{item.desc}}
                            <span class="yyrtag" v-for="i in item.tags" :key="i">{{i}}</span>
                        </span>
                    </div>
                </div>
            </div>
            <ul class="info-ul">
                <li class="item" :class="{'item-fst' : index === 0}" v-for="(item, index) in tagList" :key="item.title">
                    <span class="item-cnt" @click="goUserSocial(item.path)">
                        <strong class="num">{{ item.num }}</strong>
                        <span class="text">{{item.title}}</span>
                    </span>
                </li>
            </ul>
            <div class="info" v-show="userInfoData?.signature">
                个人介绍：{{userInfoData?.signature}}
            </div>
            <div class="info">
                <span>所在地：{{provinceName}}-{{cityName}}</span>
                <span class="sep"> 年龄：{{getAgeFragment(userInfoData.birthday)}}</span>
            </div>
            <div class="info">
                <span class="tit">社交网络：</span>
                <ul class="contact-ul">
                    <li class="item">
                        <i class="u-slg u-slg-gary" title="新浪微博"></i>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getAgeFragment } from '@/utils/utils.ts';
import useUserStore from '@/stores/modules/user.ts';
import useDialogStore from '@/stores/modules/dialog.ts';
import { useRouter, useRoute } from 'vue-router';
import { computed, ref, nextTick, watch, reactive } from 'vue';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const dialogStore = useDialogStore();

const emit = defineEmits(['follow']);
const props = defineProps({
    userInfoData: {
        type: Object,
        default: {}
    },
    level: {
        type: Number,
        default: 0
    },
    provinceName: {
        type: String,
        default: ''
    },
    cityName: {
        type: String,
        default: ''
    }
})
const tagList = ref([])
watch(() => props.userInfoData, () => {
    tagList.value = [
        {
            title: '动态',
            num: props?.userInfoData?.eventCount,
            path: '/user/Social'
        },
        {
            title: '关注',
            num: props?.userInfoData?.follows,
            path: '/user/follows'
        },
        {
            title: '粉丝',
            num: props?.userInfoData?.followeds,
            path: '/user/fans'
        },
    ]
})

// 登录信息
const userInfo = computed(() => userStore.getUserInfo)

function goUserSocial(path: string): undefined {
    if(route.path === path){
        return;
    }
    router.push({
        path: path,
        query: {id: route.query.id}
    })
}

function follow(id: number|string) {
    emit('follow',id)
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
</script>

<style lang="scss" scoped>
.user-info{
    margin-bottom: 43px;
    .user-cov{
        float: left;
        width: 188px;
        margin-right: 40px;
        position: relative;
        zoom: 1;
        img{
            display: block;
            width: 180px;
            height: 180px;
            padding: 3px;
            background: #fff;
            border: 1px solid #d5d5d5;
        }
    }
    .user-d{
        float: left;
        width: 670px;
        .name{
            padding-bottom: 12px;
            margin-bottom: 10px;
            border-bottom: 1px solid #ddd;
            .user-header{
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .user-header-left{
                display: flex;
                align-items: center
            }
            .name-warp{
                padding-bottom: 3px;
                display: flex;
                .title{
                    margin-top: 3px;
                    font-size: 22px;
                    font-weight: normal;
                    line-height: 30px;
                    color: #000;
                }
                .u-lev-icn{
                    display: inline-block;
                    overflow: hidden;
                    vertical-align: middle;
                    background: url('@/assets/images/icon2.png') no-repeat;
                    background-position: -135px -190px;
                }
                .lev{
                    margin: 8px 0 0 10px;
                    height: 19px;
                    overflow: hidden;
                    padding-left: 29px;
                    line-height: 21px;
                    color: #e03a24;
                    font-size: 14px;
                    font-weight: bold;
                    font-style: italic;
                }
                .right{
                    float: right;
                    width: 9px;
                    height: 19px;
                    background-position: -191px -190px;
                }
                .gender-icn{
                    margin: 9px 0 0 8px;
                    width: 20px;
                    height: 20px;
                    background: url('@/assets/images/icon.png') no-repeat;
                }
                .boy{
                    background-position: -41px -57px;
                }
                .girl{
                    background-position: -41px -27px;
                }
                &:after{
                    clear: both;
                    content: '.';
                    display: block;
                    height: 0;
                    visibility: hidden;
                }
            }
            .contact-head{
                display: flex;
                align-items: center;
                height: 35px;
                .btn{
                    margin: 0px 0 0 15px;
                    width: 75px;
                    height: 31px;
                    cursor: pointer;
                    background: url('@/assets/images/my-music/button.png');
                    .icn{
                        display: inline-block;
                        height: 29px;
                        line-height: 29px;
                        padding-left: 30px;
                    }
                }
                .send-letter{
                    background-position: 0 -810px;
                    &:hover{
                        background-position: 0 -845px;
                    }
                }
                .Followed{
                    background-position: 0 -919px;
                    .has{
                        display: inline-block;
                    }
                    .clear{
                        display: none
                    }
                    &:hover{
                        background-position: 0 -760px;
                        text-align: center;
                        .has{
                            display: none;
                        }
                        .clear{
                            padding-left: 0px;
                            display: inline-block;
                        }
                    }
                }
                .another-Followed{
                    width: 81px;
                    background-position: 0 -955px;
                    .has{
                        display: inline-block;
                    }
                    .clear{
                        display: none
                    }
                    &:hover{
                        background-position: -68px -990px;
                        text-align: center;
                        .has{
                            display: none;
                        }
                        .clear{
                            padding-left: 0px;
                            display: inline-block;
                        }
                    }
                }
                .follow{
                    width: 40px;
                    background-position: 0 -720px;
                    color: #fff;
                    padding-left: 30px;
                    line-height: 30px;
                    &:hover{
                        background-position: -80px -720px;
                    }
                }
            }
            .edit{
                margin-top: 4px;
                .edit-btn{
                    color: #333;
                    display: inline-block;
                    height: 31px;
                    line-height: 31px;
                    overflow: hidden;
                    vertical-align: top;
                    text-align: center;
                    cursor: pointer;
                }
                .edit-box{
                    padding: 0 5px 0 0;
                    background: url('@/assets/images/login/button-bag.png') no-repeat;
                    background-position: right -100px;
                    &:hover{
                        background-position: right -182px;
                        i{
                            background-position: 0 -141px;
                        }
                    }
                }
                i{
                    padding: 0 15px 0 20px;
                    pointer-events: none;
                    background: url('@/assets/images/login/button-bag.png') no-repeat;
                    background-position: 0 -59px;
                }
            }
            .authentication{
                margin-top: 8px;
                line-height: 20px;
                color: #666;
                font-size: 14px;
                .icn{
                    margin-right: 6px;
                    float: left;
                    width: 68px;
                    height: 20px;
                    vertical-align: middle;
                    background: url('@/assets/images/icon2.png') no-repeat;
                }
                .auth-icn{
                    background-position: 0 -480px;
                }
                .auth4-icn{
                    background-position: -150px -480px;
                }
                .auth200-icn{
                    background-position: -75px -480px;
                }
                .yyrtag{
                    display: inline-block;
                    height: 16px;
                    margin-left: 5px;
                    padding: 0 2px;
                    vertical-align: middle;
                    color: rgba(0, 0, 0, 0.4);
                    font-size: 12px;
                    line-height: 16px;
                    text-align: center;
                    border: solid 1px rgba(0, 0, 0, 0.3);
                    border-radius: 2px;
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
        .info-ul{
            // height: 41px;
            margin-bottom: 15px;
            color: #666;
            .item{
                float: left;
                padding: 0 40px 0 20px;
                border-left: 1px solid #ddd;
                .item-cnt{
                    display: inline-block;
                    position: relative;
                    zoom: 1;
                    color: #666;
                    .num {
                        display: block;
                        margin-top: -4px;
                        font-size: 24px;
                        font-weight: normal;
                        cursor: pointer;
                    }
                    .text{
                        display: block;
                        text-indent: 2px;
                        cursor: pointer;
                    }
                    &:hover{
                        color: #0c73c2;
                    }
                }
            }
            .item-fst{
                padding-left: 0;
                border-left: none;
            }
            &:after{
                clear: both;
                content: '.';
                display: block;
                height: 0;
                visibility: hidden;
            }
        }
        .info{
            margin-bottom: 5px;
            line-height: 21px;
            color: #666;
            .sep{
                margin-left: 20px;
            }
            .tit{
                float: left;
            }
            .contact-ul{
                margin-left: -8px;
                .item{
                    margin-left: 8px;
                    height: 22px;
                    float: left;
                    .u-slg{
                        width: 20px;
                        height: 20px;
                        display: inline-block;
                        vertical-align: middle;
                        background: url('@/assets/images/icon-logo.png') no-repeat;
                    }
                    .u-slg-gary{
                        background-position: 0 -25px;
                    }
                }
            }
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
</style>