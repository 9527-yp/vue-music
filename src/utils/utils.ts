

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

// 获取当前时间
export function getDate() {
    var currentDate = new Date();   // 创建一个Date对象，表示当前时间
    var day = currentDate.getDate();   // 获取当前日期，即几号
    return day
}