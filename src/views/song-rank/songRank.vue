<template>
    <div class="song-rank">
        <div class="song-box">
            <!-- 听歌排行 -->
            <RankingTable
                :recordInfo="recordInfo"
                @tagschange="tagschange"
                :isMore="false"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRoute } from 'vue-router';
import RankingTable from '@/views/user-home/ranking-table/RankingTable.vue';
import type { ResponseType } from '@/types/index';
import { userInfo } from '@/api/login.ts';
import { getRecords } from '@/api/user-home.ts';

const route = useRoute();

type RecordItem = {
    loading: boolean,
    listenSongs: number,
    type: number,
    list: []
}

const recordInfo = reactive<RecordItem>({
    loading: false,
    listenSongs: 0,
    type:0,
    list: []
})

function getUserInfo() {
    userInfo({uid: route?.query?.id}).then((res:ResponseType) => {
        if(res.code === 200) {
            recordInfo.listenSongs = res?.listenSongs
        }
    })
}
getUserInfo();

// 听歌排行
function records() {
    recordInfo.loading = true;
    getRecords({
        uid: route?.query?.id,
        type: recordInfo.type
    }).then((res: ResponseType) => {
        if(res.code === 200) {
            recordInfo.loading = false;
            if(recordInfo.type === 0){
                recordInfo.list = res?.allData
            }else{
                recordInfo.list = res?.weekData
            }
            
        }
    })
}
records()

function tagschange(value: number) {
    recordInfo.type = value;
    records();
}

</script>
<style lang="scss" scoped>
.song-rank{
    width: 980px;
    min-height: 700px;
    margin: 0 auto;
    background-color: #fff;
    border: 1px solid #d3d3d3;
    border-width: 0 1px;
    .song-box{
        padding: 40px;
    }
}
</style>