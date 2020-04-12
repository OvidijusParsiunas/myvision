import RemoveFileHandlerFactory from './RemoveFileHandlerGenericBuilder';
import datasetObjectManager from '../datasetObjectManagers/VGGJSONDatasetObjectManager';
import validateFormat from '../formatValidators/VGGJSONValidator';

const removeFileHandler = RemoveFileHandlerFactory.createOneAnnotationFileRemoveFileHandler(
  datasetObjectManager, validateFormat,
);

export default removeFileHandler;
