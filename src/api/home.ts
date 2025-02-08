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

/**
 * @description 获取热门推荐 - 推荐歌单
 * @param { Object } params
 * @param { number } params.limit - 偏移量(默认为30)
 */
export const recommendSongList = ({ limit } : {limit: number}): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    limit
  };

  return axios.request({
    url: '/personalized',
    method: 'get',
    params
  });
};

/**
 * @description 获取个性化推荐
 * @param { Object } params
 */
export const recommendResource = (): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
  };

  return axios.request({
    url: '/recommend/resource',
    method: 'get',
    params
  });
};

/**
 * @description 获取推荐电台
 * @param { Object } params
 */
export const recommendDjprogram = (): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
  };

  return axios.request({
    url: '/personalized/djprogram',
    method: 'get',
    params
  });
};

/**
 * @description 获取新碟上架
 * @param { Object } params
 */
export const albumNewest = (): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
  };

  return axios.request({
    url: '/album/newest',
    method: 'get',
    params
  });
};

/**
 * @description 获取所有榜单
 */
export const topList = (): AxiosPromise => {
  const params = { timestamp: new Date().getTime() };

  return axios.request({
    url: '/toplist',
    method: 'get',
    params
  });
};

/**
 * @description 获取歌单详情
 * @param { Object } params
 * @param { number } params.id - 歌单id
 * @param { number } [params.s] - 歌单最近收藏者(默认为8)
 */
export const playlistDetail = ({
  id,
  s
}: {
  id: number;
  s?: number;
}): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    id,
    s
  };

  return axios.request({
    url: '/playlist/detail',
    method: 'get',
    params
  });
};


/**
 * @description 获取节目分类
 */
export const djCateList = (): AxiosPromise => {
  const params = { timestamp: new Date().getTime() };

  return axios.request({
    url: '/dj/catelist',
    method: 'get',
    params
  });
};

/**
 * @description 获取节目推荐
 */
export const recommend = (): AxiosPromise => {
  const params = { timestamp: new Date().getTime() };

  return axios.request({
    url: '/program/recommend',
    method: 'get',
    params
  });
};


/**
 * @description 获取节目-排行榜
 */
export const ranking = ({limit, offset}: {limit: number, offset: number}): AxiosPromise => {
  const params = { 
    timestamp: new Date().getTime(),
    limit,
    offset
  };

  return axios.request({
    url: '/dj/program/toplist',
    method: 'get',
    params
  });
};


/**
 * @description 获取电台-分类推荐
 */
export const recommendType = ({type}: {type: number}): AxiosPromise => {
  const params = { 
    timestamp: new Date().getTime(),
    type,
  };

  return axios.request({
    url: '/dj/recommend/type',
    method: 'get',
    params
  });
};


/**
 * @description 获取电台-二级页面-最热
 */
export const radiolist = ({
  cateId,
  limit,
  offset
}: {
  cateId: string,
  limit: number,
  offset: number
}): AxiosPromise => {
  const params = { 
    timestamp: new Date().getTime(),
    cateId,
    limit,
    offset
  };

  return axios.request({
    url: '/dj/radio/hot',
    method: 'get',
    params
  });
};