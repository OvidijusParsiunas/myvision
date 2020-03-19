import { removeFile } from './datasetObjectManagers/COCOJSONDatasetObjectManager';
import { removeRow } from './style';
import {
  ONE_ANNOTATION_FILE_ALLOWED_ERROR_MESSAGE,
  VALID_ANNOTATION_FILES_ARRAY,
  FALTY_ANNOTATION_FILES_ARRAY,
  IMAGE_FILES_ARRAY,
} from './sharedConsts/consts';

function removeFileHandler(fileName, tableName, errorMessage) {
  let dataObjectArrayName;
  if (tableName === 'annotations') {
    if (errorMessage === ONE_ANNOTATION_FILE_ALLOWED_ERROR_MESSAGE) {
      dataObjectArrayName = FALTY_ANNOTATION_FILES_ARRAY;
    } else {
      dataObjectArrayName = VALID_ANNOTATION_FILES_ARRAY;
    }
  } else if (tableName === 'images') {
    dataObjectArrayName = IMAGE_FILES_ARRAY;
  }
  removeFile(fileName, dataObjectArrayName);
  removeRow(fileName, tableName);
}

export { removeFileHandler as default };
