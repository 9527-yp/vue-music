import axios from '@/utils/request.js'
import type { AxiosPromise } from 'axios';


type RecordsItem = {
    uid: string | number,
    type: string | number
}
/**
 * @description 获取用户播放记录
 * @param uid 用户ID
 * @param type type=1 时只返回 weekData, type=0 时返回 allData
 */
export const getRecords = ({uid, type}: RecordsItem): AxiosPromise => {
    const params = {
        timestamp: new Date().getTime(),
        uid,
        type
    };

    return axios.request({
        url: '/user/record',
        method: 'get',
        params
    })
}

/**
 * @description 获取歌曲详情
 * @param ids 歌曲id，多个用，隔开
 */
export const getSongDetail = ({ids}: {ids: string | number}): AxiosPromise => {
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

/**
 * @description 获取用户电台
 * @param uid 用户id
 */
export const myAudio = ({uid}: {uid: string | number}): AxiosPromise => {
    const params = {
        timestamp: new Date().getTime(),
        uid
    };

    return axios.request({
        url: '/user/audio',
        method: 'get',
        params
    })
}