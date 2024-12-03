<template>
    <div class="home-toplist">
        <div class="toplist-menu">
            <div class="menu-box">
                <h2 class="tit">云音乐特色榜</h2>
                <ul class="menu-list">
                    <li class="item" v-for="item in 4">
                        <div class="item-box">
                            <div class="item-left">
                                <img src="http://p1.music.126.net/rIi7Qzy2i2Y_1QD7cd0MYA==/109951170048506929.jpg?param=40y40" alt="">
                                <span class="mask"></span>
                            </div>
                            <p class="name">飙升榜</p>
                            <p>每天更新</p>
                        </div>
                    </li>
                </ul>
                <h2 class="tit two">全球媒体榜</h2>
            </div>
        </div>
        <div class="toplist-content">

        </div>
    </div>
</template>

<script setup lang="ts">

</script>


<style lang="scss" scoped>
.home-toplist{
    width: 980px;
    min-height: 700px;
    margin: 0 auto;
    background-color: #fff;
    border: 1px solid #d3d3d3;
    border-width: 0 1px;
    background: url('@/assets/images/my-music/wrap3.png') repeat-y center 0;
    .toplist-menu{
        position: relative;
        display: inline-block;
        width: 239px;
        vertical-align: top;
        .menu-box{
            margin-top: 40px;
            .tit{
                padding: 0 10px 12px 15px;
                font-size: 14px;
                color: #000;
                font-family: simsun, \5b8b\4f53;
            }
            .two{
                margin-top: 20px;
            }
            .menu-list{
                .item{
                    padding: 10px 0 10px 20px;
                    position: relative;
                    height: 42px;
                    cursor: pointer;
                    .item-box{
                        padding-left: 50px;
                        .item-left{
                            float: left;
                            margin-left: -50px;
                            overflow: hidden;
                            width: 40px;
                            height: 40px;
                            position: relative;
                            img{
                                width: 40px;
                                height: 40px;
                            }
                            .mask{
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                            }
                        }
                        p{
                            color: #999;
                        }
                        .name{
                            width: 150px;
                            overflow: hidden;
                            margin-top: 2px;
                            margin-bottom: 8px;
                            color: #000;
                        }
                    }
                    &:hover{
                        background-color: #f4f2f2;
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
    .toplist-content{
        position: relative;
        display: inline-block;
        width: 740px;
        vertical-align: top;
    }
}
</style>