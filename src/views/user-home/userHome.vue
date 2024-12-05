<template>
    <div class="user-home">
        <div class="user-box">
            <UserInfo
              :userInfoData="userInfoData"
              :level="level"
              :provinceName="provinceName"
              :cityName="cityName"
              @follow="follow"
            />
            <!-- 创建的电台 -->
            <AudioTable :audioList="audioList" />
            <!-- 听歌排行 -->
            <div v-if="songTableShow">
                <RankingTable
                  :recordInfo="recordInfo"
                  @tagschange="tagschange"
                />
            </div>
            <!-- 创建的歌单 -->
            <UserSongList :title="songSheetList?.createdTitle" :list="songSheetList.createdSongSheet" />
            <!-- 收藏的歌单 -->
            <UserSongList :title="songSheetList?.collectTitle" :list="songSheetList.collectSongSheet" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import useUserStore from '@/stores/modules/user.ts';
import findCityZipCode from './city.ts';
import { getSongList } from '@/api/my-music.ts';
import { userInfo } from '@/api/login.ts';
import { getRecords, myAudio } from '@/api/user-home.ts';
import { addFollow } from '@/api/user-social.ts';
import type { ResponseType } from '@/types/index';
import UserInfo from './user-info/UserInfo.vue';
import AudioTable from './audio-table/AudioTable.vue';
import RankingTable from './ranking-table/RankingTable.vue';
import UserSongList from './user-song-list/UserSongList.vue';

const userStore = useUserStore();
const route = useRoute();

const myInfo = computed(() => userStore.getUserInfo)

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

type UserInfo = {
    allAuthTypes?: {
        type: number,
        desc: string,
        tags: string[] | null
    }[]
    nickname: string
}
const userInfoData = ref<UserInfo>({});
const level = ref(0); // 等级
const provinceName = ref(''); // 省
const cityName = ref(''); // 市
function getUserInfo() {
    userInfo({uid: route?.query?.id}).then((res:ResponseType) => {
        if(res.code === 200) {
            userInfoData.value = res?.profile;
            getSongListData();
            getMyAudio();
            let newAuthTypeOther = [
                {
                    type: 200,
                    desc: [],
                    tags: null
                }
            ];
            let newAuthType = [];
            if(userInfoData.value?.allAuthTypes){
                userInfoData.value?.allAuthTypes.forEach((item) => {
                if(item.type >= 200 && item.type < 300){
                    newAuthTypeOther[0].desc.push(item.desc)
                }else if(item.type < 100){
                    newAuthType.unshift(item)
                }
            })
            userInfoData.value.allAuthTypes = [...newAuthType, ...newAuthTypeOther];
            }
            
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
    userId: number,
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
    createdTitle: string,
    createdSongSheet: TypeSongSheetList[],
    collectTitle: string,
    collectSongSheet: TypeSongSheetList[],
}


// 歌单
const songSheetList = reactive<TypeSongSheet>({
    createdTitle: '',
    createdSongSheet: [],
    collectTitle: '',
    collectSongSheet: [],
})
function getSongListData ()  {
    getSongList({uid: route?.query?.id}).then((res: ResponseType) => {
        if(res.code === 200) {
            if(route?.query?.id == myInfo.value?.profile?.userId){
                songSheetList.createdTitle = '我创建的歌单';
                songSheetList.collectTitle = '我收藏的歌单';

                res.playlist?.forEach?.((item: TypeSongSheetList) => {
                    if (item.name?.includes?.('喜欢的音乐')) {
                        item.name = '我喜欢的音乐';
                    }
                });

                // 创建/收藏的歌单
                songSheetList.createdSongSheet = res.playlist?.filter?.(
                    (item: TypeSongSheetList) => !item.subscribed
                );
                songSheetList.collectSongSheet = res.playlist?.filter?.(
                    (item: TypeSongSheetList) => item.subscribed
                );
            }else{
                songSheetList.createdTitle = userInfoData.value.nickname + '创建的歌单';
                songSheetList.collectTitle = userInfoData.value.nickname + '收藏的歌单';
                
                // 创建/收藏的歌单
                songSheetList.createdSongSheet = res.playlist?.filter?.(
                    (item: TypeSongSheetList) => item.userId === Number(route?.query?.id)
                );
                songSheetList.collectSongSheet = res.playlist?.filter?.(
                    (item: TypeSongSheetList) => item.userId !== Number(route?.query?.id)
                );
            }
        }
    })
}

// 创建的电台
const audioList = reactive({
    title: '',
    list: []
})
function getMyAudio () {
    myAudio({uid: route.query.id}).then((res: ResponseType) => {
        if(res.code === 200) {
            if(route?.query?.id == myInfo.value?.profile?.userId){
                audioList.title = '我创建的电台';
            }else{
                audioList.title = userInfoData.value.nickname + '创建的电台';
                
            }

            audioList.list = res.djRadios ?? []
        }
    })
}

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
    }).catch(error => {
        songTableShow.value = false;
        recordInfo.loading = false;
    })
}
records()

function tagschange(value: number) {
    recordInfo.type = value;
    records();
}

function follow(id: number|string) {
    addFollow({id,t: 1}).then((res: ResponseType) => {
        if(res.code === 200) {
            getUserInfo();
        }
    })
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