<template>
    <div class="song-sheet-review">
        <div class="song-list-box">
            <h3 class="title">评论</h3>
            <span class="song-num">共{{playlist?.commentCount}}条评论</span>
        </div>
        <div class="review-box">
            <div class="iptarea">
                <div class="header">
                    <img :src="userInfo?.profile?.avatarUrl" alt="">
                </div>
                <div class="m-cmmtipt">
                    <Cmmtipt />
                    <div class="corr">
                        <span class="arrline">◆</span>
                        <span class="arrclr">◆</span>
                    </div>
                </div>
            </div>
            <div class="hot-comment">
                <h3 class="title">精彩评论</h3>
                <CommentList />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import useUserStore from '@/stores/modules/user.ts';
import Cmmtipt from './cmmtipt/Cmmtipt.vue'
import CommentList from './comment-list/CommentList.vue'

const userStore = useUserStore();
const userInfo = computed(() => userStore.getUserInfo)

defineProps({
    playlist: {
        type: Object,
        default: {}
    }
})
</script>
<style lang="scss" scoped>
.song-list-box{
    width: 100%;
    height: 35px;
    border-bottom: 2px solid #c20c0c;
    box-sizing: border-box;
    padding: 0 10px 0 32px;
    .title{
        font-size: 20px;
        line-height: 28px;
        float: left;
        font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
        font-weight: normal;
    }
    .song-num{
        margin: 9px 0 0 20px;
        float: left;
        color: #666;
    }
    .more{
        margin-top: 5px;
        float: right;
        color: #666;
        .num{
            color: #c20c0c;
        }
    }
}
.song-sheet-review{
    margin-top: 40px;
    .review-box{
        margin: 20px 32px 0;
        .iptarea{
            margin-bottom: 20px;
            .header{
                float: left;
                width: 50px;
                height: 50px;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .m-cmmtipt{
                position: relative;
                margin-left: 62px;
            }
        }
        .hot-comment{
            .title{
                position: relative;
                top: 1px;
                height: 20px;
                color: #333;
                font-size: 100%;
                border-bottom: 1px solid #cfcfcf;
            }
        }
    }
}
.corr{
    position: absolute;
    top: 11px;
    left: -7px;
    width: 13px;
    height: 14px;
    overflow: hidden;
    .arrline{
        color: #cdcdcd;
        display: block;
        font-family: "SimSun";
        font-size: 15px;
        font-style: normal;
        font-weight: normal;
        height: 10px;
        line-height: normal;
    }
    .arrclr{
        display: block;
        font-family: "SimSun";
        font-size: 15px;
        font-style: normal;
        font-weight: normal;
        height: 10px;
        line-height: normal;
        margin: -10px 0 0 1px;
        color: #fff;
    }
}
</style>