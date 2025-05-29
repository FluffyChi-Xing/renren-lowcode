/**
 * @description 重构导出模块
 * @author FluffyChi-Xing
 */
import zip from 'jszip';
import {saveAs} from "file-saver";




export interface IExport {

  generateProjectFiles(code: WorkerSpaceInterface.IFileTree[] | undefined, name: string): Promise<Blob>;

  generateFile(code: WorkerSpaceInterface.IFileTree[], folder: zip | null): zip | null;

  saveFile(code: WorkerSpaceInterface.IFileTree[] | undefined, name: string): Promise<string>;
}



class ExportModule implements IExport {

  // 生成文件
  generateFile(code: WorkerSpaceInterface.IFileTree[], folder: zip | null): zip | null {
    if (Array.isArray(code) && code.length > 0) {
      code.forEach(item => {
        if (Array.isArray(item.children) && item.children.length > 0) {
          const subFolder = folder?.folder(item.label.name);
          if (subFolder) {
            return this.generateFile(item.children, subFolder);
          }
        }
        if (item.label.name !== 'folder') {
          folder?.file(item.label.name, item.label.data);
        } else {
          folder?.folder(item.label.name);
        }
      });
      return folder;
    }
    return folder;
  }

  // 生成项目文件夹
  generateProjectFiles(code: WorkerSpaceInterface.IFileTree[] | undefined, name: string): Promise<Blob> {
    return new Promise<Blob>((resolve, reject) => {
      try {
        if (Array.isArray(code) && code.length > 0) {
          const fileZip: zip = new zip();
          let project: zip | null = fileZip.folder(name);
          project = this.generateFile(code, project);
          if (project) {
            project.generateAsync({
              type: 'blob'
            })
              .then(function (content) {
                resolve(content as Blob);
              });
          }
        }
      } catch (e) {
        console.error('生成项目文件夹失败', e);
        reject('生成项目文件夹失败');
      }
    });
  }

  // 保存文件
  saveFile(code: WorkerSpaceInterface.IFileTree[] | undefined, name: string): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      try {
        let file: Blob = await this.generateProjectFiles(code, name);
        saveAs(file, `${name}.zip`);
        resolve('success');
      } catch (e) {
        console.error('保存文件失败', e);
        reject('保存文件失败');
      }
    });
  }
}




export default ExportModule;
