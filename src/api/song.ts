import axios from '@/utils/request.js'
import type { AxiosPromise } from 'axios';


/**
 * @description 获取歌词
 * @param id 歌曲id
 */
export const getLyric = ({id}: {id: number|string}): AxiosPromise => {
    const params = {
        timestamp: new Date().getTime(),
        id
    };

    return axios.request({
        url: '/lyric',
        method: 'get',
        params
    })
}

/**
 * @description 获取歌曲详情
 * @param id 歌曲id
 */
export const getDetail = ({ids}: {ids: number|string}): AxiosPromise => {
    const params = {
        timestamp: new Date().getTime(),
        ids
    };

    return axios.request({
        url: '/song/detail',
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
 * @description 获取歌曲评论
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
        url: '/comment/music',
        method: 'get',
        params
    })
}