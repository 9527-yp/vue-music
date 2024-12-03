<template>
    <div class="recommend-side">
            <div class="side-top">
                <div class="side-hd">
                    <span class="side-icn icn"></span>
                    个性化推荐如何工作
                </div>
                <p>它聪明、熟悉每个用户的喜好，从海量音乐中挑选出你可能喜欢的音乐。</p>
                <p>它通过你每一次操作来记录你的口味</p>
                <ul class="side-info">
                    <li class="item">
                        <span class="play-icn icn"></span>
                        你播放了
                        <strong>{{playCount}}</strong>
                        首音乐
                    </li>
                    <li class="item">
                        <span class="like-icn icn"></span>
                        你喜欢了
                        <strong>{{likeSongCount}}</strong>
                        首音乐
                    </li>
                    <li class="item last">
                        <span class="collect-icn icn"></span>
                        你收藏了
                        <strong>{{singerCount}}</strong>
                        位歌手
                    </li>
                </ul>
                <p>你提供给云音乐的信息越多，它就越了解你的音乐喜好。</p>
            </div>
            <SideMulti />
        </div>
</template>

<script setup lang="ts">
import SideMulti from '@/components/side-info/Side-Multi.vue';
defineProps({
    playCount: {
        type: Number,
        default: 0
    },
    singerCount: {
        type: Number,
        default: 0
    },
    likeSongCount: {
        type: Number,
        default: 0
    }
})
</script>


<style lang="scss" scoped>
.recommend-side{
    display: inline-block;
    width: 270px;
    vertical-align: top;
    padding: 20px 40px 40px 30px;
    box-sizing: border-box;
    .side-top{
        margin-bottom: 30px;
        .icn{
            float: left;
            margin-right: 8px;
            width: 22px;
            height: 22px;
            background: url('@/assets/images/icon2.png') no-repeat;
        }
        .side-hd{
            height: 22px;
            padding: 5px 0 8px;
            border-bottom: 1px solid #ccc;
            line-height: 22px;
            font-size: 18px;
            font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
            .side-icn{
                margin-right: 6px;
                background-position: 0 0;
            }
        }
        p{
            margin: 1em 0;
            line-height: 19px;
            color: #666;
        }
        .side-info{
            background: #f7f7f7;
            padding: 17px 0 17px 12px;
            color: #999;
            .item{
                width: 188px;
                height: 40px;
                line-height: 20px;
                .play-icn{
                    background-position: -25px 0;
                }
                strong{
                    font-weight: bold;
                    color: #c20c0c;
                }
                .like-icn{
                    background-position: 0 -25px;
                }
                .collect-icn{
                    background-position: -25px -25px;
                }
            }
            .last{
                height: 20px;
            }
        }
    }
}
</style>