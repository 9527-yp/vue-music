import axios from '@/utils/request.js'
import type { AxiosPromise } from 'axios';

/**
 * @description 二维码登录 获取key
 */
export const qrcodeKey = (): AxiosPromise => {
    const params = {
      timestamp: new Date().getTime(),
    };
  
    return axios.request({
      url: '/login/qr/key',
      method: 'get',
      params
    });
};

type qrcodeImgSrcParmas = {
    key: String,
    qrimg: Boolean
}

/**
 * @description 二维码登录 获取二维码图片
 * @param { Object} param 
 * @param { Object} param.eky 二维码登录的key
 * @param { Object} param.qrimg 生成二维码base64链接
 */
export const qrcodeImg = ({key, qrimg}: qrcodeImgSrcParmas ): AxiosPromise => {
    const params = {
      timestamp: new Date().getTime(),
      key,
      qrimg
    };
  
    return axios.request({
      url: '/login/qr/create',
      method: 'get',
      params
    });
};

/**
 * @description 二维码登录 检查登录状态
 * @param { Object} param 
 * @param { Object} param.eky 二维码登录的key
 */
export const qrcodeCheck = ({key}: {key: String}): AxiosPromise => {
    const params = {
      timestamp: new Date().getTime(),
      key
    };
  
    return axios.request({
      url: '/login/qr/check',
      method: 'get',
      params
    });
};