import RemoveFileHandlerBuilder from './builders/removeFileHandlerGenericBuilder';
import datasetObjectManager from '../datasetObjectManagers/VOCXMLDatasetObjectManager';
import validateFormat from '../formatValidators/VOCXMLValidator';

const removeFileHandler = RemoveFileHandlerBuilder
  .buildRemoveFileHandlerForMultipleAnnotationFilesStrategy(datasetObjectManager, validateFormat);

export default removeFileHandler;
