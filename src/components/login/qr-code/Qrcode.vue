<template>
    <div>
        <div class="login-type" v-if="!qrcodeAwaitVerify">
            <div class="phone-model">
                <img src="@/assets/images/login/phone-model.png" alt="">
            </div>
            <div class="l-code-box">
                <h3>扫码登录</h3>
                <div class="code-box">
                    <img :src="qrcodeImgSrc" alt="">
                    <div class="tip" v-if="qrcodeLose">
                        <div class="text">二维码已失效</div>
                        <div class="refresh" @click="refresh">点击刷新</div>
                    </div>
                </div>
                <p class="l-text">使用&nbsp;
                    <a href="">网易云音乐APP</a>
                    &nbsp;扫码登录
                </p>
            </div>
        </div>
        <div class="qrcode-authorized" v-else>
            <img
                class="icon-phone"
                src="@/assets/images/login/qrcode-authorized.png"
                alt=""
            />
            <p class="title">扫描成功</p>
            <p class="text">请在手机上确认登录</p>
        </div>
        <div class="other-type" @click="updateLoginType">选择其他登录方式</div>
    </div>
</template>

<script setup lang="ts">
    defineProps({
        qrcodeImgSrc:{
            type: String,
            default: ''
        },
        qrcodeLose: {
            type: Boolean,
            default: false
        },
        qrcodeAwaitVerify: {
            type: Boolean,
            default: false
        }
    })
    const emit = defineEmits(['updateLoginType', 'refresh'])

    function updateLoginType () {
        emit('updateLoginType', false)
    }

    function refresh() {
        emit('refresh')
    }
</script>

<style lang="scss" scoped>
.login-type{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 220px;
    .phone-model{
        width: 125px;
        height: 223px;
        img{
            width: 125px;
            height: 220px;
        }
    }
    .l-code-box{
        margin-left: 25px;
        width: 200px;
        text-align: center;
        h3{
            font-size: 18px;
            font-weight: 500;
        }
        .code-box{
            position: relative;
            width: 138px;
            height: 138px;
            padding: 4px;
            margin: 13px auto;
            img{
                width: 100%;
                height: 100%;
            }
            .tip{
                position: absolute;
                top: 0;
                left: 0;
                z-index: 1;
                display: block;
                width: 100%;
                height: 100%;
                font-size: 14px;
                background: #ffffffe6;
                .text{
                    width: 100%;
                    margin: 45px auto 6px;
                    font-size: 12px;
                    font-weight: 500;
                    color: #000c;
                    line-height: 17px;
                }
                .refresh{
                    display: block;
                    width: 64px;
                    height: 24px;
                    padding-right: 0;
                    margin: 0 auto;
                    font-size: 12px;
                    line-height: 24px;
                    color: #fff;
                    text-align: center;
                    cursor: pointer;
                    background: linear-gradient(180deg, #81dd81, #55a055);
                    border: 1px solid #5baf5b;
                    border-radius: 4px;
                    box-shadow: inset 0 -1px 1px 1px #b9e6b94f;
                }
            }
        }
        .l-text{
            font-size: 12px;
            width: 200px;
            line-height: 17px;
            color: rgba(0, 0, 0, 0.4);
            a{
                color: #0c73c2;
            }
        }
    }
}
.other-type{
    display: block;
    width: 118px;
    height: 28px;
    margin: 20px auto 0;
    padding-right: 0;
    font-size: 12px;
    border: 1px solid #979797;
    border-radius: 15px;
    line-height: 28px;
    text-align: center;
    color: rgba(0, 0, 0, 0.8);
    cursor: pointer;
}
.qrcode-authorized{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 220px;
    .icon-phone{
        width: 140px;
        height: 140px;
    }
    .title{
        margin-top: 12px;
        font-size: 18px;
        font-weight: 450;
        line-height: 24px;
        color: #000c;
        text-align: center;
    }
    .text{
        margin-top: 4px;
        font-size: 14px;
        color: #333;
        text-align: center;
    }
}
</style>