import TableUpdaterHandlerBuilder from './builders/tableUpdaterGenericBuilder';
import datasetObjectManager from '../datasetObjectManagers/VGGJSONDatasetObjectManager';
import validateFormat from '../formatValidators/VGGJSONValidator';

const tableUpdater = TableUpdaterHandlerBuilder
  .buildTableUpdaterForOneAnnotationFileStrategy(datasetObjectManager, validateFormat);

export default tableUpdater;
