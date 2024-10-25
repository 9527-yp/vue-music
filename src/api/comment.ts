import axios from '@/utils/request.js'
import type { AxiosPromise } from 'axios';


/**
 * @description 获取歌单评论
 * @param param.id  歌单id
 * @param param.offset  偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
 * @returns 
 */

type ParamItem = {
    id: string | number,
    offset: number,
    limit: number
}
export const getSongComment = ({id, offset, limit}: ParamItem): AxiosPromise => {
    const params = {
        timestamp: new Date().getTime(),
        id,
        offset,
        limit
    };

    return axios.request({
        url: '/comment/playlist',
        method: 'get',
        params
    })
}

/**
 * @description 评论
 * @param param.id  对应类型id
 * @param param.content  评论内容
 * @param param.type  资源类型,对应歌曲：0, mv：1,歌单：2, 专辑：3, 电台：4, 视频：5, 动态：6
 * @param param.t  1 发送, 2 回复 0 删除
 * @returns 
 */
type CommentItem = {
    id: string | number,
    content: string,
    type: number
}
export const addComment = ({id, content, type}: CommentItem): AxiosPromise => {
    const params = {
        timestamp: new Date().getTime(),
        id,
        content,
        type,
        t: 1
    };

    return axios.request({
        url: '/comment',
        method: 'get',
        params
    })
}