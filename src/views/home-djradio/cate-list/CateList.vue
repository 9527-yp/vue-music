<template>
    <div class="rditype">
        <div class="rdtype-box">
            <ul class="rd-ul" v-if="rdtype">
                <li class="rd-item" v-for="item in djList.slice(0,18)" :key="item?.id" @click="toHomeDjradioCategory(item.id)">
                    <div class="item-cnt" :class="{'item-active': route.query.id && route.query.id == item.id}">
                        <div class="bag" :class="{'bag-active': route.query.id && route.query.id == item.id}" :style="{backgroundImage: `url(${item?.picWebUrl})`}"></div>
                        <em>{{item?.name}}</em>
                    </div>
                </li>
            </ul>
            <ul class="rd-ul" v-if="!rdtype">
                <li class="rd-item" v-for="item in djList.slice(18,34)" :key="item?.id" @click="toHomeDjradioCategory(item.id)">
                    <div class="item-cnt">
                        <div class="bag" :style="{backgroundImage:`url(${item?.picWebUrl})`}"></div>
                        <em>{{item?.name}}</em>
                    </div>
                </li>
                <li class="rd-item" @click="problem">
                    <div class="item-cnt">
                        <div class="bag problem"></div>
                        <em>常见问题</em>
                    </div>
                </li>
                <li class="rd-item" @click="anchor">
                    <div class="item-cnt">
                        <div class="bag anchor"></div>
                        <em style="color: #5ab5e7">我要做主播</em>
                    </div>
                </li>
            </ul>
        </div>
        <span class="turn turn-left" :class="{'dis': rdtype}" @click="prev"></span>
        <span class="turn turn-right" :class="{'dis': !rdtype}" @click="next"></span>
        <div class="dotpage">
            <span class="dot" :class="{'dot-active': rdtype}" @click="prev"></span>
            <span class="dot" :class="{'dot-active': !rdtype}" @click="next"></span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';


const router = useRouter();
const route = useRoute();
defineProps({
    djList: {
        type: Array,
        default: []
    }
})

const rdtype = ref<boolean>(true);

function prev() {
    if(rdtype.value){
        return;
    }
    rdtype.value = true
}

function next() {
    if(!rdtype.value){
        return;
    }
    rdtype.value = false
}

function problem() {
    window.open('https://music.163.com/#/topic?id=18652232')
}
function anchor() {
    window.open('https://music.163.com/st/ncreator/manage/voice')
}

function toHomeDjradioCategory(id: number) {
    router.push({
        path: '/home-djradio-category',
        query: {
            id
        }
    })
}
</script>

<style lang="scss" scoped>
.rditype{
    margin-bottom: 20px;
    position: relative;
    .rdtype-box{
        height: 194px;
        overflow: hidden;
        max-height: 194px;
        .rd-ul{
            margin-left: -33px;
            .rd-item{
                float: left;
                margin: 0 0 25px 33px;
                .item-cnt{
                    width: 70px;
                    height: 70px;
                    background: url('@/assets/images/home/radio_bg.png') no-repeat;
                    background-position: 0 9999px;
                    text-align: center;
                    color: #888;
                    cursor: pointer;
                    .problem{
                        background: url('@/assets/images/home/radio_faq.png') no-repeat;
                    }
                    .anchor{
                        background: url('@/assets/images/home/radio_apply.png') no-repeat;
                    }
                    .bag{
                        width: 48px;
                        height: 48px;
                        margin: 2px auto 0;
                        background-position: 0 0;
                    }
                    em{
                        margin-top: -3px;
                        font-style: normal;
                        text-align: left;
                        font-size: inherit;
                    }
                    &:hover{
                        background-position: 0 0;
                        text-decoration: none;
                    }
                }
                .item-active{
                    color: #d35757;
                    background-position: -70px 0;
                    &:hover{
                        background-position: -70px 0;
                        text-decoration: none;
                    }
                    .bag-active{
                        background-position: -48px 0;
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
    .turn{
        position: absolute;
        top: 50%;
        width: 20px;
        height: 30px;
        margin-top: -15px;
        opacity: 0.25;
        text-indent: -9999px;
        cursor: pointer;
        background: url('@/assets/images/home/radio_slide.png') no-repeat;
        &:hover{
            opacity: 0.4;
        }
    }
    .turn-left{
        left: -26px;
        background-position: 0 -30px;
    }
    .turn-right{
        right: -26px;
        background-position: -30px -30px;
    }
    .dis{
        opacity: 0.08;
        &:hover{
            opacity: 0.08;
        }
    }
    .dotpage{
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0px;
        width: 100%;
        height: 20px;
        text-align: center;
        line-height: 0;
        .dot{
            display: inline-block;
            width: 20px;
            height: 20px;
            background: url('@/assets/images/home/radio_slide.png') no-repeat;
            background-position: 0 0;
            text-indent: -9999px;
            cursor: pointer;
        }
        .dot-active{
            background-position: -30px 0;
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
</style>