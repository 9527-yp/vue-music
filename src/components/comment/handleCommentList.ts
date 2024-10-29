import { replaceEmojiWithImage } from '@/utils/replaceEmojiWithImage.ts'
import type { ResponseType } from '@/types/index';

type List = {
    commentText: boolean;
    content: string;
    beReplied: Record<string, { content: string }>;
    liked: boolean;
    likedCount: number;
};
export function handleCommentList (res: ResponseType) : ResponseType {
    
    // 精彩评论
    if(res.hotComments) {
        res.hotComments.forEach((item: List) => {
            item.commentText = false;
            item.content = replaceEmojiWithImage(item.content);

            // 他人回复进行转换
            if(item.beReplied[0]){
                item.beReplied[0].content = replaceEmojiWithImage(item.beReplied[0].content);
            }
        })
    }

    // 最新评论
    if(res.comments) {
        res.comments.forEach((item: List) => {
            item.commentText = false;
            item.content = replaceEmojiWithImage(item.content);

            // 他人回复进行转换
            if(item.beReplied[0]){
                item.beReplied[0].content = replaceEmojiWithImage(item.beReplied[0].content);
            }
        })
    }

    return res;
}