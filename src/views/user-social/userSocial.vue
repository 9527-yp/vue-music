<template>
    <div class="user-home">
        <div class="user-box">
            <UserInfo
              :userInfoData="userInfoData"
              :level="level"
              :provinceName="provinceName"
              :cityName="cityName"
              :isTwoTo="true"
            />
            <div class="ranking-title">
                <h3 class="title song-list">我的动态（{{dynamicList.length}}）</h3>
            </div>
            <div class="social">
                
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import UserInfo from '@/views/user-home/user-info/UserInfo.vue';
import { userInfo } from '@/api/login.ts';
import { getDynamic } from '@/api/user-social.ts';
import findCityZipCode from '@/views/user-home/city.ts';
import { useRoute } from 'vue-router';

const route = useRoute();


const userInfoData = ref({});
const level = ref(0); // 等级
const provinceName = ref(''); // 省
const cityName = ref(''); // 市
function getUserInfo() {
    userInfo({uid: route?.query?.id}).then((res:ResponseType) => {
        if(res.code === 200) {
            userInfoData.value = res?.profile;
            level.value = res?.level
            if(res?.profile?.province){
                provinceName.value = findCityZipCode(res?.profile?.province);
                cityName.value = findCityZipCode(res?.profile?.city);
            }
        }
    })
}
getUserInfo();

type DynamicItem = {

}
const dynamicList = ref<DynamicItem[]>([]);
function Dynamic() {
    getDynamic({
        uid: route?.query?.id,
        limit: 30,
        lasttime: -1
    }).then((res: ResponseType) => {
        if(res.code === 200) {
            dynamicList.value = res?.events ?? []
        }
    })
}
Dynamic();

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
        .ranking-title{
            position: relative;
            z-index: 2;
            zoom: 1;
            height: 33px;
            border-bottom: 2px solid #c20c0c;
            .title{
                font-size: 20px;
                line-height: 28px;
                font-weight: normal;
                color: #666;
                font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
                float: left;
            }
            .song-list{
                color: #333;
            }
        }
    }
}
.social{
    width: 100%;
    border: none;
    min-height: 700px;
    margin: 0 auto;
}
</style>