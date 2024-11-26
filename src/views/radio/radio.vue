<template>
    <div class="radio-detail">
        <div class="radio-content">
            <!-- header部分 -->
            <RadioInfo :radioInfo="radioInfo" :list="djListData" @notFeatureTip="notFeatureTip" />
            <div class="radio-table-box">
                <!-- 音乐列表 -->
                <RadioTable :list="djListData" @tableSore="tableSore" @notFeatureTip="notFeatureTip" />
            </div>
        </div>

        <!-- 右侧部分 -->
        <RadioSide :list="recDjList" />
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import RadioInfo from './radio-info/RadioInfo.vue';
import RadioTable from './radio-table/RadioTable.vue';
import RadioSide from './radio-side/RadioSide.vue';
import type { ResponseType } from '@/types/index';
import { djDetail, djList, djRecommend } from '@/api/radio.ts';
import useDialogStore from '@/stores/modules/dialog.ts';

const route = useRoute();
const dialogStore = useDialogStore();

const radioInfo = ref({});
function getDjDetail() {
    djDetail({rid: route.query.id}).then((res: ResponseType) => {
        if(res.code === 200) {
            radioInfo.value = res?.data ?? {}
        }
    })
}
getDjDetail();

const djListData = ref([]);
const asc = ref(false);
function getDjList() {
    djList({
        rid: route.query.id,
        asc: asc.value
    }).then((res: ResponseType) => {
        if(res.code === 200) {
            djListData.value = res.programs ?? []
        }
    })
}
getDjList();

function tableSore(value: boolean) {
    asc.value = value;
    getDjList();
}

let timer = null;
function notFeatureTip(value: {type: number, text: string}) {
    // 订阅、取消订阅操作，重新调用详情接口刷新数据
    if(value.type === 1){
        getDjDetail();
    }
    dialogStore.setMessage({
        type: value.type,
        text: value.text,
        visible: true,
    })
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
        dialogStore.setMessage({
            type: value.type,
            text: value.text,
            visible: false,
        })
    }, 1500);
}

const recDjList = ref([]);
function getDjRecommend() {
    djRecommend().then((res: ResponseType) => {
        if(res.code === 200) {
            recDjList.value = res?.djRadios.slice(0, 5) ?? []
        }
    })
}
getDjRecommend();

watch(() => route.query.id, () => {
    getDjDetail();
    getDjList();
    getDjRecommend();
})
</script>


<style lang="scss" scoped>
.radio-detail{
    width: 980px;
    min-height: 700px;
    margin: 0 auto;
    background-color: #fff;
    border: 1px solid #d3d3d3;
    border-width: 0 1px;
    background: url('@/assets/images/play-list/wrap4.png');
    .radio-content{
        display: inline-block;
        width: calc(100% - 271px);
        padding: 47px 30px 40px 39px;
        vertical-align: top;
        box-sizing: border-box;
        .radio-table-box{
            margin-top: 27px;
        }
    }
}
</style>