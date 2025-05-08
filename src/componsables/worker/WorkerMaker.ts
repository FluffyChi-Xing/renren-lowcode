/**
 * @description 创建 web worker 线程工具类
 * @author FluffyChi-Xing
 */


/**
 * @description Web Worker 线程创建工具类
 */
export class WorkerMaker {


  private readonly path: string = '';

  private worker: Worker | null = null;


  constructor(path?: string) {
    if (path) {
      this.path = path;
    }
  }


  create(): WorkerMaker {
    this.worker = new Worker(this.path);
    return this;
  }


  poetMessage<T>(message: T, transfer: Transferable[]): void {
    if (this.worker) {
      this.worker.postMessage(message, transfer);
    }
  }


  postMessage<T>(message: T, options?: StructuredSerializeOptions): void {
    if (this.worker) {
      this.worker.postMessage(message, options);
    }
  }


  terminate(): void {
    if (this.worker) {
      this.worker.terminate();
    }
  }



  on(): MessageEvent | void {
    if (this.worker) {
      this.worker.onmessage = (event) => {
        return event;
      }
    }
  }
}
