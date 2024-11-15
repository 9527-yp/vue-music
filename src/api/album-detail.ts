import axios from '@/utils/request.js'
import type { AxiosPromise } from 'axios';


/**
 * @description 获取专辑详情
 * @param id 专辑id
 */
export const getAlbumDetail = ({id}: {id: number|string}): AxiosPromise => {
    const params = {
        timestamp: new Date().getTime(),
        id
    };

    return axios.request({
        url: '/album',
        method: 'get',
        params
    })
}


type MusicItem = {
    id: number|string,
    limit: number,
    offset: number
}
/**
 * @description 获取专辑评论
 * @param id 歌曲id
 */
export const getComment = ({id, limit, offset}: MusicItem): AxiosPromise => {
    const params = {
        timestamp: new Date().getTime(),
        id,
        limit,
        offset
    };

    return axios.request({
        url: '/comment/album',
        method: 'get',
        params
    })
}