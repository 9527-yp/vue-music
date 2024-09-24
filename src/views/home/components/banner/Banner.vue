<template>
    <div class="home-banner"
      ref="bannerRef"
      @mouseenter="bannerEnter"
      @mouseleave="bannerLeave">
        <div class="b-wrap">
            <div class="b-content">
                <div class="b-img">
                    <template v-for="(item, _index) in banner?.list" :key="_index">
                        <img 
                          class="img" 
                          v-show="item?.imageUrl === banner?.currentUrl" 
                          :src="item.imageUrl" 
                          :class="{'switching-img' : bannerImgSwitching && item?.imageUrl === banner?.currentUrl}" 
                          alt="">
                    </template>
                </div>
                <button class="b-btn b-btn-left" @click="bannerPrev" @mouseenter="bannerEnter"></button>
                <button class="b-btn b-btn-right" @click="bannerNext" @mouseenter="bannerEnter"></button>
            </div>
            <ul class="warp-dots">
                <li v-for="(item, _index) in banner?.list" :key="_index" class="dots-item"
                  :class="banner?.index == _index ? 'dots-active-item' : ''"
                  @click="dotBtn(_index)">
                </li>
            </ul>
            <div class="download">
                <div class="downLink"></div>
                <p class="down-text">PC 安卓 iPhone WP iPad Mac 六大客户端</p>
                <span class="shadow"></span>
                <span class="shadowr"></span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { bannerImgUrl } from '@/api/home.ts';
import type { ResponseType } from '@/types/index';

import { reactive, ref, watch, onUnmounted } from 'vue';

type Banner = {
  list: BannerItem[];
  currentUrl: string;
  index: number;
};

type BannerItem = {
  imageUrl: string;
//   targetType: number;
//   targetId: number;
//   url: string;
};

const banner = reactive<Banner>({
  list: [],
  currentUrl: '',
  index: 0
});

function getbannerList() {
  bannerImgUrl()
    .then((res: ResponseType) => {
      if (res.code === 200) {
        if (res.banners.length > 0) {
          banner.list = res.banners;
          banner.currentUrl = res.banners[0].imageUrl;

          autoBanner();
        }
      }
    })
    .catch(() => ({}));
}
getbannerList()
// 监听轮播图片切换
const bannerRef = ref<HTMLElement>();
watch(
    () => banner.currentUrl,
    () => {
        if (!banner.currentUrl) {
        return;
        }

        // 修复切换背景图时出现的 白色闪屏 现象
        const img = new Image();
        img.src = `${banner.currentUrl}?imageView&blur=40x20`;
        img.onload = function () {
        const bannerDom = bannerRef.value as HTMLElement;
        if (bannerDom) {
            bannerDom.style.backgroundImage = `url(${banner.currentUrl}?imageView&blur=40x20)`;
            bannerDom.style.backgroundSize = '6000px';
            bannerDom.style.backgroundPosition = 'center center';
        }
        };
    },
    { immediate: true }
);

// 上一张
function bannerPrev(): boolean | undefined {
    if(banner.list.length === 0) {
        return ;
    }
    if(banner.index === 0) {
        banner.index = banner.list.length - 1;
    }else{
        banner.index--;
    }
    banner.currentUrl = banner.list[banner.index].imageUrl;
}

// 下一张
function bannerNext(): boolean | undefined {
    if(banner.list.length === 0) {
        return ;
    }
    if(banner.index === banner.list.length - 1) {
        banner.index = 0;
    }else{
        banner.index++;
    }
    banner.currentUrl = banner.list[banner.index].imageUrl;
}

function dotBtn(index:number): boolean | undefined {
    if(banner.list.length === 0) {
        return ;
    }
    banner.index = index;
    banner.currentUrl = banner.list[banner.index].imageUrl;
}

// 轮播区域鼠标移入
function bannerEnter(): void {
    timer.value && clearInterval(timer.value)
}

// 轮播区域鼠标移出
function bannerLeave(): void {
  autoBanner();
}

// 图片是否在切换中
const bannerImgSwitching = ref(false);

// 自动轮播
const timer = ref<NodeJS.Timeout | null>(null);

function autoBanner(): boolean | undefined {
  if (banner.list.length === 0) {
    return;
  }
  timer.value && clearInterval(timer.value);

  timer.value = setInterval(() => {
    // 图片切换增加动画, 1s后清除动画并显示下一张图片
    bannerImgSwitching.value = true;
    if (banner.index === banner.list.length - 1) {
      banner.index = 0;
    } else {
      banner.index++;
    }
    setTimeout(() => {
      bannerImgSwitching.value = false;
      banner.currentUrl = banner.list[banner.index].imageUrl;
    }, 1000);
  }, 4000);
}

onUnmounted(() => {
  timer.value && clearInterval(timer.value);
});
</script>

<style lang="scss" scoped>
.home-banner{
    width: 100%;
    height: 285px;
    overflow: hidden;
    .b-wrap{
        position: relative;
        width: 982px;
        height: 285px;
        margin: 0 auto;
        .b-content{
            width: 730px;
            height: 285px;
            .b-img{
                width: 100%;
                height: 285px;
                cursor: pointer;
                overflow: hidden;
                .img {
                    display: inline-block;
                    width: 730px;
                    height: 100%;
                    transition: none .2s ease 0s;
                    opacity: 1;
                }
                .switching-img {
                    transition: opacity 1s ease-in 0s;
                    opacity: .2;
                }
            }
            .b-btn{
                position: absolute;
                top: 50%;
                display: block;
                width: 37px;
                height: 63px;
                margin-top: -31px;
                border: none;
                outline: none;
                cursor: pointer;
            }
            .b-btn-left{
                left: -68px;
                background: url('@/assets/images/home/banner/banner-btn-left.png');
                background-position: 0 -378px;
                &:hover{
                    background: url('@/assets/images/home/banner/banner-btn-left-hover.png');
                }
            }
            .b-btn-right{
                right: -68px;
                background: url('@/assets/images/home/banner/banner-btn-right.png');
                background-position: 0 -378px;
                &:hover{
                    background: url('@/assets/images/home/banner/banner-btn-right-hover.png');
                }
            }
        }
        .warp-dots{
            position: absolute;
            top: 259px;
            left: 0;
            width: 730px;
            height: 20px;
            text-align: center;
            .dots-item{
                display: inline-block;
                width: 20px;
                height: 20px;
                cursor: pointer;
                background: url('@/assets/images/home/banner/banner-dot.png');
                background-position: 0 -340px;
                &:hover {
                    background: url('@/assets/images/home/banner/banner-dot-hover.png');
                    background-position: 0 -340px;
                }
            }
            .dots-active-item{
                background: url('@/assets/images/home/banner/banner-dot-hover.png');
                background-position: 0 -340px;
            }
        }
        .download{
            position: absolute;
            top: 0;
            right: -4px;
            z-index: 9;
            width: 256px;
            height: 285px;
            background: url('@/assets/images/home/banner/download.png') no-repeat 0 0;
            .downLink{
                position: relative;
                display: block;
                width: 215px;
                height: 56px;
                margin: 186px 0 0 19px;
                background-position: 0 9999px;
                text-indent: -9999px;
                .link {
                    position: absolute;
                    top: 0;
                    left: 0;
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                }
            }
            .down-text{
                margin: 10px auto;
                text-align: center;
                color: #8d8d8d;
            }
            .shadow{
                position: absolute;
                top: 0;
                left: -20px;
                display: block;
                width: 20px;
                height: 265px;
                background: url('@/assets/image/home/banner/banner-download-shadow.png');
                background-position: -1px 0;
            }
            .shadowr {
                position: absolute;
                top: 0;
                right: -18px;
                left: auto;
                display: block;
                width: 20px;
                height: 285px;
                background: url('@/assets/image/home/banner/banner-download-shadow.png');
                background-position: -20px 0;
            }
        }
    }
}
</style>