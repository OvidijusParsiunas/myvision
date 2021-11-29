import TableUpdaterHandlerBuilder from './builders/tableUpdaterGenericBuilder.js';
import datasetObjectManager from '../datasetObjectManagers/VGGJSONDatasetObjectManager.js';
import validateFormat from '../formatValidators/VGGJSONValidator.js';

const tableUpdater = TableUpdaterHandlerBuilder
  .buildTableUpdaterForOneAnnotationFileStrategy(datasetObjectManager, validateFormat);

export default tableUpdater;
