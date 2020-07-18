import RemoveFileHandlerBuilder from './builders/removeFileHandlerInclClassesBuilder';
import datasetObjectManager from '../datasetObjectManagers/YOLOTXTDatasetObjectManager';
import validateFormat from '../formatValidators/YOLOTXTValidator';

const removeFileHandler = RemoveFileHandlerBuilder
  .buildRemoveFileHandlerInclClasses(datasetObjectManager, validateFormat);

export default removeFileHandler;
