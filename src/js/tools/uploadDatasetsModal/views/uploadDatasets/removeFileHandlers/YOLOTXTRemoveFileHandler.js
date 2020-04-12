import RemoveFileHandlerFactory from './RemoveFileHandlerInclClassesBuilder';
import datasetObjectManager from '../datasetObjectManagers/YOLOTXTDatasetObjectManager';
import validateFormat from '../formatValidators/YOLOTXTValidator';

const removeFileHandler = RemoveFileHandlerFactory.createRemoveFileHandlerInclClasses(
  datasetObjectManager, validateFormat,
);

export default removeFileHandler;
