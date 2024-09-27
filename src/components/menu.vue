<template>
    <div class="sub-menu">
      <div class="sub-menu-warp" v-if="menuIndex === 0">
        <ul class="nav">
          <li class="item"
           v-for="(item, index) in subMenuList"
           :key="index"
           :class="subMenuIndex == index ? 'active-item' : ''"
           @click="hanldSubMenu(item, index)">
            <span class="link">{{item?.title}}</span>
          </li>
        </ul>
      </div>
    </div>
</template>

<script setup lang="ts">
  import useUserStore from '@/stores/modules/user.ts';
  import { ref, computed, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();
  const menuIndex = computed<number>(() => userStore.getMenuIndex);
  const subMenuIndex = computed<number>(() => userStore.getSubMenuIndex);

  type SubMenuItem = {
    title: string,
    path: string
  };
  const subMenuList = ref<SubMenuItem[]>([
    {
      title: '推荐',
      path: '/'
    },
    {
      title: '排行榜',
      path: '/'
    },
    {
      title: '歌单',
      path: '/'
    },
    {
      title: '主播电台',
      path: '/'
    },
    {
      title: '歌手',
      path: '/'
    },
    {
      title: '新碟上架',
      path: '/'
    },
  ]);

  // 切换
  function hanldSubMenu(item: SubMenuItem, index: number) {
    userStore.setSubMenuIndex(index)
  }

  // 监听路由变化，修改选中菜单
  watch(() => route.path,
    (path) => {
      let index = subMenuList.value.findIndex(item => item.path == path )
      if(index !== -1){
        userStore.setSubMenuIndex(index);
      }
    },{immediate: true}
  )
</script>

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