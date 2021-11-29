import RemoveFileHandlerBuilder from './builders/removeFileHandlerInclClassesBuilder.js';
import datasetObjectManager from '../datasetObjectManagers/YOLOTXTDatasetObjectManager.js';
import validateFormat from '../formatValidators/YOLOTXTValidator.js';

const removeFileHandler = RemoveFileHandlerBuilder
  .buildRemoveFileHandlerInclClasses(datasetObjectManager, validateFormat);

export default removeFileHandler;
