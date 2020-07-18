import TableUpdaterHandlerBuilder from './builders/tableUpdaterGenericBuilder';
import datasetObjectManager from '../datasetObjectManagers/COCOJSONDatasetObjectManager';
import validateFormat from '../formatValidators/COCOJSONValidator';

const tableUpdater = TableUpdaterHandlerBuilder
  .buildTableUpdaterForOneAnnotationFileStrategy(datasetObjectManager, validateFormat);

export default tableUpdater;
