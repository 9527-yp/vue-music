<template>
    <div>
        <div class="u-txtwrap" :class="{'u-recover' : isRecover}">
            <textarea class="u-text" v-model="replay.text" rows="3" placeholder="评论"></textarea>
        </div>
        <div class="m-btns">
            <i class="icn emo-icn" @click="emoClick"></i>
            <i class="icn rel-icn"></i>
            <div class="review-btn" @click="reviewBtn">评论</div>
            <span class="review-num"  :class="{ 'words-beyond': replay.length < 0 }">{{replay.length}}</span>
            <div class="m-emo" v-if="expressionShow">
                <div class="emo-box">
                    <div class="emo-content">
                        <span class="emtitm" v-for="(item, index) in expression.list" :key="index" :title="item.title">
                            <img
                              class="emtitm-img"
                              :src="`http://s1.music.126.net/style/web2/emt/emoji_${item.num}.png`"
                              alt=""
                              @click="chooseEmoj(index)"
                            />
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
        <teleport to="body">
            <div class="warning-tip" v-if="warningInfo.visible">
                <i v-if="warningInfo.type" class="success-icn"></i>
                <i v-else class="warning-icn"></i>
                <span class="text">{{warningInfo.text}}</span>
            </div>
        </teleport>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onUnmounted, watch } from 'vue';
import { expressionList } from './emo'
import type { ResponseType } from '@/types/index';
import { addComment, replyComment } from '@/api/comment.ts'

const emit = defineEmits(['publish'])
const props = defineProps({
    isRecover: { // 是否评论或回复，输入框高度变化
        type: Boolean,
        default: false
    },
    id: { // 对应类型id
        type: Number || String,
        default: 0
    },
    type: { // 资源类型,对应歌曲：0, mv：1,歌单：2, 专辑：3, 电台：4, 视频：5, 动态：6
        type: Number,
        default: 0
    },
    t: {
        type: String,
        default: 1
    },
    commentId: { // 回复评论id
        type: Number || String,
        default: 0
    }

})
type ExpressionItem = {
    total: number,
    pageSize: number,
    pageNum: number,
    list: {
        title: string,
        num: number
    }[],
}

type ParamItem = {
    id: number | string,
    content: string,
    type: number | string,
    commentId?: number | string,
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

function chooseEmoj(index: number) {
    const list = JSON.parse(JSON.stringify(expression.list));
    replay.text += `[${list[index].title}]`
}

// 评论
const warningInfo = reactive({
    text: '',
    visible: false,
    type:0, // 0:警告 ，1：成功
    time: null
})
async function reviewBtn() {
    // 超出文本大小 || 未输入
    if(replay.length < 0 || replay.text === ''){
        if(replay.text === ''){
            warningInfo.text = '输入点内容再提交吧';
        }else{
            warningInfo.text = '输入不能超过140个字符';
        }
        warningInfo.type = 0;
        warningInfo.visible = true;
        warningInfo.time && clearTimeout( warningInfo.time);
        warningInfo.time = setTimeout(() => {
            warningInfo.visible = false;
        }, 1500);
        return;
    }

    let param: ParamItem = {
        id: props.id,
        content: replay.text,
        type: props.type,
    }

    if(props.t === '1') {
        // 1：评论
        addComment(param).then((res: ResponseType) => {
            if(res.code === 200) {
                warningInfo.type = 1;
                warningInfo.text = '评论成功';
                warningInfo.visible = true;
                warningInfo.time && clearTimeout( warningInfo.time);
                warningInfo.time = setTimeout(() => {
                    warningInfo.visible = false;
                }, 1500);
                // 通知父组件更新评论
                emit('publish')
                replay.text = ''
            }
        })
    }else if(props.t === '2') {
        // 2：回复
        param.commentId = props.commentId
        replyComment(param).then((res: ResponseType) => {
            if(res.code === 200) {
                warningInfo.type = 1;
                warningInfo.text = '评论成功';
                warningInfo.visible = true;
                warningInfo.time && clearTimeout( warningInfo.time);
                warningInfo.time = setTimeout(() => {
                    warningInfo.visible = false;
                }, 1500);
                // 通知父组件更新评论
                emit('publish')
                replay.text = ''
            }
        })
    }
    
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
.u-recover{
    .u-text{
        height: 20px;
        display: block;
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
.warning-tip{
    width: 280px;
    background: #fff;
    color: #333;
    line-height: 52px;
    text-align: center;
    border: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    position: absolute;
    top:50%;
    left: 50%;
    margin-top: -40px;
    margin-left: -140px;
    vertical-align: middle;
    .warning-icn{
        width: 20px;
        height: 20px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 3px;
        background: url('@/assets/images/icon.png') no-repeat;
        background-position: -24px -406px;
    }
    .success-icn{
        width: 20px;
        height: 20px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 3px;
        background: url('@/assets/images/icon.png') no-repeat;
        background-position: -24px -430px;
    }
    .text{
        display: inline-block;
        vertical-align: middle;
    }
}

</style>