
import axios from '@/utils/request.js'
import type { AxiosPromise } from 'axios';


type DynamicItem = {
    uid: string | number,
    limit: string | number,
    lasttime: string | number,

}
/**
 * @description 获取用户动态
 * @param uid 用户id
 * @param limit 返回数量 , 默认为 30
 * @param lasttime 返回数据的 lasttime ,默认-1,传入上一次返回结果的 lasttime,将会返回下一页的数据
 */
export const getDynamic = ({uid, limit, lasttime}: DynamicItem): AxiosPromise => {
    const params = {
        timestamp: new Date().getTime(),
        uid,
        limit,
        lasttime
    };

    return axios.request({
        url: '/user/event',
        method: 'get',
        params
    })
}