import RemoveFileHandlerFactory from './RemoveFileHandlerGenericBuilder';
import datasetObjectManager from '../datasetObjectManagers/VOCXMLDatasetObjectManager';
import validateFormat from '../formatValidators/VOCXMLValidator';

const removeFileHandler = RemoveFileHandlerFactory.createMultipleAnnotationFileRemoveFileHandler(
  datasetObjectManager, validateFormat,
);

export default removeFileHandler;
