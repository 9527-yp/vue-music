<template>
    <div class="sub-menu">
      <div class="sub-menu-warp">
        <ul class="nav">
          <li class="item active-item">
            <span class="link">推荐</span>
          </li>
          <li class="item">
            <span class="link">排行榜</span>
          </li>
          <li class="item">
            <span class="link">歌单</span>
          </li>
          <li class="item">
            <span class="link">主播电台</span>
          </li>
          <li class="item">
            <span class="link">歌手</span>
          </li>
          <li class="item">
            <span class="link">新碟上架</span>
          </li>
        </ul>
      </div>
    </div>
</template>

<style lang="scss" scoped>
.sub-menu{
    position: relative;
    min-height: 5px;
    box-sizing: border-box;
    background-color: #c20c0c;
    border-bottom: 1px solid #a40011;
    .sub-menu-warp{
      position: relative;
      height: 34px;
      .nav{
        position: absolute;
        left: calc(50% - 365px);
        .item{
          position: relative;
          display: inline-block;
          height: 34px;
          min-width: 84px;
          line-height: 34px;
          text-align: center;
          cursor: pointer;
          .link{
            padding: 3px 13px 4px;
            margin: 0 20px 0 14px;
            color: #fff;
            border-radius: 20px;
            &:hover{
              background: #9b0909;
            }
          }
        }
        .active-item{
          .link{
            background: #9b0909;
          }
        }
      }
    }
  }
</style>