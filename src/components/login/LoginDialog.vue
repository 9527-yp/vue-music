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
                        <div class="login-type">
                            <div class="phone-model">
                                <img src="@/assets/images/login/phone-model.png" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
const loginDialog = defineModel("loginDialog", {
    type: Boolean,
    default: false
})

function cancel(): void {
    loginDialog.value = false
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
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
    }
}
</style>