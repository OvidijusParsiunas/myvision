import RemoveFileHandler from './RemoveFileHandler';
import RemoveFileHandlerBuilder from './builders/RemoveFileHandlerBuilder';
import COCOJSONValidator from '../formatValidators/COCOJSONValidator';
import COCOJSONDatasetObjectManager from '../datasetObjectManagers/COCOJSONDatasetObjectManager';

const removeFileHandler = new RemoveFileHandlerBuilder()
  .withFormatValidator(new COCOJSONValidator())
  .withDatasetObjectManager(new COCOJSONDatasetObjectManager())
  .buildRemoveFileHandlerForOneAnnotationFileStrategy();

export default removeFileHandler;
