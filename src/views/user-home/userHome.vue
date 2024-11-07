<template>
    <div class="user-home">
        <div class="user-box">
            <UserInfo
              :userInfoData="userInfoData"
              :level="level"
              :provinceName="provinceName"
              :cityName="cityName"
            />
            <!-- 听歌排行 -->
            <template v-show="songTableShow">
                <RankingTable
                  :recordInfo="recordInfo"
                  @tagschange="tagschange"
                />
            </template>
            <!-- 创建的歌单 -->
            <UserSongList title="我创建的歌单" :list="songSheetList.createdSongSheet" />
            <!-- 收藏的歌单 -->
            <UserSongList title="我收藏的歌单" :list="songSheetList.collectSongSheet" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import useUserStore from '@/stores/modules/user.ts';
import findCityZipCode from './city.ts';
import { getSongList } from '@/api/my-music.ts';
import { userInfo } from '@/api/login.ts';
import { getRecords } from '@/api/user-home.ts';
import type { ResponseType } from '@/types/index';
import UserInfo from './user-info/UserInfo.vue';
import RankingTable from './ranking-table/RankingTable.vue';
import UserSongList from './user-song-list/UserSongList.vue';

const userStore = useUserStore();
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
const userInfoData = ref({});
const level = ref(0); // 等级
const provinceName = ref(''); // 省
const cityName = ref(''); // 市
function getUserInfo() {
    userInfo({uid: route?.query?.id}).then((res:ResponseType) => {
        if(res.code === 200) {
            userInfoData.value = res?.profile;
            level.value = res?.level
            recordInfo.listenSongs = res?.listenSongs
            if(res?.profile?.province){
                provinceName.value = findCityZipCode(res?.profile?.province);
                cityName.value = findCityZipCode(res?.profile?.city);
            }
        }
    })
}
getUserInfo();

type TypeSongSheetList = {
    name: string,
    subscribed: boolean,
    id: number,
    coverImgUrl: string,
    trackCount: number,
    creator: {
        nickname: string,
        userId: number,
        avatarUrl: string
    }
}

type TypeSongSheet = {
    createdSongSheet: TypeSongSheetList[],
    collectSongSheet: TypeSongSheetList[],
}


// 歌单
const songSheetList = reactive<TypeSongSheet>({
    createdSongSheet: [],
    collectSongSheet: [],
})
function getSongListData ()  {
    getSongList({uid: route?.query?.id}).then((res: ResponseType) => {
        if(res.code === 200) {
            // 创建/收藏的歌单
            songSheetList.createdSongSheet = res.playlist?.filter?.(
            (item: TypeSongSheetList) => !item.subscribed
            );
            songSheetList.collectSongSheet = res.playlist?.filter?.(
            (item: TypeSongSheetList) => item.subscribed
            );
        }
    })
}
getSongListData()

// 听歌排行
const songTableShow = ref<boolean>(true); //  是否有权限访问
function records() {
    recordInfo.loading = true;
    getRecords({
        uid: route?.query?.id,
        type: recordInfo.type
    }).then((res: ResponseType) => {
        if(res.code === 200) {
            songTableShow.value = true;
            recordInfo.loading = false;
            if(recordInfo.type === 0){
                recordInfo.list = res?.allData.slice(0, 10)
            }else{
                recordInfo.list = res?.weekData.slice(0, 10)
            }
        }else{
            songTableShow.value = false;
            recordInfo.loading = false;
        }
    })
}
records()

function tagschange(value: number) {
    recordInfo.type = value;
    records();
}
onMounted(() => {
    userStore.setMenuIndex(-1);
    userStore.setSubMenuIndex(-1);
});
</script>

<style lang="scss" scoped>
.user-home{
    width: 980px;
    min-height: 700px;
    margin: 0 auto;
    background-color: #fff;
    border: 1px solid #d3d3d3;
    border-width: 0 1px;
    .user-box{
        padding: 40px;
    }
}
</style>