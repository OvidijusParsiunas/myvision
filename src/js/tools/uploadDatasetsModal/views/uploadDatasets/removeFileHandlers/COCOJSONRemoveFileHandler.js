import RemoveFileHandlerFactory from './RemoveFileHandlerGenericBuilder';
import datasetObjectManager from '../datasetObjectManagers/COCOJSONDatasetObjectManager';
import validateFormat from '../formatValidators/COCOJSONValidator';

const removeFileHandler = RemoveFileHandlerFactory.createOneAnnotationFileRemoveFileHandler(
  datasetObjectManager, validateFormat,
);

export default removeFileHandler;
