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

/**
 * @description 获取账号信息
 * @param { Object} param 
 * @param { Object} param.eky 二维码登录的key
 */
export const accountInfo = (): AxiosPromise => {
    const params = {timestamp: new Date().getTime(),};
  
    return axios.request({
      url: '/user/account',
      method: 'get',
      params
    });
};

/**
 * @description 获取用户信息
 * @param { Object } params
 * @param { number } params.uid - 用户id
 */
export const userInfo = ({ uid }: { uid: number }): AxiosPromise => {
    const data = {
      timestamp: new Date().getTime(),
      uid
    };
  
    return axios.request({
      url: '/user/detail',
      method: 'post',
      data
    });
};

/**
 * @description 退出登录
 */
export const logout = (): AxiosPromise => {
    const params = { timestamp: new Date().getTime() };
  
    return axios.request({
      url: '/logout',
      method: 'get',
      params
    });
  };