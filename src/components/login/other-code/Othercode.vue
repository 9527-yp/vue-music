<template>
    <div>
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
                        <li class="item" @click="qqLogin">
                            <i class="icon qq"></i>
                            <span class="text">QQ登录</span>
                        </li>
                        <li class="item" @click="microBlogLogin">
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
        <MessageSuccess v-model:openMessage="openMessageSuccess" :content="content" />
        <MessageWarning v-model:openMessage="openMessageWarning" :content="content" />
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';

    const emit = defineEmits(['updateLoginType'])

    const openMessageSuccess = ref(false)
    const openMessageWarning = ref(false)
    const content = ref('')

    // 勾选框
    const changeBox = ref(false);

    function login(): boolean | undefined {
        if(!changeBox.value) {
            openMessageSuccess.value = true;
            content.value = '请先勾选同意《服务条款》、《隐私政策》、《儿童隐私政策》'
            return false
        }
    }
    
    // 切换扫码登录
    function changeTypeCode(): void {
        if(changeBox.value){
            emit('updateLoginType', true)
        }else{
            openMessageSuccess.value = true;
            content.value = '请先勾选同意《服务条款》、《隐私政策》、《儿童隐私政策》'
        }
    }

    function wechatLogin(): void {
        openMessageWarning.value = true;
        content.value = '暂不支持微信登录'
    }

    function qqLogin(): void {
        openMessageWarning.value = true;
        content.value = '暂不支持QQ登录'
    }

    function microBlogLogin(): void {
        openMessageWarning.value = true;
        content.value = '暂不支持微博登录'
    }
</script>

<style lang="scss" scoped>
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
</style>