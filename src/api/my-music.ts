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