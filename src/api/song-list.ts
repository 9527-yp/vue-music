import axios from '@/utils/request.js'
import type { AxiosPromise } from 'axios';


type playListItem = {
    order: string,
    cat: string,
    limit: string | number,
    offset: string | number,
}
/**
 * @description 网友精选碟歌单
 * @param order 可选值为 'new' 和 'hot', 分别对应最新和最热 , 默认为 'hot'
 * @param cat 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部",
 * @param limit 取出歌单数量 , 默认为 50
 * @param offset 偏移数量 , 用于分页
 */
export const getPlayList = ({order, cat, limit, offset}: playListItem): AxiosPromise => {
    const params = {
        timestamp: new Date().getTime(),
        order,
        cat,
        limit,
        offset
    };

    return axios.request({
        url: '/top/playlist',
        method: 'get',
        params
    })
}

/**
 * @description 收藏/取消收藏歌单
 * @param t : 类型,1:收藏,2:取消收藏 id : 歌单 id
 * @param id : 歌单 id
 */
export const collectPlayList = ({t, id}: {t: number|string, id: number|string}): AxiosPromise => {
    const params = {
        timestamp: new Date().getTime(),
        t,
        id
    };

    return axios.request({
        url: '/playlist/subscribe',
        method: 'get',
        params
    })
}