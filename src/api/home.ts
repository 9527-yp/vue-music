import axios from '@/utils/request.js'
import type { AxiosPromise } from 'axios';

/**
 * @description 获取轮播图
 * @param { Object } params
 * @param { number } params.type - 资源类型(0为pc)
 */
export const bannerImgUrl = (): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    type: 0
  };

  return axios.request({
    url: '/banner',
    method: 'get',
    params
  });
};