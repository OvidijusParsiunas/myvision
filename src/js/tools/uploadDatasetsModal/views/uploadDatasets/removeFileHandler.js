import { removeFile } from './datasetObjectManagers/COCOJSONDatasetObjectManager';

function removeFileHandler(fileName, tableName) {
  if (tableName === 'annotations') {
    removeFile(fileName, 'annotationFiles');
  }
}

export { removeFileHandler as default };
