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