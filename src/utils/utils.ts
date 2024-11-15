

// 大数字转换
export function getBigNumberTransform(value : number | string) :number | string{

    // 转为数字类型
    const newValue = Number(value);
    if(isNaN(newValue)){
        return value;
    }

    // 小于10000
    if(newValue < 10000) {
        return value.toString();
    }

    // 小于1亿
    if(newValue < 100000000) {
        return (newValue/10000).toFixed(1) + '万';
    }

    // 小于10亿
    if(newValue < 1000000000) {
        return (newValue/10000).toFixed(0) + '万';
    }

    // 大于10亿
    if(newValue > 1000000000) {
        return (newValue/10000).toFixed(0) + '万';
    }

    return value
}

// 获取星期
export function getCurrentWeekday() {
    const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    const today = new Date();
    const weekday = today.getDay();
    return weekdays[weekday];
}

// 获取当前时间日期
export function getDate() {
    var currentDate = new Date();   // 创建一个Date对象，表示当前时间
    var day = currentDate.getDate();   // 获取当前日期，即几号
    return day
}

/**
 * @description 时间戳转视频时长
 * @param timestamp 时间戳
 * @returns 
 */
export function timeStampToDuration(timestamp: number) {
    const hours = Math.floor(timestamp / 3600);
    timestamp %= 3600;
    const minutes = Math.floor(timestamp / 60);
    const remainingSeconds = Math.floor(timestamp % 60);
  
    let result = '';
    if (hours > 0) {
        result += `${hours.toString().padStart(2, '0')}:`;
    }
    result += minutes.toString().padStart(2, '0') + ':' + remainingSeconds.toString().padStart(2, '0')
  
    return result;
}

/**
 * @description 时间戳转 日期格式
 * @param timestamp  时间戳
 * @param format 日期格式 YYYY-MM-DD
 */
export function formatDateTime(timestamp : number, format: string): string {
    if(!timestamp){
        return '';
    }
    // 创建一个 Date 对象
    const date = new Date(timestamp * 1000);
  
    // 定义格式化的映射 
    const formatMap: Record<string, string | number> = { 
        'Y': date.getFullYear().toString(),
        'M': String(date.getMonth() + 1).padStart(2, '0'), // 月份从0开始，需要+1  
        'D': String(date.getDate()).padStart(2, '0'),  
        'H': String(date.getHours()).padStart(2, '0'),  
        'm': String(date.getMinutes()).padStart(2, '0'),  
        's': String(date.getSeconds()).padStart(2, '0'),  
        'q': Math.floor((date.getMonth() + 3) / 3).toString(), // 季度  
        'S': String(date.getMilliseconds()).padStart(3, '0') // 毫秒  
    };  
  
    // 使用正则表达式替换格式字符串中的占位符  
    let formattedDate = format;  
    for (const key in formatMap) {  
        if (formatMap.hasOwnProperty(key)) {  
            const regex = new RegExp(key, 'g');  
            formattedDate = formattedDate.replace(regex, formatMap[key] as string);  
        }  
    }
    return formattedDate;
}


/**
 * @description 时间戳转换日期时间
 * @param timestamp 时间戳
 */
export function formatDate(timestamp: string | number): string {
    const arrTimestamp = timestamp.toString().split('');

    // 缺少补0
    for(let i = 0; i < 13 ; i++) {
        if(!arrTimestamp[i]){
            arrTimestamp[i] = '0'
        }
    }

    timestamp = Number(arrTimestamp.join(''))

    // 当前时间
    const now = new Date().getTime()

    // 当前时间 - 传入时间
    const diffValue = now - timestamp


    if(diffValue < 0) {
        return '不久前'
    }

    // 一分钟
    const minute = 1000 * 60;

    // 判断较当前时间差多少分钟
    const minC = diffValue / minute

    const timeDate = new Date(timestamp)

    // 计算上一年的年份  时间戳
    const lastYear = new Date().getFullYear() - 1;
    const lastYearEndDate = new Date(lastYear, 11, 31, 23, 59, 59).getTime(); 

    // 小于上一年12月31号23:59:59 
    if(timestamp < lastYearEndDate) {
        return `${timeDate.getFullYear()}年${timeDate.getMonth() + 1}月${timeDate.getDate()}日`
    }

    // 三天前 
    // 获取三天前23:59:59的时间戳  
    const threeTimestamp = getTimestamp(3);
    if(timestamp < threeTimestamp) {
        return `${timeDate.getMonth() + 1}月${timeDate.getDate()}日 ${convertTime(timeDate.getHours())}:${convertTime(timeDate.getMinutes())}`
    }
        
    // 获取前天23:59:59的时间戳  
    const beforeTimestamp = getTimestamp(2);
    if(timestamp < beforeTimestamp) {
        return `前天 ${convertTime(timeDate.getHours())}:${convertTime(timeDate.getMinutes())}`
    }

    // 获取昨天23:59:59的时间戳  
    const yesterdayTimestamp = getTimestamp(1);

    if(timestamp < yesterdayTimestamp) {
        return `昨天 ${convertTime(timeDate.getHours())}:${convertTime(timeDate.getMinutes())}`
    }

    // 超过1小时
    if(minC >= 60) {
        return `${convertTime(timeDate.getHours())}:${convertTime(timeDate.getMinutes())}`
    }

    // 超过1分钟
    if(minC >= 1) {
        return `${minC.toFixed(0)} 分钟前`
    }

    // 小于一分钟
    return '刚刚'
}

// 时间缺少补0
function convertTime(value: string | number) : string | number {
    if(Number(value) >= 10) {
        return value
    }else {
        return '0' + value
    }
}

function getTimestamp(value : number = 0) : number {
    // 创建一个新的Date对象，表示当前时间  
    const now = new Date();  
    
    // 设置时间为几天前（当前日期减2）  
    now.setDate(now.getDate() - value);  
        
    // 设置时间为当天的23:59:59  
    now.setHours(23, 59, 59, 0); // 第四个参数是毫秒，设置为0  
        
    // 获取23:59:59的时间戳  
    const timestamp = now.getTime();  
        
    return timestamp;  
}


export function getAgeFragment(timestamp: string | number): undefined | string {

    // 创建一个时间对象
    const date = new Date(timestamp);
    // 获取年份
    const year = date.getFullYear();

    if (year < 1980) {  
        return "70后";  
    }else if (year >= 1980 && year < 1990) {  
        return "80后";  
    } else if (year >= 1990 && year < 1995) {  
        return "90后";  
    } else if (year >= 1995 && year < 2000) {  
        return "95后";  
    } else if (year >= 2000) {  
        return "00后";
    }
}