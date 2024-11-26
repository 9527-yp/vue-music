import axios from '@/utils/request.js'
import type { AxiosPromise } from 'axios';

/**
 * @description 电台详情
 * @param { Object } params
 * @param { number } params.id - 电台节目id
 */
export const djDetail = ({id}: {id: number}): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    id
  };

  return axios.request({
    url: '/dj/program/detail',
    method: 'get',
    params
  });
};

type Item = {
    id: number|string,
    limit: number,
    offset: number
}
/**
 * @description 获取评论
 * @param id id
 */
export const getComment = ({id, limit, offset}: Item): AxiosPromise => {
    const params = {
        timestamp: new Date().getTime(),
        id,
        limit,
        offset
    };

    return axios.request({
        url: '/comment/dj',
        method: 'get',
        params
    })
}

/**
 * @description 电台更多节目
 * @param { Object } params
 * @param { number } params.rid - 电台节目id
 */
export const program = ({rid}: {rid: number}): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    rid
  };

  return axios.request({
    url: '/dj/program',
    method: 'get',
    params
  });
};

/**
 * @description 电台-订阅-关注
 * @param { Object } params
 * @param { number } params.rid - 电台节目id
 * @param { number } params.t - t: 1 关注 0 取消关注
 */
export const subDj = ({rid, t}: {rid: number, t: number}): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    rid,
    t
  };

  return axios.request({
    url: '/dj/sub',
    method: 'get',
    params
  });
};

/**
 * @description 电台-订阅-关注
 * @param { Object } params
 * @param { number } params.type - 0: 歌曲

      1: mv

      2: 歌单

      3: 专辑

      4: 电台节目

      5: 视频

      6: 动态

      7: 电台
 * @param { number } params.t - t: 1 点赞 0 取消点赞
 * @param { number } params.id - 资源 id
 */

type LikeItem = {
  type: number,
  t: number,
  id: number
}
export const resourceLike = ({id, t, type}: LikeItem): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    id,
    t,
    type
  };

  return axios.request({
    url: '/resource/like',
    method: 'get',
    params
  });
};