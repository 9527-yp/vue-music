<template>
    <div class="m-multi">
        <h3 class="header">
            <span>网易云音乐多端下载</span>
        </h3>
        <ul class="down-ul">
            <li class="item">
                <span class="ios"></span>
            </li>
            <li class="item">
                <span class="pc"></span>
            </li>
            <li class="item">
                <span class="aos"></span>
            </li>
        </ul>
        <p>同步歌单，随时畅听好音乐</p>
    </div>
</template>


<style lang="scss" scoped>
.header{
    position: relative;
    height: 23px;
    margin-bottom: 20px;
    border-bottom: 1px solid #ccc;
    color: #333;
    font-size: 100%;
}
.m-multi{
    margin: 20px 0;
    padding-bottom: 20px;
    .down-ul{
        height: 65px;
        margin-bottom: 10px;
        background: url('@/assets/images/sprite.png') no-repeat;
        background-position: 0 -392px;
        .item{
            float: left;
            .ios{
                display: block;
                width: 42px;
                height: 48px;
                cursor: pointer;
                &:hover{
                    background: url('@/assets/images/sprite.png') no-repeat;
                    background-position: 0 -472px;
                }
            }
            .pc{
                display: block;
                width: 60px;
                margin: 0 26px 0 30px;
                height: 48px;
                cursor: pointer;
                &:hover{
                    background: url('@/assets/images/sprite.png') no-repeat;
                    background-position: -72px -472px;
                }
            }
            .aos{
                display: block;
                width: 42px;
                height: 48px;
                cursor: pointer;
                &:hover{
                    background: url('@/assets/images/sprite.png') no-repeat;
                    background-position: -158px -472px;
                }
            }
        }
    }
    p{
        color: #999;
    }
}
</style>