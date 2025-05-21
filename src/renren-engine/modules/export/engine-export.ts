/**
 * @description renren-engine 引擎导出模块 负责提供对源代码文件的导出/下载功能
 * @author FluffyChi-Xng
 */
import zip from 'jszip';
import { saveAs } from 'file-saver';
import {$util} from "@/componsables/utils";


/**
 * @description 生成项目文件包
 * @param sourceCodes
 * @param projectName
 */
function generateProjectFiles(sourceCodes: WorkerSpaceInterface.IFileTree[] | undefined, projectName: string): Promise<Blob> {
  return new Promise<Blob>(async (resolve, reject) => {
    try {
      await $util.renren.isEmpty(sourceCodes, () => {
        if (Array.isArray(sourceCodes) && sourceCodes.length > 0) {
          const fileZip = new zip();
          // create project file folder
          let projectContainer: zip | null = fileZip.folder(projectName);
          // add source code file under the project file folder
          projectContainer = generateFile(sourceCodes, projectContainer);
          if (projectContainer) {
            projectContainer.generateAsync({
              type: 'blob'
            })
              .then(function (content) {
                resolve(content as Blob);
            });
          }
        }
      });
    } catch (e) {
      console.error('生成项目文件失败', e);
      reject('生成项目文件失败');
    }
  });
}


/**
 * @description 生成文件(夹)
 * @param codes
 * @param folder
 */
function generateFile(codes: WorkerSpaceInterface.IFileTree[], folder: zip | null): zip | null {
  if (Array.isArray(codes) && codes.length > 0) {
    codes.forEach(item => {
      if (Array.isArray(item.children) && item.children.length > 0) {
        return generateFile(item.children, folder);
      }
      // 检查是否为另一层文件夹
      if (item.label.icon !== 'folder') {
        folder?.file(item.label.name, item.label.data);
      } else {
        // create folder under the parent folder
        folder?.folder(item.label.name);
      }
    });
    return folder;
  } else {
    return folder;
  }
}


/**
 * @description 导出(保存)文件
 * @param sourceCodes
 * @param name
 */
export function saveFile(sourceCodes: WorkerSpaceInterface.IFileTree[] | undefined, name: string): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      let file: Blob = await generateProjectFiles(sourceCodes, name);
      saveAs(file, `${name}.zip`);
      resolve('success');
    } catch (e) {
      console.error('保存文件失败', e);
      reject('保存文件失败');
    }
  });
}
