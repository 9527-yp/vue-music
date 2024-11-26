<template>
    <div class="dj-side">
        <h3 class="header">
            <span class="text">更多节目</span>
            <span class="more text-hov" @click="toRadio">全部></span>
        </h3>
        <ul class="recommend-ul">
            <li class="item" v-for="(item, index) in programList.slice(0, 4)" :key="index">
                <div class="song-img" @click="toDjDetail(item.id)">
                    <img :src="`${item?.coverUrl}?param=50y50`" alt="">
                </div>
                <div class="info">
                    <p class="thide">
                        <span class="song-name text-hov" :title="item.name" @click="toDjDetail(item.id)">{{item.name}}</span>
                    </p>
                    <p>
                        <span class="by">Vol.{{ item.serialNum }}</span>
                    </p>
                </div>
            </li>
        </ul>
        <SideMulti />
    </div>
</template>

<script setup lang="ts">
import SideMulti from '@/components/side-info/Side-Multi.vue';
const props = defineProps({
    programList: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['toDjDetail', 'toRadio']);

function toDjDetail(id: number) {
    emit('toDjDetail', id)
}

function toRadio() {
    emit('toRadio')
}
</script>


<style lang="scss" scoped>
.dj-side{
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
        .text{
            float: left;
        }
        .more{
            font-weight: normal;
            font-family: simsun, \5b8b\4f53;
            color: #666;
            float: right;
            cursor: pointer;
        }
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