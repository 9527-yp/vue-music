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

/**
 * @description 歌单歌曲添加 、 删除
 * @param param.pid  歌单id
 * @param param.tracks  歌曲 id,可多个,用逗号隔开
 * @param param.op  从歌单增加单曲为 add, 删除为 del
 * @returns 
 */
type SongAddorDel = {
    op: string,
    pid: number | string,
    tracks: string | number
}
export const songAddorDel = ({op, pid, tracks }:SongAddorDel): AxiosPromise => {
    const params = {
        timestamp: new Date().getTime(),
        op,
        pid,
        tracks
    };

    return axios.request({
        url: '/playlist/tracks',
        method: 'get',
        params
    })
}

/**
 * @description 新建歌单
 * @param param.name  歌单名称
 * @returns 
 */

export const addSongList = ({ name }:{name: string}): AxiosPromise => {
    const params = {
        timestamp: new Date().getTime(),
        name
    };

    return axios.request({
        url: '/playlist/create',
        method: 'get',
        params
    })
}

/**
 * @description 删除歌单
 * @param param.id  歌单id
 * @returns 
 */

export const deleteSongList = ({ id }:{id: string | number}): AxiosPromise => {
    const params = {
        timestamp: new Date().getTime(),
        id
    };

    return axios.request({
        url: '/playlist/delete',
        method: 'get',
        params
    })
}

/**
 * @description 获取我的歌手数据
 * @param param.offset  偏移数量 , 用于分页 , 如 :( 评论页数 -1)*25, 其中 25 为 limit 的值
 * @returns 
 */

export const mySinger = ({ offset, limit }:{offset: string | number, limit: string | number}): AxiosPromise => {
    const params = {
        timestamp: new Date().getTime(),
        offset,
        limit
    };

    return axios.request({
        url: '/artist/sublist',
        method: 'get',
        params
    })
}