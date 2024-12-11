import axios from '@/utils/request.js'
import type { AxiosPromise } from 'axios';

/**
 * @description 歌单分类
 * @param { Object } params
 */
export const catlist = (): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime()
  };

  return axios.request({
    url: '/playlist/catlist',
    method: 'get',
    params
  });
};


type paramItem = {
    order: string,
    cat: string,
    limit: number,
    offset: number
}
/**
 * @description 歌单列表
 * @param { Object } params
 * @param params.cat 歌单分类
 * @param params.limit 分页-数量
 * @param params.offset 分页-页数
 */
export const songList = ({order, cat, limit, offset}: paramItem): AxiosPromise => {
    const params = {
      timestamp: new Date().getTime(),
      order,
      cat,
      limit,
      offset
    };
  
    return axios.request({
      url: '/top/playlist',
      method: 'get',
      params
    });
  };