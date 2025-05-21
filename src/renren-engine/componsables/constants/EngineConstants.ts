/**
 * @description 引擎常量 模块
 * @author FluffyChi-Xing
 */
// import * as process from "process";


// export const IN_TEST: boolean = process.env.NODE_ENV === 'test';

export const MOCK_SAFARI_TOP: string = 'mockSafariTop';

export const MOCK_TOP: string = 'mockTop';

/**
 * @description mock 全局对象
 */
export const MOCK_GLOBAL_THIS: string = 'mockGlobalThis';

export const ENGINE_VERSION: string = '0.0.1-beta';

export const fileSuffix2languageMap: Map<string, string> = new Map<string, string>(
  [
    ['html', 'html'],
    ['css', 'css'],
    ['js', 'javascript'],
    ['ts', 'typescript'],
    ['json', 'json'],
    ['vue', 'html'],
    ['md', 'markdown'],
    ['tsx', 'typescript'],
    ['jsx', 'javascript'],
    ['scss', 'scss'],
    ['less', 'less'],
    ['styl', 'stylus'],
    ['ts', 'typescript'],
  ]
);
