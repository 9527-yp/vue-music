<template>
    <Teleport to="body">
        <div v-show="loginDialog" class="loginDialog">
            <div class="dialog">
                <div class="login-mask"></div>
                <div class="login-box">
                    <div class="login-header">
                        登录
                        <i class="clear-dialog" @click="cancel">×</i>
                    </div>
                    <div class="login-content">
                        <div v-show="loginType">
                            <div class="login-type">
                                <div class="phone-model">
                                    <img src="@/assets/images/login/phone-model.png" alt="">
                                </div>
                                <div class="l-code-box">
                                    <h3>扫码登录</h3>
                                    <div class="code-box">
                                        <div></div>
                                    </div>
                                    <p class="l-text">使用&nbsp;
                                        <a href="">网易云音乐APP</a>
                                        &nbsp;扫码登录
                                    </p>
                                </div>
                            </div>
                            <div class="other-type" @click="loginType = false">选择其他登录方式</div>
                        </div>
                        <div v-show="!loginType">
                            <div class="other-type-box">
                                <div class="other-t">
                                    <div class="other-t-l">
                                        <img src="@/assets/images/login/other-phone.png" alt="">
                                        <div class="login-btn" @click="login">
                                            <div class="login-text">手机号登录/注册</div>
                                        </div>
                                    </div>
                                    <div class="other-t-r">
                                        <ul>
                                            <li class="item" @click="wechatLogin">
                                                <i class="icon wechat"></i>
                                                <span class="text">微信登录</span>
                                            </li>
                                            <li class="item">
                                                <i class="icon qq"></i>
                                                <span class="text">QQ登录</span>
                                            </li>
                                            <li class="item">
                                                <i class="icon micro-blog"></i>
                                                <span class="text">微博登录</span>
                                            </li>
                                            <li class="item">
                                                <i class="icon mailbox"></i>
                                                <span class="text">网易邮箱账号登录</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="other-b">
                                    <input type="checkbox" v-model="changeBox">
                                    <label>同意</label>
                                    <a href="https://st.music.163.com/official-terms/service" target="_blank">《服务条款》</a>
                                    <a href="https://st.music.163.com/official-terms/privacy" target="_blank">《隐私政策》</a>
                                    <a href="https://st.music.163.com/official-terms/children" target="_blank">《儿童隐私政策》</a>
                                </div>
                                <div class="other-b-r" @click="changeTypeCode">
                                    <img src="@/assets/images/login/qrcode-login.png" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <MessageSuccess v-model:openMessage="openMessageSuccess" :content="content" />
        <MessageWarning v-model:openMessage="openMessageWarning" :content="content" />
    </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const loginDialog = defineModel("loginDialog", {
    type: Boolean,
    default: false
})

// 登录方式切换
const loginType = ref(true);

// 勾选框
const changeBox = ref(false);

const openMessageSuccess = ref(false)
const openMessageWarning = ref(false)

const content = ref('')

// 关闭
function cancel(): void {
    loginDialog.value = false;
}

// 切换扫码登录
function changeTypeCode(): void {
    if(changeBox.value){
        loginType.value = true;
    }else{
        openMessageSuccess.value = true;
        content.value = '请先勾选同意《服务条款》、《隐私政策》、《儿童隐私政策》'
    }
}

function login(): boolean | undefined {
    if(!changeBox.value) {
        openMessageSuccess.value = true;
        content.value = '请先勾选同意《服务条款》、《隐私政策》、《儿童隐私政策》'
        return false
    }
}

function wechatLogin(): void {
    openMessageWarning.value = true;
    content.value = '暂不支持微信登录'
}
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
            .other-type-box{
                box-sizing: content-box;
                .other-t{
                    height: 220px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .other-t-l{
                        width: 224px;
                        padding: 0 35px 3px 40px;
                        border-right: 1px dotted #ccc;
                        img{
                            width: 224px;
                            height: 120px;
                        }
                        .login-btn{
                            margin-top: 35px;
                            width: 219px;
                            color: #fff;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 0 5px 0 0;
                            height: 31px;
                            font-size: 12px;
                            background: url('@/assets/images/login/button-bag.png') no-repeat 0 9999px;
                            background-position: right -428px;
                            &:hover{
                                background-position: right -510px;
                            }
                            .login-text{
                                width: 184px;
                                padding: 0 15px 0 20px;
                                height: 100%;
                                line-height: 31px;
                                text-align: center;
                                background: url('@/assets/images/login/button-bag.png') no-repeat 0 9999px;
                                background-position: 0 -387px;
                                &:hover{
                                    background-position: 0 -469px;
                                }
                            }
                        }
                    }
                    .other-t-r{
                        padding: 3px 0 3px 39px;
                        margin-top: -15px;
                        .item{
                            margin-top: 15px;
                            cursor: pointer;
                            .text{
                                display: inline-block;
                                font-style: normal;
                                vertical-align: middle;
                            }
                            .icon{
                                display: inline-block;
                                width: 38px;
                                height: 38px;
                                margin-right: 14px;
                                vertical-align: middle;
                                background: url('@/assets/images/icon-logo.png') no-repeat 0 9999px;
                            }
                            .wechat{
                                background-position: -150px -670px;
                            }
                            .qq{
                                background-position: -190px -670px;
                            }
                            .micro-blog{
                                background-position: -231px -670px;
                            }
                            .mailbox{
                                background-position: -271px -670px;
                            }
                            &:hover .text{
                                text-decoration: underline;
                            }
                        }
                    }
                }
                .other-b{
                    margin-left: 40px;
                    margin-top: 30px;
                    font-family: NotoSansHans-Regular;
                    font-size: 10px;
                    color: rgba(0, 0, 0, 0.4);
                    line-height: 15px;
                    vertical-align: middle;
                    input{
                        display: inline-block;
                        vertical-align: middle;
                    }
                    label{
                        margin-left: 2px;
                    }
                    a{
                        color: #507DAF;
                    }
                }
                .other-b-r{
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    width: 52px;
                    height: 52px;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
    }
}
</style>