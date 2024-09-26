<template>
  <div class="user-suspension">
    <ul class="f-cb">
      <li class="item" v-for="(item, index) in menu1" :key="index">
        <i :class="`icn ${item?.icon}`"></i>
        <span class="f-text">{{ item.title }}</span>
        <span v-show="item.icon === 'message'" class="m-topmsg">{{msgCode}}</span>
      </li>
    </ul>
    <ul class="f-cb ltb">
      <li class="item" v-for="(item, _index) in menu2" :key="_index">
        <i :class="`icn ${item?.icon}`"></i>
        <a v-if="item?.href" class="link" target="_blank" :href="item?.href">{{ item.title }}</a>
        <span class="f-text" v-else>{{ item.title }}</span>
      </li>
    </ul>
    <ul class="f-cb">
      <li class="item" @click="loginout">
        <i class="icn logout"></i>
        <span class="f-text">退出</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { logout } from '@/api/login.ts'
import useUserStore from '@/stores/modules/user.ts'

// 用户信息数据
const userStore = useUserStore()

defineProps({
  msgCode: {
    type: Number,
    default: 0
  }
});

// 退出登录
function loginout() {
  logout().then( (res: ResponseType) => {
    if(res?.code === 200) {
      console.log('退出登录了')
      userStore.setLogout();
    }
  })
}

const menu1 = ref([
  {
    title: "我的主页",
    link: "/user-profile",
    icon: "homepage"
  },
  {
    title: "我的消息",
    link: "",
    icon: "message"
  },
  {
    title: "我的等级",
    link: "/level",
    icon: "grade"
  },
  {
    title: "VIP会员",
    link: "/member",
    icon: "member"
  }
]);
const menu2 = ref([
  {
    title: "个人设置",
    link: "",
    icon: "setting"
  },
  {
    title: "实名认证",
    href:
      "https://music.163.com/st/userbasic/?module=st%2Fuserbasic%2F#/nameverify",
    icon: "real-name"
  }
]);
</script>

<style lang="scss" scoped>
@import url("./user.scss");
</style>