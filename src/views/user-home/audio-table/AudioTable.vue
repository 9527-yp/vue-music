<template>
    <div v-if="audioList?.list?.length > 0">
        <div class="ranking-title">
            <h3 class="title song-list">{{audioList?.title}}</h3>
        </div>
        <ul class="table-box">
            <li class="item" :class="{'even' : index % 2 !== 0}" v-for="(item, index) in audioList?.list" :key="index">
                <div class="u-cover" @click="toAudio(item?.id)">
                    <img :src="`${item?.intervenePicUrl}?param=50y50`" alt="">
                </div>
                <div class="audio-cnt thide">
                    <span class="audio-name text-hov" @click="toAudio(item?.id)">{{item?.name}}</span>
                    <div class="opt">
                        <span class="share-icn" title="分享" @click="notFeatureTip"></span>
                    </div>
                </div>
                <div class="sub">订阅{{item?.subCount}}次</div>
                <div class="num">{{item?.programCount}}期</div>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import useDialogStore from '@/stores/modules/dialog.ts';

const router = useRouter();
const dialogStore = useDialogStore();

defineProps({
    audioList: {
        type: Object,
        default: {}
    }
})

let timer = null;
function notFeatureTip() {
        dialogStore.setMessage({
            type: 0,
            text: '功能暂未开发',
            visible: true,
        })
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            dialogStore.setMessage({
                type: 0,
                text: '功能暂未开发',
                visible: false,
            })
        }, 1500);
    }

function toAudio(id: number) {
    router.push({
        path: '/radio-detail',
        query: {
            id
        }
    })
}
</script>

<style lang="scss" scoped>
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
.table-box{
    margin-bottom: 24px;
    border: 1px solid #e5e5e5;
    border-top: none;
    .item{
        height: 50px;
        padding: 10px 0;
        line-height: 50px;
        width: 100%;
        background: #fff;
        .u-cover{
            margin-left: 20px;
            float: left;
            width: 50px;
            height: 50px;
            cursor: pointer;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .audio-cnt{
            width: 500px;
            padding-right: 38px;
            float: left;
            margin-left: 10px;
            position: relative;
            .audio-name{
                color: #333;
                &:hover{
                    color: #000;
                }
            }
            .opt{
                display: none;
                position: absolute;
                top: 50%;
                right: 0;
                margin-top: -6px;
                .share-icn{
                    float: right;
                    margin-right: 10px;
                    width: 16px;
                    height: 14px;
                    background: url('@/assets/images/icon2.png') no-repeat;
                    background-position: -90px 0;
                    cursor: pointer;
                    &:hover{
                        background-position: -90px -20px;
                    }
                }
            }
        }
        .sub{
            width: 216px;
            float: left;
            margin-left: 10px;
            color: #666;
        }
        .num{
            width: 44px;
            float: left;
            margin-left: 10px;
            color: #666;
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
    .even{
        background: #f7f7f7;
    }
}
</style>