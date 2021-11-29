import RemoveFileHandlerBuilder from './builders/removeFileHandlerGenericBuilder.js';
import datasetObjectManager from '../datasetObjectManagers/VGGJSONDatasetObjectManager.js';
import validateFormat from '../formatValidators/VGGJSONValidator.js';

const removeFileHandler = RemoveFileHandlerBuilder
  .buildRemoveFileHandlerForOneAnnotationFileStrategy(datasetObjectManager, validateFormat);

export default removeFileHandler;
