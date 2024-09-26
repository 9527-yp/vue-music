
// 获取数据
export function getLocalStorage(key: string):any {
    return localStorage.getItem(key)
}

// 设置数据
export function setLocalStorage(key: string, value:any) : void {
    localStorage.setItem(key, JSON.stringify(value))
}

// 删除数据
export function removeLocalStorage(key: string) : void {
    localStorage.removeItem(key)
}

// 清空所有cookie数据
export function clearAllCookie() {
    const date = new Date();
    date.setTime(date.getTime() - 10000);
    // eslint-disable-next-line
    const keys = document.cookie.match(/[^ =;]+(?=\=)/g);

    if (keys) {
        for (let i = keys.length; i--; ) {
        document.cookie =
            keys[i] + '=0; expire=' + date.toUTCString() + '; path=/';
        }
    }
}