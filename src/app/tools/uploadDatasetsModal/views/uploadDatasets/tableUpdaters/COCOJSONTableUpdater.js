import TableUpdaterHandlerBuilder from './builders/tableUpdaterGenericBuilder.js';
import datasetObjectManager from '../datasetObjectManagers/COCOJSONDatasetObjectManager.js';
import validateFormat from '../formatValidators/COCOJSONValidator.js';

const tableUpdater = TableUpdaterHandlerBuilder
  .buildTableUpdaterForOneAnnotationFileStrategy(datasetObjectManager, validateFormat);

export default tableUpdater;
