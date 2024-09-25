<template>
    <Teleport to="body">
        <div v-if="loginDialog" class="loginDialog">
            <div class="dialog">
                <div class="login-mask"></div>
                <div class="login-box">
                    <div class="login-header">
                        登录
                        <i class="clear-dialog" @click="cancel">×</i>
                    </div>
                    <div class="login-content">
                        <Qrcode v-if="loginType" 
                         :qrcodeImgSrc="qrcodeImgSrc" 
                         :qrcodeLose="qrcodeLose"
                         :qrcodeAwaitVerify="qrcodeAwaitVerify"
                         @refresh="refreshBtn"
                         @updateLoginType="editLoginType"/>
                        <Othercode v-if="!loginType" @updateLoginType="editLoginType" />
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { qrcodeKey, qrcodeImg, qrcodeCheck } from '@/api/login.ts'
import type { ResponseType } from '@/types/index';
import Qrcode from './qr-code/Qrcode.vue'
import Othercode from './other-code/Othercode.vue'

const loginDialog = defineModel("loginDialog", {
    type: Boolean,
    default: false
})

// 登录方式切换
const loginType = ref(true);

// 关闭
function cancel(): void {
    loginDialog.value = false;
}

function editLoginType (value: boolean) {
    loginType.value = value
}

// 获取二维码登录key
const codeKey = ref('');
function getQrcodeKey () {
    qrcodeKey().then((res:ResponseType) => {
        codeKey.value = res.data.unikey;
        getQrcodeImg()
    })
}

// 获取二维码图片
const qrcodeImgSrc = ref('');
function getQrcodeImg() {
    qrcodeImg({
        key: codeKey.value,
        qrimg: true
    }).then( (res:ResponseType) => {
        qrcodeImgSrc.value = res.data.qrimg;
        getQscodeCheck();
    })
}

// 二维码失效
const qrcodeLose = ref(false);
// 二维码待确认
const qrcodeAwaitVerify = ref(false);

function getQscodeCheck() {
    qrcodeCheck({key: codeKey.value}).then((res: ResponseType) => {
        // 失效
        if(res.code === 800) {
            qrcodeLose.value = true;
            qrcodeAwaitVerify.value = false;
        }
        // 等待扫码
        if(res.code === 801) {
            scanPolling(1000)
        }
        // 待确认
        if(res.code === 802) {
            qrcodeAwaitVerify.value = true;
            scanPolling(1000);
        }
        // 授权成功
        if(res.code === 803) {
            
        }
    })
}

// 刷新
function refreshBtn() {
    getQrcodeKey()
    qrcodeLose.value = false;
}

// 扫描状态轮询
const timer = ref<NodeJS.Timeout | null>(null);

function scanPolling(time: number): void {
  timer.value && clearTimeout(timer.value);

  timer.value = setTimeout(() => {
    getQscodeCheck();
  }, time);
}

watch(loginDialog,
    (newId) => {
        if(newId){
            getQrcodeKey()
        }
    }
)

</script>

<style lang="scss" scoped>
.dialog{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2024100;
    .login-mask{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: transparent;
    }
    .login-box{
        position: absolute;
        top: 50%;
        left: 50%;
        width: 530px;
        height: 366px;
        transform: translate(-50%, -50%);
        z-index: 1;
        border-radius: 4px;
        box-shadow: 0 5px 16px rgba(0, 0, 0, 0.8);
        background: #fff;
        border: none;
        .login-header{
            position: relative;
            margin: 0;
            padding: 0 45px 0 18px;
            height: 38px;
            line-height: 38px;
            z-index: 10;
            border-bottom: 1px solid #191919;
            border-radius: 4px 4px 0 0;
            background: #2d2d2d;
            font-weight: bold;
            font-size: 14px;
            color: #fff;
            .clear-dialog{
                position: absolute;
                z-index: 20;
                top: 16px;
                right: 20px;
                width: 10px;
                height: 10px;
                overflow: hidden;
                text-indent: -9999px;
                cursor: pointer;
                background: url('@/assets/images/dialog.png');
                background-position: 0 -95px;
                &:hover{
                    color: #ccc;
                }
            }
        }
        .login-content{
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin: auto;
            padding: 0;
            height: 326px;
            border: 1px solid #d8d8d8;
            border-width: 0 1px 1px;
            border-radius: 0 0 4px 4px;
            background: #fff;
        }
    }
}
</style>