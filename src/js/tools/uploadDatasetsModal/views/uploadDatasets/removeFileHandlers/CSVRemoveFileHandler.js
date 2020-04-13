import RemoveFileHandlerBuilder from './builders/removeFileHandlerGenericBuilder';
import datasetObjectManager from '../datasetObjectManagers/CSVDatasetObjectManager';
import validateFormat from '../formatValidators/CSVValidator';

const removeFileHandler = RemoveFileHandlerBuilder
  .buildRemoveFileHandlerForOneAnnotationFileStrategy(datasetObjectManager, validateFormat);

export default removeFileHandler;
