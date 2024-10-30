<template>
    <div class="dialog" v-if="visible">
        <div class="dialog-mask"></div>
        <div class="dialog-box" v-drag>
            <div class="dialog-title">{{ title }} <span class="dialog-close"  @click="cancel">x</span></div>
            <div class="dialog-content">
                <div class="content">
                    <slot name="content"></slot>
                    <div class="content-btn" v-if="showConfirmButton || showCancelButton">
                        <div class="ok-btn btn" @click="confirm">
                            <i>{{ confirmtext }}</i>
                        </div>
                        <div class="Cancel-btn btn" @click="cancel">
                            <i>{{ canceltext }}</i>
                        </div>
                    </div>
                    <div class="content-btn customText"  v-if="showCustomButton">
                        <div class="ok-btn btn" @click="cancel">
                            <i>{{ customText }}</i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">

import { drag } from '@/utils/drag.ts';

defineOptions({
  directives: {
    drag
  }
});

defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: '提示'
    },
    confirmtext: {
        type: String,
        default: '确定'
    },
    canceltext: {
        type: String,
        default: '取消'
    },
    customText: {
        type: String,
        default: '我知道了'
    },
    showConfirmButton: {
        type: Boolean,
        default: false
    },
    showCancelButton: {
        type: Boolean,
        default: false
    },
    showCustomButton: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['confirm', 'cancel']);

// 确认
function confirm() {
    emit('confirm');
}

// 取消
function cancel() {
    emit('cancel');
}
</script>
<style lang="scss" scoped>
.dialog{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 20001009;
    .dialog-mask{
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: transparent;
        opacity: .5;
    }
}
.dialog-box{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 480px;
    // height: 200px;
    max-width: 100%;
    overflow: hidden;
    background-color: #fff;
    border: none;
    border-radius: 4px;
    transform: translate(-50%, -50%);
    box-shadow: 0 5px 16px #000c;
    .dialog-title{
        position: relative;
        top: 0px;
        left: 0px;
        height: 38px;
        font-family: 微软雅黑, sans-serif;
        font-size: 14px;
        font-weight: 700;
        line-height: 40px;
        color: rgb(255, 255, 255);
        text-overflow: ellipsis;
        word-break: keep-all;
        cursor: all-scroll;
        background-color: rgb(45, 45, 45);
        user-select: none;
        padding: 0px 31px 0px 18px;
        overflow: hidden;
        white-space: nowrap;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(25, 25, 25);
        border-image: initial;
    }
    .dialog-close{
        position: absolute;
        top: 16px;
        right: 20px;
        z-index: 20;
        width: 10px;
        height: 10px;
        overflow: hidden;
        text-indent: -9999px;
        cursor: pointer;
        background: url('@/assets/images/dialog.png') no-repeat;
        background-position: 0 -95px;
    }
    .dialog-content{
        padding: 0;
        border: 1px solid rgba(135, 135, 135, 0.6);
        border-width: 0 1px 1px;
        border-radius: 0 0 4px 4px;
        background: #fff;
        .content{
            padding: 40px 0;
            text-align: center;
            .content-btn{
                margin-top: 30px;
                .btn{
                    margin: 0 10px;
                    padding: 0 5px 0 0;
                    white-space: nowrap;
                    display: inline-block;
                    height: 31px;
                    line-height: 31px;
                    overflow: hidden;
                    vertical-align: top;
                    text-align: center;
                    cursor: pointer;
                    background: url('@/assets/images/login/button-bag.png') no-repeat;
                    i{
                        width: 40px;
                        display: inline-block;
                        height: 31px;
                        line-height: 31px;
                        overflow: hidden;
                        vertical-align: top;
                        text-align: center;
                        cursor: pointer;
                        padding: 0 15px 0 20px;
                        pointer-events: none;
                        background: url('@/assets/images/login/button-bag.png') no-repeat;
                    }
                }
                .ok-btn{
                    color: #fff;
                    background-position: right -428px;
                    i{
                        color: #fff;
                        background-position: 0 -387px;
                    }
                    &:hover{
                        background-position: right -510px;
                        i{
                            background-position: 0 -469px;
                        }
                    }
                }
                .Cancel-btn{
                    background-position: right -100px;
                    i{
                        color: #333;
                        background-position: 0 -59px;
                    }
                    &:hover{
                        color: #333;
                        background-position: right -182px;
                        i{
                            background-position: 0 -141px;
                        }
                    }
                }

            }
            .customText{
                text-align: center;
            }
        }
    }
}
.song-dialog{
    .content{
        padding: 0 !important;
    }
}
</style>