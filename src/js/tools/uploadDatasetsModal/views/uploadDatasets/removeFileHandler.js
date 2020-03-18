import { removeFile } from './datasetObjectManagers/COCOJSONDatasetObjectManager';
import { removeRow } from './style';
import { ONE_ANNOTATION_FILE_ALLOWED_ERROR_MESSAGE } from './sharedConsts/consts';

function removeFileHandler(fileName, tableName, errorMessage) {
  if (tableName === 'annotations') {
    let datasetObjectAnnotationsTableName = 'validAnnotationFiles';
    if (errorMessage) {
      datasetObjectAnnotationsTableName = errorMessage === ONE_ANNOTATION_FILE_ALLOWED_ERROR_MESSAGE ? 'validAnnotationFiles' : 'faltyAnnotationFiles';
    }
    removeFile(fileName, datasetObjectAnnotationsTableName);
    removeRow(fileName, tableName);
  }
}

export { removeFileHandler as default };
