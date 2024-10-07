<template>
    <div class="home">
        <Banner />
        <div class="home-container">
            <div class="container-content">
                <div>
                    <Content />
                </div>
            </div>
            <div class="container-side">
                <Side />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Banner from './components/banner/Banner.vue'
import Content from './components/content/Content.vue'
import Side from './components/side/Side.vue'
</script>

<style lang="scss" scoped>
.home{
    background-color: #f5f5f5;
}
.home-container{
    width: 980px;
    min-height: 700px;
    margin: 0 auto;
    position: relative;
    background-color: #fff;
    border: 1px solid #d3d3d3;
    border-width: 0 1px;
    background: url('@/assets/images/home/wrap1.png') repeat-y 100% 100%;
    .container-content{
        display: inline-block;
        vertical-align: top;
        width: 730px;
    }
    .container-side{
        display: inline-block;
        width: 250px;
        vertical-align: top;
    }
}
</style>