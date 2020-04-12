import RemoveFileHandlerFactory from './RemoveFileHandlerGenericBuilder';
import datasetObjectManager from '../datasetObjectManagers/CSVDatasetObjectManager';
import validateFormat from '../formatValidators/CSVValidator';

const removeFileHandler = RemoveFileHandlerFactory.createOneAnnotationFileRemoveFileHandler(
  datasetObjectManager, validateFormat,
);

export default removeFileHandler;
