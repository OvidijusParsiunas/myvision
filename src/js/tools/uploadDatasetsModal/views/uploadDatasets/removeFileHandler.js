import { removeAnnotationFile } from './datasetObjectManager';

function removeFile(fileName, tableName) {
  if (tableName === 'annotations') {
    removeAnnotationFile(fileName);
  }
}

export { removeFile as default };
