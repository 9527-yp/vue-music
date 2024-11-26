<template>
    <div class="radio-side">
        <h3 class="header">
            <span>你可能也喜欢</span>
        </h3>
        <ul class="recommend-ul">
            <li class="item" v-for="item in list" :key="item.id">
                <div class="song-img" @click="toRadio(item.id)">
                    <img :src="`${item.picUrl}?param=50y50`" alt="">
                </div>
                <div class="info">
                    <p class="thide">
                        <span class="song-name text-hov" @click="toRadio(item.id)" :title="item.name">{{item.name}}</span>
                    </p>
                    <p>
                        <span class="by">by</span>
                        <span class="nm thide text-hov" :title="item?.dj?.nickname" @click="toUserHome(item?.dj?.userId)">{{item?.dj?.nickname}}</span>
                    </p>
                </div>
            </li>
        </ul>
        <SideMulti />
    </div>
</template>

<script setup lang="ts">
import SideMulti from '@/components/side-info/Side-Multi.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const Props = defineProps({
    list: {
        type: Array,
        default: []
    }
})

function toRadio(id: number) {
    console.log(id, 'id')
    router.push({
        path: '/radio-detail',
        query: {
            id
        }
    })
}

function toUserHome(id: number) {
    router.push({
        path: '/user/home',
        query: {
            id
        }
    })
}
</script>

<style lang="scss" scoped>
.radio-side{
    display: inline-block;
    width: 270px;
    vertical-align: top;
    padding: 20px 40px 40px 30px;
    box-sizing: border-box;
    .header{
        position: relative;
        height: 23px;
        margin-bottom: 20px;
        border-bottom: 1px solid #ccc;
        color: #333;
        font-size: 100%;
    }
    .recommend-ul{
        margin-bottom: 25px;
        .item{
            float: left;
            width: 200px;
            height: 50px;
            margin-bottom: 15px;
            line-height: 24px;
            .song-img{
                margin-right: -60px;
                float: left;
                width: 50px;
                height: 50px;
                cursor: pointer;
                img{
                    width: 50px;
                    height: 50px;
                }
            }
            .info{
                margin-left: 60px;
                line-height: 24px;
                p{
                    width: 140px;
                }
                .song-name{
                    color: #000;
                    font-size: 14px;
                    cursor: pointer;
                }
                .by{
                    float: left;
                    color: #999;
                }
                .nm{
                    float: left;
                    max-width: 106px;
                    margin: 0 2px 0 4px;
                    color: #666;
                    cursor: pointer;
                }
            }
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
</style>