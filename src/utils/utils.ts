

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

export function formatDateTime(timestamp : number, format: string): string {
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