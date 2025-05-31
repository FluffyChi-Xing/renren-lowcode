/**
 * @description 重构入料模块
 * @author FluffyChi-Xing
 */



export interface IImport {

  materialRegister(path: RenrenInterface.KeyValueIndexType<string, string>[]): Promise<string>;

  runExternalCode(code: string): Promise<string>;
}



class ImportModule implements IImport {
  materialRegister(path: RenrenInterface.KeyValueIndexType<string, string>[]): Promise<string> {
    return Promise.resolve("");
  }

  runExternalCode(code: string): Promise<string> {
    return Promise.resolve("");
  }



}


export default ImportModule;
