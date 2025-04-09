/**
 * @description 高亮代码工具模块
 * @author FluffyChi-Xing
 */
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import java from 'highlight.js/lib/languages/java';
import json from 'highlight.js/lib/languages/json';
import hljs from 'highlight.js/lib/core';


/**
 * @description 支持的语言列表
 */
const langMap = new Map<string, any>([
    ['javascript', javascript],
    ['typescript', typescript],
    ['java', java],
    ['json', json]
]);


/**
 * @description 注册需要高亮的语言
 * @param lang
 */
export function registerHighLightLang(lang: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      if (lang) {
        const language = langMap.get(lang);
        if (language) {
          hljs.registerLanguage(lang, language);
          resolve('注册成功');
        } else {
          reject('不支持的语言');
        }
      } else {
        reject('参数错误');
      }
    } catch (e) {
      console.error('高亮代码失败');
      reject('高亮代码失败');
    }
  });
}
