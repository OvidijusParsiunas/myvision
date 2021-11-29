import RemoveFileHandlerBuilder from './builders/removeFileHandlerGenericBuilder.js';
import datasetObjectManager from '../datasetObjectManagers/CSVDatasetObjectManager.js';
import validateFormat from '../formatValidators/CSVValidator.js';

const removeFileHandler = RemoveFileHandlerBuilder
  .buildRemoveFileHandlerForOneAnnotationFileStrategy(datasetObjectManager, validateFormat);

export default removeFileHandler;
