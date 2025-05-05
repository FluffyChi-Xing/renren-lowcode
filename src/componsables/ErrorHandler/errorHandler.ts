/**
 * @description 统一异常处理
 * TODO: 等待集成相关的 日志库
 * @author FluffyChi-Xing
 */


/**
 * @description 控制台异常处理
 */
(
  function consoleErrorHandler(): Promise<any> {
    return new Promise<any>((reject) => {
      window.onerror = (message, source, lineno, colno, error) => {
        console.log(message, source, lineno, colno, error);
        reject(error);
      }
    });
  }
)();
