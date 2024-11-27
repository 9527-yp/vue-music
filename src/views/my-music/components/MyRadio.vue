<template>
    <div class="my-singer-main">
        <div class="singer-content">
            <div class="singer-header">
                <h3>
                    <span class="singer-title">我订阅的电台（{{ djRadioList?.length }}）</span>
                </h3>
            </div>
            <div class="singer-list">
                <div class="item" v-for="item in djRadioList" :key="item.id">
                    <div class="singer-img" @click="toRadio(item?.id)">
                        <img :src="`${item?.picUrl}?param=177y177`" alt="">
                    </div>
                    <div class="item-right">
                        <h3 class="radio-tit thide">
                            <span class="text-hov tit" @click="toRadio(item?.id)">{{item?.name}}</span>
                        </h3>
                        <p class="radio-name">
                            by &nbsp;
                            <span class="text-hov" @click="toUserHome(item?.dj?.userId)">{{item?.dj?.nickname}}</span>
                        </p>
                        <div class="opt">
                            <span class="shear-icn icn" title="分享" @click="notFeatureTip"></span>
                            <span class="del-icn icn" title="删除" @click="delSubDj(item.id)"></span>
                        </div>
                    </div>
                    <div class="item-last">{{item?.programCount}}期</div>
                </div>
            </div>
        </div>
    </div>
    <!-- 订阅弹框 -->
    <Dialog 
      :visible="subDialog"
      showConfirmButton
      showCancelButton
      @cancel='subCancel'
      @confirm="subConfirm"
    >
        <p class="content-text">确定删除订阅的电台？</p>
    </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Dialog from '@/components/dialog/dialog.vue';
import { subDj } from '@/api/djDetail.ts';
import type { ResponseType } from '@/types/index';

const router = useRouter();
const emit = defineEmits(['notFeatureTip']);
const props = defineProps({
    djRadioList: {
        type: Array,
        default: () => []
    }
})

function toRadio(id: number) {
    router.push({
        path: '/radio-detail',
        query: {
            id
        }
    })
}

function toUserHome(id: number) {
    router.push({
        path: '/user/home',
        query: {
            id
        }
    })
}

function notFeatureTip() {
    emit('notFeatureTip', {type: 0, text: '功能暂未开发'})
}

const subDialog = ref(false);
const radioId = ref(undefined);
function delSubDj(id: number) {
    subDialog.value = true;
    radioId.value = id;
}

function subConfirm() {
    subDj({rid: radioId.value, t: 0}).then((res: ResponseType) => {
        if(res.code === 200) {
            subCancel()
            emit('notFeatureTip', {type: 1, text: '删除成功'})
        }
    })
}

function subCancel() {
    subDialog.value = false;
}
</script>

<style lang="scss" scoped>
.my-singer-main{
    height: 100%;
    float: right;
    width: 740px;
    padding-bottom: 50px;
    position: relative;
    zoom: 1;
    .singer-content{
        padding: 40px;
        .singer-header{
            height: 40px;
            border-bottom: 2px solid #c20c0c;
            h3{
                font-size: 24px;
                font-weight: normal;
            }
            .singer-title{
                font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
            }
        }
        .singer-list{
            margin-bottom: 24px;
            .item{
                padding: 10px 0;
                border-bottom: 1px solid #ddd;
                height: 50px;
                line-height: 50px;
                .singer-img{
                    float: left;
                    width: 50px;
                    height: 50px;
                    cursor: pointer;
                    img{
                        width: 50px;
                        height: 50px;
                    }
                }
                .item-right{
                    width: 488px;
                    padding-right: 57px;
                    line-height: 24px;
                    float: left;
                    margin-left: 10px;
                    position: relative;
                    .radio-tit{
                        font-weight: normal;
                        font-size: 14px;
                        .tit{
                            color: #333;
                            &:hover{
                                color: #000;
                            }
                        }
                    }
                    .radio-name{
                        color: #999;
                    }
                    .opt{
                        position: absolute;
                        top: 50%;
                        right: 0;
                        margin-top: -6px;
                        display: none;
                        .icn{
                            float: right;
                            margin-right: 10px;
                            cursor: pointer;
                            width: 16px;
                            height: 14px;
                            overflow: hidden;
                            vertical-align: middle;
                            background: url('@/assets/images/icon2.png') no-repeat;
                        }
                        .shear-icn{
                            background-position: -90px 0;
                            &:hover{
                                background-position: -90px -20px;
                            }
                        }
                        .del-icn{
                            background-position: -130px 0;
                            &:hover{
                                background-position: -130px -20px;
                            }
                        }
                    }
                }
                .item-last{
                    max-width: 40px;
                    overflow: visible;
                    white-space: nowrap;
                    float: left;
                    margin-left: 10px;
                    color: #999;
                }
                &:hover{
                    .opt{
                        display: block;
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