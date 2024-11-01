<template>
    <!-- 新建歌单 -->
    <Dialog 
      :visible="addSongListShow"
      title="新建歌单"
      :confirmtext="'新建'"
      :canceltext="'取消'"
      showConfirmButton
      showCancelButton
      @confirm='addSongConfirm'
      @cancel='addSongCancel'
    >
        <template #content>
            <p>歌单名： <input v-model="songName" class="add-song-input" type="text"></p>
            <div class="input-warning">
                <div v-show="regexShow">
                    <i class="warning-icn"></i>
                    {{ regexText }}
                </div>
            </div>
            <div class="song-tip">可通过“收藏”将音乐添加到新歌单中</div>
        </template>
    </Dialog>
    <div class="warning-tip" v-if="warningInfo.visible">
        <i v-if="warningInfo.type" class="success-icn"></i>
        <i v-else class="warning-icn"></i>
        <span class="text">{{warningInfo.text}}</span>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive }from 'vue';
import Dialog from '@/components/dialog/dialog.vue';
import useDialogStore from '@/stores/modules/dialog.ts'
import { addSong } from '@/api/my-music.ts';
import type { ResponseType } from '@/types/index';

const dialogStore = useDialogStore();

const addSongListShow = computed(() => dialogStore.getAddSongListShow);

const songName = ref('');
const regexText = ref('');
const regexShow = ref(false);
const warningInfo = reactive({
    text: '',
    visible: false,
    type:0, // 0:警告 ，1：成功
    time: null
})

function addSongConfirm() {
    if(regexShow.value || songName.value === ''){
        return;
    }
    addSong({name: songName.value}).then((res: ResponseType) => {
        if(res.code === 200) {
            warningInfo.type = 1;
            warningInfo.text = '歌单创建成功';
            warningInfo.visible = true;
            warningInfo.time && clearTimeout( warningInfo.time);
            warningInfo.time = setTimeout(() => {
                warningInfo.visible = false;
            }, 1500);
        }
    })
}

// 关闭
function addSongCancel() {
    dialogStore.setAddSongListShow(false);
}

watch(() => songName.value, (newValue) => {
    const invalidCharsRegex = /[@#]/;
    let regex =  invalidCharsRegex.test(newValue)
    if(regex){
        regexText.value = '歌单名不能包含字符“@”和“#”！'
        regexShow.value = true;
    }else if(songName.value.length > 20){
        regexText.value = '歌单名不能超过20个字符'
        regexShow.value = true;
    }
    else{
        regexShow.value = false;
    }
})
</script>

<style lang="scss" scoped>
.add-song-input{
    vertical-align: middle;
    width: 330px;
    height: 19px;
    margin: 0;
    padding: 5px 6px 6px;
    border: 1px solid #cdcdcd;
    border-radius: 2px;
    line-height: 19px;
    box-sizing: content-box;
    font-size: 12px;
    color: #333;
    &:focus{
        outline: none;
    }
}
.input-warning{
    text-align: left;
    margin-left: 90px;
    height: 17px;
    margin-top: 5px;
    line-height: 17px;
    color: #e33232;
    .warning-icn{
        margin-right: 8px;
        width: 14px;
        height: 14px;
        display: inline-block;
        overflow: hidden;
        vertical-align: middle;
        background: url('@/assets/images/icon.png') no-repeat 0 9999px;
        background-position: -50px -270px;
    }
}
.song-tip{
    text-align: left;
    margin: 8px 0 20px 90px;
    color: #999;
}
.warning-tip{
    width: 280px;
    background: #fff;
    color: #333;
    line-height: 52px;
    text-align: center;
    border: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    position: absolute;
    top:50%;
    left: 50%;
    z-index: 20002;
    margin-top: -40px;
    margin-left: -140px;
    vertical-align: middle;
    .warning-icn{
        width: 20px;
        height: 20px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 3px;
        background: url('@/assets/images/icon.png') no-repeat;
        background-position: -24px -406px;
    }
    .success-icn{
        width: 20px;
        height: 20px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 3px;
        background: url('@/assets/images/icon.png') no-repeat;
        background-position: -24px -430px;
    }
    .text{
        display: inline-block;
        vertical-align: middle;
    }
}
</style>