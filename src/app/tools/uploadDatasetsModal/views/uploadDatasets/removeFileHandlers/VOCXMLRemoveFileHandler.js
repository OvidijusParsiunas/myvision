import RemoveFileHandlerBuilder from './builders/removeFileHandlerGenericBuilder.js';
import datasetObjectManager from '../datasetObjectManagers/VOCXMLDatasetObjectManager.js';
import validateFormat from '../formatValidators/VOCXMLValidator.js';

const removeFileHandler = RemoveFileHandlerBuilder
  .buildRemoveFileHandlerForMultipleAnnotationFilesStrategy(datasetObjectManager, validateFormat);

export default removeFileHandler;
