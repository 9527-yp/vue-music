import axios from '@/utils/request.js'
import type { AxiosPromise } from 'axios';


/**
 * @description 获取歌手详情
 * @param id 歌手id
 */
export const getSingerDetail = ({id}: {id: number|string}): AxiosPromise => {
    const params = {
        timestamp: new Date().getTime(),
        id
    };

    return axios.request({
        url: '/artist/detail',
        method: 'get',
        params
    })
}

/**
 * @description 获取歌手单曲
 * @param id 歌手id
 */
export const getplayList = ({id}: {id: number|string}): AxiosPromise => {
    const params = {
        timestamp: new Date().getTime(),
        id
    };

    return axios.request({
        url: '/artists',
        method: 'get',
        params
    })
}


/**
 * @description 获取相似歌手
 * @param id 歌手id
 */
export const getSimi = ({id}: {id: number|string}): AxiosPromise => {
    const params = {
        timestamp: new Date().getTime(),
        id,
        offset: 0,
        limit: 6
    };

    return axios.request({
        url: '/simi/artist',
        method: 'get',
        params
    })
}