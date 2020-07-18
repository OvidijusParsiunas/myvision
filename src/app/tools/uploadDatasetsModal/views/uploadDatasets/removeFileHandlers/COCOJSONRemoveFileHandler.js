import RemoveFileHandlerBuilder from './builders/removeFileHandlerGenericBuilder';
import datasetObjectManager from '../datasetObjectManagers/COCOJSONDatasetObjectManager';
import validateFormat from '../formatValidators/COCOJSONValidator';

const removeFileHandler = RemoveFileHandlerBuilder
  .buildRemoveFileHandlerForOneAnnotationFileStrategy(datasetObjectManager, validateFormat);

export default removeFileHandler;
