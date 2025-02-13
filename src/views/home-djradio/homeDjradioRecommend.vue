<template>
    <div class="radio-recommend">
        <div class="u-title">
            <h3>
                <span>推荐节目</span>
            </h3>
            <span class="sub">(每日更新)</span>
        </div>
    </div>
</template>


<style lang="scss" scoped>
.radio-recommend{
    width: 980px;
    min-height: 700px;
    margin: 0 auto;
    background-color: #fff;
    border: 1px solid #d3d3d3;
    border-width: 0 1px;
    padding: 40px;
    box-sizing: border-box;
    .u-title{
        height: 40px;
        border-bottom: 2px solid #c20c0c;
        h3{
            float: left;
            font-size: 24px;
            font-weight: normal;
            font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
            color: #333;
        }
        .sub{
            float: left;
            margin: 13px 0 0 10px;
            color: #999;
        }
        &:after{
            clear: both;
            content: '.';
            display: block;
            height: 0;
            visibility: hidden;
        }
    }
}
</style>