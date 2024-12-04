<template>
    <div class="ranking-load">
        <i class="load-icn"></i>
        加载中...
    </div>
</template>


<style lang="scss" scoped>
.ranking-load{
    height: 26px;
    padding: 20px 0;
    text-align: center;
    color: #999;
    .load-icn{
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: 2px;
        vertical-align: middle;
        background: url('@/assets/images/play/loading.gif') no-repeat;
    }
}
</style>