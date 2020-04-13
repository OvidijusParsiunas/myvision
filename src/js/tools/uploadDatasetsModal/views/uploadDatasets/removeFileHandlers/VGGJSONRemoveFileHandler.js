import RemoveFileHandlerBuilder from './builders/removeFileHandlerGenericBuilder';
import datasetObjectManager from '../datasetObjectManagers/VGGJSONDatasetObjectManager';
import validateFormat from '../formatValidators/VGGJSONValidator';

const removeFileHandler = RemoveFileHandlerBuilder
  .buildRemoveFileHandlerForOneAnnotationFileStrategy(datasetObjectManager, validateFormat);

export default removeFileHandler;
