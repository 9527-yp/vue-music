<template>
    <div class="foot-box">
        <div class="foot-content">
            <ul class="enter">
                <li class="unit"
                v-for="(item, index) in footList"
                :key="index"
                :class="index === 0 ? 'first-unit' : ''">
                    <a 
                    :class="`link ${item.icon}`"
                    :href="item?.href" target="_blank">
                    </a>
                    <span class="text">{{ item?.title }}</span>
                </li>
            </ul>
            <div class="copy">
                <p class="right">
                    <a class="link" href="https://st.music.163.com/official-terms/service" target="_block">服务条款</a>
                    <span class="line">|</span>
                    <a class="link" href="https://st.music.163.com/official-terms/privacy" target="_block">隐私政策</a>
                    <span class="line">|</span>
                    <a class="link" href="https://st.music.163.com/official-terms/children" target="_block">儿童隐私政策</a>
                    <span class="line">|</span>
                    <a class="link" href="https://music.163.com/st/staticdeal/complaints.html" target="_block">版权投诉</a>
                    <span class="line">|</span>
                    <a class="link" href="http://ir.music.163.com" target="_block">投资者关系</a>
                    <span class="line">|</span>
                    <a class="link" href="https://music.163.com/ui/resource" target="_block">广告合作</a>
                    <span class="line">|</span>
                    <a class="link" href="https://mp.music.163.com/600948c936c13f4d09752e73/contact-us-web/index.html?source=Music-Main-Station" target="_block">联系我们</a>
                </p>
                <p class="right">
                    <a class="link mar-r" href="https://jubao.163.com" target="_blank">廉政举报</a>
                    <span class="mar-r">不良信息举报邮箱: 51jubao@service.netease.com</span>
                    <span>客服热线：95163298</span>
                </p>
                <p class="right">
                    <span>互联网宗教信息服务许可证：浙（2022）0000120</span>
                    <span>增值电信业务经营许可证：浙B2-20150198</span>
                    <a class="link link-mar-l" href="https://beian.miit.gov.cn/#/Integrated/index" target="_block">粤B2-20090191-18  工业和信息化部备案管理系统网站
                    </a>
                </p>
                <p class="right">
                    <span class="mar-r">网易公司版权所有©1997-2024</span>
                    <span>杭州乐读科技有限公司运营：</span>
                    <a class="link" 
                     href="https://p6.music.126.net/obj/wonDlsKUwrLClGjCm8Kx/34942157981/2e30/30c1/ad1f/7be053a28e91dd8bafe49bdf6455cb2a.png" 
                     target="_block">浙网文[2024] 0900-042号</a>
                    <a class="link link-mar-l" href="https://music.163.com/ui/resource" target="_block">
                        <span class="police-logo"></span>
                        <span class="police-text">浙公网安备 33010802013307号</span>
                    </a>
                    <a class="link link-mar-l" href="https://music.163.com/ui/resource" target="_block">算法服务公示信息</a>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';

    type footListItem = {
        title: string,
        icon: string,
        href: string,
    }
    const footList = ref<footListItem[]>([
        {
            title: '音乐开放平台',
            icon: 'platform',
            href: 'https://developer.music.163.com/st/developer'
        },
        {
            title: '云村交易所',
            icon: 'trading',
            href: 'https://music.163.com/st/web-sublicense/home'
        },
        {
            title: 'X StudioAI歌手',
            icon: 'StudioAI',
            href: 'https://xstudio.music.163.com'
        },
        {
            title: '用户认证',
            icon: 'authentication',
            href: 'https://music.163.com/st/userbasic#/auth'
        },
        {
            title: 'AI 免费写歌',
            icon: 'writeSong',
            href: 'https://tianyin.music.163.com'
        },
        {
            title: '云推歌',
            icon: 'pushSong',
            href: 'https://music.163.com/st/ad-song'
        },
        {
            title: '赞赏',
            icon: 'appreciate',
            href: 'https://music.163.com/web/reward'
        },
    ])
</script>

<style lang="scss" scoped>
@import url('./footView.scss');
</style>