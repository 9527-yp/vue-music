import axios from '@/utils/request.js'
import type { AxiosPromise } from 'axios';

type msgState = {
    limit: Number,
    offset: String
}
/**
 * @description 获取消息提示(需登录)
 * @param { Object } params
 * @param { number } params.uid - 用户id
 */
export const getMsgCode = ({ limit, offset }: msgState): AxiosPromise => {
    const params = {
      timestamp: new Date().getTime(),
      limit,
      offset
    };
  
    return axios.request({
      url: '/msg/private',
      method: 'get',
      params
    });
};