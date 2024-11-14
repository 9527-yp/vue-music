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