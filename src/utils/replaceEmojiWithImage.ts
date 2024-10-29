
import { expressionList } from '@/components/comment/cmmtipt/emo.ts'

export function replaceEmojiWithImage(inputString: string) {  
    // 定义一个替换函数，将匹配到的内容替换成 <img> 标签  
    function replaceMatch(match: string) {  
        // 获取匹配到的内容（即 [] 内的内容）  
        const emoji = match.slice(1, -1); // 去掉前后的 []  
        // 假设你有一个 base URL 来存储你的图片  
        const baseUrl = 'http://s1.music.126.net/style/web2/emt/emoji_';  

        const expressionItem = expressionList.find((item: {title: string, num: number}) => item.title === emoji)
        // 假设图片文件名和 [] 内的内容一致（这里可能需要根据实际情况调整）
        if(expressionItem){
            const imgSrc = `${baseUrl}${expressionItem.num}.png`; // 拼接成完整的图片 URL  
            // 返回 <img> 标签  
            return `<img style="display: inline-block; vertical-align: middle;" src="${imgSrc}" alt="${emoji}" />`;  
        }
        return match
    }  
  
    // 使用正则表达式匹配 [] 内的内容  
    const regex = /\[([^\[\]]+)\]/g;  
    // 使用 replace 方法和替换函数进行替换  
    const resultString = inputString.replace(regex, replaceMatch);  
  
    return resultString;  
}

// export function replaceEmojiWithImage(inputString: string) {  
//     // 定义图片的基础URL  
//     const baseUrl = 'http://s1.music.126.net/style/web2/emt/emoji_';  
  
//     // 正则表达式，优先匹配[[]]以避免与[]冲突  
//     // 使用非贪婪匹配来确保我们不会错误地匹配到嵌套的[[]]  
//     const doubleBracketRegex = /\[\[([^\[\]]*)\]\]/g;  
//     // 匹配[]内的内容  
//     const singleBracketRegex = /\[([^\[\]]+)\]/g;  
  
//     // 替换函数，用于处理[]内的内容  
//     function replaceSingleBracket(match: string, emoji: string) {  
//         const expressionItem = expressionList.find((item: {title: string, num: number}) => item.title === emoji)
//         // 拼接成完整的图片URL  
//         const imgSrc = `${baseUrl}${expressionItem?.num}.png`;  
//         // 返回<img>标签  
//         return `<img src="${imgSrc}" alt="${emoji}" />`;  
//     }  
  
//     // 第一步：先处理[[]]包裹的内容（但在这个例子中，我们不进行替换，只是确保它们不被下面的替换影响到）  
//     // 我们可以通过先替换一个唯一标识符来“占位”，稍后再将其替换回原样（如果需要的话）  
//     // 但在这个特定例子中，我们直接忽略它们  
//     let tempString = inputString;  
  
//     // 第二步：处理[]包裹的内容  
//     tempString = tempString.replace(singleBracketRegex, replaceSingleBracket);  
  
//     // 注意：在这个例子中，我们没有对[[]]进行任何替换，  
//     // 所以如果原始字符串中有[[]]，它们将保持不变地出现在最终结果中。  
  
//     return tempString;  
// }  