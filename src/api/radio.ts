import axios from '@/utils/request.js'
import type { AxiosPromise } from 'axios';


/**
 * @description 获取电台详情
 * @param id 电台id
 */
export const djDetail = ({rid}: {rid: number|string}): AxiosPromise => {
    const params = {
        timestamp: new Date().getTime(),
        rid
    };

    return axios.request({
        url: '/dj/detail',
        method: 'get',
        params
    })
}

/**
 * @description 获取电台列表
 * @param id 电台id
 * @param asc 排序方式,默认为 false (新 => 老 ) 设置 true 可改为 老 => 新
 */
export const djList = ({rid, asc}: {rid: number|string, asc: boolean}): AxiosPromise => {
    const params = {
        timestamp: new Date().getTime(),
        rid,
        asc
    };

    return axios.request({
        url: '/dj/program',
        method: 'get',
        params
    })
}


/**
 * @description 获取推荐电台
 */
export const djRecommend = (): AxiosPromise => {
    const params = {
        timestamp: new Date().getTime(),
    };

    return axios.request({
        url: '/dj/recommend',
        method: 'get',
        params
    })
}