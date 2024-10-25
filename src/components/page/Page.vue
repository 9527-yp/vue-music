<template>
    <div class="music-pagination">
        <span
          class="prv-btn page-btn btn"
          :class="{'prv-disabled': current === 1}"
          @click="prvBtn"
        >
          上一页
        </span>
        <span
          class="btn item"
          v-if="prvDot"
          :class="{'active-item' : current === 1}"
          @click="pageChange(1)"
        >
           1
        </span>
        <span class="" v-if="prvDot && totalPage > 9">...</span>
        <span class="btn item"
          :class="{'active-item' : current === item}"
          v-for="(item, index) in pageList"
          :key="index"
          @click="pageChange(item)"
        >
           {{item}}
        </span>
        <span class="" v-if="nxtDor && totalPage > 9">...</span>
        <span
          class="btn item"
          v-if="nxtDor"
          :class="{'active-item' : current === totalPage}"
          @click="pageChange(totalPage)"
        >
           {{totalPage}}
        </span>
        <span
          class="nxt-btn page-btn btn"
          :class="{'nxt-disabled': current === totalPage}"
          @click="nxtBtn"
        >
          下一页
        </span>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from 'vue';

const props = defineProps({
    total: {
        type: Number,
        default: 10,
    },
    pageSize: {
        type: Number,
        default: 10,
    },
    page: {
        type: Number,
        default: 1,
    },
    displayPage: {
        type: Number,
        default: 8,
    }
})

const emit = defineEmits(['changePage'])

const { page, pageSize, total: pageTotal, displayPage } = toRefs(props);

// 总页数
const totalPage = ref(0);
// 当前页
const current = ref<number>(page.value)
// 页数前省略号
const prvDot = ref(false);
// 页数后省略号
const nxtDor = ref(false);
// 页数数组
const pageList = ref<number[]>([])

watch(() => current.value, () => {
    changePage()
})
// 解决歌单切换选中页数未重置问题
watch(() => props.page, () => {
    current.value = props.page
})
// 解决歌单切换总页数未改变问题
watch(() => props.total, () => {
    totalPage.value = Math.ceil(pageTotal.value / pageSize.value);
})
// 初始化
function init() {
    // 总页数
    totalPage.value = Math.ceil(pageTotal.value / pageSize.value);

    // 总页数 = 显示页数
    if(totalPage.value === displayPage.value){
        for(let i = 1; i <= totalPage.value; i++){
            pageList.value.push(i)
        }
    }

    // 总页数 < 显示页数
    if(totalPage.value < displayPage.value){
        for(let i = 1; i <= totalPage.value; i++){
            pageList.value.push(i)
        }
    }

    // 总页数 > 显示页数
    if(totalPage.value > displayPage.value){
        nxtDor.value = true
        for(let i = 1; i <= totalPage.value; i++){
            if(i <= displayPage.value){
                pageList.value.push(i)
            }
        }
    }
}
init()

// 上一页
function prvBtn() {
    if(current.value <= 1){
        return;
    }
    current.value--;
}

// 下一页
function nxtBtn() {
    if(current.value >= totalPage.value){
        return;
    }
    current.value++;
}
// 点击切换
function pageChange(item: number): void {
    if(current.value === item){
        return;
    }
    current.value = item
}

function changePage() {
    emit('changePage', current.value)
    prvDot.value = false;
    nxtDor.value = false;
    pageList.value = []
    // 总页数小于展示页数，就return出去，不执行后面操作
    if(totalPage.value <= displayPage.value){
        init()
        return
    }
    // 总页数 > 页数数组 && 当前页数 较 第一页 》 5
    if(current.value < 6){
        init()
    }else if(current.value >= totalPage.value - 6){
        prvDot.value = true;
        for(let i = totalPage.value - 7; i <= totalPage.value ; i++){
            pageList.value.push(i)
        }
    }else{
        prvDot.value = true;
        nxtDor.value = true;
        for(let i = current.value - 3; i <= current.value + 3 ; i++){
            pageList.value.push(i)
        }
    }
    
}
</script>

<style lang="scss" scoped>
.music-pagination{
    width: 100%;
    margin: 20px 0;
    text-align: center;
    color: #333;
    .btn{
        margin: 0 1px 0 2px;
        display: inline-block;
        border: 1px solid #ccc;
        border-radius: 2px;
        vertical-align: middle;
    }
    .page-btn{
        height: 24px;
        line-height: 24px;
        color: #333;
        text-align: left;
        padding: 0;
        cursor: pointer;
        background: url('@/assets/images/my-music/button.png') no-repeat;
    }
    .prv-btn{
        width: 47px;
        padding-left: 22px;
        background-position: 0 -560px;
        &:hover{
            background-position: 0 -590px;
        }
    }
    .prv-disabled{
        background-position: 0 -620px;
        color: #cacaca;
        cursor: default;
        &:hover{
            background-position: 0 -620px;
            color: #cacaca;
            cursor: default;
        }
    }
    .nxt-btn{
        width: 57px;
        padding-left: 12px;
        background-position: -75px -560px;
        &:hover{
            background-position: -75px -590px;
        }
    }
    .nxt-disabled{
        background-position: -75px -620px;
        color: #cacaca;
        cursor: default;
        &:hover{
            background-position: -75px -620px;
            color: #cacaca;
            cursor: default;
        }
    }
    .item{
        height: 22px;
        padding: 0 8px;
        background-color: #fff;
        line-height: 22px;
        cursor: pointer;
        &:hover{
            border-color: #666;
        }
    }
    .active-item{
        background: url('@/assets/images/my-music/button.png') no-repeat;
        background-position: 0 -650px;
        border-color: #A2161B;
        color: #fff;
        cursor: default;
        &:hover{
            border-color: #A2161B;
        }
    }
}
</style>