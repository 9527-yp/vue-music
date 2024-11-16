<template>
    <div class="album-side-cnt">
        <h3 class="header">
            <span>喜欢这张专辑的人</span>
        </h3>
        <ul v-if="false" class="m-piclist">
            <li class="item-cover">
                <!-- <img class="img" title="" src="" alt=""> -->
            </li>
        </ul>
        <h3 class="header">
            <span class="hed-l">Ta的其他热门专辑</span>
            <span class="more text-hov">全部></span>
        </h3>
        <ul class="m-rctlist">
            <li class="item-album" v-for="item in albumList" :key="item.id">
                <div class="u-cover" :title="item.name" @click="skip(item.id)">
                    <img class="img" :src="`${item?.picUrl}?param=50y50`" alt="">
                </div>
                <div class="info">
                    <p class="thide">
                        <span class="text-hov tit" @click="skip(item.id)">{{item.name}}</span>
                    </p>
                    <p>{{formatDateTime(item?.publishTime / 1000, 'Y-M-D')}}</p>
                </div>
            </li>
        </ul>
        <Side />
    </div>
</template>

<script setup lang="ts">
import { formatDateTime } from '@/utils/utils';
import Side from '@/components/side-info/Side.vue';
defineProps({
    albumList: {
        type: Array,
        default: []
    }
})

const emit = defineEmits(['skip']);

function skip(id: number) {
    emit('skip',{'/album', id})
}
</script>


<style lang="scss" scoped>
.album-side-cnt{
    padding: 20px 40px 40px 30px;
    .header{
        position: relative;
        height: 23px;
        margin-bottom: 20px;
        border-bottom: 1px solid #ccc;
        color: #333;
        font-size: 100%;
        .hed-l{
            float: left;
        }
        .more{
            float: right;
            font-weight: normal;
            font-family: simsun, \5b8b\4f53;
            color: #666;
        }
        &:after{
            clear: both;
            content: '.';
            display: block;
            height: 0;
            visibility: hidden;
        }
    }
    .m-piclist{
        margin-left: -13px;
        padding-bottom: 25px;
        .item-cover{
            padding: 0 0 13px 13px;
            float: left;
            width: 40px;
            height: 40px;
            .img{
                width: 40px;
                height: 40px;
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
    .m-rctlist{
        margin-bottom: 25px;
        .item-album{
            float: left;
            width: 200px;
            height: 50px;
            margin-bottom: 15px;
            line-height: 24px;
            .u-cover{
                position: relative;
                float: left;
                width: 50px;
                height: 50px;
                margin-right: -60px;
                cursor: pointer;
                .img{
                    width: 50px;
                    height: 50px;
                }
            }
            .info{
                margin-left: 60px;
                line-height: 24px;
                p{
                    width: 140px;
                    color: #666;
                }
                .tit{
                    font-size: 14px;
                    color: #000;
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