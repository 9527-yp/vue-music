
/**
 * @description 获取值的原始类型字符串
 * @param song 歌曲数据
 * @returns 
 */

export function toRawType(song: unknown) {
    const _toString = Object.prototype.toString;
    return _toString.call(song).slice(8, -1);
}