import TableUpdaterHandlerBuilder from './builders/tableUpdaterGenericBuilder.js';
import datasetObjectManager from '../datasetObjectManagers/CSVDatasetObjectManager.js';
import validateFormat from '../formatValidators/CSVValidator.js';

const tableUpdater = TableUpdaterHandlerBuilder
  .buildTableUpdaterForOneAnnotationFileStrategy(datasetObjectManager, validateFormat);

export default tableUpdater;
