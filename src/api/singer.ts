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


/**
 * @description 收藏、取消收藏歌手
 * @param id 歌手id
 * @param t 1 收藏 0 取消收藏
 */
export const getSubSinger = ({id, t}: {id: number|string, t: number}): AxiosPromise => {
    const params = {
        timestamp: new Date().getTime(),
        id,
        t
    };

    return axios.request({
        url: '/artist/sub',
        method: 'get',
        params
    })
}

type AlbumType = {
    id: number|string,
    limit: number,
    offset: number
}
/**
 * @description 获取歌手专辑
 * @param id 歌手id
 * @param limit 取出数量 , 默认为 30
 * @param offset 偏移数量 , 用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认 为 0
 */
export const getAlbum = ({id, limit, offset}: AlbumType): AxiosPromise => {
    const params = {
        timestamp: new Date().getTime(),
        id,
        limit,
        offset
    };

    return axios.request({
        url: '/artist/album',
        method: 'get',
        params
    })
}

/**
 * @description 获取歌手MV
 * @param id 歌手id
 * @param limit 取出数量 , 默认为 30
 * @param offset 偏移数量 , 用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认 为 0
 */
export const getMV = ({id, limit, offset}: AlbumType): AxiosPromise => {
    const params = {
        timestamp: new Date().getTime(),
        id,
        limit,
        offset
    };

    return axios.request({
        url: '/artist/mv',
        method: 'get',
        params
    })
}

/**
 * @description 获取专辑内容
 * @param id 歌手id
 */
export const getAlbumMusic = ({id}: {id: number|string}): AxiosPromise => {
    const params = {
        timestamp: new Date().getTime(),
        id,
    };

    return axios.request({
        url: '/album',
        method: 'get',
        params
    })
}