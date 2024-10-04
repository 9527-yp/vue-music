<template>
    <div class="content">
        <div class="item-content-box">
            <div class="item-c-h">
                <div class="h-title">热门推荐</div>
                <div class="h-tab">
                    <span class="tab-text text-hov">华语</span>
                    <span class="line">|</span>
                    <span class="tab-text text-hov">流行</span>
                    <span class="line">|</span>
                    <span class="tab-text text-hov">摇滚</span>
                    <span class="line">|</span>
                    <span class="tab-text text-hov">民谣</span>
                    <span class="line">|</span>
                    <span class="tab-text text-hov">电子</span>
                </div>
                <div class="more">
                    <span class="tab-text text-hov">更多</span>
                    <i class="move-icn"></i>
                </div>
            </div>
            <!-- 未登录展示5条推荐歌单，登录后，后3条替换未个性化推荐 -->
            <ul class="list-content">
                <li class="item"
                 v-for="(item,_index) in hotRecommend"
                 :key="item.id"
                 :class="_index % 4 === 3 ? 'last-item' : ''">
                    <div class="item-img-box">
                        <img class="item-img" :src="item?.picUrl" alt="">
                        <div class="info">
                            <i class="info-icn"></i>
                            <span class="num">{{item?.playCount}}</span>
                            <i class="info-icon-right" title="播放"></i>
                        </div>
                    </div>
                    <div class="item-bottom text-hov">
                        {{item?.name}}
                    </div>
                </li>
                <!-- 登录后展示个性化推荐 -->
                <template v-if="isLogin">
                    <li class="item"
                    v-for="(item,_index) in individualizat.slice(0,3)"
                    :key="item.id"
                    :class="_index === 1 ? 'last-item' : ''">
                        <div class="item-img-box">
                            <img class="item-img" :src="item?.picUrl" alt="">
                            <div class="info">
                                <i class="info-icn"></i>
                                <span class="num">{{item?.playCount}}</span>
                                <i class="info-icon-right" title="播放"></i>
                            </div>
                        </div>
                        <div class="item-bottom text-hov">
                            {{item?.name}}
                        </div>
                    </li>
                </template>
                <!-- 推荐电台 -->
                <li class="item"
                 v-for="(item,_index) in hotDjprogram"
                 :key="item.id"
                 :class="_index === 2 ? 'last-item' : ''">
                    <div class="item-img-box">
                        <img class="item-img" :src="item?.picUrl" alt="">
                        <div class="info">
                            <i class="info-icn"></i>
                            <span class="num">{{item?.program?.adjustedPlayCount}}</span>
                            <i class="info-icon-right" title="播放"></i>
                        </div>
                    </div>
                    <div class="item-bottom text-hov">
                        <i class="radio-station"></i>
                        {{item?.name}}
                    </div>
                </li>
            </ul>
        </div>
        <!-- 个性化推荐 -->
        <div class="item-content-box">
            <div class="item-c-h">
                <div class="h-title">个性化推荐</div>
            </div>
            <ul class="list-content">
                <li class="item">
                    <div class="item-img-box">
                        <i class="individuation-img" ></i>
                        <span class="head">{{ getCurrentWeekday() }}</span>
                        <span class="head-text">{{ getDate() }}</span>
                        <span class="head-mask"></span>
                    </div>
                    <div class="item-bottom text-hov">
                        每日歌曲推荐
                    </div>
                    <em class="item-lick" title="根据你的口味生成,每天6:00更新"> 根据你的口味生成,每天6:00更新 </em>
                </li>
                <!-- 登录后展示个性化推荐 -->
                <li class="item"
                  v-for="(item,_index) in individualizat.slice(0,3)"
                  :key="item.id"
                  :class="_index === 1 ? 'last-item' : ''">
                    <div class="item-img-box">
                        <img class="item-img" :src="item?.picUrl" alt="">
                        <div class="info">
                            <i class="info-icn"></i>
                            <span class="num">{{item?.playCount}}</span>
                            <i class="info-icon-right" title="播放"></i>
                        </div>
                    </div>
                    <div class="item-bottom text-hov">
                        {{item?.name}}
                    </div>
                </li>
            </ul>
        </div>
        <!-- 新碟上架 -->
        <AlbumNewest />
        <!-- 榜单 -->
        <div class="item-content-box">
            <div class="item-c-h">
                <div class="h-title">榜单</div>
                <div class="more">
                    <span class="tab-text text-hov">更多</span>
                    <i class="move-icn"></i>
                </div>
            </div>
            <Bilst />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, watch } from 'vue';
    import { recommendSongList, recommendResource, recommendDjprogram } from '@/api/home.ts'
    import type { ResponseType } from '@/types/index';
    import type { SongType } from '@/types/home.ts';
    import useUserStore from '@/stores/modules/user.ts'
    import { getBigNumberTransform, getCurrentWeekday, getDate } from '@/utils/utils.ts';
    import AlbumNewest from '../albumNewest/AlbumNewest.vue'
    import Bilst from '../bilst/Bilst.vue'

    const userStore = useUserStore();

    // 是否登录
    const isLogin = computed<boolean>(() => userStore.getIsLogin)

    
    watch(() => isLogin.value,
        (value) => {
            console.log(value, "value")
            if (!value) {
                return;
            }
            getHotRecommend();
            getIndividualizat();
        }
    )

    type hotRecommendItem = {
        id: number;
        name: string;
        picUrl: string;
        playCount: number;
        copywriter: string;
    }

    type HotDjprogramItem = {
        id: number,
        name: string,
        picUrl: string,
        program: {
            adjustedPlayCount: number,
            mainSong: SongType
        }
    }

    // 获取热门推荐
    const hotRecommend = ref<hotRecommendItem[]>([])
    function getHotRecommend() {
        // 未登录获取5条, 登录获取2条
        let limit = 0;
        if(isLogin.value){
            limit = 2;
        }else{
            limit = 5;
        }
        recommendSongList({ limit }).then((res: ResponseType) => {
            if(res.code === 200) {
                res?.result.forEach((item: {playCount: string | number}) => {
                    item.playCount = getBigNumberTransform(item.playCount)
                })
                hotRecommend.value = res?.result || []
            }
        })
    }
    getHotRecommend()

    // 获取个性化推荐
    // 获取个性化推荐歌单
    const individualizat = ref<hotRecommendItem[]>([]);
    function getIndividualizat() {
        if(!isLogin.value){
            return ;
        }
        recommendResource().then((res: ResponseType) => {
            if(res.code === 200) {
                res?.recommend.forEach((item: {playCount: string | number}) => {
                    item.playCount = getBigNumberTransform(item.playCount)
                })
                individualizat.value = res?.recommend || []
            }
        })
    }
    getIndividualizat()

    // 获取热门推荐 - 推荐电台节目
    const hotDjprogram = ref<HotDjprogramItem[]>([]);
    function getHotDjprogram() {
        recommendDjprogram().then((res: ResponseType) => {
            if(res.code === 200) {
                res?.result.forEach(
                    (item: Record<string, {adjustedPlayCount: string | number}>) => {
                    item.program.adjustedPlayCount = getBigNumberTransform(item?.program?.adjustedPlayCount);
                })
                hotDjprogram.value = res?.result?.slice(0,3) || [];
            }
        })
    }
    getHotDjprogram()

</script>


<style lang="scss" scoped>
.content{
    padding: 20px 20px 40px;
}
.item-content-box{
    .item-c-h{
        height: 33px;
        padding: 0 10px 0 34px;
        background: url('@/assets/images/home/index.png') no-repeat 0 9999px;
        background-position: -225px -156px;
        border-bottom: 2px solid #C10D0C;
        .h-title{
            float: left;
            font-size: 20px;
            font-weight: normal;
            line-height: 28px;
            cursor: pointer;
        }
        .h-tab{
            float: left;
            margin: 7px 0 0 20px;
            .line{
                margin: 0 10px;
                color: #ccc;
            }
        }
        .tab-text{
            color: #666;
            cursor: pointer;
        }
        .more{
            float: right;
            margin-top: 9px;
            .move-icn{
                display: inline-block;
                width: 12px;
                height: 12px;
                margin-left: 4px;
                vertical-align: middle;
                background: url('@/assets/images/home/index.png') no-repeat 0 9999px;
                background-position: 0 -240px;
            }
        }
    }
    .list-content{
        margin-top: 20px;
        text-align: left;
        .item{
            display: inline-block;
            width: 140px;
            height: 204px;
            margin-right: 42px;
            margin-bottom: 30px;
            vertical-align: middle;
            .item-img-box{
                position: relative;
                width: 140px;
                height: 140px;
                cursor: pointer;
                .item-img{
                    width: 100%;
                    height: 100%;
                    cursor: pointer;
                }
                .individuation-img{
                    display: block;
                    width: 100%;
                    height: 100%;
                    cursor: pointer;
                    background: url('@/assets/images/home/individuation-bag.png') no-repeat 0 9999px;
                    background-position: 0 0;
                    border: none;
                }
                .head{
                    position: absolute;
                    top: 0;
                    left: 50%;
                    display: block;
                    height: 33px;
                    font-size: 14px;
                    line-height: 33px;
                    color: #fed9d9;
                    text-align: center;
                    text-shadow: 0 -1px #962626;
                    transform: translate(-50%);
                }
                .head-text{
                    position: absolute;
                    top: 35px;
                    left: 50%;
                    display: block;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 94px;
                    font-weight: 700;
                    line-height: 102px;
                    color: #202020;
                    text-align: center;
                    transform: translate(-50%);
                }
                .head-mask{
                    position: absolute;
                    top: 33px;
                    left: 0;
                    width: 140px;
                    height: 107px;
                    background: url('@/assets/images/home/individuation-bag.png') no-repeat 0 9999px;
                    background-position: 0 -150px;
                }
                .info{
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    z-index: 1;
                    width: 100%;
                    height: 27px;
                    color: #ccc;
                    cursor: auto;
                    background: url('@/assets/images/home/name-D5CGUEo8.png') no-repeat 0 9999px;
                    background-position: 0 -537px;
                    .info-icn{
                        position: absolute;
                        bottom: 8px;
                        left: 0;
                        width: 14px;
                        height: 11px;
                        margin: 0 5px 0 10px;
                        background: url('@/assets/images/home/name-Db6Jvh02.png') no-repeat 0 9999px;
                        background-position: 0 -24px;
                    }
                    .num{
                        position: absolute;
                        bottom: 6px;
                        left: 30px;
                        display: inline-block;
                        vertical-align: middle;
                    }
                    .info-icon-right{
                        position: absolute;
                        right: 10px;
                        bottom: 5px;
                        z-index: 2;
                        width: 16px;
                        height: 17px;
                        cursor: pointer;
                        background: url('@/assets/images/home/name-Db6Jvh02.png') no-repeat 0 9999px;
                        background-position: 0 0;
                    }
                }
            }
            .item-bottom{
                display: -webkit-box;
                margin: 8px 0 3px;
                overflow: hidden;
                font-size: 14px;
                color: #000;
                text-align: left;
                text-overflow: ellipsis;
                cursor: pointer;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                .radio-station{
                    float: left;
                    width: 35px;
                    height: 18px;
                    margin-top: -3px;
                    margin-right: 8px;
                    background: url('@/assets/images/icon.png') no-repeat 0 9999px;
                    background-position: -31px -655px;
                }
            }
            .item-lick{
                margin-top: 3px;
                font-size: inherit;
                font-style: normal;
                color: #999;
                text-align: left;
            }
        }
        .last-item{
            margin-right: 0px;
        }
    }
}
</style>