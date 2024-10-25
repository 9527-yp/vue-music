import axios from '@/utils/request.js'
import type { AxiosPromise } from 'axios';


type PlayUrlItem = {
    id: string | number,
    br: string | number
}
/**
 * @description 获取播放URL
 * @param id 歌曲id
 * @param br 码率,默认设置了 999000 即最大码率,如果要 320k 则可设置为 320000,其他类推
 */
export const getSongPlayUrl = ({id, br}: PlayUrlItem): AxiosPromise => {
    const params = {
        timestamp: new Date().getTime(),
        id,
        br
    };

    return axios.request({
        url: '/song/url',
        method: 'get',
        params
    })
}

/**
 * 
 * @returns 获取用户歌单，收藏，mv, dj 数量
 */
export const getSongSubcount = (): AxiosPromise => {
    const params = {
        timestamp: new Date().getTime(),
    };

    return axios.request({
        url: '/user/subcount',
        method: 'get',
        params
    })
}

/**
 * @description 获取用户歌单列表
 * @param param.uid  用户id
 * @returns 
 */
export const getSongList = ({uid}: {uid :string | number}): AxiosPromise => {
    const params = {
        timestamp: new Date().getTime(),
        uid
    };

    return axios.request({
        url: '/user/playlist',
        method: 'get',
        params
    })
}

/**
 * @description 获取歌单详情
 * @param param.id  歌单id
 * @returns 
 */
export const getSongSheetInfo = ({id}: {id :string | number}): AxiosPromise => {
    const params = {
        timestamp: new Date().getTime(),
        id
    };

    return axios.request({
        url: '/playlist/detail',
        method: 'get',
        params
    })
}