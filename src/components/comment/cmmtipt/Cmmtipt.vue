<template>
    <div>
        <div class="u-txtwrap">
            <textarea class="u-text" v-model="replay.text" rows="3" placeholder="评论"></textarea>
        </div>
        <div class="m-btns">
            <i class="icn emo-icn" @click="emoClick"></i>
            <i class="icn rel-icn"></i>
            <div class="review-btn">评论</div>
            <span class="review-num"  :class="{ 'words-beyond': replay.length < 0 }">{{replay.length}}</span>
            <div class="m-emo" v-if="expressionShow">
                <div class="emo-box">
                    <div class="emo-content">
                        <span class="emtitm" v-for="(item, index) in expression.list" :key="index" :title="item.title">
                            <img class="emtitm-img" :src="`http://s1.music.126.net/style/web2/emt/emoji_${item.num}.png`" alt="">
                        </span>
                    </div>
                    <div class="page">
                        <i class="u-btn u-btn-prv" @click="prvBtn"></i>
                        <span class="text">{{expression.pageNum}}/{{expression.total}}</span>
                        <i class="u-btn u-btn-nxt" @click="nxtBtn"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onUnmounted, watch } from 'vue';
import { expressionList } from './emo'


type ExpressionItem = {
    total: number,
    pageSize: number,
    pageNum: number,
    list: {
        title: string,
        num: number
    }[],
}

// 评论数据
const replay = reactive({
    text: '',
    length: 140,
})

watch(() => replay.text, (newValue) => {
    replay.length = 140 - newValue.length
})
const expressionShow = ref(false);
const expression = reactive<ExpressionItem>({
    total:0,
    pageSize: 50,
    pageNum: 1,
    list: []
})

function getEmoList() {
    expression.total = Math.ceil(expressionList.length / expression.pageSize)
    expression.list = expressionList.slice(0, expression.pageSize);
}
getEmoList()

function emoClick() {
    expressionShow.value = !expressionShow.value
}

// 上一页
function prvBtn() {
    if(expression.pageNum === 1){
        return;
    }
    expression.pageNum--;
    expression.list = expressionList.slice((expression.pageNum-1) * expression.pageSize, expression.pageNum * expression.pageSize);
}

// 下一页
function nxtBtn() {
    if(expression.pageNum === expression.total){
        return;
    }
    expression.pageNum++;
    expression.list = expressionList.slice((expression.pageNum-1) * expression.pageSize, expression.pageNum * expression.pageSize);
}

// 点击表情以外得地方, 关闭表情弹框
onMounted(() => {
    document.addEventListener('click', function (e: MouseEvent): void {
        const target = e.target as HTMLElement;
        if (
            target.className !== 'icn emo-icn' &&
            target.className !== 'emo-box' &&
            target.className !== 'u-btn u-btn-prv' &&
            target.className !== 'u-btn u-btn-nxt' &&
            target.className !== 'emtitm-img'
        ) {
            expressionShow.value = false;
        }
    });
})

onUnmounted(() => {
  document.removeEventListener('click', () => ({}));
});
</script>
<style lang="scss" scoped>
.u-txtwrap{
    padding-right: 14px;
    .u-text{
        height: 50px;
        display: block;
        width: 100%;
        margin-right: -20px;
        margin: 0;
        padding: 5px 6px 6px;
        border: 1px solid #cdcdcd;
        border-radius: 2px;
        line-height: 19px;
        box-sizing: content-box;
        &:focus{
            outline: none;
        }
    }
}
.m-btns{
    clear: both;
    padding-top: 10px;
    position: relative;
    .icn{
        float: left;
        margin: 0px 10px 0 0;
        width: 18px;
        height: 18px;
        background: url('@/assets/images/icon.png') no-repeat;
        overflow: hidden;
        vertical-align: middle;
        cursor: pointer;
    }
    .emo-icn{
        background-position: -40px -490px;
    }
    .rel-icn{
        background-position: -60px -490px;
    }
    .review-btn{
        float: right;
        width: 46px;
        height: 25px;
        background: url('@/assets/images/my-music/button.png') no-repeat;
        background-position: -84px -64px;
        color: #fff;
        text-align: center;
        line-height: 25px;
        cursor: pointer;
        &:hover{
            background-position: -84px -94px;
        }
    }
    .review-num{
        float: right;
        margin-right: 10px;
        line-height: 25px;
        color: #999;
    }
    .words-beyond{
        color: #c20c0c;
    }
    .m-emo{
        background:#fff;
        position: relative;
        .emo-box{
            position: absolute;
            top: 20px;
            left: -12px;
            width: 260px;
            height: 160px;
            padding: 17px 17px 0 13px;
            z-index: 100;
            background: url('@/assets/images/my-music/emtbg.png') no-repeat;
            .emo-content{
                width: 100%;
                height: 130px;
                .emtitm{
                    float: left;
                    width: 21px;
                    height: 21px;
                    margin: 1px 2px 2px 1px;
                    border: 1px solid #fff;
                    cursor: pointer;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
                &::after{
                    clear: both;
                    content: '.';
                    display: block;
                    height: 0;
                    visibility: hidden;
                }
            }
            .page{
                margin-top: 2px;
                text-align: center;
                .u-btn{
                    width: 9px;
                    height: 9px;
                    display: inline-block;
                    margin: 0 16px;
                    vertical-align: middle;
                    line-height: 16px;
                    background: url('@/assets/images/my-music/button.png') no-repeat;
                    cursor: pointer;
                }
                .u-btn-prv{
                    background-position: -110px 0;
                    &:hover{
                        background-position: -110px -20px;
                    }
                }
                .u-btn-nxt{
                    background-position: -120px 0;
                    &:hover{
                        background-position: -120px -20px;
                    }
                }
                .text{
                    display: inline-block;
                    height: 15px;
                    margin: 0 16px;
                    vertical-align: middle;
                    line-height: 16px;
                    color: #666;
                }
            }
        }
    }
    &::after{
        clear: both;
        content: '.';
        display: block;
        height: 0;
        visibility: hidden;
    }
}

</style>