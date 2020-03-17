import { removeFile } from './datasetObjectManager';

function removeFileHandler(fileName, tableName) {
  if (tableName === 'annotations') {
    removeFile(fileName, 'annotationFiles');
  }
}

export { removeFileHandler as default };
