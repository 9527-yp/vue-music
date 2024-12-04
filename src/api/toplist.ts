import axios from '@/utils/request.js'
import type { AxiosPromise } from 'axios';

/**
 * @description 获取所有榜单
 */
export const toplist = (): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
  };

  return axios.request({
    url: '/toplist',
    method: 'get',
    params
  });
};