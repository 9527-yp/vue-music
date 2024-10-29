<template>
    <ul class="comment-ul">
        <li class="hot-item" v-for="(item, index) in list" :key="index">
            <div class="item-header">
                <img class="user-img" :src="item?.user?.avatarUrl" alt="">
            </div>
            <div class="cntwrap">
                <div class="cntwrap-top cntwrap-brk">
                    <span class="user-name text-hov">{{item?.user?.nickname}}</span>
                    <img
                     class="brand-vip"
                     v-if="item?.user?.vipRights?.redplus"
                     :src="item?.user?.vipRights?.redplus?.iconUrl"
                     alt=""
                    >
                    <img
                     class="brand-vip"
                     v-else-if="item?.user?.vipRights?.associator"
                     :src="item?.user?.vipRights?.associator?.iconUrl"
                     alt=""
                    >
                    <span>:</span>
                    <span v-html="item?.content"></span>
                </div>
                <template v-if="item?.beReplied">
                    <div class="cntwrap-center cntwrap-brk" v-for="(i, key) in item?.beReplied" :key="key">
                        <span class="user-name text-hov">{{i?.user?.nickname}}</span>
                        <img
                         class="brand-vip"
                         v-if="i?.user?.vipRights?.redplus"
                         :src="i?.user?.vipRights?.redplus?.iconUrl"
                         alt=""
                          >
                        <img
                         class="brand-vip"
                         v-else-if="i?.user?.vipRights?.associator"
                         :src="i?.user?.vipRights?.associator?.iconUrl"
                         alt=""
                        >
                        <span>:</span>
                        <span v-html="i?.content"></span>
                    </div>
                </template>
                <div class="cntwrap-bottom">
                    <div class="time">{{formatDate(item.time)}}</div>
                    <span class="del" v-if="item?.ipLocation?.userId === userInfo?.profile?.userId">
                        <span class="review text-hov" @click="handelDeleteComment(item.commentId)">删除</span>
                        <span class="line">|</span>
                    </span>
                    <span class="give text-hov" @click="handelLikeComment(item)">
                        <i class="icn" :class="item.liked ? 'like-icn' : 'no-like-icn'"></i>
                        <template v-if="item.likedCount">
                            ({{item.likedCount}})
                        </template>
                    </span>
                    <span class="line">|</span>
                    <span class="review text-hov" @click="commentBtn(item)">回复</span>
                </div>
                <div class="comment-reply" v-if="item?.commentText">
                    <div class="comment-content">
                        <Cmmtipt
                          @publish="publish"
                          :isRecover="true"
                          :t="t"
                          :id="id"
                          :type="type"
                          :commentId="item.commentId"
                        />
                        <div class="comment-corr">
                            <span class="arrline">◆</span>
                            <span class="arrclr">◆</span>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    </ul>
    <Dialog 
      :visible="deleteCommentDialog"
      :confirmtext="'确定'"
      :canceltext="'取消'"
      showConfirmButton
      showCancelButton
      @confirm='deleteConfirm'
      @cancel='deleteCancel'
    >
    <p class="content-text">确定删除评论？</p>
    </Dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Cmmtipt from '../cmmtipt/Cmmtipt.vue'
import Dialog from '@/components/dialog/dialog.vue';
import useUserStore from '@/stores/modules/user.ts';
import type { ResponseType } from '@/types/index';
import { deleteComment, likeComment } from '@/api/comment.ts';
import { formatDate } from '@/utils/utils.ts';

const userStore = useUserStore();
const userInfo = computed(() => userStore.getUserInfo)
const emit = defineEmits(['recoverComment'])

const props = defineProps({
    list: {
        type: Array,
        default: []
    },
    id: { // 对应类型id
        type: Number || String,
        default: 0
    },
    type: { // 资源类型,对应歌曲：0, mv：1,歌单：2, 专辑：3, 电台：4, 视频：5, 动态：6
        type: Number,
        default: 0
    },
    t: {
        type: String,
        default: 1
    }
})

// 删除弹框操作
const deleteCommentDialog = ref<boolean>(false);
const commentId = ref(undefined);
function deleteConfirm() {
    deleteComment({
        id: props.id,
        type: props.type,
        commentId: commentId.value
    }).then((res: ResponseType) => {
        if(res.code === 200) {
            deleteCommentDialog.value = false;
            emit('recoverComment')
        }
    })
}
function deleteCancel() {
    deleteCommentDialog.value = false;
}

// 点赞
function handelLikeComment(item) {
    const param = {
        id: props.id,
        type: props.type,
        cid: item.commentId,
        t: item.liked ? 0 : 1
    }
    likeComment(param).then( (res: ResponseType) => {
        if(res.code === 200) {
            emit('recoverComment')
        }
    })
}

function commentBtn(item) {
    item.commentText = !item.commentText
}

// 删除评论
function handelDeleteComment(id: number | string) {
    commentId.value = id;
    deleteCommentDialog.value = true;
    
}

function publish() {
    emit('recoverComment')
}
</script>
<style lang="scss" scoped>
.hot-item{
    padding: 15px 0;
    border-top: 1px dotted #ccc;
    .item-header{
        float: left;
        width: 50px;
        height: 50px;
        cursor: pointer;
        .user-img{
            width: 50px;
            height: 50px;
            vertical-align: middle;
        }
    }
    .cntwrap{
        margin-left: 60px;
        .cntwrap-brk{
            .user-name{
                margin-right: 5px;
                color: #0c73c2;
                cursor: pointer;
            }
            .brand-vip{
                height: 12px;
                margin-right: 5px;
                vertical-align: -1px;
            }
        }
        .cntwrap-top{
            width: 100%;
            overflow: hidden;
            line-height: 20px;
            color: #333;
        }
        .cntwrap-center{
            padding: 8px 19px;
            margin-top: 10px;
            line-height: 20px;
            background: #f4f4f4;
            border: 1px solid #dedede;
            color: #666;
        }
        .cntwrap-bottom{
            margin-top: 15px;
            text-align: right;
            .time{
                float: left;
                margin: 0 !important;
                color: #999;
            }
            .del{
                display: none;
            }
            .give{
                cursor: pointer;
                color: #333;
                .icn{
                    margin-right: 5px;
                    vertical-align: -2px;
                    margin-top: -4px;
                    width: 15px;
                    height: 14px;
                    display: inline-block;
                    overflow: hidden;
                    background: url('@/assets/images/icon2.png') no-repeat;
                }
                .like-icn{
                    background-position: -170px 0;
                }
                .no-like-icn{
                    background-position: -150px 0;
                }
            }
            .line{
                margin: 0 8px;
                color: #ccc;
            }
            .review{
                color: #666;
            }
        }
        .comment-reply{
            margin-bottom: 15px;
            margin-top: 10px;
            border: 1px solid #d9d9d9;
            border-radius: 2px;
            position: relative;
            .comment-content{
                padding: 15px;
                background: #f8f8f8;
                border: 1px solid #fcfcfc;
                border-radius: 2px;
                .comment-corr{
                    position: absolute;
                    top: -8px;
                    right: 5px;
                    width: 14px;
                    height: 14px;
                    overflow: hidden;
                    .arrline{
                        display: block;
                        font-family: "SimSun";
                        font-size: 15px;
                        font-style: normal;
                        font-weight: normal;
                        height: 10px;
                        line-height: normal;
                        color: #d9d9d9;
                    }
                    .arrclr{
                        display: block;
                        font-family: "SimSun";
                        font-size: 15px;
                        font-style: normal;
                        font-weight: normal;
                        height: 10px;
                        line-height: normal;
                        margin: -9px 0 0;
                        color: #f8f8f8;
                    }
                }
            }
        }
    }
    &:hover{
        .del{
            display: inline-block !important;
        }
    }
}
</style>