import axios from '@/utils/request.js'
import type { AxiosPromise } from 'axios';


/**
 * @description 获取每日推荐歌曲
 * @param 
 */
export const recommendSong = (): AxiosPromise => {
    const params = {
        timestamp: new Date().getTime(),
    };

    return axios.request({
        url: '/recommend/songs',
        method: 'get',
        params
    })
}

/**
 * @description 每日推荐歌曲-不感兴趣
 * @param id 歌曲id
 */
export const delSongList = ({id}: {id: number|string}): AxiosPromise => {
    const params = {
        timestamp: new Date().getTime(),
        id
    };

    return axios.request({
        url: '/recommend/songs/dislike',
        method: 'get',
        params
    })
}