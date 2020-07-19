import TableUpdaterHandlerBuilder from './builders/tableUpdaterGenericBuilder';
import datasetObjectManager from '../datasetObjectManagers/CSVDatasetObjectManager';
import validateFormat from '../formatValidators/CSVValidator';

const tableUpdater = TableUpdaterHandlerBuilder
  .buildTableUpdaterForOneAnnotationFileStrategy(datasetObjectManager, validateFormat);

export default tableUpdater;
