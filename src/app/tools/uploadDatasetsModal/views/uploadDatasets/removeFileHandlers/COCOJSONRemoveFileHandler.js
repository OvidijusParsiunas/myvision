import RemoveFileHandlerBuilder from './builders/removeFileHandlerGenericBuilder.js';
import datasetObjectManager from '../datasetObjectManagers/COCOJSONDatasetObjectManager.js';
import validateFormat from '../formatValidators/COCOJSONValidator.js';

const removeFileHandler = RemoveFileHandlerBuilder
  .buildRemoveFileHandlerForOneAnnotationFileStrategy(datasetObjectManager, validateFormat);

export default removeFileHandler;
